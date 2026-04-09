"use server";

import { redirect } from "next/navigation";
import { generateQuizOrFlashcard } from "@/lib/ai";

// ── File text extraction ──────────────────────────────────────────────────────

async function extractPdfText(buffer: Buffer): Promise<string> {
  // pdf2json is CJS — dynamic import avoids ESM issues at the module boundary.
  const PDFParserLib = await import("pdf2json");
  const PDFParser =
    // Handle both default and named export shapes
    (PDFParserLib as unknown as { default: unknown }).default ??
    PDFParserLib.default;

  return new Promise<string>((resolve, reject) => {
    // @ts-expect-error – pdf2json types are minimal
    const parser = new PDFParser(null, 1);

    // @ts-expect-error – pdf2json types are minimal
    parser.on("pdfParser_dataReady", (data: unknown) => {
      try {
        const pdfData = data as {
          Pages?: Array<{
            Texts?: Array<{ R?: Array<{ T?: string }> }>;
          }>;
        };
        const text =
          pdfData.Pages?.map((page) =>
            page.Texts?.map((t) =>
              decodeURIComponent(t.R?.[0]?.T ?? ""),
            ).join(" "),
          ).join("\n") ?? "";
        resolve(text.trim());
      } catch (err) {
        reject(err);
      }
    });

    // @ts-expect-error – pdf2json types are minimal
    parser.on("pdfParser_dataError", (err: unknown) => reject(err));

    // @ts-expect-error – pdf2json types are minimal
    parser.parseBuffer(buffer);
  });
}

async function extractDocxText(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value.trim();
}

async function extractFileText(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf")) return extractPdfText(buffer);
  if (name.endsWith(".docx")) return extractDocxText(buffer);
  if (name.endsWith(".txt")) return buffer.toString("utf-8").trim();

  throw new Error(
    `Unsupported file type "${file.name}". Please upload a PDF, DOCX, or TXT file.`,
  );
}

// ── Server Action ─────────────────────────────────────────────────────────────

export async function generateContent(formData: FormData) {
  const mode = (formData.get("mode") as "quiz" | "flashcard") ?? "quiz";
  const textNotes = (formData.get("notes") as string) ?? "";
  const file = formData.get("file") as File | null;

  let notes = textNotes.trim();

  if (file && file.size > 0) {
    const extracted = await extractFileText(file);
    // Prepend file text so it takes priority; keep manual notes as supplement
    notes = extracted + (notes ? "\n\n" + notes : "");
  }

  if (!notes) {
    throw new Error("Please paste some notes or upload a file first.");
  }

  const data = await generateQuizOrFlashcard(notes, mode, 10);

  // Encode the array as a URL-safe string — size is ~3-5 KB for 10 items, well
  // within browser URL limits (Chrome: 2 MB).
  const encoded = encodeURIComponent(JSON.stringify(data));

  redirect(`/${mode === "quiz" ? "quiz" : "flashcard"}?data=${encoded}`);
}

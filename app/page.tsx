"use client";

import { useState, useTransition, useRef } from "react";
import { ArrowRight, Upload, Sparkles, FileText, AlignLeft, Loader2, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateContent } from "@/app/actions";

type InputTab = "upload" | "type";

export default function Home() {
  const [mode, setMode] = useState<"quiz" | "flashcard">("quiz");
  const [inputTab, setInputTab] = useState<InputTab>("upload");
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setError(null);
    }
  }

  function clearFile() {
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (inputTab === "upload" && !fileName) {
      setError("Please upload a PDF, DOCX, or TXT file.");
      return;
    }
    if (inputTab === "type" && !notes.trim()) {
      setError("Please paste or type your notes.");
      return;
    }

    const formData = new FormData(formRef.current!);
    // If typing mode, clear any stale file entry so the server ignores it
    if (inputTab === "type") formData.delete("file");

    startTransition(async () => {
      try {
        await generateContent(formData);
      } catch (err: unknown) {
        // redirect() throws internally — only surface real errors
        const msg = err instanceof Error ? err.message : "Something went wrong.";
        if (!msg.includes("NEXT_REDIRECT")) setError(msg);
      }
    });
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar className="hidden md:flex" />

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold tracking-tight mb-3">
            Quizzy <span className="text-primary italic">AI</span>
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            Learn any topic with fun
          </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit}>
          {/* hidden inputs for mode */}
          <input type="hidden" name="mode" value={mode} />

          <Card className="w-full max-w-2xl p-8 rounded-[40px] border-2 shadow-none bg-card relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* ── Left: Input Panel ───────────────────────────────────── */}
              <div className="flex flex-col gap-3">
                {/* Tab switcher */}
                <div className="flex gap-1 bg-muted/50 p-1 rounded-2xl border self-start w-full">
                  <button
                    type="button"
                    onClick={() => { setInputTab("upload"); setError(null); }}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all",
                      inputTab === "upload"
                        ? "bg-background shadow-sm text-primary"
                        : "text-muted-foreground hover:bg-background/50",
                    )}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => { setInputTab("type"); setError(null); }}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all",
                      inputTab === "type"
                        ? "bg-background shadow-sm text-primary"
                        : "text-muted-foreground hover:bg-background/50",
                    )}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                    Paste
                  </button>
                </div>

                {/* Upload panel — same visual as original drop zone */}
                {inputTab === "upload" && (
                  <div
                    className="flex-1 aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-8 bg-muted/50 group cursor-pointer hover:border-primary/50 transition-colors relative"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      name="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {fileName ? (
                      <>
                        <div className="w-16 h-16 rounded-2xl bg-background border shadow-sm flex items-center justify-center mb-4">
                          <FileText className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-center font-semibold text-sm leading-snug break-all px-2">
                          {fileName}
                        </p>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); clearFile(); }}
                          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-background border flex items-center justify-center hover:bg-destructive/10 transition-colors"
                        >
                          <X className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-2xl bg-background border shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="w-8 h-8 text-primary/60" />
                        </div>
                        <p className="text-center font-medium leading-relaxed">
                          Drop your <br /> notes here
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">PDF · DOCX · TXT</p>
                      </>
                    )}
                  </div>
                )}

                {/* Textarea panel */}
                {inputTab === "type" && (
                  <div className="flex-1 flex flex-col">
                    <textarea
                      name="notes"
                      value={notes}
                      onChange={(e) => { setNotes(e.target.value); setError(null); }}
                      placeholder="Paste or type your notes here…"
                      className="flex-1 min-h-[220px] w-full rounded-3xl border-2 bg-muted/50 p-6 text-sm font-medium leading-relaxed resize-none focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/50"
                    />
                  </div>
                )}
              </div>

              {/* ── Right: Controls ─────────────────────────────────────── */}
              <div className="flex flex-col justify-between py-2">
                <div className="space-y-6">
                  {/* Mode selector */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={mode === "quiz" ? "default" : "outline"}
                      onClick={() => setMode("quiz")}
                      className="h-14 rounded-2xl text-lg font-bold shadow-none"
                    >
                      Quiz
                    </Button>
                    <Button
                      type="button"
                      variant={mode === "flashcard" ? "default" : "outline"}
                      onClick={() => setMode("flashcard")}
                      className="h-14 rounded-2xl text-lg font-bold shadow-none"
                    >
                      Flash card
                    </Button>
                  </div>

                  {/* Info */}
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    Generates <span className="font-bold text-foreground">10</span>{" "}
                    {mode === "quiz" ? "multiple-choice questions" : "flashcards"} from your notes using AI.
                  </p>
                </div>

                <div className="flex flex-col gap-3 mt-8">
                  {/* Error */}
                  {error && (
                    <p className="text-xs text-destructive font-medium text-center px-2">
                      {error}
                    </p>
                  )}

                  {/* Generate button */}
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-16 rounded-2xl text-xl font-bold shadow-none group"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-3 w-6 h-6 animate-spin" />
                        Generating…
                      </>
                    ) : (
                      <>
                        Generate
                        <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Sparkle badge — unchanged */}
            <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
          </Card>
        </form>
      </main>
    </div>
  );
}

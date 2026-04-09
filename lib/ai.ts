import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY?.trim(),
});

export type QuizQuestion = {
  question: string;
  options: string[]; // exactly 4: ["A. ...", "B. ...", "C. ...", "D. ..."]
  correctIndex: number; // 0-3
  explanation: string;
};

export type Flashcard = {
  front: string;
  back: string;
};

export async function generateQuizOrFlashcard(
  notes: string,
  mode: "quiz" | "flashcard",
  count: number = 10,
): Promise<QuizQuestion[] | Flashcard[]> {
  const isQuiz = mode === "quiz";

  const systemPrompt = isQuiz
    ? `You are a strict JSON quiz generator. You MUST respond with ONLY a single valid JSON object — no markdown, no code fences, no explanation, no extra text whatsoever.

The JSON object MUST have exactly one key: "items", whose value is an array of exactly ${count} objects.

Each object in "items" MUST have these exact keys:
  - "question": string — the full question text
  - "options": array of exactly 4 strings, each prefixed "A. ", "B. ", "C. ", "D. " respectively
  - "correctIndex": integer — 0, 1, 2, or 3 — the index inside "options" that is correct
  - "explanation": string — a concise explanation of why the answer is correct

RULES:
- Produce exactly ${count} items. No more, no less.
- Base every question strictly on the provided notes.
- Make questions educational, specific, and varied in difficulty.
- Never output anything outside the JSON object.`
    : `You are a strict JSON flashcard generator. You MUST respond with ONLY a single valid JSON object — no markdown, no code fences, no explanation, no extra text whatsoever.

The JSON object MUST have exactly one key: "items", whose value is an array of exactly ${count} objects.

Each object in "items" MUST have these exact keys:
  - "front": string — the concept, term, or question on the front of the card
  - "back": string — the clear, concise answer or explanation on the back of the card

RULES:
- Produce exactly ${count} items. No more, no less.
- Base every flashcard strictly on the provided notes.
- Keep fronts short and backs informative but concise.
- Never output anything outside the JSON object.`;

  const userMessage = `Generate exactly ${count} ${isQuiz ? "multiple-choice quiz questions" : "flashcards"} from the notes below.
Respond with ONLY the JSON object {"items": [...]}.

NOTES:
${notes.slice(0, 12000)}`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 4096,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  });

  const raw = response.choices[0].message.content;
  if (!raw) throw new Error("Empty response from AI model.");

  const parsed = JSON.parse(raw);

  // Accept both {items:[]} and a bare array
  const items: unknown[] = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed.items)
      ? parsed.items
      : [];

  if (items.length === 0) {
    throw new Error("AI returned an empty or invalid items array.");
  }

  return items as QuizQuestion[] | Flashcard[];
}

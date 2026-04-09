import { redirect } from "next/navigation";
import QuizClient from "./QuizClient";
import type { QuizQuestion } from "@/lib/ai";

interface QuizPageProps {
  searchParams: Promise<{ data?: string }>;
}

export default async function QuizPage({ searchParams }: QuizPageProps) {
  const { data } = await searchParams;

  if (!data) {
    redirect("/");
  }

  let questions: QuizQuestion[];
  try {
    questions = JSON.parse(decodeURIComponent(data)) as QuizQuestion[];
    if (!Array.isArray(questions) || questions.length === 0) throw new Error();
  } catch {
    redirect("/");
  }

  return <QuizClient questions={questions} rawData={data} />;
}

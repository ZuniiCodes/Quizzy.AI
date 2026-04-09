import { redirect } from "next/navigation";
import FlashcardClient from "./FlashcardClient";
import type { Flashcard } from "@/lib/ai";

interface FlashcardPageProps {
  searchParams: Promise<{ data?: string }>;
}

export default async function FlashcardPage({ searchParams }: FlashcardPageProps) {
  const { data } = await searchParams;

  if (!data) {
    redirect("/");
  }

  let cards: Flashcard[];
  try {
    cards = JSON.parse(decodeURIComponent(data)) as Flashcard[];
    if (!Array.isArray(cards) || cards.length === 0) throw new Error();
  } catch {
    redirect("/");
  }

  return <FlashcardClient cards={cards} rawData={data} />;
}

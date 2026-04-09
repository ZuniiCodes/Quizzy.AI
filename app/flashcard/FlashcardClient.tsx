"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Flashcard from "@/components/Flashcard";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Flashcard as FlashcardType } from "@/lib/ai";

interface FlashcardClientProps {
  cards: FlashcardType[];
  rawData: string;
}

export default function FlashcardClient({ cards, rawData }: FlashcardClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = cards.length;
  const current = cards[activeIndex];

  function handlePrev() {
    if (activeIndex > 0) setActiveIndex((i) => i - 1);
  }

  function handleNext() {
    if (activeIndex < total - 1) setActiveIndex((i) => i + 1);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-6 md:p-10 flex items-center justify-between max-w-4xl w-full mx-auto">
        {/* Tab dots — same visual as original */}
        <div className="flex gap-2 bg-muted/50 p-1.5 rounded-2xl border">
          {cards.map((_, tab) => (
            <button
              key={tab}
              onClick={() => setActiveIndex(tab)}
              className={cn(
                "w-10 h-10 rounded-xl font-bold transition-all",
                activeIndex === tab
                  ? "bg-background shadow-sm text-primary"
                  : "text-muted-foreground hover:bg-background/50",
              )}
            >
              {tab + 1}
            </button>
          ))}
        </div>

        <Link href={`/quiz?data=${rawData}`}>
          <Button
            variant="outline"
            className="rounded-xl font-bold px-6 shadow-none border-2"
          >
            switch quiz
            <LayoutGrid className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-12">
        <div className="flex items-center gap-12 w-full max-w-6xl justify-center overflow-hidden">
          {/* Decorative side card (left) */}
          <div className="hidden lg:block w-64 aspect-[3/4] rounded-3xl border-2 opacity-20 transform -rotate-6" />

          <Flashcard
            key={activeIndex}          // remount → reset flip state on navigation
            front={current.front}
            back={current.back}
          />

          {/* Decorative side card (right) */}
          <div className="hidden lg:block w-64 aspect-[3/4] rounded-3xl border-2 opacity-20 transform rotate-6" />
        </div>

        <p className="text-sm font-bold text-muted-foreground">
          {activeIndex + 1} / {total}
        </p>
      </main>

      <footer className="p-10 border-t bg-card/50">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="rounded-2xl border-2 px-8 font-bold shadow-none"
          >
            <ChevronLeft className="mr-2 w-5 h-5" />
            Prev
          </Button>

          <Button
            size="lg"
            onClick={handleNext}
            disabled={activeIndex === total - 1}
            className="rounded-2xl px-10 font-bold shadow-none text-lg"
          >
            Next
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
}

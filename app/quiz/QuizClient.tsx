"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Zap, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/lib/ai";

interface QuizClientProps {
  questions: QuizQuestion[];
  rawData: string; // keep full encoded string for switching to flashcard
}

export default function QuizClient({ questions, rawData }: QuizClientProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null),
  );
  const [showExplanation, setShowExplanation] = useState(false);

  const total = questions.length;
  const current = questions[currentIndex];
  const selected = selectedAnswers[currentIndex];
  const isAnswered = selected !== null;
  const progress = Math.round(((currentIndex + 1) / total) * 100);

  function handleSelect(idx: number) {
    if (isAnswered) return; // lock after first pick
    setSelectedAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = idx;
      return next;
    });
    setShowExplanation(false);
  }

  function handleNext() {
    if (currentIndex === total - 1) {
      // Go to results
      const score = selectedAnswers.filter(
        (ans, i) => ans === questions[i].correctIndex,
      ).length;
      const reviewData = encodeURIComponent(
        JSON.stringify(
          questions.map((q, i) => ({
            question: q.question,
            answer: q.options[q.correctIndex],
            correct: selectedAnswers[i] === q.correctIndex,
          })),
        ),
      );
      router.push(`/results?score=${score}&total=${total}&review=${reviewData}`);
    } else {
      setCurrentIndex((i) => i + 1);
      setShowExplanation(false);
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setShowExplanation(false);
    }
  }

  const labels = ["A", "B", "C", "D"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-6 md:p-10 flex items-center justify-between max-w-4xl w-full mx-auto">
        <div className="flex-1 max-w-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-muted-foreground">Progress</span>
            <span className="text-sm font-bold">
              {currentIndex + 1}/{total}
            </span>
          </div>
          <Progress value={progress} className="h-2 rounded-full" />
        </div>

        <Link href={`/flashcard?data=${rawData}`}>
          <Button
            variant="outline"
            className="ml-8 rounded-xl font-bold px-6 shadow-none border-2"
          >
            switch flash
            <Zap className="ml-2 w-4 h-4 fill-primary text-primary" />
          </Button>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          {/* Question card */}
          <Card className="p-12 text-center rounded-3xl border-2 shadow-none min-h-[200px] flex items-center justify-center">
            <h2 className="text-2xl font-semibold leading-relaxed">
              Q{currentIndex + 1}. {current.question}
            </h2>
          </Card>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {current.options.map((option, i) => {
              const isCorrect = i === current.correctIndex;
              const isSelected = selected === i;

              let variant: "outline" | "default" = "outline";
              let extraClass = "hover:bg-primary/5 hover:border-primary/40";

              if (isAnswered) {
                if (isCorrect) {
                  extraClass =
                    "bg-green-50 border-green-400 text-green-700 hover:bg-green-50 hover:border-green-400";
                } else if (isSelected && !isCorrect) {
                  extraClass =
                    "bg-red-50 border-red-400 text-red-700 hover:bg-red-50 hover:border-red-400";
                } else {
                  extraClass = "opacity-60";
                }
              }

              return (
                <Button
                  key={i}
                  variant={variant}
                  onClick={() => handleSelect(i)}
                  className={cn(
                    "h-20 text-lg rounded-2xl border-2 shadow-none justify-start px-8 transition-all font-medium",
                    extraClass,
                  )}
                >
                  <span className="mr-4 text-muted-foreground font-bold">
                    {labels[i]}.
                  </span>
                  {/* Strip the "A. " prefix from the option if present */}
                  {option.replace(/^[A-D]\.\s*/, "")}
                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="ml-auto w-5 h-5 text-green-500" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="ml-auto w-5 h-5 text-red-500" />
                  )}
                </Button>
              );
            })}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setShowExplanation((v) => !v)}
                className="text-sm font-bold text-primary underline underline-offset-4"
              >
                {showExplanation ? "Hide" : "Show"} explanation
              </button>
              {showExplanation && (
                <Card className="p-5 rounded-2xl border-2 shadow-none bg-primary/5">
                  <p className="text-sm font-medium leading-relaxed">
                    {current.explanation}
                  </p>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="p-10 border-t bg-card/50">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="rounded-2xl border-2 px-8 font-bold shadow-none"
          >
            <ChevronLeft className="mr-2 w-5 h-5" />
            Previous
          </Button>

          <Button
            size="lg"
            onClick={handleNext}
            disabled={!isAnswered}
            className="rounded-2xl px-10 font-bold shadow-none text-lg"
          >
            {currentIndex === total - 1 ? "Finish" : "Next"}
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
}

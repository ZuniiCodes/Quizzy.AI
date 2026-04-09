"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuizQuestionProps {
  question: string;
  options: string[];
  currentIndex: number;
}

export default function QuizQuestion({ question, options, currentIndex }: QuizQuestionProps) {
  const labels = ["A", "B", "C", "D"];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <Card className="p-12 text-center rounded-3xl border-2 shadow-none min-h-[250px] flex items-center justify-center">
        <h2 className="text-2xl font-semibold leading-relaxed">
          Q. {question}
        </h2>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, i) => (
          <Button
            key={i}
            variant="outline"
            className="h-20 text-lg rounded-2xl border-2 shadow-none justify-start px-8 hover:bg-primary/5 hover:border-primary/40 transition-all font-medium"
          >
            <span className="mr-4 text-muted-foreground font-bold">{labels[i]}.</span>
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}

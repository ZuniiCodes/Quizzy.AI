"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

interface FlashcardProps {
  front: string;
  back: string;
}

export default function Flashcard({ front, back }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="perspective-1000 w-full max-w-md aspect-[3/4] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front */}
        <Card className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-12 text-center rounded-3xl border-2 shadow-none">
          <h3 className="text-2xl font-semibold mb-4 leading-normal">{front}</h3>
          <p className="text-sm text-muted-foreground mt-auto font-medium">Tap to flip</p>
        </Card>

        {/* Back */}
        <Card className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-12 text-center rounded-3xl border-2 shadow-none bg-primary/5">
          <p className="text-xl font-medium leading-relaxed">{back}</p>
          <p className="text-sm text-muted-foreground mt-auto font-medium">Tap to flip</p>
        </Card>
      </div>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}

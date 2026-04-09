import Link from "next/link";
import { Button } from "@/components/ui/button";
import ScoreCircle from "@/components/ScoreCircle";
import { Home, CheckCircle2, XCircle, RefreshCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { redirect } from "next/navigation";

interface ReviewItem {
  question: string;
  answer: string;
  correct: boolean;
}

interface ResultsPageProps {
  searchParams: Promise<{
    score?: string;
    total?: string;
    review?: string;
  }>;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const { score, total, review } = await searchParams;

  if (!score || !total) redirect("/");

  const scoreNum = parseInt(score, 10);
  const totalNum = parseInt(total, 10);

  let reviews: ReviewItem[] = [];
  if (review) {
    try {
      reviews = JSON.parse(decodeURIComponent(review)) as ReviewItem[];
    } catch {
      // show results without review on parse error
    }
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <header className="max-w-4xl mx-auto mb-12">
        <Link href="/">
          <Button variant="outline" className="rounded-xl font-bold px-6 shadow-none border-2">
            <Home className="mr-2 w-4 h-4" />
            Home
          </Button>
        </Link>
      </header>

      <main className="max-w-2xl mx-auto flex flex-col items-center">
        <div className="mb-16">
          <ScoreCircle score={scoreNum} total={totalNum} />
        </div>

        {reviews.length > 0 && (
          <div className="w-full space-y-6 mb-16">
            {reviews.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                {item.correct ? (
                  <CheckCircle2 className="w-8 h-8 text-green-500 shrink-0 mt-1" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-500 shrink-0 mt-1" />
                )}
                <div className="space-y-3 flex-1">
                  <p className="text-xl font-semibold leading-relaxed">{item.question}</p>
                  <Card className="p-4 bg-primary/5 border-none rounded-2xl">
                    <p className="text-sm font-medium text-muted-foreground italic">
                      {item.correct ? "Correct! " : "Correct answer: "}
                      {item.answer}
                    </p>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        )}

        <Link href="/">
          <Button
            size="lg"
            className="rounded-2xl px-12 h-16 text-xl font-bold shadow-none"
          >
            <RefreshCcw className="mr-3 w-6 h-6" />
            Try Again
          </Button>
        </Link>
      </main>
    </div>
  );
}

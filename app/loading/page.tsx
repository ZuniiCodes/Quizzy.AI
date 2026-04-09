import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Generating magic...</h2>
          <div className="flex gap-2 justify-center">
            <Skeleton className="w-3 h-3 rounded-full animate-bounce" />
            <Skeleton className="w-3 h-3 rounded-full animate-bounce [animation-delay:0.2s]" />
            <Skeleton className="w-3 h-3 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>
      </div>
    </div>
  );
}

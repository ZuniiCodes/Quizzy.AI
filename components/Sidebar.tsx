"use client";

import { History, UserCircle, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const historyItems = [
    "Capital of France",
    "History of Rome",
    "Quantum Physics",
    "Cooking Basics",
  ];

  return (
    <aside className={cn("w-64 border-r bg-card flex flex-col h-full", className)}>
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
             <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
               <div className="bg-primary/60 rounded-[1px]"></div>
               <div className="bg-primary/20 rounded-[1px]"></div>
               <div className="bg-primary/20 rounded-[1px]"></div>
               <div className="bg-primary/60 rounded-[1px]"></div>
             </div>
           </div>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
          <History className="w-4 h-4" /> History
        </h3>
        <div className="space-y-2">
          {historyItems.map((item, i) => (
            <div
              key={i}
              className="p-3 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer text-sm font-medium"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t mt-auto">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-border">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <UserCircle className="w-6 h-6 text-primary/60" />
          </div>
          <span className="font-medium text-sm">Account</span>
        </div>
      </div>
    </aside>
  );
}

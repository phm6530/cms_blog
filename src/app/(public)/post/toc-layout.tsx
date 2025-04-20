"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";

export default function Toclayout({ children }: { children: ReactNode }) {
  const [tocView, setTocView] = useState<boolean>(true);

  return (
    <>
      <button onClick={() => setTocView((prev) => !prev)}>test</button>

      <main className="flex w-full gap-6">
        <div className="max-w-[800px] mx-auto">{children}</div>

        {/* 목차 영역 */}
        <div
          id="toc-target"
          className={cn(
            "border-l flex-1 transition-all duration-300 ease-in-out transform",
            tocView
              ? " opacity-100 translate-x-0 pointer-events-auto"
              : " opacity-0 translate-x-4 pointer-events-none"
          )}
        >
          <div className="sticky top-5 shadow p-4">목차 영역</div>
        </div>
      </main>
    </>
  );
}

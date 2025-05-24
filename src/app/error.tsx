"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CircleSlash, RotateCcw } from "lucide-react";

export default function Error({
  reset,
}: {
  error?: Error;
  reset?: () => void;
}) {
  const [isPending, setIsPending] = useState(false); // 로딩 상태 관리

  const handleReset = async () => {
    setIsPending(true);
    try {
      // 일부로 1초 걸어버리기
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (!reset) return;
      reset();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <h1 className="text-destructive flex gap-4 items-center">
        <CircleSlash className="w-10 h-10" /> Not Found Page
      </h1>

      <h3>요청이 잘못되었거나 서버에 문제가 있습니다.</h3>

      <div className={"flex mt-7 w-full max-w-[300px] gap-3 justify-center"}>
        <Button variant={"outline"} size={"lg"}>
          <Link href={"/"}>Home</Link>
        </Button>

        <Button
          size={"lg"}
          variant={"outline"}
          onClick={handleReset}
          disabled={isPending}
        >
          {isPending ? (
            "요청 중..."
          ) : (
            <>
              <RotateCcw /> 재 요청 하기
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

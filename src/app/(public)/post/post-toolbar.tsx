"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Eye, Minus, Plus, Share2, TypeIcon } from "lucide-react";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";

export default function PostToolbar({
  categoryName,
  groupName,
}: {
  categoryName: string;
  groupName: string;
}) {
  // 가변 폰트 기본값 설정
  const [size, setSize] = useState(1);

  const applyTextSize = (scale: number) => {
    const contentElement = document.querySelector(
      ".ProseMirror"
    ) as HTMLDivElement;
    if (contentElement) {
      contentElement.style.setProperty("--font-scale", scale.toString());
    }
  };

  useLayoutEffect(() => {
    // 초기 CSS 변수 설정
    const contentElement = document.querySelector(
      ".ProseMirror"
    ) as HTMLDivElement;
    if (contentElement) {
      // 변수이용해서 css 값전달
      contentElement.style.setProperty("--font-scale", "1");
    }
  }, []);

  const incrementTextSize = () => {
    const newSize = Math.min(size + 0.1, 1.4);
    setSize(newSize);
    applyTextSize(newSize);
  };

  const decrementTextSize = () => {
    const newSize = Math.max(size - 0.1, 0.8);
    setSize(newSize);
    applyTextSize(newSize);
  };

  return (
    <div className="border-y py-4 mb-10 divide-x flex">
      <Button asChild className="text-xs rounded-none" variant={"ghost"}>
        <Link href={`/category/${categoryName}/${groupName}`}>
          <ChevronLeft /> 목록으로
        </Link>
      </Button>

      {/* 공유 */}
      <Button asChild className="text-xs rounded-none" variant={"ghost"}>
        <Link href={`/`}>
          <Share2 />
        </Link>
      </Button>

      {/* TOC Table on off */}
      <Button asChild className="text-xs rounded-none" variant={"ghost"}>
        <Link href={"/"}>
          Table of Contents <Eye />
        </Link>
      </Button>

      {/* 글자크기*/}
      <div className="flex gap-2">
        <TypeIcon />
        {/* 증가 */}
        <Button
          className="text-xs"
          variant={"outline"}
          size={"sm"}
          onClick={incrementTextSize}
        >
          <Plus />
        </Button>

        {/* 감소 */}
        <Button
          className="text-xs "
          variant={"outline"}
          size={"sm"}
          onClick={decrementTextSize}
        >
          <Minus />
        </Button>
      </div>
    </div>
  );
}

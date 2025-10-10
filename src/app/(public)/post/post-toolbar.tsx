"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus, RotateCw, TypeIcon } from "lucide-react";
import { useState } from "react";

export default function PostToolbar() {
  // 가변 폰트 기본값 설정
  const [size, setSize] = useState(1);

  const applyTextSize = (scale: number) => {
    document.documentElement.style.setProperty(
      "--font-scale",
      scale.toString()
    );
  };

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
    <div className=" divide-x flex">
      <Button
        asChild
        className="text-xs rounded-none"
        variant={"ghost"}
      ></Button>
      {/* 글자크기*/}
      <div className="flex gap-2 items-center ">
        <TypeIcon size={15} />
        <span className="text-xs  inline-block min-w-[35px]">
          {(size * 100).toFixed(0)}%
        </span>

        <Button
          className="text-xs size-5 border text-muted-foreground"
          variant={"ghost"}
          size={"sm"}
          onClick={() => {
            setSize(1);
            applyTextSize(1);
          }}
        >
          <RotateCw size={8} />
        </Button>

        {/* 증가 */}
        <Button
          className="text-xs size-5 border text-muted-foreground"
          variant={"ghost"}
          size={"sm"}
          onClick={incrementTextSize}
        >
          <Plus size={7} />
        </Button>
        {/* 감소 */}
        <Button
          className="text-xs size-5 border text-muted-foreground"
          variant={"ghost"}
          size={"sm"}
          onClick={decrementTextSize}
        >
          <Minus size={7} />
        </Button>
      </div>
    </div>
  );
}

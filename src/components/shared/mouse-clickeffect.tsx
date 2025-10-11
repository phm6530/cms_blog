"use client";

import { ReactNode, useState, useCallback, useRef } from "react";

export default function MouseClickEffect({
  children,
}: {
  children: ReactNode;
}) {
  const [clicks, setClicks] = useState<{ x: number; y: number; id: number }[]>(
    []
  );
  const timeoutsRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // 최대 동시 이펙트 수 제한 (메모리 보호)
  const MAX_CLICKS = 10;

  const handleClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();
    const ignoredTags = ["input", "textarea", "button", "select", "a"];

    if (
      ignoredTags.includes(tagName) ||
      target.closest("button, a, input, textarea, select")
    ) {
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const id = Date.now();

    setClicks((prev) => {
      // 오래된 클릭 제거 (메모리 누수 방지)
      const newClicks = prev.length >= MAX_CLICKS ? prev.slice(1) : prev;
      return [...newClicks, { x, y, id }];
    });

    // 이전 타임아웃 정리
    const timeout = setTimeout(() => {
      setClicks((prev) => prev.filter((click) => click.id !== id));
      timeoutsRef.current.delete(id);
    }, 600);

    timeoutsRef.current.set(id, timeout);
  }, []);

  // 컴포넌트 언마운트 시 타임아웃 정리
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="relative"
      style={{ isolation: "isolate" }} // 성능을 위한 레이어 분리
    >
      {clicks.map((click) => (
        <span
          key={click.id}
          className="fixed w-10 h-10 bg-primary/20 rounded-full opacity-50 animate-ping pointer-events-none z-50"
          style={{
            top: click.y - 20,
            left: click.x - 20,
            willChange: "transform, opacity", // GPU 가속
          }}
        />
      ))}
      {children}
    </div>
  );
}

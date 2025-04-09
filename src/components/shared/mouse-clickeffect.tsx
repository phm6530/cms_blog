"use client";

import { ReactNode, useState } from "react";

export default function MouseClickEffect({
  children,
}: {
  children: ReactNode;
}) {
  const [clicks, setClicks] = useState<{ x: number; y: number; id: number }[]>(
    []
  );

  const handleClick = (e: React.MouseEvent) => {
    const tagName = (e.target as HTMLElement).tagName.toLowerCase();

    const ignoredTags = ["input", "textarea", "button", "select"];

    if (ignoredTags.includes(tagName)) return;

    const x = e.clientX;
    const y = e.clientY;
    const id = Date.now();

    setClicks((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setClicks((prev) => prev.filter((click) => click.id !== id));
    }, 600);
  };

  return (
    <div onClick={handleClick} className="relative">
      {clicks.map((click) => (
        <span
          key={click.id}
          className="fixed w-10 h-10 bg-primary rounded-full opacity-50 animate-ping pointer-events-none z-50"
          style={{
            top: click.y - 20,
            left: click.x - 20,
          }}
        />
      ))}
      {children}
    </div>
  );
}

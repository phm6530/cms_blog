"use client";
import { createPortal } from "react-dom";
import { useLayoutEffect, useState } from "react";

export default function TocPortal({ children }: { children: React.ReactNode }) {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = document.getElementById("toc-target");
    if (el) setTarget(el);
  }, []);

  if (!target) return null;

  return createPortal(children, target);
}

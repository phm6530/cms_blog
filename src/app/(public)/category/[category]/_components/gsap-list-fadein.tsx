"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React from "react";

export default function GsapListFadeIn({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.from(ref.current, {
        delay: 0.7,
        autoAlpha: 0,
        opacity: 0,
      });
    },
    { scope: ref, dependencies: [ref.current] }
  );

  return (
    <div className="invisible" ref={ref}>
      {children}
    </div>
  );
}

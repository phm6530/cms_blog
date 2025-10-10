"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function TitleBlurAnimation({
  title,
  mutedText,
}: {
  title: string;
  mutedText: string;
}) {
  const textRefs = useRef<HTMLSpanElement[]>([]);
  const mutedTextRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { autoAlpha: 0 } });

      tl.from(textRefs.current, {
        y: 50,
        autoAlpha: 0,
        stagger: 0.02,
        filter: "blur(14px)",
        ease: "back.out",
        duration: 0.7,
      });

      tl.from(
        mutedTextRef.current,
        {
          y: 20,
          autoAlpha: 0,
          stagger: 0.04,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=.2"
      );
    },
    { dependencies: [] }
  );

  return (
    <div className="flex flex-col items-start pt-16">
      <div className="text-5xl">
        {Array.from(title).map((ch, idx) => (
          <span
            key={`${ch}:${idx}`}
            className="inline-block invisible"
            ref={(el) => {
              textRefs.current[idx] = el!;
            }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </div>

      <p className="text-muted-foreground my-5 invisible" ref={mutedTextRef}>
        {mutedText}
      </p>
    </div>
  );
}

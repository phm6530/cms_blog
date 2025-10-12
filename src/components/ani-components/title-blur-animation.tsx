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

  console.log("???"); // 여기 왜안뜸?
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { autoAlpha: 0 } });

      tl.from(textRefs.current, {
        x: 50,
        autoAlpha: 0,
        stagger: 0.02,
        filter: "blur(14px)",
        ease: "power3.out",
        duration: 0.9,
      });

      tl.from(
        mutedTextRef.current,
        {
          x: 20,
          autoAlpha: 0,
          stagger: 0.02,
          filter: "blur(14px)",
          duration: 0.6,
          ease: "power3.out",
        },
        "-=.7"
      );
    },
    { dependencies: [] }
  );

  return (
    <div className="flex flex-col items-start pt-16">
      <div className="md:text-5xl text-[clamp(1.2rem,9vw,3rem)]">
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

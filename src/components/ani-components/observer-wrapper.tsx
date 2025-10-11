"use client";
import { useEffect, useRef, memo } from "react";
import gsap from "gsap";

function ObserverGSAPWrapperBase({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        gsap.from(ref.current, {
          y: 20,
          autoAlpha: 0,
          opacity: 1,
          filter: "blur(10px)",
          ease: "power2.out",
          duration: 0.6,
          delay,
        });
        observer.disconnect();
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className="invisible">
      {children}
    </div>
  );
}

export const ObserverGSAPWrapper = memo(ObserverGSAPWrapperBase);

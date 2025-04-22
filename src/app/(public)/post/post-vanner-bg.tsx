"use client";
import { cn } from "@/lib/utils";
import { ENV } from "@/type/constants";
import { ReactNode, useRef } from "react";

export default function PostVanner({
  hasThumbnail,
  thumbnail_url,
  children,
}: {
  hasThumbnail: boolean;
  thumbnail_url: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={ref}
      className={cn(
        "relative flex overflow-hidden animate-wiggle",
        hasThumbnail ? "p-5 md:p-10 min-h-[450px] text-white" : "pt-10"
      )}
      style={
        hasThumbnail
          ? {
              backgroundImage: `
              linear-gradient(to top, rgba(20, 20, 20, 1), rgba(0, 0, 0, 0.1)),
              url(${ENV.IMAGE_URL_PUBLIC}${thumbnail_url})
            `,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : undefined
      }
    >
      {children}
    </section>
  );
}

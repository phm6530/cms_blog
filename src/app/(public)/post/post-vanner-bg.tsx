"use client";
import { cn } from "@/lib/utils";
import { unsplashS3Mapping } from "@/util/unsplash-s3-mapping";
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
              linear-gradient(to top, rgba(20, 20, 20, .9), rgba(20, 20, 20, .6), rgba(0, 0, 0, 0.1)),
              url(${unsplashS3Mapping(thumbnail_url)})
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

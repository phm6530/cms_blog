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
        `relative flex  overflow-hidden
        after:absolute after:inset-0 after:animate-opacity after:bg-cover  after:bg-center after:bg-no-repeat after:content-['']
        after:bg-gradient-to-b 
        `,
        hasThumbnail
          ? " from:via-black/50 after:to-black/80 p-5 md:p-10 min-h-[500px] text-white"
          : "pt-10"
      )}
    >
      {hasThumbnail && (
        <div
          className="absolute top-0 left-0 z-0 w-full h-full animate-vanner"
          style={{
            backgroundImage: `url(${unsplashS3Mapping(thumbnail_url)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            animation: `
            bgScaleInit 5s cubic-bezier(0, 0.75, 0, 0.62) forwards, 
            bgScaleLoop 10s 5s ease  infinite alternate,
            opacity .5s ease-out forwards`,
          }}
        />
      )}
      {children}
    </section>
  );
}

"use client";
import { cn } from "@/lib/utils";
import { unsplashS3Mapping } from "@/util/unsplash-s3-mapping";
import { ReactNode, useRef } from "react";

export default function PostVanner({
  thumbnail_url,
  children,
}: {
  thumbnail_url: string | null;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={ref}
      className={cn(
        `relative flex  overflow-hidden  md:h-auto  max-w-[1100px]   w-full mx-auto 
        after:absolute after:inset-0 after:animate-opacity after:bg-cover  after:bg-center md:rounded-2xl after:bg-no-repeat after:content-['']
        after:bg-gradient-to-b 
        `,
        !!thumbnail_url
          ? " from:via-black/50 after:to-black/80 p-5 md:p-10 md:px-15 aspect-[16/17]  md:aspect-[16/9] text-white"
          : "pt-10"
      )}
    >
      {thumbnail_url && (
        <div
          className="absolute top-0 left-0  z-0 w-full h-full animate-vanner "
          style={{
            backgroundImage: `url(${unsplashS3Mapping(thumbnail_url)})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
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

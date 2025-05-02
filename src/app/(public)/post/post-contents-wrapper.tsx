"use client";
import { ReactNode, useState } from "react";
import PostToolbar from "./post-toolbar";
import { cn } from "@/lib/utils";
import { ChevronRight, List } from "lucide-react";
import useMediaQuery from "@/hook/useMediaQuery";
import { BREAKPOINT } from "@/components/layout/nav-list";

export default function PostContentCotainer({
  categoryName,
  groupName,
  children,
}: {
  categoryName: string;
  groupName: string;

  children: ReactNode;
}) {
  const isDesktop = useMediaQuery(`(min-width:${BREAKPOINT.MD}px)`);
  const [isVisible, setIsVisible] = useState(isDesktop);

  const toggleTocHandler = () => {
    if (isVisible) {
      setIsVisible(false);
    } else {
      setTimeout(() => setIsVisible(true), 10); // 살짝 delay 줘야 transition이 먹음
    }
  };

  return (
    <section>
      {/* toc */}
      <div
        className={cn(
          "pt-14 fixed -right-[250px] transition-all z-30 top-0 h-screen  w-[90%] border-l bg-muted/40 max-w-[250px]! ",
          isVisible && "right-0"
        )}
        style={{
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          transition: "right 0.75s cubic-bezier(0.77, 0.2, 0.05, 1)",
        }}
      >
        {/* toc Contents */}
        <div id="toc-target" className={cn("")} />

        {/* btn- on off */}
        <span
          className={cn(
            "bottom-1/10 top-auto fixed text-white  active:bg-indigo-950!  bg-background/70 -left-[55px] flex justify-center items-center cursor-pointer z-0! size-13.5 rounded-none border",
            "dark:bg-indigo-500! "
          )}
          onClick={toggleTocHandler}
          style={{
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          {isVisible ? (
            <ChevronRight className="animate-wiggle" />
          ) : (
            <List className="animate-wiggle" />
          )}
        </span>
      </div>

      <div className="flex-1 max-w-[900px] mx-auto">
        {/* ---- post Tool bar ----- */}
        <PostToolbar
          categoryName={categoryName}
          groupName={groupName}
          toggleTocHandler={toggleTocHandler}
          tocView={isVisible}
        />
        {/* ------ Table of Contents ------ */}
        <div>{children}</div>
      </div>
    </section>
  );
}

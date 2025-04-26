"use client";
import { ReactNode, useEffect, useState } from "react";
import PostToolbar from "./post-toolbar";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";
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

  /** 모바일에서는 view 값 off를 초기값으로  */
  useEffect(() => {
    setIsVisible(isDesktop);
  }, [isDesktop]);

  const toggleTocHandler = () => {
    if (isVisible) {
      setIsVisible(false);
    } else {
      setTimeout(() => setIsVisible(true), 10); // 살짝 delay 줘야 transition이 먹음
    }
  };

  return (
    <section
      className={cn(
        "md:w-[calc(100%-250px)]  mx-auto gap-5  pr-0 relative ",
        isVisible && "w-full! max-w-none md:pr-[250px]!"
      )}
    >
      <div
        className={cn(
          `
          z-30
          fixed top-0 bg-background/80  left-auto  w-[280px]
          md:p-0 p-5
         
          md:absolute h-full md:left-full md:w-[220px] order-1
        
       border-l
 
           `,
          isVisible
            ? "md:left-[calc(100%-210px)] -right-[0px]  "
            : " -right-[280px] md:right-full border-l-transparent"
        )}
        style={{
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <span
          className="bottom-1/6 top-auto md:top-10 absolute md:sticky! bg-background/70 -left-[55px] flex justify-center items-center cursor-pointer z-10 size-13.5 rounded-none border "
          onClick={toggleTocHandler}
          style={{
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <List />
          {/* <ChevronLeft
            size={20}
            className={cn(isVisible ? "rotate-180" : "")}
          /> */}
        </span>
        <div
          id="toc-target"
          className={cn(
            " md:sticky top-30 pt-5",
            isVisible ? "md:opacity-100" : "md:pointer-events-none md:opacity-0"
          )}
        />
      </div>

      <div className="flex-1">
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

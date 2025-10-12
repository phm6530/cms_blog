"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import { LucideMenu, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export enum BREAKPOINT {
  SM = 640,
  MD = 768,
  LG = 1024,
  XL = 1280,
  XXL = 1536,
}

export default function NavList({
  categories,
}: {
  categories: Array<{ label: string; postCnt: number }>;
}) {
  const isDesktop = useMediaQuery(`(min-width:${BREAKPOINT.MD}px)`);

  const [toggle, setToggle] = useState<boolean>(false);
  const [backDropTarget, setBackDropTarget] =
    useState<HTMLElement | null | null>(null);

  const ref = useRef<string>(null);
  const closeRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // 이전 비교하고 꺼버리기
  useEffect(() => {
    if (ref.current !== pathname) {
      setToggle(false);
    }
    ref.current = pathname;
  }, [ref, pathname]);

  useLayoutEffect(() => {
    const el = document.getElementById("backdrop-portal");
    if (el) {
      setBackDropTarget(el);
    }
  }, []);

  function pathnameActive(target: string) {
    const encoded = encodeURIComponent(target);
    if (pathname === `/${encoded}`) return true;
    if (pathname.startsWith(`/category/${encoded}`)) return true;
    return false;
  }

  return (
    <>
      {!isDesktop && (
        <div
          className="block  md:hidden cursor-pointer"
          onClick={() => setToggle((prev) => !prev)}
        >
          <LucideMenu className="text-muted-foreground hover:text-foreground active:text-red-300" />
        </div>
      )}

      <div
        className={cn(
          ` fixed flex flex-col mr-auto ease-side p-10 md:p-5  bg-background md:bg-transparent
          top-0 gap-0 z-100 md:z-10 right-0 border-l h-screen w-[calc(100%-100px)] md:w-auto`,
          `md:static md:flex-row   md:h-auto md:border-0 md:gap-8 md:p-0  md:items-center`,
          toggle ? "left-[100px]" : "left-full"
        )}
        style={{
          transition: `transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
          left 0.75s cubic-bezier(0.77, 0.2, 0.05, 1)`,
        }}
      >
        {!isDesktop && (
          <span
            className="md:hidden! flex  text-xs items-center mb-3 cursor-pointer ml-auto"
            onClick={() => setToggle(false)}
          >
            close <X size={20} />
          </span>
        )}
        {/* cateogry list */}
        {categories.map((e, idx) => {
          return (
            <Link
              href={`/category/${e.label}`}
              className={cn(
                "hover:text-indigo-300",
                "text-3xl md:text-sm  py-4  md:border-t-0  transition-all flex gap-2 items-center"
              )}
              key={`${e.label}:${idx}`}
            >
              <span
                className={cn(
                  pathnameActive(e.label) && "dark:text-indigo-300 underline"
                )}
              >
                {e.label}
              </span>
              {/* <span className="opacity-50 text-[11px] text-primary">
                ({e.postCnt})
              </span> */}
            </Link>
          );
        })}

        {/* <Link
          href={"/guestbook"}
          className={cn(
            "text-sm md:p-0 py-4 border-t md:border-t-0 border-b md:border-b-0 transition-all ",
            pathnameActive("guestbook") && "dark:text-indigo-300  "
          )}
        >
          GUEST BOARD
        </Link> */}
      </div>

      {/* Portal */}
      {!isDesktop && backDropTarget && (
        <div
          ref={closeRef}
          className={cn(
            "fixed w-full left-0 top-0 h-screen  hidden bg-black/50 backdrop-blur-sm z-20 animate-wiggle",
            toggle && "block"
          )}
          onClick={() => setToggle(false)}
        />
      )}
    </>
  );
}

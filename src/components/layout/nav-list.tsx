"use client";

import useMediaQuery from "@/hook/useMediaQuery";
import { Menu, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export enum BREAKPOINT {
  SM = 640,
  MD = 768,
  LG = 1024,
  XL = 1280,
  XXL = 1536,
}

export default function NavList({ categoryList }: { categoryList: string[] }) {
  const isDesktop = useMediaQuery(`(min-width:${BREAKPOINT.MD}px)`);
  const session = useSession();
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
          <Menu size={20} />
        </div>
      )}

      <div
        className={cn(
          `fixed flex flex-col ease-side p-5 md:flex-row! bg-background md:bg-transparent! top-0 gap-0 z-100 md:z-10 right-0 border-l h-screen w-[calc(100%-100px)] md:w-auto`,
          `md:static md:flex-row   md:h-auto md:border-0 md:gap-5 md:p-0  md:items-center`,
          toggle ? "left-[100px]" : "left-full"
        )}
        // inline으로 반영
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
        {categoryList.map((e) => {
          return (
            <Link
              href={`/category/${e}`}
              className={cn(
                "text-sm md:p-0 py-4 border-t md:border-t-0 transition-all ",
                pathnameActive(e) && "text-indigo-400 "
              )}
              key={e}
            >
              {e.toUpperCase()}
            </Link>
          );
        })}

        <Link
          href={"/guestbook"}
          className={cn(
            "text-sm md:p-0 py-4 border-t md:border-t-0 border-b md:border-b-0 transition-all ",
            pathnameActive("guestbook") && "text-indigo-400  "
          )}
        >
          GUEST BOARD
        </Link>

        {session.data?.user && (
          <>
            <Button
              asChild
              className="text-xs p-0 md:border-0! border"
              variant={"ghost"}
            >
              <Link href={"/admin"}>관리자 페이지</Link>
            </Button>
            <Button
              onClick={async () => await signOut()}
              className="text-xs p-0"
              variant={"ghost"}
            >
              로그아웃
            </Button>
          </>
        )}
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

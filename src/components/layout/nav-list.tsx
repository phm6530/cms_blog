"use client";

import useMediaQuery from "@/hook/useMediaQuery";
import { Menu, X } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

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

  const pathname = usePathname();

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
          className="block md:hidden cursor-pointer"
          onClick={() => setToggle((prev) => !prev)}
        >
          <Menu size={20} />
        </div>
      )}

      <div
        className={cn(
          "fixed flex flex-col p-5 md:flex-row! bg-background top-0 gap-0 z-20 right-0 border-l h-screen w-[calc(100%-100px)] md:w-auto  ",
          "md:static md:flex-row md:h-auto md:border-0 md:gap-5 md:p-0 delay-150 my-transtion",
          toggle ? "left-[100px]" : "left-full"
        )}
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
                "text-sm md:p-0 py-4 border-t md:border-t-0",
                pathnameActive(e) &&
                  "text-orange-400 md:border-b-2 border-orange-400"
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
            "text-sm md:p-0 py-4 border-t md:border-t-0 border-b md:border-b-0",
            pathnameActive("guestbook") && ""
          )}
        >
          GUEST BOARD
        </Link>

        {session.data?.user && (
          <Link href={"/admin"} className="text-sm">
            Admin
          </Link>
        )}
      </div>

      {/* Portal */}
      {!isDesktop &&
        backDropTarget &&
        toggle &&
        createPortal(
          <div
            className="fixed w-full h-screen bg-black/50 backdrop-blur-sm z-10 animate-wiggle"
            onClick={() => setToggle(false)}
          />,
          backDropTarget
        )}
    </>
  );
}

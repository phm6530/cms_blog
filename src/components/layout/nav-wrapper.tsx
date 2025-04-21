"use client";

import useMediaQuery from "@/hook/useMediaQuery";
import { Menu } from "lucide-react";
import { ReactNode, useLayoutEffect, useState } from "react";
import { Button } from "../ui/button";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export enum BREAKPOINT {
  SM = 640,
  MD = 768,
  LG = 1024,
  XL = 1280,
  XXL = 1536,
}

export default function NavWrapper({ children }: { children: ReactNode }) {
  const isDesktop = useMediaQuery(`(min-width:${BREAKPOINT.MD}px)`);
  const [toggle, setToggle] = useState<boolean>(false);
  const [backDropTarget, setBackDropTarget] =
    useState<HTMLElement | null | null>(null);

  useLayoutEffect(() => {
    const el = document.getElementById("backdrop-portal");
    if (el) {
      setBackDropTarget(el);
    }
  }, []);

  return (
    <>
      {!isDesktop && (
        <Button
          className="block md:hidden"
          variant="ghost"
          onClick={() => setToggle((prev) => !prev)}
        >
          <Menu size={30} />
        </Button>
      )}
      {/* Nav */}
      <div
        className={cn(
          "fixed  flex bg-background items-center gap-5",
          "md:static ",
          !toggle && "left-[100%]"
        )}
      >
        {children}
      </div>

      {/* Portal */}
      {backDropTarget && createPortal(<div>test</div>, backDropTarget)}
    </>
  );
}

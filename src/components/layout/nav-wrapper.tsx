"use client";

import useMediaQuery from "@/hook/useMediaQuery";
import { Menu } from "lucide-react";
import { ReactNode, useState } from "react";
import { Button } from "../ui/button";

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

  return (
    <>
      {!isDesktop && (
        <Button variant="ghost" onClick={() => setToggle((prev) => !prev)}>
          <Menu size={30} />
        </Button>
      )}
      {(isDesktop || toggle) && children}
    </>
  );
}

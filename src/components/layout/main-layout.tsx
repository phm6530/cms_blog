"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ReactNode, Children } from "react";
// import { Button } from "../ui/button";

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const grid = /^\/post\/[^/]+$/.test(pathname);

  // 정규식으로 동적 경로 포함
  const hideSidebar =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/write" ||
    /^\/post\/[^/]+$/.test(pathname); // /post/[id]에 대응

  const childrenArray = Children.toArray(children);

  return (
    <main
      className={cn(
        "grid md:grid-cols-[250px_auto] gap-10",
        hideSidebar && "md:grid-cols-1",
        !grid && "grid-layout"
      )}
    >
      {hideSidebar ? null : childrenArray[0]}
      {childrenArray[1]}
      {/* 
      <Button
        type="button"
        onClick={topScroll}
        variant={"outline"}
        className="right-110 bottom-20 fixed border size-10 flex items-center justify-center cursor-pointer "
      >
        <ChevronDown className="rotate-180" size={20} />
      </Button> */}
    </main>
  );
}

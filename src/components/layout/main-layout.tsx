"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ReactNode, Children } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // 정규식으로 동적 경로 포함
  const hideSidebar =
    pathname === "/login" ||
    pathname === "/register" ||
    /^\/post\/[^/]+$/.test(pathname); // /post/[id]에 대응

  const childrenArray = Children.toArray(children);

  return (
    <div
      className={cn(
        "grid grid-cols-[250px_auto] gap-10",
        hideSidebar && "grid-cols-1"
      )}
    >
      {hideSidebar ? null : childrenArray[0]}
      {childrenArray[1]}
    </div>
  );
}

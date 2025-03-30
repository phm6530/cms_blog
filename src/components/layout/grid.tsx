import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function Grid({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("w-[1200px] mx-auto", className)}>{children}</div>;
}

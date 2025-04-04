import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function Grid({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn(" mx-auto", className)}>{children}</div>;
}

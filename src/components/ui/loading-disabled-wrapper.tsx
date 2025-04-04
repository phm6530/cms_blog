import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import LoadingSpiner from "../animation/loading-spiner";

export default function LoadingSpinnerWrapper({
  loading,
  children,
  className,
}: {
  loading: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div style={{ position: "relative" }}>
      {loading && <LoadingSpiner />}
      <div
        className={cn(loading && "opacity-50 pointer-events-none", className)}
      >
        {children}
      </div>
    </div>
  );
}

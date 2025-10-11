import { cn } from "@/lib/utils";

export default function BadgeNew({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center size-4 py-0.5 text-[7px] font-bold text-white bg-red-400 rounded",
        className
      )}
    >
      N
    </span>
  );
}

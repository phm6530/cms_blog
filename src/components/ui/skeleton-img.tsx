import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function SkeletonImage({ className }: { className?: string }) {
  return (
    <div className="flex flex-col w-full gap-4">
      <Skeleton
        className={cn("pb-[50%] w-full rounded-xl dark:bg-point/10", className)}
      />
    </div>
  );
}

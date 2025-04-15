import { Skeleton } from "@/components/ui/skeleton";

export default function PostItemSkeleton() {
  return (
    <div className="items-center grid grid-cols-[auto_200px] gap-5">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[50%]" />
      </div>
      <Skeleton className="rounded-xl aspect-[16/9]" />
    </div>
  );
}

import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export default function BadgeNew({ className }: { className?: string }) {
  return (
    <Badge
      variant={"outline"}
      className={cn(
        "relative text-xs rounded-full border-rose-400 text-rose-400 animate-wiggle",
        className
      )}
    >
      새 글
    </Badge>
  );
}

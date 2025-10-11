import { cn } from "@/lib/utils";
import getCategories from "@/service/get-category";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function NavCategories() {
  const response = await getCategories();
  if (!response) notFound();

  const { categories, count: allcount } = response;
  const mappingCategories = Object.entries(categories).map(([, v]) => ({
    label: v.name,
    postCnt: v.postCnt,
  }));

  const tabs = [{ label: "All", postCnt: allcount }, ...mappingCategories];

  return (
    <nav
      className={cn(
        "flex gap-3 flex-wrap mt-12 border-y border-border/40 py-4",
        "backdrop-blur-sm"
      )}
    >
      {tabs.map((e, idx) => {
        const isActive = e.label === "All"; // 현재는 기본 All, 추후 pathname 비교로 교체 가능

        return (
          <Link
            key={idx}
            href={e.label === "All" ? "/" : `/category/${e.label}`}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
            )}
          >
            <span>{e.label}</span>
            <span
              className={cn(
                "ml-1.5 text-xs opacity-60",
                isActive && "opacity-80"
              )}
            >
              ({e.postCnt})
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

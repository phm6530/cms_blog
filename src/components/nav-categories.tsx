import { cn } from "@/lib/utils";
import getCategories from "@/service/get-category";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function NavCategories() {
  const response = await getCategories();

  if (!response) {
    notFound();
  }
  const { categories, count: allcount } = response;

  const mappingCategories = Object.entries(categories).map((e) => {
    return { label: e[1].name, postCnt: e[1].postCnt };
  });

  const tabs = [{ label: "All", postCnt: allcount }, ...mappingCategories];

  return (
    <div className="flex gap-2 flex-wrap mt-10">
      {tabs.map((e, idx) => {
        const isActive = e.label === "All"; // 또는 현재 선택된 탭

        return (
          <Link
            key={idx}
            href={e.label === "All" ? "/" : `/category/${e.label}`}
            className={cn(
              "px-4 py-2 rounded-lg transition-all text-sm font-medium",
              isActive
                ? "bg-foreground text-muted "
                : "border text-foreground hover:bg-foreground/5"
            )}
          >
            <span className="font-medium">{e.label}</span>
            <span className={cn("ml-1.5 text-xs opacity-50")}>
              ({e.postCnt})
            </span>
          </Link>
        );
      })}
    </div>
  );
}

"use client";
import { cn } from "@/lib/utils";
import { useSimpleEditor } from "@squirrel309/my-testcounter";
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

type TocItem = {
  id: string;
  level: number;
  text: string;
  children: TocItem[];
};

const TocRender = (toc: TocItem[], prefix = "") => {
  if (toc.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      const yOffset = -80;
      const y =
        target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col">
      {toc.map((item, idx) => {
        const currentPrefix = prefix ? `${prefix}-${idx + 1}` : `${idx + 1}`;

        return (
          <div
            key={`${item.id}${idx}`}
            className={cn(
              "border-l border-transparent hover:border-primary/50 transition-colors",
              prefix === "" ? "py-1.5" : "ml-4 py-1"
            )}
          >
            <div
              className="group text-sm hover:text-primary transition-colors text-left grid grid-cols-[auto_1fr] gap-2 items-start cursor-pointer px-2"
              onClick={() => scrollToHeading(item.id)}
            >
              <span
                className={cn(
                  "font-medium text-muted-foreground group-hover:text-primary transition-colors",
                  prefix === "" ? "text-xs" : "text-[10px]"
                )}
              >
                {currentPrefix}.
              </span>
              <span
                className={cn(
                  "line-clamp-2 group-hover:underline",
                  prefix === ""
                    ? "text-sm font-medium"
                    : "text-xs text-muted-foreground"
                )}
              >
                {item.text}
              </span>
            </div>
            {item.children.length > 0 &&
              TocRender(item.children, currentPrefix)}
          </div>
        );
      })}
    </div>
  );
};

export default function PostToc() {
  const { getHeadings } = useSimpleEditor({ editable: false });
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    setTimeout(() => {
      const headings = getHeadings();
      setList(headings);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-lg h-[300px] overflow-y-scroll">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b">
        <FileText className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">목차</h3>
      </div>

      {list.length > 0 ? (
        <div className="space-y-0.5">{TocRender(list)}</div>
      ) : (
        <div className="text-xs text-muted-foreground py-2 px-2">
          설정된 목차가 없습니다.
        </div>
      )}
    </div>
  );
}

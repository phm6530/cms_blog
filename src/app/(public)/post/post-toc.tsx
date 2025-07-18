"use client";
import { cn } from "@/lib/utils";
import { useSimpleEditor } from "@squirrel309/my-testcounter";
import { ArrowUpToLine, TableOfContents } from "lucide-react";
import { useEffect, useState } from "react";

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
    <div className="list-disc flex flex-col mt-2 gap-3 ">
      {toc.map((item, idx) => {
        const currentPrefix = prefix ? `${prefix}-${idx + 1}` : `${idx + 1}`;

        return (
          <div
            key={`${item.id}${idx}`}
            className={cn(
              prefix === "" ? "py-2 border-b" : "ml-3 text-xs",
              "leading-6"
            )}
          >
            <div
              className="text-sm hover:underline text-left  grid grid-cols-[auto_1fr] gap-2 items-start cursor-pointer"
              onClick={() => scrollToHeading(item.id)}
            >
              <span className={cn("mt-0", prefix !== "text-xs" && "text-xs ")}>
                {currentPrefix}.
              </span>
              <span
                className={cn(
                  "line-camp-2 text-xs",
                  prefix && " text-muted-foreground"
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
      if (headings?.length) {
      }
      setList(headings);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="border-l hidden md:block">
      <div className="sticky top-20 pl-5 text-left ">
        <p className="border-b pb-2 flex gap-2 items-center">
          <TableOfContents size={15} />
          Table of Content
        </p>
        <div>
          {list.length > 0 ? (
            TocRender(list)
          ) : (
            <div className="text-xs py-5">설정된 목차가 없습니다.</div>
          )}
        </div>

        <div className="flex  mt-4">
          <button
            onClick={() => scrollTop()}
            className="text-sm w-10 border flex items-center justify-center aspect-[16/16] group"
          >
            <ArrowUpToLine
              size={15}
              className="opacity-50 group-hover:opacity-100"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

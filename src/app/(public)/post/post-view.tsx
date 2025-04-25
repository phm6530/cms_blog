"use client";

import { MyEditorContent, useMyEditor } from "@squirrel309/my-testcounter";
import { useEffect, useState } from "react";
import TocPortal from "./toc-portal";
import { cn } from "@/lib/utils";
import { ArrowUpToLine, TableOfContents } from "lucide-react";
type TocItem = {
  id: string;
  level: number;
  text: string;
  children: TocItem[];
};
export default function PostView({ contents }: { contents: string }) {
  const { editor, editorMode, getHeadings } = useMyEditor({
    editorMode: "view",
    enableCodeBlock: true,
  });

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

  //
  const scrollToHeading = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      const yOffset = -80;
      const y =
        target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const TocRender = (toc: TocItem[], prefix = "") => {
    if (toc.length === 0) return null;

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
                <span
                  className={cn("mt-0", prefix !== "text-xs" && "text-xs ")}
                >
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

  // top
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex">
      {/* 포탈 */}

      <TocPortal>
        <div className="sticky top-20 md:pl-5 min-h-[150px] text-left ">
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

          <div className="flex gap-1 mt-4">
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
      </TocPortal>

      <div id="mytiptap-view">
        <MyEditorContent
          value={contents}
          editor={editor}
          editorMode={editorMode}
          className="animate-wiggle text-sm md:text-base!"
        />
      </div>
    </div>
  );
}

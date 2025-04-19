"use client";

import { MyEditorContent, useMyEditor } from "@squirrel309/my-testcounter";
import { useEffect, useState } from "react";
import TocPortal from "./toc-portal";
import { cn } from "@/lib/utils";
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

  const [list, setList] = useState<any[]>([]); // 타입은 필요 시 정의하세요

  useEffect(() => {
    setTimeout(() => {
      const headings = getHeadings();
      if (headings?.length) {
      }
      setList(headings);
    }, 0);
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
      <div className="list-disc flex flex-col mt-2 ">
        {toc.map((item, idx) => {
          const currentPrefix = prefix ? `${prefix}-${idx + 1}` : `${idx + 1}`;

          return (
            <div
              key={`${item.id}${idx}`}
              className={cn(
                prefix === "" ? "mb-5 border-b" : "ml-3 text-sm opacity-70",
                "leading-6"
              )}
            >
              <button
                className="text-sm hover:underline text-left  grid grid-cols-[1fr_auto] gap-2 items-start"
                onClick={() => scrollToHeading(item.id)}
              >
                <span className={cn(prefix !== "" && "text-xs ")}>
                  {currentPrefix}
                </span>
                {item.text}
              </button>
              {item.children.length > 0 &&
                TocRender(item.children, currentPrefix)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex">
      {/* 포탈 */}

      <TocPortal>
        <div className="sticky top-5 border p-5 min-h-[150px] text-left">
          Table of Content
          {list.length > 0 ? TocRender(list) : <div>목차 없음</div>}
        </div>
      </TocPortal>

      <MyEditorContent
        value={contents}
        editor={editor}
        editorMode={editorMode}
      />
    </div>
  );
}

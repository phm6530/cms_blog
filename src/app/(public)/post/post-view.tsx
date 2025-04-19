"use client";

import { MyEditorContent, useMyEditor } from "@squirrel309/my-testcounter";
import { useEffect, useState } from "react";
type TocItem = {
  id: string;
  level: number;
  text: string;
  children: TocItem[];
};
export default function PostView({ contents }: { contents: string }) {
  const { editor, editorMode, getHeadings } = useMyEditor({
    editorMode: "view",
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

  const scrollToHeading = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      const yOffset = -80;
      const y =
        target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };
  const TocRender = (toc: TocItem[]) => {
    if (toc.length === 0) return null;

    return (
      <ul className="ml-4 list-disc">
        {toc.map((item, idx) => (
          <li key={`${item.id}${idx}`}>
            <button
              className="text-sm hover:underline"
              onClick={() => scrollToHeading(item.id)}
            >
              {item.text}
            </button>
            {item.children.length > 0 && TocRender(item.children)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <MyEditorContent
        value={contents}
        editor={editor}
        editorMode={editorMode}
      />
      <pre>{JSON.stringify(list, null, 3)}</pre>
      <pre>{list && TocRender(list)}</pre>
    </>
  );
}

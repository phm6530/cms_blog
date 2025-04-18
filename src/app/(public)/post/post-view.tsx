"use client";
import { MyEditor, useMyEditor } from "@squirrel309/my-testcounter";

export default function PostView({ contents }: { contents: string }) {
  const { editor, editorMode } = useMyEditor({
    editorMode: "view",
    content: contents,
  });
  return (
    <>
      <MyEditor editor={editor} editorMode={editorMode} />
    </>
  );
}

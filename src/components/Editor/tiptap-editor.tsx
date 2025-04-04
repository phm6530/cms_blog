"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Youtube from "@tiptap/extension-youtube";

import { common, createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import React, { useEffect, useState } from "react";
import Placeholder from "@tiptap/extension-placeholder";
import TipTapToolbar from "./tiptap-toolbar";
import { cn } from "@/lib/utils";
// import LoadingWrapper from "@/components/shared/loading/loading-wrapper";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Link from "@tiptap/extension-link";

const lowlight = createLowlight(common);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

const TipTapEditor = ({
  mode = "editor",
  value,
  onChange,
  placeholder,
}: {
  content?: string;
  value?: string;
  onChange?: (_html: string) => void;
  placeholder?: string;
  mode?: "view" | "editor";
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(
    mode === "editor" && false
  );

  const editor = useEditor({
    extensions: [
      StarterKit, // 여기 이미 Heading + codeblock
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
      }),
      Placeholder.configure({ placeholder }),
      Link.configure({
        openOnClick: false,
      }),
    ],

    editorProps: {
      handleDOMEvents: {
        beforeinput: () => true,
      },
    },

    content: value || "",
    ...(onChange && {
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        onChange(html === "<p></p>" ? "" : html);
      },
    }),
    ...(mode === "view" && {
      editable: false,
    }), //이거에 따라 바뀜 ㅇㅇ
    onCreate: () => {
      setIsLoading(false);
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor || isLoading) {
    return null;
  }

  const handleEditorClick = () => {
    if (mode === "editor") {
      editor.chain().focus().run();
    }
  };

  return (
    <div className="table w-full rounded-md overflow-hidden   border-collapse ">
      {mode === "editor" && <TipTapToolbar editor={editor} />}
      <div
        className={cn(
          mode === "view" && "border-none",
          "table-cell w-full border-input border !rounded-lg cursor-text  h-full overflow-hidden rounded-b-md focus-within:border-primary focus-within:focus-within:bg-[hsl(var(--custom-color))]"
        )}
      >
        <EditorContent
          editor={editor}
          className={cn(
            " w-full h-full min-h-[150px] overflow-hidden ",
            mode === "editor" && "bg-[#feffff] dark:bg-custom-input p-3"
          )}
          onClick={handleEditorClick}
        />
      </div>
    </div>
  );
};

export default TipTapEditor;

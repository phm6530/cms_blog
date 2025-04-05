"use client";

import {
  BubbleMenu,
  EditorContent,
  FloatingMenu,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Youtube from "@tiptap/extension-youtube";
import Mention from "@tiptap/extension-mention";
import { common, createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import React, { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "@tiptap/extension-image";
import Blockquote from "@tiptap/extension-blockquote";
import Placeholder from "@tiptap/extension-placeholder";
import TipTapToolbar from "./TipTapToolbar";
import Underline from "@tiptap/extension-underline";
// import LoadingWrapper from "@/components/shared/loading/loading-wrapper";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Link from "@tiptap/extension-link";
import { suggestion } from "./suggestion";
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
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        suggestion,
      }),
      Image,
      Blockquote,
      Underline,
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

  const addImage = useCallback(() => {
    const url = window.prompt("URL");

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  //   useEffect(() => {
  //     if (editor && value !== undefined && editor.getHTML() !== value) {
  //       editor.commands.setContent(value);
  //     }
  //   }, [editor, value]);

  if (!editor || isLoading) {
    return "loading....";
  }

  const handleEditorClick = () => {
    if (mode === "editor") {
      editor.chain().focus().run();
    }
  };

  return (
    <div className="table w-full rounded-md overflow-hidden   border-collapse ">
      {editor && (
        <BubbleMenu
          className="bubble-menu"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            Bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            Italic
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
          >
            Strike
          </button>
        </BubbleMenu>
      )}

      {editor && (
        <FloatingMenu
          className="floating-menu"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            }
          >
            H1
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 }) ? "is-active" : ""
            }
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "is-active" : ""}
          >
            Bullet list
          </button>
        </FloatingMenu>
      )}

      {mode === "editor" && <TipTapToolbar editor={editor} />}
      <div
        className={cn(
          mode === "view" && "border-none",
          "table-cell w-full border-input border !rounded-lg cursor-text  h-full overflow-hidden rounded-b-md focus-within:border-primary focus-within:focus-within:bg-[hsl(var(--custom-color))]"
        )}
      >
        <div className="control-group">
          <div className="button-group">
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive("underline") ? "is-active" : ""}
            >
              Toggle underline
            </button>
          </div>
        </div>
        <div className="control-group">
          <div className="button-group flex gap-3">
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={editor.isActive("blockquote") ? "is-active" : ""}
            >
              Toggle blockquote
            </button>
            <button
              onClick={() => editor.chain().focus().setBlockquote().run()}
              disabled={!editor.can().setBlockquote()}
            >
              Set blockquote
            </button>
            <button
              onClick={() => editor.chain().focus().unsetBlockquote().run()}
              disabled={!editor.can().unsetBlockquote()}
            >
              Unset blockquote
            </button>
          </div>
        </div>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
        >
          Toggle blockquote
        </button>
        <div className="button-group">
          <button onClick={addImage}>Set image</button>
        </div>
        <EditorContent
          editor={editor}
          className={cn(
            " w-full h-full min-h-[150px] overflow-hidden ",
            mode === "editor" && " dark:bg-custom-input p-3"
          )}
          onClick={handleEditorClick}
        />
      </div>
    </div>
  );
};

export default TipTapEditor;

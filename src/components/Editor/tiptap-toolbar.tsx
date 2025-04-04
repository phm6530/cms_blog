import { Code2, Heading1, Heading2, Heading3 } from "lucide-react";

import { Editor } from "@tiptap/react";
export default function TipTapToolbar({ editor }: { editor: Editor }) {
  const addYoutubeVideo = () => {
    const url = prompt("삽입하실 Youtube Url을 입력해주세요");

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
      });
    }
  };

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = prompt("URL을 입력해주세요:", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    const urlWithProtocol =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`;

    // 링크 추가
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: urlWithProtocol, target: "_blank" })
      .run();
  };

  return (
    <div className="table-row border">
      <div className="flex gap-3 p-2">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            }
          >
            <Heading1 className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 }) ? "is-active" : ""
            }
          >
            <Heading2 className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor.isActive("heading", { level: 3 }) ? "is-active" : ""
            }
          >
            <Heading3 className="w-5 h-5" />
          </button>
        </div>
        <div className="flex ">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive("codeBlock") ? "is-active" : ""}
          >
            <Code2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center items-center">
          <button id="add" onClick={addYoutubeVideo} type="button">
            <div className="w-5 h-5 flex justify-center items-center  [&>svg]:w-5 [&>svg]:h-5 [&>svg]:fill-white ">
              {/* <YoutubeIcon /> */}
            </div>
          </button>
        </div>

        <div className="flex justify-center items-center">
          <div className="flex justify-center items-center">
            <button onClick={addLink} type="button">
              <div className="w-5 h-5 flex justify-center items-center [&>svg]:w-5 [&>svg]:h-5 [&>svg]:fill-white">
                Link
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

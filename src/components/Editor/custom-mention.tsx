import { Mention } from "@tiptap/extension-mention";

const CustomMention = Mention.extend({
  addAttributes() {
    return {
      id: {},
      label: {},
      href: {
        default: null,
      },
    };
  },

  renderHTML({ node }) {
    return [
      "a",
      {
        class: "mention",
        href: node.attrs.href || "#",
        target: "_blank",
      },
      `@${node.attrs.label}`,
    ];
  },
}).configure({
  HTMLAttributes: {
    class: "mention",
  },
  suggestion: {
    char: "@",
    items: ({ query }) => {
      return [
        { id: 1, label: "john", href: "/profile/john" },
        { id: 2, label: "jane", href: "/profile/jane" },
      ].filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      );
    },
    render: () => {
      // ✨ 이건 직접 구현 필요
    },
  },
});

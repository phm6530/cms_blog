import { CommentItemModel } from "./comment-bff";

export function createCommentTree(
  list: CommentItemModel[]
): CommentItemModel[] {
  const map = new Map<number, CommentItemModel>();
  const rootComments: CommentItemModel[] = [];

  for (const item of list) {
    map.set(item.id, { ...item, children: [] });
  }

  for (const item of list) {
    const current = map.get(item.id)!;

    if (item.parent_id) {
      const parent = map.get(item.parent_id);
      if (parent) parent.children.push(current);
    } else {
      rootComments.push(current);
    }
  }

  // 대댓글 오름차순으로 변경
  for (const comment of rootComments) {
    comment.children.sort((a, b) => a.id - b.id);
  }

  return rootComments;
}

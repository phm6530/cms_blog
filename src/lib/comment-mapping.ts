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

  return rootComments;
}

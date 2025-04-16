export enum BLOG_TAGS {
  LIST = "BLOG_LIST",
  GROUPS = "BLOG_GROUPS",
  DETAIL = "BLOG_DETAIL",
}

export enum GUEST_BOARD {
  GETBOARD = "GET_BOARD",
}

export enum WEIGET {
  COMMENT = "COMMENT_WEIGET",
}

export const REVALIDATE = {
  BLOG: BLOG_TAGS,
  COMMENT: "COMMENT",
  GUEST_BOARD: GUEST_BOARD,
  WEIGET: WEIGET,
  PINNED_POST: "PIINED_POST",
};

export const ENV = {
  IMAGE_URL: process.env.IMAGE_URL,
  SUPABASE_IMAGE_URL: process.env.SUPABASE_IMAGE_URL,
};

export enum QUERYKEY {
  SEARCH = "SEARCH",
}

export enum HTTP_METHOD {
  POST = "POST",
  DELETE = "DELETE",
  PUT = "PUT",
  PATCH = "PATCH",
}

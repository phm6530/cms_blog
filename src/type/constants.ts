export enum BLOG_TAGS {
  LIST = "BLOG_LIST",
  GROUPS = "BLOG_GROUPS",
  DETAIL = "BLOG_DETAIL",
}

export enum GUEST_BOARD {
  GETBOARD = "GET_BOARD",
}

export const REVALIDATE = {
  BLOG: BLOG_TAGS,
  COMMENT: "COMMENT",
  GUEST_BOARD: GUEST_BOARD,
};

export const ENV = {
  IMAGE_URL: process.env.IMAGE_URL,
};

export enum HTTP_METHOD {
  POST = "POST",
  DELETE = "DELETE",
}

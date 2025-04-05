export enum BLOG_TAGS {
  LIST = "BLOG_LIST",
  GROUPS = "BLOG_GROUPS",
  DETAIL = "BLOG_DETAIL",
}

export const REVALIDATE = {
  BLOG: BLOG_TAGS,
  COMMENT: "COMMENT",
};

export const ENV = {
  IMAGE_URL: process.env.IMAGE_URL,
};

export enum HTTP_METHOD {
  POST = "POST",
}

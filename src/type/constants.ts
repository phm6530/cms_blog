export enum POST_KEY {
  LIST = "POST_LIST",
  CATEGORY = "POST_CATEGORY",
  DETAIL = "POST_DETAIL",
  PINNED_POST = "PIINED_POST",
}

export enum GUEST_BOARD {
  GETBOARD = "GET_BOARD",
}

export enum WEIGET {
  COMMENT = "COMMENT_WEIGET",
  GUESTBOARD = "GUESTBOARD",
}

export const REVALIDATE = {
  POST: POST_KEY,
  COMMENT: "COMMENT",
  GUEST_BOARD: GUEST_BOARD,
  WEIGET: WEIGET,
};

export const ENV = {
  IMAGE_URL: process.env.IMAGE_URL,
  IMAGE_URL_PUBLIC: process.env.NEXT_PUBLIC_IMAGE_URL,
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

export enum POST_STATUS {
  DRAFT = "draft",
  PUBLISHED = "published",
  PRIVATE = "private",
}

export enum WRITE_MODE {
  EDIT = "edit",
  DRAFT = "draft",
}

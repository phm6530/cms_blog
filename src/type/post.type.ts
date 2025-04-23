import { POST_STATUS } from "./constants";

export type PostItemModel = {
  post_id: number;
  post_title: string;
  post_description: string;
  created_at: string;
  update_at: string;
  author_id: number;
  thumbnail_url: string;
  sub_group_name: string;
  like_cnt: number;
  status: POST_STATUS;
  comment_count: number;
};

export type AdminPostItemModel = PostItemModel & {
  pin: {
    is_pinned: boolean;
    pin_id: number | null;
  };
};

export type PinnedPostModel = PostItemModel & {
  id: number;
  order: number;
  active: boolean;
};

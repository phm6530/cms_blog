// Blog 게시물 상태

import { POST_STATUS } from "./constants";

export interface BlogMetadata {
  post_id: number;
  post_title: string;
  post_description: string;
  created_at: Date;
  update_at: Date;
  category_id: number | null;
  sub_group_id: number | null;
  author_id: number;
  thumbnail_url: string | null;
  status: POST_STATUS;
  img_key: string;
  like_cnt: number | null;
}

export interface BlogContents {
  content_id: number;
  post_id: number;
  contents: string;
}

type BlogSubGroup = {
  sub_group_id: number;
  sub_group_name: string;
  group_id: number;
  default_thum: string | null;
};

export interface BlogDetailResponse {
  blog_metadata: BlogMetadata;
  blog_contents: BlogContents;
  blog_sub_group: BlogSubGroup;
  category: {
    group_id: number;
    group_name: string;
  };
  pinned_post: null | {
    id: number;
    createdAt: Date;
    post_id: number;
    active: boolean;
    order: number;
  };
}

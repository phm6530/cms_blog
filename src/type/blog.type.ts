export interface BlogMetadata {
  post_id: number;
  post_title: string;
  post_description: string;
  created_at: string;
  update_at: string;
  sub_group_id: number;
  author_id: number;
  thumbnail_url: string;
  view: boolean;
  img_key: string;
  category_id: number;
  like_cnt: number;
}

export interface BlogContents {
  content_id: number;
  post_id: string;
  contents: string;
}

type BlogSubGroup = {
  sub_group_id: 1;
  sub_group_name: "react";
  group_id: 1;
  default_thum: null;
};
export interface BlogDetailResponse {
  blog_metadata: BlogMetadata;
  blog_contents: BlogContents;
  blog_sub_group: BlogSubGroup;
  category: {
    group_id: number;
    group_name: string;
  };
}

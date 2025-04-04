export interface BlogMetadata {
  post_id: number;
  post_title: string;
  post_description: string;
  create_at: string;
  update_at: string;
  sub_group_id: number;
  author_id: number;
  thumbnail_url: string;
  view: boolean;
}

export interface BlogContents {
  content_id: number;
  post_id: string;
  contents: string;
  contents_key: string;
}

export interface BlogDetailResponse {
  blog_metadata: BlogMetadata;
  blog_contents: BlogContents;
}

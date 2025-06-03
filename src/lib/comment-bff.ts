type Author =
  | {
      role: "admin" | "super";
      admin_email: string;
      nickname: string;
      guest_id?: undefined;
      profile_img: string | null;
    }
  | {
      role: "guest";
      guest_id: number;
      nickname: string;
      admin_email?: undefined;
      profile_img: string | null;
    };

export type CommentItemModel = {
  id: number;
  comment: string;
  parent_id: number | null;
  created_at: string;
  author: Author;
  post_id?: number;
  children: CommentItemModel[]; //재귀 타입하기 ㅇㅇ
};

type CommentRow = {
  id: number;
  post_id?: number;
  comment: string;
  created_at: Date;
  parent_id: number | null;
  guest_nickname: string | null;
  guest_id: number | null;
  admin_email: string | null;
  admin_nickname: string | null;
  author_role: "guest" | "admin" | "super";
  guest_img?: string | null;
  profile_img?: string | null;
};

export function mapToCommentModel(rows: CommentRow[]): CommentItemModel[] {
  return rows.map((data) => {
    const {
      author_role,
      admin_email,
      admin_nickname,
      guest_id,
      guest_nickname,
      created_at,
      guest_img,
      profile_img,
      ...rest
    } = data;

    const author =
      author_role === "admin" || author_role === "super"
        ? {
            role: author_role,
            admin_email: admin_email!,
            nickname: admin_nickname!,
            profile_img: profile_img ?? null,
          }
        : {
            role: author_role,
            guest_id: guest_id!,
            nickname: guest_nickname!,
            profile_img: guest_img ? `${guest_img}.png` : null,
          };

    // 구조 변경,
    const obj: CommentItemModel = {
      ...rest,
      author,
      created_at: created_at.toISOString(),
      children: [],
    };
    return obj;
  });
}

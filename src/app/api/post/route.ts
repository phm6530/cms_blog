export type PostFormData = {
  title: string;
  contents: string;
  description: string;
  postGroup: {
    category: number;
    group: number;
  };
  thumbnail: string | null;
  defaultThumbNail: boolean;
  imgKey: string;
  status: POST_STATUS;
  pinnedPost?: boolean;
};

import { auth } from "@/auth";
import { usersTable } from "@/db/schema";
import { blogContentsSchema } from "@/db/schema/blog-contents";
import { blogMetaSchema } from "@/db/schema/blog-metadata";
import getBlogList from "@/service/get-blog-list";
import { POST_STATUS, REVALIDATE } from "@/type/constants";
import { apiHandler } from "@/util/api-hanlder";
import { WithTransaction } from "@/util/withTransaction";
import { eq, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const qs = req.nextUrl.searchParams;
  const groupTag = qs.get("group");
  const categoryTag = qs.get("category");
  const searchKeyword = qs.get("keyword");
  const curPostId = qs.get("curPost"); //현재 보는 PostId

  const session = await auth();

  const cursorQuery = qs.get("cursor");
  const cursor = cursorQuery ? Number(cursorQuery) : null;

  const limitQuery = qs.get("limit");
  const limit = limitQuery ? Number(limitQuery) : 10;

  // where..
  const { list, searchCnt, rowsCnt } = await getBlogList({
    groupTag,
    categoryTag,
    permission: session?.user.role === "super", // 비밀글은 나 만봄
    searchKeyword,
    cursor,
    limit,
    curPostId: curPostId ? Number(curPostId) : null,
  });

  return NextResponse.json(
    {
      success: true,
      result: {
        list,
        isNextPage: rowsCnt > limit,
        ...(!!searchKeyword && { total: searchCnt }),
      },
    },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const body: PostFormData = await req.json();
  const DRAFT_LIMIT = 10;

  return await apiHandler(async () => {
    if (!session?.user) {
      throw new Error("권한이 없습니다.");
    }
    const resultTx = await WithTransaction.run(async (tx) => {
      const [user] = await tx
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, session.user.email!));

      if (!user) {
        throw new Error("없는 사용자 입니다.");
      }

      /** 임시 저장일시에는 임시저장 목록 10개 제한 */
      if (body.status === POST_STATUS.DRAFT) {
        const [row] = await tx
          .select({ cnt: sql<number>`COUNT(*)` })
          .from(blogMetaSchema)
          .where(eq(blogMetaSchema.status, POST_STATUS.DRAFT));

        if (+row.cnt >= DRAFT_LIMIT) {
          throw new Error("임시저장은 10개 초과 불가합니다.");
        }
      }

      const [rows] = await tx
        .insert(blogMetaSchema)
        .values({
          post_title: body.title,
          post_description: body.description,
          category_id: body.postGroup.category
            ? +body.postGroup.category
            : null,
          sub_group_id: body.postGroup.category ? +body.postGroup.group : null,
          author_id: user.id,
          img_key: body.imgKey,
          status: body.status,
          thumbnail_url: body.thumbnail,
        })
        .returning({
          id: blogMetaSchema.post_id,
          categoryName: blogMetaSchema.sub_group_id,
          status: blogMetaSchema.status,
        });

      await tx.insert(blogContentsSchema).values({
        post_id: +rows.id,
        contents: body.contents,
      });

      return {
        postId: +rows.id,
        categoryName: rows.categoryName,
        status: rows.status,
      };
    });

    revalidateTag(REVALIDATE.POST.LIST);
    revalidateTag(REVALIDATE.POST.CATEGORY);

    return {
      postId: resultTx.postId,
      postStatus: resultTx.status,
    };
  });
}

// export async function generateStaticParams() {
// withFetchRevaildationAction({});
// let url = `${BASE_NEST_URL}/template?sort=all`;
// url += "&page=1";
// const response = await fetch(url, { cache: "force-cache" });
// const {
//   data: listResponse,
// }: { data} =
//   await response.json();
// return listResponse.map((template) => {
//   if ("id" in template) {
//     return { id: template.id.toString() };
//   }
// });
// }

import CommentSection from "@/components/comments/comment-section";
import { Badge } from "@/components/ui/badge";
import { BlogDetailResponse } from "@/type/blog.type";
import { POST_STATUS, REVALIDATE } from "@/type/constants";
import { DateUtils } from "@/util/date-uill";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { notFound } from "next/navigation";

import SelectPage from "@/components/info-component/secrect-page";
import { auth } from "@/auth";
import { readingTImeKO } from "@/util/reading-timeKo";
import { Eye } from "lucide-react";
import RelatedPosts from "../related-posts";
import { Suspense } from "react";

import { cn } from "@/lib/utils";
import { Metadata } from "next";
import PostVanner from "../post-vanner-bg";
import { unsplashS3Mapping } from "@/util/unsplash-s3-mapping";

import PostLikeHandler from "../post-like-hanlder";
import PostHandler from "../post-handler";
import PostContentCotainer from "../post-contents-wrapper";
import PostView from "../post-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await withFetchRevaildationAction<BlogDetailResponse>({
    endPoint: `api/post/${id}`,
    options: {
      cache: "force-cache",
      next: {
        tags: [`${REVALIDATE.POST.DETAIL}:${id}`],
      },
    },
  });

  if (!data || !data.result) {
    notFound();
  }
  const { blog_metadata } = data.result;

  return {
    title: `${blog_metadata.post_title}`,
    description: `${blog_metadata.post_description}`,
    openGraph: {
      title: `${blog_metadata.post_title}`,
      description: `${blog_metadata.post_description}`,
      images: unsplashS3Mapping(blog_metadata.thumbnail_url) ?? "",
    },
  };
}

export default async function PostDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const data = await withFetchRevaildationAction<BlogDetailResponse>({
    endPoint: `api/post/${id}`,
    options: {
      cache: "force-cache",
      next: {
        tags: [`${REVALIDATE.POST.DETAIL}:${id}`],
      },
    },
  });

  if (!data || !data.result) {
    notFound();
  }
  const { blog_metadata, blog_contents, blog_sub_group, category } =
    data.result;

  if (!session && blog_metadata.status === POST_STATUS.PRIVATE) {
    return <SelectPage />; //View에따라 공개여부
  }

  const hasThumbnail = Boolean(blog_metadata.thumbnail_url);

  return (
    <div className=" w-full gap-6">
      {/* header */}
      <PostVanner
        hasThumbnail={hasThumbnail}
        thumbnail_url={blog_metadata.thumbnail_url}
      >
        <div
          className={cn(
            "py-5 flex flex-col relative z-10 animate-fadein ",
            !blog_metadata.thumbnail_url && "border-b  "
          )}
        >
          <div className="flex gap-2 mt-auto mb-3 ">
            <Badge
              variant={"outline"}
              className={cn(
                blog_metadata.thumbnail_url &&
                  "bg-white text-black rounded-full"
              )}
            >
              {blog_sub_group.sub_group_name}
            </Badge>
            {DateUtils.isNew(blog_metadata.created_at) && (
              <Badge
                variant={"outline"}
                className="relative rounded-full text-xs  border-rose-400 text-rose-400 animate-wiggle"
              >
                New
              </Badge>
            )}
            {/* 비공개 시에만... */}
            {blog_metadata.status === POST_STATUS.PRIVATE && (
              <Badge className="rounded-full">비공개</Badge>
            )}
          </div>
          <h1
            className={cn(
              "text-3xl md:text-4xl mb-9 ",
              blog_metadata.thumbnail_url &&
                " max-w-[900px] leading-10 md:leading-13 break-keep drop-shadow-md"
            )}
            style={{
              textShadow: "1px 3px 10px black",
            }}
          >
            {blog_metadata.post_title}
          </h1>

          <div className="flex gap-2 ">
            <div className="text-sm  opacity-60">
              {DateUtils.dateFormatKR(blog_metadata.created_at, "YYYY. MM. DD")}
            </div>
            <div className="flex gap-3 items-center">
              <Eye size={18} className="opacity-60" />{" "}
              <span className="text-sm opacity-60">
                {readingTImeKO(blog_contents.contents)}분 이내 소요
              </span>
            </div>
          </div>
        </div>
      </PostVanner>

      <div className="grid gap-5 grid-layout pt-10 relative">
        <PostContentCotainer
          categoryName={category.group_name}
          groupName={blog_sub_group.sub_group_name}
        >
          {/* ------ TipTap Editor - custom lib ------ */}
          <PostView contents={blog_contents.contents} />

          <PostLikeHandler postId={+id} likeCnt={blog_metadata.like_cnt} />
          <PostHandler postId={id} category={category.group_name} />

          {/* ---- 댓글 ----- */}
          <CommentSection postId={id} />

          {/* ---- post Tool bar ----- */}
          <Suspense fallback={<>loading................</>}>
            <RelatedPosts
              curPost={id}
              categoryName={category.group_name}
              subGroupName={blog_sub_group.sub_group_name}
            />
          </Suspense>
        </PostContentCotainer>
      </div>
    </div>
  );
}

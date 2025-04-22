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
import { ENV, REVALIDATE } from "@/type/constants";
import { DateUtils } from "@/util/date-uill";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { notFound } from "next/navigation";
import PostHandler from "../post-handler";
import PostLikeHandler from "../post-like-hanlder";
import SelectPage from "@/components/info-component/secrect-page";
import { auth } from "@/auth";
import { readingTImeKO } from "@/util/reading-timeKo";
import { Eye } from "lucide-react";
import RelatedPosts from "../related-posts";
import { Suspense } from "react";
import PostView from "../post-view";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
// import { HtmlContentNormalizer } from "@/util/baseurl-slice";

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
      images: `${ENV.IMAGE_URL_PUBLIC}${blog_metadata.thumbnail_url}`,
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

  if (!session && !blog_metadata.view) {
    return <SelectPage />; //View에따라 공개여부
  }
  const hasThumbnail = Boolean(blog_metadata.thumbnail_url);
  return (
    <main className=" w-full gap-6">
      {/* header */}
      <section
        className={cn(
          "relative flex items-end",
          hasThumbnail
            ? "p-10 min-h-90 text-white outline outline-border rounded-2xl "
            : "border-b"
        )}
        style={
          hasThumbnail
            ? {
                backgroundImage: `
            linear-gradient(to right, rgba(30, 30, 30, 1), rgba(30, 30, 30, .8),rgba(30, 30, 30, .8), rgba(0, 0, 0, 0.1)),
            url(${ENV.IMAGE_URL_PUBLIC}${blog_metadata.thumbnail_url})
          `,
                backgroundSize: "cover",
                backgroundPosition: "right",
                backgroundRepeat: "no-repeat",
              }
            : undefined
        }
      >
        <div className="py-5 flex flex-col gap-5">
          <div className="flex gap-2">
            <Badge
              variant={"secondary"}
              className={cn(
                blog_metadata.thumbnail_url && "bg-white text-black"
              )}
            >
              {blog_sub_group.sub_group_name}
            </Badge>{" "}
            {DateUtils.isNew(blog_metadata.created_at) && (
              <Badge
                variant={"outline"}
                className="relative rounded-full text-xs  border-rose-400 text-rose-400 animate-wiggle"
              >
                New
              </Badge>
            )}
            {!blog_metadata.view && (
              <Badge className="rounded-full">비공개</Badge>
            )}
          </div>
          <h1
            className={cn(
              "text-3xl ",
              blog_metadata.thumbnail_url &&
                " max-w-[500px] leading-13 break-keep drop-shadow-md"
            )}
            style={{
              textShadow: "1px 2px 5px #000000",
            }}
          >
            {blog_metadata.post_title}
          </h1>

          <div className="flex gap-2 pt- mt-auto">
            <div className="text-xs text-muted-foreground">
              {DateUtils.dateFormatKR(blog_metadata.created_at, "YYYY. MM. DD")}
            </div>
            <div className="flex gap-3 items-center">
              <Eye size={18} className="opacity-60" />{" "}
              <span className="text-xs opacity-60">
                {readingTImeKO(blog_contents.contents)}분 이내 소요
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-[auto_250px] pt-20 gap-5">
        <section className=" gap-5">
          <div>
            <div className="w-full  border-b pb-10 relative">
              {/* TipTap Editor - custom lib */}
              <PostView
                contents={blog_contents.contents}
                category={category.group_name}
              />
              <PostLikeHandler postId={+id} likeCnt={blog_metadata.like_cnt} />
              <PostHandler postId={id} category={category.group_name} />
            </div>

            {/* 댓글 Section */}
            <CommentSection postId={id} />
            <Suspense fallback={<>loading................</>}>
              <RelatedPosts
                curPost={id}
                categoryName={category.group_name}
                subGroupName={blog_sub_group.sub_group_name}
              />
            </Suspense>
          </div>
        </section>{" "}
        {/* 목차 포탈 */}
        <div id="toc-target" className="sticky top-5 border-l" />
      </div>
    </main>
  );
}
{
}

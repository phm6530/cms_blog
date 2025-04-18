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
import Image from "next/image";
import { notFound } from "next/navigation";
import PostHandler from "../post-handler";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import PostLikeHandler from "../post-like-hanlder";
import SelectPage from "@/components/info-component/secrect-page";
import { auth } from "@/auth";
import { readingTImeKO } from "@/util/reading-timeKo";
import { Eye } from "lucide-react";
import RelatedPosts from "../related-posts";
import { Suspense } from "react";
import PostView from "../post-view";
// import { HtmlContentNormalizer } from "@/util/baseurl-slice";

// export async function generateMetadata({
//   params: { id },
// }: SurveyDetailTemplateParams): Promise<Metadata> {
//   const response = await fetch(`${BASE_NEST_URL}/template/survey/${id}`, {
//     cache: "force-cache",
//     next: {
//       tags: [`template-survey-${+id}`], // Tags
//     },
//   });

//   //존재하지 않는  페이지면 Redirect 시켜버림
//   if (!response.ok) {
//     notFound();
//   }

//   const data: FetchTemplateForm = await response.json();

//   return {
//     title: `[dopoll] ${data.title}`,
//     description: data.description,
//     openGraph: {
//       title: `[dopoll] ${data.title}`,
//       description: data.description,
//       images: data.thumbnail,
//     },
//   };
// }

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

  return (
    <main className="grid grid-cols-[250px_auto] w-full gap-6">
      {/* 목차 포탈 */}
      <div id="toc-target" className="sticky top-5 " />

      <div>
        <section className="border-b">
          <div className="py-5 flex flex-col gap-5">
            <div className="flex gap-2">
              <Badge variant={"secondary"} className="">
                {blog_sub_group.sub_group_name}
              </Badge>{" "}
              {DateUtils.isNew(blog_metadata.created_at) && (
                <Badge
                  variant={"outline"}
                  className="relative rounded-full text-xs border-rose-400 text-rose-400 animate-wiggle"
                >
                  New
                </Badge>
              )}
              {!blog_metadata.view && (
                <Badge className="rounded-full">비공개</Badge>
              )}
            </div>
            <h1 className="text-3xl">{blog_metadata.post_title}</h1>
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

          {blog_metadata.thumbnail_url && (
            <div className="w-full   rounded-xl relative overflow-hidden mb-5">
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={`${ENV.IMAGE_URL}/${blog_metadata.thumbnail_url}`}
                  alt=""
                  fill
                  style={{ objectFit: "cover" }}
                />
              </AspectRatio>
            </div>
          )}
        </section>

        <section className="w-full  border-b pb-10 relative">
          {/* TipTap Editor - custom lib */}
          <PostView contents={blog_contents.contents} />
          <PostLikeHandler postId={+id} likeCnt={blog_metadata.like_cnt} />
          <PostHandler postId={id} category={category.group_name} />
        </section>

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
    </main>
  );
}
{
}

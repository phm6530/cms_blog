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
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import Image from "next/image";
import { notFound } from "next/navigation";

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
  params: Promise<{ group: string; id: string }>;
}) {
  const { id, group } = await params;

  const data = await withFetchRevaildationAction<BlogDetailResponse>({
    endPoint: `api/blog/${id}`,
    options: {
      cache: "force-cache",
      next: {
        tags: [REVALIDATE.BLOG.DETAIL, id],
      },
    },
  });

  if (!data || !data.result) {
    notFound();
  }

  const { blog_metadata, blog_contents } = data.result;

  return (
    <main className="flex flex-col gap-6">
      <section className="border-b">
        <div className="py-5 flex flex-col gap-3">
          <Badge variant={"outline"}>{group}</Badge>
          <h1 className="text-3xl">{blog_metadata.post_title}</h1>
          <div className="text-xs text-muted-foreground">
            {blog_metadata.create_at}
          </div>
        </div>
        {blog_metadata.thumbnail_url && (
          <div className="w-full h-[300px]  rounded-xl relative overflow-hidden mb-5">
            <Image
              src={`${ENV.IMAGE_URL}/${blog_metadata.thumbnail_url}`}
              alt=""
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </section>

      <section className="w-full overflow-hidden">
        {/* <TipTapEditor mode="view" value={blog_contents.contents} /> */}
        {/* <div dangerouslySetInnerHTML={{ __html: blog_contents.contents }} /> */}
        {/* <pre>{blog_contents.contents}</pre> */}
      </section>

      {/* 댓글 Section */}
      <CommentSection postId={id} />
    </main>
  );
}
{
}

import CommentSection from "@/components/comments/comment-section";
import { Badge } from "@/components/ui/badge";
import { POST_STATUS } from "@/type/constants";
import { DateUtils } from "@/util/date-uill";
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
import PostView from "../post-view";
import { HtmlContentNormalizer } from "@/util/baseurl-slice";
import LoadingSpiner from "@/components/animation/loading-spiner";

import { PostItemModel } from "@/type/post.type";
import getPostItem from "./action/page-service";
import PostController from "./post-controller";

// List get
interface PostListApiResponse {
  success: boolean;
  result: {
    list: PostItemModel[];
  };
}

export async function generateStaticParams() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/post?category=all&group=all`,
    {
      cache: "force-cache",
    }
  );

  const publicPosts: PostListApiResponse = await res.json();

  return publicPosts.result.list.map((item) => ({
    id: item.post_id + "",
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  // getService
  const data = await getPostItem(id);

  if (!data) {
    notFound();
  }

  const { blog_metadata } = data;

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

  // getService
  const data = await getPostItem(id);

  if (!data) {
    notFound();
  }

  const {
    blog_metadata,
    blog_contents,
    blog_sub_group,
    category,
    comment_cnt,
  } = data;

  if (!session && blog_metadata.status === POST_STATUS.PRIVATE) {
    return <SelectPage />; //View에따라 공개여부
  }

  const contents = HtmlContentNormalizer.setImgUrl(blog_contents.contents);

  return (
    <div className=" mx-0 md:mx-auto w-full! md:w-auto  md:pt-0 md:grid-cols-[1fr_250px] md:gap-30 grid">
      {/* 본문 영역 */}
      <div className="pt-10">
        <PostVanner thumbnail_url={blog_metadata.thumbnail_url}>
          <div className={cn("py-5 flex flex-col relative z-1 ")}>
            <div className="mb-10 mt-auto">
              <div className="flex gap-2 mt-auto mb-3 ">
                <Badge
                  variant={"secondary"}
                  className={cn(blog_metadata.thumbnail_url && "rounded-full")}
                >
                  {blog_sub_group.sub_group_name}
                </Badge>
                {DateUtils.isNew(blog_metadata.created_at) && (
                  <Badge
                    variant={"secondary"}
                    className="relative rounded-full text-xs"
                  >
                    new
                  </Badge>
                )}
                {/* 비공개 시에만... */}
                {blog_metadata.status === POST_STATUS.PRIVATE && (
                  <Badge className="rounded-full">비공개</Badge>
                )}
              </div>
              <h1
                className={cn(
                  "text-3xl md:text-3xl mb-2   text-shadow-zinc-950",
                  blog_metadata.thumbnail_url &&
                    " leading-snug break-keep    whitespace-pre-line text-zinc-50"
                )}
              >
                {blog_metadata.post_title}
              </h1>
              <div className="flex gap-4 mt-10 text-zinc-50">
                <div className="text-xs  opacity-60">
                  {DateUtils.dateFormatKR(
                    blog_metadata.created_at,
                    "YYYY. MM. DD"
                  )}
                </div>
                <div className="flex gap-1 items-center">
                  <Eye size={18} className="opacity-60" />{" "}
                  <span className="text-xs opacity-60">
                    {readingTImeKO(blog_contents.contents)}분 이내 소요
                  </span>
                </div>
              </div>
            </div>
          </div>
        </PostVanner>

        <div className="grid gap-5 md:pt-10 relative">
          {/* ------ TipTap Editor - custom lib ------ */}
          <PostView contents={contents} />

          {/* ---- 댓글 ----- */}
          <h1 className="text-2xl">Comments</h1>
          <CommentSection postId={id} />

          {/* ---- post Tool bar ----- */}
        </div>
      </div>

      <div className=" hidden md:block relative ">
        <div className="sticky top-50  text-left min-h-[400px] ">
          <PostController
            postId={+id}
            thumbnail_url={blog_metadata.thumbnail_url}
            sub_group_name={blog_sub_group.sub_group_name}
            created_at={blog_metadata.created_at}
            status={blog_metadata.status}
            comment_cnt={comment_cnt}
            like_cnt={blog_metadata.like_cnt ?? 0}
          />
        </div>
      </div>
      <div className="col-span-full">
        <Suspense fallback={<LoadingSpiner />}>
          <RelatedPosts
            curPost={id}
            categoryName={category.group_name}
            subGroupName={blog_sub_group.sub_group_name}
          />
        </Suspense>
      </div>
      {/* Post Toc */}
    </div>
  );
}

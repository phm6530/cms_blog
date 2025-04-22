// 관련게시물
import { REVALIDATE } from "@/type/constants";
import { PostItemModel } from "@/type/post.type";
import { unsplashS3Mapping } from "@/util/unsplash-s3-mapping";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import Image from "next/image";
import Link from "next/link";

export default async function RelatedPosts({
  curPost,
  categoryName,
  subGroupName,
}: {
  curPost: string;
  categoryName: string;
  subGroupName: string;
}) {
  const limit = 3;

  let baseUrl = `api/post?category=${categoryName}&group=${subGroupName}&curPost=${curPost}`;
  baseUrl += `&cursor=${0}&limit=${limit}`;

  const response = await withFetchRevaildationAction<{
    list: Array<PostItemModel>;
    isNextPage: boolean;
  }>({
    endPoint: baseUrl,
    options: {
      cache: "force-cache",
      next: {
        tags: [
          REVALIDATE.POST.LIST,
          categoryName,
          subGroupName,
          `exclude=${curPost}`,
        ],
      },
    },
  });

  return (
    <>
      {response.result?.list.length !== 0 && (
        <>
          <h1 className="mb-4"> 관련 게시물</h1>
          <section className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-10 mb-10">
            {response.result?.list.map((e, idx) => {
              return (
                <Link href={`${e.post_id}`} key={`${e.post_id}:${idx}`}>
                  <article className="flex flex-col gap-3">
                    {e.thumbnail_url ? (
                      <div className="w-full aspect-[16/8] relative">
                        <Image
                          src={`${unsplashS3Mapping(e.thumbnail_url)}`}
                          alt=""
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    ) : (
                      <div className="border-t-5 p-2 "></div>
                    )}

                    <div className="flex flex-col gap-2">
                      <h3 className="break-keep text-sm md:text-base">
                        {e.post_title}
                      </h3>
                      <p className="text-xs md:text-sm line-clamp-2 leading-4 md:leading-6 text-muted-foreground">
                        {e.post_description}
                      </p>
                    </div>
                  </article>
                </Link>
              );
            })}
          </section>
        </>
      )}
    </>
  );
}

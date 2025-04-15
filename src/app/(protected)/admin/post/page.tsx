"use client";
import LoadingSpiner from "@/components/animation/loading-spiner";
import { REVALIDATE } from "@/type/constants";
import { PostItemModel } from "@/type/post.type";
import withClientFetch from "@/util/withClientFetch";
import { useQuery } from "@tanstack/react-query";
import PostListItem from "../components/post-list-item";

export default function Page() {
  const isSubGroup = "all";
  const category = "all";

  const { data, isLoading } = useQuery({
    queryKey: [REVALIDATE.BLOG.LIST],
    queryFn: async () => {
      return await withClientFetch<{ success: true; result: PostItemModel[] }>({
        endPoint: `api/post?category=${category}&group=${isSubGroup}`,
        requireAuth: true,
      });
    },
    staleTime: 10000,
  });

  if (isLoading) {
    return <LoadingSpiner />;
  }

  if (!data) {
    return <>데이터 없음</>;
  }

  return (
    <>
      <h1>내글 관리</h1>
      <section className="border divide-y">
        {data.result.map((item, idx) => {
          return (
            <PostListItem key={`admin:${item.post_id}:${idx}`} {...item} />
          );
        })}
      </section>
    </>
  );
}

import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { notFound } from "next/navigation";
import PostItem from "../../category/post-list-item";

export type PostItemModel = {
  post_id: number;
  post_title: string;
  post_description: string;
  created_at: string;
  update_at: string;
  author_id: number;
  thumbnail_url: string;
  sub_group_name: string;
  view: boolean;
  comment_count: number;
};

export default async function Category({
  params,
}: {
  params: Promise<{ category: string[] }>;
}) {
  const { category: categoryList } = await params;
  const [category, group] = categoryList;
  const isSubGroup = group ?? "all"; // 없으면 전체 다 가져오기
  const response = await withFetchRevaildationAction<PostItemModel[]>({
    endPoint: `api/post?category=${category}&group=${isSubGroup}`,
    options: {
      cache: "force-cache",
      next: {
        tags: [REVALIDATE.BLOG.LIST, category, isSubGroup],
      },
    },
  });

  if (!response.success) {
    notFound();
  }

  return (
    <section className=" flex flex-col">
      <div className="flex flex-col">
        {response.result.map((item, idx) => {
          return <PostItem {...item} key={idx} />;
        })}
      </div>
    </section>
  );
}

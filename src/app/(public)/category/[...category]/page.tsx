import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { notFound } from "next/navigation";
import PostItem from "../../category/post-list-item";
import { PostItemModel } from "@/type/post.type";

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
      cache: "no-store",
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

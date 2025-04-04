import { REVALIDATE_TAGS } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { notFound } from "next/navigation";
import PostItem from "./component/post-list-item";

export type PostItemModel = {
  post_id: number;
  post_title: string;
  post_description: string;
  create_at: string;
  update_at: string;
  author_id: number;
  thumbnail_url: string;
  view: boolean;
};

export default async function PostList({ subGroup }: { subGroup?: string }) {
  const isSubGroup = subGroup ?? "all"; // 없으면 전체 다 가져오기
  const response = await withFetchRevaildationAction<PostItemModel[]>({
    endPoint: `api/blog?group${isSubGroup}`,
    options: {
      cache: "no-store",
      next: {
        tags: [REVALIDATE_TAGS.BLOG.LIST, isSubGroup],
      },
    },
  });

  if (!response.success) {
    notFound();
  }
  ///d
  return (
    <section className="py-10 flex flex-col gap-5">
      <div className="border-b">test</div>
      {response.result.map((item, idx) => {
        return <PostItem {...item} key={idx} />;
      })}
    </section>
  );
}

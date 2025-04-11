import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { notFound } from "next/navigation";
import PostItem from "../../category/post-list-item";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

export default async function PostList({ subGroup }: { subGroup?: string }) {
  const isSubGroup = subGroup ?? "all"; // 없으면 전체 다 가져오기
  const response = await withFetchRevaildationAction<PostItemModel[]>({
    endPoint: `api/blog?group=${isSubGroup}`,
    options: {
      cache: "force-cache",
      next: {
        tags: [REVALIDATE.BLOG.LIST, isSubGroup],
      },
    },
  });

  if (!response.success) {
    notFound();
  }

  ///d
  return (
    <section className="pt-10 flex flex-col">
      <div className="grid grid-cols-[auto_1fr] justify-between items-center gap-5 border-b pb-4 py-10">
        <span className="text-3xl font-Poppins font-extrabold">
          {isSubGroup === "all" ? "Blog" : isSubGroup}
        </span>
        {/* <span className="border-b border-foreground/40 w-[50px]"></span> */}
        <Button className="ml-auto text-xs " variant={"outline"}>
          <Link className="flex" href={"/write"}>
            글쓰기
          </Link>
        </Button>
      </div>

      <div className="flex flex-col">
        {response.result.map((item, idx) => {
          return <PostItem {...item} key={idx} />;
        })}
      </div>
    </section>
  );
}

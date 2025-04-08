import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { notFound } from "next/navigation";
import PostItem from "./component/post-list-item";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type PostItemModel = {
  post_id: number;
  post_title: string;
  post_description: string;
  create_at: string;
  update_at: string;
  author_id: number;
  thumbnail_url: string;
  sub_group_name: string;
  view: boolean;
  comment_count: number;
};

export default async function PostList({
  subGroup,
  searchKeyword,
}: {
  subGroup?: string;
  searchKeyword: string | null;
}) {
  const isSubGroup = subGroup ?? "all"; // 없으면 전체 다 가져오기
  let endPoint = `api/blog?group=${isSubGroup}`;
  if (!!searchKeyword) {
    endPoint += `&keyword=${searchKeyword}`;
  }
  const response = await withFetchRevaildationAction<PostItemModel[]>({
    endPoint,
    options: {
      cache: !!searchKeyword ? "no-store" : "force-cache",
      next: {
        tags: [REVALIDATE.BLOG.LIST, isSubGroup],
      },
    },
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (!response.success) {
    notFound();
  }
  ///d
  return (
    <section className="py-10 flex flex-col gap-5">
      <div className="grid grid-cols-[auto_1fr] justify-between items-center gap-5 ">
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

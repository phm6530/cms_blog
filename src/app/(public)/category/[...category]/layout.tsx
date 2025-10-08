import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PostListNav from "../post-list-nav";
import SearchInput from "@/components/ui/search-input";
import { auth } from "@/auth";
import { PostBreadcrumb } from "../post-breadcrumb";

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ category: string[] }>;
  children: ReactNode;
}) {
  const { category: categoryList } = await params;
  const [category, group] = categoryList;

  const session = await auth();
  const curCategory = decodeURIComponent(category);
  const curSubCategory = group ? decodeURIComponent(group) : null;

  return (
    <>
      <div className=" md:hidden  mt-4">
        <SearchInput name="keyword" />
      </div>
      <div className="mt-auto   items-end  w-full">
        <div className="flex flex-col items-start pt-16">
          <div className="text-5xl ">
            {curCategory.slice(0, 1).toUpperCase() + curCategory.slice(1)}
          </div>
          <p className="text-muted-foreground mt-3">
            프론트엔드 개발자 , PHM입니다. 저를 기록합니다.
          </p>
        </div>

        <div className=" flex gap-2">
          <div className="w-full overflow-hidden left-0 absolute md:static! top-[5px]">
            <PostListNav
              curCategory={curCategory}
              curSubGroup={curSubCategory}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center gap-5 border-b pb-4 mb-10 mt-10">
        <PostBreadcrumb paths={[curCategory, curSubCategory].filter(Boolean)} />

        {session?.user && (
          <Button className="ml-auto text-xs " variant={"ghost"}>
            <Link className="flex" href={"/write"}>
              글쓰기
            </Link>
          </Button>
        )}
      </div>

      {children}
    </>
  );
}

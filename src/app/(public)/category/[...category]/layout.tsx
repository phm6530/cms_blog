import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PostListNav from "../post-list-nav";
import SearchInput from "@/components/ui/search-input";
import { auth } from "@/auth";

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
  return (
    <>
      <div className=" md:hidden md:mb-10 mb-4 mt-4">
        <SearchInput name="keyword" />
      </div>
      <div className="h-20 md:h-auto! w-[calc(100%+39px)] relative -translate-x-[19px] md:mb-14">
        <div className="w-full overflow-hidden left-0 absolute md:static! top-[5px]">
          <PostListNav
            curCategory={decodeURIComponent(category)}
            selectGroup={
              decodeURIComponent(group) === "undefined"
                ? "all"
                : decodeURIComponent(group)
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-[auto_1fr]  justify-between items-center gap-5 border-b pb-4 ">
        <div className="flex gap-2 items-end">
          <span className=" text-lg md:text-3xl font-Poppins">
            {decodeURIComponent(category)}
          </span>
          {group && (
            <>
              <span className="opacity-30">/</span>
              <span className="opacity-90"> {decodeURIComponent(group)}</span>
            </>
          )}
        </div>

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

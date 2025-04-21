import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PostListNav from "../post-list-nav";

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ category: string[] }>;
  children: ReactNode;
}) {
  const { category: categoryList } = await params;
  const [category, group] = categoryList;

  return (
    <>
      <div className="h-24 md:h-auto! w-[calc(100%+39px)] relative -translate-x-[19px] md:mb-14">
        <div className="w-full overflow-hidden left-0 absolute md:static! top-[20px]">
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

        {/* <span className="border-b border-foreground/40 w-[50px]"></span> */}
        <Button className="ml-auto text-xs " variant={"outline"}>
          <Link className="flex" href={"/write"}>
            글쓰기
          </Link>
        </Button>
      </div>
      {children}
    </>
  );
}

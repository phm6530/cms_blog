import { ReactNode } from "react";
// import PostListNav from "../_____blog/[group]/component/post-list-nav";
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
      <PostListNav
        curCategory={decodeURIComponent(category)}
        selectGroup={decodeURIComponent(group)}
      />

      <div className="grid grid-cols-[auto_1fr] justify-between items-center gap-5 border-b pb-4 py-10">
        <div className="flex gap-2 items-end">
          <span className="text-3xl font-Poppins">
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

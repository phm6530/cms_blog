import { CategoryModel } from "@/type/blog-group";
import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import SearchInput from "../ui/search-input";
import ThemeHandler from "./ThemeHandler";

export default async function Nav() {
  const response = await withFetchRevaildationAction<{
    category: { [key: string]: CategoryModel };
    count: number;
  }>({
    endPoint: "api/category",
    options: {
      cache: "force-cache",
      next: {
        tags: [REVALIDATE.BLOG.GROUPS],
      },
    },
  });

  if (!response.success) {
    notFound();
  }
  const { category } = response.result;
  return (
    <nav className="border-b py-4">
      <div className="grid-layout flex items-center gap-5 ">
        <Link href={"/"} className="text-sm">
          HOME
        </Link>

        {/* cateogry list */}
        {Object.keys(category).map((e) => {
          return (
            <Link href={`/category/${e}`} className="text-sm" key={e}>
              {e.toUpperCase()}
            </Link>
          );
        })}

        <Link href={"/guestbook"} className="text-sm">
          GUEST BOARD
        </Link>

        <Suspense fallback={<>loading..</>}>
          <SearchInput name="keyword" className="placeholder:text-xs!" />
        </Suspense>
        <ThemeHandler />
      </div>

      {/* <div className="grid-layout flex items-center gap-5 ">
        {navlist.map((link, idx) => {
          if (link.href === "/login") {
            if (!isClient || isLoading) {
              return (
                <Skeleton
                  key={`skeleton-${idx}`}
                  className="w-[40px] h-[12px] rounded-md"
                />
              );
            } else if (session) {
              return <Navsession />;
            }
          }

          return (
            <Link key={link.href} href={link.href} className="text-sm">
              {link.name}
            </Link>
          );
        })}

        <Suspense fallback={<>loading..</>}>
          <SearchInput name="keyword" className="placeholder:text-xs!" />
        </Suspense>
        <ThemeHandler />
      </div> */}
    </nav>
  );
}

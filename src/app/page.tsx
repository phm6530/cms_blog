import NavList from "@/components/layout/nav-list";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui/search-input";
import PinnedPosts from "@/components/weiget/pinned-post";
import RecentComment from "@/components/weiget/recent-comments";
import RecentGuestBoard from "@/components/weiget/recent-guestboard";
import RecentPost from "@/components/weiget/recent-post";
import { cn } from "@/lib/utils";
import getCategories from "@/service/get-category";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function Home() {
  const response = await getCategories();

  if (!response) {
    notFound();
  }
  const { categories, count: allcount } = response;

  const mappingCategories = Object.entries(categories).map((e) => {
    return { label: e[1].name, postCnt: e[1].postCnt };
  });

  console.log(mappingCategories);

  const tabs = [{ label: "Home", postCnt: allcount }, ...mappingCategories];

  return (
    <>
      <div className="relative w-full bg-cover bg-center   grayscale-75 ">
        {/* gradient overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/100 pointer-events-none" /> */}

        <div className="relative w-full  flex justify-between">
          <div className="mt-auto pb-10  items-end gap-20 w-full">
            <div className="flex flex-col items-start pt-16 border-b pb-4">
              <div className="text-5xl ">Phm, Dev Blog</div>
              <p className="text-muted-foreground mt-3">
                프론트엔드 개발자 , PHM입니다. 저를 기록합니다.
              </p>
              {/* <VisitorWiget /> */}
            </div>

            {/* <RecentComment /> */}
            {/* <RecentGuestBoard /> */}
            {/* <div className="mt-10 flex gap-2">
              {tabs.map((e, idx) => (
                <Link
                  key={idx}
                  href={`/category/${e.label}`}
                  className={cn(
                    "hover:text-indigo-300",
                    "text-xs  border p-3 px-5 rounded-3xl! border-t  transition-all flex gap-2 items-center"
                  )}
                >
                  <span>{e.label} </span>

                  <span className="opacity-50 text-[11px]">({e.postCnt})</span>
                </Link>
              ))}
            </div> */}
          </div>
        </div>
      </div>

      <div className="">
        <div className="col-span-2  col-start-2 flex flex-col gap-10 w-full  ">
          {/* 고정 */}

          {/* 최신글 */}
          <PinnedPosts />
          <RecentPost />
        </div>
      </div>
    </>
  );
}

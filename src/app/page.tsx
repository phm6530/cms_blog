import TitleBlurAnimation from "@/components/ani-components/title-blur-animation";
import PinnedPosts from "@/components/weiget/pinned-post";
import RecentPost from "@/components/weiget/recent-post";
import React from "react";

export default async function Home() {
  return (
    <>
      <div className=" relative w-full bg-cover bg-center   grayscale-75 ">
        {/* gradient overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/100 pointer-events-none" /> */}

        <div className="relative w-full  flex justify-between">
          <div className="mt-auto pb-10 pt-10 items-end gap-20 w-full">
            <TitleBlurAnimation
              title="Phm, Dev Blog"
              mutedText="프론트엔드 개발자 , PHM입니다. 저를 기록합니다."
            />
            {/* <RecentComment /> */}
            {/* <RecentGuestBoard /> */}

            {/* <NavCategories /> */}
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

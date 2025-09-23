import PinnedPosts from "@/components/weiget/pinned-post";

import RecentPost from "@/components/weiget/recent-post";

export default function Home() {
  return (
    <>
      <div className="col-span-2  col-start-2 flex flex-col gap-10 w-full  ">
        {/* 고정 */}

        {/* 최신글 */}
        <PinnedPosts />
        <RecentPost />
      </div>
    </>
  );
}

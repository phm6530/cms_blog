import PinnedPosts from "@/components/weiget/pinned-post";
import RecentComment from "@/components/weiget/recent-comments";
import RecentPost from "@/components/weiget/recent-post";
import VisitorWiget from "@/components/weiget/visitor-weiget";

export default function Home() {
  return (
    <>
      <div
        className="relative w-full h-160 bg-cover bg-center p-5 md:p-10 md:px-15 grayscale-75"
        style={{ backgroundImage: 'url("/img/k6.jpg")' }}
      >
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/100 pointer-events-none" />

        <div className="relative w-full max-w-6xl mx-auto h-full flex justify-between">
          <div className="mt-auto pb-10 grid grid-cols-[2fr_1fr_1fr] items-end gap-20 w-full">
            <div className="flex flex-col items-start">
              <div className="text-7xl">
                PHM,
                <br /> DEV BLOG
              </div>
              <p className="text-zinc-400 mt-3">
                프론트엔드 개발자 , PHM입니다. 저를 기록합니다.
              </p>
              <VisitorWiget />
            </div>
            <RecentComment />
            {/* <RecentGuestBoard /> */}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
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

import PinnedPosts from "@/components/weiget/pinned-post";
import RecentComment from "@/components/weiget/recent-comments";
import RecentGuestBoard from "@/components/weiget/recent-guestboard";
import RecentPost from "@/components/weiget/recent-post";

export default function Home() {
  return (
    <>
      <div className="col-span-2 col-start-2 flex flex-col gap-10 w-full">
        {/* 고정 */}
        <PinnedPosts />
        {/* 최신글 */}
        <RecentPost />
        {/* 방명록 */}
        <div className="grid grid-cols-2 gap-10">
          <RecentComment />
          <RecentGuestBoard />
        </div>
      </div>
    </>
  );
}

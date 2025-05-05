import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { notFound } from "next/navigation";
import GuestBookItem from "./components/guestbook-item";
import { CommentItemModel } from "@/lib/comment-bff";
import CommentForm from "@/components/comments/comment-form";

export default async function GuestBookPage() {
  const response = await withFetchRevaildationAction<CommentItemModel[]>({
    endPoint: "api/guestboard",
    options: {
      next: {
        tags: [REVALIDATE.GUEST_BOARD.GETBOARD],
      },
      cache: "force-cache",
    },
  });

  if (!response.success) {
    notFound();
  }

  return (
    <div className="max-w-[800px] mx-auto pt-[50px]">
      <span className="text-2xl md:text-3xl  font-SUIT-Regular flex items-center gap-5">
        GUEST BOOK
      </span>
      <p className="pt-3 text-xs flex items-center gap-2 opacity-70 ">
        방문 감사합니다 !
      </p>
      <section className="my-6">
        <CommentForm targetSchema="guestbook" />
      </section>

      {response.result.map((item, idx) => {
        return <GuestBookItem deps={0} {...item} key={idx} />;
      })}
    </div>
  );
}

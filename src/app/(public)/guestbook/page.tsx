import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { notFound } from "next/navigation";
import GuestBookItem from "./components/guestbook-item";
import { BadgeInfo } from "lucide-react";
import { CommentItemModel } from "@/lib/comment-bff";
import CommentForm from "@/components/comments/comment-form";

export default async function GuestBookPage() {
  const response = await withFetchRevaildationAction<CommentItemModel[]>({
    endPoint: "api/guestboard",
    options: {
      next: {
        tags: [REVALIDATE.GUEST_BOARD.GETBOARD],
      },
      cache: "no-cache",
    },
  });

  if (!response.success) {
    notFound();
  }

  return (
    <div className="max-w-[800px] mx-auto pt-[50px]">
      <span className="text-3xl font-Poppins font-extrabold">Guest Book</span>
      <p className="pt-3 text-xs flex items-center gap-2 opacity-70">
        <BadgeInfo /> 방문
      </p>
      <section className="my-6">
        <CommentForm targetSchema="guestbook" />
      </section>

      <section className="grid grid-cols-2 gap-4">
        {response.result.map((item, idx) => {
          return <GuestBookItem deps={0} {...item} key={idx} />;
        })}
      </section>
    </div>
  );
}

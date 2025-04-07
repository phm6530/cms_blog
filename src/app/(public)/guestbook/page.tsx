import { GuestBookModel } from "@/app/api/guestboard/route";
import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { notFound } from "next/navigation";
import GuestBookForm from "./components/guestbook-form";
import GuestBookItem from "./components/guestbook-item";
import { Info } from "lucide-react";

export default async function GuestBookPage() {
  const response = await withFetchRevaildationAction<GuestBookModel[]>({
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
      <span className="text-3xl font-Poppins font-extrabold">Guest Book</span>
      <p className="pt-3 text-xs flex items-center gap-2 opacity-70">
        <Info /> 댓글 부탁드려요
      </p>
      <GuestBookForm />
      <hr />
      {response.result.map((item, idx) => {
        return <GuestBookItem deps={0} {...item} key={idx} />;
      })}
    </div>
  );
}

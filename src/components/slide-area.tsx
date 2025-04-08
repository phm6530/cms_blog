import Image from "next/image";
import { Button } from "./ui/button";
import { Github, Hammer, MessageCircleMore } from "lucide-react";
import RecentPost from "./weiget/recent-post";
import RecentComment from "./weiget/recent-comments";

export default function SideArea() {
  return (
    <div className="flex flex-col gap-7  ">
      <div className="flex items-center flex-col">
        <div className="max-w-[180px] w-[90%] relative aspect-[16/16] rounded-full overflow-hidden border-4  ">
          <Image
            src={"/img/my-dog.jpg"}
            fill
            alt=""
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="text-sm text-center pt-5">
          @Web publisher <br /> @Front Developer
        </div>
        {/* <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-t-transparent border-zinc-400 rounded-full animate-spin "></div>
          </div> */}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button variant={"outline"} className="flex-1">
          <MessageCircleMore className="w-6 h-6" />
        </Button>
        <Button variant={"outline"} className="flex-1">
          <Github />
        </Button>
        <Button variant={"outline"} className="flex-1">
          <Hammer />
        </Button>
        <Button className="col-span-3 mt-5 py-5">글쓰기</Button>
      </div>

      <div className="flex flex-col items-end gap-3  rounded-3xl">
        <span className="text-xs opacity-50">전체 방문자</span>
        <div className="flex gap-3 items-end">
          {/* <UserRound size={20} className="mb-1" /> */}
          <h3 className="text-3xl tracking-tighter font-Poppins">252,005</h3>
        </div>
        <span className="text-xs opacity-50">Today 0</span>
      </div>
      <RecentPost />
      <RecentComment />
    </div>
  );
}

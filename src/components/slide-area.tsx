import Image from "next/image";
import { Button } from "./ui/button";
import { Github, Hammer, MessageCircleMore } from "lucide-react";
import RecentPost from "./weiget/recent-post";
import RecentComment from "./weiget/recent-comments";

import PinnedPosts from "./weiget/pinned-post";
import CategoryWegiet from "./weiget/category-weiget";
export default function SideArea() {
  return (
    <div className="grid grid-cols-[250px_1fr_1fr]  gap-10  mt-16">
      <div className="max-w-[250px] w-full border-r pr-5">
        <div className="flex items-center flex-col">
          <div className="max-w-[180px] w-[90%] relative aspect-[16/16] rounded-full overflow-hidden border-5 border-foreground/10">
            <Image
              src={"/img/my-dog.jpg"}
              fill
              alt=""
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="text-sm text-center py-5">
            @Web publisher <br /> @Front Developer
          </div>
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
          {/* <Button className="col-span-3 mt-5 py-5">글쓰기</Button> */}
          <CategoryWegiet />
        </div>
      </div>

      <div className="col-span-2 col-start-2 flex flex-col gap-10">
        <PinnedPosts />

        <div className="grid grid-cols-2 gap-10">
          <RecentPost />
          <RecentComment />
        </div>
      </div>
    </div>
  );
}

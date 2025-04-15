import Image from "next/image";
import { Button } from "./ui/button";
import { Github, Hammer, MessageCircleMore } from "lucide-react";
import CategoryWegiet from "./weiget/category-weiget";
import VisitorWigetV2 from "./weiget/visitor-weiget-v2";

export default function SideArea() {
  return (
    <div className="max-w-[250px] w-full pt-15 border-r border-secondary-foreground/10 ">
      <div className="rounded-lg">
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
        <div className="flex items-center justify-center gap-2">
          <Button variant={"ghost"}>
            <MessageCircleMore />
          </Button>
          <Button variant={"ghost"}>
            <Github />
          </Button>
          <Button variant={"ghost"}>
            <Hammer />
          </Button>
          {/* <Button className="col-span-3 mt-5 py-5">글쓰기</Button> */}
        </div>
      </div>

      <CategoryWegiet />
      <VisitorWigetV2 />
    </div>
  );
}

import Image from "next/image";
import { Button } from "./ui/button";
import { Github, Hammer, MessageCircleMore } from "lucide-react";
import CategoryWegiet from "./weiget/category-weiget";
import VisitorWigetV2 from "./weiget/visitor-weiget-v2";
import Link from "next/link";

export default function SideArea() {
  return (
    <div className="max-w-[250px] md:block hidden w-full pt-15 border-r border-secondary-foreground/10 ">
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
          <Button asChild variant={"ghost"}>
            <Link href={"https://open.kakao.com/o/sq4skkTf"} target="_blank">
              <MessageCircleMore />
            </Link>
          </Button>
          <Button asChild variant={"ghost"}>
            <Link href={"https://github.com/phm6530/"} target="_blank">
              <Github />
            </Link>
          </Button>
          <Button asChild variant={"ghost"}>
            <Link href={"https://www.h-creations.com/"} target="_blank">
              <Hammer />
            </Link>
          </Button>
        </div>
      </div>

      <CategoryWegiet />
      <VisitorWigetV2 />
    </div>
  );
}

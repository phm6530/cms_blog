import Image from "next/image";
import { Button } from "./ui/button";
import { Github, Hammer, MessageCircleMore } from "lucide-react";
import CategoryWegiet from "./weiget/category-weiget";

export default function SideArea() {
  return (
    <div className="max-w-[250px] w-full  pr-5 sticky top-0 ">
      <div className="border py-5 rounded-lg">
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
      <div className="border-t leading-6 pt-5 text-xs opacity-50">
        <p>squirrel309@naver.com</p>
        <p> Copyright ⓒ p. Hyun</p>
      </div>
    </div>
  );
}

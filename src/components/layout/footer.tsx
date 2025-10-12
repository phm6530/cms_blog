import { GithubIcon, Hammer, MessageCircleMore } from "lucide-react";
import { Button } from "../ui/button";

export default function Footer() {
  return (
    <footer className=" items-center grid-layout pb-15">
      <div className="border-t w-full py-12 flex flex-col justify-center items-center  gap-5 text-center">
        <div className="flex gap-2 ">
          <Button
            variant={"outline"}
            className="rounded-full size-10 bg-transparent!"
          >
            <GithubIcon />
          </Button>

          <Button
            variant={"outline"}
            className="rounded-full size-10 bg-transparent!"
          >
            <MessageCircleMore className="w-6 h-6" />
          </Button>

          <Button
            variant={"outline"}
            className="rounded-full size-10 bg-transparent!"
          >
            <Hammer />
          </Button>
        </div>

        <p className="flex items-center ">
          <span className="text-xs">squirrel309@naver.com</span>
        </p>

        <p className="flex items-center  opacity-50">
          <span className="text-xs"> Copyright ⓒ p. Hyun</span>
        </p>
      </div>
    </footer>
  );
}

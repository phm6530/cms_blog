import { GithubIcon, Hammer, MessageCircleMore } from "lucide-react";
import { Button } from "../ui/button";

export default function Footer() {
  return (
    <footer className="w-full text-center items-center  grid-layout py-12 flex flex-col gap-5 border-t">
      <div className="flex gap-2">
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
    </footer>
  );
}

import {
  ChartAreaIcon,
  GithubIcon,
  Hammer,
  Mail,
  MessageCircleMore,
} from "lucide-react";
import { Button } from "../ui/button";

export default function Footer() {
  return (
    <footer className="w-full text-center items-center mt-20 grid-layout border-t py-12 flex flex-col gap-5">
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

      <p className="max-w-[600px] text-xs leading-5">
        이미지 저작권은 유료 프리픽을 라이센스를 사용중이며, 게시물은 상업적
        목적이 아닌 포트폴리오 목적으로만 사용됩니다.<br></br> 아직 공개되지
        않은 작업물은 포함하지 않으며, 오직 공개된 작업물만을 게시합니다.
      </p>
      <p className="flex items-center text-xs">
        <span>squirrel309@naver.com</span>
      </p>
      <p className="flex items-center text-xs opacity-50">
        <span> Copyright ⓒ p. Hyun</span>
      </p>
    </footer>
  );
}

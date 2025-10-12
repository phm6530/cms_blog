import { GithubIcon, Hammer, MessageCircleMore } from "lucide-react";
import { Button } from "../ui/button";

const portfolio = [
  {
    icon: <GithubIcon className="w-6 h-6" />,
    url: "https://github.com/phm6530/",
  },
  {
    icon: <MessageCircleMore className="w-6 h-6" />,
    url: "https://open.kakao.com/o/sq4skkTf",
  },
  {
    icon: <Hammer className="w-6 h-6" />,
    url: "https://www.h-creations.com/",
  },
];

export default function Footer() {
  return (
    <footer className="items-center grid-layout pb-15">
      <div className="border-t w-full py-12 flex flex-col justify-center items-center gap-5 text-center">
        <div className="flex gap-2">
          {portfolio.map((item, idx) => (
            <Button
              asChild
              key={idx}
              variant="outline"
              className="rounded-full size-10 bg-transparent!"
            >
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.icon}
              </a>
            </Button>
          ))}
        </div>

        <p className="flex items-center">
          <span className="text-xs">squirrel309@naver.com</span>
        </p>

        <p className="flex items-center opacity-50">
          <span className="text-xs">Copyright ⓒ p. Hyun</span>
        </p>
      </div>
    </footer>
  );
}

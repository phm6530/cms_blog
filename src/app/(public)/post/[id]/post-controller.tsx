"use client";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, MessageSquareMore } from "lucide-react";
import PostToolbar from "../post-toolbar";
import PostToc from "../post-toc";
import { cn } from "@/lib/utils";
import { DateUtils } from "@/util/date-uill";
import { POST_STATUS } from "@/type/constants";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import PostLikeHandler from "../post-like-hanlder";

export default function PostController({
  postId,
  sub_group_name,
  created_at,
  status,
  comment_cnt,
  like_cnt,
}: {
  postId: number;
  thumbnail_url: string | null;
  sub_group_name: string;
  created_at: Date;
  status: string;
  comment_cnt: number;
  like_cnt: number;
}) {
  const tocRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<HTMLDivElement>(null);

  const [toggle, setToggle] = useState<boolean>(false);

  useGSAP(
    () => {
      if (toggle) {
        gsap.to(controllerRef.current, {
          x: -20,
          opacity: 0,
          filter: "blur(10px)",
          duration: 0.4,
          ease: "power2.out",
        });
        gsap.fromTo(
          tocRef.current,
          { x: 20, opacity: 0, filter: "blur(10px)" },
          {
            x: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.4,
            ease: "power2.out",
          }
        );
      } else {
        gsap.to(tocRef.current, {
          x: 20,
          opacity: 0,
          filter: "blur(10px)",
          duration: 0.4,
          ease: "power2.out",
        });
        gsap.fromTo(
          controllerRef.current,
          { x: -20, opacity: 0, filter: "blur(10px)" },
          {
            x: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.4,
            ease: "power2.out",
          }
        );
      }
    },
    { dependencies: [toggle] }
  );

  return (
    <div className="flex flex-col gap-10 bg-zinc-100 lg:bg-transparent">
      <div className="flex-col gap-6 hidden lg:flex  ">
        <div className=" flex   gap-4 items-center">
          <div
            className="size-10 shadow-2xl  border-3 border-white/50  rounded-full bg-gray-500/10 flex justify-center items-center relative  bg-cover"
            style={{
              backgroundImage: "url(/img/my-dog.jpg)",
            }}
          ></div>
          <div>
            <h1 className="text-lg">Phm_</h1>
            <p className="text-xs text-muted-foreground">@Front Developer</p>
          </div>
        </div>
        <div
          onClick={() => setToggle((prev) => !prev)}
          className="text-xs group p-3 rounded-full flex gap-3 items-center justify-center cursor-pointer border hover:border-zinc-400"
        >
          <span>{!toggle ? "목차보기" : "패널 전환"}</span>
          <ArrowLeftRight
            size={14}
            className="group-hover:rotate-180 transition-all duration-500 opacity-70 group-hover:opacity-100"
          />
        </div>
      </div>

      <div className="relative transition-all duration-400 flex ">
        {/* Controller */}
        <div
          ref={controllerRef}
          className={cn(
            "lg:absolute  inset-0 flex lg:flex-col gap-10 w-calc-8 md:w-calc-0 justify-between mx-auto py-3 ",
            toggle && "pointer-events-none"
          )}
        >
          <div className="hidden  lg:flex gap-2 flex-col  ">
            <h2 className="text-xs text-muted-foreground">카테고리</h2>
            <div className="flex gap-1">
              <Badge variant={"secondary"}>{sub_group_name}</Badge>
              {DateUtils.isNew(created_at) && (
                <Badge variant={"secondary"}>new</Badge>
              )}
              {status === POST_STATUS.PRIVATE && (
                <Badge className="rounded-full">비공개</Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="hidden lg:block text-xs text-muted-foreground">
              본문 크기
            </h2>
            <PostToolbar />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="hidden lg:block text-xs text-muted-foreground">
              포스트 인사이트
            </h2>
            <div className="flex gap-0 ">
              <div className="grid grid-cols-2 gap-2 items-center">
                <span className="flex gap-1 items-center text-xs  size-7 justify-center text-muted-foreground rounded-lg bg-foreground/2">
                  <MessageSquareMore size={13} />
                </span>
                <span className="text-xs ">{comment_cnt}</span>
              </div>

              <PostLikeHandler postId={postId} likeCnt={like_cnt} />
            </div>
          </div>
        </div>

        {/* TOC */}
        <div
          ref={tocRef}
          className={cn(
            "absolute inset-0 opacity-0 pointer-events-auto ",
            !toggle && "pointer-events-none"
          )}
        >
          <PostToc />
        </div>
      </div>
    </div>
  );
}

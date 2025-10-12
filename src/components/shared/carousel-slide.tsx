"use client";
import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { PostItemModel } from "@/type/post.type";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { unsplashS3Mapping } from "@/util/unsplash-s3-mapping";
import { Button } from "../ui/button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { PinIcon } from "lucide-react";
import Link from "next/link";

export function CarouselSlide({ postList }: { postList: PostItemModel[] }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const router = useRouter();
  const ref = React.useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useLayoutEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  React.useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useGSAP(
    () => {
      if (!ref.current) return;
      const tl = gsap.timeline({
        defaults: { autoAlpha: 0, ease: "power1.out" },
      });
      tl.from(ref.current, {
        delay: 0.8,
        y: 20,
        autoAlpha: 0,
        filter: "blur(5px)",
        duration: 1,
        ease: "power3.out",
      });
    },
    { scope: ref, dependencies: [] }
  );

  return (
    <section className="relative invisible" ref={ref}>
      <h1 className="text-sm flex mb-2 gap-2 items-center">
        <PinIcon size={14} />
        <span>Pinned Posts</span>
      </h1>
      <Carousel
        opts={{
          loop: true,
          containScroll: "trimSnaps",
        }}
        setApi={setApi}
      >
        <CarouselContent>
          {postList.map((data, index) => (
            <CarouselItem
              key={index}
              className="grid cursor-pointer sm:cursor-auto  sm:grid-cols-[4fr_3fr] md:gap-[3rem] basis-1/1  relative "
              onClick={() => {
                if (isMobile) router.push(`/post/${data.post_id}`);
              }}
            >
              <div
                className=" relative  aspect-[15/19]  sm:aspect-[10/12] md:aspect-auto overflow-hidden  after:absolute after:inset-0 after:animate-opacity after:bg-cover  after:bg-center md:rounded-2xl after:bg-no-repeat after:content-['']
        sm:after:bg-gradient-to-b after:bg-gradient-to-t sm:after:from-zinc-950/0 after:from-zinc-950 after:via-zinc-700/5 after:to-zinc-950  rounded-3xl    text-white  md:min-h-[440px]"
              >
                <div
                  className="absolute  w-full h-full  rounded-2xl bg-center top-0 left-0    "
                  style={{
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center center",
                    animation: `
            bgScaleInit 5s cubic-bezier(0, 0.75, 0, 0.62) forwards, 
            bgScaleLoop 10s 5s ease  infinite alternate,
            opacity .5s ease-out forwards`,
                    backgroundImage: `url(${unsplashS3Mapping(
                      data.thumbnail_url
                    )})`,
                  }}
                ></div>
                <div
                  className="absolute p-5 bottom-0  z-2 bg-red-50/5 rounded-tr-2xl"
                  style={{
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <span className="text-base opacity-45 font-extrabold">
                    0{current}
                  </span>
                </div>
              </div>
              <div className="flex flex-col py-12 h-full   z-10 rounded-tl-2xl px-10 md:px-0  absolute pointer-events-none sm:pointer-events-auto sm:static w-full    sm:gap-5 ">
                <div className="flex gap-2 ">
                  <Badge variant={"secondary"} className="text-[10px] ">
                    {data.sub_group_name}
                  </Badge>
                </div>

                <h1 className="text-shadow leading-relaxed sm:leading-snug text-zinc-50 sm:text-foreground  mt-3 sm:mt-0 z-10  max-w-[400px] md:max-w-full text-[clamp(1.2rem,5vw,1.7rem)] sm:text-2xl lg:text-3xl  break-keep whitespace-pre-line ">
                  {data.post_title}
                </h1>
                <div className="mt-auto sm:mt-0  w-full">
                  <p className="text-sm text-right sm:text-left line-clamp-3 ml-auto sm:ml-0 max-w-[250px] sm:line-clamp-3 sm:text-sm leading-relaxed z-10 mt-6  text-zinc-100/70  md:max-w-full  sm:text-muted-foreground md:w-[90%]">
                    {data.post_description}
                  </p>
                </div>

                <div className="text-xs hidden sm:flex gap-3 z-1  mt-auto">
                  <Button className="text-xs p-5 px-6" asChild>
                    <Link href={`/post/${data.post_id}`}>Read More</Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-[-17px] md:flex hidden  bg-background! border-transparent! hover:border-border!" />
        <CarouselNext className="right-[-17px] md:flex hidden bg-background! border-transparent! hover:border-border!" />
      </Carousel>
      <div className="mt-3 flex gap-1 justify-center h-3">
        {Array.from({ length: count }).map((_, idx) => {
          return (
            <div
              key={`nav-${idx}`}
              className={cn(
                " rounded-full bg-muted-foreground/40 cursor-pointer size-2 transition-all",
                idx + 1 === current && " h-2 w-5 bg-muted-foreground/80"
              )}
              onClick={() => {
                api?.scrollTo(idx);
              }}
            ></div>
          );
        })}
      </div>
    </section>
  );
}

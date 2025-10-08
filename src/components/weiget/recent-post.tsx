import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { PostItemModel } from "@/type/post.type";
import PostItem from "@/app/(public)/category/post-list-item";

import VisitorWigetV2 from "./visitor-weiget-v2";
import { Github, Briefcase } from "lucide-react";
import Link from "next/link";

type PortfolioProject = {
  title: string;
  description: string;
  url: string;
};

export default async function RecentPost() {
  const { success, result } = await withFetchRevaildationAction<{
    list: PostItemModel[];
    isNextPage: boolean;
  }>({
    endPoint: `api/post?category=all&group=all`,
    options: {
      cache: "force-cache",
      next: {
        tags: [REVALIDATE.POST.LIST, "all"],
      },
    },
  });

  if (!success) throw new Error("에러...");

  const posts = result.list;

  // 포트폴리오 데이터 (실제라면 DB/API 연동 가능)
  const portfolio: PortfolioProject[] = [
    {
      title: "Interactive Portfolio",
      description: "React + GSAP 기반 인터랙티브 포트폴리오",
      url: "https://www.h-creations.com/",
    },
    {
      title: "GitHub",
      description: "개인 프로젝트와 소스코드 저장소",
      url: "https://github.com/phm6530/",
    },
    {
      title: "KakaoTalk",
      description: "실시간 연락하기 (오픈채팅)",
      url: "https://open.kakao.com/o/xxxxxxx",
    },
    {
      title: "Personal Library",
      description: "개인 아카이브 · 자료 정리용 웹앱",
      url: "https://lib-archive.vercel.app/",
    },
  ];

  return (
    <section className="flex flex-col">
      {/* 상단 위젯 박스 */}
      <div className="grid grid-cols-2 gap-10 bg-secondary/40 p-5 mb-20 mt-5 rounded-xl">
        {/* 방문자 위젯 */}
        <div className="flex flex-col gap-4">
          <VisitorWigetV2 />
          <div className="mt-auto text-xs text-muted-foreground">
            @Web publisher <br /> @Front Developer
          </div>
        </div>

        {/* Portfolio Widget */}
        <div className="flex flex-col gap-2 border-l pl-5">
          <div className="grid grid-cols-2 gap-3 py-2">
            {portfolio.map((proj, idx) => (
              <Link
                key={idx}
                href={proj.url}
                target="_blank"
                className="flex flex-col group"
              >
                <span className="font-medium group-hover:underline group-hover:text-indigo-300 text-sm ">
                  {proj.title}
                </span>
                <span className="text-muted-foreground text-xs ">
                  {proj.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 최근 포스팅 */}
      <div className="flex flex-col">
        <h2 className="col-span-full mb-4 text-lg font-semibold">
          최근 포스팅
        </h2>
        <div className="grid grid-cols-3 gap-8 space-y-12">
          {!posts?.length ? (
            <div className="col-span-full text-sm text-muted-foreground">
              등록된 콘텐츠가 없습니다.
            </div>
          ) : (
            posts
              .slice(0, 12)
              .map((item) => <PostItem {...item} key={item.post_id} />)
          )}
        </div>
      </div>
    </section>
  );
}

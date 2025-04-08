import { Suspense } from "react";
import PostListNav from "./component/post-list-nav";
import PostList from "./post-list";
import LoadingSpiner from "@/components/animation/loading-spiner";
import SearchInput from "@/components/ui/search-input";
import dynamic from "next/dynamic";

const DynamicTemplateController = dynamic(
  () => import("./post-list"),
  { ssr: true } // 클라이언트 측에서만 렌더링
);

export default async function PostPage({
  params,
  searchParams,
  searchKeyword,
}: {
  params: Promise<{ group?: string }>;
  searchParams?: Promise<{ search?: string }>;
  searchKeyword: string | null;
}) {
  const { group: subGroup } = await params;

  return (
    <div className="mt-10">
      <PostListNav selectGroup={subGroup} />
      <SearchInput name="keyword" />

      <Suspense
        key={`${subGroup}-${searchKeyword}`}
        fallback={<LoadingSpiner />}
      >
        <PostList
          subGroup={subGroup}
          key={`${subGroup}-${searchKeyword}`}
          searchKeyword={searchKeyword || (await searchParams)?.search || null}
        />
      </Suspense>
    </div>
  );
}

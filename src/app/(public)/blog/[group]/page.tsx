import { Suspense } from "react";
import PostListNav from "./component/post-list-nav";
import PostList from "./post-list";
import LoadingSpiner from "@/components/animation/loading-spiner";

export default async function PostPage({
  params,
}: {
  params: Promise<{ group?: string }>;
  searchParams?: Promise<{ search?: string }>;
}) {
  const { group: subGroup } = await params;

  return (
    <>
      <PostListNav selectGroup={subGroup} />

      <Suspense fallback={<LoadingSpiner />}>
        <PostList subGroup={subGroup} />
      </Suspense>
    </>
  );
}

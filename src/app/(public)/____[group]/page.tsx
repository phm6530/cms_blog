import { Suspense } from "react";
import PostList from "./post-list";
import LoadingSpiner from "@/components/animation/loading-spiner";

export default async function PostPage({
  category,
  params,
}: {
  category: string;
  params: Promise<{ group?: string }>;
  searchParams?: Promise<{ search?: string }>;
}) {
  const { group: subGroup } = await params;

  return (
    <>
      {/* <PostListNav selectGroup={subGroup} /> */}
      {category} /{!!subGroup && subGroup}
      <Suspense fallback={<LoadingSpiner />}>
        <PostList subGroup={subGroup} />
      </Suspense>
    </>
  );
}

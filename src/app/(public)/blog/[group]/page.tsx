import PostListNav from "./component/post-list-nav";
import PostList from "./post-list";

export default async function PostPage({
  params,
}: {
  params: Promise<{ group?: string }>;
}) {
  const { group: subGroup } = await params;

  return (
    <>
      <PostListNav />
      <PostList subGroup={subGroup} />
    </>
  );
}

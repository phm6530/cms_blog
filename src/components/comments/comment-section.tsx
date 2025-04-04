import { auth } from "@/auth";
import CommentForm from "./comment-form";
import CommentList from "./comment-list";

export default async function CommentSection({ postId }: { postId: string }) {
  const session = await auth();
  const email = session?.user?.email ?? undefined;
  return (
    <section>
      <CommentForm postId={postId} userData={email ? { email } : undefined} />
      <CommentList postId={postId} />
    </section>
  );
}

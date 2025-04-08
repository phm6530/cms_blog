import CommentForm from "./comment-form";
import CommentList from "./comment-list";

export default async function CommentSection({ postId }: { postId: string }) {
  return (
    <section>
      <CommentForm />
      <CommentList postId={postId} />
    </section>
  );
}

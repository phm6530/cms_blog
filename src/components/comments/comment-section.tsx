import CommentForm from "./comment-form";
import CommentList from "./comment-list";

export default async function CommentSection({ postId }: { postId: string }) {
  return (
    <section className="flex flex-col">
      <CommentForm />
      <CommentList postId={postId} />
    </section>
  );
}

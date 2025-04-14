import { auth } from "@/auth";
import { CategoryModel } from "@/type/blog-group";
import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function GlobalNav() {
  const response = await withFetchRevaildationAction<{
    category: { [key: string]: CategoryModel };
    count: number;
  }>({
    endPoint: "api/category",
    options: {
      cache: "force-cache",
      next: {
        tags: [REVALIDATE.BLOG.GROUPS],
      },
    },
  });
  const session = await auth();
  if (!response.success) {
    notFound();
  }
  const { category } = response.result;
  return (
    <section className="py-5 mb-5 flex justify-between bg-muted-foreground/5">
      <div className="grid-layout flex justify-between ">
        <Link href={"/"}>
          <h1 className="text-3xl font-SUIT-Regular">PHM{"'"} DEV BLOG</h1>
        </Link>
        <div className="flex items-center gap-5">
          {/* cateogry list */}
          {Object.keys(category).map((e) => {
            return (
              <Link href={`/category/${e}`} className="text-sm" key={e}>
                {e.toUpperCase()}
              </Link>
            );
          })}

          <Link href={"/guestbook"} className="text-sm">
            GUEST BOARD
          </Link>

          {session?.user && (
            <Link href={"/admin"} className="text-sm">
              Admin
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

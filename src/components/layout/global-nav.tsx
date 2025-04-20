import { auth } from "@/auth";
import { CategoryModel } from "@/type/blog-group";
import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { Menu } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import NavWrapper from "./nav-wrapper";

export default async function GlobalNav() {
  const response = await withFetchRevaildationAction<{
    category: { [key: string]: CategoryModel };
    count: number;
  }>({
    endPoint: "api/category",
    options: {
      cache: "force-cache",
      next: {
        tags: [REVALIDATE.POST.CATEGORY],
      },
    },
  });

  const session = await auth();
  if (!response.success) {
    notFound();
  }
  const { category } = response.result;
  return (
    <section className="py-3  flex justify-between  border-b  z-1">
      <div className="grid-layout flex justify-between border-secondary-foreground/10 pb-3 pt-5">
        <Link href={"/"}>
          <h1 className="text-3xl font-Poppins">PHM{"'"} DEV BLOG</h1>
        </Link>

        <NavWrapper>
          <div className="flex bg-background items-center gap-5">
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
        </NavWrapper>
      </div>
    </section>
  );
}

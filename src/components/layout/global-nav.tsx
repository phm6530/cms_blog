import { CategoryModel } from "@/type/blog-group";
import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import Link from "next/link";
import { notFound } from "next/navigation";
import NavList from "./nav-list";

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

  if (!response.success) {
    notFound();
  }
  const { category } = response.result;

  return (
    <>
      <section className="py-3 md:py-5   flex justify-between  border-b sticky md:static top-0 bg-background z-5">
        <div className="grid-layout items-center flex justify-between z-20 border-secondary-foreground/10 ">
          <Link href={"/"}>
            <h1 className="text-xl md:text-3xl font-Poppins">
              PHM{"'"} DEV BLOG
            </h1>
          </Link>
          <NavList categoryList={Object.keys(category)} />
        </div>
      </section>
    </>
  );
}

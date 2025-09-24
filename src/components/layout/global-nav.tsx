import { CategoryModel } from "@/type/blog-group";
import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import Link from "next/link";
import { notFound } from "next/navigation";
import NavList from "./nav-list";
import HeaderNav from "./header-nav";

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

  const categories = Object.entries(category).map((e) => {
    return { label: e[1].name, postCnt: e[1].postCnt };
  });

  return (
    <>
      <div className="grid grid-cols-[auto_1fr_1fr] fixed top-0 w-full py-3 px-30 border-b items-center  z-20 border-secondary-foreground/10 ">
        <Link href={"/"}>
          <h1 className="text-white text-xl md:text-xl font-bold font-SUIT-Regular pr-26">
            PHM{"'"} DEV BLOG
          </h1>
        </Link>
        <NavList categories={categories} />
        <HeaderNav />
      </div>
    </>
  );
}

import { CategoryModel } from "@/type/blog-group";
import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import Link from "next/link";
import { notFound } from "next/navigation";
import NavList from "./nav-list";
import SearchInput from "../ui/search-input";

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
      <section className="py-5  flex justify-between  border-b  z-1">
        <div className="grid-layout items-center flex justify-between border-secondary-foreground/10 ">
          <Link href={"/"}>
            <h1 className="text-2xl md:text-3xl font-Poppins">
              PHM{"'"} DEV BLOG
            </h1>
          </Link>
          <NavList categoryList={Object.keys(category)} />
        </div>
      </section>
      <div className="grid-layout md:hidden md:mb-10 mt-[1rem]">
        <SearchInput name="keyword" />
      </div>
    </>
  );
}

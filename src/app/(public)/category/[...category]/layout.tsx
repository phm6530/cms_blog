import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PostListNav from "../post-list-nav";
import SearchInput from "@/components/ui/search-input";
import { auth } from "@/auth";
import { Plus } from "lucide-react";
import getCategories from "@/service/get-category";
// import NavCategories from "@/components/nav-categories";

export async function generateStaticParams() {
  const allCategories = await getCategories();
  if (!allCategories) return [];

  const params: { category: string[] }[] = [];

  Object.values(allCategories.categories).forEach((category) => {
    params.push({ category: [category.name.toLowerCase()] });

    category.subGroups.forEach((subGroup) => {
      params.push({
        category: [
          category.name.toLowerCase(),
          subGroup.subGroupName.toLowerCase(),
        ],
      });
    });
  });

  return params;
}

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ category: string[] }>;
  children: ReactNode;
}) {
  const { category: categoryList } = await params;
  const [category, group] = categoryList;

  const session = await auth();
  const allCategories = await getCategories();

  const curCategory = decodeURIComponent(category);

  const keys = Object.values(allCategories.categories).filter(
    (e) => e.name.toLocaleLowerCase() === curCategory.toLocaleLowerCase()
  );

  const curSubCategory = group ? decodeURIComponent(group) : null;

  return (
    <>
      <div className=" md:hidden  mt-4">
        <SearchInput name="keyword" />
      </div>
      <div className="mt-auto   items-end  w-full">
        <div className="flex flex-col items-start pt-16 pb-2">
          <div className="text-5xl ">
            {curCategory.slice(0, 1).toUpperCase() + curCategory.slice(1)}{" "}
            {curSubCategory && (
              <>
                <span className="text-[.3em] pr-3 opacity-30">/</span>
                <span className="text-[.3em]">{curSubCategory}</span>
              </>
            )}
          </div>
          <p className="text-muted-foreground mt-5 mb-3">
            {keys[0].description ||
              "프론트엔드 개발자 , PHM입니다. 저를 기록합니다."}
          </p>
          {session?.user && (
            <Button className=" text-xs mt-4 px-10" asChild>
              <Link className="flex" href={"/write"}>
                글쓰기 <Plus />
              </Link>
            </Button>
          )}{" "}
          {/* <NavCategories /> */}
        </div>
        {/* <NavCategories /> */}{" "}
        <PostListNav curCategory={curCategory} curSubGroup={curSubCategory} />
      </div>
      <div className="py-10">{children}</div>
    </>
  );
}

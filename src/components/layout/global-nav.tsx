import Link from "next/link";
import { notFound } from "next/navigation";
import NavList from "./nav-list";
import HeaderNav from "./header-nav";
import getCategories from "@/service/get-category";

export default async function GlobalNav() {
  const response = await getCategories();

  if (!response) {
    notFound();
  }
  const { categories } = response;
  const mappingCategories = Object.entries(categories).map((e) => {
    return { label: e[1].name, postCnt: e[1].postCnt };
  });
  return (
    <div
      className="fixed w-full z-100 bg-background/50 "
      style={{
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="grid-layout flex  justify-between items-center ">
        <Link href={"/"}>
          <h1 className=" text-xl md:text-xl font-bold font-SUIT-Regular pr-26">
            Phm, Dev Blog
          </h1>
        </Link>
        <NavList categories={mappingCategories} />
        <HeaderNav />
      </div>
    </div>
  );
}

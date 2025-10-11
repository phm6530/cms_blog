import Link from "next/link";
import { notFound } from "next/navigation";
import NavList from "./nav-list";
import HeaderNav from "./header-nav";
import getCategories from "@/service/get-category";
import { auth } from "@/auth";
import GlobalNavAdmin from "./global-nav-admin";

export default async function GlobalNav() {
  const response = await getCategories();
  const session = await auth();

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
      {/* 관리자 Nav */}
      {session?.user && session.user.role === "super" && <GlobalNavAdmin />}

      <div className="grid-layout   justify-between items-center md:py-0 py-2 grid grid-cols-[auto_auto]  md:grid-cols-[auto_auto_1fr] ">
        <Link href={"/"}>
          <h1 className=" text-xl md:text-xl font-bold font-SUIT-Regular pr-26">
            Dev Blog
          </h1>
        </Link>
        <NavList categories={mappingCategories} />
        <div className="hidden md:block">
          <HeaderNav />
        </div>
      </div>
    </div>
  );
}

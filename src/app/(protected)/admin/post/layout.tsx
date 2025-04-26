"use client";
import { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <h1>내글 관리</h1>

      {pathname && (
        <>
          <Tabs defaultValue={pathname} className="w-[400px] mt-2 mb-5">
            <TabsList className="grid w-full grid-cols-2 h-[50px]">
              <TabsTrigger asChild value="/admin/post">
                <Link href={"/admin/post"}>글 관리</Link>
              </TabsTrigger>

              <TabsTrigger asChild value="/admin/post/pinned">
                <Link href={"/admin/post/pinned"}>고정 글 정렬</Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div key={pathname}>{children}</div>
        </>
      )}
    </>
  );
}

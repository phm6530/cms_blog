import { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <>
      <h1>내글 관리</h1>

      <Tabs defaultValue="/" className="w-[400px] mt-2 mb-5">
        <TabsList className="grid w-full grid-cols-2 h-[50px]">
          <TabsTrigger asChild value="/">
            <Link href={"/admin/post"}>글 관리</Link>
          </TabsTrigger>

          <TabsTrigger asChild value="pinned">
            <Link href={"/admin/post/pinned"}>고정 글 정렬</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {children}
    </>
  );
}

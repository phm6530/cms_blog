"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function GlobalNavAdmin() {
  return (
    <div className="w-full  h-6 flex justify-between   text-xs bg-foreground/5">
      <div className="grid-layout flex justify-between items-center h-full">
        <span className="text-red-600">관리자 모드</span>
        <div className="flex items-center h-full  px-2 gap-4">
          <button className="text-xs p-0 hover:underline">
            <Link href={"/admin"}>관리자 페이지</Link>
          </button>
          <button
            onClick={async () => await signOut()}
            className="text-xs p-0 hover:underline"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}

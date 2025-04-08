"use client";

import Link from "next/link";
import ThemeHandler from "./ThemeHandler";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import { Skeleton } from "../ui/skeleton";
import { Suspense, useEffect, useState } from "react";
import SearchInput from "../ui/search-input";

const navlist = [
  { href: "/", name: "Home" },

  { href: "/blog", name: "BLOG" },
  { href: "/CODE", name: "CODE" },
  { href: "/guestbook", name: "GUEST BOARD" },
  { href: "/login", name: "로그인" },
];

export default function Nav() {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isLoading = status === "loading";

  return (
    <nav className="border-b py-4">
      <div className="grid-layout flex items-center gap-5">
        {navlist.map((link, idx) => {
          if (link.href === "/login") {
            if (!isClient || isLoading) {
              return (
                <Skeleton
                  key={`skeleton-${idx}`}
                  className="w-[40px] h-[12px] rounded-md"
                />
              );
            } else if (session) {
              return (
                <div
                  key={`auth-${idx}`}
                  className="flex items-center ml-auto gap-2"
                >
                  <Link href={"/admin"} className="text-sm">
                    관리자
                  </Link>
                  <Button
                    variant={"outline"}
                    className="text-xs animate-wiggle"
                    onClick={async () => await signOut()}
                  >
                    로그아웃
                  </Button>
                </div>
              );
            }
          }

          return (
            <Link key={link.href} href={link.href} className="text-sm">
              {link.name}
            </Link>
          );
        })}
        <Suspense fallback={<>loading..</>}>
          <SearchInput name="keyword" className="placeholder:text-xs!" />
        </Suspense>
        <ThemeHandler />
      </div>
    </nav>
  );
}

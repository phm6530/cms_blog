"use client";
import Link from "next/link";
import Grid from "./grid";
import ThemeHandler from "./ThemeHandler";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import { Skeleton } from "../ui/skeleton";

const navlist = [
  {
    href: "/",
    name: "Home",
  },
  {
    href: "/login",
    name: "로그인",
  },
  {
    href: "/blog",
    name: "블로그",
  },
  {
    href: "/guestbook",
    name: "방명록",
  },
];

export default function Nav() {
  const session = useSession();
  const isLoading = session.status === "loading";

  return (
    <nav className="border-b">
      <Grid className=" flex gap-5 py-3 items-center justify-center">
        {navlist.map((link, idx) => {
          if (link.href === "/login") {
            if (isLoading) {
              return (
                <Skeleton
                  key={`${link.href}-${idx}`}
                  className="w-[40px] h-[12px] rounded-md"
                />
              );
            } else if (!!session.data) {
              return (
                <Button
                  variant={"outline"}
                  key={`${link.href}-${idx}`}
                  className="text-xs  animate-wiggle bg-transparent!"
                  onClick={async () => await signOut()}
                >
                  로그아웃
                </Button>
              );
            }
          }
          return (
            <Link
              key={`${link.href}-${idx}`}
              href={link.href}
              className="text-sm"
            >
              {link.name}
            </Link>
          );
        })}

        <ThemeHandler />
      </Grid>
    </nav>
  );
}

"use client";

import { signOut } from "next-auth/react";

import { Button } from "../ui/button";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

export default function Navsession({ session }: { session: Session | null }) {
  const isLogin = !!session?.user;
  const router = useRouter();

  return (
    <div className="flex items-center ml-auto gap-2">
      {isLogin ? (
        <Button
          variant={"outline"}
          className="text-xs animate-wiggle"
          onClick={async () => await signOut()}
        >
          로그아웃
        </Button>
      ) : (
        <Button
          variant={"outline"}
          className="text-xs animate-wiggle"
          onClick={() => router.push("/login")}
        >
          로그인
        </Button>
      )}
    </div>
  );
}

"use client";

export default function Navsession() {
  return (
    <div key={`auth-${idx}`} className="flex items-center ml-auto gap-2">
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

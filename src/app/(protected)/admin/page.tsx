import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default async function AdminPage() {
  const session = await auth();

  return (
    <div className="flex flex-col">
      <section className="w-full grid grid-cols-2 border p-5">
        <div className="rounded-2xl">
          <div className="relative size-30 overflow-hidden border-5">
            <Image
              src={session!.user.image!}
              fill
              style={{ objectFit: "cover" }}
              alt="myprofile"
            />
            <Button variant={"outline"} className="absolute left-0 top-0">
              사진
            </Button>
          </div>
        </div>
        <div className="">
          내 정보
          <div>{session?.user.nickname}</div>
          <div></div>
        </div>
      </section>

      <section className="flex gap-2">
        <div className="">
          <Button asChild className="text-xs">
            <Link href={"/admin/category"}>카테고리 관리</Link>
          </Button>
        </div>
        <div className="">
          <Button asChild className="text-xs">
            <Link href={"/admin/post"}>내 글 관리</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function AdminPage() {
  const session = await auth();

  return (
    <div className="grid grid-cols-[auto_1fr]">
      <section className="bg-red-100">
        <div className="">
          <Link href={"/admin/category"}>카테고리 관리</Link>
        </div>
      </section>
      {/* <section>
        <Card>
          <CardHeader>
            <CardTitle>{session?.user.email}</CardTitle>
            <CardDescription>{session?.user.nickname} 님</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="inline-flex gap-2`">
              <Button variant={"outline"}>개인정보 변경</Button>
              <Button variant={"outline"}>개인정보 변경</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>테마 변경</CardTitle>
            <CardDescription>{session?.user.nickname} 님</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2`">
              <Button variant={"outline"}>개인정보 변경</Button>
              <Button variant={"outline"}>개인정보 변경</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>테마 변경</CardTitle>
            <CardDescription>{session?.user.nickname} 님</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2`">
              <Button variant={"outline"}>개인정보 변경</Button>
              <Button variant={"outline"}>개인정보 변경</Button>
            </div>
          </CardContent>
        </Card>
        <Button variant={"outline"}>변경</Button>
        방문자, 카테고리 추가 , 기본 썸네일 변형(AI 썸네일 추가) 글 비밀 관리 ,
        임시저장 (DB?){" "}
      </section> */}
    </div>
  );
}

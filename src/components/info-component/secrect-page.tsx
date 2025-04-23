import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";

export default function SelectPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 h-[calc(100vh-250px)]">
      <h1 className="text-muted-foreground flex gap-4 items-center">
        <LockKeyhole className="w-10 h-10" /> Private Page
      </h1>

      <h3>해당 페이지는 비공개 페이지입니다.</h3>

      <div className={"flex mt-7 w-full max-w-[300px] gap-3 justify-center"}>
        <Button variant={"outline"} size={"lg"}>
          <Link href={"/"}>Home</Link>
        </Button>
      </div>
    </div>
  );
}

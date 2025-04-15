import Link from "next/link";

export default async function AdminPage() {
  return (
    <div className="grid grid-cols-[auto_1fr]">
      <section>
        <div className="">
          <Link href={"/admin/category"}>카테고리 관리</Link>
        </div>
        <div className="">
          <Link href={"/admin/post"}>내 글 관리</Link>
        </div>
      </section>
    </div>
  );
}

"use server";

import { redirect } from "next/navigation";

export async function searchAction(formData: FormData) {
  "use server";
  const search = formData.get("search");
  // 리다이렉트 (서버 측에서 처리)
  redirect(`${pathname}?search=${search}`);
}

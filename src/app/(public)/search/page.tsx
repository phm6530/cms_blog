import { redirect } from "next/navigation";

export default function SearchPage() {
  redirect("/blog");
  return null;
}

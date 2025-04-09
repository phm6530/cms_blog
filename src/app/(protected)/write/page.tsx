import { BlogGroupModel } from "@/type/blog-group";
import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { notFound } from "next/navigation";
import WirteForm from "./write-form";
import { SupabaseStorage } from "@/config/supabase-instance";

export default async function Page() {
  const response = await withFetchRevaildationAction<
    (BlogGroupModel | number)[]
  >({
    endPoint: "api/blogGroup",
    options: {
      cache: "force-cache",
      next: {
        tags: [REVALIDATE.BLOG.GROUPS],
      },
    },
  });

  if (!response.success) {
    notFound();
  }
  const result = response.result;
  const { data, error } = await SupabaseStorage.getInstance()
    .storage.from("blog")
    .list("blog");

  console.log(data);
  return (
    <>
      <WirteForm postGroupItems={result} />
    </>
  );
}

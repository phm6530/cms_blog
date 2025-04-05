import { BlogGroupModel } from "@/type/blog-group";
import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { notFound } from "next/navigation";
import WirteForm from "./write-form";

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

  return (
    <>
      <WirteForm postGroupItems={result} />
    </>
  );
}

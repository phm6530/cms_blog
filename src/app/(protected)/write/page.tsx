import { CategoryModel } from "@/type/blog-group";
import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { notFound } from "next/navigation";
import WirteForm from "./write-form";
import { Params } from "next/dist/server/request/params";
import { BlogDetailResponse } from "@/type/blog.type";
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export enum WirteMode {
  EDIT = "edit",
}

export default async function Page(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const postId = searchParams.postId;
  const mode = searchParams.mode;
  let tempData: BlogDetailResponse | undefined = undefined;

  const response = await withFetchRevaildationAction<{
    category: { [key: string]: CategoryModel };
    count: number;
  }>({
    endPoint: "api/category",
    options: {
      cache: "force-cache",
      next: {
        tags: [REVALIDATE.POST.CATEGORY],
      },
    },
  });

  if (mode === WirteMode.EDIT) {
    // 수저일떄
    const editResponse = await withFetchRevaildationAction<BlogDetailResponse>({
      endPoint: `api/post/${postId}`,
      options: {
        cache: "force-cache",
        next: {
          tags: [`${REVALIDATE.POST.DETAIL}:${postId}`],
        },
      },
    });

    if (!editResponse.success) {
      console.log("나 실행");
      notFound();
    }

    tempData = editResponse.result;
  }

  if (!response.success) {
    notFound();
  }

  const { category } = response.result;

  return (
    <>
      {" "}
      <WirteForm postGroupItems={category} editData={tempData} />{" "}
    </>
  );
}

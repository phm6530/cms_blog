import { CategoryModel } from "@/type/blog-group";
import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { notFound } from "next/navigation";
import WirteForm from "./write-form";
import { BlogDetailResponse } from "@/type/blog.type";
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export enum WirteMode {
  EDIT = "edit",
  DRAFT = "draft",
}

export default async function Page(props: {
  params: any;
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const postId = searchParams.postId;
  const mode = searchParams.mode;

  let editData: BlogDetailResponse | undefined = undefined;

  // 카테고리
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

  // 수정일 때 Data 가져오기
  if (mode === WirteMode.EDIT) {
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
      notFound();
    }
    editData = editResponse.result;
  }

  if (!response.success) {
    notFound();
  }

  const { category } = response.result;

  return (
    <>
      <WirteForm postGroupItems={category} {...(editData && { editData })} />
    </>
  );
}

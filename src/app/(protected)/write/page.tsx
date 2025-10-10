import { WRITE_MODE } from "@/type/constants";
import { notFound } from "next/navigation";
import WirteForm from "./write-form";
import getCategories from "@/service/get-category";
import getPostItem from "@/app/(public)/post/[id]/action/page-service";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
type PostItemType = Awaited<ReturnType<typeof getPostItem>>;
export default async function Page(props: {
  params: any;
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const postId = searchParams.postId;
  const mode = searchParams.mode;

  let editData: PostItemType | undefined;

  // 카테고리
  const response = await getCategories();
  // 수정일 때 Data 가져오기
  if (mode === WRITE_MODE.EDIT) {
    const editResponse = await getPostItem(postId + "");

    if (!editResponse) {
      notFound();
    }
    if (editResponse) {
      editData = editResponse;
    }
  }

  if (!response) {
    notFound();
  }
  console.log(response);

  return (
    <>
      <WirteForm
        postGroupItems={response.categories}
        {...(editData && { editData })}
      />
    </>
  );
}

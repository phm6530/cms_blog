"use client";
import { Button } from "@/components/ui/button";
import { CategoryModel } from "@/type/blog-group";
import { HTTP_METHOD } from "@/type/constants";
import withClientFetch from "@/util/withClientFetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CornerDownRight, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import CategoryRenameHandler from "./components/category-rename";
import { actionCategories } from "./action/fetch-categories";
import CategoryInsertBtn from "./components/category-insert-btn";

export type DeleteCategoryProps = { categoryId: number; subGroupId?: number };

export default function Category() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["test"],
    queryFn: async () => {
      const res = await actionCategories();
      if (!res.success) throw new Error(res.error); // 여기서 react-query의 error 플로우로 넘김
      return res.data;
    },
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: async ({ categoryId, subGroupId }: DeleteCategoryProps) => {
      return await withClientFetch<{
        category: { [key: string]: CategoryModel };
        count: number;
      }>({
        endPoint: "api/admin/category",
        options: {
          method: HTTP_METHOD.DELETE,
          body: JSON.stringify({ categoryId, subGroupId }),
        },
      });
    },
    onSuccess: () => {
      toast.success("카테고리가 삭제되었습니다.", {
        style: {
          background: "#1e293b",
          color: "#38bdf8",
        },
      });
      router.refresh();
      queryClient.invalidateQueries({
        queryKey: ["test"],
      });
    },
  });

  if (isLoading && !data) {
    return "loading...";
  }

  const categoryList = data;

  // const addCategoryHandler = ({ id }: { id?: number }) => {
  //   const item = prompt("카테고리 명을 입력해주세요");
  //   if (!item) return;
  //   mutate({ item, id });
  // };

  // const handleAddCategorySubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.currentTarget);
  //   const categoryName = formData.get("categoryName") as string;
  //   if (!categoryName) {
  //     toast.error("카테고리 명을 입력해주세요.");
  //     return;
  //   }
  //   addCategoryHandler({ item: categoryName });
  // };

  const deleteCategoryHandler = (data: DeleteCategoryProps) => {
    const item = confirm("삭제하시겠습니까?");
    if (!item) return;
    deleteMutate(data);
  };

  return (
    <>
      <div className=" py-3 px-6 border flex justify-between items-center">
        <span>전체글 ( {categoryList?.count} )</span>
        <CategoryInsertBtn />
      </div>
      {Object.values(categoryList!.categories).map((category, idx) => {
        return (
          <React.Fragment key={`${category.id}-${idx}`}>
            <div className="py-3 ">
              {/* 카테고리 영역 */}
              <div className="flex justify-between items-center p-2">
                <div className="flex items-center gap-3 ">
                  <Menu size={15} />

                  <span className="">
                    {category.name} ({category.postCnt})
                  </span>
                </div>
                <div className="flex gap-2 ">
                  {/* 카테고리 이름 변경 */}
                  <CategoryRenameHandler
                    category={category.name}
                    categoryId={category.id}
                  />
                  {/* <Button
                    variant={"outline"}
                    size={"sm"}
                    className="text-xs"
                    onClick={() => addCategoryHandler({ id: category.id })}
                  >
                    추가
                  </Button> */}
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    className="text-xs"
                    onClick={() =>
                      deleteCategoryHandler({ categoryId: category.id })
                    }
                  >
                    삭제
                  </Button>
                </div>
              </div>

              {/* 서브그룹 리스트 */}
              <div className="pl-6 mt-2 space-y-1 ">
                {category.subGroups.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex justify-between items-center text-sm text-muted-foreground "
                  >
                    <div className="flex items-center gap-2">
                      <CornerDownRight size={10} /> {sub.subGroupName}
                      <span>({sub.postCount})</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant={"ghost"} size={"sm"}>
                        변경
                      </Button>

                      <Button
                        variant={"ghost"}
                        size={"sm"}
                        onClick={() =>
                          deleteCategoryHandler({
                            categoryId: category.id,
                            subGroupId: sub.id,
                          })
                        }
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </React.Fragment>
        );
      })}{" "}
      <div className="mt-10 flex items-end justify-end">
        <Button variant={"secondary"} className="py-7 px-10">
          저장하기
        </Button>
      </div>
    </>
  );
}

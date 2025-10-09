"use client";
import { Button } from "@/components/ui/button";
import { CornerDownRight, Menu } from "lucide-react";
import React from "react";
import { actionCategories } from "./action/fetch-categories";
import CategoryInsertTrigger from "./components/category-insert-btn";
import CategoryModify from "./components/category-modify";
import { useQuery } from "@tanstack/react-query";

export type DeleteCategoryProps = { categoryId: number; subGroupId?: number };

export default function Category() {
  const { data, isLoading } = useQuery({
    queryKey: ["test"],
    queryFn: async () => {
      const res = await actionCategories();
      if (!res.success) throw new Error(res.error); // 여기서 react-query의 error 플로우로 넘김
      return res.data;
    },
  });

  // const { mutate: deleteMutate } = useMutation({
  //   mutationFn: async ({
  //     categoryId,
  //     subGroupId: groupId,
  //   }: DeleteCategoryProps) => {
  //     return await modifyCategory({ groupId, categoryId });
  //   },
  //   onSuccess: () => {
  //     toast.success("카테고리가 삭제되었습니다.", {
  //       style: {
  //         background: "#1e293b",
  //         color: "#38bdf8",
  //       },
  //     });
  //     router.refresh();
  //     queryClient.invalidateQueries({
  //       queryKey: ["test"],
  //     });
  //   },
  // });

  if (isLoading && !data) {
    return "loading...";
  }

  const categoryList = data;

  const deleteCategoryHandler = (data: DeleteCategoryProps) => {
    const item = confirm("삭제하시겠습니까?");
    if (!item) return;
    // deleteMutate(data);
  };

  return (
    <>
      <div className=" py-3 px-6 border flex justify-between items-center">
        <span>전체글 ( {categoryList?.count} )</span>
        <CategoryInsertTrigger>
          <Button
            type="button"
            variant={"outline"}
            className="text-xs shadow-none bg-transparent! hover:border-zinc-400"
          >
            + 카테고리 추가
          </Button>
        </CategoryInsertTrigger>
      </div>
      {Object.values(categoryList!.categories).map((category, idx) => {
        return (
          <React.Fragment key={`${category.id}-${idx}`}>
            <div className="py-3 ">
              {/* 카테고리 영역 */}
              <div className="flex justify-between items-center p-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 ">
                    <Menu size={15} />

                    <span className="">
                      {category.name} ({category.postCnt})
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    설명 : {category.description ?? "없음"}
                  </div>
                </div>
                <div className="flex gap-2 ">
                  {/* 카테고리 - 수정*/}
                  <CategoryModify
                    {...(category.description
                      ? { description: category.description }
                      : {})}
                    categoryName={category.name}
                    categoryId={category.id}
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-xs p-0 shadow-none bg-transparent! hover:border-zinc-400"
                    >
                      수정
                    </Button>
                  </CategoryModify>

                  {/* 카테고리 이름 변경 */}
                  <CategoryInsertTrigger
                    categoryName={category.name}
                    categoryId={category.id}
                  >
                    <Button
                      type="button"
                      variant={"ghost"}
                      className="text-xs p-0 shadow-none bg-transparent! hover:border-zinc-400"
                    >
                      그룹 추가
                    </Button>
                  </CategoryInsertTrigger>
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

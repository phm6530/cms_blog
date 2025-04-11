"use client";
import { Button } from "@/components/ui/button";
import { CategoryModel } from "@/type/blog-group";
import { HTTP_METHOD, REVALIDATE } from "@/type/constants";
import withClientFetch from "@/util/withClientFetch";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CornerDownRight, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function Category() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["test"],
    queryFn: async () => {
      return await withFetchRevaildationAction<{
        category: { [key: string]: CategoryModel };
        count: number;
      }>({
        endPoint: "api/category",
        options: {
          cache: "force-cache",
          next: {
            tags: [REVALIDATE.BLOG.GROUPS],
          },
        },
      });
    },
    staleTime: 10000,
  });
  /**
   * @param id 유무에 따라 Category 추가 or Group 추가 분기
   */
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ id, item }: { id?: number; item: string }) => {
      return await withClientFetch<{
        category: { [key: string]: CategoryModel };
        count: number;
      }>({
        endPoint: "api/admin/category",
        options: {
          method: HTTP_METHOD.POST,
          body: JSON.stringify({
            ...(!!id
              ? {
                  id,
                  categoryName: item,
                }
              : {
                  categoryName: item,
                }),
          }),
        },
      });
    },
    onSuccess: () => {
      toast.success("카테고리가 추가 되었습니다.");
      router.refresh();
      queryClient.invalidateQueries({
        queryKey: ["test"],
      });
    },
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: async (id: number) => {
      return await withClientFetch<{
        category: { [key: string]: CategoryModel };
        count: number;
      }>({
        endPoint: "api/admin/category",
        options: {
          method: HTTP_METHOD.DELETE,
          body: JSON.stringify({ id }),
        },
      });
    },
    onSuccess: () => {
      toast.success("카테고리가 삭제되었습니다.");
      router.refresh();
      queryClient.invalidateQueries({
        queryKey: ["test"],
      });
    },
  });

  if (isLoading && !data) {
    return "loading...";
  }

  const categoryList = data?.result;
  const addCategoryHandler = ({ id }: { id?: number }) => {
    const item = prompt("카테고리 명을 입력해주세요");
    if (!item) return;
    console.log(item);
    mutate({ item, id });
  };

  const deleteCategoryHandler = (id: number) => {
    const item = confirm("삭제하시겠습니까?");
    if (!item) return;
    console.log(id);
    deleteMutate(id);
  };

  return (
    <>
      <div className=" py-3 px-6 border flex justify-between items-center">
        <span>전체글 ( {categoryList?.count} )</span>

        <div className="flex gap-2">
          <Button
            type="button"
            variant={"ghost"}
            onClick={() => addCategoryHandler({})}
          >
            추가
          </Button>
        </div>
      </div>
      {Object.values(categoryList!.category).map((category, idx) => {
        return (
          <React.Fragment key={`${category.id}-${idx}`}>
            <div className="py-3 px-6 border-b">
              {/* 카테고리 영역 */}
              <div className="flex justify-between items-center bg-secondary p-2">
                <div className="flex items-center gap-3 ">
                  <Menu size={15} />
                  <span className="font-semibold">
                    {category.name} ({category.postCnt})
                  </span>
                </div>
                <div className="flex gap-2 ">
                  <Button variant={"ghost"}>변경</Button>
                  <Button
                    variant={"ghost"}
                    onClick={() => addCategoryHandler({ id: category.id })}
                  >
                    추가
                  </Button>
                  <Button
                    variant={"ghost"}
                    onClick={() => deleteCategoryHandler(category.id)}
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

                      <Button variant={"ghost"} size={"sm"}>
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

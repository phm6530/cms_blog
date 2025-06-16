import { Button } from "@/components/ui/button";
import { HTTP_METHOD } from "@/type/constants";
import withClientFetch from "@/util/withClientFetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function CategoryRenameHandler({
  category,
  categoryId,
  parentId,
}: {
  category: string;
  categoryId?: number;
  parentId?: number;
}) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async ({ name }: { id?: number; name: string }) => {
      return await withClientFetch({
        endPoint: "api/admin/category",
        options: {
          method: HTTP_METHOD.PATCH,
          body: JSON.stringify({
            ...(!!parentId
              ? {
                  categoryId,
                  categoryName: name,
                }
              : {
                  categoryId,
                  categoryName: name,
                }),
          }),
        },
      });
    },
    onSuccess: () => {
      toast.success("카테고리가 변경되었습니다.", {
        style: {
          background: "#1e293b",
          color: "#38bdf8",
        },
      });

      queryClient.invalidateQueries({
        queryKey: ["test"],
      });
    },
  });

  const renameHandler = () => {
    const categoryName = prompt(
      `현재 명 : ${category} \n변경하실 카테고리 명을 입력해주세요`
    );
    if (!categoryName) return;
    mutate({ name: categoryName });
  };

  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="text-xs"
      onClick={renameHandler}
    >
      변경
    </Button>
  );
}

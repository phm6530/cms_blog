"use client";
import { DialogDemo } from "@/components/dialog/custom-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import useThrottling from "@/hooks/useThrottling";
import { deleteCategory } from "../action/delete-category";

/**
 * @param id 유무에 따라 Category 추가 or Group 추가 분기
 */
export default function CategoryDelete({
  categoryId,
  groupId,
  children,
}: {
  categoryId: number;
  groupId?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { throttle } = useThrottling();
  const queryClient = useQueryClient();

  //반대로 groupId가 있을때만 서브그룹
  const isSub = groupId != null;

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async () => {
      const res = await deleteCategory({
        categoryId,
        ...(groupId && { groupId: Number(groupId) }),
      });

      if (!res.success) {
        throw new Error(res.error);
      }
    },
    onSuccess: () => {
      toast.success(
        isSub ? "그룹이 삭제 되었습니다." : `카테고리가 삭제 되었습니다.`
      );

      queryClient.invalidateQueries({ queryKey: ["test"] });
      router.refresh();
    },
  });

  const deleteHandler = () => throttle(async () => mutate(), 2000);

  return (
    <DialogDemo
      trigger={children}
      title={
        isSub ? `그룹을 삭제 하시겠습니까?` : `카테고리를 삭제 하시겠습니까?`
      }
      description={`그룹 또는 카테고리는 삭제 후 복구할 수 없습니다.\n 또한, 카테고리를 삭제하려면 먼저 하위 포스팅과 서브 그룹을 모두 삭제해야 합니다.`}
    >
      <DialogFooter className="mt-4">
        <Button
          type="submit"
          onClick={deleteHandler}
          disabled={isPending || isSuccess}
        >
          {isPending ? "삭제 중..." : "삭제"}
        </Button>
        <Button asChild variant={"outline"}>
          <DialogClose className="text-sm">취소</DialogClose>
        </Button>
      </DialogFooter>
    </DialogDemo>
  );
}

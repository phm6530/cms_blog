"use client";
import { DialogDemo } from "@/components/dialog/custom-dialog";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import InputField from "@/components/shared/inputField";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertCategory } from "../action/insert-category";
import { DialogFooter } from "@/components/ui/dialog";
import useThrottling from "@/hook/useThrottling";

const categorySchema = z.object({
  categoryName: z.string().min(2, "카테고리 명은 최소 2글자 입력해주세요."),
});

export default function CategoryInsertBtn() {
  const router = useRouter();
  const { throttle } = useThrottling();
  const queryClient = useQueryClient();
  /**
   * @param id 유무에 따라 Category 추가 or Group 추가 분기
   */
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ categoryName }: { categoryName: string }) => {
      const res = await insertCategory({ categoryName });
      if (!res.success) {
        throw new Error(res.error);
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("카테고리가 추가 되었습니다.", {
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

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    throttle(
      async () =>
        mutate({
          categoryName: data.categoryName,
        }),
      2000
    );
  });

  return (
    <DialogDemo
      trigger={
        <Button
          type="button"
          variant={"outline"}
          className="text-xs shadow-none bg-transparent! hover:border-zinc-400"
        >
          + 카테고리 추가
        </Button>
      }
      title="새 카테고리 추가"
      description="추가 후 서브 그룹을 만들 수 있습니다."
    >
      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="flex flex-col gap-5 mt-5">
          <InputField
            disabled={isPending}
            name="categoryName"
            placeholder="새 카테고리 이름을 입력하세요."
          />
          <InputField
            disabled={isPending}
            name="description"
            placeholder="설명을 입력해주세요."
          />

          <DialogFooter>
            <Button type="submit" className="w-full">
              카테고리 추가
            </Button>
          </DialogFooter>
        </form>{" "}
      </FormProvider>
    </DialogDemo>
  );
}

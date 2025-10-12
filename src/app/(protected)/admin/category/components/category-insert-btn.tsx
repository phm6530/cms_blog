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
import useThrottling from "@/hooks/useThrottling";

const categorySchema = z.object({
  categoryName: z.string().min(2, "카테고리 명은 최소 2글자 입력해주세요."),
  description: z
    .string()
    .transform((val) => (val === "" ? undefined : val)) // 빈 문자열 → undefined
    .optional()
    .refine(
      (val) => val === undefined || val.length >= 5,
      "설명은 최소 5글자 입력해주세요."
    ),
});

/**
 * @param id 유무에 따라 Category 추가 or Group 추가 분기
 */
export default function CategoryInsertTrigger({
  categoryName,
  categoryId,
  children,
}: {
  categoryName?: string;
  categoryId?: number;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { throttle } = useThrottling();
  const queryClient = useQueryClient();

  const target = !!categoryId ? "subGroup" : "category";

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      categoryName,
      description,
    }: {
      categoryName: string;
      description?: string;
    }) => {
      const res = await insertCategory({
        categoryId,
        categoryName,
        description,
      });
      if (!res.success) {
        throw new Error(res.error);
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success(
        target === "subGroup"
          ? `[${categoryName}] 카테고리에 새 그룹이 추가되었습니다.`
          : "새 카테고리가 추가되었습니다."
      );
      router.refresh();
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ["test"],
      });
    },
  });

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      ...(target === "subGroup"
        ? { categoryName: "" }
        : {
            categoryName: "",
            description: "",
          }),
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    throttle(async () => mutate(data), 2000);
  });

  return (
    <DialogDemo
      trigger={children}
      title={
        target !== "subGroup"
          ? "새 카테고리 추가"
          : `${categoryName} 새 그룹 추가`
      }
      description="추가 후 서브 그룹을 만들 수 있습니다."
    >
      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="flex flex-col gap-5 mt-5">
          <InputField
            disabled={isPending}
            name="categoryName"
            placeholder="새 카테고리 이름을 입력하세요."
          />
          {target !== "subGroup" && (
            <InputField
              disabled={isPending}
              name="description"
              placeholder="설명을 입력해주세요."
            />
          )}

          <DialogFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "처리 중..." : "카테고리 추가"}
            </Button>
          </DialogFooter>
        </form>{" "}
      </FormProvider>
    </DialogDemo>
  );
}

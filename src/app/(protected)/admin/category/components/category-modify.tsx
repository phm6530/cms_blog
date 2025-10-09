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
import { DialogFooter } from "@/components/ui/dialog";
import useThrottling from "@/hook/useThrottling";
import { modifyCategory } from "../action/patch-category";
import { useMemo } from "react";

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
export default function CategoryModify({
  categoryName,
  categoryId,
  groupId,
  children,
  description,
}: {
  categoryName?: string;
  categoryId: number;
  description?: string;
  groupId?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { throttle } = useThrottling();
  const queryClient = useQueryClient();

  //반대로 groupId가 있을때만 서브그룹
  const isSub = groupId != null;

  const defaults = useMemo(
    () => ({
      categoryName: categoryName ?? "",
      ...(isSub ? {} : { description: description ?? "" }),
    }),
    [categoryName, description, isSub]
  );

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaults,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      categoryName,
      description,
    }: {
      categoryName: string;
      description?: string;
    }) => {
      const res = await modifyCategory({
        categoryId,
        categoryName,
        description,
      });
      if (!res.success) {
        throw new Error(res.error);
      }
      return res.data as {
        id: number;
        categoryName: string;
        description: string | null;
      };
    },
    onSuccess: (next) => {
      toast.success(
        isSub
          ? "그룹 정보가 수정 되었습니다."
          : `[${categoryName}] 정보가 수정되었습니다.`
      );

      // 응답 값으로 바로 리셋 (제어형 보장 위해 빈 문자열 처리)
      form.reset({
        categoryName: next.categoryName ?? "",
        ...(isSub ? {} : { description: next.description ?? "" }),
      });
      queryClient.invalidateQueries({ queryKey: ["test"] });
      router.refresh();

      // 다이얼로그 닫기 필요 시: DialogClose ref 클릭 or onOpenChange(false)
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    throttle(async () => mutate(data), 2000);
  });

  return (
    <DialogDemo
      trigger={children}
      title={isSub ? `${categoryName} - 수정` : `${categoryName} - 수정`}
      description="추가 후 서브 그룹을 만들 수 있습니다."
    >
      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="flex flex-col gap-5 mt-5">
          <InputField
            disabled={isPending}
            name="categoryName"
            placeholder="새 카테고리 이름을 입력하세요."
            autoComplete="off"
          />
          {!isSub && (
            <InputField
              disabled={isPending}
              name="description"
              placeholder="설명을 입력해주세요."
              autoComplete="off"
            />
          )}

          <DialogFooter>
            <Button
              type="submit"
              disabled={!form.formState.isDirty || isPending}
              className="w-full"
            >
              {isPending ? "수정 중..." : "수정하기"}
            </Button>
          </DialogFooter>
        </form>{" "}
      </FormProvider>
    </DialogDemo>
  );
}

"use client";

import { Form } from "@/components/ui/form";
import SelectField from "@/components/ui/select-field";
import { HTTP_METHOD, POST_STATUS, REVALIDATE } from "@/type/constants";
import withClientFetch from "@/util/withClientFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const statusSchema = z.object({
  status: z.nativeEnum(POST_STATUS).refine((val) => val !== POST_STATUS.DRAFT, {
    message: "임시 저장 상태는 선택할 수 없습니다.",
  }),
});

/** 임시저장은 여기서 건들 수 없음 status */
export default function PostViewHandler({
  postId,
  status,
  pinId,
  setPendingHandler,
}: {
  postId: number;
  status: Exclude<POST_STATUS, POST_STATUS.DRAFT>;
  pinId: number | null;
  setPendingHandler: (e: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      status,
    },
    resolver: zodResolver(statusSchema),
  });

  const { mutateAsync, isPending } = useMutation({
    /**
     *
     * @param data Pin Id 존재하면 고정되어있는 콘텐츠임
     * @returns
     */

    mutationFn: async (
      data: z.infer<typeof statusSchema> & { pinnedId: number | null }
    ) => {
      return await withClientFetch<{ success: boolean }>({
        endPoint: `api/admin/post/view/${postId}`,
        requireAuth: true,
        options: {
          method: HTTP_METHOD.PATCH,
        },
        body: data,
      });
    },
    onSuccess: async () => {
      toast.success("변경되었습니다.", {
        style: {
          background: "#1e293b",
          color: "#38bdf8",
        },
      });
      setPendingHandler(false);
      await queryClient.invalidateQueries({
        queryKey: [REVALIDATE.POST.LIST],
      });
    },
  });

  const onChangeHandler = async (
    status: Exclude<POST_STATUS, POST_STATUS.DRAFT>
  ) => {
    try {
      form.setValue("status", status);
      const isValid = await form.trigger("status");

      if (!isValid) return false;

      if (
        !!pinId &&
        !confirm(
          "고정 되어있는 POST를 미 공개 처리 할 경우 고정콘텐츠가 해제됩니다."
        )
      ) {
        return false;
      }
      setPendingHandler(true);
      const result = await mutateAsync({ status, pinnedId: pinId });
      return result.success;
    } catch (err: any) {
      void err;
      return false;
    }
  };

  return (
    <>
      <Form {...form}>
        <SelectField
          name="status"
          loading={isPending}
          onValueChange={onChangeHandler}
          valueArr={
            [
              { value: POST_STATUS.PUBLISHED, label: "공개" },
              { value: POST_STATUS.PRIVATE, label: "비 공개" },
            ] as const
          }
          defaultValue={status}
        />
      </Form>
    </>
  );
}

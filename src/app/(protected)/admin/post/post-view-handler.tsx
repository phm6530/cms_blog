"use client";

import { Form } from "@/components/ui/form";
import SelectField from "@/components/ui/select-field";
import { HTTP_METHOD, REVALIDATE } from "@/type/constants";
import withClientFetch from "@/util/withClientFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const viewSchema = z.object({
  view: z.boolean(),
});

export default function PostViewHandler({
  postId,
  defaultView,
  pinId,
  setPendingHandler,
}: {
  postId: number;
  defaultView: boolean;
  pinId: number | null;
  setPendingHandler: (e: boolean) => void;
}) {
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      view: defaultView,
    },
    resolver: zodResolver(viewSchema),
  });

  const { mutateAsync, isPending } = useMutation({
    /**
     *
     * @param data Pin Id 존재하면 고정되어있는 콘텐츠임
     * @returns
     */
    mutationFn: async (
      data: z.infer<typeof viewSchema> & { pinnedId: number | null }
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
      toast.success("변경되었습니다.");
      setPendingHandler(false);
      await queryClient.invalidateQueries({
        queryKey: [REVALIDATE.POST.LIST],
      });
    },
  });

  const onChangeHandler = async (val: string) => {
    try {
      const parsed = val === "true";
      form.setValue("view", parsed);
      const isValid = await form.trigger("view");

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
      const result = await mutateAsync({ view: parsed, pinnedId: pinId });
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
          name="view"
          loading={isPending}
          onValueChange={onChangeHandler}
          valueArr={
            [
              { value: true, label: "공개" },
              { value: false, label: "비 공개" },
            ] as const
          }
          defaultValue={true}
        />
      </Form>
    </>
  );
}

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
}: {
  postId: number;
  defaultView: boolean;
}) {
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      view: defaultView,
    },
    resolver: zodResolver(viewSchema),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof viewSchema>) => {
      return await withClientFetch<{ success: boolean }>({
        endPoint: `api/admin/post/view/${postId}`,
        requireAuth: true,
        options: {
          method: HTTP_METHOD.PATCH,
        },
        body: data,
      });
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success("변경되었습니다.");
      queryClient.invalidateQueries({
        queryKey: [REVALIDATE.BLOG.LIST],
      });
    },
  });

  const onChangeHandler = async (val: string) => {
    try {
      const parsed = val === "true";
      form.setValue("view", parsed);
      const isValid = await form.trigger("view");

      if (!isValid) return false;

      const result = await mutateAsync({ view: parsed });
      console.log(result);
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

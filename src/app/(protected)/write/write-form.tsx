"use client";
import InputField from "@/components/shared/inputField";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { wirtePostSchema } from "./schema";
import { Button } from "@/components/ui/button";
import Tiptap from "@/components/Editor/Tiptap";
import SelectField from "@/components/ui/select-field";
import { CheckField } from "@/components/ui/check-field";
import { BlogGroupModel } from "@/type/blog-group";

const defaultValues = {
  title: "",
  contents: "",
};

export default function WirteForm({
  postGroupItems,
}: {
  postGroupItems: (BlogGroupModel | number)[];
}) {
  const form = useForm({
    defaultValues,
    resolver: zodResolver(wirtePostSchema),
  });

  const onSubmitHandler = (data) => {};

  return (
    <Form {...form}>
      <div className="flex flex-col gap-3">
        <SelectField groups={postGroupItems} />
        <CheckField />
        <InputField
          name="title"
          placeholder="제목을 기재해주세요"
          className="p-5"
        />

        <FormField
          name="contents"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <Tiptap {...field} placeholder="내용 입력" value="" />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>
      <div className="flex gap-2 py-3 justify-end">
        <Button
          variant={"outline"}
          type={"button"}
          onClick={form.handleSubmit(onSubmitHandler)}
        >
          임시저장
        </Button>

        <Button type={"submit"} onClick={form.handleSubmit(onSubmitHandler)}>
          제출
        </Button>
      </div>
    </Form>
  );
}

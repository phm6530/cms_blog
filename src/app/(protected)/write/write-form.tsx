"use client";
import InputField from "@/components/shared/inputField";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { wirtePostSchema } from "./schema";
import { Button } from "@/components/ui/button";
import SelectField from "@/components/ui/select-field";
import { CheckField } from "@/components/ui/check-field";
import { BlogGroupModel } from "@/type/blog-group";
import { TipTapEditor } from "@squirrel309/my-testcounter";
import { imgUploader } from "@/util/uploader-handler";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { z } from "zod";
import TextareaFormField from "@/components/ui/textarea-field";
import PostTitleField from "@/components/shared/post-title-Field";

const defaultValues = {
  title: "",
  contents: "",
  postGroup: "",
  thumbnail: null,
  defaultThumbNail: false,
};

export default function WirteForm({
  postGroupItems,
}: {
  postGroupItems: (BlogGroupModel | number)[];
}) {
  const [img, setImg] = useState<string | null>(null);
  const form = useForm<z.infer<typeof wirtePostSchema>>({
    defaultValues,
    resolver: zodResolver(wirtePostSchema),
  });

  const onSubmitHandler = () => {};

  const imgUploaderHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const url = await imgUploader(e, "blog");
      if (!!url) {
        setImg(url);
      }
    } catch (error) {
      if (error) {
      }
      toast.error("에러");
    }
  };

  return (
    <Form {...form}>
      <div className="flex flex-col gap-3">
        <SelectField groups={postGroupItems} />
        {!!form.watch("postGroup") && <CheckField />}

        <PostTitleField
          name="title"
          placeholder="제목을 기재해주세요"
          className="p-0 mt-10"
        />
        {img && <Image src={img} alt="" fill />}

        <input
          type="file"
          id="file"
          className="hidden"
          onChange={imgUploaderHandler}
        />
        <TipTapEditor setFontFailmy={["test"]} />

        {/* <FormField
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
        /> */}
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

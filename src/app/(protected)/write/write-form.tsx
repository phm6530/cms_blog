"use client";
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
import { CheckField } from "@/components/ui/check-field";
import { CategoryModel } from "@/type/blog-group";
// import { MyEditor, useMyEditor } from "@squirrel309/my-testcounter";
import React, { useMemo } from "react";
import { toast } from "sonner";
import { z } from "zod";
import PostTitleField from "@/components/shared/post-title-Field";
import { useMutation } from "@tanstack/react-query";
import withClientFetch from "@/util/withClientFetch";
import useThrottling from "@/hook/useThrottling";
import { ENV, HTTP_METHOD } from "@/type/constants";
import { v4 as uuidv4 } from "uuid";
import transformHtmlToPlainText from "@/util/domParse";
import { useRouter } from "next/navigation";
import { BlogDetailResponse } from "@/type/blog.type";
import WirteSelectCategory from "./write-select-category";
import SelectField from "@/components/ui/select-field";
import { HtmlContentNormalizer } from "@/util/baseurl-slice";
import {
  MyEditorContent,
  MyToolbar,
  useMyEditor,
} from "@squirrel309/my-testcounter";
import { uploadImageToS3 } from "@/util/s3-uploader";

const defaultValues = {
  title: "",
  contents: "",

  postGroup: {
    category: null,
    group: null,
  },
  thumbnail: null,
  defaultThumbNail: false,
  imgKey: "",
  view: true,
};

export default function WirteForm({
  postGroupItems,
  editData,
}: {
  postGroupItems: { [key: string]: CategoryModel };
  editData: BlogDetailResponse | undefined;
}) {
  const { throttle } = useThrottling();
  const { editor, configs, editorMode } = useMyEditor({
    editorMode: "editor",
    placeholder: "내용을 기재해주세요",
    enableCodeBlock: true,
  });
  const imgKey = useMemo(() => {
    return !!editData ? editData.blog_metadata.img_key : uuidv4();
  }, [editData]);

  const rotuer = useRouter();

  const form = useForm<z.infer<typeof wirtePostSchema>>({
    defaultValues: !!editData
      ? {
          ...defaultValues,
          title: editData.blog_metadata.post_title,
          contents: editData.blog_contents.contents,
          view: editData.blog_metadata.view,
          postGroup: {
            category: editData.blog_metadata.category_id,
            group: editData.blog_metadata.sub_group_id,
          },
          thumbnail: editData.blog_metadata.thumbnail_url,
          imgKey,
        }
      : { ...defaultValues, imgKey },
    resolver: zodResolver(wirtePostSchema),
  });

  // mutate
  const { mutate } = useMutation({
    mutationFn: async (
      body: z.infer<typeof wirtePostSchema> & { description: string }
    ) => {
      return await withClientFetch<{ result: { postId: string } }>({
        endPoint: !!editData
          ? `api/post/${editData.blog_metadata.post_id}`
          : "api/post",
        options: {
          method: !!editData ? HTTP_METHOD.PUT : HTTP_METHOD.POST,
        },
        requireAuth: true,
        body: !!editData
          ? { ...body, pinnedPost: !!editData.pinned_post }
          : body,
      });
    },
    onSuccess: (data) => {
      toast.success("글이 등록되었음");
      rotuer.push(
        `/post/${
          !editData ? data.result.postId : editData.blog_metadata.post_id
        }`
      );
    },
  });

  // submit Handler
  const onSubmitHandler = (data: z.infer<typeof wirtePostSchema>) => {
    const reqData = {
      ...data,
      description: transformHtmlToPlainText({ html: data.contents }), // 추출해서 descritpion화 시키기
    };

    reqData.contents = HtmlContentNormalizer.getPost(reqData.contents);
    throttle(async () => mutate(reqData), 1000);
  };

  return (
    <Form {...form}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <WirteSelectCategory groups={postGroupItems} />
          <SelectField
            name="view"
            valueArr={
              [
                { value: true, label: "공개" },
                { value: false, label: "비 공개" },
              ] as const
            }
            defaultValue={true}
          />
        </div>
        {!!form.watch("postGroup") && <CheckField />}

        <PostTitleField
          name="title"
          placeholder="제목을 기재해주세요"
          className="p-0 mt-10"
        />

        <FormField
          name="contents"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <MyToolbar
                  editor={editor}
                  {...configs}
                  uploadCallback={async (event: File) => {
                    const form = new FormData();
                    form.append("file", event);
                    const imgPath = await uploadImageToS3(form, imgKey);

                    if (!imgPath.success) {
                      throw new Error(imgPath.message);
                    }
                    return `${ENV.IMAGE_URL_PUBLIC}${imgPath.url}`;
                  }}
                />
                <FormControl>
                  <MyEditorContent
                    editor={editor}
                    editorMode={editorMode}
                    {...field}
                    className="border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>
      <div className="flex gap-2 py-3 justify-end">
        <Button
          className="p-6 mr-auto"
          variant={"outline"}
          type={"button"}
          // onClick={() => getList()}
        >
          설정
        </Button>

        <Button
          className="p-6"
          variant={"outline"}
          type={"button"}
          // onClick={form.handleSubmit(onSubmitHandler)}
        >
          임시저장
        </Button>

        <Button
          className="p-6"
          type={"submit"}
          onClick={form.handleSubmit(onSubmitHandler)}
        >
          {!!editData ? "수정하기" : "포스팅 하기"}
        </Button>
      </div>
    </Form>
  );
}

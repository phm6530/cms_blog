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
import React, { useRef } from "react";
import { toast } from "sonner";
import { z } from "zod";
import PostTitleField from "@/components/shared/post-title-Field";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import withClientFetch from "@/util/withClientFetch";
import useThrottling from "@/hook/useThrottling";
import { ENV, HTTP_METHOD, POST_STATUS, WRITE_MODE } from "@/type/constants";
import { v4 as uuidv4 } from "uuid";
import transformHtmlToPlainText from "@/util/domParse";
import { useRouter, useSearchParams } from "next/navigation";
import { BlogDetailResponse } from "@/type/blog.type";
import WirteSelectCategory from "./write-select-category";
import SelectField from "@/components/ui/select-field";
import { HtmlContentNormalizer } from "@/util/baseurl-slice";

import { uploadImageToS3 } from "@/util/s3-uploader";
import { cn } from "@/lib/utils";
import { DraftDialog } from "./draft-dialog";
import { setDefaultValues } from "./defaultvalue-form";
import {
  EditorProvider,
  SimpleEditorContents,
  SimpleToolTip,
  useSimpleEditor,
} from "@squirrel309/my-testcounter";

export default function WirteForm({
  postGroupItems,
  editData,
}: {
  postGroupItems: { [key: string]: CategoryModel };
  editData?: BlogDetailResponse;
}) {
  const { throttle } = useThrottling();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const queryClient = useQueryClient();
  const isModeEdit = mode !== WRITE_MODE.EDIT;
  const imgKeyRef = useRef<string>(editData?.blog_metadata.img_key ?? uuidv4());
  const router = useRouter();

  const { editor } = useSimpleEditor({
    placeholder: "내용을 기재해주세요",
    uploadCallback: async (e: File) => {
      const test = await uploadImageToS3(e, imgKeyRef.current);
      if (!test.success) {
        toast.error(test.message);
        throw new Error("");
      }

      return `${ENV.IMAGE_URL_PUBLIC}${test.url}`;
    },
  });

  /**---- 초기 Form 세팅 ---- */
  const form = useForm<z.infer<typeof wirtePostSchema>>({
    defaultValues: { ...setDefaultValues(editData), imgKey: imgKeyRef.current },
    resolver: zodResolver(wirtePostSchema),
  });

  /**---- 제출 ---- */
  const { mutate } = useMutation({
    mutationFn: async (
      body: z.infer<typeof wirtePostSchema> & { description: string }
    ) => {
      return await withClientFetch<{
        result: { postId: string; postStatus: POST_STATUS };
      }>({
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
    onSuccess: async (data) => {
      if (data.result.postStatus === POST_STATUS.PUBLISHED) {
        toast.success("포스팅을 게시하였습니다.", {
          style: {
            background: "#1e293b",
            color: "#38bdf8",
          },
        });
        router.push(
          `/post/${
            !editData ? data.result.postId : editData.blog_metadata.post_id
          }`
        );
      } else if (data.result.postStatus === POST_STATUS.DRAFT) {
        toast.success("임시 저장 완료 되었습니다.");
        router.replace(`/write?postId=${data.result.postId}&mode=draft`);
        await queryClient.invalidateQueries({ queryKey: ["DRAFT_LIST"] });
      } else if (data.result.postStatus === POST_STATUS.PRIVATE) {
        toast.success("수정완료 되었습니다.");
        router.push(
          `/post/${
            !editData ? data.result.postId : editData.blog_metadata.post_id
          }`
        );
      }
    },
  });

  /**---- 이미지 Resize이상해서 발라냄 ---- */
  // function cleanUpImageWrapper(html: string): string {
  //   if (!html) return html;

  //   const wrapperRegex =
  //     /<div[^>]*>\s*<div[^>]*>\s*<img([^>]*)>\s*<\/div>\s*<\/div>/gim;

  //   return html.replace(wrapperRegex, (_match, imgAttributes) => {
  //     return `<img ${imgAttributes.trim()} />`;
  //   });
  // }

  /**---- submitHandler ---- */
  const onSubmitHandler = (data: z.infer<typeof wirtePostSchema>) => {
    const reqData = {
      ...data,
      description: transformHtmlToPlainText({ html: data.contents }), // 추출해서 descritpion화 시키기
    };
    reqData.contents = HtmlContentNormalizer.getPost(reqData.contents);
    // reqData.contents = cleanUpImageWrapper(reqData.contents);
    throttle(async () => mutate(reqData), 1000);
  };

  /**---- 임시저장은 유효성 검사 제외 ---- */
  const draftSave = () => {
    const data = form.getValues(); //현재 그냥 반영
    const reqData = {
      ...data,
      description: transformHtmlToPlainText({ html: data.contents }),
    };

    reqData.postGroup = {
      category: reqData.postGroup.category ?? null,
      group: reqData.postGroup.group ?? null,
    };

    reqData.contents = HtmlContentNormalizer.getPost(reqData.contents);
    reqData.status = POST_STATUS.DRAFT; // 임시저장 상태 전달
    throttle(async () => mutate(reqData), 1000);
  };

  return (
    <Form {...form}>
      <div className="flex flex-col gap-3 animate-wiggle">
        <div className="flex items-center gap-3 ">
          <WirteSelectCategory groups={postGroupItems} />
          <SelectField
            name="status"
            valueArr={
              [
                { value: POST_STATUS.PUBLISHED, label: "공개" },
                { value: POST_STATUS.PRIVATE, label: "비 공개" },
              ] as const
            }
            defaultValue={POST_STATUS.PUBLISHED}
          />
        </div>

        {!!form.watch("postGroup") && <CheckField />}

        <EditorProvider editor={editor}>
          <SimpleToolTip />

          <PostTitleField
            name="title"
            placeholder="제목을 기재해주세요"
            className="p-0 mt-10 "
            placeholderLg
          />

          <FormField
            name="contents"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <SimpleEditorContents {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </EditorProvider>
      </div>
      <div className="flex gap-2 py-3 justify-between">
        {/* --임시 저장은 새글 작성시에만 가능 불러오기도 안되게 막음 -- */}
        {isModeEdit && (
          <>
            <Button
              className="p-6 text-xs ml-auto"
              variant={"outline"}
              type={"button"}
            >
              <span
                className="border-r pr-4 hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  draftSave();
                }}
              >
                임시저장
              </span>
              <DraftDialog />
            </Button>
          </>
        )}

        <Button
          className={cn("p-6 text-xs", !isModeEdit && "ml-auto")}
          type={"submit"}
          onClick={form.handleSubmit(onSubmitHandler)}
        >
          {!!editData ? "수정하기" : "포스팅 하기"}
        </Button>
      </div>
    </Form>
  );
}

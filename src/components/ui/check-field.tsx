"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "./button";
import { GlassWaterIcon, Upload } from "lucide-react";
import { ChangeEvent, useRef } from "react";
import { toast } from "sonner";
import { useFormContext } from "react-hook-form";
import { wirtePostSchema } from "@/app/(protected)/write/schema";
import { z } from "zod";
import { uploadImageToS3 } from "@/util/s3-uploader";

export function CheckField() {
  const ref = useRef<HTMLInputElement | null>(null);
  const { control, watch, setValue } =
    useFormContext<z.infer<typeof wirtePostSchema>>();

  // imgKey..
  const imgKey = watch("imgKey");

  const thumbNailUPloader = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) {
        throw new Error("파일이 없습니다."); //에러만 전달
      }
      const form = new FormData();
      form.append("file", file);

      const imgPath = await uploadImageToS3(form, imgKey);

      if (!imgPath.success) {
        throw new Error(imgPath.message);
      }

      // const thumbUrl = await imgUploader({
      //   event: file,
      //   path: "post",
      //   folderName: watch("imgKey"),
      //   filename: new Date().toISOString(),
      // });

      // const imgPath = `${thumbUrl?.split("public/blog/")[1]}`;
      if (imgPath.success && imgPath.url) {
        setValue("thumbnail", imgPath.url);
      }

      toast.success("배너가 업로드 되었습니다.");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message, {
          style: {
            background: "#7f1d1d", // tailwind red-900
            color: "#fef2f2", // 거의 흰색에 가까운 연핑 (가독성 높음)
          },
        });
      }
    }
  };

  return (
    <FormField
      control={control}
      name="defaultThumbNail"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow group">
          <FormControl>
            <Checkbox
              checked={field.value === true}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className=" cursor-pointer group-hover:text-primary">
              기본 썸네일 적용 ON / OFF
            </FormLabel>
            <FormDescription className="text-xs">
              on 설정 시에 기존 설정한 썸네일이 반영됩니다.
            </FormDescription>
            <div className="flex gap-3 mt-5">
              <Button variant={"outline"} className="text-xs cursor-pointer">
                배너 삭제
              </Button>{" "}
              {/* hidden - file */}
              <input
                type="file"
                name="file"
                className="hidden"
                ref={ref}
                onChange={thumbNailUPloader}
              />
              <Button
                variant={"outline"}
                onClick={() => ref.current?.click()}
                className="text-xs cursor-pointer"
                disabled={field.value === true}
              >
                <Upload /> 배너 Img 변경하기
              </Button>
              <Button
                disabled={field.value === true}
                variant={"outline"}
                className="text-xs cursor-pointer"
              >
                <GlassWaterIcon /> 썸네일 검색기
              </Button>
            </div>
          </div>
        </FormItem>
      )}
    />
  );
}

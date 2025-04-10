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
import { imgUploader } from "@/util/uploader-handler";
import { toast } from "sonner";
import { useFormContext } from "react-hook-form";

export function CheckField() {
  const ref = useRef<HTMLInputElement | null>(null);
  const { control, watch } = useFormContext();

  const thumbNailUPloader = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files) {
        throw new Error(""); //에러만 전달
      }
      const thumbUrl = await imgUploader({
        event,
        path: "thumbnail",
        filename: `${watch("postGroup")}`,
      });
      console.log(thumbUrl);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
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
                기본 썸네일 보기
              </Button>{" "}
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
                <Upload /> 썸네일 변경하기
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

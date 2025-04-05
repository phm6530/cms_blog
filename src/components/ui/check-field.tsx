"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

const FormSchema = z.object({
  mobile: z.boolean().default(false).optional(),
});

export function CheckField() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mobile: true,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  }

  return (
    <FormField
      control={form.control}
      name="mobile"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow group">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className=" cursor-pointer group-hover:text-primary">
              기본 썸네일 적용 ON / OFF
            </FormLabel>
            <FormDescription>
              on 설정 시에 기존 설정한 썸네일이 반영됩니다.
            </FormDescription>
            <div className="flex gap-3 mt-2">
              <Button variant={"outline"} className="text-xs">
                기본 썸네일 보기
              </Button>{" "}
              <Button variant={"outline"} className="text-xs">
                <Upload /> 썸네일 변경하기
              </Button>
              <Button variant={"outline"} className="text-xs">
                <GlassWaterIcon /> 썸네일 검색기
              </Button>
            </div>
          </div>
        </FormItem>
      )}
    />
  );
}

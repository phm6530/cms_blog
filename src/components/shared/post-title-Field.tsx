"use client";

import { TextareaHTMLAttributes, useRef, useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { cn } from "@/lib/utils";

export default function PostTitleField({
  name,
  label,
  className,
  placeholderLg,
  ...rest
}: {
  name: string;
  label?: string;
  placeholderLg?: boolean;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 높이 자동 조절
  const handleResizeHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    handleResizeHeight(); // 마운트 시 초기 높이 조절
  }, []);

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <textarea
              {...field}
              {...rest}
              ref={textareaRef}
              onInput={(e) => {
                handleResizeHeight();
                field.onChange(e);
              }}
              className={cn(
                "text-2xl border-b pb-2 focus:outline-0",
                placeholderLg && "placeholder:text-2xl"
              )}
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflow: "hidden",
                resize: "none", // 수동 resize 막기
              }}
              rows={1}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

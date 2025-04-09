"use client";

import { TextareaHTMLAttributes, useRef, useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

export default function PostTitleField({
  name,
  label,
  className,
  ...rest
}: {
  name: string;
  label?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 높이 자동 조절
  const handleResizeHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
      console.log(textarea.style.height);
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
              className="text-2xl border-b pb-2 focus:outline-0"
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

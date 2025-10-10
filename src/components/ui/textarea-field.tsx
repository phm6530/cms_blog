"use client";

import { TextareaHTMLAttributes } from "react";
import { FormControl, FormField, FormItem, FormLabel } from "./form";
import { Textarea } from "./textarea";
import { cn } from "@/lib/utils";

export default function TextareaFormField({
  name,
  label,
  className,
  ...rest
}: {
  name: string;
  label?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <>
      <FormField
        name={name}
        render={({ field }) => {
          return (
            <>
              <FormItem className={cn("mr-auto", className)}>
                {label && <FormLabel>{label}</FormLabel>}
                <FormControl>
                  <Textarea {...field} {...rest} />
                </FormControl>
              </FormItem>
            </>
          );
        }}
      />
    </>
  );
}

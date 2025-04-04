"use client";

import { TextareaHTMLAttributes, useState } from "react";
import { FormControl, FormField, FormItem, FormLabel } from "./form";
import { Textarea } from "./textarea";

export default function TextareaFormField({
  name,
  label,

  ...rest
}: {
  name: string;
  label?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [] = useState();
  return (
    <>
      <FormField
        name={name}
        render={({ field }) => {
          return (
            <FormItem>
              {label && <FormLabel>{label}</FormLabel>}
              <FormControl>
                <Textarea {...field} {...rest} />
              </FormControl>
            </FormItem>
          );
        }}
      />
    </>
  );
}

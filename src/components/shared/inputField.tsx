import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

export default function InputField({
  name,
  label,
  description,
  required,
  errorField = true,
  ...rest
}: {
  name: string;
  label?: string;
  description?: string;
  errorField?: boolean;
} & InputHTMLAttributes<HTMLInputElement>) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            {label && (
              <FormLabel>
                {label} {required && <span className="text-point">*</span>}
              </FormLabel>
            )}

            <FormControl>
              <Input {...field} {...rest} />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            {errorField && <FormMessage />}
          </FormItem>
        );
      }}
    />
  );
}

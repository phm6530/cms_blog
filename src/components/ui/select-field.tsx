import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField, FormItem, FormMessage } from "./form";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export default function SelectField<
  T extends Array<{ value: any; label: string }>
>({
  name,
  valueArr,
  defaultValue,
  onValueChange,
  loading,
  className,
}: {
  name: string;
  valueArr: T;
  defaultValue?: T[number]["value"];
  loading?: boolean;
  onValueChange?: (...arg: any) => Promise<boolean>;
  className?: string;
}) {
  const ref = useRef<string>(null);
  const { control, getValues } = useFormContext();

  useEffect(() => {
    // 초기값 세팅
    ref.current = getValues(name);
  }, [getValues, name]);

  return (
    <FormField
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => {
        return (
          <FormItem>
            <Select
              value={String(field.value)}
              onValueChange={async (val) => {
                // Boolean으로 컨트롤 할거임
                if (onValueChange) {
                  const test = await onValueChange(val);
                  if (!test) {
                    field.onChange(ref.current);
                    return;
                  }
                }

                const parsed = valueArr.find((e) => e.value + "" === val);
                if (parsed) field.onChange(parsed.value as T[number]["value"]);
              }}
              defaultValue={String(field.value ?? defaultValue)}
            >
              <SelectTrigger className={cn("text-xs", className)}>
                {loading ? "변경 중 ..." : <SelectValue />}
              </SelectTrigger>
              <SelectContent>
                {valueArr.map((e, idx) => (
                  <SelectItem
                    className="text-xs"
                    key={idx}
                    value={e.value + ""}
                  >
                    {e.label}
                  </SelectItem>
                ))}
              </SelectContent>
              <FormMessage />
            </Select>
          </FormItem>
        );
      }}
    />
  );
}

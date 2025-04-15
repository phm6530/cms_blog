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

export default function SelectField<
  T extends Array<{ value: any; label: string }>
>({
  name,
  valueArr,
  defaultValue,
  className,
}: {
  name: string;
  valueArr: T;
  defaultValue?: T[number]["value"];
  className?: string;
}) {
  const { control } = useFormContext();

  return (
    <FormField
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => {
        return (
          <FormItem>
            <Select
              onValueChange={(val) => {
                const parsed = valueArr.find((e) => e.value + "" === val);
                if (parsed) field.onChange(parsed.value as T[number]["value"]);
              }}
              defaultValue={String(field.value ?? defaultValue)}
            >
              <SelectTrigger className={cn("text-xs", className)}>
                <SelectValue />
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

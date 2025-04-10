import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryModel } from "@/type/blog-group";
import { FormField, FormItem, FormMessage } from "./form";
import { useFormContext } from "react-hook-form";

export default function SelectField<T extends (CategoryModel | number)[]>({
  groups,
}: {
  groups: T;
}) {
  const allCnt = groups.at(-1) as number;
  const { control } = useFormContext();

  return (
    <FormField
      name="postGroup"
      control={control}
      render={({ field }) => {
        return (
          <FormItem>
            <Select onValueChange={field.onChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={`전체 ( ${allCnt} )`} />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group, groupIdx) => {
                  if (!!(typeof group === "number")) return;
                  return group.subGroups.map((sub, subIdx) => {
                    return (
                      <SelectItem
                        key={`${groupIdx}-${subIdx}`}
                        value={sub.subGroupName}
                      >
                        {sub.subGroupName} ({sub.postCount})
                      </SelectItem>
                    );
                  });
                })}
              </SelectContent>
              <FormMessage />
            </Select>
          </FormItem>
        );
      }}
    />
  );
}

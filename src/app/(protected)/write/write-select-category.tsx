import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryModel } from "@/type/blog-group";

import { useFormContext } from "react-hook-form";

export default function WirteSelectCategory<
  T extends { [key: string]: CategoryModel }
>({ groups }: { groups: T }) {
  const { control, setValue, trigger } = useFormContext();

  const categories = Object.values(groups);
  const totalPostCnt = categories.reduce((sum, cur) => {
    return sum + cur.postCnt;
  }, 0);

  return (
    <FormField
      name="postGroup"
      control={control}
      render={({ field }) => {
        return (
          <FormItem>
            <Select
              value={
                field.value && field.value.category && field.value.group
                  ? JSON.stringify(field.value)
                  : undefined
              }
              onValueChange={(val) => {
                const parsed = JSON.parse(val);

                setValue("postGroup", {
                  category: parsed.category,
                  group: parsed.group,
                });
                trigger("postGroup");
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={`전체 ( ${totalPostCnt} )`} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((group, groupIdx) => (
                  <div key={groupIdx} className="border-b py-2">
                    <div className="px-3 py-1 text-muted-foreground text-sm font-semibold">
                      {group.name} ({group.postCnt})
                    </div>
                    {group.subGroups.map((sub, subIdx: number) => (
                      <SelectItem
                        key={`${groupIdx}-${subIdx}`}
                        value={JSON.stringify({
                          category: group.id,
                          group: sub.id,
                        })}
                        className="pl-5"
                      >
                        {sub.subGroupName} ({sub.postCount})
                      </SelectItem>
                    ))}
                  </div>
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

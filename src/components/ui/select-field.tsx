import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlogGroupModel } from "@/type/blog-group";
export default function SelectField<T extends (BlogGroupModel | number)[]>({
  groups,
}: {
  groups: T;
}) {
  const allCnt = groups.at(-1) as number;
  return (
    <Select>
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
    </Select>
  );
}

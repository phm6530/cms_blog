import { DateUtils } from "@/util/date-uill";
import { BadgeCheck } from "lucide-react";

export default function ProfileUser({
  nickname,
  role,
  createAt,
}: {
  nickname: string;
  role: "super" | "admin" | "guest";
  createAt?: string;
}) {
  return (
    <div className="col-span-2 flex items-start gap-2">
      <div className="flex flex-col">
        <span className="text-sm">{nickname} </span>
        {createAt && (
          <span className="text-xs opacity-50">
            {DateUtils.fromNow(createAt)}
          </span>
        )}
      </div>
      {role === "super" && (
        <div className="relative ml-1">
          <BadgeCheck className="text-teal-500  shadow-2xl z-1" size={20} />{" "}
          <BadgeCheck
            className="text-teal-500  shadow-2xl z-1 absolute top-[0px] animate-ping"
            size={20}
          />
        </div>
      )}
    </div>
  );
}

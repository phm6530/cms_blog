import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { InputHTMLAttributes } from "react";

export default function SearchField({
  name,
  className,
  ...props
}: {
  name: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div
      className={cn(
        `border rounded-lg dark:bg-custom-input overflow-hidden
       flex flex-1 focus-within:border-indigo-400`,
        className
      )}
    >
      <input
        type="text"
        autoComplete="off"
        name={name}
        className="bg-transparent flex-1   focus:outline-0 border-0 h-full p-4 pl-4 md:text-sm text-[13px]"
        placeholder="검색어를 입력해주세요"
        {...props}
      />

      <button
        type="submit"
        className="flex items-center focus:border-0 p-3 pr-3"
      >
        <SearchIcon />
      </button>
    </div>
  );
}

"use client";
import useThrottling from "@/hooks/useThrottling";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { FormEvent, InputHTMLAttributes, useState } from "react";

export default function SearchInput({
  name,
  className,
  ...props
}: {
  name: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  const router = useRouter();
  const pathname = usePathname();
  const param = useParams();

  const currentValue = (param.keyword as string) ?? "";

  const [inputValue, setInputValue] = useState(
    decodeURIComponent(currentValue)
  );
  const { throttle } = useThrottling();
  const searchHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    throttle(async () => {
      const trimmed = inputValue.trim();

      if (trimmed.length < 2) {
        alert("2글자 이상 입력해주세요.");
        return;
      }
      if (trimmed === "") {
        router.push(`${pathname}`);
      } else {
        router.push(`/search/${trimmed.toLowerCase()}`);
      }
    }, 500);
  };

  return (
    <form onSubmit={searchHandler} className={cn("ml-auto", className)}>
      <div
        className={cn(
          `rounded-full bg-muted-foreground/7  overflow-hidden 
       flex flex-1`,
          className
        )}
      >
        <input
          type="text"
          autoComplete="off"
          name={name}
          defaultValue={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="bg-transparent flex-1  p-2.5 pl-4 md:text-sm text-[13px] outline-0! placeholder:text-xs"
          placeholder="검색어를 입력해주세요"
          {...props}
        />

        <button type="submit" className="flex items-center pr-3 opacity-50">
          <SearchIcon size={17} />
        </button>
      </div>
    </form>
  );
}

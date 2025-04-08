"use client";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  const qs = useSearchParams();
  const currentValue = qs.get("search") || "";
  const [inputValue, setInputValue] = useState(currentValue);
  const searchHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    // 동일검색 금지
    if (trimmed === currentValue.trim()) return;

    if (trimmed === "") {
      router.push(`${pathname}`);
    } else {
      router.push(`${pathname}?search=${trimmed.toLowerCase()}`);
      router.refresh();
    }
  };
  const value = qs.get("search") || "";
  return (
    <form onSubmit={searchHandler}>
      <div
        className={cn(
          `border rounded-full dark:bg-black/10 overflow-hidden focus-within:border-primary
       focus-within:focus-within:bg-[hsl(var(--custom-color))] flex flex-1`,
          className
        )}
      >
        <input
          type="text"
          autoComplete="off"
          name={name}
          defaultValue={value}
          onChange={(e) => setInputValue(e.target.value)}
          className="bg-transparent flex-1 h-full p-4 pl-4 md:text-sm text-[13px] outline-0!"
          placeholder="검색어를 입력해주세요"
          {...props}
        />

        <button type="submit" className="flex items-center p-3 pr-3">
          <SearchIcon />
        </button>
      </div>
    </form>
  );
}

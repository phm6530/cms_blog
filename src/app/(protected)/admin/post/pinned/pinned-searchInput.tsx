"use client";

import SearchField from "@/components/ui/searchField";
import { FormEvent, useState } from "react";

export function PinnedSearchInput({ cb }: { cb: (str: string) => void }) {
  const [value, setValue] = useState<string>("");

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    cb(value);
  };
  return (
    <form onSubmit={(e) => submitHandler(e)}>
      <SearchField
        name="keyword"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        className="ml-0 mr-auto w-full p-1 rounded-full bg-muted"
      />
    </form>
  );
}

import SearchInput from "@/components/ui/search-input";
import { ReactNode } from "react";

export default function SearchLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="md:hidden md:mb-10 mb-4 mt-14 ">
        <SearchInput name="keyword" />
      </div>
      {children}
    </>
  );
}

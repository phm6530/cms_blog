import { Suspense } from "react";
import SearchInput from "../ui/search-input";

export default function HeaderNav() {
  return (
    <Suspense fallback={<>loading..</>}>
      <SearchInput name="keyword" className="hidden md:flex" />
    </Suspense>
  );
}

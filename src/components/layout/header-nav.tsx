import { Suspense } from "react";
import SearchInput from "../ui/search-input";

export default function HeaderNav() {
  return (
    <div className="  ">
      <Suspense fallback={<>loading..</>}>
        <SearchInput
          name="keyword"
          className="placeholder:text-xs! md:flex! hidden"
        />
      </Suspense>
    </div>
  );
}

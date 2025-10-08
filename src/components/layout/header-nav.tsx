import { Suspense } from "react";
import SearchInput from "../ui/search-input";
import ThemeHandler from "./ThemeHandler";

export default function HeaderNav() {
  return (
    <div className=" gap-5 z-10">
      <div className="grid-layout flex items-center  py-2 ">
        <Suspense fallback={<>loading..</>}>
          <SearchInput
            name="keyword"
            className="placeholder:text-xs! mr-3 md:flex! hidden"
          />
        </Suspense>
        <ThemeHandler />
      </div>
    </div>
  );
}

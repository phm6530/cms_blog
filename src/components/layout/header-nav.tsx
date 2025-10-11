import { Suspense } from "react";
import SearchInput from "../ui/search-input";
import ThemeHandler from "./ThemeHandler";

export default function HeaderNav() {
  return (
    <div className=" gap-5 z-10 fixed right-4 bottom-4  md:static  w-full ">
      <div className="flex items-center  py-2 ">
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

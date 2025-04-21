import { Suspense } from "react";
import SearchInput from "../ui/search-input";
import ThemeHandler from "./ThemeHandler";
import VisitorWiget from "../weiget/visitor-weiget";

export default function HeaderNav() {
  return (
    <div className=" gap-5 z-10">
      <div className="grid-layout flex items-center  py-2 ">
        <VisitorWiget />

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

{
  /* <div className="grid-layout flex items-center gap-5 ">
        {navlist.map((link, idx) => {
          if (link.href === "/login") {
            if (!isClient || isLoading) {
              return (
                <Skeleton
                  key={`skeleton-${idx}`}
                  className="w-[40px] h-[12px] rounded-md"
                />
              );
            } else if (session) {
              return <Navsession />;
            }
          }

          return (
            <Link key={link.href} href={link.href} className="text-sm">
              {link.name}
            </Link>
          );
        })}

        <Suspense fallback={<>loading..</>}>
          <SearchInput name="keyword" className="placeholder:text-xs!" />
        </Suspense>
        <ThemeHandler />
      </div> */
}

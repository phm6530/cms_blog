import { CategoryModel } from "@/type/blog-group";
import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";

import Link from "next/link";

export default async function CategoryWegiet() {
  const response = await withFetchRevaildationAction<{
    category: { [key: string]: CategoryModel };
    count: number;
  }>({
    endPoint: "api/category",
    options: {
      cache: "force-cache",
      next: {
        tags: [REVALIDATE.BLOG.GROUPS],
      },
    },
  });

  return (
    <section className="py-5 mt-5 border-t border-border">
      <div className=" items-center gap-2 flex pb-4">
        <h3>Category</h3>
      </div>
      {Object.values(response?.result?.category ?? []).map((e, idx) => {
        return (
          <Link
            href={`/category/${e.name}`}
            key={`${e.name}-${idx}`}
            className="flex gap-3 py-2 text-sm cursor-pointer items-center text-secondary-foreground"
          >
            <span className="flex">{e.name}</span>
            <span className="opacity-50 text-[11px] text-primary">
              ({e.postCnt})
            </span>
            {/* <span className="bg-orange-600 text-white text-[9px] size-3 items-center text-center rounded-[3px]">
              N
            </span> */}
          </Link>
        );
      })}
    </section>
  );
}

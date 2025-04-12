import { CategoryModel } from "@/type/blog-group";
import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";

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
    <section>
      {Object.values(response?.result?.category ?? []).map((e, idx) => {
        return (
          <div
            key={`${e.name}-${idx}`}
            className="flex gap-3 py-1 text-sm cursor-pointer items-center"
          >
            <span>{e.name}</span>{" "}
            <span className="opacity-70 text-xs">({e.postCnt})</span>
          </div>
        );
      })}
    </section>
  );
}

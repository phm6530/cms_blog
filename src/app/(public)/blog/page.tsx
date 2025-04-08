import BlogPage from "./[group]/page";

export default async function Blog({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string }>;
}) {
  const keyword = (await searchParams)?.search;
  return (
    <BlogPage
      searchKeyword={keyword || null}
      params={Promise.resolve({ group: undefined })}
    />
  );
}

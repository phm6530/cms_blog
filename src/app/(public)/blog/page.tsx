import BlogPage from "./[group]/page";

export default async function Blog() {
  return <BlogPage params={Promise.resolve({ group: undefined })} />;
}

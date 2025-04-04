import BlogPage from "./[group]/page";

export default function Blog() {
  return <BlogPage params={Promise.resolve({ group: undefined })} />;
}

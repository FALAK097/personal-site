import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlogList } from "@/components/blog/blog-list";
import { getAllPosts } from "@/lib/blog-source";

export const metadata = {
  title: "Blog",
  description:
    "Read my thoughts on software development, technology, and personal experiences in the tech industry.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main">
        <div className="space-y-10">
          <div>
            <h1 className="page-heading">Writing</h1>
            <p className="page-intro">
              Notes from building frontend systems, AI products, and production infrastructure.
            </p>
          </div>
          <BlogList posts={posts} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

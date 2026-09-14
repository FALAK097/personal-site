import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/custom/page-header";
import { BlogList } from "@/components/blog/blog-list";
import { getAllPosts } from "@/lib/blog-source";

export const metadata = {
  title: "Writing",
  description:
    "Read my thoughts on software development, technology, and personal experiences in the tech industry.",
};

export default async function WritingPage() {
  const posts = await getAllPosts();

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main">
        <div className="space-y-10">
          <PageHeader
            title="Writing"
            intro="Notes from building frontend systems, AI products, and production infrastructure."
          />
          <BlogList posts={posts} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

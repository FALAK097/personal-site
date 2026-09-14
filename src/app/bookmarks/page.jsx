import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/custom/page-header";
import { BookmarksList } from "@/components/bookmarks-list";

export const metadata = {
  title: "Bookmarks",
  description:
    "A curated collection of my favorite tools, articles, and engineering resources that inspire and support my work as a developer.",
};

export default function BookmarksPage() {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main">
        <div className="space-y-10">
          <PageHeader
            title="Bookmarks"
            intro="A curated collection of my favorite tools, articles, and engineering resources that inspire and support my work as a developer."
          />
          <BookmarksList />
        </div>
      </main>
      <Footer />
    </div>
  );
}

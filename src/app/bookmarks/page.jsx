import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
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
          <div>
            <h1 className="page-heading">Bookmarks</h1>
            <p className="page-intro">
              A curated collection of my favorite tools, articles, and
              engineering resources that inspire and support my work as a
              developer.
            </p>
          </div>
          <BookmarksList />
        </div>
      </main>
      <Footer />
    </div>
  );
}

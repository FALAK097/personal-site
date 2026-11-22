import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Newsletter",
  description:
    "Subscribe to my newsletter to receive updates about new blog posts, projects, and tech insights directly in your inbox.",
  path: "/newsletter",
});

export default function NewsletterPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)]">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Keep in Touch</h1>
            <p className="text-lg text-muted-foreground">
              If you&apos;d like to receive blog post updates straight to your
              inbox, feel free to subscribe to my newsletter 📬
            </p>
          </div>
          <div className="max-w-xl">
            <form className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  id="email"
                  name="email"
                  placeholder="me@example.com"
                  type="email"
                />
              </div>
              <button
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                type="submit"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

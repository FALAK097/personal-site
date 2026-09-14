import Link from "next/link";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Subscription Successful",
  description:
    "Thank you for subscribing to my newsletter! You'll receive updates about new content and projects.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewsletterSuccessPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)]">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl font-bold">Subscribed!</h1>
          <p className="text-lg text-muted-foreground">
            You should receive a confirmation email shortly! 📬 😊
          </p>
          <div className="pt-4">
            <Link className="text-primary hover:underline" href="/">
              « Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

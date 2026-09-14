import Link from "next/link";

const links = [
  ["Email", "mailto:hi@falakgala.dev"],
  ["GitHub", "https://github.com/Falak097"],
  ["LinkedIn", "https://linkedin.com/in/falak-gala"],
  ["Bookmarks", "/bookmarks"],
  ["RSS", "/rss.xml"],
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/70">
      <div className="site-container flex flex-col gap-3 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Falak Gala · Mumbai, India</p>
        <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Footer">
          {links.map(([label, href]) => <Link key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="transition-colors duration-100 hover:text-foreground">{label}</Link>)}
        </nav>
      </div>
    </footer>
  );
}

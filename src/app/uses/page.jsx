import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { usesSections } from "@/lib/uses-data";

export const metadata = { title: "Uses", description: "The hardware, software, and tools I use to design and ship products." };

export default function UsesPage() {
  return <div className="page-shell"><Navbar /><main className="page-main"><div className="space-y-12"><div><h1 className="page-heading">Uses</h1><p className="page-intro">A practical inventory of the tools behind my work. This changes as better tools earn a place.</p></div>{usesSections.map((section) => <section key={section.title} className="space-y-2"><h2 className="section-heading">{section.title}</h2><div>{section.items.map((item) => <div key={item.name} className="flat-row grid gap-1 sm:grid-cols-[10rem_1fr]"><h3 className="text-sm font-medium">{item.name}</h3><p className="text-sm leading-6 text-muted-foreground">{item.detail}</p></div>)}</div></section>)}</div></main><Footer /></div>;
}

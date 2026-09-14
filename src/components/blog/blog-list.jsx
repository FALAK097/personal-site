import { format } from "date-fns";
import Link from "next/link";

export function BlogList({ posts }) {
  return (
    <div>
      <div>
          <div className="space-y-8">
            {posts.map((post) => {
              return (
                <article key={post.slug} className="group relative">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block p-5 -mx-5 rounded-2xl transition-[background-color,border-color,box-shadow] duration-100 hover:bg-muted/50 border border-transparent hover:border-border hover:shadow-sm"
                  >
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-medium text-foreground group-hover:text-clay-500 transition-colors duration-300">
                          {post.title}
                        </h2>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                        {post.description}
                      </p>
                      <div className="flex gap-3 text-sm text-muted-foreground/80 font-medium">
                        <time dateTime={post.date}>
                          {format(new Date(post.date), "MMM dd, yyyy")}
                        </time>
                        <span>•</span>
                        <span>{post.readingTime} min read</span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
      </div>
    </div>
  );
}

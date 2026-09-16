import { format } from "date-fns";
import Link from "next/link";

export function BlogList({ posts }) {
  return (
    <div>
      <div>
          <div>
            {posts.map((post) => {
              return (
                <article key={post.slug} className="group flat-row">
                  <Link
                    href={`/writing/${post.slug}`}
                    className="portfolio-hover block"
                  >
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <h2 className="text-base font-medium text-foreground">
                          {post.title}
                        </h2>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                        {post.description}
                      </p>
                      <div className="flex gap-2 font-mono text-xs text-muted-foreground/80">
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

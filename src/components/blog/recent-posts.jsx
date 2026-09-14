import { format } from "date-fns";
import Link from "next/link";

export function RecentPosts({ posts }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-light">
          I love writing things down
        </h2>
        <Link
          href="/writing"
          className="text-sm text-muted-foreground hover:text-clay-400 transition-colors"
        >
          View All
        </Link>
      </div>
      <div>
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group"
              >
                <Link
                  className="space-y-3 hover:no-underline"
                  href={`/writing/${post.slug}`}
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium transition-colors hover:text-clay-500">
                      {post.title}
                    </h3>
                  </div>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <time dateTime={post.date}>
                      {format(new Date(post.date), "MMM dd, yyyy")}
                    </time>
                    <span>•</span>
                    <span>{post.readingTime} min</span>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {post.description}
                  </p>
                </Link>
              </article>
            ))}
          </div>
      </div>
    </div>
  );
}

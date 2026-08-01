const headingStyles = {
  h2: "mt-16 scroll-mt-24 text-3xl font-bold tracking-tight text-foreground first:mt-0",
  h3: "mt-12 scroll-mt-24 text-2xl font-bold tracking-tight text-foreground",
  h4: "mt-10 scroll-mt-24 text-xl font-semibold tracking-tight text-foreground",
};

export const mdxComponents = {
  h2: ({ children, ...props }) => (
    <h2 className={headingStyles.h2} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className={headingStyles.h3} {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className={headingStyles.h4} {...props}>
      {children}
    </h4>
  ),
  a: ({ children, href, ...props }) => {
    const external = href?.startsWith("http");

    return (
      <a
        href={href}
        className="font-medium text-clay-600 underline decoration-clay-300 underline-offset-4 transition-colors hover:text-clay-500 dark:text-clay-300 dark:decoration-clay-700"
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        {...props}
      >
        {children}
      </a>
    );
  },
  table: ({ children, ...props }) => (
    <div className="my-8 overflow-x-auto rounded-xl border border-border shadow-sm">
      <table className="my-0 w-full min-w-[720px] text-left text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-muted/70" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th
      className="border-b border-border px-4 py-3 font-semibold text-foreground"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td
      className="border-b border-border/70 px-4 py-3 align-top leading-relaxed"
      {...props}
    >
      {children}
    </td>
  ),
  img: ({ alt, ...props }) => (
    // The MDX source is maintained locally, so its image paths are trusted.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt ?? ""}
      className="my-10 h-auto w-full rounded-2xl border border-border bg-white shadow-sm"
      loading="lazy"
      {...props}
    />
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="my-8 rounded-r-xl border-l-4 border-clay-400 bg-muted/50 px-6 py-4 text-foreground"
      {...props}
    >
      {children}
    </blockquote>
  ),
};

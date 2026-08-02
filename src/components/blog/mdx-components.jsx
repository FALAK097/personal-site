const headingStyles = {
  h2: "mt-16 scroll-mt-24 text-3xl font-bold tracking-tight text-foreground first:mt-0",
  h3: "mt-12 scroll-mt-24 text-2xl font-bold tracking-tight text-foreground",
  h4: "mt-10 scroll-mt-24 text-xl font-semibold tracking-tight text-foreground",
};

function resolveImageSource(src) {
  return typeof src === "string" ? src : src?.src;
}

export function Figure({ src, alt = "", caption, className = "" }) {
  return (
    <figure className={`my-10 ${className}`}>
      {/* Local MDX media paths are trusted portfolio content. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolveImageSource(src)}
        alt={alt}
        className="m-0 h-auto w-full rounded-2xl border border-border bg-white shadow-sm"
        loading="lazy"
      />
      {caption && (
        <figcaption className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function Video({
  src,
  poster,
  caption,
  autoPlay = false,
  loop = false,
  title = "Article video",
}) {
  return (
    <figure className="my-10">
      <div className="overflow-hidden rounded-2xl border border-border bg-black shadow-sm">
        <video
          className="m-0 block h-auto w-full"
          src={resolveImageSource(src)}
          poster={resolveImageSource(poster)}
          controls
          playsInline
          muted={autoPlay}
          autoPlay={autoPlay}
          loop={loop}
          preload="metadata"
          aria-label={title}
        >
          Your browser does not support embedded video.
        </video>
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function MetricGrid({ children }) {
  return (
    <div className="not-prose my-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
  );
}

export function Flow({ children }) {
  return (
    <div className="not-prose my-8 grid gap-3 rounded-2xl border border-border bg-muted/25 p-4 sm:p-5">
      {children}
    </div>
  );
}

export function FlowStep({ number, title, children }) {
  return (
    <div className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 rounded-xl border border-border/70 bg-background p-4 shadow-sm">
      <span className="flex size-8 items-center justify-center rounded-full bg-clay-100 text-sm font-bold text-clay-800 dark:bg-clay-900 dark:text-clay-200">
        {number}
      </span>
      <div>
        <p className="m-0 font-semibold text-foreground">{title}</p>
        <div className="mt-1 text-sm leading-6 text-muted-foreground [&>*]:m-0">{children}</div>
      </div>
    </div>
  );
}

export function Callout({ title, children }) {
  return (
    <aside className="mt-4 mb-8 rounded-2xl border border-clay-200 bg-clay-50/70 px-5 py-4 text-clay-950 dark:border-clay-800 dark:bg-clay-950/25 dark:text-clay-50">
      {title && <p className="mb-1 font-semibold text-current">{title}</p>}
      <div className="[&>*:last-child]:mb-0 [&>*:first-child]:mt-0">{children}</div>
    </aside>
  );
}

export function Metric({ value, label }) {
  return (
    <span className="my-4 inline-flex min-w-40 flex-col rounded-2xl border border-border bg-muted/35 px-5 py-4 align-top">
      <strong className="text-2xl font-bold tracking-tight text-foreground">{value}</strong>
      <span className="mt-1 text-sm text-muted-foreground">{label}</span>
    </span>
  );
}

export const mdxComponents = {
  Figure,
  Diagram: Figure,
  Video,
  Callout,
  Metric,
  MetricGrid,
  Flow,
  FlowStep,
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
  img: ({ alt, src, ...props }) => (
    // The MDX source is maintained locally, so its image paths are trusted.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt ?? ""}
      src={resolveImageSource(src)}
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

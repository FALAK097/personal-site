"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BlogList } from "@/components/blog/blog-list";

const SEARCH_DEBOUNCE_MS = 180;
const MAX_QUERY_LENGTH = 80;
const SNIPPET_LENGTH = 150;

// Normalize for matching: lowercase, strip diacritics, collapse whitespace.
function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// Light markdown/MDX cleanup so indexed content and snippets read like prose:
// links keep their text, images drop out, emphasis markers disappear.
function cleanContentText(value) {
  return String(value ?? "")
    .replace(/```[\s\S]*?```/g, (match) =>
      match.replace(/```\w*\n?/g, " ").replace(/\n/g, " "),
    )
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`{1,2}([^`]+)`{1,2}/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_`>~|-]{1,3}(?=\s|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitTerms(rawQuery) {
  const normalized = normalizeText(rawQuery).slice(0, MAX_QUERY_LENGTH);
  return normalized ? normalized.split(" ").filter(Boolean) : [];
}

function includesAll(haystack, terms) {
  if (!haystack) return false;
  return terms.every((term) => haystack.includes(term));
}

function includesSome(haystack, terms) {
  if (!haystack) return 0;
  return terms.reduce((count, term) => count + (haystack.includes(term) ? 1 : 0), 0);
}

// Rank: title matches weigh most, then tags, description, content. Partial
// (some-terms) matches still surface below full matches.
function scorePost(index, terms) {
  const title = includesAll(index.titleN, terms);
  const tags = includesAll(index.tagBlobN, terms);
  const description = includesAll(index.descriptionN, terms);
  const content = includesAll(index.contentN, terms);
  if (!title && !tags && !description && !content) {
    // Partial matches (some terms only) still count, weighted lightly.
    const partial =
      includesSome(index.titleN, terms) * 2 +
      includesSome(index.tagBlobN, terms) * 2 +
      includesSome(index.descriptionN, terms) * 2 +
      includesSome(index.contentN, terms);
    if (!partial) return -1;
    return partial;
  }
  return (title ? 100 : 0) + (tags ? 60 : 0) + (description ? 40 : 0) + (content ? 20 : 0);
}

// Case-insensitive split of a raw string by the raw query terms, for
// highlighting. Falls back to plain text when nothing matches (diacritics).
function highlightText(rawText, rawQuery) {
  const terms = splitTerms(rawQuery);
  if (!terms.length) return null;

  const marks = [];
  const lower = String(rawText ?? "").toLowerCase();
  for (const term of terms) {
    let from = 0;
    while (marks.length < 200) {
      const idx = lower.indexOf(term, from);
      if (idx === -1) break;
      marks.push([idx, idx + term.length]);
      from = idx + term.length;
    }
  }
  if (!marks.length) return null;

  marks.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const [start, end] of marks) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else merged.push([start, end]);
  }

  const nodes = [];
  let cursor = 0;
  for (const [start, end] of merged) {
    if (start > cursor) nodes.push(rawText.slice(cursor, start));
    nodes.push(
      <mark key={start} className="bg-clay-500/15 text-foreground rounded-[3px] px-0.5">
        {rawText.slice(start, end)}
      </mark>,
    );
    cursor = end;
  }
  if (cursor < rawText.length) nodes.push(rawText.slice(cursor));
  return nodes;
}

// Snippet around the first content match, from the cleaned raw content so
// casing reads naturally; highlight via case-insensitive indexOf.
function buildSnippet(rawContent, terms) {
  if (!rawContent) return null;
  const lower = rawContent.toLowerCase();
  const first = terms
    .map((term) => lower.indexOf(term))
    .filter((idx) => idx !== -1)
    .sort((a, b) => a - b)[0];
  if (first === undefined) return null;

  const start = Math.max(0, first - 40);
  const end = Math.min(rawContent.length, first + SNIPPET_LENGTH);
  const raw = `${start > 0 ? "…" : ""}${rawContent.slice(start, end)}${end < rawContent.length ? "…" : ""}`;

  const nodes = [];
  let cursor = 0;
  const rawLower = raw.toLowerCase();
  const marks = [];
  for (const term of terms) {
    let from = 0;
    while (marks.length < 100) {
      const idx = rawLower.indexOf(term, from);
      if (idx === -1) break;
      marks.push([idx, idx + term.length]);
      from = idx + term.length;
    }
  }
  marks.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const [startM, endM] of marks) {
    const last = merged[merged.length - 1];
    if (last && startM <= last[1]) last[1] = Math.max(last[1], endM);
    else merged.push([startM, endM]);
  }
  for (const [startM, endM] of merged) {
    if (startM > cursor) nodes.push(raw.slice(cursor, startM));
    nodes.push(
      <mark key={startM} className="bg-clay-500/15 text-foreground rounded-[3px]">
        {raw.slice(startM, endM)}
      </mark>,
    );
    cursor = endM;
  }
  if (cursor < raw.length) nodes.push(raw.slice(cursor));
  return nodes;
}

function SearchRow({ post, query }) {
  const terms = splitTerms(query);
  const highlightedTitle = highlightText(post.title, query);
  const highlightedDescription = highlightText(post.description, query);
  const snippet = terms.length ? buildSnippet(post.content, terms) : null;
  const matchedTags = post.tags.filter((tag) =>
    terms.some((term) => normalizeText(tag).includes(term)),
  );

  return (
    <article className="group flat-row">
      <Link href={`/writing/${post.slug}`} className="portfolio-hover block">
        <div className="flex flex-col space-y-2">
          <h2 className="text-base font-medium text-foreground">
            {highlightedTitle ?? post.title}
          </h2>
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {highlightedDescription ?? post.description}
          </p>
          {snippet ? (
            <p className="text-[13px] leading-relaxed text-muted-foreground/90 line-clamp-2 [&_mark]:bg-clay-500/15">
              {snippet}
            </p>
          ) : null}
          {matchedTags.length ? (
            <div className="flex flex-wrap gap-1.5">
              {matchedTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
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
}

export function BlogSearch({ posts, initialQuery = "", title, intro }) {
  // `q` (committed query) drives results; `input` tracks the field so typing
  // stays instant and the debounce only affects filtering.
  const [q, setQ] = useState(normalizeText(initialQuery));
  const [input, setInput] = useState(initialQuery.slice(0, MAX_QUERY_LENGTH));
  const [composing, setComposing] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  const index = useMemo(
    () =>
      posts.map((post) => {
        const content = cleanContentText(post.content);
        return {
          ...post,
          titleN: normalizeText(post.title),
          descriptionN: normalizeText(post.description),
          tagBlobN: normalizeText((post.tags ?? []).join(" ")),
          contentN: normalizeText(content),
          content,
        };
      }),
    [posts],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const commit = useCallback((value) => {
    setQ(value);
    if (typeof window !== "undefined") {
      const url = value ? `/writing?q=${encodeURIComponent(value.slice(0, MAX_QUERY_LENGTH))}` : "/writing";
      window.history.replaceState(null, "", url);
    }
  }, []);

  const onInput = useCallback(
    (value) => {
      setInput(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        commit(value.trim().slice(0, MAX_QUERY_LENGTH));
      }, SEARCH_DEBOUNCE_MS);
    },
    [commit],
  );

  const clear = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setInput("");
    commit("");
    inputRef.current?.focus();
  }, [commit]);

  const terms = splitTerms(q);
  const hasQuery = terms.length > 0;

  const results = useMemo(() => {
    if (!hasQuery) return null;
    const scored = index
      .map((entry) => ({ entry, score: scorePost(entry, terms) }))
      .filter(({ score }) => score >= 0);
    scored.sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.entry.date).getTime() - new Date(a.entry.date).getTime(),
    );
    return scored.map(({ entry }) => entry);
  }, [index, terms, hasQuery]);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <h1 className="page-heading">{title}</h1>
          <div className="relative w-44 sm:w-56">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="search"
              aria-label="Search writing"
              placeholder="Search..."
              value={input}
              maxLength={MAX_QUERY_LENGTH + 20}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              onChange={(event) => {
                if (composing) return;
                onInput(event.target.value);
              }}
              onCompositionStart={() => setComposing(true)}
              onCompositionEnd={(event) => {
                setComposing(false);
                onInput(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") clear();
              }}
              className={cnInput(!!input)}
            />
            {input ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={clear}
                className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors duration-100 hover:bg-muted/60 hover:text-foreground"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>
        {intro ? <p className="page-intro">{intro}</p> : null}
      </header>

      {!hasQuery ? (
        <BlogList posts={posts} />
      ) : results.length ? (
        <div key={q} className="animate-in fade-in-0 duration-150">
          <p className="mb-4 font-mono text-xs text-muted-foreground tabular-nums">
            {results.length} {results.length === 1 ? "post" : "posts"} match
            {results.length === 1 ? "es" : ""}{" "}
            <span className="text-foreground">&ldquo;{q}&rdquo;</span>
          </p>
          <div>
            {results.map((post) => (
              <SearchRow key={post.slug} post={post} query={q} />
            ))}
          </div>
        </div>
      ) : (
        <div className="py-12 text-center" key="no-results">
          <p className="text-sm text-muted-foreground">
            Nothing matches <span className="font-medium text-foreground">&ldquo;{q}&rdquo;</span>.
          </p>
          <button
            type="button"
            onClick={clear}
            className="mt-3 text-sm font-medium text-[#2563eb] transition-colors hover:opacity-80 dark:text-clay-500"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}

function cnInput(hasValue) {
  return [
    "h-10 w-full rounded-lg border border-input bg-muted/30 pl-9 pr-9 text-sm text-foreground shadow-xs outline-none transition-[border-color,box-shadow,background-color] duration-150",
    "placeholder:text-muted-foreground/70 [&::-webkit-search-cancel-button]:hidden",
    "hover:bg-muted/40",
    "focus-visible:border-border focus-visible:bg-background focus-visible:ring-[3px] focus-visible:ring-border/50",
    hasValue ? "bg-background" : "",
  ].join(" ");
}

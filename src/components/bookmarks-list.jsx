"use client";

import { useEffect, useState } from "react";
import { getBookmarks } from "@/actions/bookmarks";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { TrendingUpIcon, BookmarkIcon } from "./icons";
import { ViewToggle, useViewPreference } from "@/components/view-toggle";

export const BookmarksList = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [viewMode, setViewMode] = useViewPreference();
  const [activeTag, setActiveTag] = useState("all");

  useEffect(() => {
    getBookmarks().then(setBookmarks).catch(console.error);
  }, []);

  const allTags = [
    "all",
    ...new Set(bookmarks.flatMap((bookmark) => bookmark.tags || [])),
  ];

  const filteredBookmarks =
    activeTag === "all"
      ? bookmarks
      : bookmarks.filter((bookmark) => bookmark.tags?.includes(activeTag));

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-2 w-full">
          <Tabs
            value={activeTag}
            onValueChange={setActiveTag}
            className="flex-1 min-w-0"
          >
            <TabsList className="bg-background h-auto p-1 flex flex-wrap">
              {allTags.map((tag) => (
                <TabsTrigger
                  key={tag}
                  value={tag}
                  className="px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:border-b-clay-400 data-[state=active]:text-clay-800 dark:data-[state=active]:bg-black dark:data-[state=active]:text-white dark:data-[state=active]:border-b-clay-400"
                >
                  {tag}
                  {tag === "all" ? (
                    <span className="ml-1 text-xs text-clay-500 font-semibold">
                      ({bookmarks.length})
                    </span>
                  ) : (
                    <span className="ml-1 text-xs text-clay-400 font-medium">
                      ({bookmarks.filter((b) => b.tags?.includes(tag)).length})
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <ViewToggle value={viewMode} onChange={setViewMode} />
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="masonry-grid">
          {filteredBookmarks.map((bookmark) => (
            <MoodboardCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      ) : (
        <div>
          {filteredBookmarks.map((bookmark) => (
            <ListCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      )}
    </div>
  );
};

const MoodboardCard = ({ bookmark }) => {
  const isLarge = bookmark.featured;

  return (
    <article
      className={cn(
        "masonry-item group overflow-hidden rounded-lg bg-muted/30 transition-opacity duration-100",
        isLarge ? "masonry-item-large" : ""
      )}
    >
      <a
        href={bookmark.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        <div className="relative aspect-video w-full overflow-hidden bg-clay-100 dark:bg-clay-900">
          {bookmark.cover ? (
            <img
              src={bookmark.cover || "/placeholder.svg"}
              alt={bookmark.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-clay-300 to-clay-100 dark:from-clay-800 dark:to-clay-950">
              <BookmarkIcon
                size={48}
                className="text-clay-500 dark:text-clay-300 opacity-50"
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex items-center gap-1">
              <TrendingUpIcon size={14} />
              <span className="text-xs truncate">
                {new URL(bookmark.link).hostname}
              </span>
            </div>
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-medium text-primary hover:text-clay-600 line-clamp-2 text-sm leading-tight">
            {bookmark.title}
          </h3>
          <div className="mt-2 flex flex-wrap gap-1">
            {bookmark.tags &&
              bookmark.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-full bg-clay-100 dark:bg-clay-800 text-clay-700 dark:text-clay-200"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>
      </a>
    </article>
  );
};

const ListCard = ({ bookmark }) => {
  return (
    <div className="group flex items-start gap-3 border-b border-border/70 py-4 last:border-b-0">
      <div className="flex-shrink-0">
        {bookmark.cover ? (
          <img
            src={bookmark.cover || "/placeholder.svg"}
            alt={bookmark.title}
            className="w-12 h-12 object-cover rounded-md shadow-sm border border-clay-200 dark:border-clay-700"
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-br from-clay-300 to-clay-100 dark:from-clay-800 dark:to-clay-950 rounded-md flex items-center justify-center">
            <BookmarkIcon
              size={20}
              className="text-clay-500 dark:text-clay-300 opacity-70"
            />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <a
              href={bookmark.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium text-primary hover:text-clay-600 transition-colors duration-200 line-clamp-1 block"
            >
              {bookmark.title}
            </a>

            <div className="flex items-center gap-2 mt-1">
              {bookmark.tags && bookmark.tags.length > 0 && (
                <span className="text-xs text-clay-600 dark:text-clay-400 font-medium">
                  #{bookmark.tags[0]}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <TrendingUpIcon size={12} />
                {new URL(bookmark.link).hostname}
              </span>
              {bookmark.createdAt && (
                <>
                  <span>•</span>
                  <span>
                    {new Date(bookmark.createdAt).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

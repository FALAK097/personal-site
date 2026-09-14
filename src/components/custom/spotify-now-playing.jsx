"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Disc3Icon, MusicIcon, TrendingUpIcon } from "../icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export const SpotifyNowPlaying = ({ songData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const isPlaying = songData?.isPlaying;
  const isRecentlyPlayed = songData?.isRecentlyPlayed;
  const hasData = songData && (songData.title || songData.artist);
  const loading = !songData;

  useEffect(() => {
    setImageError(false);
  }, [songData?.albumImageUrl]);

  const timeAgo = (date) => {
    if (!date) return "";
    const diffInSeconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (diffInSeconds < 60) return "just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return `1 day ago`;
    return `${diffInDays} days ago`;
  };

  const renderAlbumArt = () => {
    if (loading) {
      return (
        <div className="w-12 h-12 bg-clay-500/10 flex items-center justify-center rounded-full flex-shrink-0">
          <Disc3Icon className="w-5 h-5 text-clay-500 animate-spin" />
        </div>
      );
    }

    if (!hasData || !songData.albumImageUrl || imageError) {
      return (
        <div className="w-12 h-12 bg-clay-500/10 flex items-center justify-center rounded-full flex-shrink-0">
          <MusicIcon className="w-5 h-5 text-clay-500" />
        </div>
      );
    }

    return (
      <div className="relative w-12 h-12 flex-shrink-0 rounded-full shadow-md border border-border/50 bg-background flex items-center justify-center">
        <img
          src={songData.albumImageUrl}
          alt={songData.album || "Album Art"}
          className={`absolute inset-0 w-full h-full object-cover rounded-full ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`}
          onError={() => setImageError(true)}
        />
        {/* CD inner hole */}
        <div className="absolute w-3 h-3 bg-background rounded-full border border-border/50 shadow-inner z-10" />
        
        {isPlaying && (
          <div className="absolute inset-0 rounded-full border border-green-500/30 animate-pulse z-0 pointer-events-none" />
        )}
      </div>
    );
  };

  return (
    <TooltipProvider delayDuration={100} skipDelayDuration={500}>
      <Tooltip open={isHovered} onOpenChange={setIsHovered}>
        <TooltipTrigger asChild>
           <span 
            className="inline-flex items-center gap-1 cursor-pointer text-clay-500 transition-colors hover:text-clay-400"
            onClick={() => {
              if (songData?.songUrl) {
                window.open(songData.songUrl, "_blank", "noopener,noreferrer");
              }
            }}
          >
            music {" "}
            <img 
              src="/spotify.svg" 
              alt="Spotify" 
              className="inline-block relative -top-[1px] w-4 h-4"
            />
          </span>
        </TooltipTrigger>
        <AnimatePresence>
          {isHovered && (
            <TooltipContent
              side="top"
              sideOffset={8}
              forceMount
              className="bg-background/95 backdrop-blur-md border border-border shadow-2xl p-4 rounded-xl z-50 overflow-hidden pointer-events-auto"
              asChild
            >
              <m.a
                href={songData?.songUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="flex items-center gap-4 min-w-[240px] max-w-[320px] group no-underline text-foreground cursor-pointer"
              >
                {renderAlbumArt()}
                <div className="flex flex-col flex-1 min-w-0 justify-center">
                  {hasData ? (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-sm font-semibold text-foreground truncate" title={songData.title}>
                          {songData.title}
                        </span>
                        <TrendingUpIcon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors mt-0.5 flex-shrink-0" />
                      </div>
                      <span className="text-xs text-muted-foreground truncate w-full" title={songData.artist}>
                        {songData.artist}
                      </span>
                      
                      <div className="w-full h-px bg-border/40 my-2" />
                      
                      {isRecentlyPlayed && songData.playedAt && (
                        <span className="text-[11px] text-muted-foreground/60">
                          Last played {timeAgo(songData.playedAt)}
                        </span>
                      )}
                      {!isRecentlyPlayed && isPlaying && (
                        <span className="text-[11px] text-green-600 dark:text-green-500 font-medium flex items-center gap-1.5 uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
                          Now Playing
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Not playing anything
                    </span>
                  )}
                </div>
              </m.a>
            </TooltipContent>
          )}
        </AnimatePresence>
      </Tooltip>
    </TooltipProvider>
  );
};

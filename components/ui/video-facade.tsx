"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { AnimateWhenVisible } from "./animate-when-visible";

type Props = {
  /** Embed URL of the player (HubSpot Video, YouTube embed…). Autoplay is requested on click. */
  src: string;
  /** Accessible title for the iframe and the play button, e.g. "PowerChampions network video". */
  title: string;
  poster: StaticImageData;
  posterAlt: string;
  /** Short caption shown on the poster. */
  label?: string;
  sizes?: string;
  className?: string;
};

/**
 * Click-to-load video. Until the visitor presses play, only a poster image is rendered:
 * no third-party player JS, no cookies, no layout cost. Keeps Lighthouse at 90+ and respects privacy.
 * Square HUD corner brackets frame the poster to match the rest of the site.
 */
export function VideoFacade({ src, title, poster, posterAlt, label, sizes = "(min-width: 1024px) 55vw, 100vw", className }: Props) {
  const [playing, setPlaying] = useState(false);
  const autoplaySrc = src + (src.includes("?") ? "&" : "?") + "autoplay=true&autoplay=1";

  return (
    <AnimateWhenVisible data-scheme="dark" className={cn("group/video relative isolate aspect-video w-full overflow-hidden border border-hairline bg-page", className)}>
      {playing ? (
        <iframe
          src={autoplaySrc}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="absolute inset-0 h-full w-full cursor-pointer text-left">
          <Image
            src={poster}
            alt={posterAlt}
            fill
            sizes={sizes}
            quality={60}
            className="-z-20 object-cover transition-transform duration-1000 ease-out-expo group-hover/video:scale-105"
          />
          <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/35 to-ink/10" />

          {/* HUD corner brackets */}
          {["left-4 top-4 border-l border-t", "right-4 top-4 border-r border-t", "bottom-4 left-4 border-b border-l", "bottom-4 right-4 border-b border-r"].map((pos) => (
            <span key={pos} aria-hidden className={cn("absolute size-6 border-gold/80 transition-all duration-500 group-hover/video:size-8", pos)} />
          ))}

          <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <span aria-hidden className="decor-anim absolute size-20 animate-pulse-ring rounded-full border border-gold/70" />
            <span className="relative flex size-20 items-center justify-center rounded-full bg-gold text-ink shadow-glow transition-transform duration-500 ease-out-expo group-hover/video:scale-110">
              <svg aria-hidden viewBox="0 0 24 24" className="ml-1 size-7" fill="currentColor">
                <path d="M7 4.5v15l13-7.5-13-7.5Z" />
              </svg>
            </span>
          </span>

          <span className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4 sm:inset-x-8 sm:bottom-8">
            {label && <span className="text-sm font-bold uppercase tracking-[0.16em] text-fg">{label}</span>}
            <span className="shrink-0 text-xs font-medium uppercase tracking-[0.16em] text-on-dark">Play video</span>
          </span>
          <span className="sr-only">Play: {title}</span>
        </button>
      )}
    </AnimateWhenVisible>
  );
}

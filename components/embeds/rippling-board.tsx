"use client";

import { useEffect, useRef, useState } from "react";
import { RIPPLING_BOARD_ID } from "@/lib/site";
import { loadScript, whenNear } from "./lazy-script";

/**
 * Rippling Recruiting job board — the same embed the live careers page uses
 * (`<div id="rr-job-board" data-job-board-id="power-champions">` + job-board.v1.js),
 * loaded only when the section scrolls near.
 */
export function RipplingBoard() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return whenNear(el, () => {
      setState("loading");
      loadScript("https://static-assets.ripplingcdn.com/ats/embeds/job-board.v1.js").catch(() => setState("error"));
    });
  }, []);

  return (
    <div ref={ref} data-tone="light" className="relative min-h-80 bg-white p-4 text-body sm:p-8">
      <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold to-orange" />
      <div id="rr-job-board" data-job-board-id={RIPPLING_BOARD_ID} />
      {state === "error" && (
        <p className="text-sm text-heading" role="alert">
          The job board couldn’t load. Please disable any ad-blocker for this site and refresh.
        </p>
      )}
    </div>
  );
}

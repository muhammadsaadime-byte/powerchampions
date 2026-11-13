"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Lenis smooth scrolling for the whole document.
 * - Never runs for prefers-reduced-motion visitors, and switches itself off live if that OS
 *   setting changes. Touch devices keep native scrolling (syncTouch is off by default).
 * - Anchor links (#PowerChampions-Team etc.) scroll smoothly and clear the fixed header.
 * - Performance: Lenis's built-in `autoRaf` requests a frame forever, which forces Chrome to run a
 *   full main-thread frame (and re-style every running CSS animation) 60×/s even when idle.
 *   Instead, the loop only runs while Lenis is actively smoothing a scroll, and sleeps otherwise.
 */
export function SmoothScroll() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    let frame = 0;

    const loop = (time: number) => {
      if (!lenis) return (frame = 0);
      lenis.raf(time);
      frame = lenis.isScrolling === "smooth" ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (lenis && !frame) frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (lenis || media.matches) return;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const headerOffset = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--pc-header-h")) || 4.5) * rem;
      lenis = new Lenis({
        autoRaf: false,
        lerp: 0.12,
        anchors: { offset: -(headerOffset + 16) },
        // Let elements that scroll on their own (menus, iframes, carousels) keep native scroll.
        prevent: (node) => node.closest("[data-lenis-prevent]") !== null,
      });
      lenis.on("virtual-scroll", kick);
      document.addEventListener("click", kick, true); // anchor links start a smooth scroll
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      document.removeEventListener("click", kick, true);
      lenis?.destroy();
      lenis = null;
    };
    const onChange = () => (media.matches ? stop() : start());

    start();
    media.addEventListener("change", onChange);
    return () => {
      media.removeEventListener("change", onChange);
      stop();
    };
  }, []);

  return null;
}

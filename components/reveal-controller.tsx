"use client";

import { useEffect } from "react";

/**
 * Drives every [data-reveal] element on the page with ONE IntersectionObserver.
 * 1. Marks elements already in the viewport as revealed (so nothing on screen flashes).
 * 2. Adds `reveal-ready` to <html>, which is what enables the hidden state in CSS.
 * 3. Reveals the rest as they scroll in, and picks up elements added later (client navigation).
 */
export function RevealController() {
  useEffect(() => {
    const root = document.documentElement;
    const reveal = (el: Element) => el.setAttribute("data-revealed", "");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            reveal(e.target);
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );

    const track = (scope: ParentNode) => {
      const vh = window.innerHeight;
      scope.querySelectorAll("[data-reveal]:not([data-revealed])").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) reveal(el);
        else io.observe(el);
      });
    };

    track(document);
    root.classList.add("reveal-ready");

    const mo = new MutationObserver((records) => {
      for (const rec of records)
        rec.addedNodes.forEach((n) => {
          if (n instanceof Element) {
            if (n.matches("[data-reveal]:not([data-revealed])")) track(n.parentElement ?? document);
            else track(n);
          }
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}

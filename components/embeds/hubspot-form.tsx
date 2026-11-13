"use client";

import { useEffect, useId, useRef, useState } from "react";
import { HUBSPOT } from "@/lib/site";
import { loadScript, whenNear } from "./lazy-script";

type HbsptWindow = Window & {
  hbspt?: { forms: { create: (opts: Record<string, unknown>) => void } };
};

/**
 * Embeds a live HubSpot form, so submissions go to exactly the same form/workflows as today.
 * The HubSpot script loads only when the form scrolls near (keeps it off the critical path).
 * The form renders on a light card: HubSpot's own field styles are designed for light backgrounds.
 */
export function HubSpotForm({ formId, title }: { formId: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = `hsform-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return whenNear(el, () => {
      setState("loading");
      loadScript(`https://js-${HUBSPOT.region}.hsforms.net/forms/embed/v2.js`)
        .then(() => {
          const w = window as HbsptWindow;
          w.hbspt?.forms.create({
            region: HUBSPOT.region,
            portalId: HUBSPOT.portalId,
            formId,
            target: `#${id}`,
            onFormReady: () => setState("ready"),
          });
        })
        .catch(() => setState("error"));
    });
  }, [formId, id]);

  return (
    <div ref={ref} data-tone="light" className="pc-hsform relative min-h-[28rem] bg-white p-6 text-body shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8)] sm:p-10">
      <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold to-orange" />
      <div id={id} aria-label={title} />
      {state !== "ready" && state !== "error" && (
        <p className="flex items-center gap-3 text-sm text-body" role="status">
          <span aria-hidden className="size-2 animate-pulse rounded-full bg-gold" /> Loading the form…
        </p>
      )}
      {state === "error" && (
        <p className="text-sm text-heading" role="alert">
          The form couldn’t load. Please disable any ad-blocker for this site, or reach us through{" "}
          <a href="https://www.linkedin.com/company/power-champions" className="text-navy underline">
            LinkedIn
          </a>
          .
        </p>
      )}
    </div>
  );
}

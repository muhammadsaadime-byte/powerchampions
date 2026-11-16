"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { HUBSPOT } from "@/lib/site";
import { loadScript, whenNear } from "./lazy-script";

type HbsptWindow = Window & {
  hbspt?: { forms: { create: (opts: Record<string, unknown>) => void } };
};

type Props = {
  formId: string;
  title: string;
  /**
   * "card": the full contact form on a white card.
   * "inline": a compact signup (single field + button) for bands like the newsletter.
   */
  variant?: "card" | "inline";
  className?: string;
};

/**
 * Embeds a live HubSpot form, so submissions go to exactly the same form, workflows and reCAPTCHA as today.
 * (HubSpot rejects API submissions to forms with CAPTCHA on, so a hand-built form isn't an option.)
 *
 * Styling, see `.pc-hsform` in globals.css:
 * - Forms from HubSpot's new editor render in an iframe; HubSpot passes the `--hsf-*` CSS variables
 *   set on the container into it, which is the only supported way to restyle them.
 * - Legacy forms render in the page; `css: ""` drops HubSpot's theme so our own CSS applies.
 *
 * The script loads only when the form scrolls near (keeps it off the critical path).
 */
export function HubSpotForm({ formId, title, variant = "card", className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const id = `hsform-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // New-editor forms report readiness through a global event, not onFormReady (HubSpot docs:
    // register it before the embed runs). Matching on formId keeps two forms on a page independent.
    const onReady = (e: Event) => {
      if ((e as CustomEvent<{ formId?: string }>).detail?.formId === formId) setState("ready");
    };
    window.addEventListener("hs-form-event:on-ready", onReady);

    const stop = whenNear(el, () => {
      setState("loading");
      loadScript(`https://js-${HUBSPOT.region}.hsforms.net/forms/embed/v2.js`)
        .then(() => {
          (window as HbsptWindow).hbspt?.forms.create({
            region: HUBSPOT.region,
            portalId: HUBSPOT.portalId,
            formId,
            target: `#${id}`,
            css: "",
            onFormReady: () => setState("ready"),
          });
        })
        .catch(() => setState("error"));
    });

    return () => {
      window.removeEventListener("hs-form-event:on-ready", onReady);
      stop();
    };
  }, [formId, id]);

  const card = variant === "card";

  return (
    <div
      ref={ref}
      data-tone="light"
      data-variant={variant}
      className={cn(
        "pc-hsform relative text-body",
        card && "min-h-[36rem] bg-white p-6 shadow-[0_40px_90px_-40px_rgb(0_0_0/0.55)] sm:p-10",
        className,
      )}
    >
      {card && <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold to-orange" />}
      <div id={id} role="group" aria-label={title} />
      {(state === "idle" || state === "loading") && (
        <div role="status" aria-label="Loading the form" className={cn(card ? "space-y-6" : "flex gap-3")}>
          {/* Skeleton in the form's own shape, so the card doesn't jump when HubSpot finishes. */}
          {card ? (
            <>
              <span className="block h-8 w-2/3 animate-pulse bg-mist" />
              <span className="block h-4 w-full animate-pulse bg-mist" />
              <div className="grid gap-5 sm:grid-cols-2">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="block h-12 animate-pulse bg-mist" />
                ))}
              </div>
              <span className="block h-28 animate-pulse bg-mist" />
              <span className="block h-12 w-40 animate-pulse bg-gold/40" />
            </>
          ) : (
            <>
              <span className="block h-13 flex-1 animate-pulse bg-mist" />
              <span className="block h-13 w-36 animate-pulse bg-gold/40" />
            </>
          )}
        </div>
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

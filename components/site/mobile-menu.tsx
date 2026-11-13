"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Button, GridBackground } from "@/components/ui";
import { cn } from "@/lib/cn";
import { NAV, NAV_CTA, SOCIAL, isActive, isItemActive } from "@/lib/nav";
import logo from "@/public/images/site/powerchampions-logo-trim.svg";

type Props = { open: boolean; onClose: () => void; pathname: string };


/**
 * Full-screen mobile / tablet menu built on a native modal <dialog>:
 * focus trap, Escape-to-close and an inert page behind it come from the browser.
 * Page scroll is locked while open; `data-lenis-prevent` lets the menu itself scroll natively.
 */
export function MobileMenu({ open, onClose, pathname }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // React's autoFocus doesn't emit an `autofocus` attribute, so showModal() would pick the logo link.
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onDialogClose = () => {
      document.documentElement.style.overflow = "";
      onClose();
    };
    dialog.addEventListener("close", onDialogClose);
    return () => dialog.removeEventListener("close", onDialogClose);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      aria-label="Site menu"
      data-lenis-prevent
      className={cn(
        "fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain bg-ink p-0 text-white backdrop:bg-ink/80",
        "opacity-0 transition-[opacity,display,overlay] transition-discrete duration-300 ease-out-expo open:opacity-100 starting:open:opacity-0",
      )}
    >
      {open && <MenuContent pathname={pathname} onClose={onClose} />}
    </dialog>
  );
}

function MenuContent({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  // Open the group that contains the current page, so visitors see where they are.
  const [expanded, setExpanded] = useState<string | null>(() => NAV.find((i) => i.kind !== "link" && isItemActive(pathname, i))?.label ?? null);
  const baseId = useId();
  let index = 0;
  // CSS-only staggered entrance (no animation library): each row gets a slightly later delay.
  const enter = () => ({ style: { animationDelay: `${(0.08 + index++ * 0.05).toFixed(2)}s` } });

  return (
    <div className="relative isolate flex min-h-full flex-col">
      <GridBackground fade="top" />

      <div className="flex h-[var(--pc-header-h)] shrink-0 items-center justify-between px-4 sm:px-6">
        <Link href="/" onClick={onClose} aria-label="PowerChampions home">
          <Image src={logo} alt="PowerChampions" className="h-9 w-auto sm:h-10" />
        </Link>
        {/* First focusable element after the logo, so Escape/Enter closes quickly from the keyboard. */}
        <button
          type="button"
          onClick={onClose}
          data-autofocus
          className="group/close relative flex size-11 items-center justify-center border border-hairline transition-colors hover:border-gold/60"
        >
          <span className="sr-only">Close menu</span>
          <span aria-hidden className="absolute h-0.5 w-5 rotate-45 bg-white group-hover/close:bg-gold" />
          <span aria-hidden className="absolute h-0.5 w-5 -rotate-45 bg-white group-hover/close:bg-gold" />
        </button>
      </div>

      <nav aria-label="Main" className="flex-1 px-4 pb-10 pt-6 sm:px-6">
        <ul className="flex flex-col">
          {NAV.map((item) => {
            const active = isItemActive(pathname, item);
            const rowText = cn(
              "flex w-full items-center justify-between gap-4 py-4 text-left text-[1.75rem] font-bold leading-tight sm:text-[2.25rem]",
              active ? "text-gold" : "text-white",
            );

            if (item.kind === "link") {
              return (
                <li key={item.label} {...enter()} className="animate-menu-in border-b border-hairline">
                  <Link href={item.href} onClick={onClose} className={rowText} aria-current={isActive(pathname, item.href) ? "page" : undefined}>
                    {item.label}
                    {active && <span aria-hidden className="size-2 rotate-45 bg-gold shadow-glow" />}
                  </Link>
                </li>
              );
            }

            const isOpen = expanded === item.label;
            const panelId = `${baseId}-${item.label.replace(/\W+/g, "-")}`;
            const children =
              item.kind === "dropdown"
                ? item.children.map((c) => ({ label: c.label, href: c.href, external: false }))
                : [
                    ...item.services.map((s) => ({ label: s.label, href: s.href, external: false })),
                    ...item.locations.map((l) => ({ label: `${l.label} · ${l.place}`, href: l.href, external: true })),
                  ];

            return (
              <li key={item.label} {...enter()} className="animate-menu-in border-b border-hairline">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setExpanded(isOpen ? null : item.label)}
                  className={rowText}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={cn("relative size-4 shrink-0 transition-transform duration-300", isOpen && "rotate-45")}
                  >
                    <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-gold" />
                    <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-gold" />
                  </span>
                </button>
                <div
                  id={panelId}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-500 ease-out-expo",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <ul className="overflow-hidden" inert={!isOpen}>
                    {item.kind === "mega" && (
                      <li className="pb-1 pt-1 text-eyebrow font-bold uppercase text-on-dark-muted">Services</li>
                    )}
                    {children.map((c, k) => (
                      <li key={c.href}>
                        {item.kind === "mega" && k === item.services.length && (
                          <p className="pb-1 pt-4 text-eyebrow font-bold uppercase text-on-dark-muted">Service locations</p>
                        )}
                        {c.external ? (
                          <a
                            href={c.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between py-2.5 text-lg text-on-dark hover:text-gold"
                          >
                            {c.label}
                            <span aria-hidden className="text-gold">↗</span>
                            <span className="sr-only">(opens in a new tab)</span>
                          </a>
                        ) : (
                          <Link
                            href={c.href}
                            onClick={onClose}
                            aria-current={isActive(pathname, c.href) ? "page" : undefined}
                            className={cn("block py-2.5 text-lg hover:text-gold", isActive(pathname, c.href) ? "text-gold" : "text-on-dark")}
                          >
                            {c.label}
                          </Link>
                        )}
                      </li>
                    ))}
                    <li aria-hidden className="h-4" />
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>

        <div {...enter()} className="animate-menu-in mt-10 flex flex-col gap-6">
          <Button href={NAV_CTA.href} size="lg" onClick={onClose} className="w-full sm:w-auto sm:self-start">
            {NAV_CTA.label}
          </Button>
          <p className="text-lg font-bold">
            Your Power. <span className="text-glow">Our Mission.</span>
          </p>
          <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" className="self-start text-sm font-medium uppercase tracking-[0.14em] text-on-dark hover:text-gold">
            LinkedIn ↗<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </nav>
    </div>
  );
}

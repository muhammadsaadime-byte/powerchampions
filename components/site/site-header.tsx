"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { NAV, NAV_CTA, isActive, isItemActive, type NavItem } from "@/lib/nav";
import logo from "@/public/images/site/powerchampions-logo-trim.svg";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";


function Chevron({ open }: { open: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 12 12" className={cn("size-3 transition-transform duration-300 ease-out-expo", open && "rotate-180")}>
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

/** Gold underline: full width when the item is the current section, grows in on hover otherwise. */
function Underline({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 -bottom-[3px] h-0.5 origin-left bg-gradient-to-r from-gold to-orange shadow-[0_0_10px_rgb(234_166_7/0.7)] transition-transform duration-500 ease-out-expo",
        active ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100",
      )}
    />
  );
}

const linkText = "relative whitespace-nowrap py-1 text-xs font-medium uppercase tracking-[0.05em] 2xl:text-[0.8125rem] 2xl:tracking-[0.1em] text-fg/85 transition-colors duration-300 hover:text-fg";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const baseId = useId();

  // Glass background once the page has scrolled past the top (IntersectionObserver: no scroll listener).
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Close menus on navigation (React's "adjust state when a prop changes" pattern, done during render).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(null);
    setMobileOpen(false);
  }

  // Close dropdowns on outside click.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const hoverOpen = useCallback((label: string) => {
    window.clearTimeout(closeTimer.current);
    setOpen(label);
  }, []);
  const hoverClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(null), 140);
  }, []);

  const panelId = (label: string) => `${baseId}-${label.replace(/\W+/g, "-")}`;

  /** Escape closes and returns focus to the trigger; focus leaving the item closes it. */
  const itemHandlers = (item: NavItem) => ({
    onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && hoverOpen(item.label),
    onPointerLeave: (e: React.PointerEvent) => e.pointerType === "mouse" && hoverClose(),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Escape" && open === item.label) {
        setOpen(null);
        (e.currentTarget.querySelector("[aria-expanded]") as HTMLElement | null)?.focus();
      }
    },
    onBlur: (e: React.FocusEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen((o) => (o === item.label ? null : o));
    },
  });

  const solid = scrolled || open !== null;
  const mega = NAV.find((i): i is Extract<NavItem, { kind: "mega" }> => i.kind === "mega");

  return (
    <>
      <div ref={sentinel} aria-hidden className="pointer-events-none absolute left-0 top-0 h-6 w-px" />
      <header
        data-scheme="dark"
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-out-expo",
          solid
            ? "border-b border-hairline bg-ink/75 shadow-[0_10px_40px_-20px_rgb(0_0_0/0.8)] backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-gradient-to-b from-ink/70 to-transparent",
        )}
      >
        <a
          href="#main"
          className="absolute left-4 top-3 z-10 -translate-y-24 bg-gold px-4 py-2 text-sm font-bold text-ink focus-visible:translate-y-0"
        >
          Skip to content
        </a>

        <div className="mx-auto flex h-[var(--pc-header-h)] w-full max-w-[1520px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 2xl:gap-6">
          <Link href="/" aria-label="PowerChampions home" className="shrink-0">
            <Image src={logo} alt="PowerChampions" priority className="h-11 w-auto sm:h-12 2xl:h-14" />
          </Link>

          <nav ref={navRef} aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-4 min-[1400px]:gap-6 2xl:gap-9">
              {NAV.map((item) => {
                const active = isItemActive(pathname, item);
                const isOpen = open === item.label;

                if (item.kind === "link") {
                  return (
                    <li key={item.label} className="group/nav">
                      <Link href={item.href} className={linkText} aria-current={isActive(pathname, item.href) ? "page" : undefined}>
                        {item.label}
                        <Underline active={active} />
                      </Link>
                    </li>
                  );
                }

                const trigger = (
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId(item.label)}
                    aria-label={item.kind === "dropdown" && item.href ? `${item.label} submenu` : undefined}
                    onClick={() => setOpen(isOpen ? null : item.label)}
                    className={cn(linkText, "inline-flex items-center gap-1.5", isOpen && "text-fg")}
                  >
                    {!(item.kind === "dropdown" && item.href) && item.label}
                    <Chevron open={isOpen} />
                    {!(item.kind === "dropdown" && item.href) && <Underline active={active} />}
                  </button>
                );

                return (
                  <li key={item.label} className={cn("group/nav", item.kind === "dropdown" && "relative")} {...itemHandlers(item)}>
                    {item.kind === "dropdown" && item.href ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Link href={item.href} className={linkText} aria-current={pathname === item.href ? "page" : undefined}>
                          {item.label}
                          <Underline active={active} />
                        </Link>
                        {trigger}
                      </span>
                    ) : (
                      trigger
                    )}

                    {item.kind === "dropdown" && isOpen && (
                          <div id={panelId(item.label)} className="animate-panel-in absolute left-1/2 top-full w-72 -translate-x-1/2 pt-5">
                            <ul className="border border-hairline bg-surface/95 p-2 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)] backdrop-blur-xl">
                              {item.children.map((c) => (
                                <li key={c.href}>
                                  <Link
                                    href={c.href}
                                    onClick={() => setOpen(null)}
                                    className="group/item block border-l-2 border-transparent px-4 py-3 transition-colors hover:border-gold hover:bg-fg/[0.04]"
                                  >
                                    <span className="block text-sm font-bold text-fg group-hover/item:text-accent">{c.label}</span>
                                    {c.description && <span className="mt-1 block text-xs leading-relaxed text-on-dark-muted">{c.description}</span>}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                    {item.kind === "mega" && isOpen && mega && (
                          // Positioned against the fixed header, so it spans the full width under the bar.
                          <div id={panelId(item.label)} className="animate-panel-in absolute inset-x-0 top-full">
                            <div className="border-b border-t border-hairline bg-surface/95 shadow-[0_40px_100px_-30px_rgb(0_0_0/0.95)] backdrop-blur-xl">
                              <div className="mx-auto grid max-w-[1320px] gap-8 px-8 py-10 lg:grid-cols-[1fr_1fr_0.8fr]">
                                {mega.services.map((s) => (
                                  <Link
                                    key={s.href}
                                    href={s.href}
                                    onClick={() => setOpen(null)}
                                    className="group/mega relative isolate flex min-h-64 flex-col justify-end overflow-hidden border border-hairline p-6 transition-[border-color,box-shadow] duration-500 hover:border-gold/50 hover:shadow-glow-soft"
                                  >
                                    <Image
                                      src={s.image}
                                      alt=""
                                      fill
                                      sizes="(min-width: 1280px) 420px, 50vw"
                                      quality={60}
                                      className="-z-20 object-cover opacity-55 transition-[transform,opacity] duration-700 ease-out-expo group-hover/mega:scale-105 group-hover/mega:opacity-70"
                                    />
                                    <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/75 to-ink/10" />
                                    <span className="flex items-center gap-2 text-h3 font-bold text-fg">
                                      {s.label}
                                      <span aria-hidden className="text-accent transition-transform duration-300 group-hover/mega:translate-x-1">→</span>
                                    </span>
                                    <span className="mt-2 text-sm leading-relaxed text-on-dark">{s.description}</span>
                                    {isActive(pathname, s.href) && (
                                      <span className="absolute left-6 top-6 text-eyebrow font-bold uppercase text-accent">You are here</span>
                                    )}
                                  </Link>
                                ))}
                                <div className="flex flex-col">
                                  <p className="mb-4 text-eyebrow font-bold uppercase text-accent">Service locations</p>
                                  <ul className="flex flex-col divide-y divide-hairline border-y border-hairline">
                                    {mega.locations.map((l) => (
                                      <li key={l.href}>
                                        <a
                                          href={l.href}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="group/loc flex items-center justify-between gap-4 py-4 transition-colors hover:text-accent"
                                        >
                                          <span>
                                            <span className="block text-sm font-bold text-fg group-hover/loc:text-accent">{l.label}</span>
                                            <span className="text-xs text-on-dark-muted">{l.place}</span>
                                          </span>
                                          <span aria-hidden className="text-accent">↗</span>
                                          <span className="sr-only">(opens in a new tab)</span>
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                  <Link
                                    href="/locations"
                                    onClick={() => setOpen(null)}
                                    className="mt-5 text-sm font-bold uppercase tracking-[0.12em] text-fg hover:text-accent"
                                  >
                                    All locations →
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <ThemeToggle />
            {/* Visibility lives on the wrapper: Button's own inline-flex would override `hidden`. */}
            <div className="hidden sm:block">
              <Button href={NAV_CTA.href} size="sm" className="whitespace-nowrap">
                {NAV_CTA.label}
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={mobileOpen}
              className="group/burger flex size-11 flex-col items-center justify-center gap-1.5 border border-hairline transition-colors hover:border-gold/60 xl:hidden"
            >
              <span className="sr-only">Open menu</span>
              <span aria-hidden className="h-0.5 w-5 bg-white transition-all group-hover/burger:bg-gold" />
              <span aria-hidden className="h-0.5 w-5 bg-white transition-all group-hover/burger:w-3 group-hover/burger:bg-gold" />
              <span aria-hidden className="h-0.5 w-5 bg-white transition-all group-hover/burger:bg-gold" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} pathname={pathname} />
    </>
  );
}

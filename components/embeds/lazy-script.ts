/** Load a third-party script once (shared by embeds), resolving when it has executed. */
const pending = new Map<string, Promise<void>>();

export function loadScript(src: string): Promise<void> {
  const existing = pending.get(src);
  if (existing) return existing;
  const p = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(s);
  });
  pending.set(src, p);
  return p;
}

/** Run `cb` once the element is within ~600px of the viewport. Returns a cleanup function. */
export function whenNear(el: Element, cb: () => void) {
  const io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        io.disconnect();
        cb();
      }
    },
    { rootMargin: "600px 0px" },
  );
  io.observe(el);
  return () => io.disconnect();
}

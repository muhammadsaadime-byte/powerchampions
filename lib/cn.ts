/** Join class names, skipping falsy values. (No clsx/tailwind-merge dependency.) */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

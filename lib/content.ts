import fs from "node:fs";
import path from "node:path";

/**
 * Build-time access to the live site's copy saved in /content (Step 1 audit).
 * Pages compose their own layouts but pull the words from here, so copy stays verbatim.
 */

export type Block = { level: number; title: string; body: string };

/** Main-content copy of a page (everything after "## Page copy"), cleaned for rendering. */
export function pageCopy(slug: string): string {
  const raw = fs.readFileSync(path.join(process.cwd(), "content", `${slug}.md`), "utf8");
  const copy = raw.split(/^## Page copy\s*$/m)[1] ?? "";
  return normalize(copy);
}

/** Tidy the crawler's markdown: join "-" bullets with their text, drop images/embeds/buttons, fix live links. */
export function normalize(md: string): string {
  return md
    .replace(/^!\[[^\]]*\]\([^)]*\)\s*$/gm, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/^\[(IFRAME|EMBED): [^\]]*\]\s*$/gm, "")
    .replace(/\[BUTTON:[^\]]*\]/g, "")
    .replace(/^-\s*\n+(?=\S)/gm, "- ")
    // Link-only lines/bullets are buttons on the live site; our layouts render real buttons instead.
    .replace(/^(- )?\[[^\]]+\]\([^)]+\)\s*$/gm, "")
    .replace(/^-\s*$/gm, "")
    .replace(/https?:\/\/(www\.)?power-champions\.com(?=[/)#])/g, "")
    .replace(/​/g, "")
    .replace(/\.\.(\s|$)/g, ".$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Split markdown into heading-led blocks (text before the first heading has level 0). */
export function blocks(md: string): Block[] {
  const out: Block[] = [];
  let cur: Block = { level: 0, title: "", body: "" };
  for (const line of md.split("\n")) {
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      if (cur.title || cur.body.trim()) out.push({ ...cur, body: cur.body.trim() });
      cur = { level: h[1].length, title: h[2].replace(/\*\*/g, "").trim(), body: "" };
    } else cur.body += line + "\n";
  }
  if (cur.title || cur.body.trim()) out.push({ ...cur, body: cur.body.trim() });
  return out;
}

/**
 * Markdown under the first heading whose text includes `title` (case-insensitive),
 * up to the next heading of the same or a higher level. Includes deeper sub-headings.
 */
export function section(md: string, title: string): string {
  const lines = md.split("\n");
  const start = lines.findIndex((l) => /^#{1,6}\s/.test(l) && l.toLowerCase().includes(title.toLowerCase()));
  if (start < 0) throw new Error(`content: heading "${title}" not found`);
  const level = lines[start].match(/^#+/)![0].length;
  const end = lines.findIndex((l, i) => i > start && /^#{1,6}\s/.test(l) && l.match(/^#+/)![0].length <= level);
  return lines.slice(start + 1, end < 0 ? undefined : end).join("\n").trim();
}

/** Bullet items ("- text") in a chunk of markdown. */
export function bullets(md: string): string[] {
  // A bullet can wrap onto following lines (the live copy has some); join those until a blank line or the next bullet.
  const out: string[] = [];
  let open = false;
  for (const line of md.split("\n")) {
    if (line.startsWith("- ")) {
      out.push(line.slice(2).trim());
      open = true;
    } else if (!line.trim() || line.startsWith("#")) {
      open = false;
    } else if (open) {
      out[out.length - 1] += " " + line.trim();
    }
  }
  return out;
}

/** Paragraphs (non-heading, non-list text) in a chunk of markdown. */
export function paragraphs(md: string): string[] {
  return md
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith("#") && !p.startsWith("- ") && !/^\[[^\]]+\]\([^)]+\)$/.test(p));
}

/** "**Label**: text" bullet → { label, text } */
export function labelled(item: string) {
  const m = item.match(/^\*\*(.+?)\*\*:?\s*(.*)$/);
  return m ? { label: m[1], text: m[2] } : { label: "", text: item };
}

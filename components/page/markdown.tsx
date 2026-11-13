import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Minimal markdown → React renderer for the crawled copy (no markdown package).
 * Supports: #–###### headings, paragraphs, "- " lists, **bold**, *italic*, [links](url).
 * `headingOffset` shifts heading levels so the page keeps a correct outline.
 */
export function Markdown({ md, className, headingOffset = 0 }: { md: string; className?: string; headingOffset?: number }) {
  const out: React.ReactNode[] = [];
  const chunks = md.split(/\n{2,}/);
  chunks.forEach((chunk, i) => {
    const lines = chunk.split("\n").filter(Boolean);
    if (!lines.length) return;
    const h = lines[0].match(/^(#{1,6})\s+(.*)$/);
    if (h && lines.length === 1) {
      const level = Math.min(6, Math.max(2, h[1].length + headingOffset)) as 2 | 3 | 4 | 5 | 6;
      const Tag = `h${level}` as const;
      out.push(<Tag key={i}>{inline(h[2].replace(/\*\*/g, ""))}</Tag>);
      return;
    }
    if (lines.every((l) => l.startsWith("- "))) {
      out.push(
        <ul key={i}>
          {lines.map((l, j) => (
            <li key={j}>{inline(l.slice(2))}</li>
          ))}
        </ul>,
      );
      return;
    }
    out.push(<p key={i}>{inline(lines.join(" "))}</p>);
  });
  return <div className={cn("prose-pc", className)}>{out}</div>;
}

/** Inline markdown: links, bold, italic. */
export function inline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*\s*([^*]+?)\s*\*\*|\*\s*([^*]+?)\s*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1]) {
      const href = m[2];
      nodes.push(
        href.startsWith("/") || href.startsWith("#") ? (
          <Link key={k++} href={href}>
            {m[1]}
          </Link>
        ) : (
          <a key={k++} href={href} target="_blank" rel="noopener noreferrer">
            {m[1]}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ),
      );
    } else if (m[3]) nodes.push(<strong key={k++}>{m[3]}</strong>);
    else if (m[4]) nodes.push(<em key={k++}>{m[4]}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

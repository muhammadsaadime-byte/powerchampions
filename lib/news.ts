import type { StaticImageData } from "next/image";
import egsaImg from "@/public/images/site/ashish-session-photo.jpg";
import astaImg from "@/public/images/site/powerchampion-asta2.jpg";
import greenvilleImg from "@/public/images/site/greenville-sourth-carolina.jpg";
import tripleTImg from "@/public/images/site/triple-t-critical-power-services-family3.jpg";
import nfmtImg from "@/public/images/site/nfmt-east.webp";

/**
 * News posts, hosted on this site at /news/<slug>.
 * Copy is verbatim from the live power-champions.com posts (captured in _audit/posts). `**bold**` marks inline emphasis.
 * `facts` only restate details that appear in the post's own copy.
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string };

export type NewsPost = {
  slug: string;
  title: string;
  description: string;
  /** ISO date (yyyy-mm-dd). */
  date: string;
  tag: string;
  image: StaticImageData;
  imageAlt: string;
  /** "contain" keeps graphics with baked-in text whole; photos are cropped to the frame. */
  fit?: "cover" | "contain";
  /** object-position class for cropped photos. */
  focus?: string;
  facts: Array<[label: string, value: string]>;
  body: Block[];
  /** The full release / original announcement. */
  source?: { label: string; href: string };
  /** A closing action on this site. */
  action?: { label: string; href: string };
};

export const NEWS: NewsPost[] = [
  {
    slug: "ashish-achlerkar-to-speak-at-egsa-fall-conference-powerchampions",
    title: "Ashish Achlerkar to Speak at EGSA Fall Conference",
    description:
      "PowerChampions Founder and CEO Ashish Achlerkar will speak at the 2026 EGSA Fall Conference on people-first business building in critical power.",
    date: "2026-09-10",
    tag: "Business Building",
    image: egsaImg,
    imageAlt: "Ashish Achlerkar to speak at the EGSA Fall Conference: People First, Power Always",
    fit: "contain",
    facts: [
      ["Event", "2026 EGSA Fall Conference"],
      ["Where", "Washington, DC"],
      ["When", "Monday, September 14th"],
      ["Also", "Sponsor of the EGSA Awards Lunch"],
    ],
    body: [
      {
        type: "p",
        text: "Entrepreneur and skilled-trades platform builder will share lessons from helping companies grow while strengthening leadership, culture and opportunity; PowerChampions will also sponsor the EGSA Awards Lunch.",
      },
      {
        type: "p",
        text: "CHARLOTTE, N.C. — September 10, 2026 — Ashish Achlerkar, Founder and CEO of PowerChampions, will take the stage at the 2026 EGSA Fall Conference in Washington, DC, on Monday, September 14th, to share a message he has spent years putting into practice: strong companies are built by investing in people first.",
      },
    ],
    source: {
      label: "Read the full release on PR Newswire",
      href: "https://www.prnewswire.com/news-releases/powerchampions-founder-ashish-achlerkar-to-speak-at-egsa-fall-conference-on-people-first-business-building-in-critical-power-302874461.html",
    },
  },
  {
    slug: "powerchampions-asta-strategic-partnership-skilled-trades-workforce",
    title: "PowerChampions and American Skilled Trades Academy (ASTA) Announce Strategic Partnership to Elevate the Skilled Trades Workforce",
    description:
      "PowerChampions and American Skilled Trades Academy announce a strategic partnership to advance skilled trades training, workforce development, and critical power careers.",
    date: "2026-06-11",
    tag: "Press Release",
    image: astaImg,
    imageAlt: "PowerChampions and American Skilled Trades Academy partnership",
    fit: "contain",
    facts: [
      ["Partner", "American Skilled Trades Academy (ASTA)"],
      ["Focus", "Practical training, workforce development and long-term career pathways"],
      ["Goal", "Developing “Thinking Technicians”"],
    ],
    body: [
      {
        type: "p",
        text: "PowerChampions has announced a new strategic partnership with the American Skilled Trades Academy (ASTA), bringing together two organizations committed to strengthening the future of the skilled trades workforce. The partnership is focused on expanding access to practical training, workforce development, and long-term career pathways for professionals in critical power and related technical industries.",
      },
      {
        type: "p",
        text: "As demand continues to grow for backup power systems, electrical infrastructure, and mission-critical service providers, PowerChampions and ASTA are working together to help prepare the next generation of skilled trades professionals. Through hands-on education, technical workshops, continuing education, and leadership development, the partnership will support both new technicians entering the field and experienced professionals looking to advance their careers.",
      },
      {
        type: "p",
        text: "A key focus of the collaboration is developing what ASTA calls “Thinking Technicians” — skilled professionals who can troubleshoot complex systems, adapt to changing technology, and make confident decisions in the field. Together, PowerChampions and ASTA aim to elevate the trades, create meaningful career opportunities, and invest in the people who keep critical infrastructure powered and protected.",
      },
    ],
    source: {
      label: "Read the full release on PR Newswire",
      href: "https://www.prnewswire.com/news-releases/powerchampions-and-american-skilled-trades-academy-asta-announce-strategic-partnership-to-elevate-the-skilled-trades-workforce-302797366.html?tc=eml_cleartime",
    },
  },
  {
    slug: "powerchampions-expands-to-greenville-a-new-standard-for-backup-power-in-the-upstate",
    title: "PowerChampions Expands to Greenville: A New Standard for Backup Power in the Upstate",
    description: "PowerChampions has launched a new Greenville operation focused entirely on generator and emergency backup power services.",
    date: "2026-04-15",
    tag: "Press Release",
    image: greenvilleImg,
    imageAlt: "Aerial view of downtown Greenville, South Carolina",
    facts: [
      ["Location", "Greenville, South Carolina"],
      ["Focus", "Generator and emergency backup power services"],
      ["Services", "Installation, maintenance and rapid response"],
    ],
    body: [
      {
        type: "p",
        text: "Greenville’s growth is putting more pressure than ever on reliable power—and backup solutions are becoming essential, not optional.",
      },
      {
        type: "p",
        text: "PowerChampions has launched a new Greenville operation focused entirely on generator and emergency backup power services. With a local team and a strong focus on reliability, this expansion is designed to support businesses and facilities that can’t afford downtime.",
      },
      {
        type: "p",
        text: "From installation to maintenance and rapid response, the goal is simple: keep critical systems running when it matters most.",
      },
    ],
    source: {
      label: "Read the full release on PR Newswire",
      href: "https://www.prnewswire.com/news-releases/powerchampions-of-greenville-launches-dedicated-generator--backup-power-services-for-the-upstate-302740775.html",
    },
    action: { label: "Find a location", href: "/locations" },
  },
  {
    slug: "powerchampions-partners-with-triple-t-to-expand-critical-power-services",
    title: "Triple T Partners with PowerChampions to Boost Critical Power Services",
    description:
      "PowerChampions partners with Triple T to enhance critical power services, ensuring clients maintain operations with advanced support and reliability.",
    date: "2026-04-03",
    tag: "Press Release",
    image: tripleTImg,
    imageAlt: "The Triple T Critical Power Services team",
    focus: "object-top",
    facts: [
      ["New name", "Triple T Critical Power Services"],
      ["Formerly", "Triple T Electric"],
      ["Partner", "PowerChampions"],
    ],
    body: [
      {
        type: "p",
        text: "Triple T Electric has always been a name synonymous with reliability, quality workmanship, and trusted service in the commercial and industrial electrical space. Today, we’re proud to announce the next step in our journey—one that reflects both our growth and our commitment to meeting the evolving needs of our customers.",
      },
      { type: "callout", text: "We are now operating as **Triple T Critical Power Services**." },
      { type: "h", text: "Why the Change?" },
      {
        type: "p",
        text: "As industries grow more dependent on uninterrupted power, the need for robust backup systems and critical infrastructure support has never been greater. From data centers and healthcare facilities to manufacturing plants, downtime is no longer just inconvenient—it’s costly and, in many cases, unacceptable.",
      },
      {
        type: "p",
        text: "Recognizing this shift, we’ve expanded our focus to specialize in **critical power solutions**—ensuring our clients can maintain operations no matter the circumstances.",
      },
      { type: "h", text: "Strengthened Through Partnership" },
      {
        type: "p",
        text: "This transformation is powered by our partnership with PowerChampions, a leader in critical power services. Through this collaboration, we’ve enhanced our capabilities, expanded our technical expertise, and gained access to additional resources that allow us to deliver even more value to our customers.",
      },
      { type: "h", text: "What This Means for Our Clients" },
      {
        type: "p",
        text: "Our clients can expect the same dependable service they’ve always trusted—now with even greater capabilities, including:",
      },
      {
        type: "ul",
        items: [
          "Advanced backup power system support",
          "Preventative maintenance for critical infrastructure",
          "Emergency response services",
          "Enhanced technical expertise and resources",
        ],
      },
      { type: "h", text: "Moving Forward" },
      {
        type: "p",
        text: "While our name is evolving, our core values remain the same: integrity, reliability, and a commitment to excellence. Triple T Critical Power Services is built on the same foundation that earned your trust—now with a sharper focus on keeping your operations running without interruption.",
      },
      {
        type: "p",
        text: "We’re excited about what the future holds and look forward to continuing to serve you with even greater strength and capability.",
      },
    ],
    source: {
      label: "Learn more about this partnership on PRWeb",
      href: "https://www.prweb.com/releases/a-new-chapter-for-a-trusted-name-triple-t-electric-partners-with-powerchampions-to-become-triple-t-critical-power-services-302725849.html",
    },
  },
  {
    slug: "powerchampions-at-nfmt-east-booth-704-charlotte",
    title: "Join PowerChampions at NFMT East – Booth 704 in Charlotte",
    description: "Meet PowerChampions at NFMT East Booth 704. Learn how our Southeast generator and ATS experts help facilities improve uptime and compliance.",
    date: "2026-03-02",
    tag: "Event",
    image: nfmtImg,
    imageAlt: "PowerChampions is exhibiting at NFMT East, Booth 704",
    fit: "contain",
    facts: [
      ["Event", "NFMT East"],
      ["Where", "Charlotte · Booth 704"],
      ["When", "March 10th – March 12th, 2026"],
    ],
    body: [
      {
        type: "p",
        text: "PowerChampions is proud to announce that we will be exhibiting at NFMT East in Charlotte from March 10th to 12th, and we invite our customers, partners, and facility leaders across the Southeast to visit us at Booth 704. NFMT East gathers facility managers, engineers, and operations professionals responsible for maintaining safe, compliant, and fully operational critical buildings. In today’s environment of rising grid instability, increasing electrical demand, and tightening compliance standards, backup power is no longer a secondary concern; it has become a strategic priority. That’s where PowerChampions comes in.",
      },
      { type: "h", text: "Why Visit PowerChampions at NFMT East?" },
      {
        type: "p",
        text: "When you stop by Booth 704, you won’t find a generic sales pitch. You’ll meet a team with decades of hands-on experience supporting:",
      },
      {
        type: "ul",
        items: [
          "Healthcare facilities",
          "Manufacturing operations",
          "Commercial campuses",
          "Municipal infrastructure",
          "Data centers and mission-critical environments",
        ],
      },
      {
        type: "p",
        text: "Our leadership and field teams understand that generator and ATS systems are not just pieces of equipment; they are the foundation of operational continuity. When power fails, performance matters.",
      },
      { type: "h", text: "What Sets PowerChampions Apart in the Southeast" },
      {
        type: "p",
        text: "PowerChampions is building a people-first platform dedicated to delivering reliable, compliant, and proactive critical power service across the Southeast United States.",
      },
      { type: "p", text: "Our depth of experience includes:" },
      {
        type: "ul",
        items: [
          "Multi-megawatt generator systems",
          "Advanced ATS diagnostics and testing",
          "NFPA 110 compliance readiness",
          "Preventive and predictive maintenance strategies",
          "Emergency response capabilities backed by disciplined processes",
        ],
      },
      {
        type: "p",
        text: "We are not just servicing equipment; we are helping organizations reduce risk, strengthen resilience, and operate with confidence in an increasingly complex energy landscape.",
      },
      { type: "h", text: "Let’s Talk About Your Power Strategy" },
      {
        type: "p",
        text: "If you are attending NFMT East, we encourage you to bring your toughest reliability challenges to Booth 704. Whether you’re evaluating redundancy architecture, tightening compliance documentation, upgrading aging infrastructure, or planning future capacity, our team is ready for the conversation.",
      },
      {
        type: "p",
        text: "The power generation industry is evolving. Grid stress is increasing. Expectations are rising. Your service partner should be evolving, too.",
      },
      {
        type: "p",
        text: "We look forward to connecting with you in Charlotte and discussing how PowerChampions can support your organization with the expertise, responsiveness, and leadership you deserve.",
      },
      { type: "callout", text: "**Visit us at Booth 704 at NFMT East.** March 10th - March 12th, 2026. Your power. Our mission." },
      { type: "h", text: "Schedule a Meeting at NFMT East" },
      {
        type: "p",
        text: "Want to reserve time with the PowerChampions team while we’re in Charlotte? We are offering pre-scheduled 20-minute strategy sessions at Booth 704 for:",
      },
      {
        type: "ul",
        items: [
          "Facility Managers",
          "Healthcare Operations Leaders",
          "Manufacturing & Industrial Operators",
          "Data Center Developers",
          "Engineering & Construction Partners",
        ],
      },
      { type: "p", text: "Let’s discuss:" },
      {
        type: "ul",
        items: [
          "Generator and ATS reliability gaps",
          "NFPA 110 readiness",
          "Redundancy architecture",
          "Proactive service strategies",
          "Long-term resilience planning",
        ],
      },
      { type: "p", text: "Email info@power-champions.com with subject line: “NFMT Meeting”" },
      { type: "p", text: "Spots are limited during the show - we recommend scheduling in advance." },
      { type: "p", text: "We look forward to connecting in Charlotte." },
      { type: "p", text: "**Your power. Our mission.**" },
    ],
    action: { label: "Contact us", href: "/contact-us" },
  },
];

export const getPost = (slug: string) => NEWS.find((p) => p.slug === slug);

export const formatDate = (d: string) =>
  new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

/** Whole minutes at ~220 words per minute, minimum 1. */
export const readMinutes = (p: NewsPost) => {
  const words = p.body.reduce((n, b) => n + ("items" in b ? b.items.join(" ") : b.text).split(/\s+/).length, 0);
  return Math.max(1, Math.round(words / 220));
};

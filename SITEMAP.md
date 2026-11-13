# PowerChampions — Site Audit & Sitemap

Audit of the live site, crawled **2026-11-13**. The live site runs on **HubSpot CMS** (portal `243957939`, region `na2`).

- Page copy for every page: [`/content`](content/), one Markdown file per page. Each file has front matter (source URL, title, meta description), then its heading outline, embeds, forms, images and the main-content copy, word for word.
- Images: 108 original files (128 MB) in [`/public/images/site`](public/images/site/). [`_manifest.json`](public/images/site/_manifest.json) maps every local file back to its HubSpot URL, alt text and the pages that use it.
- Raw crawl data (HTML of all 143 fetched URLs plus `pages.json`) is in `_audit/`. It's git-ignored and can be regenerated.

---

## 1. Scope: three sites, not one

`power-champions.com` is really **three separate HubSpot websites**:

| Site | What it is | Pages | In scope? |
|---|---|---|---|
| **www.power-champions.com** | Corporate / "umbrella" brand: partnerships, team, careers, resources | 39 live pages (10 core + 3 listings + 26 posts), plus 4 legacy redirects in its sitemap | ✅ **Yes**: the 13 main pages only (10 core + 3 listings). Posts are not rebuilt |
| **www.greenville.power-champions.com** | PowerChampions of Greenville: the actual generator-services business (sales, repair, rentals, load bank, industries, 40+ articles) | 62 crawled | ❌ **Out of scope** (decided 2026-11-13). Stays on HubSpot |
| **www.atlanta.power-champions.com** | PowerChampions of Georgia: same template as Greenville | ~30 in its sitemap | ❌ **Out of scope**. Stays on HubSpot |

**Main site only.** The "Generator Services" menu in the rebuild is the same as live: *Backup Power Centers* and *Data Center Solutions*. Greenville and Atlanta are linked as external location sites (from Locations, the homepage map and the footer) and aren't rebuilt. Their DNS and HubSpot hosting must stay untouched when the main domain cuts over. The Greenville copy and images I crawled are archived in the git-ignored `_audit/greenville/`, in case they're ever needed.

---

## 2. Main-site navigation (as live)

**Header**
- Who We Are → `/who-we-are`
  - Our Team → `/who-we-are#PowerChampions-Team`
- Market-Partners → `/partners`
- Resources *(dropdown, no page of its own)*
  - News → `/news`
  - Blogs → `/blogs`
  - Podcast → `/podcast`
- Careers → `/careers`
- Generator Services *(dropdown, no page of its own)*
  - Backup Power Centers → `/backup-power-centers`
  - Data Center Solutions → `/data-center-solutions`
- Locations → `/locations`
- Contact → `/contact-us`
- Site search (HubSpot `/hs-search-results`)

**Footer**: *Quick Links*: Home, Who We Are, Market-Partners, Our Team, Careers, Contact, Locations · *Connect With Us*: LinkedIn (`linkedin.com/company/power-champions`) · Badges: EGSA logo (→ egsa.org), American flag · `© 2026, PowerChampions.` · Newsletter signup form (HubSpot).
The main site's footer has **no phone, email or street address**. The only published contact details are on the location sites (Greenville: (864) 691-8168, 175 Brookshire Rd, Greer, SC 29651).

---

## 3. URL map: live URL → new Next.js route

Every live URL keeps the same path. ✅ = page gets built · ↪ = 301 redirect.

### Core pages

| Live URL | New route | Content file | Notes |
|---|---|---|---|
| `/` | `/` | [home.md](content/home.md) | Hero (FOX Carolina badge), values, network + HubSpot video, 3 testimonials, CTA |
| `/who-we-are` | `/who-we-are` | [who-we-are.md](content/who-we-are.md) | Vision, mission, team grid (anchor `#PowerChampions-Team` must stay) |
| `/partners` | `/partners` | [partners.md](content/partners.md) | "Sell Your Business TO a Strategic Partner": YouTube video + HubSpot form |
| `/careers` | `/careers` | [careers.md](content/careers.md) | Rippling job board + YouTube video + hiring-process steps |
| `/contact-us` | `/contact-us` | [contact-us.md](content/contact-us.md) | Almost entirely the HubSpot form: "Let's Talk Partnership, Growth, and Opportunity" |
| `/locations` | `/locations` | [locations.md](content/locations.md) | Greenville, Columbia (Triple T, Sumter SC), Atlanta (Dacula GA) |
| `/backup-power-centers` | `/backup-power-centers` | [backup-power-centers.md](content/backup-power-centers.md) | Generator Services › 1 |
| `/data-center-solutions` | `/data-center-solutions` | [data-center-solutions.md](content/data-center-solutions.md) | Generator Services › 2 |
| `/privacy-policy` | `/privacy-policy` | [privacy-policy.md](content/privacy-policy.md) | Legal, copied verbatim |
| `/terms-conditions` | `/terms-conditions` | [terms-conditions.md](content/terms-conditions.md) | Legal, copied verbatim |

### Resources: listing pages only, no posts (decided 2026-11-13)

**Scope: main pages only.** The 26 individual blog, news and podcast posts are **not rebuilt**. Their copy is archived in the git-ignored `_audit/posts/`. The three listing pages stay because they're in the main nav.

| Live URL | New route | Notes |
|---|---|---|
| `/blogs` | `/blogs` | Main page. Content of the listing TBD (see note below) |
| `/news` | `/news` | Main page |
| `/podcast` | `/podcast` | Main page ("Powered to Win") |

⚠️ **Open question:** what happens to the 26 post URLs below at cut-over. Options: (a) 301 each to its listing page, which keeps visitors but loses the article; (b) keep the posts on HubSpot under a subdomain (e.g. `resources.power-champions.com`) and 301 there, so the articles and their SEO survive; (c) let them 404 (not recommended). This also decides whether the listing pages link to posts at all.

<details><summary>The 26 post URLs not being rebuilt</summary>

**Blogs** — `/blogs/…`
- `building-a-business-that-outlasts-you`: Legacy in Motion: What It Means to Build a Business That Outlasts You
- `from-owner-to-leader-the-shift-that-changes-it-all`: From Owner to Leader: The Shift that changes it all.
- `generator-service-ma-employees-customers-legacy`: Better Measure of M&A: Employees, Customers and Legacy
- `people-first-leadership-in-critical-power-powerchampions`: People-First Leadership in Critical Power
- `powerchampions-at-nfmt-east-booth-704-charlotte`: Join PowerChampions at NFMT East – Booth 704 in Charlotte
- `servant-leadership-in-the-trades`: Servant-Leadership in the Trades: Building Teams That Power America
- `the-future-of-critical-power-partnerships-over-acquisition`: The Future of Critical Power: Partnerships Over Acquisition
- `why-load-bank-testing-is-essential-for-generator-reliability-in-2026`: Why Load Bank Testing Is Essential for Generator Reliability in 2026
- `why-servant-leadership-is-the-backbone-of-critical-power`: The Power of Partnership: Why Independent Companies Thrive Together *(slug and title don't match on the live site; I'll keep the slug)*
- `why-technician-retention-is-the-real-growth-strategy`: Why Technician Retention Is the Real Growth Strategy

**News** — `/news/…`
- `ashish-achlerkar-to-speak-at-egsa-fall-conference-powerchampions`
- `powerchampions-asta-strategic-partnership-skilled-trades-workforce`
- `powerchampions-expands-to-greenville-a-new-standard-for-backup-power-in-the-upstate`
- `powerchampions-partners-with-triple-t-to-expand-critical-power-services`

**Podcast** — `/podcast/…`
- `episode-1-defining-a-powerchampion`
- `episode-2-building-a-stronger-service-culture-in-critical-power`
- `episode-3-building-a-brand-that-earns-trust`
- `episode-4-a-conversation-with-charlie-habic-of-gillette-generators`
- `episode-5-building-the-future-of-the-trades-through-the-powerchampions-and-asta-partnership`
- `powered-to-win-episode-6-generator-controls-innovation-and-the-future-of-reliability`
- `episode-7-how-the-powerchampions-and-asta-partnership-thinks-about-workforce-development`
- `from-competition-to-collaboration-what-long-term-relationships-teach-us-about-winning-in-critical-power` (Episode 8)
- `episode-9-trust-people-and-the-future-of-power`
- `episode-10-growth-purpose-and-the-discipline-to-do-what-you-do-well`
- `episode-11-emmissions-systems` *(typo "emmissions" is in the live URL; I'll keep it)*
- `how-to-keep-generator-fuel-ready-for-an-emergency-scott-anderson-on-fuel-reliability`
</details>

### Redirects (`next.config` → `redirects()`, all permanent 301)

| From | To | Why |
|---|---|---|
| `/about-us` | `/who-we-are` | Already a 301 on the live site; keep it |
| `/mission` | `/who-we-are` | Already a 301 on the live site; keep it |
| `/our-locations` | `/locations` | Already a 301 on the live site; keep it |
| `/ad0d269a-9e90-4572-a91e-5d673aacd3c1` | `/podcast/episode-1-defining-a-powerchampion` | Already a 301 on the live site; keep it |
| `/blogs/tag/:tag`, `/news/tag/:tag`, `/podcast/tag/:tag` | the matching listing (`/blogs`, `/news`, `/podcast`) | HubSpot tag archives (7 live). Unless you want tag filters, redirect them |
| `/blogs/author/:a`, `/news/author/:a`, `/podcast/author/:a(/page/:n)` | the matching listing | HubSpot author archives (single author: "powerchampion") |
| `/podcast/page/:n` | `/podcast` | HubSpot pagination; the new listing shows every episode |
| `/hs-search-results` | `/` (or a new `/search`) | HubSpot site search. Decide whether search is kept |
| `/_hcms/*`, `/hs/*` | none | HubSpot internals. They disappear on cut-over |
| `/hubfs/:path*` | none (TBD) | Old image URLs. Only matters if other sites hot-link them; skip unless you want them |

---

## 4. Integrations

| Integration | Where | Detail | Plan for the rebuild |
|---|---|---|---|
| **Google Tag Manager** | every main-site page | `GTM-5RZ7R6SS` (+ noscript iframe) | Load via `next/script` `afterInteractive` (or `@next/third-parties` **if you approve the package**) |
| **Google Analytics 4** | main site | `G-XS638QXW35` (probably fired through GTM; check in the GTM container) | Leave to GTM, don't hard-code |
| **HubSpot tracking code** | every page | `js-na2.hs-scripts.com/243957939.js`: analytics, form attribution, cookie banner | Keep it; HubSpot form submissions and contact attribution depend on it |
| **HubSpot forms** | see below | portal `243957939`, region `na2` | Keep posting to HubSpot (see the forms list below) |
| **Rippling job board** | `/careers` | **Not an iframe**: a script embed: `<div id="rr-job-board" data-job-board-id="power-champions">` + `https://static-assets.ripplingcdn.com/ats/embeds/job-board.v1.js` | Reproduce exactly in a client component, lazy-loaded |
| **HubSpot Video** | `/` (network section) | `https://play-na2.hubspotvideo.com/v/243957939/id/366671083247` (looping) | Embed as a lazy iframe, or ask the client for the MP4 to self-host as a hero video |
| **YouTube** | `/partners`, `/careers`, every podcast episode | e.g. partners `zAQ3cPCk3Us`, careers `d-HwXRRe-Hs`; one ID per episode (stored in each content file) | Lite-YouTube facade (thumbnail first, iframe on click) to protect Lighthouse scores |
| **Google Maps** | `/locations` | Single iframe embed. ⚠️ **Bug on the live site:** it points at *"3030 N Rocky Point Dr (Bluleadz)"*, the web agency's office, not a PowerChampions depot | Replace with the stylised SVG map from the brief; per-location "Get directions" links |
| **HubSpot site search** | header | form → `/hs-search-results` | Decide: drop, or build a simple static search |
| **LinkedIn** | blog/news/podcast posts | `platform.linkedin.com` share widget; company page link in footer | Plain share links, no third-party script |
| **Blog comments** | every post | HubSpot comment forms (blogs `67bdc049…`, news `cf96bf23…`, podcast `4050bc29…`) | Recommend dropping (no visible comments). Your call |
| *Greenville only*: GTM `GTM-TX2DD3XD`, GA4 `G-LZZHHNG34K`, **CallRail** number swap (`cdn.callrail.com/companies/542948317/…`), **Adobe DTM**, form `ea679ca4…` | greenville subdomain | | Out of scope: stays on the Greenville HubSpot site |

### HubSpot forms (portal `243957939`)

| Form ID | Page | Purpose |
|---|---|---|
| `dbc9ae92-0f3e-4211-89af-dea4b894e583` | `/contact-us` | Main contact form: "Let's Talk Partnership, Growth, and Opportunity" |
| `b59b103f-e0e0-4462-a7b4-295c0b0c3506` | `/partners` | Partner / sell-your-business enquiry |
| `ff965d5d-d1d8-4210-9390-201a126e2300` | site-wide | Newsletter signup ("Subscribe To Newsletter") |
| `ea679ca4-c200-4d1f-935e-7dc650560a13` | Greenville contact + request-service | Service request (Greenville only) |

The contact form posts to HubSpot. In the new site I'll either (a) embed the same HubSpot forms with their script, which is zero risk and keeps HubSpot workflows and notifications intact, or (b) build native styled forms that POST to the HubSpot Forms API (`api.hsforms.com/submissions/v3/integration/submit/243957939/<formId>`). Option (b) looks far better but needs the exact field names from each form.

---

## 5. Content gaps vs. the brief (no lorem ipsum, so these need real input)

| Brief asks for | What actually exists on the live site |
|---|---|
| Trust bar **stats with count-up** | **No headline stats anywhere.** The only real figures: "200+ years of combined expertise" (leadership team), 3 locations, 24/7 service. I need real numbers (technicians, generators serviced, years, states…) or the stats get cut |
| Trust bar **logo marquee** | Logos available: EGSA, Triple T, ASTA, FOX Carolina, BBB (Greenville). No client logos. Need a list of partner/client logos you're allowed to show |
| Hero CTAs "Partner With Us / Find a Location" | Live site has "Partner with Us" and "Become a Market-Partner", both → `/contact-us`. "Find a Location" → `/locations` is new but fine |
| Hero **video** | No hero video. One looping HubSpot video in the network section (could be repurposed if you get the MP4) |
| **Generator Services** grid on homepage | Not on the live homepage. The section will show the two real main-site offerings (Backup Power Centers, Data Center Solutions), using the service headings from their pages, with links out to the location sites |
| Tagline "Your Power. Our Mission." | Not on the live site, so it's new copy from you. OK to use as given |
| OG images | No `og:image` set on most pages; I'll generate branded ones |
| Meta descriptions | Missing on `/blogs`, `/news`, `/podcast`, `/terms-conditions`; I'll write them from page copy |

---

## 6. Other notes

- **Brand:** the official logo is [`powerchampions-logo.svg`](public/images/site/powerchampions-logo.svg), white + gold `#E9A606` (one step off brand `#EAA607`), made for dark backgrounds. There's also a PNG and an alt lockup (`powerchampions-logo-alt.png`), plus a Greenville gold logo SVG.
- **Images are large originals:** 128 MB total, a few 10–14 MB each (ASTA workshop photos). `next/image` will serve optimised AVIF/WebP, but committing 216 MB to git is heavy. Options: downscale the source files to max 2560px before committing, or keep them out of git. Your call.
- **File naming:** files are named from alt text or the original filename. Where HubSpot names were meaningless ("Image (3).jpeg", "DSC04488.jpg") they're prefixed with the page they appear on (`backup-power-centers--dsc04488.jpg`). I'll give the hero/feature images descriptive names when they're picked in Step 3. There's also a Greenville gold logo SVG (`pc-of-greenvile-gold-ai.svg`) left in, for the Locations page.
- **Missing project files:** `CLAUDE.md` and `.claude/skills/futuristic-nextjs-site/SKILL.md` **do not exist** in this repo or anywhere on this machine. I need them (or confirmation of the stack: Next.js App Router + Tailwind + Motion + Lenis?) before Step 2.

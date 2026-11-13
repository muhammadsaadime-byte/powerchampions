import { SOCIAL } from "@/lib/nav";
import { LOCATIONS, SITE_NAME, SITE_URL } from "@/lib/site";

const data = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/site/powerchampions-logo-trim.svg`,
  slogan: "Your Power. Our Mission.",
  sameAs: [SOCIAL.linkedin],
  subOrganization: LOCATIONS.map((l) => ({ "@type": "LocalBusiness", name: l.name, url: l.url })),
};

export function OrgJsonLd() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

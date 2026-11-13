/** Site-wide constants (URLs, integrations, organisation data for JSON-LD). */
export const SITE_URL = "https://www.power-champions.com";
export const SITE_NAME = "PowerChampions";
export const TAGLINE = "Your Power. Our Mission.";

/** HubSpot (SITEMAP.md §4). Forms keep posting to the same HubSpot forms as the live site. */
export const HUBSPOT = {
  portalId: "243957939",
  region: "na2",
  forms: {
    contact: "dbc9ae92-0f3e-4211-89af-dea4b894e583",
    partners: "b59b103f-e0e0-4462-a7b4-295c0b0c3506",
    newsletter: "ff965d5d-d1d8-4210-9390-201a126e2300",
  },
} as const;

export const GTM_ID = "GTM-5RZ7R6SS";
export const RIPPLING_BOARD_ID = "power-champions";
export const TALENT_COMMUNITY_URL = "https://418v5f.share-na2.hsforms.com/24PumZfU3TeyiHoXR0Nu5ig";

/**
 * Posts are not rebuilt (scope decision). Listing cards link to where each post lives.
 * TODO(launch): once the 26 post URLs have a home after cut-over (HubSpot subdomain or redirects,
 * see SITEMAP.md), change this base. Until then cards point at the current live HubSpot posts.
 */
export const POSTS_BASE = "https://www.power-champions.com";

export const LOCATIONS = [
  {
    id: "gvl",
    name: "PowerChampions of Greenville",
    city: "Greenville, South Carolina",
    street: "175 Brookshire Rd",
    locality: "Greer",
    region: "SC",
    postal: "29651",
    phone: "+1-864-691-8168",
    url: "https://www.greenville.power-champions.com/",
    lat: 34.94,
    lon: -82.23,
  },
  {
    id: "cola",
    name: "Triple T Critical Power Services",
    city: "Columbia, South Carolina",
    street: "1530 Airport Road",
    locality: "Sumter",
    region: "SC",
    postal: "29153",
    url: "https://tripletpower.com/",
    lat: 33.92,
    lon: -80.34,
  },
  {
    id: "atl",
    name: "PowerChampions of Georgia",
    city: "Atlanta, Georgia",
    street: "3043 Braselton Hwy",
    locality: "Dacula",
    region: "GA",
    postal: "30019",
    url: "https://atlanta.power-champions.com/",
    lat: 34.0,
    lon: -83.9,
  },
] as const;

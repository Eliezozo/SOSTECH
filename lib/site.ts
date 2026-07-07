export const siteConfig = {
  name: "Sostech Systems",
  email: "sostechgh@aol.com",
  phones: [
    { label: "+233 054 210 6522", href: "tel:+233542106522" },
    { label: "+233 055 420 5139", href: "tel:+233554205139" },
  ],
  address: "Spintex Road, Accra, Ghana",
  mapQuery: "Spintex+Road+Accra+Ghana",
  url: "https://sostech.vercel.app",
};

export const navKeys = ["home", "services", "projects", "about", "contact"] as const;
export type NavKey = (typeof navKeys)[number];

/** Path for a nav key within a locale (home is the locale root). */
export function navHref(locale: string, key: NavKey): string {
  return key === "home" ? `/${locale}` : `/${locale}/${key}`;
}

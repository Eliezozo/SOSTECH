/**
 * Text fields the site owner can override from the admin dashboard.
 * Keys are dotted paths; the same keys are read back on the public pages
 * to override the default dictionary values.
 */
export const EDITABLE_KEYS: { key: string; label: string }[] = [
  { key: "home.hero.desc", label: "Accueil — description du hero" },
  { key: "about.intro", label: "À propos — introduction" },
  { key: "contact.info.addressValue", label: "Adresse (coordonnées)" },
  { key: "footer.desc", label: "Pied de page — description" },
];

import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { navHref, siteConfig } from "@/lib/site";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
  addressValue: string;
  footerDesc: string;
}

export default function Footer({ locale, dict, addressValue, footerDesc }: FooterProps) {
  const year = new Date().getFullYear();
  const footerServices = [0, 1, 6, 7];

  return (
    <footer className="border-t border-white/10 bg-ink-alt/60">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Image src="/logo.png" alt={dict.brand.name} width={160} height={58} className="h-12 w-auto" />
          <p className="max-w-xs text-sm leading-relaxed text-content-muted">{footerDesc}</p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
            {dict.footer.quickLinks}
          </h4>
          <ul className="space-y-2 text-sm">
            {(["home", "services", "projects", "about", "contact"] as const).map((key) => (
              <li key={key}>
                <Link
                  href={navHref(locale, key)}
                  className="text-content-muted transition-colors hover:text-content"
                >
                  {dict.nav[key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
            {dict.footer.servicesTitle}
          </h4>
          <ul className="space-y-2 text-sm">
            {footerServices.map((i) => (
              <li key={i}>
                <Link
                  href={navHref(locale, "services")}
                  className="text-content-muted transition-colors hover:text-content"
                >
                  {dict.services.items[i].title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
            {dict.footer.contactTitle}
          </h4>
          <ul className="space-y-2 text-sm text-content-muted">
            {siteConfig.phones.map((p) => (
              <li key={p.href}>
                <a href={p.href} className="transition-colors hover:text-content">
                  {p.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-content">
                {siteConfig.email}
              </a>
            </li>
            <li>{addressValue}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-5 text-center text-xs text-content-muted">
          &copy; {year} {dict.footer.copyright}
        </div>
      </div>
    </footer>
  );
}

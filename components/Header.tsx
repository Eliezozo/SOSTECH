"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { navHref, navKeys } from "@/lib/site";
import LanguageSwitcher from "./LanguageSwitcher";

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Header({ locale, dict }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function isActive(key: (typeof navKeys)[number]) {
    const href = navHref(locale, key);
    if (key === "home") return pathname === `/${locale}`;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-ink/85 backdrop-blur-md shadow-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-page flex h-[76px] items-center justify-between gap-4">
        <Link href={`/${locale}`} aria-label={dict.brand.name} className="flex items-center">
          <Image
            src="/logo.png"
            alt={`${dict.brand.name} — ${dict.brand.tagline}`}
            width={190}
            height={68}
            priority
            className="h-11 w-auto"
          />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navKeys.map((key) => (
              <li key={key}>
                <Link
                  href={navHref(locale, key)}
                  className={`relative rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive(key)
                      ? "text-gold"
                      : "text-content-muted hover:text-content"
                  }`}
                >
                  {dict.nav[key]}
                  {isActive(key) && (
                    <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-gold" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} label={dict.common.langLabel} />
          <Link href={navHref(locale, "contact")} className="btn-gold hidden md:inline-flex">
            {dict.common.getQuote}
          </Link>
          <button
            type="button"
            aria-label={dict.common.menu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md border border-white/10 lg:hidden"
          >
            <span
              className={`h-0.5 w-5 bg-content transition-all duration-300 ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 bg-content transition-all duration-300 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 w-5 bg-content transition-all duration-300 ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-white/10 bg-ink/95 backdrop-blur-md transition-[max-height] duration-300 lg:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav aria-label="Mobile" className="container-page py-4">
          <ul className="flex flex-col gap-1">
            {navKeys.map((key) => (
              <li key={key}>
                <Link
                  href={navHref(locale, key)}
                  className={`block rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                    isActive(key)
                      ? "bg-blue/15 text-gold"
                      : "text-content-muted hover:bg-white/5 hover:text-content"
                  }`}
                >
                  {dict.nav[key]}
                </Link>
              </li>
            ))}
            <li className="mt-2">
              <Link href={navHref(locale, "contact")} className="btn-gold w-full">
                {dict.common.getQuote}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

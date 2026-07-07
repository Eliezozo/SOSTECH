"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";

interface LanguageSwitcherProps {
  locale: Locale;
  label: string;
}

export default function LanguageSwitcher({ locale, label }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;
    const segments = pathname.split("/");
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    document.cookie = `sostech-lang=${next};path=/;max-age=31536000;SameSite=Lax`;
    router.push(segments.join("/") || `/${next}`);
    router.refresh();
  }

  return (
    <div
      className="flex items-center gap-1 rounded-full border border-white/10 bg-ink-alt/60 p-1"
      role="group"
      aria-label={label}
    >
      {locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => switchTo(l)}
            aria-pressed={active}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-200 ${
              active
                ? "bg-gold text-ink"
                : "text-content-muted hover:text-content"
            }`}
          >
            {localeNames[l]}
          </button>
        );
      })}
    </div>
  );
}

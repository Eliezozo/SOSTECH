import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

const LOCALE_COOKIE = "sostech-lang";

/**
 * Root entry point. Detects the visitor's language (saved cookie first, then
 * the browser's Accept-Language header) and redirects to `/en` or `/fr`.
 * Locale routing lives here instead of middleware to avoid the Next.js 16
 * `MIDDLEWARE_INVOCATION_FAILED` issue on Vercel.
 */
export default async function RootPage() {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get(LOCALE_COOKIE)?.value;
  if (cookieLang && isLocale(cookieLang)) {
    redirect(`/${cookieLang}`);
  }

  const headerStore = await headers();
  const accept = headerStore.get("accept-language");
  if (accept) {
    const preferred = accept.split(",")[0]?.trim().slice(0, 2).toLowerCase();
    if (preferred && isLocale(preferred)) {
      redirect(`/${preferred}`);
    }
  }

  redirect(`/${defaultLocale}`);
}

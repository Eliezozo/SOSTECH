import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, isLocale } from "./lib/i18n/config";

const LOCALE_COOKIE = "sostech-lang";

/** Paths that must never be locale-redirected. */
function shouldSkip(pathname: string): boolean {
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/videos") ||
    pathname === "/favicon.ico" ||
    pathname === "/favicon.svg" ||
    pathname === "/logo.png" ||
    pathname === "/hero-technician.png" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return true;
  }
  // Static files with extensions (images, fonts, videos, etc.)
  return /\.[a-zA-Z0-9]+$/.test(pathname);
}

function detectLocale(request: NextRequest): string {
  const cookieLang = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLang && isLocale(cookieLang)) return cookieLang;

  const accept = request.headers.get("accept-language");
  if (accept) {
    const preferred = accept.split(",")[0]?.trim().slice(0, 2).toLowerCase();
    if (preferred && isLocale(preferred)) return preferred;
  }
  return defaultLocale;
}

function setLocaleCookie(response: NextResponse, locale: string) {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    if (shouldSkip(pathname)) {
      return NextResponse.next();
    }

    const pathnameHasLocale = locales.some(
      (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
    );

    if (pathnameHasLocale) {
      const current = pathname.split("/")[1];
      if (current && isLocale(current)) {
        const response = NextResponse.next();
        setLocaleCookie(response, current);
        return response;
      }
      return NextResponse.next();
    }

    const locale = detectLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.redirect(url);
    setLocaleCookie(response, locale);
    return response;
  } catch {
    // Never crash the edge function — fall through to the app.
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Run on all paths EXCEPT:
     * - _next/* (all Next.js internals, including /_next/data)
     * - api, admin, static assets, videos
     */
    "/((?!_next|api|admin|favicon\\.ico|favicon\\.svg|logo\\.png|hero-technician\\.png|robots\\.txt|sitemap\\.xml|videos).*)",
  ],
};

import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, isLocale } from "./lib/i18n/config";

const LOCALE_COOKIE = "sostech-lang";

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (pathnameHasLocale) {
    const current = pathname.split("/")[1];
    const response = NextResponse.next();
    response.cookies.set(LOCALE_COOKIE, current, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: [
    "/((?!api|admin|_next/static|_next/image|favicon.ico|logo.png|hero-technician.png|favicon.svg|videos|robots.txt|sitemap.xml).*)",
  ],
};

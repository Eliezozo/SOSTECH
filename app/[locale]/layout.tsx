import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getSiteContent } from "@/lib/content";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const dict = await getDictionary(typedLocale);
  const overrides = await getSiteContent(typedLocale);
  const addressValue = overrides["contact.info.addressValue"] || dict.contact.info.addressValue;
  const footerDesc = overrides["footer.desc"] || dict.footer.desc;

  return (
    <div className="flex min-h-screen flex-col" lang={typedLocale}>
      <Header locale={typedLocale} dict={dict} />
      <main className="flex-1">{children}</main>
      <Footer locale={typedLocale} dict={dict} addressValue={addressValue} footerDesc={footerDesc} />
    </div>
  );
}

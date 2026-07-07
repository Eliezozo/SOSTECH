import { notFound } from "next/navigation";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { ArrowRightIcon, serviceIcons } from "@/components/icons";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { navHref } from "@/lib/site";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale as Locale);
  return { title: dict.services.page.title, description: dict.services.page.subtitle };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const dict = await getDictionary(l);

  return (
    <>
      <PageHero eyebrow={dict.nav.services} title={dict.services.page.title} subtitle={dict.services.page.subtitle} />
      <section className="section">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dict.services.items.map((item, i) => {
            const Icon = serviceIcons[i] ?? serviceIcons[0];
            return (
              <Reveal key={item.title} delay={(i % 3) * 90}>
                <article className="card card-hover group relative h-full overflow-hidden">
                  <span className="pointer-events-none absolute -right-2 -top-4 font-heading text-7xl font-bold text-white/[0.04] transition-colors group-hover:text-gold/10">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative">
                    <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-md bg-gradient-to-br from-blue/30 to-gold/10 text-gold">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-content-muted">{item.desc}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <div className="container-page mt-16">
          <Reveal>
            <div className="flex flex-col items-center justify-between gap-6 rounded-xl border border-white/10 bg-ink-card/60 p-8 text-center sm:flex-row sm:text-left">
              <div>
                <h3 className="text-2xl">{dict.home.cta.title}</h3>
                <p className="mt-2 text-content-muted">{dict.home.cta.desc}</p>
              </div>
              <Link href={navHref(l, "contact")} className="btn-gold shrink-0">
                {dict.home.cta.btn}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

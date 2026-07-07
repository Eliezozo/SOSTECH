import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { CheckShieldIcon } from "@/components/icons";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getSiteContent } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n/config";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale as Locale);
  return { title: dict.about.page.title, description: dict.about.page.subtitle };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const dict = await getDictionary(l);
  const overrides = await getSiteContent(l);
  const intro = overrides["about.intro"] || dict.about.intro;

  return (
    <>
      <PageHero eyebrow={dict.nav.about} title={dict.about.page.title} subtitle={dict.about.page.subtitle} />

      <section className="section">
        <div className="container-page">
          <Reveal>
            <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-content-muted">
              {intro}
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="card h-full border-l-4 border-l-blue">
                <h3 className="text-2xl text-blue-light">{dict.about.mission.title}</h3>
                <p className="mt-4 leading-relaxed text-content-muted">{dict.about.mission.text}</p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="card h-full border-l-4 border-l-gold">
                <h3 className="text-2xl text-gold">{dict.about.vision.title}</h3>
                <p className="mt-4 leading-relaxed text-content-muted">{dict.about.vision.text}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section bg-ink-alt/30">
        <div className="container-page">
          <SectionHeader title={dict.about.why.title} subtitle={dict.about.why.subtitle} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dict.about.why.items.map((item, i) => (
              <Reveal key={item.title} delay={(i % 3) * 90}>
                <article className="card card-hover h-full">
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 font-heading font-bold text-gold">
                    {i + 1}
                  </span>
                  <h3 className="text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-content-muted">{item.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <SectionHeader title={dict.about.cert.title} subtitle={dict.about.cert.subtitle} />
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
            {dict.about.cert.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 120}>
                <article className="card card-hover flex h-full gap-4">
                  <CheckShieldIcon className="h-8 w-8 shrink-0 text-gold" />
                  <div>
                    <h3 className="text-lg">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-content-muted">{item.desc}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

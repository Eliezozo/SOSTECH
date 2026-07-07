import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import {
  ArrowRightIcon,
  CheckShieldIcon,
  ClockIcon,
  homeServiceIcons,
  ShieldIcon,
  CameraIcon,
} from "@/components/icons";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getSiteContent } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { navHref } from "@/lib/site";
import { notFound } from "next/navigation";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const dict = await getDictionary(l);
  const overrides = await getSiteContent(l);
  const h = dict.home;
  const heroDesc = overrides["home.hero.desc"] || h.hero.desc;

  const stats = [
    { value: "10+", label: h.stats.services },
    { value: "7+", label: h.stats.projects },
    { value: "24/7", label: h.stats.monitoring },
    { value: "100%", label: h.stats.licensed },
  ];

  const trust = [
    { Icon: ShieldIcon, label: h.trust.licensed },
    { Icon: ClockIcon, label: h.trust.monitoring },
    { Icon: CheckShieldIcon, label: h.trust.certified },
    { Icon: CameraIcon, label: h.trust.cctv },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(60% 50% at 75% 10%, rgba(26,79,160,0.28), transparent 60%), radial-gradient(40% 40% at 10% 90%, rgba(212,175,55,0.10), transparent 60%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent 75%)",
          }}
          aria-hidden
        />

        <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-medium text-gold-light">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              {h.hero.badge}
            </span>
            <h1 className="mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              {h.hero.title1}{" "}
              <span className="text-gradient">{h.hero.title2}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-content-muted">
              {heroDesc}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={navHref(l, "services")} className="btn-primary">
                {h.hero.cta1}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link href={navHref(l, "contact")} className="btn-outline">
                {h.hero.cta2}
              </Link>
            </div>
          </Reveal>

          <Reveal delay={150} className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-4 rounded-xl bg-gradient-to-tr from-blue/30 via-transparent to-gold/20 blur-2xl" aria-hidden />
              <figure className="relative overflow-hidden rounded-xl border border-white/10 shadow-md">
                <Image
                  src="/hero-technician.png"
                  alt="Sostech Systems technician installing a CCTV security camera"
                  width={640}
                  height={480}
                  priority
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              </figure>

              <div className="absolute -left-4 top-8 animate-float rounded-lg border border-white/10 bg-ink-card/90 px-4 py-3 shadow-md backdrop-blur">
                <div className="font-heading text-xl font-bold text-gold">24/7</div>
                <div className="text-xs text-content-muted">{h.hero.card1}</div>
              </div>
              <div
                className="absolute -right-4 top-1/3 animate-float rounded-lg border border-white/10 bg-ink-card/90 px-4 py-3 shadow-md backdrop-blur"
                style={{ animationDelay: "1.5s" }}
              >
                <div className="font-heading text-xl font-bold text-blue-light">CCTV</div>
                <div className="text-xs text-content-muted">{h.hero.card2}</div>
              </div>
              <div
                className="absolute -bottom-4 left-1/4 animate-float rounded-lg border border-white/10 bg-ink-card/90 px-4 py-3 shadow-md backdrop-blur"
                style={{ animationDelay: "0.8s" }}
              >
                <div className="font-heading text-xl font-bold text-gold">100%</div>
                <div className="text-xs text-content-muted">{h.hero.card3}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-white/5 bg-ink-alt/40">
        <div className="container-page grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
          {trust.map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-3 text-content-muted">
              <Icon className="h-7 w-7 shrink-0 text-gold" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="section">
        <div className="container-page grid grid-cols-2 gap-5 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div className="card card-hover text-center">
                <div className="font-heading text-4xl font-bold text-gradient">{s.value}</div>
                <div className="mt-2 text-sm text-content-muted">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Services preview */}
      <section className="section bg-ink-alt/30">
        <div className="container-page">
          <SectionHeader eyebrow={h.services.eyebrow} title={h.services.title} subtitle={h.services.subtitle} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {h.services.items.map((item, i) => {
              const Icon = homeServiceIcons[i] ?? homeServiceIcons[0];
              return (
                <Reveal key={item.title} delay={i * 80}>
                  <article className="card card-hover group h-full">
                    <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-md bg-gradient-to-br from-blue/30 to-gold/10 text-gold transition-colors group-hover:text-gold-light">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-content-muted">{item.desc}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <Link href={navHref(l, "services")} className="btn-gold">
              {h.services.viewAll}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="section">
        <div className="container-page">
          <SectionHeader eyebrow={h.why.eyebrow} title={h.why.title} subtitle={h.why.subtitle} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {h.why.items.map((item, i) => (
              <Reveal key={item} delay={i * 70}>
                <div className="card card-hover flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/30 font-heading text-lg font-bold text-gold">
                    {i + 1}
                  </span>
                  <h3 className="text-lg">{item}</h3>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href={navHref(l, "about")} className="btn-outline">
              {h.why.learnMore}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container-page">
          <Reveal>
            <div className="relative overflow-hidden rounded-xl border border-gold/20 bg-gradient-to-br from-blue-dark/60 via-ink-card to-ink-card p-10 text-center shadow-md sm:p-16">
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 50% 0%, rgba(212,175,55,0.25), transparent 60%)",
                }}
                aria-hidden
              />
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl">{h.cta.title}</h2>
                <p className="mx-auto mt-4 max-w-xl text-content-muted">{h.cta.desc}</p>
                <Link href={navHref(l, "contact")} className="btn-primary mt-8">
                  {h.cta.btn}
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

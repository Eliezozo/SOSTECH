import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { MailIcon, MapPinIcon, PhoneCallIcon, ClockIcon } from "@/components/icons";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getSiteContent } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale as Locale);
  return { title: dict.contact.page.title, description: dict.contact.page.subtitle };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const dict = await getDictionary(l);
  const overrides = await getSiteContent(l);
  const addressValue = overrides["contact.info.addressValue"] || dict.contact.info.addressValue;

  return (
    <>
      <PageHero eyebrow={dict.nav.contact} title={dict.contact.page.title} subtitle={dict.contact.page.subtitle} />

      <section className="section">
        <div className="container-page grid gap-8 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="card h-full">
              <h2 className="text-2xl">{dict.contact.info.title}</h2>
              <ul className="mt-6 space-y-6">
                <InfoRow Icon={PhoneCallIcon} label={dict.contact.info.phone}>
                  {siteConfig.phones.map((p) => (
                    <a key={p.href} href={p.href} className="block transition-colors hover:text-gold">
                      {p.label}
                    </a>
                  ))}
                </InfoRow>
                <InfoRow Icon={MailIcon} label={dict.contact.info.email}>
                  <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-gold">
                    {siteConfig.email}
                  </a>
                </InfoRow>
                <InfoRow Icon={MapPinIcon} label={dict.contact.info.address}>
                  {addressValue}
                </InfoRow>
                <InfoRow Icon={ClockIcon} label={dict.contact.info.hours}>
                  {dict.contact.info.hoursValue}
                </InfoRow>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-3">
            <div className="card h-full">
              <h2 className="text-2xl">{dict.contact.form.title}</h2>
              <div className="mt-6">
                <ContactForm dict={dict} />
              </div>
            </div>
          </Reveal>
        </div>

        <div className="container-page mt-10">
          <Reveal>
            <h2 className="mb-6 text-2xl">{dict.contact.map.title}</h2>
            <div className="overflow-hidden rounded-xl border border-white/10 shadow-md">
              <iframe
                title={`${siteConfig.name} location`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${siteConfig.mapQuery}&output=embed`}
                className="h-[380px] w-full"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function InfoRow({
  Icon,
  label,
  children,
}: {
  Icon: (props: { className?: string }) => React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-blue/15 text-gold">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-content-muted">
          {label}
        </div>
        <div className="mt-1 text-sm text-content">{children}</div>
      </div>
    </li>
  );
}

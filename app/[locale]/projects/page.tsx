import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import ProjectsGrid from "@/components/ProjectsGrid";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getProjects } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n/config";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale as Locale);
  return { title: dict.projects.page.title, description: dict.projects.page.subtitle };
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const dict = await getDictionary(l);
  const projects = await getProjects(l, dict);

  return (
    <>
      <PageHero eyebrow={dict.nav.projects} title={dict.projects.page.title} subtitle={dict.projects.page.subtitle} />
      <section className="section">
        <div className="container-page">
          <ProjectsGrid
            projects={projects}
            contactLabel={dict.projects.contactLabel}
            videoTag={dict.projects.videoTag}
          />
        </div>
      </section>
    </>
  );
}

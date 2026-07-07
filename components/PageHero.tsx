import Reveal from "./Reveal";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export default function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 50% 60% at 80% 0%, rgba(26,79,160,0.25), transparent 60%)",
        }}
        aria-hidden
      />
      <div className="container-page relative py-20 sm:py-24">
        <Reveal className="max-w-3xl">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="text-4xl sm:text-5xl">{title}</h1>
          {subtitle && <p className="mt-5 max-w-2xl text-lg text-content-muted">{subtitle}</p>}
        </Reveal>
      </div>
    </section>
  );
}

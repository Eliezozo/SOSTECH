import Reveal from "./Reveal";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: SectionHeaderProps) {
  return (
    <Reveal
      className={`mb-12 max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="text-3xl sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-content-muted">{subtitle}</p>}
    </Reveal>
  );
}

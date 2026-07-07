"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CameraIcon, CloseIcon, PlayIcon } from "./icons";
import type { ProjectView } from "@/lib/types";

interface ProjectsGridProps {
  projects: ProjectView[];
  contactLabel: string;
  videoTag: string;
}

export default function ProjectsGrid({ projects, contactLabel, videoTag }: ProjectsGridProps) {
  const [active, setActive] = useState<ProjectView | null>(null);
  const playerRef = useRef<HTMLVideoElement | null>(null);

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close]);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            contactLabel={contactLabel}
            videoTag={videoTag}
            onPlay={() => setActive(project)}
          />
        ))}
      </div>

      {active && active.mediaType === "video" && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink/90 backdrop-blur-sm"
            aria-label="Close"
            onClick={close}
          />
          <div className="relative z-10 w-full max-w-4xl">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h3 className="text-xl text-content">{active.title}</h3>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-content transition-colors hover:bg-white/10"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-hidden rounded-lg border border-white/10 bg-black shadow-md">
              <video
                ref={playerRef}
                src={active.mediaUrl}
                controls
                autoPlay
                playsInline
                className="aspect-video w-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ProjectCard({
  project,
  index,
  contactLabel,
  videoTag,
  onPlay,
}: {
  project: ProjectView;
  index: number;
  contactLabel: string;
  videoTag: string;
  onPlay: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = cardRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function handleEnter() {
    const v = videoRef.current;
    if (v) v.play().catch(() => {});
  }
  function handleLeave() {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0.5;
    }
  }

  return (
    <article
      ref={cardRef as React.Ref<HTMLElement>}
      className={`reveal ${visible ? "is-visible" : ""} card card-hover group overflow-hidden p-0`}
      style={index ? { transitionDelay: `${(index % 3) * 90}ms` } : undefined}
    >
      {project.mediaType === "video" ? (
        <button
          type="button"
          onClick={onPlay}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          className="relative block aspect-video w-full overflow-hidden"
          aria-label={`${videoTag}: ${project.title}`}
        >
          <video
            ref={videoRef}
            src={`${project.mediaUrl}#t=0.5`}
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/40 transition-colors group-hover:bg-ink/20">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-ink shadow-glow-gold transition-transform group-hover:scale-110">
              <PlayIcon className="ml-0.5 h-6 w-6" />
            </span>
            <span className="rounded-full bg-ink/70 px-3 py-1 text-xs font-medium text-content">
              {videoTag}
            </span>
          </span>
        </button>
      ) : project.mediaType === "image" ? (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={project.mediaUrl}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-ink-elevated to-ink-card text-blue-light/40">
          <CameraIcon className="h-12 w-12" />
        </div>
      )}

      <div className="p-6">
        <h3 className="text-lg">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-content-muted">{project.desc}</p>
        {project.contact && (
          <dl className="mt-4 border-t border-white/5 pt-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-gold">
              {contactLabel}
            </dt>
            <dd className="mt-1 text-sm text-content-muted">{project.contact}</dd>
          </dl>
        )}
      </div>
    </article>
  );
}

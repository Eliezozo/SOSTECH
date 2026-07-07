"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ProjectsManager from "./ProjectsManager";
import GalleryManager from "./GalleryManager";
import ContentManager from "./ContentManager";

type Tab = "projects" | "gallery" | "content";

const TABS: { id: Tab; label: string }[] = [
  { id: "projects", label: "Projets" },
  { id: "gallery", label: "Galerie" },
  { id: "content", label: "Textes du site" },
];

export default function Dashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<Tab>("projects");

  async function logout() {
    await createClient().auth.signOut();
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/90 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Sostech Systems" width={130} height={47} className="h-9 w-auto" />
            <span className="hidden text-sm font-semibold text-content-muted sm:inline">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-sm text-content-muted hover:text-content">
              Voir le site ↗
            </Link>
            <span className="hidden text-sm text-content-muted md:inline">{email}</span>
            <button
              type="button"
              onClick={logout}
              className="btn-outline px-4 py-2 text-xs"
            >
              Déconnexion
            </button>
          </div>
        </div>
        <div className="container-page flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${
                tab === t.id ? "text-gold" : "text-content-muted hover:text-content"
              }`}
            >
              {t.label}
              {tab === t.id && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-gold" />
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="container-page py-8">
        {tab === "projects" && <ProjectsManager />}
        {tab === "gallery" && <GalleryManager />}
        {tab === "content" && <ContentManager />}
      </main>
    </div>
  );
}

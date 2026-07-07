"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { publicMediaUrl } from "@/lib/supabase/config";
import { uploadMedia } from "@/lib/supabase/upload";
import type { GalleryRow } from "@/lib/types";
import { fieldClass, StatusBanner, type Status } from "./ui";

export default function GalleryManager() {
  const [rows, setRows] = useState<GalleryRow[]>([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("gallery").select("*").order("sort_order", { ascending: true });
    setRows((data as GalleryRow[]) ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setStatus({ type: "error", message: "Choisis une photo à téléverser." });
      return;
    }
    setSaving(true);
    setStatus(null);
    try {
      const path = await uploadMedia(file, "gallery");
      const { error } = await createClient()
        .from("gallery")
        .insert({ title: title.trim(), image_url: path, sort_order: Date.now() });
      if (error) throw error;
      setStatus({ type: "success", message: "Photo ajoutée." });
      setTitle("");
      setFile(null);
      setFileKey((k) => k + 1);
      load();
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Erreur." });
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette photo ?")) return;
    const { error } = await createClient().from("gallery").delete().eq("id", id);
    if (error) setStatus({ type: "error", message: error.message });
    else load();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="rounded-lg border border-white/10 bg-ink-card/60 p-6">
        <h2 className="text-xl">Ajouter une photo</h2>
        <p className="mt-1 text-sm text-content-muted">Photos de tes réalisations pour la galerie.</p>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Légende (optionnel)</span>
            <input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Photo</span>
            <input
              key={fileKey}
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-content-muted file:mr-4 file:rounded-md file:border-0 file:bg-blue file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-light"
            />
          </label>
        </div>
        <button type="submit" disabled={saving} className="btn-primary mt-6">
          {saving ? "Téléversement…" : "Ajouter la photo"}
        </button>
        <StatusBanner status={status} />
      </form>

      <div className="space-y-4">
        <h3 className="text-lg">Photos ({rows.length})</h3>
        {rows.length === 0 ? (
          <p className="rounded-lg border border-dashed border-white/10 p-8 text-center text-sm text-content-muted">
            Aucune photo dans la galerie.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {rows.map((row) => (
              <li key={row.id} className="group relative overflow-hidden rounded-lg border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={publicMediaUrl(row.image_url)} alt={row.title ?? ""} className="aspect-square w-full object-cover" />
                <button
                  type="button"
                  onClick={() => remove(row.id)}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500/80 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Supprimer"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

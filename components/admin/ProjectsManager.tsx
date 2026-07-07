"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { publicMediaUrl } from "@/lib/supabase/config";
import { uploadMedia } from "@/lib/supabase/upload";
import type { ProjectRow } from "@/lib/types";
import { fieldClass, StatusBanner, type Status } from "./ui";

const EMPTY = {
  title_fr: "",
  title_en: "",
  desc_fr: "",
  desc_en: "",
  contact: "",
  sort_order: 0,
};

export default function ProjectsManager() {
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [form, setForm] = useState({ ...EMPTY });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingMedia, setEditingMedia] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("projects").select("*").order("sort_order", { ascending: true });
    setRows((data as ProjectRow[]) ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function reset() {
    setForm({ ...EMPTY });
    setEditingId(null);
    setEditingMedia(null);
    setFile(null);
  }

  function edit(row: ProjectRow) {
    setEditingId(row.id);
    setEditingMedia(row.media_url);
    setForm({
      title_fr: row.title_fr,
      title_en: row.title_en,
      desc_fr: row.desc_fr,
      desc_en: row.desc_en,
      contact: row.contact ?? "",
      sort_order: row.sort_order,
    });
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce projet ?")) return;
    const { error } = await createClient().from("projects").delete().eq("id", id);
    if (error) setStatus({ type: "error", message: error.message });
    else load();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title_fr.trim()) {
      setStatus({ type: "error", message: "Le titre en français est obligatoire." });
      return;
    }
    setSaving(true);
    setStatus(null);
    try {
      let mediaUrl = editingMedia;
      let mediaType: "video" | "image" = "video";

      if (file) {
        mediaUrl = await uploadMedia(file, "projects");
        mediaType = file.type.startsWith("video/") ? "video" : "image";
      }

      if (!editingId && !mediaUrl) {
        setStatus({ type: "error", message: "Ajoute une vidéo ou une photo pour un nouveau projet." });
        setSaving(false);
        return;
      }

      const payload: Record<string, unknown> = {
        title_fr: form.title_fr.trim(),
        title_en: form.title_en.trim() || form.title_fr.trim(),
        desc_fr: form.desc_fr.trim(),
        desc_en: form.desc_en.trim() || form.desc_fr.trim(),
        contact: form.contact.trim(),
        sort_order: Number(form.sort_order) || 0,
      };
      if (mediaUrl) {
        payload.media_url = mediaUrl;
        if (file) payload.media_type = mediaType;
      }

      const supabase = createClient();
      const { error } = editingId
        ? await supabase.from("projects").update(payload).eq("id", editingId)
        : await supabase.from("projects").insert(payload);

      if (error) throw error;
      setStatus({ type: "success", message: "Projet enregistré." });
      reset();
      load();
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Erreur." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="rounded-lg border border-white/10 bg-ink-card/60 p-6">
        <h2 className="text-xl">{editingId ? "Modifier le projet" : "Ajouter un projet"}</h2>
        <p className="mt-1 text-sm text-content-muted">
          Une vidéo ou une photo par projet, avec titre et description (FR + EN).
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Titre (FR)" required>
            <input className={fieldClass} value={form.title_fr} onChange={(e) => setForm({ ...form, title_fr: e.target.value })} />
          </Field>
          <Field label="Titre (EN)">
            <input className={fieldClass} value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
          </Field>
          <Field label="Description (FR)">
            <textarea rows={3} className={fieldClass} value={form.desc_fr} onChange={(e) => setForm({ ...form, desc_fr: e.target.value })} />
          </Field>
          <Field label="Description (EN)">
            <textarea rows={3} className={fieldClass} value={form.desc_en} onChange={(e) => setForm({ ...form, desc_en: e.target.value })} />
          </Field>
          <Field label="Contact de référence (optionnel)">
            <input className={fieldClass} placeholder="M. Nom — 0XX XXX XXXX" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
          </Field>
          <Field label="Ordre d'affichage">
            <input type="number" className={fieldClass} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Média (vidéo .mp4 ou image)">
            <input
              type="file"
              accept="video/*,image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-content-muted file:mr-4 file:rounded-md file:border-0 file:bg-blue file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-light"
            />
          </Field>
          {editingMedia && !file && (
            <p className="mt-2 text-xs text-content-muted">
              Média actuel conservé : <code className="text-gold-light">{editingMedia}</code>
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Enregistrement…" : editingId ? "Mettre à jour" : "Ajouter le projet"}
          </button>
          {editingId && (
            <button type="button" onClick={reset} className="btn-outline">
              Annuler
            </button>
          )}
        </div>

        <StatusBanner status={status} />
      </form>

      <div className="space-y-4">
        <h3 className="text-lg">Projets existants ({rows.length})</h3>
        {rows.length === 0 ? (
          <p className="rounded-lg border border-dashed border-white/10 p-8 text-center text-sm text-content-muted">
            Aucun projet enregistré. Les projets de référence par défaut restent affichés sur le site
            tant que tu n&apos;en ajoutes pas ici.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((row) => (
              <li key={row.id} className="overflow-hidden rounded-lg border border-white/10 bg-ink-card/60">
                <div className="aspect-video bg-ink">
                  {row.media_url ? (
                    row.media_type === "video" ? (
                      <video src={publicMediaUrl(row.media_url)} muted className="h-full w-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={publicMediaUrl(row.media_url)} alt="" className="h-full w-full object-cover" />
                    )
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-content-muted">
                      Pas de média
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-heading font-semibold">{row.title_fr || row.title_en}</h4>
                  <p className="mt-1 line-clamp-2 text-xs text-content-muted">{row.desc_fr || row.desc_en}</p>
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => edit(row)} className="rounded-md bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10">
                      Modifier
                    </button>
                    <button type="button" onClick={() => remove(row.id)} className="rounded-md bg-red-500/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/20">
                      Supprimer
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-content">
        {label}
        {required && <span className="text-gold"> *</span>}
      </span>
      {children}
    </label>
  );
}

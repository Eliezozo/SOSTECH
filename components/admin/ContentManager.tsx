"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { EDITABLE_KEYS } from "@/lib/editable-content";
import type { SiteContentRow } from "@/lib/types";
import { fieldClass, StatusBanner, type Status } from "./ui";

type Values = Record<string, { value_fr: string; value_en: string }>;

function emptyValues(): Values {
  const v: Values = {};
  EDITABLE_KEYS.forEach(({ key }) => {
    v[key] = { value_fr: "", value_en: "" };
  });
  return v;
}

export default function ContentManager() {
  const [values, setValues] = useState<Values>(emptyValues);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("site_content").select("*");
    const next = emptyValues();
    (data as SiteContentRow[] | null)?.forEach((row) => {
      if (next[row.key]) {
        next[row.key] = { value_fr: row.value_fr ?? "", value_en: row.value_en ?? "" };
      }
    });
    setValues(next);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const payload = EDITABLE_KEYS.map(({ key }) => ({
        key,
        value_fr: values[key].value_fr.trim(),
        value_en: values[key].value_en.trim(),
        updated_at: new Date().toISOString(),
      }));
      const { error } = await createClient().from("site_content").upsert(payload);
      if (error) throw error;
      setStatus({ type: "success", message: "Textes enregistrés. Recharge le site public pour voir les changements." });
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Erreur." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="rounded-lg border border-white/10 bg-ink-card/60 p-6">
      <h2 className="text-xl">Textes du site</h2>
      <p className="mt-1 text-sm text-content-muted">
        Modifie les textes clés. Laisse un champ vide pour conserver la valeur par défaut du site.
      </p>

      <div className="mt-6 space-y-6">
        {EDITABLE_KEYS.map(({ key, label }) => (
          <fieldset key={key} className="rounded-md border border-white/10 p-4">
            <legend className="px-2 text-sm font-semibold text-content">
              {label} <code className="ml-1 text-xs text-gold-light">{key}</code>
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-content-muted">Français</span>
                <textarea
                  rows={2}
                  className={fieldClass}
                  value={values[key].value_fr}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [key]: { ...v[key], value_fr: e.target.value } }))
                  }
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-content-muted">English</span>
                <textarea
                  rows={2}
                  className={fieldClass}
                  value={values[key].value_en}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [key]: { ...v[key], value_en: e.target.value } }))
                  }
                />
              </label>
            </div>
          </fieldset>
        ))}
      </div>

      <button type="submit" disabled={saving} className="btn-primary mt-6">
        {saving ? "Enregistrement…" : "Enregistrer les textes"}
      </button>
      <StatusBanner status={status} />
    </form>
  );
}

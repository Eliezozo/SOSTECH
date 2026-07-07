import "server-only";
import { createServerSupabase } from "./supabase/server";
import { isSupabaseConfigured, publicMediaUrl } from "./supabase/config";
import { staticProjectMedia } from "./data/static-projects";
import type { Locale } from "./i18n/config";
import type { Dictionary } from "./i18n/types";
import type { GalleryRow, ProjectRow, ProjectView, SiteContentRow } from "./types";

/**
 * Projects come from Supabase when available; otherwise we fall back to the
 * built-in reference projects defined in the dictionary + local video assets.
 */
export async function getProjects(locale: Locale, dict: Dictionary): Promise<ProjectView[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return (data as ProjectRow[]).map((row) => ({
          id: row.id,
          title: locale === "fr" ? row.title_fr || row.title_en : row.title_en || row.title_fr,
          desc: locale === "fr" ? row.desc_fr || row.desc_en : row.desc_en || row.desc_fr,
          contact: row.contact ?? "",
          mediaUrl: publicMediaUrl(row.media_url),
          mediaType: row.media_url ? row.media_type : null,
        }));
      }
    } catch {
      // fall through to static content
    }
  }

  return dict.projects.items.map((item, index) => {
    const media = staticProjectMedia[index] ?? { url: "", type: null };
    return {
      id: `static-${index}`,
      title: item.title,
      desc: item.desc,
      contact: item.contact ?? "",
      mediaUrl: media.url,
      mediaType: media.type,
    };
  });
}

export async function getGallery(): Promise<{ id: string; title: string; url: string }[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return (data as GalleryRow[]).map((row) => ({
      id: row.id,
      title: row.title ?? "",
      url: publicMediaUrl(row.image_url),
    }));
  } catch {
    return [];
  }
}

/**
 * Editable text overrides keyed by dotted paths (e.g. "contact.info.addressValue").
 * Returns a flat map so callers can override dictionary values.
 */
export async function getSiteContent(locale: Locale): Promise<Record<string, string>> {
  if (!isSupabaseConfigured()) return {};
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.from("site_content").select("*");
    if (error || !data) return {};
    const map: Record<string, string> = {};
    (data as SiteContentRow[]).forEach((row) => {
      const value = locale === "fr" ? row.value_fr : row.value_en;
      if (value) map[row.key] = value;
    });
    return map;
  } catch {
    return {};
  }
}

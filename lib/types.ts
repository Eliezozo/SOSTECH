export type MediaType = "video" | "image";

export interface ProjectRow {
  id: string;
  title_en: string;
  title_fr: string;
  desc_en: string;
  desc_fr: string;
  media_url: string | null;
  media_type: MediaType;
  contact: string | null;
  sort_order: number;
  created_at?: string;
}

export interface GalleryRow {
  id: string;
  title: string | null;
  image_url: string;
  sort_order: number;
  created_at?: string;
}

export interface SiteContentRow {
  key: string;
  value_en: string | null;
  value_fr: string | null;
  updated_at?: string;
}

/** Normalized project used by the UI (locale-resolved). */
export interface ProjectView {
  id: string;
  title: string;
  desc: string;
  contact: string;
  mediaUrl: string;
  mediaType: MediaType | null;
}

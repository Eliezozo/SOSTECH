import type { MediaType } from "../types";

/**
 * Media shown for the built-in reference projects when the Supabase
 * database has no rows yet. Indexes line up with `dict.projects.items`.
 */
export const staticProjectMedia: { url: string; type: MediaType | null }[] = [
  { url: "/videos/project-1.mp4", type: "video" },
  { url: "/videos/project-2.mp4", type: "video" },
  { url: "/videos/project-3.mp4", type: "video" },
  { url: "/videos/project-4.mp4", type: "video" },
  { url: "/videos/project-5.mp4", type: "video" },
  { url: "", type: null },
  { url: "", type: null },
];

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const supabaseBucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "media";

export function isSupabaseConfigured(): boolean {
  return (
    supabaseUrl.length > 0 &&
    supabaseUrl.startsWith("http") &&
    !supabaseUrl.includes("your-project") &&
    supabaseAnonKey.length > 20 &&
    !supabaseAnonKey.includes("your-anon")
  );
}

export function publicMediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${supabaseUrl}/storage/v1/object/public/${supabaseBucket}/${path}`;
}

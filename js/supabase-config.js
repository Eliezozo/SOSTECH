/* js/supabase-config.js
 * Sostech Systems — Supabase configuration
 *
 * HOW TO GET THESE VALUES (free account):
 *   1. Create a project at https://supabase.com/
 *   2. In your project: Settings → API
 *   3. Copy the "Project URL" and the "anon public" key below.
 *
 * The anon key is safe to expose in the browser. Write access is
 * protected by Row Level Security (only logged-in admins can write).
 */
window.SUPABASE_CONFIG = {
  url: "YOUR_SUPABASE_URL",
  anonKey: "YOUR_SUPABASE_ANON_KEY",
  mediaBucket: "media"
};

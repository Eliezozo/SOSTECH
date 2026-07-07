/* js/supabase-client.js
 * Initializes the shared Supabase client and small helpers.
 * Requires the Supabase JS SDK and supabase-config.js to be loaded first.
 */
(function () {
  const cfg = window.SUPABASE_CONFIG;

  function isConfigured() {
    return (
      typeof window.supabase !== "undefined" &&
      cfg &&
      cfg.url &&
      cfg.url !== "YOUR_SUPABASE_URL" &&
      cfg.anonKey &&
      cfg.anonKey !== "YOUR_SUPABASE_ANON_KEY"
    );
  }

  window.SostechDB = {
    client: null,
    isConfigured: isConfigured,

    get() {
      if (!isConfigured()) return null;
      if (!this.client) {
        this.client = window.supabase.createClient(cfg.url, cfg.anonKey);
      }
      return this.client;
    },

    /* Public URL for a stored file path in the media bucket */
    publicUrl(path) {
      const c = this.get();
      if (!c || !path) return path || "";
      if (/^https?:\/\//i.test(path)) return path;
      const { data } = c.storage.from(cfg.mediaBucket).getPublicUrl(path);
      return (data && data.publicUrl) || "";
    }
  };
})();

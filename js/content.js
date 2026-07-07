/* js/content.js — Load dynamic content from Supabase on public pages */
(function () {
  function db() {
    return window.SostechDB && window.SostechDB.get();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function mediaUrl(path) {
    return window.SostechDB.publicUrl(path);
  }

  async function mergeSiteContent() {
    if (!window.SostechDB || !window.SostechDB.isConfigured()) return;
    const client = db();
    const { data } = await client.from("site_content").select("*");
    if (!data || !data.length || !window.translations) return;

    data.forEach((row) => {
      if (row.value_en && window.translations.en) {
        window.translations.en[row.key] = row.value_en;
      }
      if (row.value_fr && window.translations.fr) {
        window.translations.fr[row.key] = row.value_fr;
      }
    });

    if (typeof applyTranslations === "function" && typeof getLanguage === "function") {
      applyTranslations(getLanguage());
    }
  }

  async function renderProjects() {
    const grid = document.querySelector(".projects-grid");
    if (!grid || !window.SostechDB || !window.SostechDB.isConfigured()) return;

    const client = db();
    const { data, error } = await client
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || !data.length) return;

    const lang = typeof getLanguage === "function" ? getLanguage() : "en";
    const dict = (window.translations && window.translations[lang]) || {};
    const contactLabel = dict["projects.contactLabel"] || "Reference contact";
    const videoTag = dict["projects.videoTag"] || "Watch installation";

    grid.innerHTML = data.map((p) => {
      const title = lang === "fr" ? (p.title_fr || p.title_en) : (p.title_en || p.title_fr);
      const desc = lang === "fr" ? (p.desc_fr || p.desc_en) : (p.desc_en || p.desc_fr);
      const url = p.media_url ? mediaUrl(p.media_url) : "";
      const hasVideo = url && p.media_type === "video";
      const hasImage = url && p.media_type === "image";

      let mediaBlock = "";
      if (hasVideo) {
        mediaBlock =
          '<button class="project-media" type="button" data-video="' + escapeHtml(url) + '" aria-label="Play project video">' +
            '<video class="project-video" src="' + escapeHtml(url) + '#t=0.5" muted loop playsinline preload="metadata"></video>' +
            '<span class="project-media-overlay">' +
              '<span class="play-btn" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>' +
              '<span class="project-media-tag">' + escapeHtml(videoTag) + '</span>' +
            '</span>' +
          '</button>';
      } else if (hasImage) {
        mediaBlock =
          '<div class="project-media project-media--static">' +
            '<img src="' + escapeHtml(url) + '" alt="' + escapeHtml(title) + '" loading="lazy">' +
          '</div>';
      } else {
        mediaBlock =
          '<div class="project-media project-media--placeholder" aria-hidden="true">' +
            '<span class="project-media-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg></span>' +
          '</div>';
      }

      const contactBlock = p.contact
        ? '<dl class="project-meta"><dt>' + escapeHtml(contactLabel) + '</dt><dd>' + escapeHtml(p.contact) + '</dd></dl>'
        : "";

      return (
        '<article class="card project-card fade-in is-visible">' +
          mediaBlock +
          '<div class="project-body">' +
            '<h3>' + escapeHtml(title) + '</h3>' +
            '<p>' + escapeHtml(desc || "") + '</p>' +
            contactBlock +
          '</div>' +
        '</article>'
      );
    }).join("");

    document.dispatchEvent(new CustomEvent("sostech:projects-rendered"));
  }

  async function init() {
    await mergeSiteContent();
    if (document.body.dataset.page === "projects") {
      await renderProjects();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

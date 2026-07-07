/* js/admin.js — Sostech Systems admin dashboard */
(function () {
  const cfg = window.SUPABASE_CONFIG;
  const EDITABLE_KEYS = [
    { key: "contact.info.addressValue", label: "Adresse" },
    { key: "contact.info.phone", label: "Téléphone (affiché dans textes)" },
    { key: "home.hero.desc", label: "Accueil — description hero" },
    { key: "about.intro", label: "À propos — introduction" },
    { key: "footer.desc", label: "Pied de page — description" }
  ];

  let editingProjectId = null;
  let editingProjectMedia = null;

  function db() {
    return window.SostechDB && window.SostechDB.get();
  }

  function setStatus(el, msg, type) {
    if (!el) return;
    el.textContent = msg || "";
    el.className = "admin-status" + (type ? " is-" + type : "");
  }

  function show(el) {
    if (el) el.hidden = false;
  }

  function hide(el) {
    if (el) el.hidden = true;
  }

  function switchTab(name) {
    document.querySelectorAll(".admin-tab").forEach((t) => {
      t.classList.toggle("is-active", t.dataset.tab === name);
    });
    document.querySelectorAll(".admin-panel").forEach((p) => {
      p.classList.toggle("is-active", p.dataset.panel === name);
    });
  }

  /* ── Auth ── */
  async function initAuth() {
    const setupWarning = document.getElementById("setup-warning");
    const loginView = document.getElementById("login-view");
    const dashboardView = document.getElementById("dashboard-view");

    if (!window.SostechDB || !window.SostechDB.isConfigured()) {
      show(setupWarning);
      hide(loginView);
      hide(dashboardView);
      return;
    }

    hide(setupWarning);
    const client = db();

    const { data: { session } } = await client.auth.getSession();
    if (session) {
      showDashboard(session.user);
    } else {
      show(loginView);
      hide(dashboardView);
    }

    client.auth.onAuthStateChange((_event, session) => {
      if (session) showDashboard(session.user);
      else {
        hide(dashboardView);
        show(loginView);
      }
    });

    document.getElementById("login-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = document.getElementById("login-status");
      setStatus(status, "Connexion…", "info");
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;
      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) setStatus(status, error.message, "error");
      else setStatus(status, "", "");
    });

    document.getElementById("logout-btn").addEventListener("click", async () => {
      await client.auth.signOut();
    });
  }

  function showDashboard(user) {
    hide(document.getElementById("login-view"));
    show(document.getElementById("dashboard-view"));
    const userEl = document.getElementById("admin-user");
    if (userEl) userEl.textContent = user.email || "";

    document.querySelectorAll(".admin-tab").forEach((tab) => {
      tab.addEventListener("click", () => switchTab(tab.dataset.tab));
    });

    initProjects();
    initGallery();
    initContent();
  }

  /* ── Upload ── */
  async function uploadFile(file, folder) {
    const client = db();
    const bucket = cfg.mediaBucket;
    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    const path = folder + "/" + Date.now() + "-" + Math.random().toString(36).slice(2, 8) + "." + ext;
    const { error } = await client.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false
    });
    if (error) throw error;
    return path;
  }

  function mediaUrl(path) {
    return window.SostechDB.publicUrl(path);
  }

  function showProgress(id, showIt) {
    const el = document.getElementById(id);
    if (!el) return;
    el.hidden = !showIt;
    const bar = el.querySelector(".admin-progress-bar");
    if (bar) bar.style.width = showIt ? "70%" : "0";
  }

  /* ── Projects ── */
  function resetProjectForm() {
    editingProjectId = null;
    editingProjectMedia = null;
    document.getElementById("project-id").value = "";
    document.getElementById("project-form").reset();
    document.getElementById("project-order").value = "0";
    document.getElementById("project-current-media").textContent = "";
    document.getElementById("project-submit").textContent = "Ajouter le projet";
    hide(document.getElementById("project-cancel"));
  }

  async function loadProjects() {
    const list = document.getElementById("projects-list");
    const client = db();
    const { data, error } = await client
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      list.innerHTML = '<p class="admin-empty">Erreur de chargement.</p>';
      return;
    }

    if (!data || !data.length) {
      list.innerHTML = '<p class="admin-empty">Aucun projet. Ajoute le premier ci-dessus.</p>';
      return;
    }

    list.innerHTML = data.map((p) => {
      const url = p.media_url ? mediaUrl(p.media_url) : "";
      const mediaHtml = url
        ? (p.media_type === "video"
          ? '<video src="' + url + '" muted playsinline></video>'
          : '<img src="' + url + '" alt="">')
        : '<div style="display:grid;place-items:center;height:100%;color:#666;font-size:0.75rem">Pas de média</div>';
      return (
        '<article class="admin-item" data-id="' + p.id + '">' +
          '<div class="admin-item-media">' + mediaHtml + '</div>' +
          '<div class="admin-item-body">' +
            '<h3>' + escapeHtml(p.title_fr || p.title_en) + '</h3>' +
            '<p>' + escapeHtml(p.desc_fr || p.desc_en || "") + '</p>' +
            (p.contact ? '<p class="admin-muted">' + escapeHtml(p.contact) + '</p>' : "") +
          '</div>' +
          '<div class="admin-item-actions">' +
            '<button type="button" class="admin-icon-btn" data-edit-project="' + p.id + '">Modifier</button>' +
            '<button type="button" class="admin-icon-btn is-danger" data-delete-project="' + p.id + '">Supprimer</button>' +
          '</div>' +
        '</article>'
      );
    }).join("");

    list.querySelectorAll("[data-edit-project]").forEach((btn) => {
      btn.addEventListener("click", () => editProject(data.find((x) => x.id === btn.dataset.editProject)));
    });
    list.querySelectorAll("[data-delete-project]").forEach((btn) => {
      btn.addEventListener("click", () => deleteProject(btn.dataset.deleteProject));
    });
  }

  function editProject(p) {
    if (!p) return;
    editingProjectId = p.id;
    editingProjectMedia = p.media_url;
    document.getElementById("project-id").value = p.id;
    document.getElementById("project-title-fr").value = p.title_fr || "";
    document.getElementById("project-title-en").value = p.title_en || "";
    document.getElementById("project-desc-fr").value = p.desc_fr || "";
    document.getElementById("project-desc-en").value = p.desc_en || "";
    document.getElementById("project-contact").value = p.contact || "";
    document.getElementById("project-order").value = p.sort_order || 0;
    document.getElementById("project-current-media").textContent = p.media_url
      ? "Média actuel : " + p.media_url + " (laisse vide pour conserver)"
      : "";
    document.getElementById("project-submit").textContent = "Mettre à jour";
    show(document.getElementById("project-cancel"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteProject(id) {
    if (!confirm("Supprimer ce projet ?")) return;
    const client = db();
    const { error } = await client.from("projects").delete().eq("id", id);
    if (error) alert(error.message);
    else loadProjects();
  }

  function initProjects() {
    loadProjects();
    document.getElementById("project-cancel").addEventListener("click", resetProjectForm);

    document.getElementById("project-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = document.getElementById("project-status");
      const fileInput = document.getElementById("project-file");
      const file = fileInput.files[0];

      const payload = {
        title_fr: document.getElementById("project-title-fr").value.trim(),
        title_en: document.getElementById("project-title-en").value.trim(),
        desc_fr: document.getElementById("project-desc-fr").value.trim(),
        desc_en: document.getElementById("project-desc-en").value.trim(),
        contact: document.getElementById("project-contact").value.trim(),
        sort_order: parseInt(document.getElementById("project-order").value, 10) || 0
      };

      if (!payload.title_fr) {
        setStatus(status, "Le titre FR est obligatoire.", "error");
        return;
      }

      setStatus(status, "Enregistrement…", "info");
      showProgress("project-progress", true);

      try {
        let mediaPath = editingProjectMedia;
        let mediaType = "video";

        if (file) {
          mediaPath = await uploadFile(file, "projects");
          mediaType = file.type.startsWith("video/") ? "video" : "image";
        }

        if (!editingProjectId && !mediaPath) {
          setStatus(status, "Ajoute une vidéo ou une photo pour le nouveau projet.", "error");
          showProgress("project-progress", false);
          return;
        }

        if (mediaPath) {
          payload.media_url = mediaPath;
          payload.media_type = mediaType;
        }

        const client = db();
        if (editingProjectId) {
          const { error } = await client.from("projects").update(payload).eq("id", editingProjectId);
          if (error) throw error;
        } else {
          const { error } = await client.from("projects").insert(payload);
          if (error) throw error;
        }

        resetProjectForm();
        fileInput.value = "";
        setStatus(status, "Projet enregistré avec succès.", "success");
        loadProjects();
      } catch (err) {
        setStatus(status, err.message || "Erreur lors de l'enregistrement.", "error");
      } finally {
        showProgress("project-progress", false);
      }
    });
  }

  /* ── Gallery ── */
  async function loadGallery() {
    const list = document.getElementById("gallery-list");
    const client = db();
    const { data, error } = await client
      .from("gallery")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      list.innerHTML = '<p class="admin-empty">Erreur de chargement.</p>';
      return;
    }

    if (!data || !data.length) {
      list.innerHTML = '<p class="admin-empty">Aucune photo dans la galerie.</p>';
      return;
    }

    list.innerHTML = data.map((g) => {
      const url = mediaUrl(g.image_url);
      return (
        '<figure class="admin-gallery-item">' +
          '<img src="' + url + '" alt="' + escapeHtml(g.title || "") + '">' +
          '<button type="button" class="admin-icon-btn is-danger" data-delete-gallery="' + g.id + '">×</button>' +
        '</figure>'
      );
    }).join("");

    list.querySelectorAll("[data-delete-gallery]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Supprimer cette photo ?")) return;
        const { error } = await client.from("gallery").delete().eq("id", btn.dataset.deleteGallery);
        if (error) alert(error.message);
        else loadGallery();
      });
    });
  }

  function initGallery() {
    loadGallery();

    document.getElementById("gallery-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = document.getElementById("gallery-status");
      const file = document.getElementById("gallery-file").files[0];
      if (!file) {
        setStatus(status, "Choisis une photo.", "error");
        return;
      }

      setStatus(status, "Upload…", "info");
      showProgress("gallery-progress", true);

      try {
        const path = await uploadFile(file, "gallery");
        const { error } = await db().from("gallery").insert({
          title: document.getElementById("gallery-title").value.trim(),
          image_url: path,
          sort_order: Date.now()
        });
        if (error) throw error;
        document.getElementById("gallery-form").reset();
        setStatus(status, "Photo ajoutée.", "success");
        loadGallery();
      } catch (err) {
        setStatus(status, err.message || "Erreur.", "error");
      } finally {
        showProgress("gallery-progress", false);
      }
    });
  }

  /* ── Site content ── */
  async function loadContentFields() {
    const container = document.getElementById("content-fields");
    const client = db();
    const { data } = await client.from("site_content").select("*");
    const map = {};
    (data || []).forEach((row) => { map[row.key] = row; });

    container.innerHTML = EDITABLE_KEYS.map((item) => {
      const row = map[item.key] || {};
      return (
        '<fieldset class="admin-content-group">' +
          '<legend>' + escapeHtml(item.label) + ' <code>' + item.key + '</code></legend>' +
          '<div class="admin-grid-2">' +
            '<div class="admin-field"><label>Français</label>' +
              '<textarea data-content-key="' + item.key + '" data-lang="fr" rows="2">' +
                escapeHtml(row.value_fr || "") + '</textarea></div>' +
            '<div class="admin-field"><label>English</label>' +
              '<textarea data-content-key="' + item.key + '" data-lang="en" rows="2">' +
                escapeHtml(row.value_en || "") + '</textarea></div>' +
          '</div>' +
        '</fieldset>'
      );
    }).join("");
  }

  function initContent() {
    loadContentFields();

    document.getElementById("content-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = document.getElementById("content-status");
      setStatus(status, "Enregistrement…", "info");

      const rows = {};
      document.querySelectorAll("[data-content-key]").forEach((el) => {
        const key = el.dataset.contentKey;
        const lang = el.dataset.lang;
        if (!rows[key]) rows[key] = { key, value_fr: "", value_en: "", updated_at: new Date().toISOString() };
        rows[key]["value_" + lang] = el.value.trim();
      });

      try {
        const client = db();
        const { error } = await client.from("site_content").upsert(Object.values(rows));
        if (error) throw error;
        setStatus(status, "Textes enregistrés. Recharge le site public pour voir les changements.", "success");
      } catch (err) {
        setStatus(status, err.message || "Erreur.", "error");
      }
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  document.addEventListener("DOMContentLoaded", initAuth);
})();

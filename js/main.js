/* js/main.js */
function toggleMobileMenu() {
  const nav = document.querySelector(".main-nav");
  const toggle = document.querySelector(".menu-toggle");
  if (!nav || !toggle) return;
  const isOpen = nav.classList.toggle("is-open");
  toggle.classList.toggle("is-open", isOpen);
  toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initActiveNav() {
  const page = document.body.dataset.page;
  if (!page) return;
  document.querySelectorAll(".nav-link").forEach((link) => {
    if (link.dataset.nav === page) link.classList.add("is-active");
  });
}

function initCopyrightYear() {
  const el = document.getElementById("copyright-year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function initFadeInObserver() {
  const items = document.querySelectorAll(".fade-in");
  if (!items.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach((el) => observer.observe(el));
}

function initProjectVideos() {
  const triggers = document.querySelectorAll(".project-media[data-video]");
  if (!triggers.length) return;

  const lightbox = document.getElementById("video-lightbox");
  const player = document.getElementById("video-lightbox-player");
  const titleEl = document.getElementById("video-lightbox-title");
  let lastFocused = null;

  triggers.forEach((trigger) => {
    const preview = trigger.querySelector(".project-video");

    if (preview) {
      trigger.addEventListener("mouseenter", () => {
        const playPromise = preview.play();
        if (playPromise && playPromise.catch) playPromise.catch(() => {});
      });
      trigger.addEventListener("mouseleave", () => {
        preview.pause();
        preview.currentTime = 0.5;
      });
    }

    trigger.addEventListener("click", () => {
      if (!lightbox || !player) return;
      const src = trigger.getAttribute("data-video");
      const titleKey = trigger.getAttribute("data-title-key");
      const dict = window.translations && window.getLanguage ? window.translations[window.getLanguage()] : null;
      if (titleEl) titleEl.textContent = dict && titleKey && dict[titleKey] ? dict[titleKey] : "";
      player.src = src;
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      lastFocused = document.activeElement;
      const playPromise = player.play();
      if (playPromise && playPromise.catch) playPromise.catch(() => {});
    });
  });

  function closeLightbox() {
    if (!lightbox || !player) return;
    player.pause();
    player.removeAttribute("src");
    player.load();
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  if (lightbox) {
    lightbox.querySelectorAll("[data-close]").forEach((el) => {
      el.addEventListener("click", closeLightbox);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }
}

function initMain() {
  const toggle = document.querySelector(".menu-toggle");
  if (toggle) toggle.addEventListener("click", toggleMobileMenu);
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      const nav = document.querySelector(".main-nav");
      const btn = document.querySelector(".menu-toggle");
      if (nav && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        if (btn) {
          btn.classList.remove("is-open");
          btn.setAttribute("aria-expanded", "false");
        }
      }
    });
  });
  initHeaderScroll();
  initActiveNav();
  initCopyrightYear();
  initFadeInObserver();
  initProjectVideos();
  document.addEventListener("sostech:projects-rendered", initProjectVideos);
}

document.addEventListener("DOMContentLoaded", initMain);

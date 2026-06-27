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
}

document.addEventListener("DOMContentLoaded", initMain);

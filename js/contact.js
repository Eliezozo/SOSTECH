/* js/contact.js */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s+\-()]{7,20}$/;

function getDict() {
  const lang = typeof getLanguage === "function" ? getLanguage() : "en";
  return (window.translations && window.translations[lang]) || {};
}

function showError(inputId, errorId, visible) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.classList.toggle("is-invalid", visible);
  if (error) error.classList.toggle("is-visible", visible);
}

function setFormStatus(state, message) {
  const status = document.getElementById("form-status");
  if (!status) return;
  status.className = "form-status";
  if (state) status.classList.add("form-status--" + state);
  status.classList.toggle("is-visible", Boolean(message));
  status.textContent = message || "";
}

function validateContactForm() {
  let valid = true;

  const nameVal = (document.getElementById("contact-name")?.value || "").trim();
  const emailVal = (document.getElementById("contact-email")?.value || "").trim();
  const phoneVal = (document.getElementById("contact-phone")?.value || "").trim();
  const messageVal = (document.getElementById("contact-message")?.value || "").trim();

  const nameOk = nameVal.length >= 2;
  showError("contact-name", "error-name", !nameOk);
  if (!nameOk) valid = false;

  const emailOk = EMAIL_RE.test(emailVal);
  showError("contact-email", "error-email", !emailOk);
  if (!emailOk) valid = false;

  const phoneOk = PHONE_RE.test(phoneVal);
  showError("contact-phone", "error-phone", !phoneOk);
  if (!phoneOk) valid = false;

  const messageOk = messageVal.length >= 10;
  showError("contact-message", "error-message", !messageOk);
  if (!messageOk) valid = false;

  return valid;
}

function isEmailJsConfigured() {
  const cfg = window.EMAILJS_CONFIG;
  return (
    typeof emailjs !== "undefined" &&
    cfg &&
    cfg.publicKey && cfg.publicKey !== "YOUR_PUBLIC_KEY" &&
    cfg.serviceId && cfg.serviceId !== "YOUR_SERVICE_ID" &&
    cfg.templateId && cfg.templateId !== "YOUR_TEMPLATE_ID"
  );
}

function fallbackMailto() {
  const nameVal = (document.getElementById("contact-name")?.value || "").trim();
  const emailVal = (document.getElementById("contact-email")?.value || "").trim();
  const phoneVal = (document.getElementById("contact-phone")?.value || "").trim();
  const messageVal = (document.getElementById("contact-message")?.value || "").trim();
  const subject = encodeURIComponent("Sostech Systems — Website inquiry from " + nameVal);
  const body = encodeURIComponent(
    "Name: " + nameVal + "\nEmail: " + emailVal + "\nPhone: " + phoneVal + "\n\n" + messageVal
  );
  window.location.href = "mailto:sostechgh@aol.com?subject=" + subject + "&body=" + body;
}

function submitContactForm(form) {
  const dict = getDict();
  const button = form.querySelector('button[type="submit"]');
  const originalLabel = button ? button.textContent : "";

  if (!isEmailJsConfigured()) {
    setFormStatus("info", dict["contact.status.fallback"] || "Opening your email app…");
    fallbackMailto();
    return;
  }

  const cfg = window.EMAILJS_CONFIG;
  if (button) {
    button.disabled = true;
    button.textContent = dict["contact.status.sending"] || "Sending…";
  }
  setFormStatus("", "");

  emailjs
    .sendForm(cfg.serviceId, cfg.templateId, form)
    .then(() => {
      setFormStatus("success", dict["contact.status.success"] || "Thank you! Your message has been sent.");
      form.reset();
    })
    .catch(() => {
      setFormStatus("error", dict["contact.status.error"] || "Sorry, something went wrong. Please try again or call us.");
    })
    .finally(() => {
      if (button) {
        button.disabled = false;
        button.textContent = originalLabel || dict["contact.form.submit"] || "Send Message";
      }
    });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  if (window.EMAILJS_CONFIG && typeof emailjs !== "undefined" && window.EMAILJS_CONFIG.publicKey) {
    try {
      emailjs.init({ publicKey: window.EMAILJS_CONFIG.publicKey });
    } catch (e) {
      /* older SDK signature */
      try { emailjs.init(window.EMAILJS_CONFIG.publicKey); } catch (err) {}
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    setFormStatus("", "");
    if (!validateContactForm()) return;
    submitContactForm(form);
  });
}

document.addEventListener("DOMContentLoaded", initContactForm);

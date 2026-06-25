/* js/contact.js */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s+\-()]{7,20}$/;

function showError(inputId, errorId, visible) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.classList.toggle("is-invalid", visible);
  if (error) error.classList.toggle("is-visible", visible);
}

function validateContactForm() {
  const lang = typeof getLanguage === "function" ? getLanguage() : "en";
  const dict = (window.translations && window.translations[lang]) || {};
  let valid = true;

  const name = document.getElementById("contact-name");
  const email = document.getElementById("contact-email");
  const phone = document.getElementById("contact-phone");
  const message = document.getElementById("contact-message");

  const nameVal = (name && name.value.trim()) || "";
  const emailVal = (email && email.value.trim()) || "";
  const phoneVal = (phone && phone.value.trim()) || "";
  const messageVal = (message && message.value.trim()) || "";

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

  if (!valid) return false;

  const subject = encodeURIComponent("Sostech Systems — Website inquiry from " + nameVal);
  const body = encodeURIComponent(
    "Name: " + nameVal + "\nEmail: " + emailVal + "\nPhone: " + phoneVal + "\n\n" + messageVal
  );
  window.location.href = "mailto:sostechgh@aol.com?subject=" + subject + "&body=" + body;
  return false;
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    validateContactForm();
  });
}

document.addEventListener("DOMContentLoaded", initContactForm);

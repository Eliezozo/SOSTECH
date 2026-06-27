/* js/lang-bootstrap.js — restore language before paint (URL param > storage > browser) */
(function () {
  var KEY = "sostech-lang";

  function readCookie() {
    var match = document.cookie.match(/(?:^|;\s*)sostech-lang=(en|fr)(?:;|$)/);
    return match ? match[1] : null;
  }

  function readStorage() {
    var lang = null;
    try {
      lang = localStorage.getItem(KEY);
    } catch (e) {}
    if (lang !== "en" && lang !== "fr") {
      try {
        lang = sessionStorage.getItem(KEY);
      } catch (e) {}
    }
    if (lang !== "en" && lang !== "fr") {
      lang = readCookie();
    }
    return lang === "en" || lang === "fr" ? lang : null;
  }

  function persist(lang) {
    try {
      localStorage.setItem(KEY, lang);
    } catch (e) {}
    try {
      sessionStorage.setItem(KEY, lang);
    } catch (e) {}
    document.cookie = KEY + "=" + lang + ";path=/;max-age=31536000;SameSite=Lax";
  }

  var lang = null;
  try {
    var params = new URLSearchParams(window.location.search);
    var urlLang = params.get("lang");
    if (urlLang === "en" || urlLang === "fr") lang = urlLang;
  } catch (e) {}

  if (!lang) lang = readStorage();

  if (!lang) {
    var browser = (navigator.language || navigator.userLanguage || "en").toLowerCase();
    lang = browser.indexOf("fr") === 0 ? "fr" : "en";
  }

  persist(lang);
  document.documentElement.lang = lang;
})();

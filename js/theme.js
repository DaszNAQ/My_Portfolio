import { translations } from './i18n.js';

export const state = {
  currentLang: localStorage.getItem("portfolio-lang") || "en",
  currentTheme: localStorage.getItem("portfolio-theme") || "dark"
};

export function applyLanguage(lang) {
  state.currentLang = lang;
  localStorage.setItem("portfolio-lang", lang);
  const dict = translations[lang];

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] && !Array.isArray(dict[key])) {
      el.textContent = dict[key];
    }
  });
  document.dispatchEvent(new CustomEvent('languageChanged'));
  const container = document.getElementById("softSkillsContainer");
  if (container) {
    container.innerHTML = "";
    (dict.skills_soft_list || []).forEach(skill => {
      const pill = document.createElement("span");
      pill.className = "skill-pill";
      pill.textContent = skill;
      container.appendChild(pill);
    });
  }

  const langBtn = document.getElementById("langToggle");
  if (langBtn) langBtn.textContent = lang === "en" ? "EN" : "VI";
  document.documentElement.lang = lang;
}

export function applyTheme(theme) {
  state.currentTheme = theme;
  localStorage.setItem("portfolio-theme", theme);
  const html = document.documentElement;
  html.classList.toggle("dark", theme === "dark");
  html.classList.toggle("light", theme === "light");
}

export function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        entry.target.querySelectorAll(".progress-bar").forEach(bar => {
          bar.style.width = bar.getAttribute("data-progress") + "%";
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  // Xử lý các thanh tiến độ đã nằm trong vùng nhìn thấy khi load trang
  setTimeout(() => {
    document.querySelectorAll(".reveal.revealed .progress-bar").forEach(bar => {
      bar.style.width = bar.getAttribute("data-progress") + "%";
    });
  }, 200);
}
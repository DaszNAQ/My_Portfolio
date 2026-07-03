    import { state } from './theme.js';
import { translations } from './i18n.js';

export function initNavbar() {
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    navbar.style.boxShadow = window.scrollY > 20 ? "0 4px 30px rgba(0,0,0,0.4)" : "none";
    let current = "";
    sections.forEach(sec => {
      if (window.scrollY >= (sec.offsetTop - 100)) current = sec.id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute("href").replace("#", "");
      link.classList.toggle("active", href === current);
    });
  });

  document.getElementById("mobileMenuBtn")?.addEventListener("click", () => {
    document.getElementById("mobileMenu").classList.toggle("hidden");
  });
}

export function initSmoothScroll() {
  document.querySelectorAll(".scroll-link").forEach(link => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href?.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        const navH = document.getElementById("navbar").offsetHeight;
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
          window.scrollTo({ top, behavior: "smooth" });
        }
        document.getElementById("mobileMenu").classList.add("hidden");
      }
    });
  });
}

export function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const setError = (input, errorEl, show) => {
    input.classList.toggle("error", show);
    errorEl.classList.toggle("hidden", !show);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("contactName");
    const email = document.getElementById("contactEmail");
    const msg = document.getElementById("contactMessage");

    const nameOk = name.value.trim().length >= 2;
    const emailOk = validateEmail(email.value.trim());
    const msgOk = msg.value.trim().length >= 10;

    setError(name, document.getElementById("nameError"), !nameOk);
    setError(email, document.getElementById("emailError"), !emailOk);
    setError(msg, document.getElementById("messageError"), !msgOk);

    if (nameOk && emailOk && msgOk) {
      const toast = document.getElementById("successToast");
      toast.textContent = translations[state.currentLang].contact_success;
      toast.classList.remove("hidden");
      form.reset();
      setTimeout(() => toast.classList.add("hidden"), 5000);
    }
  });
}
import { state, applyTheme, applyLanguage, initScrollReveal } from './theme.js';
import { initNavbar, initSmoothScroll, initContactForm } from './interactions.js';
import { initProjectsCarousel } from './projects.js';
// Hàm nạp Component (Giống như cách React nạp các Component con)
async function renderComponent(id, filePath) {
  const container = document.getElementById(id);
  if (!container) return;
  try {
    const response = await fetch(filePath);
    container.innerHTML = await response.text();
  } catch (err) {
    console.error(`Không thể nạp ${filePath}:`, err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // Nạp tất cả giao diện trước
  await Promise.all([
    renderComponent('nav-root', './components/navbar.html'),
    renderComponent('hero-root', './components/hero.html'),
    renderComponent('about-root', './components/about.html'),
    renderComponent('skills-root', './components/skills.html'),
    renderComponent('projects-root', './components/projects.html'),
    renderComponent('experience-root', './components/experience.html'),
    renderComponent('contact-root', './components/contact.html'),
    renderComponent('footer-root', './components/footer.html')
  ]);

  // Sau khi giao diện đã có trên DOM, mới kích hoạt Logic
  applyTheme(state.currentTheme);
  applyLanguage(state.currentLang);

  // Khởi tạo các sự kiện Click cho nút chuyển Theme/Lang
  document.getElementById("themeToggle")?.addEventListener("click", () => {
    applyTheme(state.currentTheme === "dark" ? "light" : "dark");
  });
  document.getElementById("langToggle")?.addEventListener("click", () => {
    applyLanguage(state.currentLang === "en" ? "vi" : "en");
  });

  // Kích hoạt các chức năng UI
  initNavbar();
  initSmoothScroll();
  initContactForm();
  initScrollReveal();
  initProjectsCarousel();

  if (window.lucide) window.lucide.createIcons();
});
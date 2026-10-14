import { state, applyTheme, applyLanguage, initScrollReveal } from "./theme.js";
import { initNavbar, initSmoothScroll, initContactForm} from "./interactions.js";

import { initProjectsCarousel } from "./projects.js";
import { initHeroBackground } from "./hero-bg.js";

// Danh sách các component HTML cần tải.
const COMPONENTS = [
  { id: "nav-root", filePath: "./components/navbar.html" },
  { id: "hero-root", filePath: "./components/hero.html" },
  { id: "about-root", filePath: "./components/about.html" },
  { id: "skills-root", filePath: "./components/skills.html" },
  { id: "projects-root", filePath: "./components/projects.html" },
  { id: "experience-root", filePath: "./components/experience.html" },
  { id: "contact-root", filePath: "./components/contact.html" },
  { id: "footer-root", filePath: "./components/footer.html" },
];

// Tải một component HTML và chèn vào container tương ứng.
async function renderComponent(id, filePath) {
  const container = document.getElementById(id);

  if (!container) {
    throw new Error(`Không tìm thấy container #${id} trong index.html`);
  }

  try {
    const response = await fetch(filePath);

    // fetch() không tự reject khi server trả về HTTP 404/500.
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    if (!html.trim()) {
      throw new Error("File component rỗng");
    }

    container.innerHTML = html;
  } catch (error) {
    throw new Error(`Không thể nạp ${filePath} vào #${id}: ${error.message}`);
  }
}

// Hiển thị thông báo khi component không tải được.
function showComponentLoadError(failedPaths) {
  console.error("Portfolio chưa khởi tạo đầy đủ:", failedPaths);

  // Tránh tạo nhiều banner trùng lặp.
  if (document.getElementById("component-load-error")) {
    return;
  }

  const banner = document.createElement("div");

  banner.id = "component-load-error";
  banner.setAttribute("role", "alert");

  banner.textContent =
    "Một số phần của portfolio không tải được. " +
    "Mở Console (F12) để xem chi tiết.";

  banner.style.cssText = [
    "position:fixed",
    "top:12px",
    "left:12px",
    "right:12px",
    "z-index:99999",
    "padding:12px 16px",
    "border:1px solid #ef4444",
    "border-radius:8px",
    "background:#450a0a",
    "color:#fff",
    "font:14px/1.5 system-ui,sans-serif",
  ].join(";");

  document.body.prepend(banner);
}

// Tải tất cả component và thu thập những component gặp lỗi.
async function loadComponents() {
  const results = await Promise.allSettled(
    COMPONENTS.map(({ id, filePath }) => renderComponent(id, filePath)),
  );

  const failures = results
    .map((result, index) => ({
      result,
      component: COMPONENTS[index],
    }))
    .filter(({ result }) => result.status === "rejected");

  if (failures.length > 0) {
    failures.forEach(({ result, component }) => {
      console.error(`[Component loader] ${component.filePath}`, result.reason);
    });

    showComponentLoadError(failures.map(({ component }) => component.filePath));

    return false;
  }

  return true;
}

// Khởi tạo website sau khi DOM được tải.
document.addEventListener("DOMContentLoaded", async () => {
  const componentsLoaded = await loadComponents();

  // Không khởi tạo ứng dụng nếu thiếu component bắt buộc.
  if (!componentsLoaded) {
    return;
  }

  // Áp dụng theme và ngôn ngữ sau khi component đã được tải.
  applyTheme(state.currentTheme);
  applyLanguage(state.currentLang);

  // Sự kiện chuyển đổi theme.
  document.getElementById("themeToggle")?.addEventListener("click", () => {
    applyTheme(state.currentTheme === "dark" ? "light" : "dark");
  });

  // Sự kiện chuyển đổi ngôn ngữ.
  document.getElementById("langToggle")?.addEventListener("click", () => {
    applyLanguage(state.currentLang === "en" ? "vi" : "en");
  });

  // Khởi tạo các chức năng UI.
  initNavbar();
  initSmoothScroll();
  initContactForm();
  initScrollReveal();
  initProjectsCarousel();
  initHeroBackground();

  // Khởi tạo icon sau khi các component đã được chèn vào DOM.
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

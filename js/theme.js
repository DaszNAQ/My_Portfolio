
import { translations } from './i18n.js';

const VALID_LANGUAGES = ['en', 'vi'];
const VALID_THEMES = ['dark', 'light'];

// Đọc tùy chọn an toàn và kiểm tra giá trị hợp lệ.
function readPreference(key, validValues, fallback) {
  try {
    const value = localStorage.getItem(key);

    return validValues.includes(value)
      ? value
      : fallback;
  } catch (error) {
    console.warn(
      `Không thể đọc "${key}" từ localStorage:`,
      error
    );

    return fallback;
  }
}

// Lưu tùy chọn mà không làm gián đoạn website nếu thất bại.
function savePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(
      `Không thể lưu "${key}" vào localStorage:`,
      error
    );
  }
}

// Trạng thái mặc định được kiểm tra ngay khi khởi tạo module.
export const state = {
  currentLang: readPreference(
    'portfolio-lang',
    VALID_LANGUAGES,
    'en'
  ),

  currentTheme: readPreference(
    'portfolio-theme',
    VALID_THEMES,
    'dark'
  )
};

// Áp dụng ngôn ngữ cho nội dung trên trang.
export function applyLanguage(lang) {
  const safeLang = VALID_LANGUAGES.includes(lang)
    ? lang
    : 'en';

  // Chỉ lưu và sử dụng ngôn ngữ hợp lệ.
  state.currentLang = safeLang;
  savePreference('portfolio-lang', safeLang);

  const dict = translations[safeLang];

  // Dịch những phần tử tĩnh có data-i18n.
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');

    if (
      Object.prototype.hasOwnProperty.call(dict, key) &&
      typeof dict[key] === 'string'
    ) {
      el.textContent = dict[key];
    }
  });

  // Cập nhật danh sách kỹ năng mềm.
  const container = document.getElementById(
    'softSkillsContainer'
  );

  if (container) {
    container.replaceChildren();

    const skills = Array.isArray(dict.skills_soft_list)
      ? dict.skills_soft_list
      : [];

    skills.forEach(skill => {
      const pill = document.createElement('span');

      pill.className = 'skill-pill';
      pill.textContent = skill;

      container.appendChild(pill);
    });
  }

  // Cập nhật nút chuyển ngôn ngữ.
  const langBtn = document.getElementById('langToggle');

  if (langBtn) {
    langBtn.textContent = safeLang === 'en' ? 'EN' : 'VI';
  }

  // Đồng bộ ngôn ngữ với tài liệu HTML.
  document.documentElement.lang = safeLang;

  // Thông báo cho carousel và các module cần cập nhật bản dịch.
  document.dispatchEvent(
    new CustomEvent('languageChanged')
  );
}

// Áp dụng theme sáng/tối.
export function applyTheme(theme) {
  const safeTheme = VALID_THEMES.includes(theme)
    ? theme
    : 'dark';

  state.currentTheme = safeTheme;
  savePreference('portfolio-theme', safeTheme);

  const html = document.documentElement;

  html.classList.toggle(
    'dark',
    safeTheme === 'dark'
  );

  html.classList.toggle(
    'light',
    safeTheme === 'light'
  );
}

// Giữ nguyên chức năng scroll reveal hiện có.
export function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        entry.target
          .querySelectorAll('.progress-bar')
          .forEach(bar => {
            bar.style.width =
              bar.getAttribute('data-progress') + '%';
          });

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });

  // Xử lý các thanh tiến độ đã ở trong vùng nhìn thấy khi tải trang.
  setTimeout(() => {
    document
      .querySelectorAll('.reveal.revealed .progress-bar')
      .forEach(bar => {
        bar.style.width =
          bar.getAttribute('data-progress') + '%';
      });
  }, 200);
}

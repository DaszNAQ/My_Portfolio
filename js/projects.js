// js/projects.js
import { translations } from './i18n.js';
import { createProjectCard } from './projects-card.js';

export function initProjectsCarousel() {
  const track = document.getElementById('projects-track');
  let currentIndex = 0;
  let isMobile = window.innerWidth < 768;

  // Detect resize
  window.addEventListener('resize', () => {
    const newIsMobile = window.innerWidth < 768;
    if (newIsMobile !== isMobile) {
      isMobile = newIsMobile;
      renderProjects();
    }
  });

    function getProjectsData() {
    const lang = window.currentLang || localStorage.getItem("portfolio-lang") || "en";
    const dict = translations[lang] || translations.en;

    return [
      {
        title: dict.projects_1_title,
        desc: dict.projects_1_desc,
        tech: ["React", "Node.js", "PostgreSQL"],
        image: "./img/p1.jpg",
        imageMobile: "./img/avt.jpg",        
        demoLink: "#",
        githubLink: "https://github.com/DaszNAQ/MemoriesWithFriends",
        time: "01/2025 - 06/2026"
      },
      {
        title: dict.projects_2_title,
        desc: dict.projects_2_desc,
        tech: ["React", "Tailwind CSS", "Vite"],
        image: "./img/p2.jpg",
        imageMobile: "./img/avt.jpg",
        demoLink: "#",
        githubLink: "https://github.com/DaszNAQ/Project_CoVayVN",
        time: "02/2025 - 07/2026"
      },
      {
        title: dict.projects_3_title,
        desc: dict.projects_3_desc,
        tech: ["Figma", "HTML", "CSS"],
        image: "./img/p3.jpg",
        imageMobile: "./img/avt.jpg",
        demoLink: "#",
        githubLink: "https://github.com/DaszNAQ/TTTN_Laravel",
        time: "03/2025 - 08/2026"
      },
      {
        title: dict.projects_4_title,
        desc: dict.projects_4_desc,
        tech: ["React", "Tailwind CSS", "Vite"],
        image: "./img/avt.jpg",
        imageMobile: "./img/p1.jpg",
        demoLink: "#",
        githubLink: "https://github.com/DaszNAQ/Project_CoVayVN",
        time: "02/2025 - 07/2026"
      }
      
    ];
  }

  function renderProjects() {
    if (!track) return;
    const projectsData = getProjectsData();

    track.innerHTML = '';

    const project = projectsData[currentIndex];
    const card = createProjectCard(project, isMobile);

        track.appendChild(card);

    // Áp dụng translation
    applyDynamicTranslations();
  }

  function applyDynamicTranslations() {
    const lang = window.currentLang || localStorage.getItem("portfolio-lang") || "en";
    const dict = translations[lang] || translations.en;

    document.querySelectorAll("#projects-track [data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });
  }

  // Navigation
  document.getElementById('prev-btn')?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + 4) % 4;
    renderProjects();
  });

  document.getElementById('next-btn')?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % 4;
    renderProjects();
  });

  // Language support
  document.addEventListener('languageChanged', renderProjects);

  renderProjects();
}

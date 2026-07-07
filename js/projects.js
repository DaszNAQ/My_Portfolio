// js/projects.js
import { translations } from './i18n.js';

export function initProjectsCarousel() {
  const track = document.getElementById('projects-track');
  let currentIndex = 0;

  function getProjectsData() {
    const lang = window.currentLang || localStorage.getItem("portfolio-lang") || "en";
    const dict = translations[lang] || translations.en;

    return [
      {
        title: dict.projects_1_title,
        desc: dict.projects_1_desc,
        tech: ["React", "Node.js", "PostgreSQL"],
        image: "../img/p_test.jpg",
        demoLink: "#",
        githubLink: "https://github.com/DaszNAQ/MemoriesWithFriends",
        time: "01/2025 - 06/2026"
      },
      {
        title: dict.projects_2_title,
        desc: dict.projects_2_desc,
        tech: ["React", "Tailwind CSS", "Vite"],
        image: "../img/p2.png",
        demoLink: "#",
        githubLink: "https://github.com/DaszNAQ/Project_CoVayVN",
        time: "02/2025 - 07/2026"
      },
      {
        title: dict.projects_3_title,
        desc: dict.projects_3_desc,
        tech: ["Figma", "HTML", "CSS"],
        image: "../img/p3.png",
        demoLink: "#",
        githubLink: "https://github.com/DaszNAQ/TTTN_Laravel",
        time: "03/2025 - 08/2026"
      }
    ];
  }

  function renderProjects() {
    if (!track) return;
    const projectsData = getProjectsData();

    track.innerHTML = '';

    const project = projectsData[currentIndex];

    const card = document.createElement('div');
    card.className = `project-card w-full max-w-[920px] mx-auto transition-all duration-700`;

    card.innerHTML = `
      <div class="glass-card rounded-3xl overflow-hidden h-[480px] md:h-[560px] relative group">
        <img src="${project.image}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="${project.title}">
        <div class="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-black/70"></div>
        
        <!-- Content - Góc trên bên phải -->
        <div class="absolute top-8 right-8 md:top-12 md:right-12 max-w-xs text-right z-10">
          <h3 class="text-3xl md:text-4xl font-bold text-white mb-3">${project.title}</h3>
          <p class="text-primary/80 text-sm font-medium mb-6">${project.time}</p>
          <p class="text-white/90 text-lg leading-relaxed">${project.desc}</p>
        </div>
        
        <!-- Bottom bar -->
        <div class="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10 bg-linear-to-t from-black/90 to-transparent">
          <div class="flex flex-wrap gap-2 mb-8">
            ${project.tech.map(t => `<span class="tech-tag text-sm px-4 py-1.5 bg-white/10 backdrop-blur-sm">${t}</span>`).join('')}
          </div>
          
          <div class="flex gap-4">
            <a href="${project.demoLink}" target="_blank" 
               class="project-btn flex-1 py-4 text-base font-medium bg-white/10 hover:bg-white/25 transition-all"
               data-i18n="projects_view">
              View Project
            </a>
            
            <a href="${project.githubLink}" target="_blank" rel="noopener noreferrer"
               class="project-btn flex items-center justify-center gap-1 px-8 py-4 text-base border border-white/50 hover:bg-white/10">
              <i class="fa-brands fa-github"></i>
              GitHub
            </a>
          </div>
        </div>
      </div>
    `;

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
    currentIndex = (currentIndex - 1 + 3) % 3;
    renderProjects();
  });

  document.getElementById('next-btn')?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % 3;
    renderProjects();
  });

  // Language support
  document.addEventListener('languageChanged', renderProjects);

  renderProjects();
}
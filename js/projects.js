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
        image: "../img/p1.png",
        demoLink: "#",           // Thay bằng link demo thật
        githubLink: "https://github.com/DaszNAQ/MemoriesWithFriends"
      },
      {
        title: dict.projects_2_title,
        desc: dict.projects_2_desc,
        tech: ["React", "Tailwind CSS", "Vite"],
        image: "../img/p2.png",
        demoLink: "#",           // Thay bằng link demo thật
        githubLink: "https://github.com/DaszNAQ/Project_CoVayVN"
      },
      {
        title: dict.projects_3_title,
        desc: dict.projects_3_desc,
        tech: ["Figma", "HTML", "CSS"],
        image: "../img/p3.png",
        demoLink: "#",           // Thay bằng link demo thật
        githubLink: "https://github.com/DaszNAQ/TTTN_Laravel"
      }
    ];
  }

    function renderProjects() {
    if (!track) return;
    const projectsData = getProjectsData();

    // Fade out nhẹ trước khi trượt
    track.style.transition = 'opacity 0.3s ease';
    track.style.opacity = '0';

    setTimeout(() => {
      track.innerHTML = '';

      for (let i = -1; i <= 1; i++) {
        const idx = (currentIndex + i + projectsData.length) % projectsData.length;
        const project = projectsData[idx];
        const isCenter = i === 0;

        const card = document.createElement('div');
        card.className = `project-card w-[260px] sm:w-[320px] md:w-[400px] lg:w-[460px] mx-3 sm:mx-5 transition-all duration-700 ease-out flex-shrink-0`;

        card.style.transform = `scale(${isCenter ? 1 : 0.78})`;
        card.style.opacity = isCenter ? '1' : '0.48';
        card.style.filter = isCenter ? 'blur(0px)' : 'blur(6px)';
        card.style.zIndex = isCenter ? '30' : '10';

        card.innerHTML = `
          <div class="glass-card rounded-3xl overflow-hidden h-[320px] sm:h-[390px] md:h-[440px] relative group">
            <img src="${project.image}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="${project.title}">
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
            
            <div class="absolute bottom-0 left-0 right-0 p-5 sm:p-7 md:p-8">
              <h3 class="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">${project.title}</h3>
              <p class="text-white/80 text-sm sm:text-base mb-4 line-clamp-3">${project.desc}</p>
              
              <div class="flex flex-wrap gap-2 mb-6">
                ${project.tech.map(t => `<span class="tech-tag text-xs sm:text-sm">${t}</span>`).join('')}
              </div>
              
              <div class="flex gap-3">
                <a href="${project.demoLink}" target="_blank" 
                   class="project-btn flex-1 py-3.5 text-sm sm:text-base font-medium bg-white/10 hover:bg-white/20 transition-all"
                   data-i18n="projects_view">
                  View Project
                </a>
                
                <a href="${project.githubLink}" target="_blank" rel="noopener noreferrer"
                   class="project-btn flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base border border-white/40 hover:bg-white/10">
                  <i class="fa-brands fa-github"></i>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        `;
        track.appendChild(card);
      }

      track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.6s ease';
      track.style.opacity = '1';

      applyLanguageAfterRender();
    }, 300);
  }
  // Hàm áp dụng translation cho nội dung động
  function applyLanguageAfterRender() {
    const dict = translations[window.currentLang || localStorage.getItem("portfolio-lang") || "en"];

    document.querySelectorAll("#projects-track [data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });
  }
  // Navigation buttons
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
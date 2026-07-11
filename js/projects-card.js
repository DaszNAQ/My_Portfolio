// js/project-card.js
export function createProjectCard(project, isMobile = false) {
  const card = document.createElement('div');
  card.className = `project-card transition-all duration-700 flex-shrink-0 ${isMobile ? 'w-full px-4' : 'w-full max-w-5xl mx-auto'}`;

  if (isMobile) {
    // Mobile layout - Đơn giản, gọn hơn
    card.innerHTML = `
      <div class="glass-card rounded-3xl overflow-hidden h-[380px] relative group">
        <img src="${project.imageMobile}" class="absolute inset-0 w-full h-full object-cover" alt="${project.title}">
        <div class="absolute inset-0 bg-linear-to-t from-black/90 to-black/40 text-center py-4">
        <h3 class="text-2xl font-bold text-white mb-2  [text-stroke:0.5px_black] [-webkit-text-stroke:0.5px_black]">${project.title}</h3>
        </div>
        
        <div class="absolute bottom-0 left-0 right-0 p-3">
          <div class="flex flex-wrap gap-2 mb-6">
            ${project.tech.map(t => `<span class="tech-tag text-white/80 text-xs bg-black/50">${t}</span>`).join('')}
          </div>
          
          <div class="flex gap-3">
            <a href="${project.demoLink}" target="_blank" class="project-btn flex-1 py-2 text-white text-sm bg-black/50" data-i18n="projects_view">View Project</a>
            <a href="${project.githubLink}" target="_blank" class="project-btn px-6 py-2 text-white text-sm bg-black/50 border border-white/40">
              <i class="fa-brands fa-github"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  } else {
    // Desktop layout - Banner rộng
    card.innerHTML = `
      <div class="glass-card rounded-3xl overflow-hidden h-[520px] relative group">
        <img src="${project.image}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="${project.title}">
        <div class="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-black/70"></div>
        
        <!-- Content góc trên bên trái -->
        <div class="absolute top-12 left-6 max-w-xs z-10  align-text-top text-center">
          <h3 class="text-3xl font-bold text-white mb-3 [text-stroke:1px_black] [-webkit-text-stroke:1px_black]">${project.title}</h3>
          <p class="text-primary/90 text-sm font-bold mb-6 text-shadow-transparent">${project.time}</p>
          <p class="text-white/95 leading-relaxed bg-black/10 text-justify">${project.desc}</p>
        </div>
        
        <!-- Bottom bar -->
        <div class="absolute bottom-0 left-0 right-0 p-6 z-10 bg-linear-to-t from-black/90 to-transparent">
          <div class="flex flex-wrap gap-2 mb-8">
            ${project.tech.map(t => `<span class="tech-tag text-sm px-4 py-1 text-primary bg-white/50 backdrop-blur-sm">${t}</span>`).join('')}
          </div>
          
          <div class="flex gap-4">
            <a href="${project.demoLink}" target="_blank" class="project-btn flex-1 py-2 text-primary text-lg font-bold bg-white/50 hover:bg-white/70 hover:text-black/85" data-i18n="projects_view">View Project</a>
            <a href="${project.githubLink}" target="_blank" class="project-btn flex items-center justify-center gap-3 px-12 py-4 text-primary bg-white/50 hover:bg-white/70 hover:text-black/85">
              <i class="fa-brands fa-github"></i> GitHub
            </a>
          </div>
        </div>
      </div>
    `;
  }

  return card;
}
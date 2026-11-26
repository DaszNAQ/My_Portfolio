// js/projects.js
import { translations } from "./i18n.js";
import { state } from "./theme.js";
import { createProjectCard } from "./projects-card.js";

export function initProjectsCarousel() {
  const carousel = document.getElementById("project-carousel");
  const track = document.getElementById("projects-track");
  const prevButton = document.getElementById("prev-btn");
  const nextButton = document.getElementById("next-btn");
  const dotsContainer = document.getElementById("project-dots");
  const status = document.getElementById("project-status");

  if (!carousel || !track) return;

  let currentIndex = 0; // Index of the real project shown to the user.
  let physicalIndex = 1; // Track slot: 0 = last clone, 1..N = real slides, N+1 = first clone.
  let isMobile = window.innerWidth < 768;
  let projectsData = [];
  let originalSlides = [];
  let isAnimating = false;
  let pendingSnapSlot = null;
  let transitionFallbackTimer = null;
  let suppressClickUntil = 0;
  let resizeFrame = null;
  let pointer = {
    active: false,
    dragging: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    deltaX: 0,
  };

  function getCurrentLanguage() {
  return translations[state.currentLang] || translations.en;
  }

  let projectsSource = [];

  async function loadProjects() {
    try {
      const response = await fetch("./data/projects.json", { cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      projectsSource = Array.isArray(json.projects)
        ? json.projects.filter((project) => project.visible !== false)
        : [];
    } catch (error) {
      console.error("Không thể tải data/projects.json:", error);
      projectsSource = [];
    }
  }

  // Giá trị có thể là chuỗi hoặc {en, vi}; thiếu ngôn ngữ thì dùng ngôn ngữ còn lại.
  function pickText(value) {
    if (value && typeof value === "object") {
      return value[state.currentLang] || value.en || value.vi || "";
    }
    return value || "";
  }

  // Admin lưu ảnh dạng "/img/projects/x.jpg"; đổi thành "./img/..." để chạy được cả
  // trên GitHub Pages (thư mục con /My_Portfolio/), Live Server và tên miền riêng.
  function resolvePath(path) {
    return typeof path === "string" && path.startsWith("/") && !path.startsWith("//")
      ? `.${path}`
      : path;
  }

  function getProjectsData() {
    return projectsSource.map((project) => ({
      title: pickText(project.title),
      desc: pickText(project.desc),
      tech: Array.isArray(project.tech) ? project.tech : [],
      image: resolvePath(project.image),
      imageMobile: resolvePath(project.imageMobile || project.image),
      demoLink: project.demoLink || "",
      githubLink: project.githubLink || "",
      time: project.time || "",
    }));
  }

  function updateTrackPosition() {
    // The carousel and each slide have the same width because track padding/gap are zero.
    track.style.transform = `translate3d(${-physicalIndex * carousel.clientWidth}px, 0, 0)`;
  }

  function updateActiveSlideState(announce = false) {
    originalSlides.forEach((slide, index) => {
      const active = index === currentIndex;
      slide.setAttribute("aria-hidden", String(!active));
      slide.inert = !active;
    });

    // Edge clones are visual-only. Their links must never enter keyboard navigation.
    track.querySelectorAll('[data-carousel-clone="true"]').forEach((clone) => {
      clone.setAttribute("aria-hidden", "true");
      clone.inert = true;
    });

    if (dotsContainer) {
      dotsContainer.querySelectorAll(".project-dot").forEach((dot, index) => {
        if (index === currentIndex) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });
    }

    if (announce && status && projectsData[currentIndex]) {
      status.textContent = `${currentIndex + 1} / ${projectsData.length}: ${projectsData[currentIndex].title}`;
    }
  }

  function createSlide(project, index, isClone = false) {
    const slide = document.createElement("div");
    slide.className = "project-slide";
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", `${index + 1} of ${projectsData.length}`);

    if (isClone) {
      slide.dataset.carouselClone = "true";
      slide.setAttribute("aria-hidden", "true");
      slide.inert = true;
    }

    const card = createProjectCard(project, isMobile);

    // Translate dynamic content inside the project card
    const dict = getCurrentLanguage();

    card.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");

      if (Object.prototype.hasOwnProperty.call(dict, key)) {
        el.textContent = dict[key];
      }
    });

    card.querySelectorAll("img").forEach((image) => {
      image.draggable = false;
      image.loading = !isClone && index === currentIndex ? "eager" : "lazy";
      image.decoding = "async";
    });
    slide.appendChild(card);
    return slide;
  }

  function renderDots() {
    if (!dotsContainer) return;

    const fragment = document.createDocumentFragment();
    projectsData.forEach((project, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "project-dot";
      dot.setAttribute(
        "aria-label",
        `Go to project ${index + 1}: ${project.title}`,
      );
      dot.addEventListener("click", () => goToProject(index));
      fragment.appendChild(dot);
    });
    dotsContainer.replaceChildren(fragment);
  }

  function clearTransitionFallback() {
    if (transitionFallbackTimer !== null) {
      window.clearTimeout(transitionFallbackTimer);
      transitionFallbackTimer = null;
    }
  }

  function finishTransition() {
    clearTransitionFallback();

    if (pendingSnapSlot !== null) {
      // After animating to an edge clone, snap to its matching real slide without animation.
      const snapSlot = pendingSnapSlot;
      pendingSnapSlot = null;
      track.classList.add("is-rebuilding");
      physicalIndex = snapSlot;
      updateTrackPosition();
      void track.offsetWidth;
      requestAnimationFrame(() => track.classList.remove("is-rebuilding"));
    }

    isAnimating = false;
  }

  function scheduleTransitionFallback() {
    clearTransitionFallback();
    // Avoid getting stuck if a browser does not dispatch transitionend (e.g. style changes).
    transitionFallbackTimer = window.setTimeout(finishTransition, 800);
  }

  function renderProjects() {
    projectsData = getProjectsData();
    currentIndex = projectsData.length
      ? ((currentIndex % projectsData.length) + projectsData.length) %
        projectsData.length
      : 0;
    physicalIndex = projectsData.length ? currentIndex + 1 : 0;
    pendingSnapSlot = null;
    isAnimating = false;
    clearTransitionFallback();

    track.classList.add("is-rebuilding");

    if (projectsData.length === 0) {
      originalSlides = [];
      track.replaceChildren();
      if (dotsContainer) dotsContainer.replaceChildren();
      updateTrackPosition();
      requestAnimationFrame(() => track.classList.remove("is-rebuilding"));
      return;
    }

    const previousClone = createSlide(
      projectsData[projectsData.length - 1],
      projectsData.length - 1,
      true,
    );
    originalSlides = projectsData.map((project, index) =>
      createSlide(project, index),
    );
    const nextClone = createSlide(projectsData[0], 0, true);

    // Track order: [clone of last] [real slides...] [clone of first].
    // Edge clones make wrap-around animations move in the expected direction.
    track.replaceChildren(previousClone, ...originalSlides, nextClone);
    renderDots();
    updateActiveSlideState(false);
    updateTrackPosition();

    void track.offsetWidth;
    requestAnimationFrame(() => track.classList.remove("is-rebuilding"));
  }

  function goToProject(requestedIndex, announce = true) {
    const total = projectsData.length;
    if (total < 2 || isAnimating) return;

    const targetIndex = ((requestedIndex % total) + total) % total;
    if (targetIndex === currentIndex) return;

    const fromIndex = currentIndex;
    currentIndex = targetIndex;
    pendingSnapSlot = null;

    if (fromIndex === total - 1 && targetIndex === 0) {
      // Last -> first: animate left to the trailing clone, then snap to real slide 1.
      physicalIndex = total + 1;
      pendingSnapSlot = 1;
    } else if (fromIndex === 0 && targetIndex === total - 1) {
      // First -> last: animate right to the leading clone, then snap to the real last slide.
      physicalIndex = 0;
      pendingSnapSlot = total;
    } else {
      physicalIndex = targetIndex + 1;
    }

    isAnimating = true;
    updateActiveSlideState(announce);
    updateTrackPosition();
    scheduleTransitionFallback();
  }

  function moveBy(step) {
    if (projectsData.length < 2 || isAnimating) return;
    goToProject(currentIndex + step);
  }

  prevButton?.addEventListener("click", () => moveBy(-1));
  nextButton?.addEventListener("click", () => moveBy(1));

  carousel.addEventListener("transitionend", (event) => {
    if (event.target === track && event.propertyName === "transform") {
      finishTransition();
    }
  });

  carousel.addEventListener("keydown", (event) => {
    if (event.target !== carousel || isAnimating) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveBy(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      moveBy(1);
    }
  });

  // Pointer Events supports mouse drag and touch swipe. Vertical page scrolling remains enabled.
  carousel.addEventListener("pointerdown", (event) => {
    if (
      isAnimating ||
      !event.isPrimary ||
      (event.pointerType === "mouse" && event.button !== 0)
    )
      return;

    const target = event.target instanceof Element ? event.target : null;
    if (
      target?.closest(
        "a, button, input, textarea, select, summary, [data-no-drag]",
      )
    )
      return;
    if (projectsData.length < 2) return;

    pointer = {
      active: true,
      dragging: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      deltaX: 0,
    };

    try {
      carousel.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture may be unavailable in some embedded browsers.
    }
  });

  carousel.addEventListener("pointermove", (event) => {
    if (!pointer.active || event.pointerId !== pointer.pointerId) return;

    const deltaX = event.clientX - pointer.startX;
    const deltaY = event.clientY - pointer.startY;

    if (!pointer.dragging) {
      if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return;

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        pointer.active = false;
        return;
      }

      pointer.dragging = true;
      carousel.classList.add("is-dragging");
      track.classList.add("is-dragging");
    }

    pointer.deltaX = deltaX;
    event.preventDefault();
    const offset = -(physicalIndex * carousel.clientWidth) + deltaX;
    track.style.transform = `translate3d(${offset}px, 0, 0)`;
  });

  function finishPointerGesture(event, cancelled = false) {
    if (!pointer.active || event.pointerId !== pointer.pointerId) return;

    const didDrag = pointer.dragging;
    const deltaX = pointer.deltaX;
    pointer.active = false;
    pointer.dragging = false;
    pointer.pointerId = null;

    if (!didDrag) return;

    carousel.classList.remove("is-dragging");
    track.classList.remove("is-dragging");
    suppressClickUntil = performance.now() + 300;

    if (cancelled) {
      updateTrackPosition();
      return;
    }

    const threshold = Math.max(45, Math.min(120, carousel.clientWidth * 0.12));
    if (Math.abs(deltaX) >= threshold) {
      moveBy(deltaX < 0 ? 1 : -1);
    } else {
      updateTrackPosition();
    }
  }

  carousel.addEventListener("pointerup", (event) =>
    finishPointerGesture(event),
  );
  carousel.addEventListener("pointercancel", (event) =>
    finishPointerGesture(event, true),
  );

  carousel.addEventListener(
    "click",
    (event) => {
      if (performance.now() <= suppressClickUntil) {
        event.preventDefault();
        event.stopPropagation();
        suppressClickUntil = 0;
      }
    },
    true,
  );

  window.addEventListener("resize", () => {
    if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);

    resizeFrame = requestAnimationFrame(() => {
      const newIsMobile = window.innerWidth < 768;
      if (newIsMobile !== isMobile) {
        isMobile = newIsMobile;
        renderProjects();
      } else {
        updateTrackPosition();
      }
      resizeFrame = null;
    });
  });

  document.addEventListener("languageChanged", renderProjects);
  loadProjects().then(renderProjects);
}

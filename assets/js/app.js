// ===== Utilities =====
const prefersReduced = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const isVideoUrl = (url) => /\.(mp4|webm|mov|m4v)$/i.test(url);

// ===== Reveal-on-scroll (repeatable) =====
(() => {
  const els = Array.from(document.querySelectorAll(".reveal-on-scroll"));
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-inview");
        } else {
          // Remove class when scroll out -> hiệu ứng lại khi scroll back
          en.target.classList.remove("is-inview");
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.01 }
  );

  els.forEach((el) => io.observe(el));
})();

// ===== Sticky Showcase: swap media when panel enters viewport =====
(() => {
  const stage = document.querySelector(".stage");
  const panels = Array.from(document.querySelectorAll(".panels .panel"));
  if (!stage || !panels.length) return;

  // Ensure stage can host absolutely-positioned children
  stage.style.position = stage.style.position || "sticky";

  // Current live media (img/video)
  let currentEl = document.getElementById("stageMedia");

  const swapMedia = (src) => {
    if (!src) return;
    // If current is <img> and src equals -> skip
    if (
      currentEl &&
      currentEl.tagName === "IMG" &&
      currentEl.getAttribute("src") === src
    )
      return;
    if (
      currentEl &&
      currentEl.tagName === "VIDEO" &&
      currentEl.getAttribute("data-src") === src
    )
      return;

    // Create next element
    let next;
    if (isVideoUrl(src)) {
      next = document.createElement("video");
      next.setAttribute("playsinline", "");
      next.setAttribute("muted", "");
      next.setAttribute("loop", "");
      next.autoplay = true;
      next.dataset.src = src;
      // For instant start on some browsers, set src last:
      next.src = src;
    } else {
      next = document.createElement("img");
      next.src = src;
      next.alt = currentEl?.alt || "Project demo stage";
    }

    next.className = "media-next";
    next.style.position = "absolute";
    next.style.inset = "0";
    next.style.width = "100%";
    next.style.height = "100%";
    next.style.objectFit = "cover";
    stage.appendChild(next);

    // Cross-fade
    // Force layout to start transition
    // eslint-disable-next-line no-unused-expressions
    next.offsetHeight;
    next.classList.add("is-visible");

    if (prefersReduced) {
      // No animation: remove instantly
      if (currentEl && currentEl !== next) currentEl.remove();
      currentEl = next;
      return;
    }

    // After transition, remove old
    next.addEventListener(
      "transitionend",
      () => {
        if (currentEl && currentEl !== next) currentEl.remove();
        currentEl = next;
      },
      { once: true }
    );
  };

  // IO to activate panels and swap media
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        const panel = en.target;
        if (en.isIntersecting) {
          panels.forEach((p) => p.classList.remove("is-active"));
          panel.classList.add("is-active");
          const media = panel.getAttribute("data-media");
          if (media) swapMedia(media);
        }
      });
    },
    { rootMargin: "-35% 0px -50% 0px", threshold: 0.01 }
  );

  panels.forEach((p) => io.observe(p));
})();

// ===== Theme toggle (sync both buttons & persist) =====
(() => {
  const toggles = Array.from(document.querySelectorAll(".theme-toggle"));
  if (!toggles.length) return;

  const root = document.documentElement;
  const getTheme = () => localStorage.getItem("theme") || "dark";
  const setTheme = (t) => {
    if (t === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    localStorage.setItem("theme", t);
  };

  // Init from storage / system
  setTheme(getTheme());

  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = root.hasAttribute("data-theme") ? "dark" : "light";
      setTheme(next);
    });
  });
})();

// ===== Footer year =====
(() => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

// === Mobile menu toggle ===
(() => {
  const menuBtn = document.getElementById("menuToggle");
  const nav = document.getElementById("primaryNav");
  if (!menuBtn || !nav) return;

  const closeMenu = () => {
    nav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  };

  menuBtn.addEventListener("click", () => {
    const willOpen = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", willOpen);
    menuBtn.setAttribute("aria-expanded", String(willOpen));
    document.body.classList.toggle("no-scroll", willOpen);
  });

  // Đóng khi click link (trải nghiệm mobile tốt hơn)
  nav.querySelectorAll("a.nav-link").forEach((a) => {
    a.addEventListener("click", closeMenu);
  });

  // Đóng khi bấm ngoài khu vực menu
  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("is-open")) return;
    const withinHeader = e.target.closest(".site-header");
    const withinNav = e.target.closest("#primaryNav");
    const isMenuBtn = e.target.closest("#menuToggle");
    if (!withinHeader && !withinNav && !isMenuBtn) closeMenu();
  });
})();

// === Active link theo section (IntersectionObserver) ===
(() => {
  const links = Array.from(document.querySelectorAll(".nav-link"));
  if (!links.length) return;

  const map = new Map(
    links
      .filter((a) => a.hash && a.hash.startsWith("#"))
      .map((a) => [a.hash.slice(1), a])
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const link = map.get(id);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 }
  );

  map.forEach((_a, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
})();

// Theme: dark khi có .sl-theme-dark trên <html>, light khi không có
(() => {
  const root = document.documentElement;
  const getTheme = () => localStorage.getItem("theme") || "dark";
  const applyTheme = (t) => {
    root.classList.toggle("sl-theme-dark", t === "dark");
    localStorage.setItem("theme", t);
  };
  applyTheme(getTheme());

  // Gắn cho tất cả nút có .theme-toggle
  document.querySelectorAll(".theme-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = root.classList.contains("sl-theme-dark") ? "light" : "dark";
      applyTheme(next);
    });
  });
})();

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
  const projectItems = Array.from(document.querySelectorAll(".projects-content .project-item"));
  const items = [...panels, ...projectItems];
  if (!stage || !items.length) return;

  // Ensure stage can host absolutely-positioned children
  // stage.style.position = stage.style.position || "sticky";

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
        const item = en.target;
        if (en.isIntersecting) {
          items.forEach((i) => i.classList.remove("is-active"));
          item.classList.add("is-active");
          const media = item.getAttribute("data-media");
          if (media) swapMedia(media);
        }
      });
    },
    { rootMargin: "-35% 0px -50% 0px", threshold: 0.01 }
  );

  items.forEach((item) => io.observe(item));
})();

// ===== Contact Form Handling with EmailJS =====
(() => {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  // Initialize EmailJS with your Public Key
  emailjs.init('xT5J5YgEbpHJH6AER'); // Thay YOUR_PUBLIC_KEY bằng Public Key thực từ EmailJS Dashboard

  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Remove any existing messages
    const existingMessage = contactForm.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    try {
      // Prepare template parameters
      const templateParams = {
        to_name: 'Kaito', // Tên người nhận email (bạn)
        from_name: contactForm.name.value,
        from_email: contactForm.email.value,
        reply_to: contactForm.email.value, // Quan trọng cho Reply To
        subject: contactForm.subject.value,
        message: contactForm.message.value
      };

      // Send email using EmailJS
      const response = await emailjs.send(
        'service_2j5dnbn', // Service ID từ EmailJS
        'template_xmyaif8', // Template ID từ EmailJS
        templateParams
      );

      if (response.status === 200) {
        // Show success message
        showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
      } else {
        throw new Error('Email sending failed');
      }

    } catch (error) {
      console.error('EmailJS Error:', error);
      console.error('Error details:', error.text || error.message);
      // Show error message
      showFormMessage(`Failed to send message: ${error.text || error.message}. Please try again or contact me directly.`, 'error');
    } finally {
      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  function showFormMessage(text, type) {
    const message = document.createElement('div');
    message.className = `form-message ${type}`;
    message.textContent = text;

    contactForm.appendChild(message);

    // Auto remove after 5 seconds
    setTimeout(() => {
      message.remove();
    }, 5000);
  }
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

// ===== Projects Overlap Animation =====
(() => {
  const projectItems = document.querySelectorAll('.project-item');
  const stage = document.querySelector('.stage');

  if (!projectItems.length || !stage) return;

  let currentActiveIndex = 0;

  // Intersection Observer for overlap detection
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const index = Array.from(projectItems).indexOf(entry.target);

          // Change image for any direction scroll
          if (index !== currentActiveIndex) {
            currentActiveIndex = index;

            // Change image immediately
            const media = entry.target.getAttribute('data-media');
            if (media) {
              const stageImg = stage.querySelector('img');
              if (stageImg) {
                stageImg.src = media;
              }
            }
          }
        }
      });
    },
    {
      rootMargin: '-20% 0px -20% 0px',
      threshold: [0.5, 0.8, 1.0]
    }
  );

  projectItems.forEach(item => io.observe(item));
})();

// ===== Footer year =====
(() => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

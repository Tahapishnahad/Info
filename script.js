"use strict";

/* =========================================================
   01. Configuration
   ========================================================= */

const STORAGE_KEYS = {
  theme: "taha-portfolio-theme",
  palette: "taha-portfolio-palette"
};

const EMAIL = "tahapishnahad0@gmail.com";

/* =========================================================
   02. DOM References
   ========================================================= */

const root = document.documentElement;

const header = document.querySelector(".site-header");
const themeToggle = document.getElementById("theme-toggle");

const paletteButton = document.getElementById("palette-button");
const paletteMenu = document.getElementById("palette-menu");
const paletteOptions = document.querySelectorAll(".palette-option");

const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

const sections = document.querySelectorAll("main section[id]");

const copyEmailButton = document.getElementById("copy-email");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");

const revealElements = document.querySelectorAll(".reveal");

/* =========================================================
   03. Theme Manager
   ========================================================= */

function getPreferredTheme() {
  const storedTheme = localStorage.getItem(STORAGE_KEYS.theme);

  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  root.dataset.theme = theme;

  if (theme === "dark") {
    themeToggle.setAttribute("aria-label", "Switch to light theme");
    themeToggle.setAttribute("title", "Switch to light theme");
  } else {
    themeToggle.setAttribute("aria-label", "Switch to dark theme");
    themeToggle.setAttribute("title", "Switch to dark theme");
  }
}

function initializeTheme() {
  const theme = getPreferredTheme();
  applyTheme(theme);
}

function toggleTheme() {
  const currentTheme = root.dataset.theme || "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  applyTheme(nextTheme);
  localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
}

themeToggle.addEventListener("click", toggleTheme);

initializeTheme();

/* =========================================================
   04. Theme Palette
   ========================================================= */

function getStoredPalette() {
  const storedPalette = localStorage.getItem(STORAGE_KEYS.palette);

  if (["default", "ocean", "midnight"].includes(storedPalette)) {
    return storedPalette;
  }

  return "default";
}

function applyPalette(palette) {
  if (palette === "default") {
    delete root.dataset.palette;
  } else {
    root.dataset.palette = palette;
  }

  paletteOptions.forEach((option) => {
    const isActive = option.dataset.theme === palette;
    option.classList.toggle("active", isActive);
  });
}

function initializePalette() {
  applyPalette(getStoredPalette());
}

function togglePaletteMenu() {
  const isOpen = paletteMenu.classList.toggle("open");

  paletteButton.setAttribute("aria-expanded", String(isOpen));
  paletteMenu.setAttribute("aria-hidden", String(!isOpen));
}

function closePaletteMenu() {
  paletteMenu.classList.remove("open");
  paletteButton.setAttribute("aria-expanded", "false");
  paletteMenu.setAttribute("aria-hidden", "true");
}

paletteButton.addEventListener("click", (event) => {
  event.stopPropagation();
  togglePaletteMenu();
});

paletteOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const palette = option.dataset.theme;

    applyPalette(palette);
    localStorage.setItem(STORAGE_KEYS.palette, palette);
    closePaletteMenu();
  });
});

document.addEventListener("click", (event) => {
  if (
    paletteMenu.classList.contains("open") &&
    !paletteMenu.contains(event.target) &&
    !paletteButton.contains(event.target)
  ) {
    closePaletteMenu();
  }
});

initializePalette();

/* =========================================================
   05. Mobile Navigation
   ========================================================= */

function setMobileMenu(open) {
  navMenu.classList.toggle("open", open);
  menuToggle.classList.toggle("active", open);

  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute(
    "aria-label",
    open ? "Close navigation menu" : "Open navigation menu"
  );
}

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.contains("open");
  setMobileMenu(!isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setMobileMenu(false);
  });
});

document.addEventListener("click", (event) => {
  const clickedInsideNavigation =
    navMenu.contains(event.target) ||
    menuToggle.contains(event.target);

  if (
    navMenu.classList.contains("open") &&
    !clickedInsideNavigation
  ) {
    setMobileMenu(false);
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 850) {
    setMobileMenu(false);
  }
});

/* =========================================================
   06. Header Scroll State
   ========================================================= */

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 20);
}

window.addEventListener("scroll", updateHeader, { passive: true });

updateHeader();

/* =========================================================
   07. Active Navigation
   ========================================================= */

function updateActiveNavigation() {
  const scrollPosition = window.scrollY + 180;

  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionBottom
    ) {
      currentSection = section.id;
    }
  });

  if (window.scrollY < 200) {
    currentSection = "home";
  }

  navLinks.forEach((link) => {
    const linkSection = link.getAttribute("href").replace("#", "");
    link.classList.toggle(
      "active",
      linkSection === currentSection
    );
  });
}

window.addEventListener("scroll", updateActiveNavigation, {
  passive: true
});

window.addEventListener("resize", updateActiveNavigation);

updateActiveNavigation();

/* =========================================================
   08. Scroll Reveal
   ========================================================= */

function initializeScrollReveal() {
  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    revealElements.forEach((element) => {
      element.classList.add("revealed");
    });

    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("revealed");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("revealed");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
}

initializeScrollReveal();

/* =========================================================
   09. Copy Email
   ========================================================= */

let toastTimeout;

function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function setCopyButtonState(copied) {
  if (!copyEmailButton) {
    return;
  }

  const status = copyEmailButton.querySelector(".copy-status");

  if (copied) {
    copyEmailButton.firstChild.textContent = "Copied! ";

    if (status) {
      status.textContent = "✓";
    }
  } else {
    copyEmailButton.firstChild.textContent = "Copy Email ";

    if (status) {
      status.textContent = "⧉";
    }
  }
}

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(EMAIL);

    setCopyButtonState(true);
    showToast("Email copied!");

    setTimeout(() => {
      setCopyButtonState(false);
    }, 2000);
  } catch (error) {
    const temporaryInput = document.createElement("textarea");

    temporaryInput.value = EMAIL;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";
    temporaryInput.style.pointerEvents = "none";

    document.body.appendChild(temporaryInput);
    temporaryInput.select();

    try {
      document.execCommand("copy");

      setCopyButtonState(true);
      showToast("Email copied!");

      setTimeout(() => {
        setCopyButtonState(false);
      }, 2000);
    } catch (fallbackError) {
      showToast("Copy unavailable");
    }

    temporaryInput.remove();
  }
}

copyEmailButton.addEventListener("click", copyEmail);

/* =========================================================
   10. Smooth Anchor Navigation
   ========================================================= */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();

    const headerOffset = header.offsetHeight + 10;
    const targetPosition =
      target.getBoundingClientRect().top +
      window.scrollY -
      headerOffset;

    window.scrollTo({
      top: targetPosition,
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
        ? "auto"
        : "smooth"
    });

    if (navMenu.classList.contains("open")) {
      setMobileMenu(false);
    }
  });
});

/* =========================================================
   11. Keyboard Navigation Enhancements
   ========================================================= */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMobileMenu(false);
    closePaletteMenu();
  }
});

/* =========================================================
   12. External Link Protection
   ========================================================= */

document
  .querySelectorAll('a[target="_blank"]')
  .forEach((link) => {
    link.addEventListener("click", () => {
      link.blur();
    });
  });

/* =========================================================
   13. Small Decorative Interaction
   ========================================================= */

const heroVisual = document.querySelector(".hero-visual");

if (
  heroVisual &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  heroVisual.addEventListener("pointermove", (event) => {
    if (window.innerWidth < 850) {
      return;
    }

    const rect = heroVisual.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) / rect.width - 0.5;

    const y =
      (event.clientY - rect.top) / rect.height - 0.5;

    const nodes = heroVisual.querySelectorAll(
      ".floating-node"
    );

    nodes.forEach((node, index) => {
      const multiplier = 5 + index * 2;

      node.style.transform =
        `translate(${x * multiplier}px, ${y * multiplier}px)`;
    });
  });

  heroVisual.addEventListener("pointerleave", () => {
    const nodes = heroVisual.querySelectorAll(
      ".floating-node"
    );

    nodes.forEach((node) => {
      node.style.transform = "";
    });
  });
}

/* =========================================================
   14. Initial Accessibility State
   ========================================================= */

if (paletteMenu) {
  paletteMenu.setAttribute("aria-hidden", "true");
}

if (menuToggle) {
  menuToggle.setAttribute("aria-expanded", "false");
}

/* =========================================================
   15. Final Initialization
   ========================================================= */

document.body.classList.add("js-ready");
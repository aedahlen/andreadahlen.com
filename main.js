/* =========================================================
   Interaction: theme, mobile nav, reveal-on-scroll,
   scroll-spy nav, and the project detail dialog.
   ========================================================= */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- Year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle ---------- */
  var THEME_KEY = "ad-theme";
  var toggle = document.querySelector(".theme-toggle");

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function storedTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
  }

  var saved = storedTheme();
  applyTheme(saved || (systemPrefersDark() ? "dark" : "light"));

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector(".site-header");
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("is-stuck", window.scrollY > 8);
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Mobile nav ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navList = document.getElementById("nav-list");

  function closeNav() {
    if (!navToggle || !navList) return;
    navToggle.setAttribute("aria-expanded", "false");
    navList.classList.remove("is-open");
  }
  if (navToggle && navList) {
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      navList.classList.toggle("is-open", !open);
    });
    navList.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeNav();
    });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });

    // Fallback: fast programmatic scrolls can skip an intersection callback,
    // leaving an element stuck at opacity 0. Reveal anything already scrolled
    // into (or past) view on every scroll/resize, throttled with rAF.
    var ticking = false;
    var sweep = function () {
      ticking = false;
      for (var i = revealEls.length - 1; i >= 0; i--) {
        var el = revealEls[i];
        if (el.classList.contains("is-in")) { revealEls.splice(i, 1); continue; }
        if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
          el.classList.add("is-in");
          io.unobserve(el);
          revealEls.splice(i, 1);
        }
      }
    };
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(sweep);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }

  /* ---------- Hero greeting carousel ---------- */
  var greeting = document.querySelector(".hero-greeting");
  var greetWords = greeting
    ? Array.prototype.slice.call(greeting.querySelectorAll(".greeting-word"))
    : [];

  if (greetWords.length > 1 && !reduceMotion) {
    var gIndex = 0;
    greetWords[0].classList.add("is-active");

    setInterval(function () {
      var current = greetWords[gIndex];
      gIndex = (gIndex + 1) % greetWords.length;
      var next = greetWords[gIndex];

      current.classList.remove("is-active");
      current.classList.add("is-leaving");
      setTimeout(function () { current.classList.remove("is-leaving"); }, 500);

      next.classList.add("is-active");
    }, 1900);
  } else if (greetWords.length) {
    greetWords[0].classList.add("is-active");
  }

  /* ---------- Scroll-spy nav ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-list a"));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href").slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Project dialog ---------- */
  var dialog = document.getElementById("project-dialog");
  var dRole = document.getElementById("dialog-role");
  var dTitle = document.getElementById("dialog-title");
  var dBody = document.getElementById("dialog-body");
  var closeBtn = dialog ? dialog.querySelector(".dialog-close") : null;
  var lastFocused = null;

  function openProject(key) {
    var data = window.PROJECTS && window.PROJECTS[key];
    if (!data || !dialog) return;
    dRole.innerHTML = data.role;
    dTitle.innerHTML = data.title;
    dBody.innerHTML = data.body;
    dialog.querySelector(".dialog-content").scrollTop = 0;
    lastFocused = document.activeElement;
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    if (closeBtn) closeBtn.focus();
  }

  function closeProject() {
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  document.querySelectorAll(".work-card-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openProject(btn.getAttribute("data-project"));
    });
  });

  if (dialog) {
    if (closeBtn) closeBtn.addEventListener("click", closeProject);
    // Click on the backdrop (outside the dialog box) closes it.
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) closeProject();
    });
    dialog.addEventListener("cancel", function () {
      // let the native Escape behaviour run, then restore focus
      setTimeout(function () {
        if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
      }, 0);
    });
  }
})();

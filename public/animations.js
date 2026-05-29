(function () {
  // 1. Intersection Observer fade-up
  function initFadeUp() {
    var els = document.querySelectorAll(".fade-up");
    if (!els.length) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );
    els.forEach(function (el) {
      io.observe(el);
    });
  }

  // 2. Navbar scroll
  function initNavbar() {
    var nav = document.querySelector("nav") || document.querySelector("header");
    if (!nav) return;
    function onScroll() {
      if (window.scrollY > 55) nav.classList.add("nav-solid");
      else nav.classList.remove("nav-solid");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // 3. Smooth scroll con offset
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var href = a.getAttribute("href");
        if (!href || href === "#") return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var nav =
          document.querySelector("nav") || document.querySelector("header");
        var offset = nav ? nav.offsetHeight + 16 : 80;
        window.scrollTo({ top: target.offsetTop - offset, behavior: "smooth" });
      });
    });
  }

  // 4. Typewriter en primer mensaje del chat
  function initTypewriter() {
    var el = document.querySelector("[data-typewriter]");
    if (!el) return;
    var text = el.getAttribute("data-typewriter");
    if (!text) return;
    el.textContent = "";
    var cursor = document.createElement("span");
    cursor.className = "tw-cursor";
    el.appendChild(cursor);
    var i = 0;
    var iv = setInterval(function () {
      if (i >= text.length) {
        clearInterval(iv);
        setTimeout(function () {
          cursor.style.display = "none";
        }, 1200);
        return;
      }
      el.insertBefore(document.createTextNode(text[i]), cursor);
      i++;
    }, 22);
  }

  // Init
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initFadeUp();
      initNavbar();
      initSmoothScroll();
      initTypewriter();
    });
  } else {
    initFadeUp();
    initNavbar();
    initSmoothScroll();
    initTypewriter();
  }
})();

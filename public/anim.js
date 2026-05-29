(function () {
  function fadeUp() {
    var io = new IntersectionObserver(
      function (e) {
        e.forEach(function (x) {
          if (x.isIntersecting) {
            x.target.classList.add("visible");
            io.unobserve(x.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );
    document.querySelectorAll(".fade-up").forEach(function (el) {
      io.observe(el);
    });
  }

  function navbar() {
    var nav = document.querySelector("nav") || document.querySelector("header");
    if (!nav) return;
    function s() {
      nav.classList[window.scrollY > 55 ? "add" : "remove"]("nav-solid");
    }
    window.addEventListener("scroll", s, { passive: true });
    s();
  }

  function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var href = a.getAttribute("href");
        if (!href || href === "#") return;
        var t = document.querySelector(href);
        if (!t) return;
        e.preventDefault();
        var nav =
          document.querySelector("nav") || document.querySelector("header");
        window.scrollTo({
          top: t.offsetTop - (nav ? nav.offsetHeight + 16 : 80),
          behavior: "smooth",
        });
      });
    });
  }

  function typewriter() {
    var el = document.querySelector("[data-tw]");
    if (!el) return;
    var txt = el.getAttribute("data-tw");
    el.textContent = "";
    var cur = document.createElement("span");
    cur.className = "tw-cursor";
    el.appendChild(cur);
    var i = 0;
    var iv = setInterval(function () {
      if (i >= txt.length) {
        clearInterval(iv);
        setTimeout(function () {
          cur.style.display = "none";
        }, 1000);
        return;
      }
      el.insertBefore(document.createTextNode(txt[i]), cur);
      i++;
    }, 22);
  }

  var ready = function () {
    fadeUp();
    navbar();
    smoothScroll();
    typewriter();
  };
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", ready)
    : ready();
})();

// Rajagopal Mandadi — portfolio interactions
// Scroll reveal, animated counters, skill bars, mobile menu, active nav.

(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu
  var menuBtn = document.getElementById("menuBtn");
  var navLinks = document.getElementById("navLinks");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Scroll reveal (IntersectionObserver)
  var revealEls = document.querySelectorAll(".reveal");
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  // Animated counters
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-target"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1400;
    var start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll(".stat-num");
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(function (el) { counterObserver.observe(el); });

  // Skill bars — animate when their group scrolls into view
  var skillGroups = document.querySelectorAll(".skill-group");
  var skillObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  skillGroups.forEach(function (el) { skillObserver.observe(el); });

  // Active nav highlighting
  var sections = document.querySelectorAll("section[id]");
  var navAnchors = document.querySelectorAll(".nav-links a[href^='#']");
  var navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = "#" + entry.target.id;
        navAnchors.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === id);
        });
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach(function (s) { navObserver.observe(s); });


  // --- Cinematic upgrade ---
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  // Scroll progress bar + nav shadow
  var progress = document.getElementById("scrollProgress");
  var nav = document.querySelector(".nav");
  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    if (progress && max > 0) progress.style.width = (doc.scrollTop / max * 100) + "%";
    if (nav) nav.classList.toggle("scrolled", doc.scrollTop > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Hero parallax: orbs / grid drift with scroll, hero content fades slightly
  var hero = document.getElementById("hero");
  var heroBg = document.querySelector(".hero-bg");
  if (hero && heroBg && !reduceMotion) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        heroBg.style.transform = "translateY(" + y * 0.25 + "px)";
        heroBg.style.opacity = String(Math.max(0.25, 1 - y / (window.innerHeight * 1.1)));
      }
    }, { passive: true });
  }

  // 3D tilt on mouse move (hero photo + project cards), desktop only
  function addTilt(el, maxDeg) {
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      var rx = ((e.clientY - r.top) / r.height - 0.5) * -maxDeg;
      var ry = ((e.clientX - r.left) / r.width - 0.5) * maxDeg;
      el.style.transform = "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)" + (el.classList.contains("card") ? " translateY(-8px)" : "");
    });
    el.addEventListener("mouseleave", function () { el.style.transform = ""; });
  }
  if (!reduceMotion && finePointer) {
    document.querySelectorAll("[data-tilt]").forEach(function (el) {
      addTilt(el, el.classList.contains("card") ? 7 : 10);
    });
  }

  // Section headings: underline reveal when their container is in view
  document.querySelectorAll(".section-title").forEach(function (h) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { h.classList.add("visible"); obs.disconnect(); }
      });
    }, { threshold: 0.6 });
    obs.observe(h);
  });

})();

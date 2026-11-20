/* RAJAGOPAL.DEV — Executive Portfolio
   Shared script: scroll-driven canvas engine (index.html),
   ambient fallback canvas, sticky nav, modal, scroll reveals.
   Vanilla JS, zero dependencies. */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Sticky header state ---------- */
  var header = document.getElementById("site-header");
  function onScrollHeader() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById("nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("open"); });
    });
  }

  /* ---------- Book a Consultation modal ---------- */
  var modal = document.getElementById("consult-modal");
  function openModal() { if (modal) { modal.classList.add("open"); document.body.style.overflow = "hidden"; } }
  function closeModal() { if (modal) { modal.classList.remove("open"); document.body.style.overflow = ""; } }
  document.querySelectorAll("[data-open-modal]").forEach(function (b) {
    b.addEventListener("click", openModal);
  });
  document.querySelectorAll("[data-close-modal]").forEach(function (el) {
    el.addEventListener("click", closeModal);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

  /* ---------- Scroll reveals ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Background photo + outline text drift ----------
     As the user scrolls down, the background photo and the giant
     outline words move horizontally — left-to-right, then
     right-to-left, alternating — driven by scroll progress.
     Photo and text move in opposite directions at different speeds
     (parallax), and the photo also turns / scales a tiny amount.
     Uses a sine wave over scroll progress so the direction reverses
     smoothly, plus a slow continuous drift. Smoothed with lerp in
     requestAnimationFrame. Runs on index.html (which has the layer);
     harmless on projects.html (no .bg-layer there).
     Canvas frame-scrubbing below is untouched. */
  var bgPhoto = document.getElementById("bg-photo");
  var bgTexts = Array.prototype.slice.call(document.querySelectorAll(".bg-text"));
  if (!reduceMotion && (bgPhoto || bgTexts.length)) {
    var bgTarget = 0, bgCurrent = 0, bgStart = performance.now();
    function bgScrollProgress() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return 0;
      return Math.min(1, Math.max(0, window.scrollY / max));
    }
    function bgTick(now) {
      var p = bgScrollProgress();
      // Two full left->right->left cycles over the whole page:
      // sin goes +1 -> 0 -> -1 -> 0 -> +1 as p goes 0 -> 1.
      var wave = Math.sin(p * Math.PI * 4);
      bgTarget = wave;
      bgCurrent += (bgTarget - bgCurrent) * 0.08;
      var t = (now - bgStart) / 1000;
      var drift = Math.sin(t * 0.25) * 6; // slow continuous drift, px
      if (bgPhoto) {
        var px = bgCurrent * 48 + drift;
        var rot = bgCurrent * 1.5; // subtle cinematic turn, degrees
        var scale = 1.03 + Math.abs(bgCurrent) * 0.02;
        bgPhoto.style.transform =
          "translateY(-50%) translateX(" + px.toFixed(1) + "px) rotate(" + rot.toFixed(2) + "deg) scale(" + scale.toFixed(3) + ")";
      }
      bgTexts.forEach(function (el, i) {
        // Opposite direction to the photo, different speed per line.
        var speed = parseFloat(el.getAttribute("data-speed") || "0.6", 10);
        var tx = -bgCurrent * 70 * speed + drift * speed * 0.5;
        el.style.transform = "translateX(" + tx.toFixed(1) + "px)";
      });
      requestAnimationFrame(bgTick);
    }
    requestAnimationFrame(bgTick);
  }


  /* ---------- Folioblox hero portrait parallax ----------
     The central portrait drifts down slightly and scales a touch
     as you scroll, for a cinematic turn. Kept subtle; skipped
     under prefers-reduced-motion. */
  var folioPortrait = document.getElementById("folio-portrait");
  if (folioPortrait && !reduceMotion) {
    var folioTicking = false;
    function folioParallax() {
      folioTicking = false;
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        folioPortrait.style.transform =
          "translateX(-50%) translateY(" + (y * 0.12).toFixed(1) + "px) scale(" + (1 + Math.min(y / window.innerHeight, 1) * 0.05).toFixed(3) + ")";
      }
    }
    window.addEventListener("scroll", function () {
      if (!folioTicking) { folioTicking = true; requestAnimationFrame(folioParallax); }
    }, { passive: true });
  }

  /* ---------- Scroll canvas engine (index.html only) ---------- */
  var canvas = document.getElementById("scroll-canvas");
  if (!canvas) return; // projects.html: no canvas, the rest above is enough.

  var ctx = canvas.getContext("2d");
  var loader = document.getElementById("loader");
  var loaderText = document.getElementById("loader-text");
  var frames = [];          // loaded Image objects, in order
  var frameCount = 0;       // frames.length once probing settles
  var probingDone = false;
  var mouseX = 0.5, mouseY = 0.4;
  var targetFrame = 0, currentFrame = 0;
  var startTime = performance.now();

  function sizeCanvas() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
  }
  sizeCanvas();
  window.addEventListener("resize", sizeCanvas);

  window.addEventListener("mousemove", function (e) {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;
  }, { passive: true });

  function hideLoader() {
    if (loader) loader.classList.add("done");
  }

  /* Probe one frame: try .jpg, then .png. Resolves with an Image or null. */
  function tryLoadFrame(n, timeoutMs) {
    var name = "frame-" + String(n).padStart(3, "0");
    var exts = ["jpg", "png"];
    return new Promise(function (resolve) {
      var i = 0;
      function attempt() {
        if (i >= exts.length) { resolve(null); return; }
        var img = new Image();
        var done = false;
        var timer = setTimeout(function () { if (!done) { done = true; img.src = ""; resolve(null); } }, timeoutMs || 4000);
        img.onload = function () { if (!done) { done = true; clearTimeout(timer); resolve(img); } };
        img.onerror = function () { if (!done) { done = true; clearTimeout(timer); i += 1; attempt(); } };
        img.src = "frames/" + name + "." + exts[i];
      }
      attempt();
    });
  }

  /* Draw one frame with object-fit: cover scaling. */
  function drawCover(img) {
    var cw = canvas.width, ch = canvas.height;
    var scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    var w = img.naturalWidth * scale, h = img.naturalHeight * scale;
    var x = (cw - w) / 2, y = (ch - h) / 2;
    ctx.fillStyle = "#0A0A0C";
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, w, h);
  }

  /* --- Ambient fallback canvas (no frames yet) ---
     Dark gradient waves + drifting particles, responding to
     mouse position and scroll progress. Looks good on its own. */
  var particles = [];
  for (var p = 0; p < 70; p++) {
    particles.push({
      x: Math.random(), y: Math.random(),
      r: 0.6 + Math.random() * 1.8,
      s: 0.00012 + Math.random() * 0.00035,
      o: 0.15 + Math.random() * 0.5,
      amber: Math.random() > 0.6
    });
  }
  function drawAmbient(now) {
    var cw = canvas.width, ch = canvas.height;
    var t = (now - startTime) / 1000;
    var scroll = scrollProgress();
    // Base
    var g = ctx.createLinearGradient(0, 0, cw, ch);
    g.addColorStop(0, "#0A0A0C");
    g.addColorStop(0.55, "#0D1117");
    g.addColorStop(1, "#0A0A0C");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, cw, ch);
    // Warm amber + cyan glows, drifting with time, mouse and scroll
    function glow(x, y, r, color) {
      var rg = ctx.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, color);
      rg.addColorStop(1, "rgba(10,10,12,0)");
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, cw, ch);
    }
    var mx = mouseX * cw, my = mouseY * ch;
    glow(cw * 0.78 + Math.sin(t * 0.21) * cw * 0.05 + (mx - cw * 0.5) * 0.12,
         ch * 0.30 + Math.cos(t * 0.17) * ch * 0.06 + (my - ch * 0.5) * 0.1 - scroll * ch * 0.18,
         cw * 0.42, "rgba(245,158,11,0.13)");
    glow(cw * 0.18 + Math.cos(t * 0.15) * cw * 0.04,
         ch * 0.72 + Math.sin(t * 0.19) * ch * 0.05 - scroll * ch * 0.12,
         cw * 0.38, "rgba(56,189,248,0.10)");
    // Flowing wave lines
    ctx.lineWidth = Math.max(1, canvas.width / 1400);
    for (var w = 0; w < 3; w++) {
      ctx.beginPath();
      for (var x = 0; x <= cw; x += cw / 48) {
        var y = ch * (0.32 + w * 0.18)
          + Math.sin(x / cw * Math.PI * 2.4 + t * 0.35 + w * 1.7) * ch * 0.045
          - scroll * ch * 0.22;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = w === 1 ? "rgba(245,158,11,0.20)" : "rgba(56,189,248,0.12)";
      ctx.stroke();
    }
    // Particles
    particles.forEach(function (pt) {
      var px = ((pt.x + t * pt.s * 60 + scroll * 0.08) % 1) * cw;
      var py = ((pt.y + Math.sin(t * 0.4 + pt.x * 9) * 0.004) % 1) * ch;
      ctx.beginPath();
      ctx.arc(px, py, pt.r * (canvas.width / 1400 + 0.6), 0, Math.PI * 2);
      ctx.fillStyle = pt.amber
        ? "rgba(245,158,11," + pt.o + ")"
        : "rgba(56,189,248," + pt.o + ")";
      ctx.fill();
    });
  }

  function scrollProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return 0;
    return Math.min(1, Math.max(0, window.scrollY / max));
  }

  /* Frame loop: smooth scrub toward the scroll-mapped frame. */
  function tick(now) {
    if (!probingDone) { requestAnimationFrame(tick); return; }
    if (frames.length > 0) {
      targetFrame = scrollProgress() * (frames.length - 1);
      // Smooth lerp — fast enough to feel direct, slow enough to be cinematic
      currentFrame += (targetFrame - currentFrame) * (reduceMotion ? 1 : 0.16);
      if (Math.abs(targetFrame - currentFrame) < 0.01) currentFrame = targetFrame;
      var img = frames[Math.round(currentFrame)];
      if (img) drawCover(img);
    } else {
      drawAmbient(now);
    }
    requestAnimationFrame(tick);
  }

  /* Probe frames sequentially; stop after 6 consecutive misses.
     Initial batch: probe until 12 frames found or 6 misses in a row,
     then hide the loader and keep preloading the rest in background. */
  var MAX_FRAMES = 300;
  var CONSEC_MISSES_STOP = 6;
  var consecutiveMisses = 0;
  var nextIndex = 1;
  var initialDone = false;

  function probeNext() {
    if (nextIndex > MAX_FRAMES || consecutiveMisses >= CONSEC_MISSES_STOP) {
      finishProbing();
      return;
    }
    if (loaderText) loaderText.textContent = "Loading sequence… " + frames.length + " frames";
    tryLoadFrame(nextIndex, 4000).then(function (img) {
      if (img) { frames.push(img); consecutiveMisses = 0; }
      else { consecutiveMisses += 1; }
      nextIndex += 1;
      // Initial batch: first 12 attempts, or first frame found + a few more
      if (!initialDone && (nextIndex > 12 || (frames.length > 0 && nextIndex > 6))) {
        initialDone = true;
        probingDone = true;
        hideLoader();
        requestAnimationFrame(tick);
      }
      probeNext();
    });
  }

  function finishProbing() {
    frameCount = frames.length;
    if (!initialDone) {
      initialDone = true;
      probingDone = true;
      hideLoader();
      requestAnimationFrame(tick);
    }
    if (loaderText) {
      loaderText.textContent = frames.length > 0
        ? frames.length + " frames loaded"
        : "Ambient mode — add frames to ./frames/";
    }
  }

  // Start: loader shows until the initial probe settles; tick runs after that.
  probeNext();
})();

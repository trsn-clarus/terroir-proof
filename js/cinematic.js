/* =============================================================================
 * Terroir & Proof — cinematic image direction
 * Scroll-linked grayscale→colour resolve + gentle hero parallax.
 * Technique surfaced via 21st.dev "Cinematic Product Scroll Section".
 *
 * Uses Motion (loaded from CDN) when reachable for buttery scroll-linked
 * animation; falls back to a dependency-free requestAnimationFrame loop when
 * the CDN is blocked/offline — so the effect always runs.
 * ========================================================================== */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  var cineEls = [].slice.call(document.querySelectorAll("[data-cine]"));
  var parEls = [].slice.call(document.querySelectorAll("[data-parallax]"));
  if (!cineEls.length && !parEls.length) return;

  function clamp(v, a, b) {
    return v < a ? a : v > b ? b : v;
  }

  // Map a 0→1 progress to the grayscale→colour grade.
  function paint(img, p) {
    var g = ((1 - p) * 0.9).toFixed(3);
    var s = (0.5 + p * 0.45).toFixed(3);
    var b = (0.92 + p * 0.08).toFixed(3);
    img.style.filter =
      "grayscale(" + g + ") saturate(" + s + ") contrast(1.06) brightness(" + b + ")";
  }

  // ---- Preferred path: Motion from CDN (scroll-linked timelines) ----------
  function initMotion(M) {
    var animate = M.animate;
    var scroll = M.scroll;
    if (typeof animate !== "function" || typeof scroll !== "function") {
      throw new Error("motion API missing");
    }
    parEls.forEach(function (el) {
      var section = el.closest("section") || el;
      scroll(animate(el, { y: ["-5%", "6%"] }, { ease: "linear" }), {
        target: section,
        offset: ["start start", "end start"],
      });
    });
    cineEls.forEach(function (el) {
      var img = el.tagName === "IMG" ? el : el.querySelector("img");
      if (!img) return;
      scroll(
        function (progress) {
          paint(img, progress);
        },
        { target: el, offset: ["start end", "center center"] }
      );
    });
  }

  // ---- Fallback: dependency-free rAF loop ---------------------------------
  function initFallback() {
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for (var i = 0; i < cineEls.length; i++) {
        var el = cineEls[i];
        var img = el.tagName === "IMG" ? el : el.querySelector("img");
        if (!img) continue;
        var r = el.getBoundingClientRect();
        paint(img, clamp((vh - r.top) / (vh * 0.5), 0, 1));
      }
      for (var j = 0; j < parEls.length; j++) {
        var pel = parEls[j];
        var section = pel.closest("section") || pel;
        var sr = section.getBoundingClientRect();
        var shift = (-5 + clamp((vh - sr.top) / (vh + sr.height), 0, 1) * 11).toFixed(2);
        pel.style.transform = "translateY(" + shift + "%)";
      }
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("load", update);
    update();
  }

  // Dynamic import() works inside classic scripts in modern browsers.
  try {
    import("https://cdn.jsdelivr.net/npm/motion@11/+esm").then(
      function (M) {
        try {
          initMotion(M);
        } catch (e) {
          initFallback();
        }
      },
      function () {
        initFallback();
      }
    );
  } catch (e) {
    initFallback();
  }
})();

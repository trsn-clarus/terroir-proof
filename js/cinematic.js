/* =============================================================================
 * Terroir & Proof — cinematic image direction (dependency-free)
 * Scroll-linked grayscale→colour resolve + gentle hero parallax.
 * Technique surfaced via 21st.dev "Cinematic Product Scroll Section".
 * Written without any external module so it always runs (no CDN dependency).
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

  function update() {
    ticking = false;
    var vh = window.innerHeight || document.documentElement.clientHeight;

    for (var i = 0; i < cineEls.length; i++) {
      var el = cineEls[i];
      var img = el.tagName === "IMG" ? el : el.querySelector("img");
      if (!img) continue;
      var r = el.getBoundingClientRect();
      // 0 when the frame's top sits at the viewport bottom,
      // 1 by the time its top reaches the middle of the screen.
      var p = clamp((vh - r.top) / (vh - vh * 0.5), 0, 1);
      var g = ((1 - p) * 0.9).toFixed(3);
      var s = (0.5 + p * 0.45).toFixed(3);
      var b = (0.92 + p * 0.08).toFixed(3);
      img.style.filter =
        "grayscale(" + g + ") saturate(" + s + ") contrast(1.06) brightness(" + b + ")";
    }

    for (var j = 0; j < parEls.length; j++) {
      var pel = parEls[j];
      var section = pel.closest("section") || pel;
      var sr = section.getBoundingClientRect();
      var pp = clamp((vh - sr.top) / (vh + sr.height), 0, 1);
      var shift = (-5 + pp * 11).toFixed(2); // -5% → 6%
      pel.style.transform = "translateY(" + shift + "%)";
    }
  }

  var ticking = false;
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
})();

/* =============================================================================
 * Terroir & Proof — kinetic marquee
 * Two serif rows drift in opposite directions and react to scroll velocity:
 * the faster you scroll, the faster (and momentarily reversing) they move.
 * Technique surfaced via 21st.dev "Scroll Velocity Text"; dependency-free rAF.
 * ========================================================================== */
(function () {
  "use strict";

  var rows = [].slice.call(document.querySelectorAll("[data-kinetic]"));
  if (!rows.length) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var state = rows.map(function (row) {
    return {
      row: row,
      x: 0,
      w: 0,
      dir: parseFloat(row.getAttribute("data-dir")) || 1,
    };
  });

  function measure() {
    state.forEach(function (s) {
      var track = s.row.querySelector(".kinetic__track");
      if (track) s.w = track.offsetWidth;
    });
  }
  measure();
  window.addEventListener("load", measure);
  window.addEventListener("resize", measure);

  if (reduce) return; // rows stay static but fully legible

  var lastScroll = window.scrollY || window.pageYOffset || 0;
  var velocity = 0;
  window.addEventListener(
    "scroll",
    function () {
      var y = window.scrollY || window.pageYOffset || 0;
      velocity = y - lastScroll;
      lastScroll = y;
    },
    { passive: true }
  );

  var BASE = 0.6; // constant drift (px/frame)

  function frame() {
    velocity *= 0.9; // decay toward the calm base drift
    var v = velocity;
    if (v > 60) v = 60;
    else if (v < -60) v = -60;

    for (var i = 0; i < state.length; i++) {
      var s = state[i];
      if (!s.w) {
        var t = s.row.querySelector(".kinetic__track");
        s.w = t ? t.offsetWidth : 0;
      }
      s.x += s.dir * (BASE + v * 0.28);
      if (s.w) {
        while (s.x <= -s.w) s.x += s.w;
        while (s.x > 0) s.x -= s.w;
      }
      s.row.style.transform = "translateX(" + s.x.toFixed(2) + "px)";
    }
    window.requestAnimationFrame(frame);
  }
  window.requestAnimationFrame(frame);
})();

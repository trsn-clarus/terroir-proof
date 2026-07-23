/* =============================================================================
 * Terroir & Proof — cinematic image direction (Motion, vanilla)
 * Scroll-linked grayscale→color resolve + gentle hero parallax.
 * Technique surfaced via 21st.dev "Cinematic Product Scroll Section",
 * reimplemented for this static site with Motion's scroll()/animate().
 * ========================================================================== */
import { animate, scroll } from "https://cdn.jsdelivr.net/npm/motion@11/+esm";

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduce) {
  // Gentle parallax — the framed image drifts slower than the page.
  document.querySelectorAll("[data-parallax]").forEach(function (el) {
    var section = el.closest("section") || el;
    scroll(animate(el, { y: ["-5%", "6%"] }, { ease: "linear" }), {
      target: section,
      offset: ["start start", "end start"],
    });
  });

  // Photographs resolve from a desaturated grade into full colour as they
  // rise into frame — one unified nocturnal mood across the whole page.
  document.querySelectorAll("[data-cine]").forEach(function (el) {
    var img = el.tagName === "IMG" ? el : el.querySelector("img");
    if (!img) return;
    scroll(
      function (progress) {
        var g = ((1 - progress) * 0.55).toFixed(3);
        var s = (0.55 + progress * 0.35).toFixed(3);
        var b = (0.95 + progress * 0.05).toFixed(3);
        img.style.filter =
          "grayscale(" + g + ") saturate(" + s + ") contrast(1.05) brightness(" + b + ")";
      },
      { target: el, offset: ["start end", "center center"] }
    );
  });
}

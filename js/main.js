/* =============================================================================
 * Terroir & Proof — rendering and restrained interactions
 * ========================================================================== */
(function () {
  "use strict";

  var products = window.PRODUCTS || [];
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renderCollection() {
    var grid = document.getElementById("collectionGrid");
    if (!grid) return;

    grid.innerHTML = products.map(function (p, i) {
      var no = "No. 0" + (i + 1);
      var pkg =
        '<div class="pcard__pkg" aria-hidden="true">' +
          '<span class="pcard__pkg-mark">T&amp;P</span>' +
          '<span class="pcard__pkg-line"></span>' +
          '<span class="pcard__pkg-no">' + no + '</span>' +
        '</div>';

      var img = p.image
        ? '<img class="pcard__img" src="' + escapeHtml(p.image) + '" alt="' +
          escapeHtml(p.name) + ' 이미지" loading="lazy" ' +
          'onerror="this.closest(\'.pcard\').classList.add(\'is-failed\')" />'
        : "";

      var chip = p.notes && p.notes.caffeine
        ? '<span class="pcard__chip">Caffeine · ' + escapeHtml(p.notes.caffeine) + "</span>"
        : "";

      var action = p.status === "available"
        ? '<button class="btn btn--ghost btn--sm" type="button">자세히 보기</button>'
        : '<span class="pcard__soon">Coming Soon</span>';

      return '' +
        '<article class="pcard reveal" data-reveal data-accent="' + escapeHtml(p.accent || "amber") + '">' +
          '<div class="pcard__visual">' + pkg + img + '</div>' +
          '<div class="pcard__body">' +
            '<span class="pcard__no">' + no + '</span>' +
            '<h3 class="pcard__name">' + escapeHtml(p.name) + '</h3>' +
            '<p class="pcard__sub">' + escapeHtml(p.subtitle) + '</p>' +
            '<p class="pcard__desc">' + escapeHtml(p.description) + '</p>' +
            chip +
            '<div class="pcard__foot">' + action + '</div>' +
          '</div>' +
        '</article>';
    }).join("");
  }

  function renderTaste() {
    var list = document.getElementById("tasteList");
    if (!list) return;

    var rows = [
      { key: "aroma", label: "Aroma" },
      { key: "body", label: "Body" },
      { key: "finish", label: "Finish" },
      { key: "mood", label: "Mood" },
      { key: "caffeine", label: "Caffeine" },
      { key: "bestTime", label: "Best Time" }
    ];

    list.innerHTML = products.map(function (p, i) {
      var notes = p.notes || {};
      var noteHtml = rows.map(function (row) {
        return '' +
          '<div class="tnote">' +
            '<dt class="tnote__label">' + row.label + '</dt>' +
            '<dd class="tnote__val">' + escapeHtml(notes[row.key]) + '</dd>' +
          '</div>';
      }).join("");

      var open = i === 0 ? " is-open" : "";
      var expanded = i === 0 ? "true" : "false";

      return '' +
        '<div class="taste__item' + open + '">' +
          '<button class="taste__head" type="button" aria-expanded="' + expanded + '">' +
            '<span class="taste__no">No. 0' + (i + 1) + '</span>' +
            '<span class="taste__name">' + escapeHtml(p.name) + '</span>' +
            '<span class="taste__icon" aria-hidden="true"></span>' +
          '</button>' +
          '<div class="taste__panel">' +
            '<div><dl class="taste__notes">' + noteHtml + '</dl></div>' +
          '</div>' +
        '</div>';
    }).join("");

    list.querySelectorAll(".taste__head").forEach(function (head) {
      head.addEventListener("click", function () {
        var item = head.parentElement;
        var open = item.classList.toggle("is-open");
        head.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  function initNav() {
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("navMenu");
    var nav = document.getElementById("nav");
    if (!toggle || !menu || !nav) return;

    function close() {
      menu.classList.remove("is-open");
      toggle.classList.remove("is-active");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "메뉴 열기");
    }

    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.classList.toggle("is-active", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", close);
    });

    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 18);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initReveal() {
    var els = document.querySelectorAll("[data-reveal]");

    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    els.forEach(function (el) { io.observe(el); });
  }

  function init() {
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    renderCollection();
    renderTaste();
    initNav();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

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

      var img = p.image
        ? '<img class="pcard__img" src="' + escapeHtml(p.image) + '" alt="' +
          escapeHtml(p.name) + ' 이미지" loading="lazy" ' +
          'onerror="this.closest(\'.pcard\').classList.add(\'is-failed\')" />'
        : "";

      var chip = p.notes && p.notes.caffeine
        ? '<span class="pcard__chip">Caffeine · ' + escapeHtml(p.notes.caffeine) + "</span>"
        : "";

      var action = p.status === "available"
        ? '<a class="pcard__buy" href="' + escapeHtml(p.buyUrl || "#") + '" target="_blank" rel="noopener">구매하기 &rarr;</a>'
        : '<span class="pcard__soon">Coming Soon</span>';

      // Hover-reveal tasting notes over the product image (21st "Product Reveal Card").
      var notes = p.notes || {};
      var noteRows = [
        ["Aroma", notes.aroma],
        ["Body", notes.body],
        ["Finish", notes.finish],
        ["Mood", notes.mood],
        ["Caffeine", notes.caffeine],
        ["Best Time", notes.bestTime]
      ]
        .filter(function (r) { return r[1]; })
        .map(function (r) {
          return "<div><dt>" + r[0] + "</dt><dd>" + escapeHtml(r[1]) + "</dd></div>";
        })
        .join("");
      var reveal =
        '<div class="pcard__reveal">' +
          '<span class="pcard__reveal-label">Tasting Notes</span>' +
          '<dl class="pcard__reveal-notes">' + noteRows + "</dl>" +
        "</div>";

      return '' +
        '<article class="pcard reveal" data-reveal data-accent="' + escapeHtml(p.accent || "amber") + '">' +
          '<div class="pcard__visual" tabindex="0">' + img + reveal + '</div>' +
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
        if (open) {
          item.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
        }
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

    var groups = {};
    els.forEach(function (el) {
      var section = el.closest("section") || el.parentElement || document.body;
      if (!section.dataset.revealGroup) {
        section.dataset.revealGroup = "reveal-" + Object.keys(groups).length;
      }
      var key = section.dataset.revealGroup;
      groups[key] = groups[key] || [];
      groups[key].push(el);
    });

    Object.keys(groups).forEach(function (key) {
      groups[key].forEach(function (el, i) {
        el.style.setProperty("--reveal-delay", Math.min(i * 90, 360) + "ms");
      });
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    function show(el, io) {
      el.classList.add("is-in");
      if (io) io.unobserve(el);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        show(entry.target, io);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    els.forEach(function (el) { io.observe(el); });

    function revealVisible() {
      els.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) show(el, io);
      });
    }

    function revealHashTarget() {
      if (!window.location.hash) return;
      var target = document.getElementById(window.location.hash.slice(1));
      if (!target) return;
      target.querySelectorAll("[data-reveal]").forEach(function (el) { show(el, io); });
    }

    revealVisible();
    revealHashTarget();
    window.addEventListener("load", revealVisible, { once: true });
    window.addEventListener("load", revealHashTarget, { once: true });
    window.addEventListener("hashchange", revealHashTarget);
    window.setTimeout(function () {
      revealVisible();
      revealHashTarget();
    }, 180);
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

/* =============================================================================
 * Terroir & Proof — 인터랙션 & 렌더링
 *  - 제품 데이터(window.PRODUCTS)로 Collection / Taste Notes 렌더링
 *  - 모바일 네비게이션 토글
 *  - 스크롤 reveal 애니메이션 (IntersectionObserver)
 *  - 제품 카드 hover 3D tilt
 *  - 스크롤 시 네비 배경
 * ========================================================================== */
(function () {
  "use strict";

  var products = window.PRODUCTS || [];

  /* TODO 문자열인지 판별 (화면에 "확인 필요" 뱃지로 표시) */
  function isTodo(value) {
    return typeof value !== "string" || /^todo/i.test(value.trim());
  }

  /* 안전한 텍스트 출력: TODO 값이면 '확인 필요' 표시 */
  function safeText(value) {
    return isTodo(value) ? "확인 필요" : value;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* -------------------------------------------------------------------------
   * Collection 카드 렌더링
   * ---------------------------------------------------------------------- */
  function renderCollection() {
    var grid = document.getElementById("collectionGrid");
    if (!grid) return;

    grid.innerHTML = products.map(function (p, i) {
      var nameTodo = isTodo(p.name);
      var caffeineKnown = !isTodo(p.notes && p.notes.caffeine);

      // 이미지가 실제로 있으면 <img>, 없으면 CSS 패키지 placeholder
      var visual = p.image
        ? '<img class="pcard__img" src="' + escapeHtml(p.image) + '" alt="' +
            escapeHtml(safeText(p.name)) + ' 패키지" loading="lazy" />'
        : '<div class="pcard__pkg" aria-hidden="true">' +
            '<span class="pcard__pkg-mark">T&amp;P</span>' +
            '<span class="pcard__pkg-line"></span>' +
            '<span class="pcard__pkg-no">No. 0' + (i + 1) + '</span>' +
          '</div>';

      var btn = p.status === "available"
        ? '<button class="btn btn--ghost btn--sm" type="button">자세히 보기</button>'
        : '<span class="pcard__soon">Coming Soon</span>';

      var caffeineChip = caffeineKnown
        ? '<span class="pcard__chip">Caffeine · ' + escapeHtml(p.notes.caffeine) + "</span>"
        : "";

      return '' +
        '<article class="pcard reveal" data-reveal data-tilt data-accent="' +
          escapeHtml(p.accent || "amber") + '" style="--d:' + (i * 0.1).toFixed(2) + 's">' +
          '<div class="pcard__visual">' + visual + '</div>' +
          '<div class="pcard__body">' +
            '<span class="pcard__no">No. 0' + (i + 1) + '</span>' +
            '<h3 class="pcard__name' + (nameTodo ? " is-todo" : "") + '">' +
              escapeHtml(safeText(p.name)) + "</h3>" +
            '<p class="pcard__sub">' + escapeHtml(safeText(p.subtitle)) + "</p>" +
            '<p class="pcard__desc">' + escapeHtml(safeText(p.description)) + "</p>" +
            caffeineChip +
            '<div class="pcard__foot">' + btn + "</div>" +
          "</div>" +
        "</article>";
    }).join("");
  }

  /* -------------------------------------------------------------------------
   * Taste Notes 아코디언 렌더링
   * ---------------------------------------------------------------------- */
  function renderTaste() {
    var list = document.getElementById("tasteList");
    if (!list) return;

    var rows = [
      { key: "aroma", label: "Aroma" },
      { key: "body", label: "Body" },
      { key: "finish", label: "Finish" },
      { key: "mood", label: "Mood" },
      { key: "caffeine", label: "Caffeine Level" },
      { key: "bestTime", label: "Best Time" }
    ];

    list.innerHTML = products.map(function (p, i) {
      var n = p.notes || {};
      var notesHtml = rows.map(function (r) {
        var val = n[r.key];
        var todo = isTodo(val);
        return '' +
          '<div class="tnote">' +
            '<dt class="tnote__label">' + r.label + "</dt>" +
            '<dd class="tnote__val' + (todo ? " is-todo" : "") + '">' +
              escapeHtml(safeText(val)) + "</dd>" +
          "</div>";
      }).join("");

      var open = i === 0 ? " is-open" : "";
      var expanded = i === 0 ? "true" : "false";

      return '' +
        '<div class="taste__item reveal' + open + '" data-reveal>' +
          '<button class="taste__head" type="button" aria-expanded="' + expanded + '">' +
            '<span class="taste__no">No. 0' + (i + 1) + '</span>' +
            '<span class="taste__name' + (isTodo(p.name) ? " is-todo" : "") + '">' +
              escapeHtml(safeText(p.name)) + "</span>" +
            '<span class="taste__icon" aria-hidden="true"></span>' +
          "</button>" +
          '<div class="taste__panel">' +
            '<dl class="taste__grid">' + notesHtml + "</dl>" +
          "</div>" +
        "</div>";
    }).join("");

    // 아코디언 토글
    list.querySelectorAll(".taste__head").forEach(function (head) {
      head.addEventListener("click", function () {
        var item = head.parentElement;
        var open = item.classList.toggle("is-open");
        head.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  /* -------------------------------------------------------------------------
   * 모바일 네비게이션
   * ---------------------------------------------------------------------- */
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

    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });

    // 스크롤 시 네비 배경 강화
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* -------------------------------------------------------------------------
   * 스크롤 reveal
   * ---------------------------------------------------------------------- */
  function initReveal() {
    var els = document.querySelectorAll("[data-reveal]");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    els.forEach(function (el) { io.observe(el); });
  }

  /* -------------------------------------------------------------------------
   * 제품 카드 3D tilt (미세하게)
   * ---------------------------------------------------------------------- */
  function initTilt() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return; // 터치 기기 제외

    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--rx", (py * -5).toFixed(2) + "deg");
        card.style.setProperty("--ry", (px * 6).toFixed(2) + "deg");
      });
      card.addEventListener("mouseleave", function () {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* -------------------------------------------------------------------------
   * Init
   * ---------------------------------------------------------------------- */
  function init() {
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    renderCollection();
    renderTaste();
    initNav();
    initTilt();   // tilt는 렌더 직후 카드에 바인딩
    initReveal(); // 동적 생성된 [data-reveal] 포함
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

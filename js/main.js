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
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

      // CSS 패키지 placeholder는 항상 뒤에 깔리고, 이미지가 있으면 그 위에 덮입니다.
      // 이미지 로딩 실패 시 .pcard 에 is-failed 가 붙어 자동으로 placeholder가 노출됩니다.
      var pkg =
        '<div class="pcard__pkg" aria-hidden="true">' +
          '<span class="pcard__pkg-mark">T&amp;P</span>' +
          '<span class="pcard__pkg-line"></span>' +
          '<span class="pcard__pkg-no">No. 0' + (i + 1) + '</span>' +
        '</div>';

      var imgAlt = isTodo(p.name) ? "떼루아앤프루프 블렌딩 티" : p.name;
      var img = p.image
        ? '<img class="pcard__img" src="' + escapeHtml(p.image) + '" alt="' +
            escapeHtml(imgAlt) + ' 이미지" loading="lazy" ' +
            'onerror="this.closest(\'.pcard\').classList.add(\'is-failed\')" />'
        : "";

      var visual = pkg + img;

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

    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    // 섹션마다 reveal 요소에 계단식 지연(--d)을 자동 부여 →
    // 섹션에 들어설 때마다 콘텐츠가 순차적으로 "조립되듯" 등장(임팩트↑).
    // 이미 인라인으로 --d 가 지정된 요소(히어로 문구·카드 스태거)는 그대로 둡니다.
    var groups = document.querySelectorAll("section, .footer");
    groups.forEach(function (group) {
      var items = group.querySelectorAll("[data-reveal]");
      var step = 0;
      items.forEach(function (el) {
        if (el.style.getPropertyValue("--d")) return; // 명시 지연 존중
        el.style.setProperty("--d", (step * 0.09).toFixed(2) + "s");
        step += 1;
      });
    });

    // 슬라이드처럼 재진입할 때마다 다시 연출되도록 토글
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add("is-in");
        else entry.target.classList.remove("is-in");
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });

    els.forEach(function (el) { io.observe(el); });
  }

  /* -------------------------------------------------------------------------
   * 우측 도트 내비게이션 — 현재 보고 있는 섹션 표시
   * ---------------------------------------------------------------------- */
  function initSlideNav() {
    var dots = document.querySelectorAll(".slidenav__dot");
    if (!dots.length || !("IntersectionObserver" in window)) return;

    var map = {};
    dots.forEach(function (d) { map[d.getAttribute("data-target")] = d; });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var dot = map[entry.target.id];
        if (!dot) return;
        dots.forEach(function (d) { d.classList.remove("is-active"); });
        dot.classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  /* -------------------------------------------------------------------------
   * 패럴럭스 — 사진이 프레임 안에서 살짝 다른 속도로 움직임(깊이감)
   * ---------------------------------------------------------------------- */
  function initParallax() {
    if (reduceMotion) return;
    var els = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
    if (!els.length) return;
    var ticking = false;

    function update() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var delta = (r.top + r.height / 2) - vh / 2;
        var f = parseFloat(el.getAttribute("data-parallax")) || 0;
        el.style.setProperty("--py", (delta * f).toFixed(1) + "px");
      });
      ticking = false;
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  /* -------------------------------------------------------------------------
   * 3D 패키지 — 천천히 회전 + 마우스 반응 (화면 밖이면 일시정지)
   * ---------------------------------------------------------------------- */
  function initPackage() {
    var pkg = document.querySelector("[data-pkg]");
    if (!pkg) return;
    var scene = pkg.closest(".scene3d") || pkg;

    if (reduceMotion) {
      pkg.style.setProperty("--rx", "-14deg");
      pkg.style.setProperty("--ry", "-28deg");
      return;
    }

    var spin = 0, mx = 0, my = 0, visible = true;

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { visible = e.isIntersecting; });
      }, { threshold: 0 }).observe(scene);
    }

    scene.addEventListener("pointermove", function (e) {
      var r = scene.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
    });
    scene.addEventListener("pointerleave", function () { mx = 0; my = 0; });

    function frame() {
      if (visible) spin += 0.25;                 // 자동 회전 속도
      var rx = -12 + my * -16;
      var ry = spin + mx * 28;
      pkg.style.setProperty("--rx", rx.toFixed(2) + "deg");
      pkg.style.setProperty("--ry", ry.toFixed(2) + "deg");
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
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
    initTilt();      // tilt는 렌더 직후 카드에 바인딩
    initReveal();    // 동적 생성된 [data-reveal] 포함
    initSlideNav();  // 우측 도트 내비 활성화
    initParallax();  // 사진 깊이감(패럴럭스)
    initPackage();   // 3D 패키지 회전 + 마우스 반응
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

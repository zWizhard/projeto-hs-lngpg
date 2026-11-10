/* =========================================================================
   PROJETO HS — INTERAÇÕES DA LANDING PAGE
   Sem dependências externas. A URL do checkout vem de config.js.
   ========================================================================= */
(function () {
  "use strict";

  var CONFIG = window.HS_CONFIG || {};
  var CHECKOUT_URL = String(CONFIG.CHECKOUT_URL || "").trim();
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------
     Analytics: ponto de integração único.
     Só envia eventos quando ANALYTICS_ENABLED = true em config.js
     (depois do consentimento e da configuração real das ferramentas).
     --------------------------------------------------------------- */
  function track(eventName, data) {
    if (!CONFIG.ANALYTICS_ENABLED) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: eventName }, data || {}));
  }

  /* ---------------------------------------------------------------
     Preços e Black Friday (valores em config.js → BLACK_FRIDAY)
     --------------------------------------------------------------- */
  var BF = CONFIG.BLACK_FRIDAY || {};
  var priceRegular = Number(BF.PRICE_REGULAR) || 0;
  var pricePromo = Number(BF.PRICE_PROMO) || 29.90;
  var endsAt = BF.ENDS_AT ? new Date(BF.ENDS_AT) : null;
  var now = new Date();
  /* Prévia visual (#previa-black-friday): mostra a oferta mesmo sem a
     âncora confirmada, sempre com aviso visível de que é só prévia. */
  var bfPreview = window.location.hash === "#previa-black-friday";
  var anchorOk = BF.REGULAR_PRICE_WAS_PRACTICED === true && priceRegular > pricePromo;
  var beforeEnd = !endsAt || isNaN(endsAt) ? false : now < endsAt;
  var bfActive = BF.ENABLED === true && (anchorOk || (bfPreview && priceRegular > pricePromo)) && beforeEnd;
  var promoEnded = BF.ENABLED === true && anchorOk && !beforeEnd;
  var currentPrice = bfActive ? pricePromo : (promoEnded ? priceRegular : pricePromo);

  function brl(n) { return n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  function applyPricing() {
    var off = priceRegular > 0 ? Math.floor((1 - pricePromo / priceRegular) * 100) : 0;
    var values = { current: brl(currentPrice), regular: brl(priceRegular), promo: brl(pricePromo), saving: brl(priceRegular - pricePromo), off: String(off) };
    document.querySelectorAll("[data-price]").forEach(function (el) {
      var v = values[el.getAttribute("data-price")];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll("[data-bf-label]").forEach(function (el) { if (BF.LABEL) el.textContent = BF.LABEL; });
    if (endsAt && !isNaN(endsAt)) {
      var parts = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(endsAt);
      var p = {}; parts.forEach(function (x) { p[x.type] = x.value; });
      var label = p.day + "/" + p.month + " às " + p.hour + ":" + p.minute;
      document.querySelectorAll("[data-bf-end]").forEach(function (el) { el.textContent = label; el.setAttribute("datetime", BF.ENDS_AT); });
    }

    document.querySelectorAll("[data-bf]").forEach(function (el) { el.hidden = !bfActive; });
    document.querySelectorAll("[data-bf-hide]").forEach(function (el) { el.hidden = bfActive; });
    document.documentElement.classList.toggle("is-bf", bfActive);

    var ctaText = bfActive
      ? "GARANTIR MEU PROJETO HS POR R$" + values.promo
      : null;
    document.querySelectorAll(".js-checkout").forEach(function (a) {
      if (ctaText) a.textContent = ctaText;
      else a.textContent = a.textContent.replace(/R\$\s?\d+,\d{2}/, "R$" + values.current);
    });

    /* Headline promocional só quando o preço é de fato menor que a metade. */
    var h1 = document.getElementById("hero-title");
    var tpl = document.getElementById("bf-headline");
    if (bfActive && h1 && tpl && pricePromo < priceRegular / 2) {
      h1.innerHTML = tpl.innerHTML;
      h1.classList.add("hero__title--bf");
    }

    if (bfPreview && !anchorOk && bfActive) {
      var note = document.createElement("div");
      note.className = "dev-banner dev-banner--preview";
      note.setAttribute("role", "status");
      note.innerHTML = "<strong>Prévia da Black Friday:</strong> o preço anterior riscado ainda não foi confirmado. Visitantes só veem esta oferta quando <code>REGULAR_PRICE_WAS_PRACTICED</code> = <code>true</code> em <code>config.js</code>.";
      document.body.insertBefore(note, document.body.firstChild);
    }
  }
  applyPricing();
  window.addEventListener("hashchange", function () { if (!bfPreview && window.location.hash === "#previa-black-friday") window.location.reload(); });

  /* ---------------------------------------------------------------
     Toast
     --------------------------------------------------------------- */
  var toastEl = document.getElementById("toast");
  var toastTimer;
  function toast(html) {
    if (!toastEl) return;
    toastEl.innerHTML = html;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 5000);
  }

  /* ---------------------------------------------------------------
     Checkout: todos os CTAs usam a mesma CHECKOUT_URL.
     Parâmetros UTM da visita são repassados ao checkout.
     --------------------------------------------------------------- */
  function isValidUrl(u) {
    try { var p = new URL(u); return p.protocol === "https:"; } catch (e) { return false; }
  }

  function buildCheckoutUrl() {
    var url = new URL(CHECKOUT_URL);
    try {
      var params = new URLSearchParams(window.location.search);
      params.forEach(function (value, key) {
        if (/^(utm_|src$|sck$)/i.test(key) && !url.searchParams.has(key)) url.searchParams.set(key, value);
      });
    } catch (e) { /* sem parâmetros */ }
    return url.toString();
  }

  var ctas = document.querySelectorAll(".js-checkout");
  var checkoutReady = isValidUrl(CHECKOUT_URL);

  if (checkoutReady) {
    var finalUrl = buildCheckoutUrl();
    ctas.forEach(function (a) {
      a.href = finalUrl;
      if (CONFIG.CHECKOUT_SAME_TAB === false) { a.target = "_blank"; a.rel = "noopener"; }
      a.addEventListener("click", function () {
        track("begin_checkout", { cta_location: a.dataset.cta, value: 29.90, currency: "BRL" });
      });
    });
  } else {
    var banner = document.getElementById("dev-banner");
    if (banner) banner.hidden = false;
    if (CHECKOUT_URL) console.warn("[Projeto HS] CHECKOUT_URL inválida (use https://):", CHECKOUT_URL);
    else console.warn("[Projeto HS] CHECKOUT_URL não configurada em config.js");
    ctas.forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        toast("<strong>Checkout não configurado.</strong> Defina <code>CHECKOUT_URL</code> em <code>config.js</code>. Nenhuma compra foi iniciada. (botão: " + (a.dataset.cta || "cta") + ")");
      });
    });
  }

  /* ---------------------------------------------------------------
     14 dias: seleção de cartão
     --------------------------------------------------------------- */
  var dayButtons = Array.prototype.slice.call(document.querySelectorAll(".day"));
  var dp = {
    num: document.getElementById("dp-num"),
    day: document.getElementById("dp-day"),
    title: document.getElementById("dp-title"),
    mission: document.getElementById("dp-mission"),
    detail: document.getElementById("dp-detail"),
    bar: document.getElementById("dp-bar")
  };
  function selectDay(btn) {
    dayButtons.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
    var d = btn.dataset;
    dp.num.textContent = d.day;
    dp.day.textContent = d.day;
    dp.title.textContent = d.title;
    dp.mission.textContent = d.mission;
    dp.detail.textContent = d.detail;
    dp.bar.style.width = (parseInt(d.day, 10) / 14 * 100).toFixed(2) + "%";
  }
  dayButtons.forEach(function (btn, i) {
    btn.addEventListener("click", function () { selectDay(btn); track("view_day", { day: btn.dataset.day }); });
    btn.addEventListener("keydown", function (e) {
      var k = e.key, next = null;
      if (k === "ArrowRight") next = dayButtons[Math.min(i + 1, dayButtons.length - 1)];
      if (k === "ArrowLeft") next = dayButtons[Math.max(i - 1, 0)];
      if (next) { e.preventDefault(); next.focus(); selectDay(next); }
    });
  });

  /* ---------------------------------------------------------------
     Galeria: rolagem nativa (toque) + botões + contador
     --------------------------------------------------------------- */
  var gallery = document.querySelector("[data-gallery]");
  if (gallery) {
    var track_ = gallery.querySelector(".gallery__track");
    var shots = Array.prototype.slice.call(track_.querySelectorAll(".shot"));
    var prev = gallery.querySelector("[data-prev]");
    var next = gallery.querySelector("[data-next]");
    var cur = gallery.querySelector("[data-current]");
    gallery.querySelector("[data-total]").textContent = shots.length;

    function currentIndex() {
      var left = track_.scrollLeft, best = 0, bestD = Infinity;
      shots.forEach(function (s, i) {
        var d = Math.abs(s.offsetLeft - track_.offsetLeft - left);
        if (d < bestD) { bestD = d; best = i; }
      });
      return best;
    }
    function update() {
      var i = currentIndex();
      var atEnd = track_.scrollLeft + track_.clientWidth >= track_.scrollWidth - 4;
      cur.textContent = atEnd ? shots.length : i + 1;
      prev.disabled = track_.scrollLeft <= 4;
      next.disabled = atEnd;
    }
    function go(dir) {
      var i = currentIndex() + dir;
      i = Math.max(0, Math.min(shots.length - 1, i));
      track_.scrollTo({ left: shots[i].offsetLeft - track_.offsetLeft, behavior: reduceMotion ? "auto" : "smooth" });
    }
    prev.addEventListener("click", function () { go(-1); });
    next.addEventListener("click", function () { go(1); });
    track_.addEventListener("scroll", function () { window.requestAnimationFrame(update); }, { passive: true });
    track_.addEventListener("keydown", function (e) {
      if (e.target !== track_) return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    });
    window.addEventListener("resize", update);
    update();

    /* Lightbox */
    var lb = document.getElementById("lightbox");
    var lbImg = document.getElementById("lightbox-img");
    var lastTrigger = null;
    gallery.querySelectorAll(".shot__btn").forEach(function (b) {
      b.addEventListener("click", function () {
        var img = b.querySelector("img");
        lbImg.src = b.dataset.full;
        lbImg.alt = img.alt;
        lastTrigger = b;
        if (typeof lb.showModal === "function") lb.showModal();
        else window.open(b.dataset.full, "_blank", "noopener");
        track("view_preview", { page: img.alt });
      });
    });
    lb.querySelector("[data-close]").addEventListener("click", function () { lb.close(); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener("close", function () { if (lastTrigger) lastTrigger.focus(); });
  }

  /* ---------------------------------------------------------------
     Barra de compra fixa (mobile): aparece depois do hero e some
     quando a oferta ou o CTA final estão visíveis.
     --------------------------------------------------------------- */
  var sticky = document.getElementById("sticky-cta");
  if (sticky && "IntersectionObserver" in window) {
    var stickyLink = sticky.querySelector("a");
    var heroBuy = document.querySelector(".hero .buy");
    var blockers = [document.getElementById("oferta"), document.querySelector(".final"), document.querySelector(".footer")];
    var state = { heroVisible: true, blockersVisible: new Set() };
    function render() {
      var show = !state.heroVisible && state.blockersVisible.size === 0;
      sticky.classList.toggle("is-visible", show);
      sticky.setAttribute("aria-hidden", show ? "false" : "true");
      stickyLink.tabIndex = show ? 0 : -1;
    }
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { state.heroVisible = en.isIntersecting || en.boundingClientRect.top > 0; });
      render();
    }).observe(heroBuy);
    var bo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) state.blockersVisible.add(en.target); else state.blockersVisible.delete(en.target);
      });
      render();
    });
    blockers.forEach(function (b) { if (b) bo.observe(b); });
  }

  /* FAQ: evento opcional de analytics */
  document.querySelectorAll(".faq details").forEach(function (d) {
    d.addEventListener("toggle", function () { if (d.open) track("faq_open", { question: d.querySelector("summary").textContent }); });
  });
})();

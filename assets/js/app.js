/* =========================================================
   VERSION 3 – UI
   ---------------------------------------------------------
   Шапка, бургер-меню, появление блоков,
   счётчики, аккордеон, горизонтальные ленты со стрелками,
   sticky-картинки, выбор типа авто для цен, лайтбокс.
========================================================= */

(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const reduceMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;


  /* =======================================================
     HEADER
  ======================================================= */

  const top = $("[data-top]");

  function onScroll() {
    top?.classList.toggle("is-scrolled", window.scrollY > 20);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();


  /* Passt die Navigation nicht in die Zeile, wird sie
     ausgeblendet und stattdessen das Burger-Menü gezeigt. */

  const topNav = $(".top-nav", top || document);
  const topActions = $(".top-actions", top || document);

  function fitNav() {
    if (!top || !topNav || !topActions) {
      return;
    }

    top.classList.remove("is-compact");

    const links = $$("a", topNav);
    const last = links[links.length - 1];
    const visible = getComputedStyle(topNav).display !== "none";

    const fits =
      visible &&
      last &&
      last.getBoundingClientRect().right <= topActions.getBoundingClientRect().left - 20;

    top.classList.toggle("is-compact", !fits);
  }

  window.addEventListener("resize", fitNav);
  document.fonts?.ready.then(fitNav);
  fitNav();


  /* Standort-Auswahl schließen */

  const loc = $("[data-loc]");

  document.addEventListener("click", (event) => {
    if (loc?.open && !loc.contains(event.target)) {
      loc.open = false;
    }
  });


  /* =======================================================
     BURGER-MENÜ
  ======================================================= */

  const sheet = $("[data-sheet]");
  const sheetButtons = $$("[data-sheet-open]");
  let sheetOpen = null;

  function setSheet(open) {
    if (!sheet) {
      return;
    }

    sheet.hidden = !open;
    document.body.classList.toggle("no-scroll", open);
    top?.classList.toggle("is-menu-open", open);
    sheetButtons.forEach((button) => {
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    });

    if (open) {
      $(".sheet-nav a", sheet)?.focus({ preventScroll: true });
    }
  }

  sheetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      sheetOpen = button;
      setSheet(sheet.hidden);
    });
  });

  $$("[data-sheet-close], .sheet a", sheet || document.createElement("div"))
    .forEach((element) => element.addEventListener("click", () => setSheet(false)));

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (sheet && !sheet.hidden) {
      setSheet(false);
      sheetOpen?.focus();
    }

    if (loc?.open) {
      loc.open = false;
    }
  });


  /* =======================================================
     REVEAL + ZÄHLER (Positionsprüfung)
  ======================================================= */

  let pending = $$("[data-reveal], [data-count]");

  function runCounter(element) {
    const target = parseFloat(element.dataset.count);
    const decimals = (element.dataset.count.split(".")[1] || "").length;
    const suffix = element.dataset.suffix || "";
    const start = performance.now();

    function frame(now) {
      const progress = Math.min(1, (now - start) / 1400);
      const eased = 1 - Math.pow(1 - progress, 3);

      element.textContent =
        (target * eased).toFixed(decimals).replace(".", ",") + suffix;

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  function checkReveal() {
    pending = pending.filter((element) => {
      const rect = element.getBoundingClientRect();

      if (rect.top > window.innerHeight * 0.92 || rect.bottom < 0) {
        return true;
      }

      if (element.matches("[data-reveal]")) {
        element.classList.add("is-in");
      }

      if (element.matches("[data-count]") && !reduceMotion) {
        runCounter(element);
      }

      return false;
    });
  }

  let tick = false;

  function queue() {
    if (!tick) {
      tick = true;
      setTimeout(() => {
        tick = false;
        checkReveal();
      }, 60);
    }
  }

  if (reduceMotion) {
    $$("[data-reveal]").forEach((element) => element.classList.add("is-in"));
  }

  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  window.addEventListener("load", checkReveal);
  checkReveal();


  /* =======================================================
     NACH OBEN
     #top ist die fixierte Kopfzeile – der Browser scrollt
     dorthin nicht, deshalb per Script nach ganz oben.
  ======================================================= */

  $$("[data-to-top]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });


  /* =======================================================
     JAHR
  ======================================================= */

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  /* =======================================================
     AKKORDEON: immer nur ein Element offen
     <div data-accordion> <details> …
  ======================================================= */

  $$("[data-accordion]").forEach((group) => {
    const items = $$(":scope > details", group);

    items.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (item.open) {
          items.forEach((other) => {
            if (other !== item) {
              other.open = false;
            }
          });
        }
      });
    });
  });


  /* =======================================================
     HORIZONTALE LISTE MIT PFEILEN
     <div data-hscroll> <div data-hscroll-track> …
       <button data-hscroll-prev> <button data-hscroll-next>
  ======================================================= */

  $$("[data-hscroll]").forEach((wrap) => {
    const track = $("[data-hscroll-track]", wrap);
    const prev = $("[data-hscroll-prev]", wrap);
    const next = $("[data-hscroll-next]", wrap);
    const bar = $("[data-hscroll-bar]", wrap);

    function step() {
      const first = track.firstElementChild;
      return first ? first.getBoundingClientRect().width + 16 : 300;
    }

    function update() {
      const max = track.scrollWidth - track.clientWidth;

      track.classList.toggle("at-start", track.scrollLeft <= 4);
      track.classList.toggle("at-end", track.scrollLeft >= max - 4);

      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = track.scrollLeft >= max - 4;
      if (bar) bar.style.width = `${max > 0 ? (track.scrollLeft / max) * 70 + 30 : 100}%`;
    }

    prev?.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
    next?.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });


  /* =======================================================
     STICKY-STORY: Bild wechselt mit dem Textblock
     <div data-story> <img data-story-img="a"> …
       <article data-story-step="a"> …
  ======================================================= */

  $$("[data-story]").forEach((story) => {
    const steps = $$("[data-story-step]", story);
    const images = $$("[data-story-img]", story);
    const label = $(".story-label", story);

    function update() {
      const middle = window.innerHeight * 0.5;
      let active = steps[0];

      steps.forEach((step) => {
        if (step.getBoundingClientRect().top < middle) {
          active = step;
        }
      });

      const key = active?.dataset.storyStep;

      if (label && active?.dataset.storyLabel) {
        label.textContent = active.dataset.storyLabel;
      }

      images.forEach((image) => {
        image.classList.toggle("is-active", image.dataset.storyImg === key);
      });

      steps.forEach((step) => {
        step.classList.toggle("is-active", step === active);
      });
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
  });


  /* =======================================================
     PREISE NACH FAHRZEUGTYP
     <select data-car-select> + <strong data-prices='{"suv":350}'>
  ======================================================= */

  $$("[data-car-select]").forEach((select) => {
    const scope = select.closest("[data-car-scope]") || document;

    function update() {
      $$("[data-prices]", scope).forEach((target) => {
        const value = JSON.parse(target.dataset.prices)[select.value];

        if (value != null) {
          target.textContent = `${value}€`;
          target.animate?.(
            [{ transform: "translateY(-8px)", opacity: 0.3 }, { transform: "none", opacity: 1 }],
            { duration: 300, easing: "ease-out" }
          );
        }
      });
    }

    select.addEventListener("change", update);
  });


  /* =======================================================
     LIGHTBOX
  ======================================================= */

  const shots = $$("[data-lightbox]");

  if (shots.length) {
    const box = document.createElement("div");

    box.className = "lbox";
    box.hidden = true;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Bildansicht");
    box.innerHTML = `
      <button type="button" class="lbox-btn lbox-close" aria-label="Schließen">×</button>
      <button type="button" class="lbox-btn lbox-prev" aria-label="Vorheriges Bild">‹</button>
      <img alt="">
      <button type="button" class="lbox-btn lbox-next" aria-label="Nächstes Bild">›</button>
    `;

    document.body.append(box);

    const image = $("img", box);
    let index = 0;

    const show = (n) => {
      index = (n + shots.length) % shots.length;
      image.src = shots[index].currentSrc || shots[index].src;
      image.alt = shots[index].alt;
    };

    const close = () => {
      box.hidden = true;
      document.body.classList.remove("no-scroll");
    };

    shots.forEach((shot, i) => {
      shot.tabIndex = 0;
      shot.setAttribute("role", "button");

      const open = () => {
        show(i);
        box.hidden = false;
        document.body.classList.add("no-scroll");
        $(".lbox-close", box).focus();
      };

      shot.addEventListener("click", open);
      shot.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      });
    });

    $(".lbox-close", box).addEventListener("click", close);
    $(".lbox-prev", box).addEventListener("click", () => show(index - 1));
    $(".lbox-next", box).addEventListener("click", () => show(index + 1));
    box.addEventListener("click", (event) => {
      if (event.target === box) close();
    });

    document.addEventListener("keydown", (event) => {
      if (box.hidden) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") show(index - 1);
      if (event.key === "ArrowRight") show(index + 1);
    });
  }

})();

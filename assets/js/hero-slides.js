/* =========================================================
   HERO – WECHSELNDE TEXTE
   ---------------------------------------------------------
   Alle Folien liegen übereinander (CSS-Grid), damit beim
   Wechsel nichts springt. Alle INTERVAL ms die nächste Folie.
   Pausiert, wenn der Tab im Hintergrund ist.
   Bei „Bewegung reduzieren“ bleibt die erste Folie stehen.
========================================================= */

(() => {
  "use strict";

  const INTERVAL = 8000;   // Zeit pro Text (Lesezeit)
  const OUT_TIME = 650;    // Ausblenden, danach kommt der neue Text

  const box = document.querySelector("[data-hero-slides]");

  if (!box) {
    return;
  }

  const slides = [...box.querySelectorAll("[data-hero-slide]")];
  const dotsBox = document.querySelector("[data-hero-dots]");
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (slides.length < 2) {
    return;
  }

  let index = 0;
  let timer = null;
  let busy = false;

  /* Kleine Linien unter den Buttons: zeigen und wählen die Folie */
  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.className = "hero-dot";
    dot.setAttribute("aria-label", `Text ${i + 1} von ${slides.length}`);
    dot.innerHTML = "<i></i>";
    dot.addEventListener("click", () => {
      show(i);
      restart();
    });
    dotsBox?.append(dot);

    return dot;
  });

  box.style.setProperty("--hero-interval", `${INTERVAL}ms`);

  function markDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
      dot.setAttribute("aria-current", i === index ? "true" : "false");
    });

    /* Fortschritts-Animation neu starten */
    const bar = dots[index]?.querySelector("i");

    if (bar) {
      bar.style.animation = "none";
      void bar.offsetWidth;
      bar.style.animation = "";
    }
  }

  function show(next) {
    if (next === index || busy) {
      return;
    }

    busy = true;

    const current = slides[index];
    const target = slides[next];

    current.classList.add("is-leaving");
    current.classList.remove("is-active");
    current.setAttribute("aria-hidden", "true");

    index = next;
    markDots();

    setTimeout(() => {
      current.classList.remove("is-leaving");
      target.classList.add("is-active");
      target.removeAttribute("aria-hidden");
      busy = false;
    }, OUT_TIME);
  }

  function step() {
    show((index + 1) % slides.length);
  }

  function restart() {
    clearInterval(timer);

    if (!calm && !document.hidden) {
      timer = setInterval(step, INTERVAL);
    }
  }

  document.addEventListener("visibilitychange", () => {
    box.classList.toggle("is-paused", document.hidden);
    restart();
    if (!document.hidden) markDots();
  });

  if (calm) {
    box.classList.add("is-paused");
    dotsBox?.setAttribute("hidden", "");
    return;
  }

  markDots();
  restart();
})();

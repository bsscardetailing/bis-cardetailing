/* =========================================================
   BLACK WEEK – Countdown + automatisches Ausblenden
   ---------------------------------------------------------
   Vor dem Start:  „Startet in …“
   Während:        „Endet in …“
   Danach:         alle Elemente mit data-promo verschwinden
   Zeiten in deutscher Zeit (MEZ, +01:00).
========================================================= */

(() => {
  "use strict";

  const START = new Date("2026-11-23T00:00:00+01:00").getTime();
  const END = new Date("2026-11-30T23:59:59+01:00").getTime();

  const promos = [...document.querySelectorAll("[data-promo]")];

  if (!promos.length) {
    return;
  }

  /* Aktion vorbei → alles ausblenden und fertig */
  if (Date.now() > END) {
    promos.forEach((element) => element.remove());
    return;
  }

  const box = document.querySelector("[data-bw-count]");
  const label = document.querySelector("[data-bw-label]");
  const parts = {
    d: document.querySelector("[data-bw-d]"),
    h: document.querySelector("[data-bw-h]"),
    m: document.querySelector("[data-bw-m]"),
    s: document.querySelector("[data-bw-s]"),
  };

  const pad = (value) => String(value).padStart(2, "0");

  function tick() {
    const now = Date.now();

    if (now > END) {
      promos.forEach((element) => element.remove());
      clearInterval(timer);
      return;
    }

    const before = now < START;
    const left = Math.max(0, (before ? START : END) - now);
    const sec = Math.floor(left / 1000);

    if (label) {
      label.textContent = before ? "Startet in" : "Endet in";
    }

    box?.classList.toggle("is-before", before);

    if (parts.d) parts.d.textContent = Math.floor(sec / 86400);
    if (parts.h) parts.h.textContent = pad(Math.floor((sec % 86400) / 3600));
    if (parts.m) parts.m.textContent = pad(Math.floor((sec % 3600) / 60));
    if (parts.s) parts.s.textContent = pad(sec % 60);
  }

  const timer = setInterval(tick, 1000);
  tick();


  /* Reel-Video: startet erst, wenn man den Abschnitt sieht,
     und läuft nach Rückkehr in den Tab weiter */
  const video = document.querySelector("[data-bw-video]");

  if (video) {
    video.muted = true;

    const play = () => {
      if (video.paused && !document.hidden) {
        video.play().catch(() => {});
      }
    };

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          play();
        } else {
          video.pause();
        }
      }, { threshold: 0.2 }).observe(video);
    } else {
      play();
    }

    document.addEventListener("visibilitychange", () => {
      const rect = video.getBoundingClientRect();
      const visible = rect.bottom > 0 && rect.top < window.innerHeight;

      if (!document.hidden && visible) {
        play();
      }
    });
  }
})();

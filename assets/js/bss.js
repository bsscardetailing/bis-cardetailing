/* =========================================================
   BSS MOBIL V3
   ---------------------------------------------------------
   1. Orte nach Entfernung, erst die nächsten (aus standorte.js)
   2. "So läuft's": gestrichelte Linie schlängelt sich zu
      jeder Karte, der Transporter fährt beim Scrollen mit
   3. Checkliste zum Antippen
   4. Leistungen als Foto-Panels
   Проверка адреса (PLZ / позиция) – в finder.js.
========================================================= */

(() => {
  "use strict";

  const S = window.STANDORTE;
  const bss = S?.get("bss-mobil");


  /* =======================================================
     1. ORTSLISTE
  ======================================================= */

  const zonesBox = document.querySelector("[data-zones]");

  if (zonesBox && bss) {
    const more = document.querySelector("[data-zones-more]");
    const toggle = document.querySelector("[data-zones-toggle]");
    const FIRST = 8;

    const towns = S.orte
      .map((ort) => ({ ...ort, km: S.distanceKm(bss, ort) }))
      .sort((a, b) => a.km - b.km);

    const inside = towns.filter((ort) => ort.km <= bss.radiusKm);

    zonesBox.innerHTML = inside
      .map((ort, index) => `
        <li class="${index >= FIRST ? "is-extra" : ""}">
          <button type="button" data-zone-ort="${ort.ort}">
            <strong>${ort.ort}</strong>
            <span>${S.formatKm(ort.km)}</span>
          </button>
        </li>`)
      .join("");

    if (toggle && inside.length > FIRST) {
      const closed = `Alle ${inside.length} Orte anzeigen`;

      toggle.textContent = closed;
      toggle.hidden = false;

      toggle.addEventListener("click", () => {
        const open = zonesBox.classList.toggle("is-open");

        toggle.textContent = open ? "Weniger anzeigen" : closed;
        toggle.setAttribute("aria-expanded", String(open));
      });
    }

    const further = towns.filter((ort) => ort.km > bss.radiusKm && ort.km <= bss.radiusKm * 1.25);

    if (more && further.length) {
      more.textContent = `Etwas weiter, gerne auf Anfrage: ${further.map((ort) => ort.ort).join(" · ")}`;
      more.hidden = false;
    }

    /* Ort antippen: oben aufs Ortsschild setzen und prüfen */
    zonesBox.addEventListener("click", (event) => {
      const button = event.target.closest("[data-zone-ort]");
      const form = document.querySelector("[data-finder-form]");

      if (!button || !form) {
        return;
      }

      form.querySelector("input").value = button.dataset.zoneOrt;
      form.requestSubmit();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* "Meinen Ort prüfen": nach oben, Cursor aufs Ortsschild */
  document.querySelector("[data-ort-focus]")?.addEventListener("click", () => {
    document.querySelector("#bss-ort")?.focus({ preventScroll: true });
  });


  /* =======================================================
     2. ROUTE BEIM SCROLLEN
  ======================================================= */

  const trip = document.querySelector("[data-trip]");
  const svg = document.querySelector("[data-trip-svg]");
  const van = document.querySelector("[data-trip-van]");

  if (trip && svg && van) {
    const SVG_NS = "http://www.w3.org/2000/svg";
    const line = svg.querySelector("[data-trip-path]");
    const done = svg.querySelector("[data-trip-done]");
    const reveal = svg.querySelector("[data-trip-reveal]");
    const mask = svg.querySelector("mask");
    const stops = [...trip.querySelectorAll(".trip-stop")];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let length = 0;
    let shown = 0;
    let firstY = 0;
    let lastY = 1;
    let gliding = false;

    /* Linie neu zeichnen: an jeder Karte verläuft sie senkrecht,
       so entsteht eine weiche Welle ohne Knicke
       (offset* ignoriert die Reveal-Animation) */
    function draw() {
      const width = trip.offsetWidth;
      const height = trip.offsetHeight;
      const twoSides = window.matchMedia("(min-width: 961px)").matches;

      const points = stops.map((stop, index) => {
        const left = index % 2 === 0;

        return {
          x: twoSides && left ? stop.offsetLeft + stop.offsetWidth : stop.offsetLeft,
          y: stop.offsetTop + stop.offsetHeight / 2
        };
      });

      const route = [];

      points.forEach((point, index) => {
        /* mobil liegen die Karten untereinander: zwischen ihnen nach links ausholen */
        if (!twoSides && index > 0) {
          route.push({ x: 6, y: (points[index - 1].y + point.y) / 2 });
        }

        route.push(point);
      });

      const path = route.slice(1).reduce((d, point, index) => {
        const from = route[index];
        const handle = (point.y - from.y) / 2;

        return `${d} C ${from.x} ${from.y + handle}, ${point.x} ${point.y - handle}, ${point.x} ${point.y}`;
      }, `M ${route[0].x} ${route[0].y}`);

      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      mask.setAttribute("width", width);
      mask.setAttribute("height", height);

      [line, done, reveal].forEach((element) => element.setAttribute("d", path));

      svg.querySelectorAll(".trip-dot").forEach((dot) => dot.remove());

      points.forEach((point) => {
        const dot = document.createElementNS(SVG_NS, "circle");

        dot.setAttribute("class", "trip-dot");
        dot.setAttribute("cx", point.x);
        dot.setAttribute("cy", point.y);
        dot.setAttribute("r", 8);
        svg.append(dot);
      });

      firstY = points[0].y;
      lastY = points[points.length - 1].y;
      length = line.getTotalLength();
      shown = target();
      render();
    }

    function target() {
      const rect = trip.getBoundingClientRect();
      const start = window.innerHeight * 0.65;

      return Math.min(1, Math.max(0, (start - rect.top - firstY) / (lastY - firstY)));
    }

    function render() {
      const at = length * shown;
      const point = line.getPointAtLength(at);
      const ahead = line.getPointAtLength(Math.min(length, at + 16));
      const behind = line.getPointAtLength(Math.max(0, at - 16));
      const dx = ahead.x - behind.x;

      /* Icon spiegeln, sobald die Fahrtrichtung klar wechselt */
      if (Math.abs(dx) > 4) {
        van.classList.toggle("is-left", dx < 0);
      }

      reveal.style.strokeDasharray = `${at} ${length}`;
      van.style.left = `${point.x}px`;
      van.style.top = `${point.y}px`;
    }

    /* gleitet weich zum Scroll-Wert, statt ihm direkt zu folgen */
    function glide() {
      const goal = target();

      shown += (goal - shown) * 0.07;

      if (Math.abs(goal - shown) < 0.0005) {
        shown = goal;
        gliding = false;
      } else {
        requestAnimationFrame(glide);
      }

      render();
    }

    function update() {
      if (reduceMotion) {
        shown = target();
        render();
      } else if (!gliding) {
        gliding = true;
        requestAnimationFrame(glide);
      }
    }


    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", draw);
    window.addEventListener("load", draw);
    document.fonts?.ready.then(draw);
    draw();
  }


  /* =======================================================
     3. CHECKLISTE ZUM ANTIPPEN
  ======================================================= */

  const ready = document.querySelector("[data-ready]");

  if (ready) {
    const items = [...ready.querySelectorAll("[data-ready-item]")];
    const count = ready.querySelector("[data-ready-count]");
    const bar = ready.querySelector("[data-ready-bar]");
    const note = ready.querySelector("[data-ready-note]");
    const cta = ready.querySelector("[data-ready-cta]");
    const hint = note.textContent;

    items.forEach((item) => {
      item.addEventListener("click", () => {
        const pressed = item.getAttribute("aria-pressed") !== "true";

        item.setAttribute("aria-pressed", String(pressed));

        const checked = items.filter((entry) => entry.getAttribute("aria-pressed") === "true").length;
        const complete = checked === items.length;

        count.textContent = checked;
        bar.style.width = `${(checked / items.length) * 100}%`;
        note.textContent = complete ? "Alles bereit – wir können kommen!" : hint;
        ready.classList.toggle("is-complete", complete);
        cta.classList.toggle("btn--primary", complete);
        cta.classList.toggle("btn--ghost", !complete);
      });
    });
  }


  /* =======================================================
     4. LEISTUNGEN: Foto-Panels, immer eines offen
  ======================================================= */

  const panelBox = document.querySelector("[data-panels-svc]");

  if (panelBox) {
    const panels = [...panelBox.querySelectorAll(".svc3-card")];

    const wide = window.matchMedia("(min-width: 1100px)");

    const open = (panel) => {
      panels.forEach((entry) => entry.classList.toggle("is-open", entry === panel));
    };

    /* Handy/Tablet: alle zu, erst ein Tippen öffnet; die vorherige schließt sich */
    if (!wide.matches) {
      panels.forEach((entry) => entry.classList.remove("is-open"));
    }

    panels.forEach((panel) => {
      panel.addEventListener("mouseenter", () => {
        if (wide.matches) open(panel);
      });

      panel.addEventListener("focusin", (event) => {
        if (wide.matches || event.target !== panel) open(panel);
      });

      panel.addEventListener("click", (event) => {
        if (wide.matches) {
          open(panel);
          return;
        }

        if (event.target.closest("a")) return;

        if (panel.classList.contains("is-open")) {
          panel.classList.remove("is-open");
        } else {
          open(panel);
        }
      });

      panel.addEventListener("keydown", (event) => {
        if (!wide.matches && event.target === panel && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          panel.click();
        }
      });
    });
  }

})();

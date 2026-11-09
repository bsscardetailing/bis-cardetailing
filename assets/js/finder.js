/* =========================================================
   FINDER (Startseite) + EINSATZGEBIET (BSS)
   ---------------------------------------------------------
   Позиция / PLZ → ближайший Standort.
   Всё считается в браузере, ничего не отправляется.
========================================================= */

(() => {
  "use strict";

  const S = window.STANDORTE;

  if (!S) {
    return;
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];


  /* Ortsliste für alle <datalist data-orte-list> */

  $$("[data-orte-list]").forEach((list) => {
    list.innerHTML = S.orte
      .map((ort) => `<option value="${ort.plz} ${ort.ort}"></option>`)
      .join("");
  });


  /* Position aus Browser oder PLZ-Feld holen */

  function locate(onPoint, onError) {
    if (!("geolocation" in navigator) || !window.isSecureContext) {
      onError("Automatische Ortung ist hier nicht verfügbar – bitte PLZ oder Ort eingeben.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => onPoint({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }, "Ihre Position"),
      () => onError("Position nicht verfügbar – bitte PLZ oder Ort eingeben."),
      { timeout: 10000, maximumAge: 600000 }
    );
  }


  function bindInputs(root, onPoint, onError) {
    const button = $("[data-finder-locate]", root);
    const form = $("[data-finder-form]", root);
    const input = $("input", form || root);

    button?.addEventListener("click", () => {
      button.disabled = true;
      button.classList.add("is-loading");

      locate(
        (point, label) => {
          button.disabled = false;
          button.classList.remove("is-loading");
          onPoint(point, label);
        },
        (message) => {
          button.disabled = false;
          button.classList.remove("is-loading");
          onError(message);
          input?.focus();
        }
      );
    });

    form?.addEventListener("submit", (event) => {
      event.preventDefault();

      const ort = S.findOrt(input?.value);

      if (ort) {
        onPoint(ort, `${ort.plz} ${ort.ort}`);
        input.blur();
      } else {
        onError("Diesen Ort kennen wir leider nicht – wählen Sie einfach direkt.");
      }
    });
  }


  /* =======================================================
     STARTSEITE
  ======================================================= */

  const finder = $("[data-finder]");

  if (finder) {
    const status = $("[data-finder-status]", finder);
    const result = $("[data-finder-result]", finder);
    const panels = $("[data-panels]");


    /* Zuletzt besucht */

    const last = S.last();
    const lastLink = $("[data-last]");

    if (last && lastLink) {
      lastLink.href = last.seite;
      lastLink.innerHTML =
        `<span>Zuletzt besucht</span> <strong>${last.kurz}</strong> <em>Weiter →</em>`;
      lastLink.hidden = false;
    }


    function setStatus(text, error = false) {
      status.textContent = text;
      status.classList.toggle("is-error", error);
    }


    function show(point, label) {
      const ranked = S.rank(point);
      const werkstatt = ranked.find((entry) => entry.standort.typ === "werkstatt");
      const mobil = ranked.find((entry) => entry.standort.typ === "mobil");

      ranked.forEach((entry, index) => {
        const card = $(`[data-standort-card="${entry.standort.id}"]`, panels);
        const badge = card && $("[data-badge]", card);

        if (!card) {
          return;
        }

        card.style.order = String(index);
        card.classList.toggle("is-nearest", entry === werkstatt);
        card.classList.toggle("is-out", entry.standort.typ === "mobil" && !entry.erreichbar);

        badge.textContent = entry.standort.typ === "mobil"
          ? (entry.erreichbar ? "Kommt zu Ihnen" : "Außerhalb")
          : (entry === werkstatt ? "Am nächsten · " : "") + S.formatKm(entry.km);
        badge.hidden = false;
      });

      panels?.classList.add("has-result");

      const w = werkstatt.standort;

      result.innerHTML = `
        <p class="finder-result-kicker">Empfehlung für ${label}</p>
        <a class="finder-result-main" href="${w.seite}">
          <span>
            <strong>${w.kurz}</strong>
            <small>${w.typLabel} · ${S.formatKm(werkstatt.km)} Luftlinie</small>
          </span>
          <span class="finder-result-go" aria-hidden="true">→</span>
        </a>
        ${mobil?.erreichbar ? `
          <a class="finder-result-mobil" href="${mobil.standort.seite}">
            Keine Zeit für die Fahrt? <strong>BSS kommt zu Ihnen →</strong>
          </a>` : ""}
      `;

      result.hidden = false;
      setStatus("");
    }

    bindInputs(finder, show, (message) => setStatus(message, true));
  }


  /* =======================================================
     BSS: EINSATZGEBIET + ORTSSCHILD
  ======================================================= */

  const area = $("[data-areacheck]");
  const bss = S.get("bss-mobil");

  if (area && bss) {
    const result = $("[data-area-result]", area);
    const sign = $("[data-schild]", area);
    const signInput = $("input", sign);
    const signSub = $("[data-schild-sub]", sign);
    const van = $("[data-schild-van]", area);

    $$("[data-radius]").forEach((element) => {
      element.textContent = bss.radiusKm;
    });


    /* Schrift verkleinern, bis der Ortsname aufs Schild passt */
    function fitSign() {
      signInput.style.fontSize = "";

      let size = parseFloat(getComputedStyle(signInput).fontSize);

      while (signInput.scrollWidth > signInput.clientWidth && size > 11) {
        size -= 1;
        signInput.style.fontSize = `${size}px`;
      }
    }


    /* Ortsname aufs Schild, Transporter fährt bis zum Ziel */
    function showSign(km, inside, label) {
      signInput.value = label.replace(/^\d{5}\s+/, "").replace(" an der Straße", "");
      fitSign();

      sign.classList.toggle("is-out", !inside);
      signSub.textContent = `${S.formatKm(km)} · ${inside ? "im Einsatzgebiet" : "außerhalb"}`;
      van.style.left = `${Math.min(km / bss.radiusKm, 1) * 100}%`;
    }


    signInput.addEventListener("input", () => {
      sign.classList.remove("is-out");
      fitSign();
    });


    function check(point, label) {
      const km = S.distanceKm(bss, point);
      const inside = km <= bss.radiusKm;

      result.className = "area-result " + (inside ? "is-in" : "is-out");
      result.innerHTML = inside
        ? `<strong>Ja, wir kommen zu Ihnen!</strong>
           <span>${label} · ${S.formatKm(km)}</span>
           <a class="btn btn--primary btn--sm" href="kontakt.html?standort=bss-mobil">Termin vor Ort anfragen</a>`
        : `<strong>Etwas außerhalb</strong>
           <span>${label} · ${S.formatKm(km)} – fragen Sie trotzdem gerne an
           oder besuchen Sie unsere Werkstatt in Bad Orb.</span>
           <a class="btn btn--ghost btn--sm" href="index.html#standort">Werkstatt ansehen</a>`;
      result.hidden = false;

      showSign(km, inside, label);
    }

    bindInputs(area, check, (message) => {
      result.className = "area-result is-out";
      result.textContent = message;
      result.hidden = false;
    });
  }

})();

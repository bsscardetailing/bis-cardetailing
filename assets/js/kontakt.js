/* =========================================================
   KONTAKT V3 – TERMIN-CHAT
   ---------------------------------------------------------
   Вопросы по одному, как в мессенджере.
   У каждого ответа есть «ändern» – чат откатывается
   к этому вопросу. ?standort=…&leistung=… отвечают
   на первые вопросы автоматически.

   Versand: derselbe Google Apps Script wie bisher
   (gleiche Feldnamen + standort, einsatzort).
========================================================= */

(() => {
  "use strict";

  const ENDPOINT =
    "https://script.google.com/macros/s/AKfycbxlcRgs-MCt8Z06WPK-SBu3tCnqrrBXE0IodSpICyU_bYVCIlYRrPzXHd_gG_93nH-G/exec";

  const S = window.STANDORTE;
  const chat = document.querySelector("[data-chat]");

  if (!S || !chat) {
    return;
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const log = $("[data-chat-log]", chat);
  const form = $("[data-chat-form]", chat);
  const choicesBox = $("[data-chat-choices]", chat);
  const compose = $("[data-chat-compose]", chat);
  const field = $("[data-chat-field]", chat);
  const label = $("[data-chat-label]", chat);
  const skip = $("[data-chat-skip]", chat);
  const errorBox = $("[data-chat-error]", chat);

  const reduceMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const params = new URLSearchParams(location.search);
  const preAuswahl = params.get("auswahl") || "";
  let answers = {};
  let stepIndex = -1;
  let busy = false;
  let generation = 0;


  /* =======================================================
     HELPERS
  ======================================================= */

  const esc = (text) =>
    String(text).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const standort = () => S.get(answers.standort_id);

  function formatDate(iso) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}.${m}.${y}`;
  }

  function today() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 10);
  }

  function scrollLog() {
    log.scrollTo({ top: log.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, reduceMotion ? 0 : ms));
  }


  /* =======================================================
     SCHRITTE
  ======================================================= */

  const STEPS = [
    {
      key: "standort_id",
      ask: () => "Hallo! Schön, dass Sie da sind. Wo soll Ihr Termin stattfinden?",
      choices: () => S.list.map((s) => ({ value: s.id, label: s.kurz, sub: s.typLabel })),
      show: (value) => S.get(value)?.name || value,
      after: (value) => applyStandort(S.get(value))
    },
    {
      key: "leistung",
      ask: () => `Super – welche Leistung wünschen Sie ${standort()?.typ === "mobil" ? "bei Ihnen vor Ort" : "in " + standort()?.kurz}?`,
      choices: () => standort().leistungen.map((l) => ({ value: l, label: l.replace(" (mobil)", "") }))
    },
    {
      key: "einsatzort",
      when: () => standort()?.typ === "mobil",
      ask: () => "Wo steht Ihr Fahrzeug? Straße, PLZ und Ort genügen.",
      input: { type: "text", autocomplete: "street-address", placeholder: "Straße Nr., PLZ Ort" },
      validate: (v) => v.length >= 6 || "Bitte geben Sie die Adresse an, damit wir zu Ihnen kommen können."
    },
    {
      key: "fahrzeug",
      optional: true,
      ask: () => "Welches Fahrzeug dürfen wir pflegen?",
      input: { type: "text", placeholder: "z. B. BMW 3er Touring" }
    },
    {
      key: "wunschtermin",
      optional: "Flexibel",
      ask: () => "Wann passt es Ihnen? Wählen Sie einen Wunschtag.",
      input: { type: "date", min: today },
      show: (value) => formatDate(value)
    },
    {
      key: "zeit",
      when: () => Boolean(answers.wunschtermin),
      ask: () => "Und zu welcher Tageszeit?",
      choices: () => [
        { value: "09:00", label: "Vormittags" },
        { value: "13:00", label: "Mittags" },
        { value: "17:00", label: "Nachmittags" },
        { value: "", label: "Egal" }
      ],
      show: (value) => value ? `${value} Uhr` : "Egal"
    },
    {
      key: "name",
      ask: () => "Fast geschafft! Wie dürfen wir Sie ansprechen?",
      input: { type: "text", autocomplete: "name", placeholder: "Ihr Name" },
      validate: (v) => v.length >= 2 || "Bitte geben Sie Ihren Namen an."
    },
    {
      key: "email",
      ask: () => `Danke, ${esc(answers.name.split(" ")[0])}! An welche E-Mail senden wir die Bestätigung?`,
      input: { type: "email", autocomplete: "email", inputmode: "email", placeholder: "ihre@email.de" },
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Diese E-Mail-Adresse sieht nicht ganz richtig aus."
    },
    {
      key: "telefon",
      optional: true,
      ask: () => "Möchten Sie uns noch eine Telefonnummer für Rückfragen geben?",
      input: { type: "tel", autocomplete: "tel", inputmode: "tel", placeholder: "+49 …" }
    },
    {
      key: "nachricht",
      optional: true,
      ask: () => "Gibt es noch etwas, das wir wissen sollten? Zustand, Wünsche, Fragen …",
      input: { type: "text", placeholder: "Ihre Nachricht" }
    },
    {
      key: "_confirm",
      ask: summaryHtml,
      choices: () => [
        { value: "send", label: "Anfrage senden", primary: true },
        { value: "whatsapp", label: "Per WhatsApp senden" }
      ],
      final: true
    }
  ];


  /* =======================================================
     NACHRICHTEN
  ======================================================= */

  function addMessage(html, who, index) {
    const message = document.createElement("div");

    message.className = `msg msg--${who}`;
    message.dataset.step = String(index);
    message.innerHTML = `<div class="msg-bubble">${html}</div>`;

    if (who === "me" && index != null && !STEPS[index].final) {
      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "msg-edit";
      edit.textContent = "ändern";
      edit.addEventListener("click", () => rewind(index));
      message.append(edit);
    }

    log.append(message);
    scrollLog();
    return message;
  }

  async function botSays(html, index) {
    const typing = addMessage('<span class="typing"><i></i><i></i><i></i></span>', "bot", index);
    await wait(550);
    typing.querySelector(".msg-bubble").innerHTML = html;
    scrollLog();
  }


  /* =======================================================
     ABLAUF
  ======================================================= */

  function clearInput() {
    choicesBox.innerHTML = "";
    compose.hidden = true;
    skip.hidden = true;
    errorBox.hidden = true;
  }

  async function ask(index) {
    const gen = ++generation;
    stepIndex = index;
    const step = STEPS[index];

    if (!step) return;

    if (step.when && !step.when()) {
      delete answers[step.key];
      ask(index + 1);
      return;
    }

    clearInput();
    busy = true;
    await botSays(step.ask(), index);
    busy = false;

    if (gen !== generation) return;

    if (step.choices) {
      step.choices().forEach((choice) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "chip-btn" + (choice.primary ? " chip-btn--primary" : "");
        button.innerHTML = esc(choice.label) + (choice.sub ? `<small>${esc(choice.sub)}</small>` : "");
        button.addEventListener("click", () => answer(choice.value, choice.label));
        choicesBox.append(button);
      });

      choicesBox.querySelector("button")?.focus({ preventScroll: true });
    }

    if (step.input) {
      const config = step.input;

      field.type = config.type;
      field.value = answers[step.key] || "";
      field.placeholder = config.placeholder || "";
      field.autocomplete = config.autocomplete || "off";
      field.inputMode = config.inputmode || "";
      field.min = typeof config.min === "function" ? config.min() : (config.min || "");
      label.textContent = step.ask().replace(/<[^>]+>/g, "");
      compose.hidden = false;
      field.focus({ preventScroll: true });
    }

    if (step.optional) {
      skip.hidden = false;
      skip.textContent = typeof step.optional === "string" ? step.optional : "Überspringen";
    }
  }

  async function answer(value, shown) {
    if (busy) return;

    const index = stepIndex;
    const step = STEPS[index];

    if (step.final) {
      if (value === "send") send();
      if (value === "whatsapp") sendWhatsApp();
      return;
    }

    answers[step.key] = value;

    const text = shown != null
      ? shown
      : (step.show ? step.show(value) : value);

    addMessage(esc(text || "—"), "me", index);
    clearInput();

    step.after?.(value);

    await wait(150);
    ask(index + 1);
  }

  function rewind(index) {
    generation += 1;
    busy = false;

    $$(".msg", log).forEach((message) => {
      if (Number(message.dataset.step) >= index) {
        message.remove();
      }
    });

    STEPS.slice(index).forEach((step) => {
      delete answers[step.key];
    });

    ask(index);
  }


  /* Eingabe absenden */

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const step = STEPS[stepIndex];

    if (!step?.input) return;

    const value = field.value.trim();

    if (!value && step.optional) {
      skip.click();
      return;
    }

    const check = step.validate ? step.validate(value) : value.length > 0 || "Bitte ausfüllen.";

    if (check !== true) {
      errorBox.textContent = check;
      errorBox.hidden = false;
      field.focus();
      return;
    }

    answer(value);
  });

  skip.addEventListener("click", () => {
    const step = STEPS[stepIndex];
    answers[step.key] = "";
    answer("", typeof step.optional === "string" ? step.optional : "Übersprungen");
  });

  $("[data-chat-restart]", chat).addEventListener("click", () => {
    generation += 1;
    busy = false;
    log.innerHTML = "";
    answers = {};
    ask(0);
  });


  /* =======================================================
     ZUSAMMENFASSUNG + VERSAND
  ======================================================= */

  function summaryHtml() {
    const s = standort();
    const rows = [
      ["Standort", s?.name],
      ["Einsatzort", answers.einsatzort],
      ["Leistung", answers.leistung],
      ["Preisrechner", preAuswahl],
      ["Fahrzeug", answers.fahrzeug],
      ["Termin", [formatDate(answers.wunschtermin), answers.zeit && `${answers.zeit} Uhr`].filter(Boolean).join(" · ") || "flexibel"],
      ["Name", answers.name],
      ["E-Mail", answers.email],
      ["Telefon", answers.telefon]
    ].filter(([, v]) => v);

    return `Perfekt, hier ist Ihre Anfrage:
      <dl class="msg-sum">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join("")}</dl>
      Soll ich sie so absenden?`;
  }

  function payload() {
    const s = standort();
    const prefix = [
      s && `Standort: ${s.name}`,
      answers.einsatzort && `Einsatzort: ${answers.einsatzort}`,
      preAuswahl && `Preisrechner: ${preAuswahl}`
    ].filter(Boolean).join("\n");

    return {
      standort: s ? s.name : "",
      einsatzort: answers.einsatzort || "",
      name: answers.name || "",
      email: answers.email || "",
      telefon: answers.telefon || "",
      fahrzeug: answers.fahrzeug || "",
      leistung: answers.leistung || "",
      wunschtermin: answers.wunschtermin || "",
      zeit: answers.zeit || "",
      nachricht: [prefix, answers.nachricht].filter(Boolean).join("\n\n")
    };
  }

  async function send() {
    clearInput();
    addMessage("Anfrage senden", "me", stepIndex);
    busy = true;

    try {
      await fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload())
      });

      await botSays(
        `<strong>Vielen Dank, ${esc(answers.name.split(" ")[0])}!</strong> Ihre Anfrage ist bei uns eingegangen.
         Wir melden uns schnellstmöglich und bestätigen Ihren Termin.`,
        stepIndex
      );

      const s = standort();
      choicesBox.innerHTML = `
        <a class="chip-btn chip-btn--primary" href="${s ? s.seite : "index.html"}">Zurück zu ${s ? esc(s.kurz) : "Start"}</a>
        <button type="button" class="chip-btn" data-again>Neue Anfrage</button>`;
      $("[data-again]", choicesBox).addEventListener("click", () => $("[data-chat-restart]", chat).click());
    } catch (error) {
      console.error("Formularfehler:", error);
      await botSays(
        "Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut – oder schreiben Sie uns per WhatsApp.",
        stepIndex
      );
      ask(STEPS.length - 1);
    } finally {
      busy = false;
    }
  }

  function sendWhatsApp() {
    const s = standort();
    const data = payload();
    const lines = [
      "Hallo, ich möchte einen Termin anfragen.",
      "",
      `Standort: ${s?.name || ""}`,
      data.einsatzort && `Einsatzort: ${data.einsatzort}`,
      data.leistung && `Leistung: ${data.leistung}`,
      preAuswahl && `Preisrechner: ${preAuswahl}`,
      data.fahrzeug && `Fahrzeug: ${data.fahrzeug}`,
      data.wunschtermin && `Wunschtermin: ${formatDate(data.wunschtermin)} ${data.zeit}`.trim(),
      data.name && `Name: ${data.name}`,
      answers.nachricht && `\n${answers.nachricht}`
    ].filter((line, i) => i === 1 || line);

    window.open(
      `https://wa.me/${s?.whatsapp || "4915758193017"}?text=` + encodeURIComponent(lines.join("\n")),
      "_blank",
      "noopener"
    );
  }


  /* =======================================================
     STANDORT-INFO + KARTE
  ======================================================= */

  function applyStandort(s) {
    if (!s) return;

    const mobil = s.typ === "mobil";
    const logo = $("[data-kt-logo]");

    logo.src = s.logoWhite;
    logo.alt = s.name;
    logo.classList.toggle("is-bss", s.id === "bss-mobil");
    $("[data-kt-logo-wrap]").hidden = false;
    $("[data-kt-name]").hidden = true;
    $("[data-kt-address-label]").textContent = mobil ? "Einsatzgebiet" : "Adresse";
    $("[data-kt-address]").textContent = mobil
      ? `ca. ${s.radiusKm} km rund um ${s.ort}`
      : S.adresseZeilen(s).join(", ");

    const section = $("[data-kt-map-section]");
    section.hidden = false;
    $("[data-kt-map-kicker]").textContent = mobil ? "Mobiler Service" : `Werkstatt ${s.kurz}`;
    $("[data-kt-map-title]").innerHTML = mobil
      ? 'Unser <span class="o">Einsatzgebiet</span>'
      : 'So finden <span class="o">Sie&nbsp;uns</span>';
    $("[data-kt-maps-link]").href = S.mapsLink(s);

    const map = $("[data-kt-map]");
    map.dataset.consentSrc = S.mapsEmbed(s);
    map.title = `${s.name} auf Google Maps`;

    if (window.BSSConsent?.getState().external) {
      map.src = map.dataset.consentSrc;
      map.hidden = false;
      $("[data-consent-map-placeholder]", section).hidden = true;
    }

    S.remember(s.id);
  }


  /* =======================================================
     START (inkl. Vorauswahl aus der URL)
  ======================================================= */

  async function start() {
    const preStandort = S.get(params.get("standort"));
    const preLeistung = params.get("leistung");

    if (!preStandort) {
      ask(0);
      return;
    }

    busy = true;
    await botSays(STEPS[0].ask(), 0);
    busy = false;
    stepIndex = 0;
    await answer(preStandort.id, preStandort.name);

    if (preLeistung && preStandort.leistungen.includes(preLeistung)) {
      /* warten, bis Frage 2 gestellt ist */
      const timer = setInterval(() => {
        if (!busy && stepIndex === 1) {
          clearInterval(timer);
          answer(preLeistung, preLeistung.replace(" (mobil)", ""));
        }
      }, 50);
    }
  }

  start();

})();

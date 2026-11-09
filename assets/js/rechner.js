/* =========================================================
   PREISRECHNER (nur Bad Orb)
   ---------------------------------------------------------
   Цены стоят прямо в index.html, в атрибуте data-price:
     data-price="99"                                – одна цена
     data-price='{"hatchback":250,"limousine":300,"suv":350}'
                                                    – цена по типу авто
   Нет data-price → услуга показывается как «auf Anfrage»
   и в сумму не входит.

   data-ab: перед ценой пишется «ab» (примерная цена).
   data-group: в группе можно выбрать только один вариант.
   data-leistung: как услуга называется в чате на Kontakt.
========================================================= */

(() => {
  "use strict";

  const box = document.querySelector("[data-rechner]");

  if (!box) {
    return;
  }

  const select = box.querySelector("[data-rechner-car]");
  const options = [...box.querySelectorAll("[data-rechner-opt]")];
  const result = box.querySelector("[data-rechner-result]");
  const sumBox = box.querySelector("[data-rechner-sum]");
  const listBox = box.querySelector("[data-rechner-list]");
  const openBox = box.querySelector("[data-rechner-open]");
  const button = box.querySelector("[data-rechner-cta]");

  const euro = (value) => `${value.toLocaleString("de-DE")}€`;
  const nameOf = (input) => input.dataset.name;

  /* Preis der Option für den gewählten Fahrzeugtyp, null = auf Anfrage */
  function priceOf(input) {
    const raw = input.dataset.price;

    if (raw === undefined) {
      return null;
    }

    return raw.startsWith("{") ? JSON.parse(raw)[select.value] : Number(raw);
  }

  function showPrices() {
    options.forEach((input) => {
      const label = input.closest("label").querySelector("[data-rechner-price]");
      const price = priceOf(input);

      label.textContent = price === null
        ? "auf Anfrage"
        : `${input.hasAttribute("data-ab") ? "ab " : ""}${euro(price)}`;
    });
  }

/* Aufklappbare Gruppen: Anzahl gewählter Extras im Titel */
const folds = [...box.querySelectorAll("[data-rechner-fold]")];

function showCounts() {
  folds.forEach((fold) => {
    const count = fold.querySelector("[data-rechner-count]");
    const picked = fold.querySelectorAll("[data-rechner-opt]:checked").length;

    count.textContent = picked ? `${picked} gewählt` : `${count.dataset.total} Optionen`;
    fold.classList.toggle("has-picked", picked > 0);
  });
}

/* auf dem PC offen, auf dem Handy zugeklappt */
if (window.matchMedia("(min-width: 961px)").matches) {
  folds.forEach((fold) => { fold.open = true; });
}

function showResult() {
  showCounts();
    const chosen = options.filter((input) => input.checked);
    const priced = chosen.filter((input) => priceOf(input) !== null);
    const open = chosen.filter((input) => priceOf(input) === null);
    const sum = priced.reduce((total, input) => total + priceOf(input), 0);

    result.dataset.state = !chosen.length ? "empty" : priced.length ? "price" : "open";

    sumBox.innerHTML = priced.length
      ? `<span>ab</span> <strong>${euro(sum)}</strong>`
      : "";

    listBox.textContent = chosen.map(nameOf).join(" · ");

    openBox.hidden = !(priced.length && open.length);
    openBox.textContent = `+ ${open.map(nameOf).join(", ")}: Preis auf Anfrage`;

    /* Auswahl an die Termin-Anfrage weitergeben */
    const car = select.options[select.selectedIndex].text;
    const summary = `${car}: ${chosen.map(nameOf).join(", ")}${priced.length ? ` (ab ${euro(sum)})` : ""}`;
    const params = new URLSearchParams({ standort: "bad-orb" });

    if (chosen.length) {
      params.set("leistung", chosen.length === 1 ? chosen[0].dataset.leistung : "Sonstiges");
      params.set("auswahl", summary);
    }

    button.href = `kontakt.html?${params}`;
  }

  options.forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked && input.dataset.group) {
        options.forEach((other) => {
          if (other !== input && other.dataset.group === input.dataset.group) {
            other.checked = false;
          }
        });
      }

      showResult();
    });
  });

  select.addEventListener("change", () => {
    showPrices();
    showResult();
  });

  showPrices();
  showResult();
})();

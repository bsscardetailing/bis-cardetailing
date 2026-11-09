/* =========================================================
   STANDORTE – ZENTRALE DATEN
   ---------------------------------------------------------
   Здесь хранятся ВСЕ данные по гаражам:
   адрес, координаты, телефон, часы, услуги для формы.

   Kontakt-Formular, Standort-Auswahl в шапке
   и переключатель в шапке берут данные отсюда.
   Меняете адрес / телефон → меняете только здесь.
========================================================= */

(() => {
  "use strict";


  /* =======================================================
     LEISTUNGEN
  ======================================================= */

  const LEISTUNGEN_WERKSTATT = [
    "Komfort Paket",
    "Premium Paket",
    "Exklusiv Paket",
    "Außenreinigung",
    "Innenreinigung",
    "Politur / Lackaufbereitung",
    "Politur + Keramikversiegelung",
    "Zusatzleistung",
    "Sonstiges"
  ];


  const LEISTUNGEN_MOBIL = [
    "Innenreinigung (mobil)",
    "Außenreinigung (mobil)",
    "Innen- & Außenreinigung (mobil)",
    "Leichte Politur / Glanzpolitur (mobil)",
    "Sonstiges"
  ];


  /* =======================================================
     STANDORTE
  ======================================================= */

  const LIST = [

    /* ---------------- BAD ORB ---------------- */
    {
      id: "bad-orb",
      name: "Bad Orb Car Detailing",
      kurz: "Bad Orb",
      typ: "werkstatt",
      typLabel: "Werkstatt",
      seite: "index.html",
      logo: "assets/img/logo-bad-orb.svg",
      logoWhite: "assets/img/logo-footer.svg",

      strasse: "Kanalstraße 43",
      plz: "63619",
      ort: "Bad Orb",

      lat: 50.2262,
      lng: 9.3494,

      telefon: "+4915758193017",
      telefonAnzeige: "0157 58193017",
      whatsapp: "4915758193017",
      email: "bss.autoaufbereitung@gmail.com",

      zeiten: [
        ["Mo.–Sa.", "08:00–20:00 Uhr"]
      ],

      instagram: [
        {
          label: "Bad Orb Instagram",
          url: "https://www.instagram.com/autopflege_bad_orb?igsh=MWQzMnhrc2N4YTg0&utm_source=qr"
        }
      ],

      leistungen: LEISTUNGEN_WERKSTATT
    },


    /* ---------------- BSS MOBIL ---------------- */
    {
      id: "bss-mobil",
      name: "BSS Mobile Autoaufbereitung",
      kurz: "BSS Mobil",
      typ: "mobil",
      typLabel: "Mobiler Service",
      seite: "bss-mobil.html",
      logo: "assets/img/logo-bss.svg",
      logoWhite: "assets/img/logo-bss-white.svg",

      /* Basis des mobilen Service
         (für Entfernung / Einsatzgebiet) */
      strasse: "",
      plz: "63628",
      ort: "Bad Soden-Salmünster",

      lat: 50.2795,
      lng: 9.3650,

      /* Einsatzgebiet in km (Luftlinie) */
      radiusKm: 40,

      telefon: "+4915758193017",
      telefonAnzeige: "0157 58193017",
      whatsapp: "4915758193017",
      email: "bss.autoaufbereitung@gmail.com",

      zeiten: [
        ["Mo.–Sa.", "08:00–20:00 Uhr"]
      ],

      instagram: [
        {
          label: "BSS Instagram",
          url: "https://www.instagram.com/bss_car_detailing?igsh=cGs1dnpjczNlNGcx&utm_source=qr"
        }
      ],

      leistungen: LEISTUNGEN_MOBIL
    }

  ];


  /* =======================================================
     ORTE FÜR DIE SUCHE (PLZ / ORT)
     -------------------------------------------------------
     Поиск работает полностью в браузере,
     без внешних сервисов (DSGVO-freundlich).
     При желании можно дописать свои населённые пункты.
  ======================================================= */

  const ORTE = [
    ["63619", "Bad Orb", 50.2276, 9.3486],
    ["63607", "Wächtersbach", 50.2553, 9.2950],
    ["63628", "Bad Soden-Salmünster", 50.2795, 9.3650],
    ["36396", "Steinau an der Straße", 50.3133, 9.4636],
    ["36381", "Schlüchtern", 50.3497, 9.5262],
    ["36391", "Sinntal", 50.3150, 9.6100],
    ["63571", "Gelnhausen", 50.2017, 9.1878],
    ["63599", "Biebergemünd", 50.1770, 9.2970],
    ["63637", "Jossgrund", 50.1830, 9.4690],
    ["63639", "Flörsbachtal", 50.1190, 9.4440],
    ["63633", "Birstein", 50.3540, 9.3020],
    ["63636", "Brachttal", 50.3080, 9.2880],
    ["63584", "Gründau", 50.2097, 9.1361],
    ["63589", "Linsengericht", 50.1700, 9.2000],
    ["63579", "Freigericht", 50.1440, 9.1270],
    ["63594", "Hasselroth", 50.1650, 9.0800],
    ["63654", "Büdingen", 50.2906, 9.1122],
    ["63549", "Ronneburg", 50.2330, 9.0600],
    ["63505", "Langenselbold", 50.1745, 9.0400],
    ["63517", "Rodenbach", 50.1500, 9.0300],
    ["63526", "Erlensee", 50.1600, 8.9800],
    ["63450", "Hanau", 50.1264, 8.9283],
    ["63486", "Bruchköbel", 50.1800, 8.9200],
    ["61130", "Nidderau", 50.2400, 8.8600],
    ["63477", "Maintal", 50.1500, 8.8300],
    ["63500", "Seligenstadt", 50.0440, 8.9750],
    ["63755", "Alzenau", 50.0886, 9.0636],
    ["63739", "Aschaffenburg", 49.9769, 9.1525],
    ["63065", "Offenbach am Main", 50.0956, 8.7761],
    ["60311", "Frankfurt am Main", 50.1109, 8.6821],
    ["63667", "Nidda", 50.4128, 9.0080],
    ["63683", "Ortenberg", 50.3550, 9.0500],
    ["63679", "Schotten", 50.5000, 9.1200],
    ["36399", "Freiensteinau", 50.4200, 9.4000],
    ["36355", "Grebenhain", 50.4900, 9.3300],
    ["36341", "Lauterbach", 50.6369, 9.3953],
    ["36148", "Kalbach", 50.3900, 9.6500],
    ["36103", "Flieden", 50.4228, 9.5667],
    ["36119", "Neuhof", 50.4547, 9.6150],
    ["36037", "Fulda", 50.5558, 9.6808],
    ["97769", "Bad Brückenau", 50.3089, 9.7926],
    ["97737", "Gemünden am Main", 50.0497, 9.7050],
    ["97816", "Lohr am Main", 49.9986, 9.5781],
    ["97762", "Hammelburg", 50.1167, 9.8917],
    ["97688", "Bad Kissingen", 50.2000, 10.0775],
    ["97070", "Würzburg", 49.7913, 9.9534]
  ].map(([plz, ort, lat, lng]) => ({ plz, ort, lat, lng }));


  /* =======================================================
     HELPERS
  ======================================================= */

  const STORAGE_KEY = "standort-v1";


  function get(id) {
    return LIST.find((standort) => standort.id === id) || null;
  }


  function adresseZeilen(standort) {
    return [
      standort.strasse,
      `${standort.plz} ${standort.ort}`
    ].filter(Boolean);
  }


  function mapsQuery(standort) {
    return [...adresseZeilen(standort), "Deutschland"].join(", ");
  }


  function mapsLink(standort) {
    return "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(mapsQuery(standort));
  }


  function mapsEmbed(standort) {
    return "https://www.google.com/maps?q=" +
      encodeURIComponent(mapsQuery(standort)) +
      "&output=embed";
  }


  /* Entfernung (Luftlinie) in km */
  function distanceKm(a, b) {
    const rad = (deg) => (deg * Math.PI) / 180;
    const dLat = rad(b.lat - a.lat);
    const dLng = rad(b.lng - a.lng);

    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(rad(a.lat)) *
      Math.cos(rad(b.lat)) *
      Math.sin(dLng / 2) ** 2;

    return 6371 * 2 * Math.asin(Math.sqrt(h));
  }


  /* Sortiert alle Standorte nach Entfernung zum Punkt */
  function rank(point) {
    return LIST
      .map((standort) => {
        const km = distanceKm(point, standort);

        return {
          standort,
          km,
          erreichbar:
            standort.typ !== "mobil" ||
            km <= standort.radiusKm
        };
      })
      .sort((a, b) => a.km - b.km);
  }


  /* PLZ oder Ortsname → Ort aus der Liste */
  function findOrt(input) {
    const value = String(input || "")
      .trim()
      .toLowerCase();

    if (!value) {
      return null;
    }

    const digits = value.match(/\d{5}/);

    if (digits) {
      const plz = digits[0];

      return (
        ORTE.find((ort) => ort.plz === plz) ||
        ORTE.find((ort) => ort.plz.slice(0, 3) === plz.slice(0, 3)) ||
        ORTE.find((ort) => ort.plz.slice(0, 2) === plz.slice(0, 2)) ||
        null
      );
    }

    const name = value.replace(/^\d+\s*/, "");

    return (
      ORTE.find((ort) => ort.ort.toLowerCase() === name) ||
      ORTE.find((ort) => ort.ort.toLowerCase().startsWith(name)) ||
      ORTE.find((ort) => ort.ort.toLowerCase().includes(name)) ||
      null
    );
  }


  function remember(id) {
    if (!get(id)) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch (error) {
      /* Speicherung nicht möglich – kein Problem */
    }
  }


  function last() {
    try {
      return get(localStorage.getItem(STORAGE_KEY));
    } catch (error) {
      return null;
    }
  }


  function formatKm(km) {
    return km < 1
      ? "unter 1 km"
      : `ca. ${Math.round(km)} km`;
  }


  window.STANDORTE = {
    list: LIST,
    orte: ORTE,
    get,
    adresseZeilen,
    mapsLink,
    mapsEmbed,
    distanceKm,
    rank,
    findOrt,
    remember,
    last,
    formatKm
  };


  /* =======================================================
     AKTUELLEN STANDORT MERKEN
     <body data-standort="bad-orb">
  ======================================================= */

  const current = document.body?.dataset.standort;

  if (current) {
    remember(current);
  }


  /* =======================================================
     ADRESSEN / KARTEN AUS DER KONFIGURATION
     -------------------------------------------------------
     data-standort-adresse="id"   → Adresse (eine Zeile)
       + data-adresse-umbruch     → Adresse mit Zeilenumbruch
     data-standort-maps-link="id" → Link "Route planen"
     data-standort-map="id"       → Google-Maps-iframe
                                    (lädt erst nach Consent)
  ======================================================= */

  document
    .querySelectorAll("[data-standort-adresse]")
    .forEach((element) => {
      const standort = get(element.dataset.standortAdresse);

      if (!standort) {
        return;
      }

      const zeilen = adresseZeilen(standort);

      if ("adresseUmbruch" in element.dataset) {
        element.replaceChildren(
          ...zeilen.flatMap((zeile, index) =>
            index ? [document.createElement("br"), zeile] : [zeile]
          )
        );
      } else {
        element.textContent = zeilen.join(" · ");
      }
    });


  document
    .querySelectorAll("[data-standort-maps-link]")
    .forEach((link) => {
      const standort = get(link.dataset.standortMapsLink);

      if (standort) {
        link.href = mapsLink(standort);
      }
    });


  document
    .querySelectorAll("[data-standort-map]")
    .forEach((frame) => {
      const standort = get(frame.dataset.standortMap);

      if (standort) {
        frame.dataset.consentSrc = mapsEmbed(standort);
      }
    });


  /* =======================================================
     STANDORT-SWITCH IM HEADER
     Закрывается кликом снаружи и по Escape.
  ======================================================= */

  const switcher = document.querySelector(".standort-switch");

  if (switcher) {
    document.addEventListener("click", (event) => {
      if (switcher.open && !switcher.contains(event.target)) {
        switcher.open = false;
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && switcher.open) {
        switcher.open = false;
        switcher.querySelector("summary")?.focus();
      }
    });
  }

})();

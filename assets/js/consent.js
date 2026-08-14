/* =========================================================
   BAD ORB / BSS CONSENT MANAGER
========================================================= */

(() => {
  "use strict";

  const STORAGE_KEY = "bss-consent-v1";


  /* =======================================================
     CONFIG
  ======================================================= */

  const CONFIG = {

    /* Adobe Fonts */
    adobeFontsStylesheet:
      "https://use.typekit.net/cmu8poz.css",


    /* Google Ads
       Позже сюда вставишь например:
       AW-123456789
    */
    googleAdsId: "",


    /* Google Analytics
       Если позже подключишь:
       G-XXXXXXXXXX
    */
    googleAnalyticsId: ""

  };


  /* =======================================================
     DEFAULT STATE
  ======================================================= */

  const DEFAULT_CONSENT = {

    necessary: true,

    external: false,

    marketing: false,

    timestamp: null

  };


  let state = readConsent();

  let ui = null;


  /* =======================================================
     GOOGLE CONSENT MODE
  ======================================================= */

  window.dataLayer =
    window.dataLayer || [];


  window.gtag =
    window.gtag ||
    function () {

      window.dataLayer.push(arguments);

    };


  /* По умолчанию всё необязательное запрещено */

  window.gtag(
    "consent",
    "default",
    {

      ad_storage:
        "denied",

      ad_user_data:
        "denied",

      ad_personalization:
        "denied",

      analytics_storage:
        "denied",

      functionality_storage:
        "granted",

      security_storage:
        "granted",

      wait_for_update:
        500

    }
  );


  /* =======================================================
     STORAGE
  ======================================================= */

  function readConsent() {

    try {

      const raw =
        localStorage.getItem(
          STORAGE_KEY
        );


      if (!raw) {

        return {
          ...DEFAULT_CONSENT
        };

      }


      const parsed =
        JSON.parse(raw);


      return {

        necessary:
          true,

        external:
          Boolean(
            parsed.external
          ),

        marketing:
          Boolean(
            parsed.marketing
          ),

        timestamp:
          parsed.timestamp ||
          null

      };

    }

    catch (error) {

      return {
        ...DEFAULT_CONSENT
      };

    }

  }


  function saveConsent(
    nextState
  ) {

    state = {

      necessary:
        true,

      external:
        Boolean(
          nextState.external
        ),

      marketing:
        Boolean(
          nextState.marketing
        ),

      timestamp:
        new Date()
          .toISOString()

    };


    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
      );

    }

    catch (error) {

      console.warn(
        "Consent preference could not be stored.",
        error
      );

    }


    applyConsent();

    closeConsent();

  }


  function hasDecision() {

    return Boolean(
      state.timestamp
    );

  }


  /* =======================================================
     APPLY CONSENT
  ======================================================= */

  function applyConsent() {


    /* GOOGLE CONSENT MODE */

    window.gtag(
      "consent",
      "update",
      {

        ad_storage:
          state.marketing
            ? "granted"
            : "denied",

        ad_user_data:
          state.marketing
            ? "granted"
            : "denied",

        ad_personalization:
          state.marketing
            ? "granted"
            : "denied",

        analytics_storage:
          state.marketing
            ? "granted"
            : "denied"

      }
    );


    /* EXTERNAL SERVICES */

    if (
      state.external
    ) {

      loadAdobeFonts();

      loadExternalFrames();

    }

    else {

      unloadAdobeFonts();

      unloadExternalFrames();

    }


    /* MARKETING */

    if (
      state.marketing
    ) {

      loadGoogleTags();

    }


    syncSettingsControls();

  }


  /* =======================================================
     ADOBE FONTS
  ======================================================= */

  function loadAdobeFonts() {

    if (
      !CONFIG
        .adobeFontsStylesheet
    ) {

      return;

    }


    if (
      document
        .querySelector(
          'link[data-consent-adobe-fonts="true"]'
        )
    ) {

      return;

    }


    const link =
      document
        .createElement(
          "link"
        );


    link.rel =
      "stylesheet";


    link.href =
      CONFIG
        .adobeFontsStylesheet;


    link.dataset
      .consentAdobeFonts =
      "true";


    document.head
      .appendChild(link);

  }


  function unloadAdobeFonts() {

    document
      .querySelectorAll(
        'link[data-consent-adobe-fonts="true"]'
      )
      .forEach((link) => {
        link.remove();
      });

  }


  /* =======================================================
     GOOGLE MAPS
  ======================================================= */

  function loadExternalFrames() {

    document
      .querySelectorAll(
        'iframe[data-consent-src][data-consent-service="google-maps"]'
      )
      .forEach(
        (frame) => {


          if (
            !frame.src
          ) {

            frame.src =
              frame.dataset
                .consentSrc;

          }


          const wrapper =
            frame.closest(
              "[data-consent-map-wrapper]"
            );


          const placeholder =
            wrapper
              ?.querySelector(
                "[data-consent-map-placeholder]"
              );


          if (
            placeholder
          ) {

            placeholder.hidden =
              true;

          }


          frame.hidden =
            false;

        }
      );

  }


  function unloadExternalFrames() {

    document
      .querySelectorAll(
        'iframe[data-consent-src][data-consent-service="google-maps"]'
      )
      .forEach(
        (frame) => {


          frame
            .removeAttribute(
              "src"
            );


          frame.hidden =
            true;


          const wrapper =
            frame.closest(
              "[data-consent-map-wrapper]"
            );


          const placeholder =
            wrapper
              ?.querySelector(
                "[data-consent-map-placeholder]"
              );


          if (
            placeholder
          ) {

            placeholder.hidden =
              false;

          }

        }
      );

  }


  /* =======================================================
     GOOGLE ADS / GOOGLE ANALYTICS
  ======================================================= */

  function loadGoogleTags() {

    const ids = [

      CONFIG.googleAdsId,

      CONFIG.googleAnalyticsId

    ].filter(Boolean);


    if (
      !ids.length
    ) {

      return;

    }


    const primaryId =
      ids[0];


    /* GOOGLE TAG SCRIPT */

    if (
      !document
        .querySelector(
          'script[data-google-tag="true"]'
        )
    ) {

      const script =
        document
          .createElement(
            "script"
          );


      script.async =
        true;


      script.src =
        "https://www.googletagmanager.com/gtag/js?id=" +
        encodeURIComponent(
          primaryId
        );


      script.dataset
        .googleTag =
        "true";


      document.head
        .appendChild(
          script
        );

    }


    window.gtag(
      "js",
      new Date()
    );


    /* GOOGLE ADS */

    if (
      CONFIG.googleAdsId
    ) {

      window.gtag(
        "config",
        CONFIG.googleAdsId
      );

    }


    /* GOOGLE ANALYTICS */

    if (
      CONFIG.googleAnalyticsId
    ) {

      window.gtag(
        "config",
        CONFIG.googleAnalyticsId,
        {

          anonymize_ip:
            true

        }
      );

    }

  }


  /* =======================================================
     CREATE UI
  ======================================================= */

  function createUI() {

    if (
      document
        .querySelector(
          "[data-consent-panel]"
        )
    ) {

      return;

    }


    /* BACKDROP */

    const backdrop =
      document
        .createElement(
          "div"
        );


    backdrop.className =
      "consent-backdrop";


    backdrop.dataset
      .consentBackdrop =
      "";


    /* PANEL */

    const panel =
      document
        .createElement(
          "section"
        );


    panel.className =
      "consent-panel";


    panel.dataset
      .consentPanel =
      "";


    panel.setAttribute(
      "role",
      "dialog"
    );


    panel.setAttribute(
      "aria-modal",
      "true"
    );


    panel.setAttribute(
      "aria-labelledby",
      "consent-title"
    );


    panel.innerHTML = `

      <div class="consent-accent"></div>


      <div class="consent-inner">


        <p class="consent-eyebrow">

          Ihre Privatsphäre

        </p>


        <h2
          class="consent-title"
          id="consent-title"
        >

          Datenschutzeinstellungen

        </h2>


        <p class="consent-copy">

          Wir verwenden notwendige Speicherungen
          für Ihre Datenschutzentscheidung.

          Externe Dienste wie Google Maps
          und Adobe Fonts sowie zukünftige
          Marketing-Dienste werden erst
          nach Ihrer Einwilligung geladen.

          Mehr erfahren Sie in unserer

          <a href="datenschutz.html">
            Datenschutzerklärung
          </a>.

        </p>


        <div class="consent-actions">


          <button
            type="button"
            class="
              consent-button
              consent-button--secondary
            "
            data-consent-necessary
          >

            Nur notwendige

          </button>


          <button
            type="button"
            class="consent-button"
            data-consent-details
          >

            Einstellungen

          </button>


          <button
            type="button"
            class="
              consent-button
              consent-button--primary
            "
            data-consent-all
          >

            Alle akzeptieren

          </button>


        </div>


        <div
          class="consent-settings"
          data-consent-settings-panel
        >


          <!-- NECESSARY -->

          <div class="consent-category">


            <div>

              <h3>
                Notwendig
              </h3>


              <p>

                Speichert Ihre
                Datenschutzentscheidung.

                Diese Kategorie kann
                nicht deaktiviert werden.

              </p>

            </div>


            <label class="consent-switch">

              <input
                type="checkbox"
                checked
                disabled
              >

              <span></span>

            </label>


          </div>


          <!-- EXTERNAL -->

          <div class="consent-category">


            <div>

              <h3>
                Externe Dienste
              </h3>


              <p>

                Google Maps und Adobe Fonts.

                Diese Inhalte werden erst
                nach Ihrer Zustimmung geladen.

              </p>

            </div>


            <label class="consent-switch">

              <input
                type="checkbox"
                data-consent-external
              >

              <span></span>

            </label>


          </div>


          <!-- MARKETING -->

          <div class="consent-category">


            <div>

              <h3>
                Marketing
              </h3>


              <p>

                Vorbereitung für Google Ads,
                Conversion Tracking
                und optional Google Analytics.

              </p>

            </div>


            <label class="consent-switch">

              <input
                type="checkbox"
                data-consent-marketing
              >

              <span></span>

            </label>


          </div>


          <!-- SAVE -->

          <div
            class="
              consent-settings-actions
            "
          >


            <button
              type="button"
              class="
                consent-button
                consent-button--primary
              "
              data-consent-save
            >

              Auswahl speichern

            </button>


          </div>


        </div>


      </div>

    `;


    document.body
      .append(
        backdrop,
        panel
      );


    ui = {

      backdrop,

      panel,

      settingsPanel:
        panel.querySelector(
          "[data-consent-settings-panel]"
        ),

      external:
        panel.querySelector(
          "[data-consent-external]"
        ),

      marketing:
        panel.querySelector(
          "[data-consent-marketing]"
        )

    };


    /* =====================================================
       BUTTON EVENTS
    ===================================================== */


    /* ALLE AKZEPTIEREN */

    panel
      .querySelector(
        "[data-consent-all]"
      )
      .addEventListener(
        "click",
        () => {

          saveConsent({

            external:
              true,

            marketing:
              true

          });

        }
      );


    /* NUR NOTWENDIGE */

    panel
      .querySelector(
        "[data-consent-necessary]"
      )
      .addEventListener(
        "click",
        () => {

          saveConsent({

            external:
              false,

            marketing:
              false

          });

        }
      );


    /* EINSTELLUNGEN */

    panel
      .querySelector(
        "[data-consent-details]"
      )
      .addEventListener(
        "click",
        () => {

          ui
            .settingsPanel
            .classList
            .toggle(
              "is-open"
            );


          syncSettingsControls();

        }
      );


    /* AUSWAHL SPEICHERN */

    panel
      .querySelector(
        "[data-consent-save]"
      )
      .addEventListener(
        "click",
        () => {

          saveConsent({

            external:
              ui
                .external
                .checked,

            marketing:
              ui
                .marketing
                .checked

          });

        }
      );

  }


  /* =======================================================
     SYNC CONTROLS
  ======================================================= */

  function syncSettingsControls() {

    if (
      !ui
    ) {

      return;

    }


    ui.external.checked =
      Boolean(
        state.external
      );


    ui.marketing.checked =
      Boolean(
        state.marketing
      );

  }


  /* =======================================================
     OPEN / CLOSE
  ======================================================= */

  function openConsent(
    showSettings = false
  ) {

    createUI();

    syncSettingsControls();


    if (
      showSettings
    ) {

      ui
        .settingsPanel
        .classList
        .add(
          "is-open"
        );

    }

    else {

      ui
        .settingsPanel
        .classList
        .remove(
          "is-open"
        );

    }


    ui
      .backdrop
      .classList
      .add(
        "is-open"
      );


    ui
      .panel
      .classList
      .add(
        "is-open"
      );


    document.body.style
      .overflow =
      "hidden";

  }


  function closeConsent() {

    if (
      !ui
    ) {

      return;

    }


    ui
      .backdrop
      .classList
      .remove(
        "is-open"
      );


    ui
      .panel
      .classList
      .remove(
        "is-open"
      );


    document.body.style
      .overflow =
      "";

  }


  /* =======================================================
     PAGE BUTTONS
  ======================================================= */

  function bindPageButtons() {


    /* FOOTER / DATENSCHUTZ SETTINGS */

    document
      .querySelectorAll(
        "[data-consent-settings]"
      )
      .forEach(
        (button) => {

          button
            .addEventListener(
              "click",
              () => {

                openConsent(
                  true
                );

              }
            );

        }
      );


    /* GOOGLE MAPS BUTTON */

    document
      .querySelectorAll(
        "[data-consent-enable-external]"
      )
      .forEach(
        (button) => {

          button
            .addEventListener(
              "click",
              () => {

                saveConsent({

                  external:
                    true,

                  marketing:
                    state
                      .marketing

                });

              }
            );

        }
      );

  }


  /* =======================================================
     PUBLIC API
  ======================================================= */

  window.BSSConsent = {


    /* GET CURRENT STATE */

    getState() {

      return {
        ...state
      };

    },


    /* OPEN SETTINGS */

    openSettings() {

      openConsent(
        true
      );

    },


    /* RESET CONSENT */

    reset() {

      try {

        localStorage
          .removeItem(
            STORAGE_KEY
          );

      }

      catch (error) {

        console.warn(
          error
        );

      }


      state = {
        ...DEFAULT_CONSENT
      };


      applyConsent();

      openConsent(
        false
      );

    }

  };


  /* =======================================================
     INIT
  ======================================================= */

  document
    .addEventListener(
      "DOMContentLoaded",
      () => {


        createUI();


        bindPageButtons();


        applyConsent();


        /* FIRST VISIT */

        if (
          !hasDecision()
        ) {

          openConsent(
            false
          );

        }


      }
    );

})();

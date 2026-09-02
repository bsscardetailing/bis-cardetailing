/* =========================================================
   BURGER MENU
========================================================= */

const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-links');


function closeMenu() {
  if (!toggle || !menu) {
    return;
  }

  toggle.classList.remove('is-open');
  menu.classList.remove('is-open');
  document.body.classList.remove('menu-open');

  toggle.setAttribute('aria-expanded', 'false');
}


function openMenu() {
  if (!toggle || !menu) {
    return;
  }

  toggle.classList.add('is-open');
  menu.classList.add('is-open');
  document.body.classList.add('menu-open');

  toggle.setAttribute('aria-expanded', 'true');
}


if (toggle && menu) {

  toggle.addEventListener('click', () => {

    const menuIsOpen =
      menu.classList.contains('is-open');

    if (menuIsOpen) {
      closeMenu();
    } else {
      openMenu();
    }

  });


  menu
    .querySelectorAll('a')
    .forEach((link) => {

      link.addEventListener('click', () => {
        closeMenu();
      });

    });


  document.addEventListener('keydown', (event) => {

    if (
      event.key === 'Escape' &&
      menu.classList.contains('is-open')
    ) {
      closeMenu();
    }

  });

}


/* =========================================================
   REVEAL ANIMATION
========================================================= */

const reveals =
  document.querySelectorAll('.reveal');


if ('IntersectionObserver' in window) {

  const revealObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              'is-visible'
            );

            revealObserver.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.14
      }
    );


  reveals.forEach((item) => {
    revealObserver.observe(item);
  });

} else {

  reveals.forEach((item) => {
    item.classList.add('is-visible');
  });

}


/* =========================================================
   CURSOR GLOW
========================================================= */

const glow =
  document.querySelector('.cursor-glow');


if (glow) {

  window.addEventListener(
    'pointermove',
    (event) => {

      glow.style.left =
        `${event.clientX}px`;

      glow.style.top =
        `${event.clientY}px`;

    }
  );

}


/* =========================================================
   MAGNETIC EFFECT
========================================================= */

/*
   Только элементы с классом .magnetic.

   Package cards сюда НЕ входят,
   потому что transform нужен для их
   собственного позиционирования.
*/

document
  .querySelectorAll('.magnetic')
  .forEach((element) => {

    element.addEventListener(
      'mousemove',
      (event) => {

        const rect =
          element.getBoundingClientRect();


        const x =
          (
            event.clientX -
            rect.left -
            rect.width / 2
          ) / 18;


        const y =
          (
            event.clientY -
            rect.top -
            rect.height / 2
          ) / 18;


        element.style.transform =
          `translate(${x}px, ${y}px)`;

      }
    );


    element.addEventListener(
      'mouseleave',
      () => {

        element.style.transform = '';

      }
    );

  });


/* =========================================================
   PACKAGE HOVER SWITCHER
========================================================= */

/*
   НИКАКОГО переключения по клику.

   Наведение определяет,
   какая карточка сейчас большая.
*/

const packagesSwitcher =
  document.querySelector(
    '.packages-switcher'
  );


if (packagesSwitcher) {

  const packageLeft =
    packagesSwitcher.querySelector(
      '.package-left'
    );

  const packageCenter =
    packagesSwitcher.querySelector(
      '.package-center'
    );

  const packageRight =
    packagesSwitcher.querySelector(
      '.package-right'
    );


  function removePackageHoverClasses() {

    packagesSwitcher.classList.remove(
      'hover-left',
      'hover-center',
      'hover-right'
    );

  }


  if (packageLeft) {

    packageLeft.addEventListener(
      'mouseenter',
      () => {

        removePackageHoverClasses();

        packagesSwitcher.classList.add(
          'hover-left'
        );

      }
    );

  }


  if (packageCenter) {

    packageCenter.addEventListener(
      'mouseenter',
      () => {

        removePackageHoverClasses();

        packagesSwitcher.classList.add(
          'hover-center'
        );

      }
    );

  }


  if (packageRight) {

    packageRight.addEventListener(
      'mouseenter',
      () => {

        removePackageHoverClasses();

        packagesSwitcher.classList.add(
          'hover-right'
        );

      }
    );

  }


  /*
     Когда мышка покидает всю область
     пакетов, снова главным становится Premium.
  */

  packagesSwitcher.addEventListener(
    'mouseleave',
    () => {

      removePackageHoverClasses();

    }
  );

}


/* =========================================================
   ABOUT PHOTOS
========================================================= */

/*
   Две картинки в блоке
   "Ihr Auto wie neu"
   переключаются через radio + CSS.

   Дополнительный JS не нужен.
*/


/* =========================================================
   CURRENT YEAR
========================================================= */

const year =
  document.getElementById('year');


if (year) {

  year.textContent =
    new Date().getFullYear();

}
/* =========================================================
   HEADER SCROLL EFFECT
========================================================= */

const siteHeader =
  document.querySelector(
    ".site-header"
  );


function updateHeaderOnScroll() {

  if (!siteHeader) {
    return;
  }


  if (window.scrollY > 30) {

    siteHeader.classList.add(
      "is-scrolled"
    );

  } else {

    siteHeader.classList.remove(
      "is-scrolled"
    );

  }

}


window.addEventListener(
  "scroll",
  updateHeaderOnScroll,
  {
    passive: true
  }
);


updateHeaderOnScroll();

/* =========================================================
   CONTACT FORM — GOOGLE APPS SCRIPT
========================================================= */

const contactForm =
  document.getElementById('contactForm');


if (contactForm) {

  contactForm.addEventListener(
    'submit',
    async (event) => {

      event.preventDefault();


      const submitButton =
        contactForm.querySelector(
          '.contact-submit'
        );


      const formData =
        new FormData(contactForm);


      const data = {

        name:
          formData.get('name') || '',

        email:
          formData.get('email') || '',

        telefon:
          formData.get('telefon') || '',

        fahrzeug:
          formData.get('fahrzeug') || '',

        leistung:
          formData.get('leistung') || '',

        wunschtermin:
          formData.get('wunschtermin') || '',

        nachricht:
          formData.get('nachricht') || ''

      };


      if (submitButton) {

        submitButton.disabled = true;

        submitButton.textContent =
          'Wird gesendet...';

      }


      try {

        await fetch(
          'https://script.google.com/macros/s/AKfycbxlcRgs-MCt8Z06WPK-SBu3tCnqrrBXE0IodSpICyU_bYVCIlYRrPzXHd_gG_93nH-G/exec',
          {
            method: 'POST',

            mode: 'no-cors',

            headers: {
              'Content-Type':
                'text/plain;charset=utf-8'
            },

            body:
              JSON.stringify(data)
          }
        );


        alert(
          'Vielen Dank! Ihre Terminanfrage wurde erfolgreich gesendet.'
        );


        contactForm.reset();


      } catch (error) {

        console.error(
          'Formularfehler:',
          error
        );


        alert(
          'Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
        );

      } finally {

        if (submitButton) {

          submitButton.disabled = false;

          submitButton.textContent =
            'Anfrage senden';

        }

      }

    }
  );

}
/* =========================================================
   FAQ SMOOTH ACCORDION
========================================================= */

const faqItems =
  document.querySelectorAll(".faq-item");


faqItems.forEach((item) => {

  const summary =
    item.querySelector("summary");

  const answer =
    item.querySelector(".faq-answer");


  if (!summary || !answer) {
    return;
  }


  summary.addEventListener("click", (event) => {

    /* Reduced motion = обычное поведение браузера */

    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }


    event.preventDefault();


    /* Не запускаем несколько анимаций одновременно */

    if (item.dataset.animating === "true") {
      return;
    }


    item.dataset.animating = "true";


    /* =====================================================
       OPEN
    ===================================================== */

    if (!item.open) {

      item.open = true;


      const startHeight =
        summary.offsetHeight;

      const endHeight =
        item.offsetHeight;


      answer.animate(
        [
          {
            opacity: 0,
            transform: "translateY(-8px)"
          },

          {
            opacity: 1,
            transform: "translateY(0)"
          }
        ],
        {
          duration: 380,
          easing:
            "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "both"
        }
      );


      const animation =
        item.animate(
          [
            {
              height:
                `${startHeight}px`
            },

            {
              height:
                `${endHeight}px`
            }
          ],
          {
            duration: 420,
            easing:
              "cubic-bezier(0.22, 1, 0.36, 1)"
          }
        );


      animation.onfinish = () => {

        item.style.height = "";

        answer.getAnimations()
          .forEach((animation) => {
            animation.cancel();
          });

        delete item.dataset.animating;

      };

    }


    /* =====================================================
       CLOSE
    ===================================================== */

    else {

      const startHeight =
        item.offsetHeight;

      const endHeight =
        summary.offsetHeight;


      answer.animate(
        [
          {
            opacity: 1,
            transform: "translateY(0)"
          },

          {
            opacity: 0,
            transform: "translateY(-6px)"
          }
        ],
        {
          duration: 240,
          easing: "ease",
          fill: "both"
        }
      );


      const animation =
        item.animate(
          [
            {
              height:
                `${startHeight}px`
            },

            {
              height:
                `${endHeight}px`
            }
          ],
          {
            duration: 340,
            easing:
              "cubic-bezier(0.22, 1, 0.36, 1)"
          }
        );


      animation.onfinish = () => {

        item.open = false;

        item.style.height = "";

        answer.getAnimations()
          .forEach((animation) => {
            animation.cancel();
          });

        delete item.dataset.animating;

      };

    }

  });

});
/* =========================================================
   GALLERY LIGHTBOX - SAFE FINAL
========================================================= */

(() => {

  if (window.__galleryLightboxInitialized) {
    return;
  }

  window.__galleryLightboxInitialized = true;


  const galleryImages =
    document.querySelectorAll('.gallery-grid img');

  const lightbox =
    document.getElementById('gallery-lightbox');

  const lightboxImage =
    document.getElementById('gallery-lightbox-image');

  const closeButton =
    document.getElementById('gallery-lightbox-close');


  if (
    !galleryImages.length ||
    !lightbox ||
    !lightboxImage ||
    !closeButton
  ) {
    return;
  }


  function openLightbox(image) {

    lightboxImage.src = image.src;

    lightboxImage.alt =
      image.alt || 'Vergrößerte Galerieansicht';

    lightbox.classList.add('is-open');

    lightbox.setAttribute(
      'aria-hidden',
      'false'
    );

    document.body.classList.add(
      'gallery-lightbox-open'
    );

  }


  function closeLightbox() {

    lightbox.classList.remove('is-open');

    lightbox.setAttribute(
      'aria-hidden',
      'true'
    );

    document.body.classList.remove(
      'gallery-lightbox-open'
    );

  }


  galleryImages.forEach(image => {

    image.style.cursor = 'zoom-in';

    image.addEventListener(
      'click',
      () => {
        openLightbox(image);
      }
    );

  });


  closeButton.addEventListener(
    'click',
    closeLightbox
  );


  lightbox.addEventListener(
    'click',
    event => {

      if (
        event.target === lightbox ||
        event.target ===
          lightbox.querySelector(
            '.gallery-lightbox-inner'
          )
      ) {
        closeLightbox();
      }

    }
  );


  document.addEventListener(
    'keydown',
    event => {

      if (
        event.key === 'Escape' &&
        lightbox.classList.contains('is-open')
      ) {
        closeLightbox();
      }

    }
  );

})();
/* =========================================================
   MOBILE SERVICES - SCROLL ANIMATION
========================================================= */

(() => {

  const cards =
    document.querySelectorAll('.services-grid .service-card');

  if (!cards.length) {
    return;
  }


  const isMobile =
    window.matchMedia('(max-width: 520px)');


  function initServiceReveal() {

    if (!isMobile.matches) {

      cards.forEach(card => {
        card.classList.add('service-in-view');
      });

      return;
    }


    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                'service-in-view'
              );

              observer.unobserve(
                entry.target
              );

            }

          });

        },
        {
          threshold: 0.18,
          rootMargin: '0px 0px -8% 0px'
        }
      );


    cards.forEach(card => {

      card.classList.remove(
        'service-in-view'
      );

      observer.observe(card);

    });

  }


  initServiceReveal();

})();
/* =========================================================
   PREMIUM MOTION SYSTEM
========================================================= */

(() => {

  if (window.__premiumMotionInitialized) {
    return;
  }

  window.__premiumMotionInitialized = true;


  const reducedMotion =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;


  /* =======================================================
     HERO
  ======================================================= */

  const heroCar =
    document.querySelector(
      '.hero-car-line h1'
    );

  const heroDetailing =
    document.querySelector(
      '.hero-title > h1'
    );

  const heroLine =
    document.querySelector(
      '.hero-yellow-line'
    );

  const heroButton =
    document.querySelector(
      '.hero-btn'
    );


  if (heroCar) {
    heroCar.classList.add(
      'hero-motion-car'
    );
  }

  if (heroDetailing) {
    heroDetailing.classList.add(
      'hero-motion-detailing'
    );
  }

  if (heroLine) {
    heroLine.classList.add(
      'hero-motion-line'
    );
  }

  if (heroButton) {
    heroButton.classList.add(
      'hero-motion-button'
    );
  }


  requestAnimationFrame(() => {

    requestAnimationFrame(() => {

      document.body.classList.add(
        'motion-ready'
      );

    });

  });


  /* =======================================================
     GENERIC OBSERVER
  ======================================================= */

  const createObserver =
    (
      visibleClass,
      options = {}
    ) => {

      return new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              visibleClass
            );

            observer.unobserve(
              entry.target
            );

          });

        },
        {
          threshold:
            options.threshold ?? 0.18,

          rootMargin:
            options.rootMargin ??
            '0px 0px -8% 0px'
        }
      );

    };


  /* =======================================================
     SECTION TITLES
  ======================================================= */

  const titleSelectors = [

    '.section-title',
    '.price-section-title',
    '.extra-services-title',
    '.mobile-service-divider-inner',
    '.gallery-title-main',
    '.faq-title-row'

  ];


  const titleBlocks =
    document.querySelectorAll(
      titleSelectors.join(',')
    );


  const titleObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            'motion-title-visible'
          );

          titleObserver.unobserve(
            entry.target
          );

        });

      },
      {
        threshold: 0.25,
        rootMargin:
          '0px 0px -10% 0px'
      }
    );


  titleBlocks.forEach(block => {

    const directSpans =
      Array.from(
        block.children
      ).filter(
        child =>
          child.tagName === 'SPAN'
      );


    if (directSpans[0]) {
      directSpans[0].classList.add(
        'motion-title-line-left'
      );
    }


    if (directSpans[1]) {
      directSpans[1].classList.add(
        'motion-title-line-right'
      );
    }


    const title =
      block.querySelector(
        ':scope > h2, :scope > div > h2'
      );


    if (title) {
      title.classList.add(
        'motion-title-text'
      );
    }


    if (!reducedMotion) {
      titleObserver.observe(block);
    } else {
      block.classList.add(
        'motion-title-visible'
      );
    }

  });


  /* =======================================================
     PACKAGES
  ======================================================= */

  const packages =
    document.querySelectorAll(
      '.package-card'
    );


  const packageObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            'motion-package-visible'
          );

          packageObserver.unobserve(
            entry.target
          );

        });

      },
      {
        threshold: 0.16,
        rootMargin:
          '0px 0px -7% 0px'
      }
    );


  packages.forEach((card, index) => {

    card.classList.add(
      'motion-package'
    );

    card.style.transitionDelay =
      `${index * 90}ms`;


    if (!reducedMotion) {
      packageObserver.observe(card);
    } else {
      card.classList.add(
        'motion-package-visible'
      );
    }

  });


  /* =======================================================
     MOBILE SERVICE
  ======================================================= */

  const serviceDivider =
    document.querySelector(
      '.mobile-service-divider-inner'
    );

  const serviceTitle =
    serviceDivider?.querySelector(
      'h2'
    );

  const serviceContent =
    document.querySelector(
      '.mobile-service-content'
    );

  const serviceImage =
    document.querySelector(
      '.mobile-service-visual'
    );


  if (serviceTitle) {
    serviceTitle.classList.add(
      'motion-service-title'
    );
  }


  if (serviceContent) {
    serviceContent.classList.add(
      'motion-service-content'
    );
  }


  if (serviceImage) {
    serviceImage.classList.add(
      'motion-service-image'
    );
  }


  const serviceObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) {
            return;
          }


          if (
            entry.target ===
            serviceDivider
          ) {
            serviceDivider.classList.add(
              'motion-service-visible'
            );
          }


          if (
            entry.target ===
            serviceContent
          ) {
            serviceContent.classList.add(
              'motion-service-content-visible'
            );
          }


          if (
            entry.target ===
            serviceImage
          ) {
            serviceImage.classList.add(
              'motion-service-image-visible'
            );
          }


          serviceObserver.unobserve(
            entry.target
          );

        });

      },
      {
        threshold: 0.18,
        rootMargin:
          '0px 0px -8% 0px'
      }
    );


  [
    serviceDivider,
    serviceContent,
    serviceImage
  ].forEach(element => {

    if (!element) {
      return;
    }


    if (!reducedMotion) {

      serviceObserver.observe(
        element
      );

    } else {

      if (
        element ===
        serviceDivider
      ) {
        element.classList.add(
          'motion-service-visible'
        );
      }

      if (
        element ===
        serviceContent
      ) {
        element.classList.add(
          'motion-service-content-visible'
        );
      }

      if (
        element ===
        serviceImage
      ) {
        element.classList.add(
          'motion-service-image-visible'
        );
      }

    }

  });


  /* =======================================================
     GOOGLE RATING
  ======================================================= */

  const ratingBox =
    document.querySelector(
      '.google-rating-box'
    );

  const ratingStars =
    ratingBox?.querySelector(
      '.google-rating-stars'
    );

  const ratingScore =
    ratingBox?.querySelector(
      '.google-rating-score'
    );


  if (ratingStars) {
    ratingStars.classList.add(
      'motion-stars'
    );
  }


  if (ratingScore) {
    ratingScore.classList.add(
      'motion-score'
    );
  }


  if (ratingBox) {

    const ratingObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting) {
              return;
            }

            ratingBox.classList.add(
              'motion-rating-visible'
            );

            ratingObserver.unobserve(
              ratingBox
            );

          });

        },
        {
          threshold: 0.28,
          rootMargin:
            '0px 0px -8% 0px'
        }
      );


    if (!reducedMotion) {

      ratingObserver.observe(
        ratingBox
      );

    } else {

      ratingBox.classList.add(
        'motion-rating-visible'
      );

    }

  }


  /* =======================================================
     FAQ
  ======================================================= */

  const faqItems =
    document.querySelectorAll(
      '.faq-item'
    );


  const faqObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            'motion-faq-visible'
          );

          faqObserver.unobserve(
            entry.target
          );

        });

      },
      {
        threshold: 0.12,
        rootMargin:
          '0px 0px -6% 0px'
      }
    );


  faqItems.forEach((item, index) => {

    item.classList.add(
      'motion-faq'
    );

    item.style.transitionDelay =
      `${Math.min(index * 55, 220)}ms`;


    if (!reducedMotion) {

      faqObserver.observe(item);

    } else {

      item.classList.add(
        'motion-faq-visible'
      );

    }

  });

})();
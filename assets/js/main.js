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
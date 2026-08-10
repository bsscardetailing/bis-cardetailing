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
    const menuIsOpen = menu.classList.contains('is-open');

    if (menuIsOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });


  menu.querySelectorAll('a').forEach((link) => {

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

const reveals = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {

  const revealObserver = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add('is-visible');

          revealObserver.unobserve(entry.target);

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

const glow = document.querySelector('.cursor-glow');

if (glow) {

  window.addEventListener('pointermove', (event) => {

    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;

  });

}


/* =========================================================
   MAGNETIC EFFECT
========================================================= */

/*
   ВАЖНО:
   здесь только элементы с классом .magnetic.

   .package-card и .service-card здесь специально НЕТ,
   потому что их transform используется для позиционирования.
*/

document
  .querySelectorAll('.magnetic')
  .forEach((element) => {

    element.addEventListener('mousemove', (event) => {

      const rect = element.getBoundingClientRect();

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

    });


    element.addEventListener('mouseleave', () => {

      element.style.transform = '';

    });

  });


/* =========================================================
   PACKAGE SWITCHER
========================================================= */

const packageCards = Array.from(
  document.querySelectorAll(
    '.packages-switcher .package-card'
  )
);


if (packageCards.length === 3) {

  /*
     Массив определяет визуальный порядок:

     0 = слева
     1 = центр
     2 = справа
  */

  let packageOrder = [
    packageCards[0],
    packageCards[1],
    packageCards[2]
  ];


  function applyPackagePositions() {

    packageOrder.forEach((card, index) => {

      card.classList.remove(
        'package-left',
        'package-center',
        'package-right',
        'is-active'
      );


      if (index === 0) {

        card.classList.add(
          'package-left'
        );

      }


      if (index === 1) {

        card.classList.add(
          'package-center',
          'is-active'
        );

      }


      if (index === 2) {

        card.classList.add(
          'package-right'
        );

      }

    });

  }


  packageCards.forEach((card) => {

    card.addEventListener('click', (event) => {

      /*
         Если нажимаем на кнопку "Termin buchen",
         пакет не переключается.
      */

      if (event.target.closest('.package-button')) {
        return;
      }


      const clickedIndex =
        packageOrder.indexOf(card);


      /*
         Центральный пакет уже активный.
         Ничего не делаем.
      */

      if (clickedIndex === 1) {
        return;
      }


      /*
         Сохраняем текущий центральный пакет.
      */

      const currentCenter =
        packageOrder[1];


      /*
         Нажатый пакет становится центральным.
      */

      packageOrder[1] = card;


      /*
         Старый центральный пакет занимает
         место нажатого пакета.
      */

      packageOrder[clickedIndex] =
        currentCenter;


      /*
         Обновляем CSS-классы.
      */

      applyPackagePositions();

    });

  });


  /*
     Устанавливаем начальное положение.
  */

  applyPackagePositions();

}


/* =========================================================
   ABOUT PHOTO SWITCHER
========================================================= */

/*
   В блоке "Ihr Auto wie neu" переключение
   сделано через radio + CSS.

   Поэтому JavaScript здесь не нужен.
*/


/* =========================================================
   CURRENT YEAR
========================================================= */

const year = document.getElementById('year');

if (year) {

  year.textContent =
    new Date().getFullYear();

}

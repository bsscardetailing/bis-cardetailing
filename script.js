/* =====================================================
   BSS CAR DETAILING
   JAVASCRIPT
===================================================== */


/* ================= BURGER MENU ================= */

const burger = document.getElementById("burger");
const sideMenu = document.getElementById("sideMenu");
const menuOverlay = document.getElementById("menuOverlay");
const menuClose = document.getElementById("menuClose");

function openMenu() {
    sideMenu.classList.add("active");
    menuOverlay.classList.add("active");

    document.body.style.overflow = "hidden";
}

function closeMenu() {
    sideMenu.classList.remove("active");
    menuOverlay.classList.remove("active");

    document.body.style.overflow = "";
}

burger.addEventListener("click", openMenu);

menuClose.addEventListener("click", closeMenu);

menuOverlay.addEventListener("click", closeMenu);


/* ================= MENU LINKS ================= */

document.querySelectorAll(".menu-links a").forEach(link => {

    link.addEventListener("click", function () {

        if (this.getAttribute("href").startsWith("#")) {
            closeMenu();
        }

    });

});


/* ================= ESC CLOSE ================= */

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        closeMenu();
    }

});


/* ================= HEADER SCROLL ================= */

const header = document.getElementById("header");

window.addEventListener("scroll", function() {

    if (window.scrollY > 60) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

});


/* ================= SCROLL REVEAL ================= */

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(

    function(entries) {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);

            }

        });

    },

    {
        threshold: 0.12
    }

);


revealElements.forEach(element => {

    observer.observe(element);

});


/* ================= ACTIVE MENU LINK ================= */

const sections = document.querySelectorAll("section[id]");

const menuLinks = document.querySelectorAll(".menu-links a[href^='#']");

window.addEventListener("scroll", function() {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {

            currentSection = section.getAttribute("id");

        }

    });

    menuLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + currentSection) {

            link.classList.add("active");

        }

    });

});

/* =====================================
   LOADER
===================================== */

window.addEventListener("load", () => {

    const loader = document.querySelector(".loader");

    if (loader) {

        loader.style.opacity = "0";

        setTimeout(() => {

            loader.style.display = "none";

        }, 600);
    }

});


/* =====================================
   MOBILE MENU
===================================== */

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const serviceDropdown = document.querySelector(".nav-dropdown");
const dropdownToggle = document.querySelector(".nav-dropdown-toggle");

function setDropdownOpen(isOpen) {

    if (!serviceDropdown || !dropdownToggle) return;

    serviceDropdown.classList.toggle("open", isOpen);
    dropdownToggle.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
    );

}

function closeNavigation() {

    if (navLinks) {

        navLinks.classList.remove("active");

    }

    setDropdownOpen(false);

}

if (hamburger) {

    hamburger.addEventListener("click", () => {

        navLinks.classList.toggle("active");

        if (!navLinks.classList.contains("active")) {

            setDropdownOpen(false);

        }

    });

}

if (dropdownToggle) {

    dropdownToggle.addEventListener("click", event => {

        event.stopPropagation();

        const isOpen =
            serviceDropdown.classList.contains("open");

        setDropdownOpen(!isOpen);

    });

}

document.addEventListener("click", event => {

    if (
        serviceDropdown &&
        !serviceDropdown.contains(event.target)
    ) {

        setDropdownOpen(false);

    }

});


/* =====================================
   CLOSE MENU ON LINK CLICK
===================================== */

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        closeNavigation();

    });

});


/* =====================================
   NAVBAR SCROLL EFFECT
===================================== */

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        navbar.style.background =
            "rgba(0,0,0,0.85)";

        navbar.style.backdropFilter =
            "blur(20px)";

    } else {

        navbar.style.background =
            "rgba(0,0,0,0.35)";
    }

});


/* =====================================
   ACTIVE NAVIGATION
===================================== */

const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");
const dropdownSectionIds = ["services", "programs"];

function updateActiveNavigation() {

    let current = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        const sectionHeight =
            section.clientHeight;

        if (
            window.pageYOffset >= sectionTop &&
            window.pageYOffset <
            sectionTop + sectionHeight
        ) {

            current = section.getAttribute("id");

        }

    });

    navItems.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            "#" + current
        ) {

            link.classList.add("active");

        }

    });

    if (dropdownToggle) {

        dropdownToggle.classList.toggle(
            "active",
            dropdownSectionIds.includes(current)
        );

    }

}

window.addEventListener(
    "scroll",
    updateActiveNavigation
);

updateActiveNavigation();


/* =====================================
   PARTNER CAROUSEL
===================================== */

function duplicatePartnerTrack() {

    const track =
        document.querySelector(".partner-track");

    if (!track ||
        track.dataset.cloned === "true"
    ) {

        return;

    }

    const cards =
        Array.from(
            track.children
        );

    cards.forEach(card => {

        const clone =
            card.cloneNode(true);

        clone.setAttribute(
            "aria-hidden",
            "true"
        );

        track.appendChild(clone);

    });

    track.dataset.cloned = "true";

}

duplicatePartnerTrack();


/* =====================================
   SCROLL REVEAL
===================================== */

const revealElements = document.querySelectorAll(
    ".about, .services, .partners, .why-yajurvedh, .advantage, .why-what, .contact, .stat-card, .service-card, .adv-card"
);

function revealOnScroll() {

    revealElements.forEach(item => {

        const top =
            item.getBoundingClientRect().top;

        const windowHeight =
            window.innerHeight;

        if (top < windowHeight - 100) {

            item.style.opacity = "1";
            item.style.transform =
                "translateY(0)";

        }

    });

}

revealElements.forEach(item => {

    item.style.opacity = "0";
    item.style.transform =
        "translateY(60px)";
    item.style.transition =
        "all .8s ease";

});

window.addEventListener(
    "scroll",
    revealOnScroll
);

revealOnScroll();


/* =====================================
   COUNTER ANIMATION - MOBILE SAFE
===================================== */

const counters = document.querySelectorAll(".stat-card h2");

let counterStarted = false;

function animateCounter(counter) {

    const target = parseInt(counter.dataset.target, 10);
    const suffix = counter.dataset.suffix || "";
    // animation speed
    let current = 0;
    const increment = target / 500;

    function update() {

        current += increment;

        if (current < target) {

            counter.textContent =
                Math.floor(current) + suffix;

            requestAnimationFrame(update);

        } else {

            counter.textContent =
                target + suffix;

        }

    }

    update();

}

function startCounters() {

    if (counterStarted) return;

    counterStarted = true;

    counters.forEach(animateCounter);

}

/* Observe the stats block itself */
const statsSection = document.querySelector(".stats");

if (statsSection) {

    const observer = new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    startCounters();
                    observer.disconnect();

                }

            });

        },

        {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        }

    );

    observer.observe(statsSection);

} else {

    startCounters();

}
// add 10sec of counter

/* =====================================
   HERO PARALLAX
===================================== */

const hero =
    document.querySelector(".hero");

window.addEventListener("scroll", () => {

    const scroll =
        window.pageYOffset;

    if (hero) {

        hero.style.backgroundPositionY =
            scroll * 0.4 + "px";

    }

});


/* =====================================
   SIMPLE PARTICLES
===================================== */

const particles =
    document.getElementById(
        "particles"
    );

if (particles) {

    for (let i = 0; i < 40; i++) {

        const star =
            document.createElement("span");

        const size =
            Math.random() * 4 + 1;

        star.style.position = "absolute";

        star.style.width =
            size + "px";

        star.style.height =
            size + "px";

        star.style.borderRadius =
            "50%";

        star.style.background =
            "rgba(255,255,255,.6)";

        star.style.left =
            Math.random() * 100 + "%";

        star.style.top =
            Math.random() * 100 + "%";

        star.style.animation =
            `float ${
                Math.random() * 6 + 4
            }s infinite ease-in-out`;

        particles.appendChild(star);

    }

}


/* =====================================
   FLOAT KEYFRAMES
===================================== */

const style =
    document.createElement("style");

style.innerHTML = `

@keyframes float{

    0%{
        transform:
        translateY(0px);
        opacity:.2;
    }

    50%{
        transform:
        translateY(-20px);
        opacity:1;
    }

    100%{
        transform:
        translateY(0px);
        opacity:.2;
    }

}

.nav-links a.active,
.nav-dropdown-toggle.active{

    color:#c8a96a;

}

`;

document.head.appendChild(style);


/* =====================================
   BUTTON RIPPLE EFFECT
===================================== */

document.querySelectorAll(
    ".btn-primary, .btn-secondary"
).forEach(button => {

    button.addEventListener(
        "mouseenter",
        () => {

            button.style.transform =
                "translateY(-3px)";

        }
    );

    button.addEventListener(
        "mouseleave",
        () => {

            button.style.transform =
                "translateY(0px)";

        }
    );

});


/* =====================================
   CURRENT YEAR FOOTER
===================================== */

const footer =
    document.querySelector("footer p");

if (footer) {

    footer.innerHTML =
        "© " +
        new Date().getFullYear() +
        " Yajurvedh. All rights reserved.";

}
/* =====================================
   LETTER BY LETTER GOLD DISSOLVE
===================================== */

// window.addEventListener("load", () => {

//     const title =
//         document.getElementById(
//             "heroTitle"
//         );

//     if (!title) return;

//     const text =
//         title.innerText;

//     title.innerHTML = "";

//     [...text].forEach(char => {

//         const span =
//             document.createElement("span");

//         span.className =
//             "hero-letter";

//         span.textContent =
//             char === " " ?
//             "\u00A0" :
//             char;

//         title.appendChild(span);

//     });

//     const letters =
//         title.querySelectorAll(
//             ".hero-letter"
//         );

//     function dissolveLetter(letter) {

//         const rect =
//             letter.getBoundingClientRect();

//         for (let i = 0; i < 40; i++) {

//             const particle =
//                 document.createElement(
//                     "div"
//                 );

//             particle.className =
//                 "letter-particle";

//             particle.style.left =
//                 rect.left +
//                 rect.width / 2 +
//                 "px";

//             particle.style.top =
//                 rect.top +
//                 rect.height / 2 +
//                 window.scrollY +
//                 "px";

//             document.getElementById(
//                 "heroContent"
//             ).appendChild(
//                 particle
//             );

//             let x =
//                 (Math.random() - 0.5) * 40;

//             let y = -(Math.random() * 120 + 40);

//             particle.animate([

//                 {
//                     transform: "translate(0,0) scale(1)",
//                     opacity: 1
//                 },

//                 {
//                     transform: `translate(${x}px,${y}px) scale(0)`,
//                     opacity: 0
//                 }

//             ], {

//                 duration: 2000,

//                 easing: "ease-out"

//             });

//             setTimeout(() => {

//                 particle.remove();

//             }, 2000);

//         }

//         letter.style.opacity = "0";

//     }

//     setTimeout(() => {

//         letters.forEach(
//             (letter, index) => {

//                 setTimeout(() => {

//                     dissolveLetter(
//                         letter
//                     );

//                 }, index * 180);

//             }
//         );

//     }, 5000);

// });
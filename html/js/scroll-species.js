// Wait until the HTML is fully loaded
document.addEventListener("DOMContentLoaded", () => {

  /* ================= NAV TOGGLE ================= */
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("show");
    });
  }

  /* ================= SCROLL ANIMATION ================= */
  const elements = document.querySelectorAll(
    "#species .species-card, #ecosystems .species-card, .reveal-on-scroll"
  );

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle("revealed", entry.isIntersecting);
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));

  /* ================= SOUND ================= */
  const clickSound = document.getElementById("click-sound");

  let soundUnlocked = false;

  document.addEventListener("click", () => {
    if (!clickSound || soundUnlocked) return;

    clickSound.muted = true;
    clickSound.play().then(() => {
      clickSound.pause();
      clickSound.currentTime = 0;
      clickSound.muted = false;
      soundUnlocked = true;
    }).catch(() => {});
  }, { once: true });

  function playSound() {
    if (!clickSound || !soundUnlocked) return;

    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
  }

  /* ================= FILTER: SPECIES ONLY ================= */
  const speciesSection = document.querySelector("#species");

  if (speciesSection) {
    const speciesButtons = speciesSection.querySelectorAll(".filter-buttons button");
    const speciesCards = speciesSection.querySelectorAll(".species-card");

    speciesButtons.forEach(btn => {
      btn.addEventListener("click", () => {

        speciesButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        speciesCards.forEach(card => {
          const status = card.dataset.status;

          card.style.display =
            (filter === "all" || filter === status) ? "flex" : "none";
        });

        speciesSection.querySelectorAll(".slider-container").forEach(initSlider);
      });
    });
  }

  /* ================= FILTER: ECOSYSTEM ONLY ================= */
  const ecoSection = document.querySelector("#ecosystems");

  if (ecoSection) {
    const ecoButtons = ecoSection.querySelectorAll(".ecosystem-filter-buttons button");
    const ecoCards = ecoSection.querySelectorAll(".species-card");

    ecoButtons.forEach(btn => {
      btn.addEventListener("click", () => {

        ecoButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        ecoCards.forEach(card => {
          const status = card.dataset.status;

          card.style.display =
            (filter === "all" || filter === status) ? "flex" : "none";
        });

        ecoSection.querySelectorAll(".slider-container").forEach(initSlider);
      });
    });
  }

  /* ================= SLIDER ================= */
  document.querySelectorAll(".slider-container").forEach(initSlider);

  function initSlider(container) {

    const scroll = container.querySelector(".species-scroll");
    const leftBtn = container.querySelector(".arrow.left");
    const rightBtn = container.querySelector(".arrow.right");

    let index = 0;

    const getCards = () =>
      [...scroll.querySelectorAll(".species-card")]
        .filter(c => getComputedStyle(c).display !== "none");

    function updateSlider() {

      const cards = getCards();
      if (!cards.length) return;

      const maxIndex = cards.length - 1;

      if (index > maxIndex) index = 0;
      if (index < 0) index = maxIndex;

      const card = cards[index];

      const scrollPosition =
        card.offsetLeft +
        (card.offsetWidth / 2) -
        (scroll.clientWidth / 2);

      scroll.scrollTo({
        left: scrollPosition,
        behavior: "smooth"
      });

      cards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
    }

    function move(dir) {
      index += dir;
      updateSlider();
      playSound(); // ✅ ONLY HERE (buttons)
    }

    if (rightBtn) rightBtn.addEventListener("click", () => move(1));
    if (leftBtn) leftBtn.addEventListener("click", () => move(-1));

    setTimeout(updateSlider, 150);
  }

});
const feedbackForm = document.querySelector(".feedback-form");
const popup = document.getElementById("thankPopup");

if (feedbackForm) {

  feedbackForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("nameInput").value;
    const message = document.getElementById("feedbackInput").value;

    if (!name || !message) {
      alert("Please fill out all fields.");
      return;
    }

    /* ✅ SAVE */
    const data = {
      name,
      message,
      date: new Date().toLocaleString()
    };

    let saved = JSON.parse(localStorage.getItem("feedbacks")) || [];
    saved.push(data);
    localStorage.setItem("feedbacks", JSON.stringify(saved));

    /* ✅ POPUP */
    popup.style.display = "flex";

    setTimeout(() => {
      popup.style.display = "none";
    }, 2000);

    feedbackForm.reset();
  });

}
const closeBtn = document.getElementById("closeMenu");

if (closeBtn && navMenu) {
  closeBtn.addEventListener("click", () => {
    navMenu.classList.remove("show");
  });
}
const divider = document.querySelector(".home-divider");

window.addEventListener("scroll", () => {
  let scrollY = window.scrollY;

  let scale = Math.min(scrollY / 200, 1.2);

  divider.style.transform = `scaleX(${scale})`;
});
  AOS.init({
    once: true,
    duration: 800,
    offset: 120
  });
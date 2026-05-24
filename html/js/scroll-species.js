// Wait until the HTML is fully loaded
document.addEventListener("DOMContentLoaded", () => {

/* ================= NAV TOGGLE ================= */
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => navMenu.classList.toggle("show"));
  }

  const closeBtn = document.getElementById("closeMenu");
  if (closeBtn && navMenu) {
    closeBtn.addEventListener("click", () => navMenu.classList.remove("show"));
  }

/* ================= MODAL ================= */
const modal = document.getElementById("detailModal");
const modalClose = document.querySelector(".modal-close");

let scrollPosition = 0;

function openModal(card) {
  scrollPosition = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.width = "100%";
  document.body.classList.add("modal-open");
  
  modal.style.display = "block";
  
  const img = card.querySelector("img");
  const title = card.querySelector("h3").textContent;
  const latin = card.querySelector(".latin")?.textContent || "";
  const statusEl = card.querySelector(".status");
  const desc = card.querySelector(".desc")?.textContent.trim() || "";
  
  const isEcosystem = card.closest("#ecosystems") !== null;

  document.getElementById("modalImage").src = img.src;
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalLatin").textContent = latin;
  document.getElementById("modalDesc").textContent = desc;

  const modalStatusEl = document.getElementById("modalStatus");
  if (statusEl) {
    modalStatusEl.textContent = statusEl.textContent;
    modalStatusEl.className = `modal-status ${statusEl.classList[1] || 'common'}`;
    modalStatusEl.style.display = "block";
  }

  const habitatSection = document.querySelector(".modal-habitat");
  if (habitatSection) {
    if (isEcosystem) {
      habitatSection.style.display = "none";
    } else {
      const habitatText = card.querySelector(".habitat p")?.textContent.trim() || "Philippine marine waters";
      document.getElementById("modalHabitat").textContent = habitatText;
      habitatSection.style.display = "block";
    }
  }
}

function closeModal() {
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  window.scrollTo(0, scrollPosition);
}

// Make cards clickable
document.querySelectorAll(".species-card").forEach(card => {
  card.style.cursor = "pointer";
  card.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    openModal(card);
  });
});

if (modalClose) modalClose.addEventListener("click", closeModal);

window.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
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

    // Make ALL active by default
    speciesButtons.forEach(btn => {
      if (btn.dataset.filter === "all") btn.classList.add("active");
    });

    speciesButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        speciesButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        speciesCards.forEach(card => {
          const status = card.dataset.status || "common";
          card.style.display = (filter === "all" || filter === status) ? "flex" : "none";
        });

        // Reinitialize slider after filter
        setTimeout(() => {
          speciesSection.querySelectorAll(".slider-container").forEach(initSlider);
        }, 50);
      });
    });
  }

  /* ================= FILTER: ECOSYSTEM ONLY ================= */
  const ecoSection = document.querySelector("#ecosystems");

  if (ecoSection) {
    const ecoButtons = ecoSection.querySelectorAll(".ecosystem-filter-buttons button");
    const ecoCards = ecoSection.querySelectorAll(".species-card");

    // Make ALL active by default
    ecoButtons.forEach(btn => {
      if (btn.dataset.filter === "all") btn.classList.add("active");
    });

    ecoButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        ecoButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        ecoCards.forEach(card => {
          const status = card.dataset.status || "common";
          card.style.display = (filter === "all" || filter === status) ? "flex" : "none";
        });

        // Reinitialize slider after filter
        setTimeout(() => {
          ecoSection.querySelectorAll(".slider-container").forEach(initSlider);
        }, 50);
      });
    });
  }
 /* ================= SLIDER - SMOOTH INFINITE CAROUSEL ================= */
document.querySelectorAll(".slider-container").forEach(initSlider);

function initSlider(container) {
  const scroll = container.querySelector(".species-scroll");
  const leftBtn = container.querySelector(".arrow.left");
  const rightBtn = container.querySelector(".arrow.right");

  let index = 1;
  let isDragging = false;
  let startX = 0;
  let scrollLeftPos = 0;

  function refreshCards() {
    return [...scroll.querySelectorAll(".species-card")]
      .filter(c => getComputedStyle(c).display !== "none");
  }

  function clearPreviousClones() {
    scroll.querySelectorAll(".species-card.clone").forEach(card => card.remove());
  }

  function setupInfinite() {
    clearPreviousClones();
    let cards = refreshCards();
    if (cards.length < 2) return;

    const firstClone = cards[0].cloneNode(true);
    const lastClone = cards[cards.length - 1].cloneNode(true);

    firstClone.classList.add("clone");
    lastClone.classList.add("clone");

    scroll.appendChild(firstClone);
    scroll.insertBefore(lastClone, scroll.firstChild);

    [firstClone, lastClone].forEach(clone => {
      clone.style.cursor = "pointer";
      clone.addEventListener("click", () => openModal(clone));
    });
  }

  function updateSlider(smooth = true) {
    let cards = refreshCards();
    if (cards.length < 3) return;

    const realCardCount = cards.length - 2;
    if (index > realCardCount) index = 1;
    if (index < 1) index = realCardCount;

    const targetCard = cards[index];
    const cardWidth = targetCard.offsetWidth + 30;
    const centerPosition = targetCard.offsetLeft - (scroll.clientWidth - targetCard.offsetWidth) / 2;

    scroll.scrollTo({
      left: centerPosition,
      behavior: smooth ? "smooth" : "auto"
    });

    cards.forEach(c => c.classList.remove("active"));
    targetCard.classList.add("active");
  }

  // Initial setup
  setTimeout(() => {
    setupInfinite();
    updateSlider(false);
  }, 150);

  // Arrow buttons
  function move(dir) {
    index += dir;
    updateSlider(true);
    if (typeof playSound === "function") playSound();
  }

  if (rightBtn) rightBtn.addEventListener("click", () => move(1));
  if (leftBtn) leftBtn.addEventListener("click", () => move(-1));

  // ================= IMPROVED SMOOTH SWIPE =================
  scroll.addEventListener("touchstart", e => {
    isDragging = true;
    startX = e.touches[0].pageX - scroll.offsetLeft;
    scrollLeftPos = scroll.scrollLeft;
    scroll.style.scrollBehavior = "auto";   // Disable smooth during drag
  }, { passive: true });

  scroll.addEventListener("touchmove", e => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scroll.offsetLeft;
    const walk = (x - startX) * 1.8;        // Smoother multiplier
    scroll.scrollLeft = scrollLeftPos - walk;
  }, { passive: true });

  scroll.addEventListener("touchend", () => {
    isDragging = false;
    scroll.style.scrollBehavior = "smooth"; // Re-enable smooth

    const cards = refreshCards();
    if (cards.length < 2) return;

    const cardWidth = cards[1] ? cards[1].offsetWidth + 30 : 400;
    index = Math.round(scroll.scrollLeft / cardWidth);
    
    // Snap to nearest card
    updateSlider(true);
  });

}});


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

  
const currentYear = document.getElementById("current-year");
const faqItems = Array.from(document.querySelectorAll(".faq-item"));
const certificateSlides = Array.from(document.querySelectorAll(".certificate-slide"));
const certificateControls = Array.from(document.querySelectorAll(".certificate-control"));
const swipeIndicators = Array.from(document.querySelectorAll("[data-swipe-indicator]"));
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const leadModal = document.getElementById("lead-modal");
const openLeadModalButtons = Array.from(document.querySelectorAll("[data-open-lead-modal]"));
const closeLeadModalButtons = Array.from(document.querySelectorAll("[data-close-lead-modal]"));

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

if (mobileMenuToggle && mobileMenu) {
  const setMobileMenuOpen = (isOpen) => {
    mobileMenuToggle.classList.toggle("is-open", isOpen);
    mobileMenu.classList.toggle("is-open", isOpen);
    mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
    mobileMenuToggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
  };

  mobileMenuToggle.addEventListener("click", () => {
    setMobileMenuOpen(!mobileMenu.classList.contains("is-open"));
  });

  mobileMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setMobileMenuOpen(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (!mobileMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
      setMobileMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMobileMenuOpen(false);
    }
  });
}

if (leadModal && openLeadModalButtons.length > 0) {
  const modalDialog = leadModal.querySelector(".lead-modal-dialog");
  let lastFocusedElement = null;

  const setLeadModalOpen = (isOpen) => {
    leadModal.classList.toggle("is-open", isOpen);
    leadModal.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("has-open-modal", isOpen);

    if (isOpen) {
      lastFocusedElement = document.activeElement;
      window.setTimeout(() => {
        const firstInput = leadModal.querySelector("input, select, button");
        firstInput?.focus();
      }, 80);
      return;
    }

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  };

  openLeadModalButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      setLeadModalOpen(true);
    });
  });

  closeLeadModalButtons.forEach((button) => {
    button.addEventListener("click", () => setLeadModalOpen(false));
  });

  leadModal.addEventListener("click", (event) => {
    if (modalDialog && !modalDialog.contains(event.target)) {
      setLeadModalOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && leadModal.classList.contains("is-open")) {
      setLeadModalOpen(false);
    }
  });
}

const attachLeadHandler = (formId, feedbackId, buildMessage) => {
  const form = document.getElementById(formId);
  const feedback = document.getElementById(feedbackId);

  if (!form || !feedback) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const message = buildMessage(formData);
    feedback.textContent = message;
    form.reset();
  });
};

attachLeadHandler("modal-form", "modal-form-feedback", (formData) => {
  const fullName = formData.get("full-name");
  const firstName = typeof fullName === "string" ? fullName.trim().split(/\s+/)[0] : "";

  return firstName
    ? `${firstName}, спасибо. Мы получили заявку и скоро свяжемся с вами.`
    : "Спасибо. Мы получили заявку и скоро свяжемся с вами.";
});

if (faqItems.length > 0) {
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) {
        return;
      }

      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.open = false;
        }
      });
    });
  });
}

if (certificateSlides.length > 0 && certificateControls.length === certificateSlides.length) {
  let certificateIndex = 0;
  let certificateTimer;

  const showCertificate = (nextIndex) => {
    certificateIndex = nextIndex;

    certificateSlides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === certificateIndex);
    });

    certificateControls.forEach((control, index) => {
      control.classList.toggle("is-active", index === certificateIndex);
    });
  };

  const startCertificateTimer = () => {
    window.clearInterval(certificateTimer);
    certificateTimer = window.setInterval(() => {
      showCertificate((certificateIndex + 1) % certificateSlides.length);
    }, 4200);
  };

  certificateControls.forEach((control, index) => {
    control.addEventListener("click", () => {
      showCertificate(index);
      startCertificateTimer();
    });
  });

  startCertificateTimer();
}

if (swipeIndicators.length > 0) {
  swipeIndicators.forEach((indicator) => {
    const scroller = indicator.previousElementSibling;
    const dots = Array.from(indicator.querySelectorAll(".swipe-dot"));

    if (!scroller || dots.length === 0) {
      return;
    }

    const cards = Array.from(scroller.children);
    const prevButton = document.createElement("button");
    const nextButton = document.createElement("button");

    prevButton.className = "swipe-arrow swipe-arrow-prev";
    prevButton.type = "button";
    prevButton.setAttribute("aria-label", "Показать предыдущую карточку");
    prevButton.innerHTML = "<span aria-hidden=\"true\">‹</span>";

    nextButton.className = "swipe-arrow swipe-arrow-next";
    nextButton.type = "button";
    nextButton.setAttribute("aria-label", "Показать следующую карточку");
    nextButton.innerHTML = "<span aria-hidden=\"true\">›</span>";

    indicator.prepend(prevButton);
    indicator.append(nextButton);

    let activeIndex = 0;

    const setActiveDot = () => {
      const scrollerBox = scroller.getBoundingClientRect();
      const snapLine = scrollerBox.left + 1;
      let shortestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const cardBox = card.getBoundingClientRect();
        const distance = Math.abs(snapLine - cardBox.left);

        if (distance < shortestDistance) {
          shortestDistance = distance;
          activeIndex = index;
        }
      });

      dots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === activeIndex);
      });

      prevButton.disabled = activeIndex === 0;
      nextButton.disabled = activeIndex === cards.length - 1;
    };

    const scrollToCard = (index) => {
      const targetCard = cards[index];

      if (!targetCard) {
        return;
      }

      targetCard.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    };

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        scrollToCard(index);
      });
    });

    prevButton.addEventListener("click", () => scrollToCard(Math.max(activeIndex - 1, 0)));
    nextButton.addEventListener("click", () => scrollToCard(Math.min(activeIndex + 1, cards.length - 1)));

    scroller.addEventListener("scroll", () => {
      window.requestAnimationFrame(setActiveDot);
    });

    setActiveDot();
  });
}

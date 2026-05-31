const currentYear = document.getElementById("current-year");
const faqItems = Array.from(document.querySelectorAll(".faq-item"));
const activityToast = document.getElementById("activity-toast");
const activityText = document.getElementById("activity-text");
const certificateSlides = Array.from(document.querySelectorAll(".certificate-slide"));
const certificateControls = Array.from(document.querySelectorAll(".certificate-control"));
const swipeIndicators = Array.from(document.querySelectorAll("[data-swipe-indicator]"));
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

const activityMessages = [
  "18 минут назад клиент из Германии оставил случай по заблокированному выводу",
  "32 минуты назад подготовили список документов для обращения в банк",
  "Сегодня уже 7 человек запросили первичный разбор по брокерам и списаниям",
  "11 минут назад клиентка из Польши уточнила маршрут по chargeback-случаю",
];

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

attachLeadHandler("hero-form", "hero-form-feedback", (formData) => {
  const fullName = formData.get("full-name");
  const firstName = typeof fullName === "string" ? fullName.trim().split(/\s+/)[0] : "";

  return firstName
    ? `${firstName}, спасибо. Заявка принята в обработку.`
    : "Спасибо. Заявка принята в обработку.";
});

attachLeadHandler("lead-form", "form-feedback", (formData) => {
  const fullName = formData.get("full-name");
  const firstName = typeof fullName === "string" ? fullName.trim().split(/\s+/)[0] : "";

  return firstName
    ? `${firstName}, спасибо. Заявка принята в обработку.`
    : "Спасибо. Заявка принята в обработку.";
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

if (activityToast && activityText && activityMessages.length > 0) {
  let activityIndex = 0;

  const showActivity = () => {
    activityText.textContent = activityMessages[activityIndex];
    activityToast.classList.add("is-visible");

    window.setTimeout(() => {
      activityToast.classList.remove("is-visible");
    }, 6200);

    activityIndex = (activityIndex + 1) % activityMessages.length;
  };

  window.setTimeout(showActivity, 2200);
  window.setInterval(showActivity, 14000);
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

    const setActiveDot = () => {
      const scrollerBox = scroller.getBoundingClientRect();
      const snapLine = scrollerBox.left + 1;
      let activeIndex = 0;
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
    };

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        const targetCard = cards[index];

        if (!targetCard) {
          return;
        }

        targetCard.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
      });
    });

    scroller.addEventListener("scroll", () => {
      window.requestAnimationFrame(setActiveDot);
    });

    setActiveDot();
  });
}

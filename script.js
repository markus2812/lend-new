const currentYear = document.getElementById("current-year");
const faqItems = Array.from(document.querySelectorAll(".faq-item"));
const certificateSlides = Array.from(document.querySelectorAll(".certificate-slide"));
const certificateControls = Array.from(document.querySelectorAll(".certificate-control"));
const swipeIndicators = Array.from(document.querySelectorAll("[data-swipe-indicator]"));
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

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
    ? `${firstName}, спасибо. Мы получили заявку и скоро свяжемся с вами.`
    : "Спасибо. Мы получили заявку и скоро свяжемся с вами.";
});

attachLeadHandler("lead-form", "form-feedback", (formData) => {
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

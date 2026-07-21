const root = document.body.dataset.root || ".";
const page = document.body.dataset.page || "home";
const categoryIcons = {
  educatie: ["educatie.svg", "Educație"],
  comunicare: ["comunicare.svg", "Comunicare"],
  atentie: ["atentie.svg", "Atenție"],
  comunitate: ["comunitate.svg", "Comunitate"],
  siguranta: ["siguranta.svg", "Siguranță"],
  alegeri: ["alegeri-inteligente.svg", "Alegeri inteligente"]
};

const navigation = [
  ["home", "Acasă", `${root}/index.html`],
  ["educatie", "Educație", `${root}/pages/educatie.html`],
  ["comunicare", "Comunicare", `${root}/pages/comunicare.html`],
  ["atentie", "Atenție", `${root}/pages/atentie.html`],
  ["comunitate", "Comunitate", `${root}/pages/comunitate.html`],
  ["siguranta", "Siguranță", `${root}/pages/siguranta.html`],
  ["alegeri", "Alegeri inteligente", `${root}/pages/alegeri-inteligente.html`]
];

const projectNavigation = [
  ["Despre noi", `${root}/pages/despre-noi.html`],
  ["Contact", `${root}/pages/contact.html`]
];

const header = document.querySelector("[data-site-header]");
const footer = document.querySelector("[data-site-footer]");

if (header) {
  header.innerHTML = `
    <a class="skip-link" href="#continut">Sari la conținut</a>
    <header class="site-header">
      <div class="container nav-wrap">
        <a class="brand" href="${root}/index.html" aria-label="Siguranța la Negru — Acasă">
          <img src="${root}/assets/images/logo.png" alt="" width="50" height="50">
          <span>Siguranța la Negru<small>Tehnologie pe înțelesul tuturor</small></span>
        </a>
        <button class="menu-toggle" type="button" aria-label="Deschide meniul" aria-expanded="false" aria-controls="navigatie"><span></span></button>
        <nav class="site-nav" id="navigatie" aria-label="Navigație principală">
          <ul>${navigation.map(([id, label, url]) => `<li><a href="${url}"${page === id ? ' aria-current="page"' : ""}>${label}</a></li>`).join("")}</ul>
        </nav>
      </div>
    </header>`;
}

if (footer) {
  footer.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <img src="${root}/assets/images/watermark.png" alt="Siguranța la Negru" loading="lazy">
            <p>Tehnologie pe înțelesul tuturor.</p>
          </div>
          <div class="footer-categories"><h2>Categorii</h2><ul>${navigation.slice(1).map(([, label, url]) => `<li><a href="${url}">${label}</a></li>`).join("")}</ul></div>
          <div class="footer-project"><h2>Proiect</h2><ul>${projectNavigation.map(([label, url]) => `<li><a href="${url}">${label}</a></li>`).join("")}</ul></div>
        </div>
        <div class="footer-bottom"><span>© <span data-year></span> Siguranța la Negru</span><span>Educație digitală, fără cuvinte complicate.</span></div>
      </div>
    </footer>`;
}

const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
toggle?.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
  toggle.setAttribute("aria-label", open ? "Deschide meniul" : "Închide meniul");
  nav?.classList.toggle("is-open", !open);
});
nav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) { nav.classList.remove("is-open"); toggle?.setAttribute("aria-expanded", "false"); }
});
document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

const pageMark = document.querySelector(".page-hero-mark");
if (pageMark && categoryIcons[page]) {
  const [icon, label] = categoryIcons[page];
  pageMark.removeAttribute("aria-hidden");
  pageMark.innerHTML = `<img src="${root}/assets/images/categories/${icon}" alt="Simbol ${label}">`;
}

const revealItems = document.querySelectorAll(".mission-card, .power-card, .comic-tip, .comic-section-heading");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealItems.forEach((item, index) => {
    item.classList.add("reveal-item");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
  });
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .14, rootMargin: "0px 0px -40px" });
  revealItems.forEach(item => revealObserver.observe(item));
}

const carousel = document.querySelector("[data-carousel]");
if (carousel) {
  const track = carousel.querySelector(".missions-track");
  const mobileCarousel = window.matchMedia("(max-width: 720px)").matches;
  if (mobileCarousel) {
    const cards = [...carousel.querySelectorAll(".mission-card")];
    track.replaceChildren(...cards.map((card, index) => {
      const slide = document.createElement("div");
      slide.className = "mission-slide mobile-mission-slide";
      slide.setAttribute("aria-label", `Misiunea ${index + 1} din ${cards.length}`);
      slide.append(card);
      return slide;
    }));
    const dotsContainer = carousel.querySelector(".carousel-dots");
    dotsContainer.innerHTML = cards.map((_, index) => `<button type="button" class="carousel-dot${index === 0 ? " is-active" : ""}" data-carousel-dot="${index}" aria-label="Misiunea ${index + 1}" aria-selected="${index === 0}"></button>`).join("");
  }
  const slides = [...carousel.querySelectorAll(".mission-slide")];
  const dots = [...carousel.querySelectorAll("[data-carousel-dot]")];
  let carouselIndex = 0;
  let autoplayId;

  const showSlide = (index, userInitiated = false) => {
    carouselIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${carouselIndex * 100}%)`;
    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === carouselIndex;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-selected", String(active));
    });
    slides.forEach((slide, slideIndex) => slide.setAttribute("aria-hidden", String(slideIndex !== carouselIndex)));
    if (userInitiated) restartAutoplay();
  };
  const startAutoplay = () => {
    window.clearInterval(autoplayId);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    autoplayId = window.setInterval(() => showSlide(carouselIndex + 1), 6500);
  };
  const restartAutoplay = () => { window.clearInterval(autoplayId); startAutoplay(); };

  carousel.querySelector("[data-carousel-prev]")?.addEventListener("click", () => showSlide(carouselIndex - 1, true));
  carousel.querySelector("[data-carousel-next]")?.addEventListener("click", () => showSlide(carouselIndex + 1, true));
  dots.forEach(dot => dot.addEventListener("click", () => showSlide(Number(dot.dataset.carouselDot), true)));
  carousel.addEventListener("mouseenter", () => window.clearInterval(autoplayId));
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", () => window.clearInterval(autoplayId));
  carousel.addEventListener("focusout", startAutoplay);
  showSlide(0);
  startAutoplay();
}

document.querySelectorAll("[data-coming-soon]").forEach(button => {
  button.addEventListener("click", event => {
    event.preventDefault();
    const existingToast = document.querySelector(".site-toast");
    existingToast?.remove();
    const toast = document.createElement("div");
    toast.className = "site-toast";
    toast.setAttribute("role", "status");
    toast.textContent = "Misiunea va fi disponibilă în curând!";
    document.body.append(toast);
    requestAnimationFrame(() => toast.classList.add("is-visible"));
    window.setTimeout(() => { toast.classList.remove("is-visible"); window.setTimeout(() => toast.remove(), 250); }, 2600);
  });
});

document.querySelector("[data-contact-form]")?.addEventListener("submit", event => {
  event.preventDefault();
  const toast = document.createElement("div");
  toast.className = "site-toast";
  toast.setAttribute("role", "status");
  toast.textContent = "Formularul este pregătit. Conectarea la email urmează înainte de publicare.";
  document.body.append(toast);
  requestAnimationFrame(() => toast.classList.add("is-visible"));
  window.setTimeout(() => { toast.classList.remove("is-visible"); window.setTimeout(() => toast.remove(), 250); }, 3400);
});

/* Fitbox Mendoza — JS mínimo: enlaces editables + menú + detalles UI */
(function () {
  "use strict";

  const cfg = window.FITBOX_CONFIG || {};
  const num = (cfg.whatsappNumber || "").replace(/\D/g, "");
  const msgGeneral = encodeURIComponent(cfg.whatsappMessageGeneral || "Hola Fitbox, quiero info.");
  const msgPrueba = encodeURIComponent(cfg.whatsappMessagePrueba || "Hola Fitbox, quiero probar una clase.");

  const waGeneral = num ? `https://wa.me/${num}?text=${msgGeneral}` : "#empezar";
  const waPrueba = num ? `https://wa.me/${num}?text=${msgPrueba}` : "#empezar";

  // 1) WhatsApp: todos los botones funcionan (abren en nueva pestaña)
  document.querySelectorAll("[data-whatsapp]").forEach((a) => {
    const kind = a.getAttribute("data-msg") === "prueba" ? waPrueba : waGeneral;
    a.setAttribute("href", kind);
    if (kind.startsWith("http")) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    }
    // Aviso en consola (no visible) si falta número real
    if (!num || num === "5492610000000") {
      a.setAttribute("title", "Demo: reemplazar whatsappNumber en config.js");
    }
  });

  // 2) Instagram + Maps editables
  document.querySelectorAll("[data-instagram]").forEach((a) => {
    if (cfg.instagramUrl) a.setAttribute("href", cfg.instagramUrl);
  });
  document.querySelectorAll("[data-maps]").forEach((a) => {
    if (cfg.mapsUrl) a.setAttribute("href", cfg.mapsUrl);
  });

  // 3) Dirección editable
  document.querySelectorAll("[data-address-short]").forEach((el) => {
    if (cfg.addressShort) el.textContent = cfg.addressShort;
  });
  document.querySelectorAll("[data-address-long]").forEach((el) => {
    if (cfg.addressLong) el.textContent = cfg.addressLong;
  });

  // 4) Año footer
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // 5) Header con sombra + menú móvil accesible
  const header = document.querySelector(".site-header");
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");

  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && nav) {
    const close = () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menú");
    };
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
    nav.querySelectorAll("a").forEach((l) => l.addEventListener("click", close));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
    // Evita que el menú móvil quede abierto al pasar a desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) close();
    });
  }

  // 6) Reveal sutil + nav activa (respeta reduced-motion)
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sections = document.querySelectorAll("main section[id]");
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("visible");
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.12 }
    );
    document
      .querySelectorAll(".card, .schedule-card, .ph, .cta-box, .info-box, .quote-box")
      .forEach((el) => {
        el.classList.add("reveal");
        io.observe(el);
      });

    // Nav activa
    const links = document.querySelectorAll('.main-nav a[href^="#"]');
    const spy = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            links.forEach((l) => {
              const isActive = l.getAttribute("href") === "#" + en.target.id;
              l.classList.toggle("active", isActive);
              if (isActive) l.setAttribute("aria-current", "true");
              else l.removeAttribute("aria-current");
            });
          }
        }),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }
})();

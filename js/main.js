/* ============================================================
   Asian International School — shared scripts
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Hero slider ---------- */
  function initSlider() {
    const slider = document.querySelector(".hero-slider");
    if (!slider) return;
    const slides = slider.querySelectorAll(".hero-slide");
    const dotsWrap = slider.querySelector(".hero-dots");
    let current = 0;
    let timer = null;

    if (slides.length <= 1) {
      if (slides[0]) slides[0].classList.add("active");
      return;
    }

    if (dotsWrap) {
      slides.forEach(function (_, i) {
        const btn = document.createElement("button");
        btn.setAttribute("aria-label", "Go to slide " + (i + 1));
        btn.addEventListener("click", function () {
          goTo(i);
          restart();
        });
        dotsWrap.appendChild(btn);
      });
      dotsWrap.querySelector("button").classList.add("active");
    }

    function goTo(index) {
      slides[current].classList.remove("active");
      current = index;
      slides[current].classList.add("active");
      if (dotsWrap) {
        const btns = dotsWrap.querySelectorAll("button");
        btns.forEach(function (b, i) {
          b.classList.toggle("active", i === current);
        });
      }
    }

    function next() {
      goTo((current + 1) % slides.length);
    }

    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(next, 6000);
    }

    restart();
  }

  /* ---------- Tabs ---------- */
  function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach(function (wrap) {
      const buttons = wrap.querySelectorAll(".tab-btn");
      const panels = wrap.querySelectorAll(".tab-panel");
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          buttons.forEach(function (b) { b.classList.remove("active"); });
          panels.forEach(function (p) { p.classList.remove("active"); });
          btn.classList.add("active");
          const target = wrap.querySelector(btn.getAttribute("data-target"));
          if (target) target.classList.add("active");
        });
      });
    });
  }

  /* ---------- Accordion ---------- */
  function initAccordion() {
    document.querySelectorAll(".accordion").forEach(function (wrap) {
      const items = wrap.querySelectorAll(".accordion-item");
      items.forEach(function (item) {
        const header = item.querySelector(".accordion-header");
        const body = item.querySelector(".accordion-body");
        header.addEventListener("click", function () {
          const isOpen = item.classList.contains("open");
          items.forEach(function (it) {
            it.classList.remove("open");
            it.querySelector(".accordion-body").style.maxHeight = null;
          });
          if (!isOpen) {
            item.classList.add("open");
            body.style.maxHeight = body.scrollHeight + "px";
          }
        });
      });
    });
  }

  /* ---------- Mobile nav ---------- */
  function initNav() {
    const toggle = document.querySelector(".nav-toggle");
    const close = document.querySelector(".nav-close");
    const nav = document.querySelector(".nav");
    const overlay = document.querySelector(".nav-overlay");

    function openNav() {
      if (nav) nav.classList.add("open");
      if (overlay) overlay.classList.add("show");
      document.body.style.overflow = "hidden";
    }
    function closeNav() {
      if (nav) nav.classList.remove("open");
      if (overlay) overlay.classList.remove("show");
      document.body.style.overflow = "";
    }

    if (toggle) toggle.addEventListener("click", openNav);
    if (close) close.addEventListener("click", closeNav);
    if (overlay) overlay.addEventListener("click", closeNav);

    document.querySelectorAll(".dropdown > a").forEach(function (link) {
      link.addEventListener("click", function (e) {
        if (window.innerWidth > 1080) return;
        e.preventDefault();
        const li = link.closest(".dropdown");
        const wasOpen = li.classList.contains("open");
        document.querySelectorAll(".dropdown").forEach(function (d) {
          d.classList.remove("open");
        });
        if (!wasOpen) li.classList.add("open");
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const delay = parseFloat(entry.target.getAttribute("data-reveal-delay") || 0);
          if (delay) entry.target.style.transitionDelay = delay + "s";
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });

    els.forEach(function (el) {
      el.classList.add("reveal");
      io.observe(el);
    });

    // Staggered groups: reveal children one-by-one after the group enters.
    const groups = document.querySelectorAll("[data-reveal-group]");
    groups.forEach(function (group) {
      const children = group.querySelectorAll(":scope > *");
      children.forEach(function (child, i) {
        child.classList.add("reveal", "reveal-child");
        child.style.transitionDelay = (i * 0.09) + "s";
        io.observe(child);
      });
    });
  }

  /* ---------- Scroll progress bar ---------- */
  function initScrollProgress() {
    var bar = document.getElementById("scrollProgress");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "scrollProgress";
      bar.className = "scroll-progress";
      bar.setAttribute("aria-hidden", "true");
      document.body.appendChild(bar);
    }
    var fill = document.createElement("span");
    fill.className = "scroll-progress-fill";
    bar.appendChild(fill);
    var ticking = false;
    var update = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      fill.style.width = pct + "%";
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /* ---------- Parallax on full-width media ---------- */
  function initParallax() {
    const layers = document.querySelectorAll("[data-parallax]");
    if (!layers.length) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    function update() {
      const vh = window.innerHeight;
      layers.forEach(function (layer) {
        const rect = layer.parentNode.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        const offset = (rect.top + rect.height / 2 - vh / 2) * -0.08;
        layer.style.transform = "translateY(" + offset + "px) scale(1.08)";
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /* ---------- Back to top ---------- */
  function initBackToTop() {
    var btn = document.getElementById("backToTop");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "backToTop";
      btn.className = "back-to-top";
      btn.setAttribute("aria-label", "Back to top");
      btn.innerHTML = "&#8593;";
      document.body.appendChild(btn);
    }
    var toggle = function () {
      if (window.scrollY > 600) btn.classList.add("show");
      else btn.classList.remove("show");
    };
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", toggle, { passive: true });
    toggle();
  }

  /* ---------- Animated counters (stats) ---------- */
  function initCounters() {
    const counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;
    function run(counter) {
      const target = parseFloat(counter.getAttribute("data-count"));
      const suffix = counter.getAttribute("data-suffix") || "";
      const duration = 1600;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        counter.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            run(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (c) { io.observe(c); });
    } else {
      counters.forEach(run);
    }
  }

  /* ---------- Header scroll state ---------- */
  function initHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const onScroll = function () {
      if (window.scrollY > 8) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Page loader ---------- */
  function initPageLoader() {
    var loader = document.getElementById("pageLoader");
    // Compute relative prefix from page location so the loader logo
    // resolves from any subfolder (about/, news/, academics/, ...).
    var basePath = document.location.pathname.split("/").filter(Boolean);
    basePath.pop(); // drop the file name (or empty)
    var prefix = basePath.map(function () { return ".."; }).join("/");
    var logoPath = (prefix ? prefix + "/" : "") + "images/AIS-LOGO-small.png";
    if (!loader) {
      loader = document.createElement("div");
      loader.id = "pageLoader";
      loader.className = "page-loader";
      loader.setAttribute("aria-hidden", "true");
      loader.innerHTML =
        '<div class="loader-ring" aria-hidden="true"></div>' +
        '<div class="loader-logo"><img src="' + logoPath + '" alt="" width="72" height="72"></div>' +
        '<div class="loader-bar"><span></span></div>' +
        '<div class="loader-text">Asian International School</div>';
      document.body.appendChild(loader);
    }
    var done = function () {
      loader.classList.add("hidden");
      document.body.classList.add("loader-done");
    };
    if (document.readyState === "complete") {
      setTimeout(done, 350);
    } else {
      window.addEventListener("load", function () {
        setTimeout(done, 350);
      });
    }
    setTimeout(done, 3500);
  }

  /* ---------- News carousel ---------- */
  function initNewsCarousel() {
    const wrap = document.querySelector(".news-carousel");
    if (!wrap) return;
    const track = wrap.querySelector(".news-track");
    const items = Array.prototype.slice.call(track.children);
    if (items.length <= 1) return;
    const dotsWrap = wrap.querySelector(".news-dots");
    let index = 0;
    let timer = null;

    const buildDots = function () {
      for (let i = 0; i < items.length; i++) {
        const dot = document.createElement("button");
        dot.setAttribute("aria-label", "Go to slide " + (i + 1));
        dot.addEventListener("click", function () {
          goTo(i);
          restart();
        });
        dotsWrap.appendChild(dot);
      }
      dotsWrap.children[0].classList.add("active");
    };

    const update = function () {
      const perView = window.innerWidth <= 620 ? 1 : window.innerWidth <= 940 ? 2 : 3;
      const maxIndex = Math.max(0, items.length - perView);
      if (index > maxIndex) index = 0;
      const slide = items[0].getBoundingClientRect().width + 24;
      track.style.transform = "translateX(" + (-index * slide) + "px)";
      Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
        d.classList.toggle("active", i === index);
      });
    };

    const goTo = function (i) {
      index = i;
      update();
    };

    const next = function () {
      const perView = window.innerWidth <= 620 ? 1 : window.innerWidth <= 940 ? 2 : 3;
      const maxIndex = Math.max(0, items.length - perView);
      index = index >= maxIndex ? 0 : index + 1;
      update();
    };

    const prev = function () {
      const perView = window.innerWidth <= 620 ? 1 : window.innerWidth <= 940 ? 2 : 3;
      const maxIndex = Math.max(0, items.length - perView);
      index = index <= 0 ? maxIndex : index - 1;
      update();
    };

    const restart = function () {
      if (timer) clearInterval(timer);
      timer = setInterval(next, 3500);
    };

    const prevBtn = wrap.querySelector(".news-arrow-prev");
    const nextBtn = wrap.querySelector(".news-arrow-next");
    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restart(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { next(); restart(); });

    wrap.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
    wrap.addEventListener("mouseleave", restart);

    if (dotsWrap) buildDots();
    goTo(0);
    restart();
    window.addEventListener("resize", function () { update(); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initSlider();
    initNewsCarousel();
    initTabs();
    initAccordion();
    initNav();
    initReveal();
    initScrollProgress();
    initParallax();
    initBackToTop();
    initCounters();
    initHeader();
    initPageLoader();
  });
})();
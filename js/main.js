(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const state = {
    animatedCounters: new WeakSet(),
    theme: localStorage.getItem('arkay-theme') || 'light',
  };

  function throttle(fn, delay = 120) {
    let last = 0;
    let timeoutId = null;

    return (...args) => {
      const now = Date.now();
      const remaining = delay - (now - last);

      if (remaining <= 0) {
        last = now;
        fn(...args);
        return;
      }

      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        last = Date.now();
        fn(...args);
      }, remaining);
    };
  }

  function lockScroll(locked) {
    document.body.classList.toggle('no-scroll', locked);
  }

  function initLoadingScreen() {
    const screen = $('#loadingScreen') || $('.loading-screen');
    if (!screen) return;

    const hideScreen = () => {
      screen.classList.add('opacity-0');
      window.setTimeout(() => {
        screen.remove();
      }, 500);
    };

    if (document.readyState === 'complete') {
      window.requestAnimationFrame(hideScreen);
      return;
    }

    window.addEventListener('load', hideScreen, { once: true });
  }

  function initStickyHeader() {
    const header = $('#siteHeader');
    if (!header) return;

    const onScroll = throttle(() => {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initMobileNav() {
    const toggle = $('#mobileNavToggle');
    const panel = $('#mobileNavPanel');
    const closeButton = $('#mobileNavClose');
    if (!toggle || !panel) return;

    const openNav = () => {
      panel.classList.add('is-open');
      panel.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      lockScroll(true);
    };

    const closeNav = () => {
      panel.classList.remove('is-open');
      panel.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      lockScroll(false);
    };

    toggle.addEventListener('click', () => {
      panel.classList.contains('is-open') ? closeNav() : openNav();
    });

    closeButton?.addEventListener('click', closeNav);
    panel.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeNav();
    });
  }

  function initSmoothScroll() {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;

      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      event.preventDefault();
      const header = $('#siteHeader');
      const offset = header ? header.getBoundingClientRect().height : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset - 12;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  }

  function animateCounter(element) {
    const target = Number(element.dataset.counter || 0);
    const duration = 1600;
    const start = performance.now();

    const tick = (time) => {
      const progress = Math.min(1, (time - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }

  function initCounters() {
    const counters = $$('[data-counter]');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach((counter) => animateCounter(counter));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || state.animatedCounters.has(entry.target)) return;
        state.animatedCounters.add(entry.target);
        animateCounter(entry.target);
      });
    }, { threshold: 0.35 });

    counters.forEach((counter) => observer.observe(counter));
  }

  function initRevealAnimations() {
    const items = $$('[data-reveal]');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.18 });

    items.forEach((item) => observer.observe(item));
  }

  function initBackToTop() {
    const button = $('#backToTop');
    if (!button) return;

    const onScroll = throttle(() => {
      button.classList.toggle('is-visible', window.scrollY > 320);
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    onScroll();
  }

  function initCookieBanner() {
    const banner = $('#cookieBanner');
    const button = $('#acceptCookies');
    if (!banner || !button) return;

    const accepted = localStorage.getItem('arkayCookiesAccepted') === 'yes';
    if (accepted) {
      banner.remove();
      return;
    }

    banner.classList.add('is-visible');
    button.addEventListener('click', () => {
      localStorage.setItem('arkayCookiesAccepted', 'yes');
      banner.classList.remove('is-visible');
      window.setTimeout(() => banner.remove(), 250);
    });
  }

  function openModal(modal) {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    lockScroll(true);
  }

  function closeModal(modal) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    lockScroll(false);
  }

  function initQuickViewModal() {
    const modal = $('#quickViewModal');
    if (!modal) return;

    const title = $('#quickViewTitle');
    const price = $('#quickViewPrice');
    const description = $('#quickViewDescription');
    const image = $('#quickViewImage');

    $$('[data-quick-view]').forEach((button) => {
      button.addEventListener('click', () => {
        if (title) title.textContent = button.dataset.productName || 'Product';
        if (price) price.textContent = button.dataset.productPrice || '';
        if (description) description.textContent = button.dataset.productDesc || '';
        if (image) {
          image.src = button.dataset.productImage || '../images/placeholder.svg';
          image.alt = button.dataset.productName || 'Product';
        }

        openModal(modal);
      });
    });

    $$('[data-modal-close]').forEach((button) => {
      button.addEventListener('click', () => closeModal(modal));
    });

    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal(modal);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal(modal);
    });
  }

  function initAccordion() {
    $$('[data-accordion-trigger]').forEach((button) => {
      button.addEventListener('click', () => {
        const item = button.closest('.accordion-item');
        if (!item) return;
        item.classList.toggle('is-open');
      });
    });
  }

  function initTabs() {
    $$('[data-spec-tab]').forEach((button) => {
      button.addEventListener('click', () => {
        const wrapper = button.closest('section');
        if (!wrapper) return;

        const target = button.dataset.specTab;
        $$('[data-spec-tab]', wrapper).forEach((candidate) => {
          candidate.setAttribute('aria-selected', String(candidate === button));
        });
        $$('[data-spec-panel]', wrapper).forEach((panel) => {
          panel.hidden = panel.dataset.specPanel !== target;
        });
      });
    });
  }

  function initProductGallery() {
    const mainImage = $('#mainGalleryImage');
    if (!mainImage) return;

    $$('[data-gallery-thumb]').forEach((button) => {
      button.addEventListener('click', () => {
        const full = button.dataset.full;
        if (!full) return;

        mainImage.src = full;
        $$('[data-gallery-thumb]').forEach((thumb) => thumb.classList.remove('border-primary'));
        button.classList.add('border-primary');
      });
    });
  }

  function setFormStatus(form, message, success = true) {
    let status = $('[data-form-status]', form);
    if (!status) {
      status = document.createElement('p');
      status.dataset.formStatus = 'true';
      form.append(status);
    }

    status.className = `mt-2 text-sm font-medium ${success ? 'text-emerald-600' : 'text-red-600'}`;
    status.textContent = message;
  }

  function isValidEmail(value) {
    return /^\S+@\S+\.\S+$/.test(value);
  }

  function isValidPhone(value) {
    return /^[0-9+\-()\s]{7,}$/.test(value);
  }

  function initForms() {
    $$('form[data-validate-form]').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();

        const data = new FormData(form);
        const values = Object.fromEntries(data.entries());
        const submitButton = form.querySelector('button[type="submit"]');

        if (values.email !== undefined && String(values.email).trim() && !isValidEmail(String(values.email).trim())) {
          setFormStatus(form, 'Please enter a valid email address.', false);
          return;
        }

        if (values.phone !== undefined && String(values.phone).trim() && !isValidPhone(String(values.phone).trim())) {
          setFormStatus(form, 'Please enter a valid phone number.', false);
          return;
        }

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.dataset.originalText = submitButton.textContent || 'Submit';
          submitButton.textContent = 'Sending...';
        }

        window.setTimeout(() => {
          setFormStatus(form, 'Thanks. We will contact you shortly.', true);
          form.reset();

          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = submitButton.dataset.originalText || 'Submit';
          }
        }, 700);
      });
    });
  }

  function initLazyImages() {
    $$('img[data-src]').forEach((img) => {
      const source = img.dataset.src;
      if (!source) return;

      img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
      img.src = source;

      if (img.complete) {
        img.classList.add('is-loaded');
      }
    });
  }

  /* ── Theme Toggle ── */
  function initThemeToggle() {
    // Apply saved theme immediately
    applyTheme(state.theme, false);

    // Wire up all toggle buttons
    $$('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
      });
    });
  }

  function applyTheme(theme, animate) {
    state.theme = theme;
    const root = document.documentElement;

    if (animate) {
      root.classList.add('theme-transitioning');
      setTimeout(() => root.classList.remove('theme-transitioning'), 600);
    }

    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }

    localStorage.setItem('arkay-theme', theme);

    // Update aria labels on toggle buttons
    $$('.theme-toggle').forEach(btn => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  function init() {
    initThemeToggle();
    initLoadingScreen();
    initStickyHeader();
    initMobileNav();
    initSmoothScroll();
    initCounters();
    initRevealAnimations();
    initBackToTop();
    initCookieBanner();
    initQuickViewModal();
    initAccordion();
    initTabs();
    initProductGallery();
    initForms();
    initLazyImages();
  }

  // Apply theme before DOM ready to avoid flash
  (function() {
    const saved = localStorage.getItem('arkay-theme') || 'light';
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  })();

  document.addEventListener('DOMContentLoaded', init);
})();
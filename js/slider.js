(() => {
  'use strict';

  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function initHeroSlider() {
    const root = document.querySelector('[data-hero-slider]');
    if (!root) return;

    const slides = $$('[data-hero-slide]', root);
    const prev = root.querySelector('[data-hero-prev]');
    const next = root.querySelector('[data-hero-next]');
    const dotsWrap = root.querySelector('[data-hero-dots]');
    if (!slides.length || !dotsWrap) return;

    let index = 0;
    let timer = null;

    const dots = slides.map((slide, slideIndex) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot h-3 w-3 rounded-full bg-white/60';
      dot.setAttribute('aria-label', `Go to slide ${slideIndex + 1}`);
      dot.addEventListener('click', () => goTo(slideIndex));
      dotsWrap.appendChild(dot);
      return dot;
    });

    const render = () => {
      slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === index));
      dots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === index));
    };

    const goTo = (nextIndex) => {
      index = (nextIndex + slides.length) % slides.length;
      render();
      restartAutoplay();
    };

    const nextSlide = () => goTo(index + 1);
    const prevSlide = () => goTo(index - 1);

    /* First slide (info) stays 5s, image slides rotate every 4s */
    const getDelay = () => index === 0 ? 5000 : 4000;

    const startAutoplay = () => {
      stopAutoplay();
      timer = window.setTimeout(() => {
        nextSlide();
        startAutoplay();
      }, getDelay());
    };
    const stopAutoplay = () => {
      if (timer) window.clearTimeout(timer);
    };
    const restartAutoplay = () => {
      startAutoplay();
    };

    prev?.addEventListener('click', prevSlide);
    next?.addEventListener('click', nextSlide);
    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);
    root.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') prevSlide();
      if (event.key === 'ArrowRight') nextSlide();
    });
    root.setAttribute('tabindex', '0');

    render();
    startAutoplay();
  }

  function initTestimonialSlider() {
    const root = document.querySelector('[data-testimonial-slider]');
    if (!root) return;

    const track = root.querySelector('[data-testimonial-track]');
    const slides = $$('[data-testimonial-slide]', root);
    const prev = root.querySelector('[data-testimonial-prev]');
    const next = root.querySelector('[data-testimonial-next]');
    const dotsWrap = root.querySelector('[data-testimonial-dots]');
    if (!track || !slides.length || !dotsWrap) return;

    let index = 0;
    let timer = null;

    const visibleSlides = () => (window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3);

    const buildDots = () => {
      dotsWrap.innerHTML = '';
      const pages = Math.max(1, Math.ceil(slides.length / visibleSlides()));
      return Array.from({ length: pages }, (_, pageIndex) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot h-3 w-3 rounded-full bg-white/60';
        dot.setAttribute('aria-label', `Go to testimonial page ${pageIndex + 1}`);
        dot.addEventListener('click', () => goToPage(pageIndex));
        dotsWrap.appendChild(dot);
        return dot;
      });
    };

    let dots = buildDots();

    const render = () => {
      const perView = visibleSlides();
      const maxIndex = Math.max(0, slides.length - perView);
      index = Math.min(index, maxIndex);
      const cardWidth = slides[0].getBoundingClientRect().width + 24;
      track.style.transform = `translateX(-${index * cardWidth}px)`;
      const pageIndex = Math.floor(index / perView);
      dots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === pageIndex));
    };

    const goToPage = (pageIndex) => {
      index = pageIndex * visibleSlides();
      render();
      restartAutoplay();
    };

    const nextSlide = () => {
      const perView = visibleSlides();
      const maxIndex = Math.max(0, slides.length - perView);
      index = index >= maxIndex ? 0 : index + 1;
      render();
    };

    const prevSlide = () => {
      const perView = visibleSlides();
      const maxIndex = Math.max(0, slides.length - perView);
      index = index <= 0 ? maxIndex : index - 1;
      render();
    };

    const startAutoplay = () => {
      stopAutoplay();
      timer = window.setInterval(nextSlide, 4500);
    };

    const stopAutoplay = () => {
      if (timer) window.clearInterval(timer);
    };

    const restartAutoplay = () => {
      startAutoplay();
    };

    prev?.addEventListener('click', prevSlide);
    next?.addEventListener('click', nextSlide);
    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);
    window.addEventListener('resize', () => {
      dots = buildDots();
      render();
    });

    render();
    startAutoplay();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHeroSlider();
    initTestimonialSlider();
  });
})();

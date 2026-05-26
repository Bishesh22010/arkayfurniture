(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function initGallery() {
    const items = $$('[data-gallery-item]');
    const lightbox = $('#galleryLightbox');
    const lightboxImage = $('#lightboxImage');
    if (!items.length || !lightbox || !lightboxImage) return;

    const open = (src, alt) => {
      lightboxImage.src = src;
      lightboxImage.alt = alt;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
    };

    const close = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
    };

    items.forEach((item) => {
      item.addEventListener('click', () => {
        const image = item.querySelector('img');
        if (!image) return;
        open(image.src, image.alt || 'Gallery image');
      });
    });

    $$('[data-lightbox-close]', lightbox).forEach((button) => button.addEventListener('click', close));
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) close();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && lightbox.classList.contains('is-open')) close();
    });
  }

  document.addEventListener('DOMContentLoaded', initGallery);
})();

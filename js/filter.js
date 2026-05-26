(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function initProductFilters() {
    const filterButtons = $$('[data-product-filter]');
    const cards = $$('[data-product-card]');
    const searchInput = $('[data-product-search]');
    if (!filterButtons.length || !cards.length) return;

    const state = {
      filter: 'all',
      query: '',
    };

    const applyFilters = () => {
      cards.forEach((card) => {
        const category = (card.dataset.category || '').toLowerCase();
        const searchable = (card.dataset.search || card.textContent || '').toLowerCase();
        const matchesCategory = state.filter === 'all' || category.includes(state.filter);
        const matchesQuery = !state.query || searchable.includes(state.query);
        card.hidden = !(matchesCategory && matchesQuery);
      });
    };

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        state.filter = (button.dataset.productFilter || 'all').toLowerCase();
        filterButtons.forEach((candidate) => {
          candidate.setAttribute('aria-selected', String(candidate === button));
        });
        applyFilters();
      });
    });

    searchInput?.addEventListener('input', (event) => {
      state.query = event.target.value.trim().toLowerCase();
      applyFilters();
    });

    applyFilters();
  }

  function initGalleryFilters() {
    const filterButtons = $$('[data-gallery-filter]');
    const items = $$('[data-gallery-item]');
    if (!filterButtons.length || !items.length) return;

    const state = { filter: 'all' };

    const applyFilters = () => {
      items.forEach((item) => {
        const category = (item.dataset.galleryCategory || '').toLowerCase();
        item.hidden = !(state.filter === 'all' || category.includes(state.filter));
      });
    };

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        state.filter = (button.dataset.galleryFilter || 'all').toLowerCase();
        filterButtons.forEach((candidate) => {
          candidate.setAttribute('aria-selected', String(candidate === button));
        });
        applyFilters();
      });
    });

    applyFilters();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initProductFilters();
    initGalleryFilters();
  });
})();

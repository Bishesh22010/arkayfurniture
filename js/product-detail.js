document.addEventListener('DOMContentLoaded', () => {
  // Parse URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  // Find product in data
  // productsData and categoriesData are defined in data.js
  let product = null;
  if (typeof productsData !== 'undefined' && productId) {
    product = productsData.find(p => p.id === productId);
  }
  if (!product && typeof categoriesData !== 'undefined' && productId) {
    product = categoriesData.find(p => p.id === productId);
  }

  // Fallback if not found or no ID provided
  if (!product && typeof productsData !== 'undefined' && productsData.length > 0) {
    product = productsData.find(p => p.id === 'royal-teak-bedroom-set') || productsData[0];
  }

  if (product) {
    // Format category nicely
    const formattedCategory = product.category
      .split(' ')
      .map(word => word.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
      .join(', ');

    // Update Page Title
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = `${product.title} | Custom Furniture | Arkay Interior`;

    // Update Header Titles
    const titleEl = document.getElementById('pd-title');
    if (titleEl) titleEl.textContent = product.title;

    const descHeader = document.getElementById('pd-desc-header');
    if (descHeader) descHeader.textContent = product.desc;

    // Update Main Image
    const mainImg = document.getElementById('mainGalleryImage');
    if (mainImg) {
      if (product.img) {
        mainImg.src = `images/${encodeURI(product.img)}`;
        mainImg.alt = product.title;
        mainImg.classList.remove('hidden');
      } else {
        mainImg.src = '';
        mainImg.alt = 'Image coming soon';
        mainImg.classList.add('hidden');
      }
    }

    // Update Category Badge
    const categoryBadge = document.getElementById('pd-category');
    if (categoryBadge) categoryBadge.textContent = formattedCategory;

    // Update Body Description
    const descBody = document.getElementById('pd-desc-body');
    if (descBody) descBody.textContent = product.desc;
    // Populate Gallery
    const galleryContainer = document.getElementById('pd-gallery-container');
    const galleryMap = {
      'cat-living-room': ['living room 1.png', 'living room 2.png', 'living room 3.png', 'living room 4.png', 'living room 5.png', 'living room 6.png', 'living room 7.png', 'living room 8.png'],
      'cat-bedroom': ['bed room 1.png', 'bed room 2.png', 'bed room 3.png', 'bed room 4.png', 'bed room 5.png', 'bed room 6.png', 'kids bedroom1.png', 'kids bedroom2.png', 'kids bedroom3.png', 'kids bedroom4.png'],
      'cat-kids-bedroom': ['kids bedroom1.png', 'kids bedroom2.png', 'kids bedroom3.png', 'kids bedroom4.png'],
      'cat-modular-kitchen': ['modular kitchen 1.png', 'modular kitchen 2.png', 'modular kitchen 3.png'],
      'cat-bathroom': ['bathroom1.png', 'bathroom2.png', 'bathroom3.png'],
      'cat-washing-area': ['washing area 1.png', 'washing area 2.png', 'washing area 3.png'],
      'cat-temple-area': ['temple area 1.png'],
      'cat-dining': ['dining1.png', 'dining2.png', 'dining3.png'],
      'cat-sofa': ['sofa1.jpg', 'sofa2.jpg', 'sofa3.jpg'],
      'cat-wardrobe': ['wardrobe1.jpeg', 'wardrobe2.jpeg', 'wardrobe3.png']
    };

    if (galleryContainer && product) {
      const images = galleryMap[product.id];
      if (images && images.length > 0) {
        galleryContainer.innerHTML = ''; // Clear placeholder
        galleryContainer.classList.remove('hidden');
        images.forEach((img, idx) => {
          const button = document.createElement('button');
          button.className = 'gallery-thumb overflow-hidden rounded-[1rem] border border-slate-200';
          if (idx === 0) {
            button.classList.add('border-2', 'border-primary');
            button.classList.remove('border-slate-200');
          }
          button.setAttribute('data-gallery-thumb', '');
          button.setAttribute('data-full', `images/${encodeURI(img)}`);
          
          const imgEl = document.createElement('img');
          imgEl.src = `images/${encodeURI(img)}`;
          imgEl.alt = `${product.title} view ${idx + 1}`;
          imgEl.className = 'h-24 w-full object-cover';
          imgEl.loading = 'lazy';
          
          button.appendChild(imgEl);
          galleryContainer.appendChild(button);

          // Add click event for the thumbnail
          button.addEventListener('click', () => {
            const mainImg = document.getElementById('mainGalleryImage');
            if (mainImg) {
              mainImg.src = `images/${encodeURI(img)}`;
            }
            // Update active state
            document.querySelectorAll('[data-gallery-thumb]').forEach(btn => {
              btn.classList.remove('border-2', 'border-primary');
              btn.classList.add('border-slate-200');
            });
            button.classList.add('border-2', 'border-primary');
            button.classList.remove('border-slate-200');
          });
        });
      } else {
        galleryContainer.classList.add('hidden');
      }
    }
  }
});

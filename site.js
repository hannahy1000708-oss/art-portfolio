async function loadJSON(path) {
  try {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function renderGallery(items, gridId, sectionId) {
  const grid = document.getElementById(gridId || 'gallery-grid');
  if (sectionId) {
    const section = document.getElementById(sectionId);
    if (!items || !items.length) {
      section.style.display = 'none';
      return;
    }
    section.style.display = '';
  }

  grid.innerHTML = items.map((item, i) => {
    const num = String(i + 1).padStart(2, '0');
    const media = item.image
      ? `<img src="${item.image}" alt="${item.title || ''}" loading="lazy" data-full="${item.image}">`
      : `<div class="placeholder" style="--tint:${item.tint || '#eee'}"><span>${num}</span></div>`;
    return `
      <figure class="art-card">
        ${media}
        <figcaption>
          <h3>${item.title || ''}</h3>
          <p>${item.medium || ''}</p>
        </figcaption>
      </figure>`;
  }).join('');

  grid.querySelectorAll('img[data-full]').forEach(img => {
    img.addEventListener('click', () => openLightbox(img.dataset.full, img.alt));
  });
}

function renderLinkedGrid(items, sectionId, gridId, ctaLabel) {
  const section = document.getElementById(sectionId);
  const grid = document.getElementById(gridId);
  if (!items || !items.length) {
    section.style.display = 'none';
    return;
  }
  section.style.display = '';
  grid.innerHTML = items.map(item => {
    const media = item.image
      ? `<img src="${item.image}" alt="${item.title || ''}" loading="lazy">`
      : `<div class="placeholder"><span>&#10003;</span></div>`;
    return `
      <a class="product-card" href="${item.link || '#'}" target="_blank" rel="noopener">
        ${media}
        <div class="product-info">
          <h3>${item.title || ''}</h3>
          ${item.price ? `<p>${item.price}</p>` : ''}
          <span class="product-cta">${ctaLabel} &rarr;</span>
        </div>
      </a>`;
  }).join('');
}

function toProfileUrl(value, base) {
  const v = value.trim().replace(/^@/, '');
  return /^https?:\/\//i.test(v) ? v : base + v;
}

function renderSettings(s) {
  if (s.heroTitle) document.getElementById('hero-title').textContent = s.heroTitle;
  if (s.heroSub) document.getElementById('hero-sub').textContent = s.heroSub;
  if (s.aboutText) document.getElementById('about-text').textContent = s.aboutText;
  if (s.contactEmail) {
    const el = document.getElementById('contact-email');
    el.textContent = s.contactEmail;
    el.href = `mailto:${s.contactEmail}`;
  }
  const socials = document.getElementById('contact-socials');
  const links = [];
  if (s.instagramUrl) links.push(`<a href="${toProfileUrl(s.instagramUrl, 'https://www.instagram.com/')}" target="_blank" rel="noopener">Instagram</a>`);
  if (s.behanceUrl) links.push(`<a href="${toProfileUrl(s.behanceUrl, 'https://www.behance.net/')}" target="_blank" rel="noopener">Behance</a>`);
  if (links.length) socials.innerHTML = links.join('');
}

function openLightbox(src, alt) {
  const lightbox = document.getElementById('lightbox');
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-img').alt = alt || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('open');
  document.getElementById('lightbox-img').src = '';
  document.body.style.overflow = '';
}

document.getElementById('lightbox').addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

function setTheme(theme) {
  if (theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  } else {
    delete document.documentElement.dataset.theme;
    localStorage.removeItem('theme');
  }
  document.querySelectorAll('.theme-swatch').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
}

document.querySelectorAll('.theme-swatch').forEach(btn => {
  btn.addEventListener('click', () => setTheme(btn.dataset.theme));
});
setTheme(document.documentElement.dataset.theme || '');

Promise.all([
  loadJSON('content/works.json'),
  loadJSON('content/stickers.json'),
  loadJSON('content/products.json'),
  loadJSON('content/settings.json'),
]).then(([works, stickers, products, settings]) => {
  renderGallery((works && works.items) || []);
  renderLinkedGrid((stickers && stickers.items) || [], 'stickers', 'stickers-grid', '前往貼圖商店');
  renderGallery((products && products.items) || [], 'products-grid', 'products');
  renderSettings(settings || {});
});

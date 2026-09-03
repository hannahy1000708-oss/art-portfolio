async function loadJSON(path) {
  const res = await fetch(path, { cache: 'no-store' });
  return res.json();
}

function renderGallery(items) {
  const grid = document.getElementById('gallery-grid');
  grid.innerHTML = items.map((item, i) => {
    const num = String(i + 1).padStart(2, '0');
    const media = item.image
      ? `<img src="${item.image}" alt="${item.title}" loading="lazy">`
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
  if (s.instagramUrl) links.push(`<a href="${s.instagramUrl}" target="_blank" rel="noopener">Instagram</a>`);
  if (s.behanceUrl) links.push(`<a href="${s.behanceUrl}" target="_blank" rel="noopener">Behance</a>`);
  if (links.length) socials.innerHTML = links.join('');
}

Promise.all([
  loadJSON('content/works.json'),
  loadJSON('content/settings.json'),
]).then(([works, settings]) => {
  renderGallery(works.items || []);
  renderSettings(settings || {});
});

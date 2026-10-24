const sheetTabs = [...document.querySelectorAll('.vb-sheet-tabs [role="tab"]')];
const sheetImages = {
  summary: ['00-summary', '00 Summary'],
  market: ['01-market', '01 Market'],
  fees: ['02-fee-schedule', '02 Fee Schedule'],
  strategy: ['03-strategy', '03 Strategy'],
  operations: ['04-operations', '04 Operations'],
  pl: ['05-pl', '05 P&L'],
  cash: ['06-cash-flow', '06 Cash Flow'],
  scenarios: ['08-scenarios', '08 Scenarios'],
  checks: ['09-checks', '09 Checks'],
};

for (const tab of sheetTabs) {
  const [file, label] = sheetImages[tab.dataset.sheet];
  const panel = document.getElementById(tab.getAttribute('aria-controls'));
  const figure = document.createElement('figure');
  figure.className = 'vb-sheet-image';
  const link = document.createElement('a');
  link.href = `./assets/sheet-${file}.webp?v=2`;
  link.target = '_blank';
  link.rel = 'noopener';
  link.setAttribute('aria-label', `Open full-size image of ${label} worksheet`);
  const image = document.createElement('img');
  image.src = link.href;
  image.alt = `Actual ${label} worksheet exported from the supplied Excel financial model`;
  image.loading = tab.dataset.sheet === 'summary' ? 'eager' : 'lazy';
  link.append(image);
  const caption = document.createElement('figcaption');
  caption.textContent = `${label} · select the image to view at full size`;
  figure.append(link, caption);
  panel.querySelector('h3').nextElementSibling.insertAdjacentElement('afterend', figure);
  panel.classList.add('vb-image-ready');
}

function showSheet(tab, moveFocus = false) {
  for (const item of sheetTabs) {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  }
  if (moveFocus) tab.focus();
}

for (const [index, tab] of sheetTabs.entries()) {
  tab.addEventListener('click', () => showSheet(tab));
  tab.addEventListener('keydown', (event) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % sheetTabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + sheetTabs.length) % sheetTabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = sheetTabs.length - 1;
    else return;
    event.preventDefault();
    showSheet(sheetTabs[next], true);
  });
}

const slideImage = document.getElementById('vb-slide-image');
const slideRange = document.getElementById('vb-slide-range');
const slideCurrent = document.getElementById('vb-slide-current');
const slidePrevious = document.getElementById('vb-slide-prev');
const slideNext = document.getElementById('vb-slide-next');

function showSlide(number) {
  const page = Math.max(1, Math.min(25, number));
  slideImage.src = `./assets/slide-${String(page).padStart(2, '0')}.jpg`;
  slideImage.alt = `ValueBridge presentation, slide ${page} of 25`;
  slideRange.value = String(page);
  slideCurrent.value = String(page).padStart(2, '0');
  slidePrevious.disabled = page === 1;
  slideNext.disabled = page === 25;
}

slidePrevious.addEventListener('click', () => showSlide(Number(slideRange.value) - 1));
slideNext.addEventListener('click', () => showSlide(Number(slideRange.value) + 1));
slideRange.addEventListener('input', () => showSlide(Number(slideRange.value)));

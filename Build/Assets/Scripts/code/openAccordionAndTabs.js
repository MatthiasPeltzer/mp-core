const SELECTORS = {
  accordion: (id) => `[data-bs-target="#accordion-${id}"]`,
  tabs: (id) => `[data-bs-target="#tab-content-${id}"]`,
  scrollList: '.list-scroll',
  scrollLink: 'li a'
};

/**
 * @param {string} hash
 * @param {string} type - 'accordion' or 'tabs'
 */
function openElement(hash, type) {
  if (!hash) return;

  const idParts = hash.split('#c');
  if (idParts.length < 2) return;

  const id = idParts[1];
  const selector = type === 'accordion' 
    ? SELECTORS.accordion(id) 
    : SELECTORS.tabs(id);

  const trigger = document.querySelector(selector);
  if (trigger) {
    trigger.click();
    trigger.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    trigger.focus();
  }
}

function initOnLoad(type) {
  if (window.location.hash) {
    openElement(window.location.hash, type);
  }
}

function initOnClick(type) {
  const container = document.querySelector(SELECTORS.scrollList);
  if (!container) return;

  container.addEventListener('click', (event) => {
    const link = event.target.closest(SELECTORS.scrollLink);
    if (link) {
      event.preventDefault();
      openElement(link.hash, type);
    }
  });
}

function init() {
  if (document.querySelector('.accordion')) {
    initOnLoad('accordion');
    initOnClick('accordion');
  }

  if (document.querySelector('.nav-tabs')) {
    initOnLoad('tabs');
    initOnClick('tabs');
  }
}

window.addEventListener('load', init);

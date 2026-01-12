/**
 * Accordion & Tabs URL Hash Handler
 * Opens accordion/tab items based on URL hash and handles scroll-to links
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

const SELECTORS = {
  accordion: (id) => `[data-bs-target="#accordion-${id}"]`,
  tabs: (id) => `[data-bs-target="#tab-content-${id}"]`,
  scrollList: '.list-scroll',
  scrollLink: 'li a'
};

// =============================================================================
// CORE FUNCTIONS
// =============================================================================

/**
 * Opens an accordion or tab element by hash
 * @param {string} hash - URL hash (e.g., '#c123')
 * @param {string} type - Element type ('accordion' or 'tabs')
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

/**
 * Initializes hash handling on page load
 * @param {string} type - Element type ('accordion' or 'tabs')
 */
function initOnLoad(type) {
  if (window.location.hash) {
    openElement(window.location.hash, type);
  }
}

/**
 * Initializes click handling for scroll-to links
 * @param {string} type - Element type ('accordion' or 'tabs')
 */
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

// =============================================================================
// INITIALIZATION
// =============================================================================

function init() {
  // Initialize accordion handling if accordions exist
  if (document.querySelector('.accordion')) {
    initOnLoad('accordion');
    initOnClick('accordion');
  }

  // Initialize tab handling if tabs exist
  if (document.querySelector('.nav-tabs')) {
    initOnLoad('tabs');
    initOnClick('tabs');
  }
}

window.addEventListener('load', init);

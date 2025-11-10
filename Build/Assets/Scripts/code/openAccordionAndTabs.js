function handleElement(hash, type) {
  if (!hash) return;

  const idArr = hash.split('#c');
  const selector = type === 'accordion'
    ? `[data-bs-target="#accordion-${idArr[1]}"]`
    : `[data-bs-target="#tab-content-${idArr[1]}"]`;

  const anchorLink = document.querySelector(selector);
  if (anchorLink) {
    anchorLink.click();
    anchorLink.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});
    anchorLink.focus();
  }
}

function initOnLoad(type) {
  if (window.location.hash) {
    handleElement(window.location.hash, type);
  }
}

function initOnClick(type, containerSelector, linkSelector) {
  const container = document.querySelector(containerSelector);
  if (container) {
    container.addEventListener('click', (event) => {
      const target = event.target.closest(linkSelector);
      if (target) {
        event.preventDefault();
        handleElement(target.hash, type);
      }
    });
  }
}

function initAccordionAndTabs() {
  if (document.querySelector('.accordion')) {
    initOnLoad('accordion');
    initOnClick('accordion', '.list-scroll', 'li a');
  }

  if (document.querySelector('.nav-tabs')) {
    initOnLoad('tabs');
    initOnClick('tabs', '.list-scroll', 'li a');
  }
}

window.addEventListener('load', initAccordionAndTabs);

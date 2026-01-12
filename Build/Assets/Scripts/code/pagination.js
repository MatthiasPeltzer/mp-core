/**
 * Pagination Module
 * Client-side pagination for list elements
 * Creates paginated views with Previous/Next controls
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

const CONFIG = {
  itemsPerPage: 10,
  containerSelector: '.paginated-list',
  listSelector: 'ul',
  controlsSelector: '.pagination-controls'
};

// =============================================================================
// PAGINATION LOGIC
// =============================================================================

/**
 * Creates and manages pagination for a list container
 * @param {HTMLElement} listContainer - Container element with list and controls
 */
function createPagination(listContainer) {
  const itemList = listContainer.querySelector(CONFIG.listSelector);
  const paginationControls = listContainer.querySelector(CONFIG.controlsSelector);
  
  if (!itemList || !paginationControls) return;

  const items = Array.from(itemList.children);
  const totalPages = Math.ceil(items.length / CONFIG.itemsPerPage);
  let currentPage = 1;

  /**
   * Renders items for the specified page
   * @param {number} page - Page number to render
   * @param {boolean} focusFirstItem - Whether to focus first item after render
   */
  function renderPage(page, focusFirstItem = false) {
    const start = (page - 1) * CONFIG.itemsPerPage;
    const end = start + CONFIG.itemsPerPage;

    // Show only items for current page
    items.forEach((item, index) => {
      item.style.display = (index >= start && index < end) ? 'block' : 'none';
    });

    // Focus first visible link if requested
    if (focusFirstItem && items[start]) {
      const link = items[start].querySelector('a');
      link?.focus();
    }

    renderControls(page);
  }

  /**
   * Creates a pagination button
   * @param {string} text - Button text
   * @param {boolean} disabled - Whether button is disabled
   * @param {Function} onClick - Click handler
   * @returns {HTMLElement} List item with button
   */
  function createButton(text, disabled, onClick) {
    const listItem = document.createElement('li');
    listItem.className = 'page-item';
    if (disabled) listItem.classList.add('disabled');

    const button = document.createElement('button');
    button.className = 'page-link';
    button.textContent = text;
    button.disabled = disabled;
    button.addEventListener('click', onClick);

    listItem.appendChild(button);
    return listItem;
  }

  /**
   * Renders pagination controls
   * @param {number} page - Current page number
   */
  function renderControls(page) {
    paginationControls.innerHTML = '';

    if (totalPages <= 1) return;

    const paginationList = document.createElement('ul');
    paginationList.className = 'pagination';

    // Previous button
    paginationList.appendChild(
      createButton('Previous', page === 1, () => {
        if (page > 1) {
          currentPage--;
          renderPage(currentPage, true);
        }
      })
    );

    // Page number buttons
    for (let i = 1; i <= totalPages; i++) {
      const isCurrentPage = i === page;
      const pageItem = createButton(String(i), isCurrentPage, () => {
        currentPage = i;
        renderPage(currentPage, true);
      });

      if (isCurrentPage) {
        pageItem.classList.add('active');
        pageItem.setAttribute('aria-current', 'page');
      }

      paginationList.appendChild(pageItem);
    }

    // Next button
    paginationList.appendChild(
      createButton('Next', page === totalPages, () => {
        if (page < totalPages) {
          currentPage++;
          renderPage(currentPage, true);
        }
      })
    );

    paginationControls.appendChild(paginationList);
  }

  // Initialize first page
  renderPage(currentPage, false);
}

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll(CONFIG.containerSelector).forEach(createPagination);
});

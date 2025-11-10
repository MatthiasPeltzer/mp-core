export function debounce(func, wait = 100) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export function toggleNavState(isShow, body, headerWrapper, navbarToggler, navbarTogglerText, openTitle, closeTitle, openNav, closeNav) {
  body.classList.toggle('active-nav-body', isShow);
  headerWrapper.classList.toggle('active-nav', isShow);
  if (navbarToggler) {
    navbarToggler.setAttribute('title', isShow ? closeTitle : openTitle);
  }
  if (navbarTogglerText) {
    navbarTogglerText.textContent = isShow ? closeNav : openNav;
  }
}

export function handleDropdownVisibility(element, showCallback, hideCallback) {
  element.addEventListener('show.bs.dropdown', showCallback);
  element.addEventListener('hide.bs.dropdown', hideCallback);
}

export function toggleAriaLabelAndTitle(element, openLabel, closeLabel) {
  if (!element) return;
  const currentLabel = element.getAttribute('aria-label') || element.getAttribute('title');
  const newLabel = currentLabel === openLabel ? closeLabel : openLabel;
  element.setAttribute('aria-label', newLabel);
  element.setAttribute('title', newLabel);
}

/**
 * Opens parent submenus for menu items with aria-current="page"
 * This provides better navigation context by showing the current page's location
 * @param {string} menuSelector - CSS selector for menu containers (default: '.collapse')
 * @param {string} openText - Text to display when submenu is open (default: 'Close Submenu')
 */
export function openCurrentPageParents(menuSelector = '.collapse', openText = 'Close Submenu') {
  // Find all elements with aria-current="page"
  const currentPageElements = document.querySelectorAll('[aria-current="page"]');
  
  currentPageElements.forEach(currentElement => {
    // Find all parent submenus that need to be opened
    let parent = currentElement.parentElement;
    const parentsToOpen = [];
    
    // Traverse up the DOM tree to find all parent submenus
    while (parent) {
      // Check if this parent is a submenu container
      if (parent.matches(menuSelector)) {
        parentsToOpen.unshift(parent); // Add to beginning to maintain order
      }
      parent = parent.parentElement;
    }
    
    // Open all parent submenus
    parentsToOpen.forEach(menu => {
      // Add show class to open the menu
      menu.classList.add('show');
      
      // Find and update the corresponding button
      const menuId = menu.id;
      const button = document.querySelector(`[data-bs-target="#${menuId}"]`);
      if (button) {
        button.classList.remove('collapsed');
        button.setAttribute('aria-expanded', 'true');
        
        // Update button text and title
        const buttonText = button.querySelector('.visually-hidden');
        if (buttonText) {
          buttonText.textContent = openText;
        }
        button.setAttribute('title', openText);
      }
    });
  });
}

/**
 * Closes all other open submenus except the one being opened
 * Handles nested levels properly by closing all submenus at the same level or deeper
 * @param {HTMLElement} targetButton - The button that was clicked to open a submenu
 * @param {string} buttonSelector - CSS selector for submenu buttons (default: '.btn-open')
 * @param {string} menuSelector - CSS selector for submenu containers (default: '.collapse')
 */
export function closeOtherSubmenus(targetButton, buttonSelector = '.btn-open', menuSelector = '.collapse') {
  if (!targetButton) return;
  
  const targetMenuId = targetButton.getAttribute('data-bs-target');
  const targetMenu = document.querySelector(targetMenuId);
  
  if (!targetMenu) return;
  
  // Find the level of the target menu by counting its ancestors
  const getMenuLevel = (menu) => {
    let level = 0;
    let current = menu;
    while (current && current.parentElement) {
      const parentMenu = current.parentElement.closest(menuSelector);
      if (parentMenu) {
        level++;
        current = parentMenu;
      } else {
        break;
      }
    }
    return level;
  };
  
  const targetLevel = getMenuLevel(targetMenu);
  
  // Close all open menus at the same level or deeper
  const allOpenMenus = document.querySelectorAll(`${menuSelector}.show`);
  allOpenMenus.forEach(menu => {
    const menuLevel = getMenuLevel(menu);
    const menuId = `#${menu.id}`;
    
    // Close if it's at the same level or deeper, but not the target menu
    if (menuLevel >= targetLevel && menuId !== targetMenuId) {
      menu.classList.remove('show');
      
      // Also close any child menus of this menu
      const childMenus = menu.querySelectorAll(`${menuSelector}.show`);
      childMenus.forEach(childMenu => {
        childMenu.classList.remove('show');
      });
    }
  });
  
  // Update button states for all affected buttons
  const allButtons = document.querySelectorAll(`${buttonSelector}`);
  allButtons.forEach(button => {
    const buttonMenuId = button.getAttribute('data-bs-target');
    const buttonMenu = document.querySelector(buttonMenuId);
    
    if (buttonMenu) {
      const isOpen = buttonMenu.classList.contains('show');
      
      // Update button state based on menu state
      button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (isOpen) {
        button.classList.remove('collapsed');
      } else {
        button.classList.add('collapsed');
      }
    }
  });
}

// Assets/Scripts/code/Utils/domUtils.ts
function debounce(func, wait = 100) {
	let timeout;
	return function(...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	};
}
function toggleNavState(isShow, body, headerWrapper, navbarToggler, navbarTogglerText, openTitle, closeTitle, openNav, closeNav) {
	body.classList.toggle("active-nav-body", isShow);
	headerWrapper?.classList.toggle("active-nav", isShow);
	if (navbarToggler) navbarToggler.setAttribute("title", isShow ? closeTitle : openTitle);
	if (navbarTogglerText) navbarTogglerText.textContent = isShow ? closeNav : openNav;
}
var navOverlaySyncFrame = 0;
function hasOpenDesktopOrMobileNav(desktopSelector = ".mainnav-desktop") {
	return !!document.querySelector(`${desktopSelector} .menu.show, #nav-desktop .menu.show, #main-menu.show`);
}
function isMenuNavLinkClick(clickEvent) {
	if (!clickEvent) return false;
	const target = clickEvent.target;
	if (!(target instanceof Element)) return false;
	const link = target.closest("a[href]");
	if (!(link instanceof HTMLAnchorElement)) return false;
	const href = link.getAttribute("href");
	if (!href || href.startsWith("#") || href.startsWith("javascript:")) return false;
	if (link.target === "_blank") return false;
	return true;
}
function scheduleNavOverlaySync(body, headerWrapper, hasOpenNav) {
	cancelAnimationFrame(navOverlaySyncFrame);
	navOverlaySyncFrame = requestAnimationFrame(() => {
		navOverlaySyncFrame = requestAnimationFrame(() => {
			const isOpen = hasOpenNav();
			body.classList.toggle("active-nav-body", isOpen);
			headerWrapper?.classList.toggle("active-nav", isOpen);
		});
	});
}
function handleMenuVisibility(element, showCallback, hideCallback) {
	if (!element) return;
	element.addEventListener("show.bs.menu", showCallback);
	element.addEventListener("hide.bs.menu", hideCallback);
}
function openCurrentPageParents(menuSelector = ".collapse", openText = "Close Submenu") {
	document.querySelectorAll("[aria-current=\"page\"], .current").forEach((currentElement) => {
		const parentsToOpen = [];
		let parent = currentElement.parentElement;
		while (parent) {
			if (parent.matches(menuSelector)) parentsToOpen.unshift(parent);
			parent = parent.parentElement;
		}
		parentsToOpen.forEach((menu) => {
			menu.classList.add("show");
			const button = document.querySelector(`[data-bs-target="#${menu.id}"]`);
			if (button instanceof HTMLElement) {
				button.classList.remove("collapsed");
				button.setAttribute("aria-expanded", "true");
				button.setAttribute("aria-label", openText);
				button.setAttribute("title", openText);
				const svgTitle = button.querySelector("svg title");
				if (svgTitle) svgTitle.textContent = openText;
				const buttonText = button.querySelector(".visually-hidden");
				if (buttonText) buttonText.textContent = openText;
			}
		});
	});
}
function scrollToCurrentElement(containerSelector, options = {}) {
	const { behavior = "smooth", block = "center" } = options;
	const container = document.querySelector(containerSelector);
	if (!container) return;
	const currentElement = container.querySelector("[aria-current=\"page\"]") || container.querySelector(".current");
	if (!(currentElement instanceof HTMLElement)) return;
	if (!currentElement.hasAttribute("tabindex") && !currentElement.matches("a, button, input, select, textarea")) currentElement.setAttribute("tabindex", "-1");
	currentElement.focus({ preventScroll: true });
	currentElement.scrollIntoView({
		behavior,
		block
	});
}
function getMenuLevel(menu, menuSelector) {
	let level = 0;
	let current = menu;
	while (current?.parentElement) {
		const parentMenu = current.parentElement.closest(menuSelector);
		if (parentMenu) {
			level++;
			current = parentMenu;
		} else break;
	}
	return level;
}
function closeOtherSubmenus(targetButton, buttonSelector = ".btn-open", menuSelector = ".collapse") {
	if (!targetButton) return;
	const targetMenuId = targetButton.getAttribute("data-bs-target");
	if (!targetMenuId) return;
	const targetMenu = document.querySelector(targetMenuId);
	if (!targetMenu) return;
	const targetLevel = getMenuLevel(targetMenu, menuSelector);
	document.querySelectorAll(`${menuSelector}.show`).forEach((menu) => {
		const menuLevel = getMenuLevel(menu, menuSelector);
		const menuId = `#${menu.id}`;
		if (menuLevel >= targetLevel && menuId !== targetMenuId) {
			menu.classList.remove("show");
			menu.querySelectorAll(`${menuSelector}.show`).forEach((childMenu) => {
				childMenu.classList.remove("show");
			});
		}
	});
	document.querySelectorAll(buttonSelector).forEach((button) => {
		if (!(button instanceof HTMLElement)) return;
		const buttonMenuId = button.getAttribute("data-bs-target");
		if (!buttonMenuId) return;
		const buttonMenu = document.querySelector(buttonMenuId);
		if (buttonMenu) {
			const isOpen = buttonMenu.classList.contains("show");
			button.setAttribute("aria-expanded", isOpen ? "true" : "false");
			button.classList.toggle("collapsed", !isOpen);
		}
	});
}
export { isMenuNavLinkClick as a, scrollToCurrentElement as c, hasOpenDesktopOrMobileNav as i, toggleNavState as l, debounce as n, openCurrentPageParents as o, handleMenuVisibility as r, scheduleNavOverlaySync as s, closeOtherSubmenus as t };

//# sourceMappingURL=domUtils-Brfr75Yf.js.map
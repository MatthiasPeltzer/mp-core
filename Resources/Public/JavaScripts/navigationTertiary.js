import { d as EventHandler, u as BaseComponent } from "./vendor-bootstrap-BzDtiPY7.js";
import { d as openTitleMessage, l as openButtonMessage, n as closeNavMessage, r as closeTitleMessage, t as closeButtonMessage, u as openNavMessage } from "./i18n-D9tefVeF.js";
import { a as isMenuNavLinkClick, c as scrollToCurrentElement, i as hasOpenDesktopOrMobileNav, l as toggleNavState, o as openCurrentPageParents, r as handleMenuVisibility, s as scheduleNavOverlaySync, t as closeOtherSubmenus } from "./domUtils-Brfr75Yf.js";
import { n as eventTargetElement, t as asHTMLElement } from "./domTypes-DZ0kIKBi.js";
// Assets/Scripts/code/Navigation/Tertiary/navigation.ts
/**
* Handles both desktop and mobile navigation interactions including:
* - Dropdown visibility
* - Collapse/expand submenus
* - Button state management (icons, aria attributes)
* - Responsive behavior
*/
var NAME = "tertiaryNavigation";
var CONFIG = {
	desktop: {
		container: ".mainnav-desktop",
		buttonSelector: ".menu-item-button",
		menuButtonSelector: ".first-nav-button",
		menuSelector: ".collapse",
		parentMenuSelector: ".subnav-children"
	},
	mobile: {
		container: "#main-menu",
		buttonSelector: ".menu-item-button",
		menuSelector: ".collapse",
		parentMenuSelector: ".collapse"
	},
	breakpoint: "(min-width: 62rem)"
};
function menuClickEvent(event) {
	return event.clickEvent;
}
function updateButtonState(button, isOpen, updateVisuallyHidden = false, toggleCollapsed = true) {
	const label = isOpen ? closeButtonMessage : openButtonMessage;
	button.setAttribute("aria-label", label);
	button.setAttribute("aria-expanded", isOpen ? "true" : "false");
	if (toggleCollapsed) button.classList.toggle("collapsed", !isOpen);
	const svgTitle = button.querySelector("svg title");
	if (svgTitle) svgTitle.textContent = label;
	if (updateVisuallyHidden) {
		const buttonText = button.querySelector(".visually-hidden");
		if (buttonText) buttonText.textContent = label;
	}
}
function syncAllButtonStates(containerSelector, buttonSelector, excludeButton = null, updateVisuallyHidden = false) {
	const selector = `${containerSelector} ${buttonSelector}`;
	document.querySelectorAll(selector).forEach((node) => {
		const button = asHTMLElement(node);
		if (!button || button === excludeButton) return;
		const targetMenuId = button.getAttribute("data-bs-target");
		if (!targetMenuId) return;
		updateButtonState(button, document.querySelector(targetMenuId)?.classList.contains("show") ?? false, updateVisuallyHidden);
	});
}
function getTriggerButton(event) {
	const target = event.target;
	if (!(target instanceof Element) || !target.id) return null;
	return asHTMLElement(document.querySelector(`[data-bs-target="#${target.id}"]`));
}
function isInContainer(event, containerSelector) {
	return Boolean(eventTargetElement(event)?.closest(containerSelector));
}
function registerCollapseHandlers(config, updateVisuallyHidden = false) {
	const { container, buttonSelector, menuSelector } = config;
	EventHandler.on(document, "show.bs.collapse", (event) => {
		if (!isInContainer(event, container)) return;
		const triggerButton = getTriggerButton(event);
		if (!triggerButton) return;
		closeOtherSubmenus(triggerButton, buttonSelector, menuSelector);
		syncAllButtonStates(container, buttonSelector, triggerButton, updateVisuallyHidden);
		updateButtonState(triggerButton, true, updateVisuallyHidden);
	});
	EventHandler.on(document, "hide.bs.collapse", (event) => {
		if (!isInContainer(event, container)) return;
		const triggerButton = getTriggerButton(event);
		if (triggerButton) updateButtonState(triggerButton, false, updateVisuallyHidden);
	});
	EventHandler.on(document, "shown.bs.collapse", (event) => {
		if (!isInContainer(event, container)) return;
		const triggerButton = getTriggerButton(event);
		if (triggerButton) updateButtonState(triggerButton, true, updateVisuallyHidden);
		syncAllButtonStates(container, buttonSelector, null, updateVisuallyHidden);
	});
	EventHandler.on(document, "hidden.bs.collapse", (event) => {
		if (!isInContainer(event, container)) return;
		const triggerButton = getTriggerButton(event);
		if (triggerButton) updateButtonState(triggerButton, false, updateVisuallyHidden);
		syncAllButtonStates(container, buttonSelector, null, updateVisuallyHidden);
	});
}
function registerClickHandler(selector, updateVisuallyHidden = false) {
	EventHandler.on(document, "click", (event) => {
		const button = asHTMLElement(eventTargetElement(event)?.closest(selector));
		if (!button) return;
		updateButtonState(button, button.classList.contains("collapsed"), updateVisuallyHidden);
	});
}
function syncDesktopNavOverlay() {
	scheduleNavOverlaySync(document.body, asHTMLElement(document.querySelector(".header-wrapper")), () => hasOpenDesktopOrMobileNav(CONFIG.desktop.container));
}
function syncDesktopDropdownButtonStates() {
	const { container, menuButtonSelector } = CONFIG.desktop;
	document.querySelectorAll(`${container} ${menuButtonSelector}`).forEach((node) => {
		const button = asHTMLElement(node);
		if (!button) return;
		updateButtonState(button, button.classList.contains("show"), false, false);
	});
}
var TertiaryNavigation = class extends BaseComponent {
	static NAME = NAME;
	static get Default() {
		return {};
	}
	constructor(element, config) {
		super(element, config);
		if (document.querySelector(CONFIG.desktop.container)) this._initDesktopNavigation();
		if (document.getElementById("main-menu")) this._initMobileNavigation();
		this._initResponsiveBehavior();
	}
	_initDesktopNavigation() {
		const desktopRoot = CONFIG.desktop.container;
		EventHandler.on(document, "show.bs.menu", (event) => {
			if (!isInContainer(event, desktopRoot)) return;
			syncDesktopNavOverlay();
		});
		EventHandler.on(document, "shown.bs.menu", (event) => {
			if (!isInContainer(event, desktopRoot)) return;
			scrollToCurrentElement(CONFIG.desktop.container);
			syncDesktopNavOverlay();
			syncDesktopDropdownButtonStates();
		});
		EventHandler.on(document, "hide.bs.menu", (event) => {
			if (!isInContainer(event, desktopRoot)) return;
			if (isMenuNavLinkClick(menuClickEvent(event))) return;
			syncDesktopNavOverlay();
		});
		EventHandler.on(document, "hidden.bs.menu", (event) => {
			if (!isInContainer(event, desktopRoot)) return;
			if (isMenuNavLinkClick(menuClickEvent(event))) return;
			syncDesktopNavOverlay();
			syncDesktopDropdownButtonStates();
		});
		registerClickHandler(`${CONFIG.desktop.container} ${CONFIG.desktop.buttonSelector}`);
		registerCollapseHandlers(CONFIG.desktop, false);
		setTimeout(() => {
			openCurrentPageParents(CONFIG.desktop.parentMenuSelector, closeButtonMessage);
			syncAllButtonStates(CONFIG.desktop.container, CONFIG.desktop.buttonSelector, null, false);
			syncDesktopDropdownButtonStates();
		}, 100);
	}
	_initMobileNavigation() {
		const body = document.body;
		const headerWrapper = asHTMLElement(document.querySelector(".header-wrapper"));
		const navbarToggler = asHTMLElement(document.querySelector(".navbar-toggler"));
		const navbarTogglerText = asHTMLElement(document.querySelector(".navbar-toggler span.txt > .visually-hidden"));
		const mainMenu = document.getElementById("main-menu");
		if (!mainMenu) return;
		handleMenuVisibility(mainMenu, () => {
			toggleNavState(true, body, headerWrapper, navbarToggler, navbarTogglerText, openTitleMessage, closeTitleMessage, openNavMessage, closeNavMessage);
			scrollToCurrentElement(CONFIG.mobile.container);
		}, (event) => {
			if (isMenuNavLinkClick(menuClickEvent(event))) return;
			toggleNavState(false, body, headerWrapper, navbarToggler, navbarTogglerText, openTitleMessage, closeTitleMessage, openNavMessage, closeNavMessage);
		});
		document.querySelectorAll(".main-menu-desktop .btn-close").forEach((node) => {
			const button = asHTMLElement(node);
			if (!button) return;
			button.addEventListener("click", () => {
				asHTMLElement(document.querySelector(".first-nav-button.show"))?.click();
			});
		});
		document.querySelectorAll(".subnav-children .hassub").forEach((node) => {
			const subButton = asHTMLElement(node);
			if (!subButton) return;
			subButton.addEventListener("click", () => {
				closeOtherSubmenus(subButton, ".subnav-children .hassub", ".subnav-children");
			});
		});
		registerClickHandler(`${CONFIG.mobile.container} ${CONFIG.mobile.buttonSelector}`, true);
		registerCollapseHandlers(CONFIG.mobile, true);
		setTimeout(() => {
			openCurrentPageParents(CONFIG.mobile.parentMenuSelector, closeButtonMessage);
			syncAllButtonStates(CONFIG.mobile.container, CONFIG.mobile.buttonSelector, null, true);
		}, 100);
	}
	_initResponsiveBehavior() {
		const mediaQuery = window.matchMedia(CONFIG.breakpoint);
		const body = document.body;
		const headerWrapper = asHTMLElement(document.querySelector(".header-wrapper"));
		const closeMobileMenus = () => {
			const mainMenu = document.getElementById("main-menu");
			const navbarToggler = asHTMLElement(document.querySelector(".navbar-toggler"));
			if (mainMenu?.classList.contains("show") && navbarToggler) navbarToggler.click();
			document.querySelectorAll(`${CONFIG.mobile.container} .collapse.show`).forEach((menu) => {
				if (!(menu instanceof Element)) return;
				const button = asHTMLElement(document.querySelector(`[data-bs-target="#${menu.id}"]`));
				if (button && !button.classList.contains("collapsed")) button.click();
			});
		};
		const closeDesktopMenus = () => {
			document.querySelectorAll(".first-nav-button.show, .mainnav-desktop [data-bs-toggle=\"menu\"].show").forEach((node) => {
				asHTMLElement(node)?.click();
			});
			document.querySelectorAll(`${CONFIG.desktop.container} .collapse.show`).forEach((menu) => {
				if (!(menu instanceof Element)) return;
				const button = asHTMLElement(document.querySelector(`[data-bs-target="#${menu.id}"]`));
				if (button && !button.classList.contains("collapsed")) button.click();
			});
		};
		const handleBreakpointChange = (event) => {
			if (!event) return;
			if (event.matches) closeMobileMenus();
			else closeDesktopMenus();
			body.classList.remove("active-nav-body");
			headerWrapper?.classList.remove("active-nav");
		};
		mediaQuery.addEventListener("change", handleBreakpointChange);
	}
};
function initTertiaryNavigation() {
	const root = asHTMLElement(document.querySelector(CONFIG.desktop.container)) ?? document.getElementById("main-menu") ?? document.body;
	TertiaryNavigation.getOrCreateInstance(root);
}
initTertiaryNavigation();

//# sourceMappingURL=navigationTertiary.js.map
import { d as EventHandler, u as BaseComponent } from "./vendor-bootstrap-BzDtiPY7.js";
import { d as openTitleMessage, l as openButtonMessage, n as closeNavMessage, r as closeTitleMessage, t as closeButtonMessage, u as openNavMessage } from "./i18n-D9tefVeF.js";
import { c as scrollToCurrentElement, l as toggleNavState, o as openCurrentPageParents, t as closeOtherSubmenus } from "./domUtils-Brfr75Yf.js";
import { n as eventTargetElement, t as asHTMLElement } from "./domTypes-DZ0kIKBi.js";
// Assets/Scripts/code/Navigation/Primary/navigation.ts
var NAME = "primaryNavigation";
var CONFIG = {
	container: "#main-menu",
	buttonSelector: ".btn-open",
	menuSelector: ".collapse"
};
function updateButtonState(button, isOpen) {
	const buttonText = button.querySelector(".visually-hidden");
	if (buttonText) buttonText.textContent = isOpen ? closeButtonMessage : openButtonMessage;
	button.setAttribute("title", isOpen ? closeButtonMessage : openButtonMessage);
	button.setAttribute("aria-expanded", isOpen ? "true" : "false");
	button.classList.toggle("collapsed", !isOpen);
}
function getTriggerButton(event) {
	const target = event.target;
	if (!(target instanceof Element) || !target.id) return null;
	return asHTMLElement(document.querySelector(`[data-bs-target="#${target.id}"]`));
}
function isInPrimaryContainer(event) {
	const target = eventTargetElement(event);
	return Boolean(target?.closest(CONFIG.container));
}
var PrimaryNavigation = class extends BaseComponent {
	static NAME = NAME;
	static get Default() {
		return {};
	}
	constructor(element, config) {
		super(element, config);
		this._bind();
	}
	_bind() {
		const mainMenu = this._element;
		const body = document.body;
		const headerWrapper = asHTMLElement(document.querySelector(".header-wrapper"));
		const navbarToggler = asHTMLElement(document.querySelector(".navbar-toggler"));
		const navbarTogglerText = asHTMLElement(document.querySelector(".navbar-toggler span.txt > .visually-hidden"));
		const syncAllButtonStates = () => {
			document.querySelectorAll(`${CONFIG.container} ${CONFIG.buttonSelector}`).forEach((node) => {
				const button = asHTMLElement(node);
				if (!button) return;
				const targetMenuId = button.getAttribute("data-bs-target");
				if (!targetMenuId) return;
				updateButtonState(button, document.querySelector(targetMenuId)?.classList.contains("show") ?? false);
			});
		};
		EventHandler.on(mainMenu, "show.bs.menu", () => {
			toggleNavState(true, body, headerWrapper, navbarToggler, navbarTogglerText, openTitleMessage, closeTitleMessage, openNavMessage, closeNavMessage);
		});
		EventHandler.on(mainMenu, "shown.bs.menu", () => {
			scrollToCurrentElement(CONFIG.container);
		});
		EventHandler.on(mainMenu, "hide.bs.menu", () => {
			toggleNavState(false, body, headerWrapper, navbarToggler, navbarTogglerText, openTitleMessage, closeTitleMessage, openNavMessage, closeNavMessage);
		});
		const onCollapseLifecycle = (event, isOpen) => {
			if (!isInPrimaryContainer(event)) return;
			const triggerButton = getTriggerButton(event);
			if (!triggerButton) return;
			if (isOpen) closeOtherSubmenus(triggerButton, CONFIG.buttonSelector, CONFIG.menuSelector);
			updateButtonState(triggerButton, isOpen);
		};
		EventHandler.on(document, "show.bs.collapse", (event) => {
			onCollapseLifecycle(event, true);
		});
		EventHandler.on(document, "hide.bs.collapse", (event) => {
			onCollapseLifecycle(event, false);
		});
		EventHandler.on(document, "shown.bs.collapse", (event) => {
			onCollapseLifecycle(event, true);
		});
		EventHandler.on(document, "hidden.bs.collapse", (event) => {
			onCollapseLifecycle(event, false);
		});
		setTimeout(() => {
			openCurrentPageParents(CONFIG.menuSelector, closeButtonMessage);
			syncAllButtonStates();
		}, 100);
	}
};
var mainMenu = document.getElementById("main-menu");
if (mainMenu) PrimaryNavigation.getOrCreateInstance(mainMenu);

//# sourceMappingURL=navigationPrimary.js.map
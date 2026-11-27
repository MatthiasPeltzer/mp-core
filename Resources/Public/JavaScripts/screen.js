import { n as eventTargetElement, t as asHTMLElement } from "./domTypes-DZ0kIKBi.js";
import { a as Combobox, c as Carousel, d as EventHandler, i as Datepicker, u as BaseComponent } from "./vendor-bootstrap-BzDtiPY7.js";
import { n as debounce$1 } from "./domUtils-Brfr75Yf.js";
import { n as notifyDynamicContentReady, r as pausePlayersInside } from "./vidply-dynamic-content-V9hx8L_p.js";
import { t as __vitePreload } from "./preload-helper-CALLvQDj.js";
import { a as i18n } from "./i18n-D9tefVeF.js";
// Assets/Scripts/code/nav-toggle.ts
/**
* Keeps mobile and desktop navigation landmarks in the DOM but marks the
* inactive variant inert for assistive technology (replaces DOM detachment).
*/
function initNavToggle() {
	if (!document.getElementById("main-menu-list")) return;
	const mqLg = window.matchMedia("(min-width: 62rem)");
	const mobileNav = document.getElementById("main-menu");
	const desktopNav = asHTMLElement(document.querySelector("nav.mainnav-desktop"));
	function setNavInactiveState(element, inactive) {
		if (!element) return;
		if (inactive) {
			element.setAttribute("inert", "");
			element.setAttribute("aria-hidden", "true");
		} else {
			element.removeAttribute("inert");
			element.removeAttribute("aria-hidden");
		}
	}
	function handleBreakpoint(event) {
		const isDesktop = event.matches;
		setNavInactiveState(mobileNav, isDesktop);
		setNavInactiveState(desktopNav, !isDesktop);
	}
	window.addEventListener("load", () => {
		handleBreakpoint(mqLg);
	});
	mqLg.addEventListener("change", handleBreakpoint);
}
initNavToggle();
// Assets/Scripts/code/moveMeta.ts
/**
* Moves meta navigation and theme switch between desktop and mobile containers.
*
* - < lg (< 62rem):      content lives in .meta-mobile
* - >= lg (min-width: 62rem): content lives in .meta-desktop
*
* Uses DOM manipulation (no cloning) to preserve event listeners.
*/
function initMoveMeta() {
	const mqLg = window.matchMedia("(min-width: 62rem)");
	function moveAllChildren(fromEl, toEl) {
		while (fromEl.firstChild) toEl.appendChild(fromEl.firstChild);
	}
	function syncPair(desktopEl, mobileEl, toDesktop) {
		if (toDesktop) {
			if (desktopEl.childNodes.length === 0 && mobileEl.childNodes.length > 0) moveAllChildren(mobileEl, desktopEl);
		} else if (mobileEl.childNodes.length === 0 && desktopEl.childNodes.length > 0) moveAllChildren(desktopEl, mobileEl);
	}
	function handleBreakpoint(e) {
		const toDesktop = e.matches;
		const desktops = [...document.querySelectorAll(".meta-desktop")].filter((el) => el instanceof HTMLElement);
		const mobiles = [...document.querySelectorAll(".meta-mobile")].filter((el) => el instanceof HTMLElement);
		if (!desktops.length || !mobiles.length) return;
		if (desktops.length === mobiles.length) {
			desktops.forEach((desktopEl, idx) => {
				syncPair(desktopEl, mobiles[idx], toDesktop);
			});
			return;
		}
		if (desktops.length === 1) {
			const desktopEl = desktops[0];
			syncPair(desktopEl, mobiles.find((m) => m.childNodes.length > 0) ?? mobiles[0], toDesktop);
		}
	}
	function init() {
		handleBreakpoint(mqLg);
		mqLg.addEventListener("change", handleBreakpoint);
	}
	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
	else init();
}
initMoveMeta();
// Assets/Scripts/code/moveHeaderDate.ts
var dateWrapper = document.querySelector(".date-wrapper");
var headerContent = document.getElementById("headerMain");
if (dateWrapper && headerContent) headerContent.insertAdjacentElement("afterend", dateWrapper);
// Assets/Scripts/code/sticky.ts
var NAME$4 = "stickyHeader";
var Default$3 = { breakpoint: "(min-width: 62rem)" };
var StickyHeader = class extends BaseComponent {
	static NAME = NAME$4;
	static get Default() {
		return Default$3;
	}
	_headerHeight = 0;
	_toplogoHeight = 0;
	_ticking = false;
	constructor(element, config) {
		super(element, config);
		this._body = document.body;
		this._toplogo = element.querySelector(".toplogo-container");
		this._headerHeight = element.offsetHeight;
		this._toplogoHeight = this._toplogo?.offsetHeight ?? 0;
		window.addEventListener("scroll", () => this._onScroll(), { passive: true });
		requestAnimationFrame(() => {
			this._measureToplogo();
			this._handleScroll();
		});
		this._initResponsivePadding();
		if (this._toplogo) new ResizeObserver(() => this._measureToplogo()).observe(this._toplogo);
	}
	_onScroll() {
		if (this._ticking) return;
		this._ticking = true;
		requestAnimationFrame(() => {
			this._handleScroll();
			this._ticking = false;
		});
	}
	_handleScroll() {
		const scrollY = window.scrollY;
		if (this._toplogo && this._toplogoHeight > 0) {
			const offset = Math.min(scrollY, this._toplogoHeight + 17);
			this._toplogo.style.marginTop = `${-offset / 16}rem`;
		}
		const threshold = this._toplogoHeight > 0 ? this._toplogoHeight : this._headerHeight;
		this._body.classList.toggle("sticky", scrollY >= threshold);
	}
	_measureToplogo() {
		if (this._toplogo) this._toplogoHeight = this._toplogo.offsetHeight;
	}
	_updatePadding() {
		this._headerHeight = this._element.offsetHeight;
		this._body.style.paddingTop = `${this._headerHeight / 16}rem`;
		this._measureToplogo();
	}
	_initResponsivePadding() {
		const mediaQuery = window.matchMedia(this._config.breakpoint);
		const handleMediaChange = () => {
			setTimeout(() => this._updatePadding(), 50);
		};
		handleMediaChange();
		mediaQuery.addEventListener("change", handleMediaChange);
	}
};
var header = document.querySelector(".header-wrapper-bg");
if (header instanceof HTMLElement) StickyHeader.getOrCreateInstance(header);
// Assets/Scripts/code/theme.ts
var html = document.documentElement;
var mediaQueryDark = window.matchMedia("(prefers-color-scheme: dark)");
function setTheme(theme, explicit = true) {
	html.setAttribute("data-bs-theme", theme);
	if (explicit) {
		localStorage.setItem("theme", `theme-${theme}`);
		mediaQueryDark.removeEventListener("change", handleSystemPreferenceChange);
	}
	getThemeSwitches().forEach((el) => {
		el.checked = theme === "dark";
	});
}
function getThemeSwitches() {
	return [...document.querySelectorAll("#themeSwitch")].filter((el) => el instanceof HTMLInputElement);
}
function handleSystemPreferenceChange(e) {
	setTheme(("matches" in e ? e.matches : mediaQueryDark.matches) ? "dark" : "light", false);
}
var storedTheme = localStorage.getItem("theme");
if (storedTheme) setTheme(storedTheme.includes("dark") ? "dark" : "light");
else {
	mediaQueryDark.addEventListener("change", handleSystemPreferenceChange);
	handleSystemPreferenceChange(mediaQueryDark);
}
function initThemeSwitch() {
	const switches = getThemeSwitches();
	if (!switches.length) return;
	const isDark = html.getAttribute("data-bs-theme") === "dark";
	switches.forEach((switchEl) => {
		if (switchEl.dataset.themeInitialized === "1") return;
		switchEl.dataset.themeInitialized = "1";
		switchEl.checked = isDark;
		switchEl.addEventListener("change", () => {
			setTheme(switchEl.checked ? "dark" : "light");
		});
	});
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initThemeSwitch);
else initThemeSwitch();
window.mpcInitThemeSwitch = initThemeSwitch;
// Assets/Scripts/code/totop.ts
var NAME$3 = "totop";
var Default$2 = {};
var Totop = class extends BaseComponent {
	static NAME = NAME$3;
	static get Default() {
		return Default$2;
	}
	_ticking = false;
	constructor(element, config) {
		super(element, config);
		const bg = element.querySelector(".bg");
		if (!(bg instanceof HTMLElement)) return;
		this._bg = bg;
		window.addEventListener("scroll", () => this._onScroll(), { passive: true });
	}
	_onScroll() {
		if (this._ticking) return;
		this._ticking = true;
		window.requestAnimationFrame(() => {
			this._handleScroll();
			this._ticking = false;
		});
	}
	_handleScroll() {
		const maxScrollHeight = document.body.offsetHeight - window.innerHeight;
		const scrollTop = window.scrollY;
		const degrees = (maxScrollHeight > 0 ? scrollTop / maxScrollHeight : 0) * 360;
		this._bg.style.background = `#fff conic-gradient(var(--primary-base) ${degrees}deg, #fff ${degrees}deg) center center / 60px`;
		this._element.classList.toggle("on", scrollTop > 250);
	}
};
document.querySelectorAll(".totop").forEach((el) => {
	if (el instanceof HTMLElement) Totop.getOrCreateInstance(el);
});
// Assets/Scripts/code/modalGallery.ts
var NAME$2 = "modalGallery";
var Default$1 = {};
var ModalGallery = class extends BaseComponent {
	static NAME = NAME$2;
	static get Default() {
		return Default$1;
	}
	constructor(element, config) {
		super(element, config);
		this._updateImageSizes();
		EventHandler.on(window, "resize", debounce$1(() => this._updateImageSizes(), 100));
	}
	_updateImageSizes() {
		const maxHeight = window.innerHeight * .75;
		this._element.querySelectorAll(".carousel-item img, .dialog-body img").forEach((img) => {
			if (img instanceof HTMLElement) {
				img.style.maxHeight = `${maxHeight}px`;
				img.style.width = "auto";
			}
		});
	}
};
if (document.querySelector(".dialog-body")) document.querySelectorAll(".dialog-body").forEach((dialogBody) => {
	if (dialogBody instanceof HTMLElement) ModalGallery.getOrCreateInstance(dialogBody);
});
// Assets/Scripts/code/galleryDialog.ts
/**
* Gallery fullscreen dialog: slide index on open + Bootstrap data-API click targets.
* BS6 delegates data-api clicks only when the event target is the control element
* (not a child), so footer/header controls rely on pointer-events (see _modal.scss).
*/
var GALLERY_MODAL_SELECTOR = "dialog.dialog[id^=\"galleryModal-\"]";
function resolveSlideIndex(trigger) {
	const slideHost = trigger.querySelector("[data-bs-slide-to]") ?? trigger.closest("[data-count]");
	if (!slideHost) return null;
	const raw = slideHost.getAttribute("data-bs-slide-to") ?? slideHost.getAttribute("data-count");
	if (raw === null || raw === "") return null;
	const index = Number.parseInt(raw, 10);
	return Number.isNaN(index) ? null : index;
}
function updateGalleryCounter(dialog, carouselEl) {
	const counter = dialog.querySelector("[data-gallery-counter]");
	if (!counter) return;
	const items = carouselEl.querySelectorAll(".carousel-item");
	const active = carouselEl.querySelector(".carousel-item.active");
	const index = active ? Array.from(items).indexOf(active) + 1 : 1;
	const total = items.length;
	counter.textContent = `${index} ${counter.dataset.galleryLabelOf ?? "of"} ${total}`;
	counter.dataset.galleryCounter = String(index);
}
function bindGalleryDialog(dialog) {
	if (dialog.dataset.mpcGalleryDialogBound === "1") return;
	dialog.dataset.mpcGalleryDialogBound = "1";
	const carouselEl = dialog.querySelector(".carousel");
	if (!carouselEl) return;
	EventHandler.on(dialog, "shown.bs.dialog", (event) => {
		const relatedTarget = event.relatedTarget;
		if (!(relatedTarget instanceof HTMLElement)) return;
		const carousel = Carousel.getOrCreateInstance(carouselEl);
		const index = resolveSlideIndex(relatedTarget);
		if (index !== null) carousel.to(index);
		updateGalleryCounter(dialog, carouselEl);
	});
	EventHandler.on(carouselEl, "slid.bs.carousel", () => {
		updateGalleryCounter(dialog, carouselEl);
	});
}
function initGalleryDialogs() {
	document.querySelectorAll(GALLERY_MODAL_SELECTOR).forEach((dialog) => {
		if (dialog instanceof HTMLElement) bindGalleryDialog(dialog);
	});
}
if (document.querySelector(GALLERY_MODAL_SELECTOR)) initGalleryDialogs();
// Assets/Scripts/code/modalContent.ts
var NAME$1 = "modalContent";
var Default = {};
var ModalContent = class extends BaseComponent {
	static NAME = NAME$1;
	static get Default() {
		return Default;
	}
	constructor(element, config) {
		super(element, config);
		if (element.dataset.mpcModalBound === "1") return;
		element.dataset.mpcModalBound = "1";
		EventHandler.on(element, "shown.bs.dialog", () => {
			const root = element.querySelector("[data-modal-content-root]");
			notifyDynamicContentReady(root);
		});
		EventHandler.on(element, "hide.bs.dialog", () => {
			const root = element.querySelector("[data-modal-content-root]") ?? element.querySelector(".dialog-body");
			pausePlayersInside(root);
		});
	}
};
function initModalContent() {
	document.querySelectorAll(".dialog[data-bs-backdrop]").forEach((dialog) => {
		if (dialog instanceof HTMLElement) ModalContent.getOrCreateInstance(dialog);
	});
}
if (document.querySelector("[data-modal-content-root]")) initModalContent();
// Assets/Scripts/code/jarallax.ts
/**
* Lazy-loads the Jarallax vendor bundle when the page contains parallax containers.
*/
var parallaxElements = [...document.querySelectorAll(".grid-parallax")].filter((el) => el instanceof HTMLElement);
if (parallaxElements.length) __vitePreload(async () => {
	const { jarallax } = await import("./vendor-jarallax-B19HQAfe.js").then((n) => n.t);
	return { jarallax };
}, [], import.meta.url).then(({ jarallax }) => {
	jarallax(parallaxElements, {
		speed: .5,
		imgPosition: "100%"
	});
}).catch((err) => {
	console.error("[mp-core/jarallax] failed to load vendor bundle", err);
});
// Assets/Scripts/code/openAccordionAndTabs.ts
var SELECTORS = {
	accordion: (id) => `[data-bs-target="#accordion-${id}"]`,
	tabs: (id) => `[data-bs-target="#tab-content-${id}"]`,
	scrollList: ".list-scroll",
	scrollLink: "li a"
};
function openElement(hash, type) {
	if (!hash) return;
	const idParts = hash.split("#c");
	if (idParts.length < 2) return;
	const id = idParts[1];
	const selector = type === "accordion" ? SELECTORS.accordion(id) : SELECTORS.tabs(id);
	const trigger = asHTMLElement(document.querySelector(selector));
	if (trigger) {
		trigger.click();
		trigger.scrollIntoView({
			behavior: "smooth",
			block: "center",
			inline: "nearest"
		});
		trigger.focus();
	}
}
function initOnLoad(type) {
	if (window.location.hash) openElement(window.location.hash, type);
}
function initOnClick(type) {
	const container = document.querySelector(SELECTORS.scrollList);
	if (!container) return;
	container.addEventListener("click", (event) => {
		const link = eventTargetElement(event)?.closest(SELECTORS.scrollLink);
		if (!(link instanceof HTMLAnchorElement)) return;
		event.preventDefault();
		openElement(link.hash, type);
	});
}
function init$1() {
	if (document.querySelector(".accordion")) {
		initOnLoad("accordion");
		initOnClick("accordion");
	}
	if (document.querySelector(".nav-tabs")) {
		initOnLoad("tabs");
		initOnClick("tabs");
	}
}
window.addEventListener("load", init$1);
// Assets/Scripts/code/i18nLinkHelper.ts
var CLASS_TO_KEY = /* @__PURE__ */ new Map([
	["audio", "audio"],
	["chart", "chart"],
	["download", "download"],
	["email", "email"],
	["externalLink", "externalLink"],
	["externalLinkNew", "externalLinkNew"],
	["gallery", "gallery"],
	["glossary", "glossary"],
	["iconLink", "iconLink"],
	["internalLink", "internalLink"],
	["internalLinkNew", "internalLinkNew"],
	["legal", "legal"],
	["listScroll", "listScroll"],
	["phone", "phone"],
	["press", "press"],
	["public", "public"],
	["video", "video"]
]);
var ALIAS_TO_KEY = /* @__PURE__ */ new Map([
	["external-link", "externalLink"],
	["external-link-new", "externalLinkNew"],
	["internal-link", "internalLink"],
	["internal-link-new", "internalLinkNew"],
	["list-scroll", "listScroll"],
	["icon-link", "iconLink"],
	["download", "download"]
]);
function isExternal(link) {
	const href = link.getAttribute("href");
	if (!href) return false;
	try {
		return new URL(href, document.baseURI).origin !== window.location.origin;
	} catch {
		return false;
	}
}
function ensureHiddenSpan(linkElement, text) {
	const existing = linkElement.querySelector("span.visually-hidden[data-i18n-helper=\"true\"]");
	if (existing) {
		existing.textContent = text;
		return;
	}
	const span = document.createElement("span");
	span.className = "visually-hidden";
	span.setAttribute("data-i18n-helper", "true");
	span.textContent = text;
	linkElement.append(span);
}
function getMatchedKey(link) {
	for (const [className, key] of CLASS_TO_KEY) if (link.classList.contains(className) && i18n[key]) return key;
	for (const cls of link.classList) {
		const aliasKey = ALIAS_TO_KEY.get(cls);
		if (aliasKey && i18n[aliasKey]) return aliasKey;
	}
	return null;
}
function collectLinks(root) {
	const links = [];
	if (root instanceof HTMLAnchorElement) links.push(root);
	else if (root instanceof Element && root.matches("a")) {
		const anchor = root.closest("a");
		if (anchor instanceof HTMLAnchorElement) links.push(anchor);
	}
	if (root instanceof Element || root instanceof Document) root.querySelectorAll("a").forEach((anchor) => {
		if (anchor instanceof HTMLAnchorElement) links.push(anchor);
	});
	return links;
}
function enhanceLinksAccessibility(root = document) {
	collectLinks(root).forEach((link) => {
		if (link.dataset.noI18nHelper === "true") return;
		if (link.hasAttribute("aria-label") || link.hasAttribute("aria-labelledby")) return;
		const matchedKey = getMatchedKey(link);
		const isBlank = link.getAttribute("target") === "_blank";
		const external = isExternal(link);
		if (matchedKey === "internalLink" || matchedKey === "internalLinkNew") return;
		if (!matchedKey && !external) return;
		let helperText = matchedKey ? i18n[matchedKey] : null;
		if (isBlank && external) {
			if (matchedKey === "externalLinkNew") helperText = i18n.externalLinkNew;
			else helperText = `${i18n.externalLink} (${i18n.newWindow})`;
		}
		if (helperText) ensureHiddenSpan(link, helperText);
	});
}
function init() {
	enhanceLinksAccessibility();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
function startObserver() {
	if (!("MutationObserver" in window)) return;
	const handleMutations = debounce$1((mutations) => {
		mutations.forEach((mutation) => {
			mutation.addedNodes.forEach((node) => {
				if (node instanceof Element || node instanceof Document) enhanceLinksAccessibility(node);
			});
		});
	}, 100);
	new MutationObserver(handleMutations).observe(document.body, {
		childList: true,
		subtree: true
	});
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startObserver);
else startObserver();
// Assets/Scripts/code/searchAutosuggest.ts
/**
* Accessible autosuggest for the indexed_search frontend.
*
* Implements the WAI-ARIA 1.2 "Editable Combobox With List Autocomplete"
* pattern: DOM focus stays in the text input at all times, the popup is a
* `role="listbox"`, and the active option is tracked with
* `aria-activedescendant` (WCAG 2.1.1 Keyboard, 4.1.2 Name/Role/Value).
*
* Suggestions are fetched as JSON from the URL in `data-autosuggest-url`
* (served by SearchSuggestMiddleware). Word suggestions fill the field and
* submit the search; page suggestions navigate straight to the page.
*/
var NAME = "searchAutosuggest";
var MIN_CHARS = 2;
var DEBOUNCE_MS = 200;
function debounce(fn, wait) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), wait);
	};
}
function safeSameOriginHref(raw) {
	try {
		const url = new URL(raw, window.location.origin);
		return url.origin === window.location.origin ? url.href : null;
	} catch {
		return null;
	}
}
var SVG_NS = "http://www.w3.org/2000/svg";
var ICON_PATHS = {
	search: "M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0",
	page: "M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5zM4.5 5.5A.5.5 0 0 1 5 5h4a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5m0 2A.5.5 0 0 1 5 7h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5m0 2A.5.5 0 0 1 5 9h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5",
	chevron: "M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
};
function createIcon(name, extraClass) {
	const svg = document.createElementNS(SVG_NS, "svg");
	svg.setAttribute("viewBox", "0 0 16 16");
	svg.setAttribute("width", "16");
	svg.setAttribute("height", "16");
	svg.setAttribute("fill", "currentColor");
	svg.setAttribute("aria-hidden", "true");
	svg.setAttribute("focusable", "false");
	svg.classList.add("tx-indexedsearch-suggest-glyph", extraClass);
	const path = document.createElementNS(SVG_NS, "path");
	path.setAttribute("d", ICON_PATHS[name]);
	svg.append(path);
	return svg;
}
var SearchAutosuggest = class extends BaseComponent {
	static NAME = NAME;
	static get Default() {
		return {};
	}
	input;
	endpoint;
	pagesHeading;
	listbox;
	form;
	options = [];
	activeIndex = -1;
	controller = null;
	status;
	onInput;
	constructor(element, config) {
		super(element, config);
		this.input = element;
		this.endpoint = element.dataset.autosuggestUrl;
		this.pagesHeading = element.dataset.suggestHeader ?? "";
		const controlsId = element.getAttribute("aria-controls");
		this.listbox = controlsId ? document.getElementById(controlsId) : null;
		this.form = element.closest("form");
		this.onInput = debounce(() => {
			this.requestSuggestions();
		}, DEBOUNCE_MS);
		if (!this.endpoint || !this.listbox) return;
		this.status = this.createStatusRegion();
		this.bind();
	}
	createStatusRegion() {
		const status = document.createElement("div");
		status.className = "visually-hidden";
		status.setAttribute("role", "status");
		status.setAttribute("aria-live", "polite");
		this.listbox?.insertAdjacentElement("afterend", status);
		return status;
	}
	bind() {
		if (!this.listbox) return;
		const listbox = this.listbox;
		EventHandler.on(this.input, "input", () => {
			if (this.input.value.trim().length < MIN_CHARS) {
				this.close();
				return;
			}
			this.onInput();
		});
		EventHandler.on(this.input, "keydown", (event) => {
			if (event instanceof KeyboardEvent) this.onKeydown(event);
		});
		EventHandler.on(listbox, "mousedown", (event) => {
			event.preventDefault();
		});
		EventHandler.on(listbox, "click", (event) => {
			const optionEl = eventTargetElement(event)?.closest("[role=\"option\"]");
			if (!(optionEl instanceof HTMLElement)) return;
			const index = this.options.findIndex((option) => option.el === optionEl);
			if (index >= 0) this.selectOption(index);
		});
		EventHandler.on(document, "click", (event) => {
			const target = event.target;
			if (!(target instanceof Node)) return;
			if (!this.input.contains(target) && !listbox.contains(target)) this.close();
		});
	}
	async requestSuggestions() {
		if (!this.endpoint || !this.listbox) return;
		const term = this.input.value.trim();
		if (term.length < MIN_CHARS) {
			this.close();
			return;
		}
		this.controller?.abort();
		this.controller = new AbortController();
		const url = new URL(this.endpoint, window.location.origin);
		url.searchParams.set("tx_mpcore_suggest", "1");
		url.searchParams.set("q", term);
		try {
			const response = await fetch(url.href, {
				headers: { Accept: "application/json" },
				signal: this.controller.signal
			});
			if (!response.ok) {
				this.close();
				return;
			}
			const data = await response.json();
			if (this.input.value.trim() !== term) return;
			this.render(Array.isArray(data.suggestions) ? data.suggestions : []);
		} catch (error) {
			if (error instanceof Error && error.name !== "AbortError") this.close();
		}
	}
	render(suggestions) {
		if (!this.listbox) return;
		this.listbox.replaceChildren();
		this.options = [];
		this.activeIndex = -1;
		if (suggestions.length === 0) {
			this.close();
			this.announce(i18n.suggestNone);
			return;
		}
		const listboxId = this.listbox.id;
		let headingRendered = false;
		suggestions.forEach((suggestion, index) => {
			const label = String(suggestion.label ?? "");
			if (label === "") return;
			if (suggestion.type === "page" && !headingRendered && this.pagesHeading !== "") {
				const heading = document.createElement("li");
				heading.className = "tx-indexedsearch-suggest-heading fs-sm";
				if (this.options.length > 0) heading.classList.add("tx-indexedsearch-suggest-heading-divided");
				heading.setAttribute("role", "presentation");
				heading.setAttribute("aria-hidden", "true");
				heading.textContent = this.pagesHeading;
				this.listbox?.append(heading);
				headingRendered = true;
			}
			const optionEl = document.createElement("li");
			optionEl.id = `${listboxId}-option-${index}`;
			optionEl.setAttribute("role", "option");
			optionEl.setAttribute("aria-selected", "false");
			optionEl.className = "tx-indexedsearch-suggest-option fs-md";
			if (suggestion.type === "page") {
				optionEl.classList.add("tx-indexedsearch-suggest-option-page");
				const title = document.createElement("span");
				title.className = "tx-indexedsearch-suggest-title";
				title.textContent = label;
				optionEl.append(createIcon("page", "tx-indexedsearch-suggest-icon-page"), title, createIcon("chevron", "tx-indexedsearch-suggest-chevron"));
				this.listbox?.append(optionEl);
				const href = suggestion.url ? safeSameOriginHref(suggestion.url) : null;
				if (href) this.options.push({
					el: optionEl,
					url: href
				});
				else this.options.push({
					el: optionEl,
					query: label
				});
			} else {
				optionEl.classList.add("tx-indexedsearch-suggest-option-word");
				const text = document.createElement("span");
				text.className = "tx-indexedsearch-suggest-text";
				text.textContent = label;
				optionEl.append(createIcon("search", "tx-indexedsearch-suggest-icon"), text);
				this.listbox?.append(optionEl);
				this.options.push({
					el: optionEl,
					query: suggestion.query ?? label
				});
			}
		});
		if (this.options.length === 0) {
			this.close();
			this.announce(i18n.suggestNone);
			return;
		}
		this.open();
		const message = this.options.length === 1 ? i18n.suggestOne : i18n.suggestMany.replace("{{count}}", String(this.options.length));
		this.announce(message);
	}
	onKeydown(event) {
		const isOpen = this.input.getAttribute("aria-expanded") === "true";
		switch (event.key) {
			case "ArrowDown":
				event.preventDefault();
				if (!isOpen && this.options.length > 0) this.open();
				this.moveActive(1);
				break;
			case "ArrowUp":
				if (!isOpen) return;
				event.preventDefault();
				this.moveActive(-1);
				break;
			case "Enter":
				if (isOpen && this.activeIndex >= 0) {
					event.preventDefault();
					this.selectOption(this.activeIndex);
				}
				break;
			case "Escape":
				if (isOpen) {
					event.preventDefault();
					this.close();
				}
				break;
			case "Tab": this.close();
		}
	}
	moveActive(direction) {
		if (this.options.length === 0) return;
		const count = this.options.length;
		let next = this.activeIndex + direction;
		if (next < 0) next = count - 1;
		else if (next >= count) next = 0;
		this.setActive(next);
	}
	setActive(index) {
		this.options.forEach((option, i) => {
			const active = i === index;
			option.el.classList.toggle("is-active", active);
			option.el.setAttribute("aria-selected", active ? "true" : "false");
		});
		this.activeIndex = index;
		const activeEl = this.options[index]?.el;
		if (activeEl) {
			this.input.setAttribute("aria-activedescendant", activeEl.id);
			activeEl.scrollIntoView({ block: "nearest" });
		}
	}
	selectOption(index) {
		const option = this.options[index];
		if (!option) return;
		if (option.url) {
			this.close();
			window.location.assign(option.url);
			return;
		}
		if (option.query) {
			this.input.value = option.query;
			this.close();
			if (this.form) {
				if (typeof this.form.requestSubmit === "function") this.form.requestSubmit();
				else this.form.submit();
			}
		}
	}
	open() {
		if (!this.listbox) return;
		this.listbox.hidden = false;
		this.input.setAttribute("aria-expanded", "true");
	}
	close() {
		if (!this.listbox) return;
		this.controller?.abort();
		this.listbox.hidden = true;
		this.input.setAttribute("aria-expanded", "false");
		this.input.removeAttribute("aria-activedescendant");
		this.activeIndex = -1;
		this.options.forEach((option) => {
			option.el.classList.remove("is-active");
			option.el.setAttribute("aria-selected", "false");
		});
	}
	announce(message) {
		this.status.textContent = message;
	}
};
function initSearchAutosuggest() {
	document.querySelectorAll("input[data-autosuggest-url]").forEach((input) => {
		if (input instanceof HTMLInputElement) SearchAutosuggest.getOrCreateInstance(input);
	});
}
function initHeaderSearchFocus() {
	EventHandler.on(document, "shown.bs.menu", (event) => {
		const toggle = event.target;
		if (!(toggle instanceof Element)) return;
		const input = (toggle.parentElement?.querySelector(".menu"))?.querySelector("input[type=\"search\"], input[data-autosuggest-url]");
		if (input instanceof HTMLInputElement) input.focus();
	});
}
initSearchAutosuggest();
initHeaderSearchFocus();
// Assets/Scripts/code/formDatepickerA11y.ts
/**
* Accessibility patches for Bootstrap 6 + Vanilla Calendar Pro datepicker on ext:form fields.
* Does not replace native Date / DateFromTo for critical AT paths — reduces grid noise and announces selection.
*/
function liveStrings() {
	if ((document.documentElement.lang ?? "").toLowerCase().startsWith("de")) return {
		calendarOpened: "Kalender geöffnet. Wählen Sie ein Datum.",
		dateSelected: (label) => `${label} gewählt.`,
		rangeStart: (label) => `Beginn: ${label}. Bitte Enddatum wählen.`,
		rangeComplete: (start, end) => `Zeitraum: ${start} bis ${end}.`
	};
	return {
		calendarOpened: "Calendar opened. Choose a date.",
		dateSelected: (label) => `${label} selected.`,
		rangeStart: (label) => `Start: ${label}. Choose an end date.`,
		rangeComplete: (start, end) => `Range: ${start} to ${end}.`
	};
}
function formatDayLabel(isoDate, locale) {
	const date = /* @__PURE__ */ new Date(`${isoDate}T12:00:00`);
	if (Number.isNaN(date.getTime())) return isoDate;
	const resolved = locale === "default" || locale === "" ? void 0 : locale;
	return new Intl.DateTimeFormat(resolved, {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	}).format(date);
}
function getFieldLabel(input) {
	const id = input.id;
	if (!id) return null;
	const root = input.getRootNode();
	return (root instanceof Document || root instanceof ShadowRoot ? root : document).querySelector(`label[for="${CSS.escape(id)}"]`) ?? null;
}
function getPopup(input) {
	const popupId = input.getAttribute("aria-controls");
	if (!popupId) return null;
	const root = input.getRootNode();
	return (root instanceof Document || root instanceof ShadowRoot ? root : document).getElementById(popupId);
}
function ensureLiveRegion(popup, inputId) {
	const liveId = `mp-bs-datepicker-live-${inputId}`;
	let live = popup.querySelector(`#${CSS.escape(liveId)}`);
	if (!live) {
		live = document.createElement("div");
		live.id = liveId;
		live.className = "visually-hidden";
		live.setAttribute("aria-live", "polite");
		live.setAttribute("aria-atomic", "true");
		popup.prepend(live);
	}
	return live;
}
function enhanceDatepickerPopup(input) {
	const popup = getPopup(input);
	if (!popup) return;
	const locale = input.getAttribute("data-bs-locale")?.trim() || document.documentElement.lang || "default";
	popup.setAttribute("aria-modal", "true");
	const label = getFieldLabel(input);
	if (label) {
		if (!label.id) label.id = `${input.id}-label`;
		popup.setAttribute("aria-labelledby", label.id);
	}
	ensureLiveRegion(popup, input.id);
	for (const weekTitle of popup.querySelectorAll("[data-vc-week=\"titles\"], [data-vc=\"week\"]")) weekTitle.setAttribute("aria-hidden", "true");
	for (const cell of popup.querySelectorAll("[data-vc-date]")) {
		const iso = cell.dataset.vcDate?.trim();
		const button = cell.querySelector("[data-vc-date-btn]");
		if (!iso || !button) continue;
		const month = cell.dataset.vcDateMonth;
		const disabled = button.matches(":disabled") || month === "prev" || month === "next";
		const dayLabel = formatDayLabel(iso, locale);
		button.setAttribute("aria-label", disabled ? `${dayLabel}, not available` : dayLabel);
		if (disabled) button.setAttribute("aria-disabled", "true");
	}
}
function announce(live, text) {
	live.textContent = "";
	window.setTimeout(() => {
		live.textContent = text;
	}, 50);
}
function announceSelection(input, dates) {
	const popup = getPopup(input);
	if (!popup || dates.length === 0) return;
	const live = ensureLiveRegion(popup, input.id);
	const locale = input.getAttribute("data-bs-locale")?.trim() || document.documentElement.lang || "default";
	const strings = liveStrings();
	const isRange = input.getAttribute("data-bs-selection-mode") === "multiple-ranged";
	const labels = dates.map((d) => formatDayLabel(d, locale));
	if (isRange && labels.length === 1) {
		announce(live, strings.rangeStart(labels[0]));
		return;
	}
	if (isRange && labels.length >= 2) {
		announce(live, strings.rangeComplete(labels[0], labels[1]));
		return;
	}
	announce(live, strings.dateSelected(labels[0]));
}
var boundInputs = /* @__PURE__ */ new WeakSet();
function bindDatepickerAccessibility(input) {
	if (boundInputs.has(input)) return;
	boundInputs.add(input);
	input.addEventListener("shown.bs.datepicker", () => {
		enhanceDatepickerPopup(input);
		const popup = getPopup(input);
		if (!popup) return;
		announce(ensureLiveRegion(popup, input.id), liveStrings().calendarOpened);
	});
	input.addEventListener("change.bs.datepicker", (event) => {
		const dates = event.detail?.dates ?? Datepicker.getInstance(input)?.getSelectedDates() ?? [];
		enhanceDatepickerPopup(input);
		announceSelection(input, [...dates]);
	});
}
// Assets/Scripts/code/formDateFromTo.ts
/**
* Couples ext:form DateFromTo start/end native date inputs (min/max without Bootstrap).
*/
function maxIso(a, b) {
	if (a === "") return b;
	if (b === "") return a;
	return a > b ? a : b;
}
function minIso(a, b) {
	if (a === "") return b;
	if (b === "") return a;
	return a < b ? a : b;
}
/** Native date inputs may accept out-of-range values via keyboard until submit; snap back to min/max. */
function clampNativeDateInput(input) {
	const value = input.value.trim();
	if (value === "") return;
	const { min, max } = input;
	if (min !== "" && value < min) input.value = min;
	else if (max !== "" && value > max) input.value = max;
}
function syncDateFromToBounds(wrapper, start, end) {
	const globalMin = wrapper.dataset.bsDateMin?.trim() ?? "";
	const globalMax = wrapper.dataset.bsDateMax?.trim() ?? "";
	const startValue = start.value.trim();
	const endValue = end.value.trim();
	start.min = globalMin;
	end.max = globalMax;
	if (endValue !== "") start.max = globalMax === "" ? endValue : minIso(endValue, globalMax);
	else {
		start.removeAttribute("max");
		if (globalMax !== "") start.max = globalMax;
	}
	if (startValue !== "") end.min = globalMin === "" ? startValue : maxIso(startValue, globalMin);
	else {
		end.removeAttribute("min");
		if (globalMin !== "") end.min = globalMin;
	}
	if (startValue !== "" && endValue !== "" && endValue < startValue) {
		end.value = startValue;
		end.min = startValue;
	}
	clampNativeDateInput(start);
	clampNativeDateInput(end);
}
function initFormDateFromTo() {
	for (const wrapper of document.querySelectorAll("[data-mp-bs-form-date-from-to]")) {
		const start = wrapper.querySelector("[data-mp-date-from-to-start]");
		const end = wrapper.querySelector("[data-mp-date-from-to-end]");
		if (!start || !end) continue;
		const refresh = () => {
			syncDateFromToBounds(wrapper, start, end);
		};
		start.addEventListener("change", refresh);
		start.addEventListener("input", refresh);
		end.addEventListener("change", refresh);
		end.addEventListener("input", refresh);
		refresh();
	}
}
// Assets/Scripts/code/formDateRangeClear.ts
var ISO_DATE_RANGE$1 = /^\d{4}-\d{2}-\d{2},\d{4}-\d{2}-\d{2}$/;
function getDatepickerBoundValue(input) {
	const previous = input.previousElementSibling;
	if (previous instanceof HTMLInputElement && previous.type === "hidden") return previous.value.trim();
	return "";
}
/** True when the ranged field has a calendar selection or a reposted ISO range value. */
function hasRangeDateSelection(input) {
	if ((Datepicker.getInstance(input)?.getSelectedDates().length ?? 0) > 0) return true;
	const boundValue = getDatepickerBoundValue(input);
	if (boundValue !== "" && ISO_DATE_RANGE$1.test(boundValue)) return true;
	const visibleValue = input.value.trim();
	return visibleValue !== "" && ISO_DATE_RANGE$1.test(visibleValue);
}
function resetRangeDatepicker(input) {
	input.value = "";
	input.removeAttribute("data-bs-selected-dates");
	if (getDatepickerBoundValue(input) !== "") {
		const previous = input.previousElementSibling;
		if (previous instanceof HTMLInputElement && previous.type === "hidden") previous.value = "";
	}
	Datepicker.getInstance(input)?.dispose();
	return Datepicker.getOrCreateInstance(input);
}
function syncRangeClearButton(input, clearButton) {
	const hasSelection = hasRangeDateSelection(input);
	clearButton.hidden = !hasSelection;
	clearButton.disabled = !hasSelection;
}
function bindRangeClearButton(wrapper, input) {
	const clearButton = wrapper.querySelector("[data-mp-bs-date-range-clear]");
	if (!clearButton) return;
	const refreshClear = () => {
		syncRangeClearButton(input, clearButton);
	};
	refreshClear();
	queueMicrotask(refreshClear);
	clearButton.addEventListener("click", () => {
		resetRangeDatepicker(input);
		input.dispatchEvent(new Event("change", { bubbles: true }));
		refreshClear();
		input.focus();
	});
	input.addEventListener("change.bs.datepicker", refreshClear);
	input.addEventListener("change", refreshClear);
}
// Assets/Scripts/code/formComboboxSync.ts
/**
* Keeps a native multi-select in sync with Bootstrap 6 Combobox selections.
* TYPO3 ext:form reads the backing &lt;select multiple&gt; on submit.
*/
function readSelectedValues(select) {
	return Array.from(select.selectedOptions).map((option) => option.value);
}
function syncSelectMultipleFromValues(select, values) {
	const wanted = new Set(values);
	for (const option of select.options) option.selected = wanted.has(option.value);
}
function markMenuItemsForBackingSelect(root, backing) {
	const selected = new Set(readSelectedValues(backing));
	for (const item of root.querySelectorAll(".menu-item[data-bs-value]")) {
		const value = item.getAttribute("data-bs-value") ?? "";
		item.classList.toggle("selected", selected.has(value));
	}
}
// Assets/Scripts/code/formBootstrapEnhancements.ts
/**
* Optional Bootstrap 6 widgets for ext:form (datepicker, combobox).
*/
function initFormBootstrapEnhancements() {
	initFormDateFromTo();
	initFormDatepickers();
	initFormComboboxes();
}
var ISO_DATE_RANGE = /^\d{4}-\d{2}-\d{2},\d{4}-\d{2}-\d{2}$/;
function parseDisplayMonthsCount(raw) {
	return raw?.trim() === "2" ? 2 : 1;
}
function initFormDatepickers() {
	for (const wrapper of document.querySelectorAll("[data-mp-bs-form-datepicker]")) {
		const input = wrapper.querySelector("[data-bs-toggle=\"datepicker\"]");
		if (!input) continue;
		const locale = document.documentElement.lang?.trim() || "default";
		input.setAttribute("data-bs-locale", locale);
		const min = wrapper.dataset.bsDateMin?.trim() ?? "";
		const max = wrapper.dataset.bsDateMax?.trim() ?? "";
		if (min !== "") input.setAttribute("data-bs-date-min", min);
		if (max !== "") input.setAttribute("data-bs-date-max", max);
		const isRange = wrapper.dataset.mpBsFormDateRange === "1";
		const displayMonthsCount = parseDisplayMonthsCount(wrapper.dataset.bsDisplayMonthsCount);
		const rangeEndMessage = wrapper.dataset.mpBsRangeEndMessage?.trim() ?? "";
		if (isRange) {
			input.setAttribute("data-bs-selection-mode", "multiple-ranged");
			input.readOnly = true;
			input.setAttribute("data-bs-display-months-count", String(displayMonthsCount));
			if (rangeEndMessage !== "") input.setAttribute("data-bs-range-end-message", rangeEndMessage);
		}
		const initial = input.value.trim();
		const existing = Datepicker.getInstance(input);
		if (existing) existing.dispose();
		const pickerOptions = {};
		if (isRange) {
			pickerOptions.selectionMode = "multiple-ranged";
			pickerOptions.displayMonthsCount = displayMonthsCount;
			if (rangeEndMessage !== "") pickerOptions.rangeEndMessage = rangeEndMessage;
		}
		const picker = Datepicker.getOrCreateInstance(input, pickerOptions);
		bindDatepickerAccessibility(input);
		if (isRange && ISO_DATE_RANGE.test(initial)) {
			const [start, end] = initial.split(",", 2);
			picker.setSelectedDates([start, end]);
		}
		if (isRange) bindRangeClearButton(wrapper, input);
	}
}
function initFormComboboxes() {
	for (const root of document.querySelectorAll("[data-mp-combobox-root]")) {
		const control = root.querySelector("[data-mp-combobox-control]");
		const backingId = control?.dataset.mpComboboxBacking;
		if (!control || !backingId) continue;
		const backing = document.getElementById(backingId);
		if (!(backing instanceof HTMLSelectElement)) continue;
		markMenuItemsForBackingSelect(root, backing);
		const combobox = Combobox.getOrCreateInstance(control);
		control.addEventListener("change.bs.combobox", () => {
			const values = combobox.getValues();
			syncSelectMultipleFromValues(backing, values);
			backing.dispatchEvent(new Event("change", { bubbles: true }));
		});
		backing.addEventListener("change", () => {
			const values = readSelectedValues(backing);
			syncSelectMultipleFromValues(backing, values);
			markMenuItemsForBackingSelect(root, backing);
		});
	}
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => initFormBootstrapEnhancements());
else initFormBootstrapEnhancements();
// Assets/Scripts/code/main.ts
document.addEventListener("click", (e) => {
	const target = e.target;
	if (!(target instanceof Element)) return;
	const popupLink = target.closest(".popup-window");
	if (popupLink instanceof HTMLAnchorElement) {
		e.preventDefault();
		try {
			const url = new URL(popupLink.getAttribute("href") ?? "", document.baseURI);
			if (url.protocol === "https:" || url.protocol === "http:") window.open(url.href, "", "width=600,height=600,noopener,noreferrer");
		} catch {}
		return;
	}
	if (target.closest(".js-print")) {
		e.preventDefault();
		window.print();
	}
});
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) document.querySelectorAll("video[autoplay]").forEach((video) => {
	if (video instanceof HTMLVideoElement) {
		video.removeAttribute("autoplay");
		video.pause();
	}
});
asHTMLElement(document.querySelector(".is-invalid"))?.focus();
document.getElementById("tx-indexedsearch-searchbox-sword")?.focus();

//# sourceMappingURL=screen.js.map
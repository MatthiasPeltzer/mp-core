const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./vendor-jarallax-CcWvO50j.js","./rolldown-runtime-DJqFfS24.js"])))=>i.map(i=>d[i]);
import { n as debounce$1 } from "./domUtils-4h3QtqRC.js";
import { n as notifyDynamicContentReady, r as pausePlayersInside } from "./vidply-dynamic-content-x2lxO_CE.js";
import { t as __vitePreload } from "./preload-helper-CALLvQDj.js";
import { a as i18n } from "./i18n-D-i_rRaW.js";
// Assets/Scripts/code/nav-toggle.js
/**
* Keeps mobile and desktop navigation landmarks in the DOM but marks the
* inactive variant inert for assistive technology (replaces DOM detachment).
*/
(function() {
	if (!document.getElementById("main-menu-list")) return;
	const mqLg = window.matchMedia("(min-width: 62rem)");
	const mobileNav = document.getElementById("main-menu");
	const desktopNav = document.querySelector("nav.mainnav-desktop");
	/**
	* @param {HTMLElement|null} element
	* @param {boolean} inactive
	*/
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
	/**
	* @param {MediaQueryListEvent|MediaQueryList} event
	*/
	function handleBreakpoint(event) {
		const isDesktop = event.matches;
		setNavInactiveState(mobileNav, isDesktop);
		setNavInactiveState(desktopNav, !isDesktop);
	}
	window.addEventListener("load", () => {
		handleBreakpoint(mqLg);
	});
	mqLg.addEventListener("change", handleBreakpoint);
})();
// Assets/Scripts/code/moveMeta.js
/**
* Moves meta navigation and theme switch between desktop and mobile containers.
*
* - < lg (< 62rem):      content lives in .meta-mobile
* - >= lg (min-width: 62rem): content lives in .meta-desktop
*
* Uses DOM manipulation (no cloning) to preserve event listeners.
*/
(function() {
	const mqLg = window.matchMedia("(min-width: 62rem)");
	function moveAllChildren(fromEl, toEl) {
		if (!fromEl || !toEl) return;
		while (fromEl.firstChild) toEl.appendChild(fromEl.firstChild);
	}
	function syncPair(desktopEl, mobileEl, toDesktop) {
		if (!desktopEl || !mobileEl) return;
		if (toDesktop) {
			if (desktopEl.childNodes.length === 0 && mobileEl.childNodes.length > 0) moveAllChildren(mobileEl, desktopEl);
		} else if (mobileEl.childNodes.length === 0 && desktopEl.childNodes.length > 0) moveAllChildren(desktopEl, mobileEl);
	}
	function handleBreakpoint(e) {
		const toDesktop = !!e.matches;
		const desktops = Array.from(document.querySelectorAll(".meta-desktop"));
		const mobiles = Array.from(document.querySelectorAll(".meta-mobile"));
		if (!desktops.length || !mobiles.length) return;
		if (desktops.length === mobiles.length) {
			desktops.forEach((desktopEl, idx) => {
				syncPair(desktopEl, mobiles[idx], toDesktop);
			});
			return;
		}
		if (desktops.length === 1) {
			const desktopEl = desktops[0];
			syncPair(desktopEl, mobiles.find((m) => m.childNodes.length > 0) || mobiles[0], toDesktop);
		}
	}
	function init() {
		handleBreakpoint(mqLg);
		mqLg.addEventListener("change", handleBreakpoint);
	}
	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
	else init();
})();
// Assets/Scripts/code/moveHeaderDate.js
var dateWrapper = document.querySelector(".date-wrapper");
var headerContent = document.getElementById("headerMain");
if (dateWrapper && headerContent) headerContent.insertAdjacentElement("afterend", dateWrapper);
// Assets/Scripts/code/sticky.js
/**
* Sticky Header Module
*
* When a .toplogo-container exists (banner / extra logos above the nav),
* a progressive negative margin hides the toplogo pixel-by-pixel as the
* user scrolls, keeping the navigation pinned at the viewport top.
*
* The .sticky class is still toggled for cosmetic CSS changes (logo swap,
* meta-nav hide, etc.) once the toplogo is fully scrolled out.
*/
var body = document.body;
var header = document.querySelector(".header-wrapper-bg");
if (header) {
	const toplogo = header.querySelector(".toplogo-container");
	let headerHeight = header.offsetHeight;
	let toplogoHeight = toplogo ? toplogo.offsetHeight : 0;
	let ticking = false;
	function handleScroll() {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(() => {
			const scrollY = window.scrollY;
			if (toplogo && toplogoHeight > 0) {
				const offset = Math.min(scrollY, toplogoHeight + 17);
				toplogo.style.marginTop = `${-offset / 16}rem`;
			}
			const threshold = toplogoHeight > 0 ? toplogoHeight : headerHeight;
			body.classList.toggle("sticky", scrollY >= threshold);
			ticking = false;
		});
	}
	window.addEventListener("scroll", handleScroll, { passive: true });
	requestAnimationFrame(() => {
		measureToplogo();
		handleScroll();
	});
	function measureToplogo() {
		if (toplogo) toplogoHeight = toplogo.offsetHeight;
	}
	/**
	* Updates body padding based on current header height
	*/
	function updatePadding() {
		headerHeight = header.offsetHeight;
		body.style.paddingTop = `${headerHeight / 16}rem`;
		measureToplogo();
	}
	/**
	* Initializes responsive padding behavior
	*/
	function initResponsivePadding() {
		const mediaQuery = window.matchMedia("(min-width: 62rem)");
		const handleMediaChange = () => {
			setTimeout(updatePadding, 50);
		};
		handleMediaChange();
		mediaQuery.addEventListener("change", handleMediaChange);
	}
	initResponsivePadding();
	if (toplogo) new ResizeObserver(() => measureToplogo()).observe(toplogo);
}
// Assets/Scripts/code/theme.js
var html = document.documentElement;
var mediaQueryDark = window.matchMedia("(prefers-color-scheme: dark)");
/**
* @param {string} theme - 'light' or 'dark'
* @param {boolean} explicit - Whether this is an explicit user choice (persists to localStorage)
*/
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
	return Array.from(document.querySelectorAll("#themeSwitch"));
}
function handleSystemPreferenceChange(e) {
	setTheme(e.matches ? "dark" : "light", false);
}
var storedTheme = localStorage.getItem("theme");
if (storedTheme) setTheme(storedTheme.includes("dark") ? "dark" : "light");
else {
	mediaQueryDark.addEventListener("change", handleSystemPreferenceChange);
	handleSystemPreferenceChange(mediaQueryDark);
}
/**
* Safe to call multiple times — uses a data attribute to prevent double-binding.
*/
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
if (typeof window !== "undefined") window.mpcInitThemeSwitch = initThemeSwitch;
// Assets/Scripts/code/totop.js
var totop = document.querySelector(".totop");
var bg = document.querySelector(".totop .bg");
if (totop && bg) {
	let ticking = false;
	function handleScroll() {
		const maxScrollHeight = document.body.offsetHeight - window.innerHeight;
		const scrollTop = window.scrollY;
		const degrees = (maxScrollHeight > 0 ? scrollTop / maxScrollHeight : 0) * 360;
		bg.style.background = `#fff conic-gradient(var(--bs-primary) ${degrees}deg, #fff ${degrees}deg) center center / 60px`;
		totop.classList.toggle("on", scrollTop > 250);
	}
	window.addEventListener("scroll", () => {
		if (!ticking) {
			window.requestAnimationFrame(() => {
				handleScroll();
				ticking = false;
			});
			ticking = true;
		}
	}, { passive: true });
}
// Assets/Scripts/code/modalGallery.js
function updateImageSizes() {
	const maxHeight = window.innerHeight * .75;
	document.querySelectorAll(".carousel-item img, .modal-body img").forEach((img) => {
		img.style.maxHeight = `${maxHeight}px`;
		img.style.width = "auto";
	});
}
if (document.querySelector(".modal-content")) {
	updateImageSizes();
	window.addEventListener("resize", debounce$1(updateImageSizes, 100));
}
// Assets/Scripts/code/modalContent.js
/**
* Initialise VidPly inside modals on open and pause players when closed.
*/
function initModalContent() {
	document.querySelectorAll(".modal[data-bs-backdrop]").forEach((modal) => {
		if (!(modal instanceof HTMLElement) || modal.dataset.mpcModalBound === "1") return;
		modal.dataset.mpcModalBound = "1";
		modal.addEventListener("shown.bs.modal", () => {
			const root = modal.querySelector("[data-modal-content-root]");
			notifyDynamicContentReady(root);
		});
		modal.addEventListener("hide.bs.modal", () => {
			const root = modal.querySelector("[data-modal-content-root]") ?? modal.querySelector(".modal-body");
			pausePlayersInside(root);
		});
	});
}
if (document.querySelector("[data-modal-content-root]")) initModalContent();
// Assets/Scripts/code/jarallax.js
/**
* Lazy-loads the Jarallax vendor bundle, but only when the rendered page
* actually contains at least one parallax container (i.e. an editor toggled
* `grid_parallax` on a `ce_container` / similar element, which causes
* fluid_styled_content/Layouts/Container.html to emit the `.grid-parallax`
* wrapper around a `.jarallax-img`).
*
* Pages without a parallax container therefore never request the
* `vendor-jarallax-*.js` chunk produced by the manualChunks config in
* `vite.config.js` — the chunk stays a separate, on-demand asset.
*/
var parallaxElements = document.querySelectorAll(".grid-parallax");
if (parallaxElements.length) __vitePreload(async () => {
	const { jarallax } = await import("./vendor-jarallax-CcWvO50j.js").then((n) => n.t);
	return { jarallax };
}, __vite__mapDeps([0,1]), import.meta.url).then(({ jarallax }) => {
	jarallax(parallaxElements, {
		speed: .5,
		imgPosition: "100%"
	});
}).catch((err) => {
	console.error("[mp-core/jarallax] failed to load vendor bundle", err);
});
// Assets/Scripts/code/openAccordionAndTabs.js
var SELECTORS = {
	accordion: (id) => `[data-bs-target="#accordion-${id}"]`,
	tabs: (id) => `[data-bs-target="#tab-content-${id}"]`,
	scrollList: ".list-scroll",
	scrollLink: "li a"
};
/**
* @param {string} hash
* @param {string} type - 'accordion' or 'tabs'
*/
function openElement(hash, type) {
	if (!hash) return;
	const idParts = hash.split("#c");
	if (idParts.length < 2) return;
	const id = idParts[1];
	const selector = type === "accordion" ? SELECTORS.accordion(id) : SELECTORS.tabs(id);
	const trigger = document.querySelector(selector);
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
		const link = event.target.closest(SELECTORS.scrollLink);
		if (link) {
			event.preventDefault();
			openElement(link.hash, type);
		}
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
// Assets/Scripts/code/i18nLinkHelper.js
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
/**
* @param {HTMLAnchorElement} link
* @returns {boolean}
*/
function isExternal(link) {
	const href = link.getAttribute("href");
	if (!href) return false;
	try {
		return new URL(href, document.baseURI).origin !== window.location.origin;
	} catch {
		return false;
	}
}
/**
* @param {HTMLElement} linkElement
* @param {string} text
*/
function ensureHiddenSpan(linkElement, text) {
	if (!linkElement) return;
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
/**
* @param {HTMLAnchorElement} link
* @returns {string|null}
*/
function getMatchedKey(link) {
	for (const [className, key] of CLASS_TO_KEY) if (link.classList.contains(className) && i18n[key]) return key;
	for (const cls of link.classList) {
		const aliasKey = ALIAS_TO_KEY.get(cls);
		if (aliasKey && i18n[aliasKey]) return aliasKey;
	}
	return null;
}
/**
* @param {HTMLElement|Document} root
*/
function enhanceLinksAccessibility(root = document) {
	const links = [];
	if (root?.nodeType === 1 && root.matches?.("a")) links.push(root);
	if (root?.querySelectorAll) links.push(...root.querySelectorAll("a"));
	links.forEach((link) => {
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
				if (node?.nodeType === 1 || node?.nodeType === 9) enhanceLinksAccessibility(node);
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
// Assets/Scripts/code/searchAutosuggest.js
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
var MIN_CHARS = 2;
var DEBOUNCE_MS = 200;
/**
* @param {(...args: unknown[]) => void} fn
* @param {number} wait
*/
function debounce(fn, wait) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), wait);
	};
}
/**
* Returns a same-origin href for navigation, or null if the URL is unsafe.
* Guards against open-redirects (WCAG-adjacent security hardening).
* @param {string} raw
* @returns {string|null}
*/
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
/**
* Builds a decorative inline SVG icon via the DOM (CSP-safe, no innerHTML).
* `fill="currentColor"` lets it inherit the option's text colour for the
* hover / active (inverted) states.
* @param {keyof typeof ICON_PATHS} name
* @param {string} extraClass
* @returns {SVGSVGElement}
*/
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
var Autosuggest = class {
	/**
	* @param {HTMLInputElement} input
	*/
	constructor(input) {
		this.input = input;
		this.endpoint = input.dataset.autosuggestUrl;
		this.pagesHeading = input.dataset.suggestHeader || "";
		this.listbox = document.getElementById(input.getAttribute("aria-controls"));
		this.form = input.closest("form");
		if (!this.endpoint || !this.listbox) return;
		/** @type {Array<{el: HTMLElement, query?: string, url?: string}>} */
		this.options = [];
		this.activeIndex = -1;
		this.controller = null;
		this.status = this.createStatusRegion();
		this.onInput = debounce(() => this.requestSuggestions(), DEBOUNCE_MS);
		this.bind();
	}
	createStatusRegion() {
		const status = document.createElement("div");
		status.className = "visually-hidden";
		status.setAttribute("role", "status");
		status.setAttribute("aria-live", "polite");
		this.listbox.insertAdjacentElement("afterend", status);
		return status;
	}
	bind() {
		this.input.addEventListener("input", () => {
			if (this.input.value.trim().length < MIN_CHARS) {
				this.close();
				return;
			}
			this.onInput();
		});
		this.input.addEventListener("keydown", (event) => this.onKeydown(event));
		this.listbox.addEventListener("mousedown", (event) => event.preventDefault());
		this.listbox.addEventListener("click", (event) => {
			const optionEl = event.target.closest("[role=\"option\"]");
			if (!optionEl) return;
			const index = this.options.findIndex((option) => option.el === optionEl);
			if (index >= 0) this.selectOption(index);
		});
		document.addEventListener("click", (event) => {
			if (!this.input.contains(event.target) && !this.listbox.contains(event.target)) this.close();
		});
	}
	async requestSuggestions() {
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
			if (error.name !== "AbortError") this.close();
		}
	}
	/**
	* @param {Array<{type: string, label: string, query?: string, url?: string}>} suggestions
	*/
	render(suggestions) {
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
				heading.className = "tx-indexedsearch-suggest-heading";
				if (this.options.length > 0) heading.classList.add("tx-indexedsearch-suggest-heading-divided");
				heading.setAttribute("role", "presentation");
				heading.setAttribute("aria-hidden", "true");
				heading.textContent = this.pagesHeading;
				this.listbox.append(heading);
				headingRendered = true;
			}
			const optionEl = document.createElement("li");
			optionEl.id = `${listboxId}-option-${index}`;
			optionEl.setAttribute("role", "option");
			optionEl.setAttribute("aria-selected", "false");
			optionEl.className = "tx-indexedsearch-suggest-option";
			if (suggestion.type === "page") {
				optionEl.classList.add("tx-indexedsearch-suggest-option-page");
				const title = document.createElement("span");
				title.className = "tx-indexedsearch-suggest-title";
				title.textContent = label;
				optionEl.append(createIcon("page", "tx-indexedsearch-suggest-icon-page"), title, createIcon("chevron", "tx-indexedsearch-suggest-chevron"));
				this.listbox.append(optionEl);
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
				this.listbox.append(optionEl);
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
	/**
	* @param {KeyboardEvent} event
	*/
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
	/**
	* @param {number} direction
	*/
	moveActive(direction) {
		if (this.options.length === 0) return;
		const count = this.options.length;
		let next = this.activeIndex + direction;
		if (next < 0) next = count - 1;
		else if (next >= count) next = 0;
		this.setActive(next);
	}
	/**
	* @param {number} index
	*/
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
	/**
	* @param {number} index
	*/
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
		this.listbox.hidden = false;
		this.input.setAttribute("aria-expanded", "true");
	}
	close() {
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
	/**
	* @param {string} message
	*/
	announce(message) {
		this.status.textContent = message;
	}
};
function initSearchAutosuggest() {
	document.querySelectorAll("input[data-autosuggest-url]").forEach((input) => new Autosuggest(input));
}
/**
* When the header search dropdown opens (Bootstrap dropdown), move focus into
* the search field so the user can type straight away (WCAG 2.4.3 Focus Order).
* Works whether autosuggest is enabled or not.
*/
function initHeaderSearchFocus() {
	document.addEventListener("shown.bs.dropdown", (event) => {
		const toggle = event.target;
		if (!(toggle instanceof Element)) return;
		const input = (toggle.parentElement?.querySelector(".dropdown-menu"))?.querySelector("input[type=\"search\"], input[data-autosuggest-url]");
		if (input instanceof HTMLInputElement) input.focus();
	});
}
initSearchAutosuggest();
initHeaderSearchFocus();
// Assets/Scripts/code/main.js
document.addEventListener("click", (e) => {
	const popupLink = e.target.closest(".popup-window");
	if (popupLink) {
		e.preventDefault();
		try {
			const url = new URL(popupLink.getAttribute("href"), document.baseURI);
			if (url.protocol === "https:" || url.protocol === "http:") window.open(url.href, "", "width=600,height=600,noopener,noreferrer");
		} catch {}
		return;
	}
	if (e.target.closest(".js-print")) {
		e.preventDefault();
		window.print();
	}
});
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) document.querySelectorAll("video[autoplay]").forEach((video) => {
	video.removeAttribute("autoplay");
	video.pause();
});
document.querySelector(".is-invalid")?.focus();
document.getElementById("tx-indexedsearch-searchbox-sword")?.focus();

//# sourceMappingURL=screen.js.map
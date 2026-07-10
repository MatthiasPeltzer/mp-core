const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./vendor-jarallax-BYR86rnq.js","./rolldown-runtime-CL6CfywC.js"])))=>i.map(i=>d[i]);
import { n as debounce } from "./domUtils-D0p1mhw4.js";
import { n as notifyDynamicContentReady, r as pausePlayersInside } from "./vidply-dynamic-content-DiJx1yiX.js";
import { t as __vitePreload } from "./preload-helper-DHlaQ_oz.js";
import { a as i18n } from "./i18n-CTgK0wgO.js";
//#region Assets/Scripts/code/nav-toggle.js
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
//#endregion
//#region Assets/Scripts/code/moveMeta.js
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
//#endregion
//#region Assets/Scripts/code/moveHeaderDate.js
var dateWrapper = document.querySelector(".date-wrapper");
var headerContent = document.getElementById("headerMain");
if (dateWrapper && headerContent) headerContent.insertAdjacentElement("afterend", dateWrapper);
//#endregion
//#region Assets/Scripts/code/sticky.js
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
//#endregion
//#region Assets/Scripts/code/theme.js
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
//#endregion
//#region Assets/Scripts/code/totop.js
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
//#endregion
//#region Assets/Scripts/code/modalGallery.js
function updateImageSizes() {
	const maxHeight = window.innerHeight * .75;
	document.querySelectorAll(".carousel-item img, .modal-body img").forEach((img) => {
		img.style.maxHeight = `${maxHeight}px`;
		img.style.width = "auto";
	});
}
if (document.querySelector(".modal-content")) {
	updateImageSizes();
	window.addEventListener("resize", debounce(updateImageSizes, 100));
}
//#endregion
//#region Assets/Scripts/code/modalContent.js
/**
* Initialise VidPly inside modals on open and pause players when closed.
*/
function initModalContent() {
	document.querySelectorAll(".modal[data-bs-backdrop]").forEach((modal) => {
		if (!(modal instanceof HTMLElement) || modal.dataset.mpcModalBound === "1") return;
		modal.dataset.mpcModalBound = "1";
		modal.addEventListener("shown.bs.modal", () => {
			notifyDynamicContentReady(modal.querySelector("[data-modal-content-root]"));
		});
		modal.addEventListener("hide.bs.modal", () => {
			pausePlayersInside(modal.querySelector("[data-modal-content-root]") ?? modal.querySelector(".modal-body"));
		});
	});
}
if (document.querySelector("[data-modal-content-root]")) initModalContent();
//#endregion
//#region Assets/Scripts/code/jarallax.js
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
	const { jarallax } = await import("./vendor-jarallax-BYR86rnq.js").then((n) => n.t);
	return { jarallax };
}, __vite__mapDeps([0,1]), import.meta.url).then(({ jarallax }) => {
	jarallax(parallaxElements, {
		speed: .5,
		imgPosition: "100%"
	});
}).catch((err) => {
	console.error("[mp-core/jarallax] failed to load vendor bundle", err);
});
//#endregion
//#region Assets/Scripts/code/openAccordionAndTabs.js
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
//#endregion
//#region Assets/Scripts/code/i18nLinkHelper.js
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
		if (isBlank && external) if (matchedKey === "externalLinkNew") helperText = i18n.externalLinkNew;
		else helperText = `${i18n.externalLink} (${i18n.newWindow})`;
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
	const handleMutations = debounce((mutations) => {
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
//#endregion
//#region Assets/Scripts/code/main.js
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
//#endregion

//# sourceMappingURL=screen.js.map
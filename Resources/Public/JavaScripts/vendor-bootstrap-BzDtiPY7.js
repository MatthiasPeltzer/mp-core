// node_modules/bootstrap/js/dist/dom/data.js
/*!
* Bootstrap data.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
/**
* --------------------------------------------------------------------------
* Bootstrap dom/data.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
var elementMap = /* @__PURE__ */ new Map();
var data_default = {
	set(element, key, instance) {
		if (!elementMap.has(element)) elementMap.set(element, /* @__PURE__ */ new Map());
		elementMap.get(element).set(key, instance);
	},
	get(element, key) {
		if (element && elementMap.has(element)) return elementMap.get(element).get(key) || null;
		return null;
	},
	remove(element, key) {
		if (!elementMap.has(element)) return;
		const instanceMap = elementMap.get(element);
		instanceMap.delete(key);
		if (instanceMap.size === 0) elementMap.delete(element);
	}
};
// node_modules/bootstrap/js/dist/dom/event-handler.js
/*!
* Bootstrap event-handler.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
/**
* Constants
*/
var namespaceRegex = /[^.]*(?=\..*)\.|.*/;
var stripNameRegex = /\..*/;
var stripUidRegex = /::\d+$/;
var eventRegistry = {};
var uidEvent = 1;
var customEvents = {
	mouseenter: "mouseover",
	mouseleave: "mouseout"
};
var nativeEvents = /* @__PURE__ */ new Set([
	"click",
	"dblclick",
	"mouseup",
	"mousedown",
	"contextmenu",
	"mousewheel",
	"DOMMouseScroll",
	"mouseover",
	"mouseout",
	"mousemove",
	"selectstart",
	"selectend",
	"keydown",
	"keypress",
	"keyup",
	"input",
	"compositionstart",
	"compositionupdate",
	"compositionend",
	"paste",
	"orientationchange",
	"touchstart",
	"touchmove",
	"touchend",
	"touchcancel",
	"pointerdown",
	"pointermove",
	"pointerover",
	"pointerup",
	"pointerleave",
	"pointercancel",
	"gesturestart",
	"gesturechange",
	"gestureend",
	"focus",
	"blur",
	"change",
	"reset",
	"select",
	"submit",
	"focusin",
	"focusout",
	"load",
	"unload",
	"beforeunload",
	"resize",
	"move",
	"DOMContentLoaded",
	"readystatechange",
	"error",
	"abort",
	"scroll",
	"scrollend",
	"hashchange"
]);
/**
* Private methods
*/
function makeEventUid(element, uid) {
	return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
}
function getElementEvents(element) {
	const uid = makeEventUid(element);
	element.uidEvent = uid;
	eventRegistry[uid] = eventRegistry[uid] || {};
	return eventRegistry[uid];
}
function isMouseEventWithinTarget(event) {
	const { delegateTarget, relatedTarget } = event;
	return Boolean(relatedTarget && delegateTarget.contains(relatedTarget));
}
function bootstrapHandler(element, fn, handlerTypeEvent) {
	const isCustomMouseEvent = handlerTypeEvent in customEvents;
	return function handler(event) {
		const bootstrapEvent = hydrateObj(event, { delegateTarget: element });
		if (isCustomMouseEvent && isMouseEventWithinTarget(bootstrapEvent)) return;
		if (handler.oneOff) EventHandler.off(element, handlerTypeEvent, fn);
		return fn.apply(element, [bootstrapEvent]);
	};
}
function bootstrapDelegationHandler(element, selector, fn, handlerTypeEvent) {
	const isCustomMouseEvent = handlerTypeEvent in customEvents;
	return function handler(event) {
		const domElements = element.querySelectorAll(selector);
		for (let { target } = event; target && target !== this; target = target.parentNode) for (const domElement of domElements) {
			if (domElement !== target) continue;
			const bootstrapEvent = hydrateObj(event, { delegateTarget: target });
			if (isCustomMouseEvent && isMouseEventWithinTarget(bootstrapEvent)) return;
			if (handler.oneOff) EventHandler.off(element, handlerTypeEvent, selector, fn);
			return fn.apply(target, [bootstrapEvent]);
		}
	};
}
function findHandler(events, callable, handlerTypeEvent, delegationSelector = null) {
	return Object.values(events).find((event) => event.callable === callable && event.handlerTypeEvent === handlerTypeEvent && event.delegationSelector === delegationSelector);
}
function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
	const isDelegated = typeof handler === "string";
	const callable = isDelegated ? delegationFunction : handler || delegationFunction;
	const baseTypeEvent = originalTypeEvent.replace(stripNameRegex, "");
	let typeEvent = customEvents[baseTypeEvent] || baseTypeEvent;
	if (!nativeEvents.has(typeEvent)) typeEvent = originalTypeEvent;
	const handlerTypeEvent = baseTypeEvent in customEvents ? baseTypeEvent : typeEvent;
	return {
		isDelegated,
		callable,
		typeEvent,
		handlerTypeEvent
	};
}
function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
	if (typeof originalTypeEvent !== "string" || !element) return;
	const { isDelegated, callable, typeEvent, handlerTypeEvent } = normalizeParameters(originalTypeEvent, handler, delegationFunction);
	const events = getElementEvents(element);
	const handlers = events[typeEvent] || (events[typeEvent] = {});
	const previousFunction = findHandler(handlers, callable, handlerTypeEvent, isDelegated ? handler : null);
	if (previousFunction) {
		previousFunction.oneOff = previousFunction.oneOff && oneOff;
		return;
	}
	const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ""));
	const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable, handlerTypeEvent) : bootstrapHandler(element, callable, handlerTypeEvent);
	fn.delegationSelector = isDelegated ? handler : null;
	fn.callable = callable;
	fn.handlerTypeEvent = handlerTypeEvent;
	fn.oneOff = oneOff;
	fn.uidEvent = uid;
	handlers[uid] = fn;
	element.addEventListener(typeEvent, fn, isDelegated);
}
function removeHandler(element, events, typeEvent, handler) {
	element.removeEventListener(typeEvent, handler, Boolean(handler.delegationSelector));
	delete events[typeEvent][handler.uidEvent];
}
function removeNamespacedHandlers(element, events, typeEvent, namespace) {
	const storeElementEvent = events[typeEvent] || {};
	for (const [handlerKey, event] of Object.entries(storeElementEvent)) if (handlerKey.includes(namespace)) removeHandler(element, events, typeEvent, event);
}
function trigger(element, event, args) {
	if (typeof event !== "string" || !element) return null;
	const evt = hydrateObj(new Event(event, {
		bubbles: true,
		cancelable: true
	}), args);
	element.dispatchEvent(evt);
	return evt;
}
var EventHandler = {
	on(element, event, handler, delegationFunction) {
		addHandler(element, event, handler, delegationFunction, false);
	},
	one(element, event, handler, delegationFunction) {
		addHandler(element, event, handler, delegationFunction, true);
	},
	off(element, originalTypeEvent, handler, delegationFunction) {
		if (typeof originalTypeEvent !== "string" || !element) return;
		const { isDelegated, callable, typeEvent, handlerTypeEvent } = normalizeParameters(originalTypeEvent, handler, delegationFunction);
		const inNamespace = typeEvent !== originalTypeEvent && handlerTypeEvent !== originalTypeEvent;
		const events = getElementEvents(element);
		const storeElementEvent = events[typeEvent] || {};
		const isNamespace = originalTypeEvent.startsWith(".");
		if (typeof callable !== "undefined") {
			if (!Object.keys(storeElementEvent).length) return;
			const fn = findHandler(storeElementEvent, callable, handlerTypeEvent, isDelegated ? handler : null);
			if (fn) removeHandler(element, events, typeEvent, fn);
			return;
		}
		if (isNamespace) for (const elementEvent of Object.keys(events)) removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
		for (const [keyHandlers, event] of Object.entries(storeElementEvent)) {
			const handlerKey = keyHandlers.replace(stripUidRegex, "");
			if (event.handlerTypeEvent === handlerTypeEvent && (!inNamespace || originalTypeEvent.includes(handlerKey))) removeHandler(element, events, typeEvent, event);
		}
	},
	trigger
};
function hydrateObj(obj, meta = {}) {
	for (const [key, value] of Object.entries(meta)) try {
		obj[key] = value;
	} catch {
		Object.defineProperty(obj, key, {
			configurable: true,
			get() {
				return value;
			}
		});
	}
	return obj;
}
// node_modules/bootstrap/js/dist/dom/manipulator.js
/*!
* Bootstrap manipulator.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
/**
* --------------------------------------------------------------------------
* Bootstrap dom/manipulator.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
function normalizeData(value) {
	if (value === "true") return true;
	if (value === "false") return false;
	if (value === Number(value).toString()) return Number(value);
	if (value === "" || value === "null") return null;
	if (typeof value !== "string") return value;
	try {
		return JSON.parse(decodeURIComponent(value));
	} catch {
		return value;
	}
}
function normalizeDataKey(key) {
	return key.replace(/[A-Z]/g, (chr) => `-${chr.toLowerCase()}`);
}
var Manipulator = {
	setDataAttribute(element, key, value) {
		element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
	},
	removeDataAttribute(element, key) {
		element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
	},
	getDataAttributes(element) {
		if (!element) return {};
		const attributes = {};
		const bsKeys = Object.keys(element.dataset).filter((key) => key.startsWith("bs") && !key.startsWith("bsConfig"));
		for (const key of bsKeys) {
			let pureKey = key.replace(/^bs/, "");
			pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1);
			attributes[pureKey] = normalizeData(element.dataset[key]);
		}
		return attributes;
	},
	getDataAttribute(element, key) {
		return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
	}
};
// node_modules/bootstrap/js/dist/util/index.js
/*!
* Bootstrap index.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
/**
* --------------------------------------------------------------------------
* Bootstrap util/index.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
var MAX_UID = 1e6;
var MILLISECONDS_MULTIPLIER = 1e3;
var TRANSITION_END = "transitionend";
/**
* Properly escapes ID selectors to handle special characters in IDs
* (e.g. forward slashes, periods) so that they work with `document.querySelector`.
*
* @param selector - The selector to escape
* @returns The escaped selector
*/
var parseSelector = (selector) => {
	if (selector && window.CSS && window.CSS.escape) selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`);
	return selector;
};
var toType = (object) => {
	if (object === null || object === void 0) return `${object}`;
	return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
};
/**
* Public Util API
*/
var getUID = (prefix) => {
	do
		prefix += Math.floor(Math.random() * MAX_UID);
	while (document.getElementById(prefix));
	return prefix;
};
var getTransitionDurationFromElement = (element) => {
	if (!element) return 0;
	let { transitionDuration, transitionDelay } = window.getComputedStyle(element);
	if (!Number.parseFloat(transitionDuration) && !Number.parseFloat(transitionDelay)) return 0;
	transitionDuration = transitionDuration.split(",")[0];
	transitionDelay = transitionDelay.split(",")[0];
	return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
};
var triggerTransitionEnd = (element) => {
	element.dispatchEvent(new Event(TRANSITION_END));
};
var isElement$1 = (object) => {
	if (!object || typeof object !== "object") return false;
	return typeof object.nodeType !== "undefined";
};
var getElement = (object) => {
	if (isElement$1(object)) return object;
	if (typeof object === "string" && object.length > 0) return document.querySelector(parseSelector(object));
	return null;
};
var isVisible = (element) => {
	if (!isElement$1(element) || element.getClientRects().length === 0) return false;
	const elementIsVisible = getComputedStyle(element).getPropertyValue("visibility") === "visible";
	const closedDetails = element.closest("details:not([open])");
	if (!closedDetails) return elementIsVisible;
	if (closedDetails !== element) {
		const summary = element.closest("summary");
		if (summary && summary.parentNode !== closedDetails) return false;
		if (summary === null) return false;
	}
	return elementIsVisible;
};
var isDisabled = (element) => {
	if (!element || element.nodeType !== Node.ELEMENT_NODE) return true;
	if (element.classList.contains("disabled")) return true;
	const disableableElement = element;
	if (typeof disableableElement.disabled !== "undefined") return disableableElement.disabled;
	return element.hasAttribute("disabled") && element.getAttribute("disabled") !== "false";
};
var setAriaAttribute = (element, name, value) => {
	element.setAttribute(name, String(value));
};
var isRTL$1 = () => document.documentElement.dir === "rtl";
var execute = (possibleCallback, args = [], defaultValue = possibleCallback) => {
	return typeof possibleCallback === "function" ? possibleCallback.call(...args) : defaultValue;
};
var executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
	if (!waitForTransition) {
		execute(callback);
		return;
	}
	const emulatedDuration = getTransitionDurationFromElement(transitionElement) + 5;
	const handler = ({ target }) => {
		if (target !== transitionElement) return;
		cancel();
		execute(callback);
	};
	transitionElement.addEventListener(TRANSITION_END, handler);
	const timeout = setTimeout(() => triggerTransitionEnd(transitionElement), emulatedDuration);
	const cancel = () => {
		clearTimeout(timeout);
		transitionElement.removeEventListener(TRANSITION_END, handler);
	};
	return cancel;
};
/**
* Return the previous/next element of a list.
*
* @param list - The list of elements to traverse
* @param activeElement - The currently active element
* @param shouldGetNext - Whether to return the next element (`true`) or the previous one (`false`)
* @param isCycleAllowed - Whether to cycle back to the opposite end of the list when reaching the boundary
* @returns The appropriate previous/next element from the list
*/
var getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
	const listLength = list.length;
	let index = list.indexOf(activeElement);
	if (index === -1) return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
	index += shouldGetNext ? 1 : -1;
	if (isCycleAllowed) index = (index + listLength) % listLength;
	return list[Math.max(0, Math.min(index, listLength - 1))];
};
// node_modules/bootstrap/js/dist/util/config.js
/*!
* Bootstrap config.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
/**
* --------------------------------------------------------------------------
* Bootstrap util/config.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Class definition
*/
var Config = class {
	static get Default() {
		return {};
	}
	static get DefaultType() {
		return {};
	}
	static get NAME() {
		throw new Error("You have to implement the static method \"NAME\", for each component!");
	}
	_getConfig(config) {
		config = this._mergeConfigObj(config);
		config = this._configAfterMerge(config);
		this._typeCheckConfig(config);
		return config;
	}
	_configAfterMerge(config) {
		return config;
	}
	_mergeConfigObj(config, element) {
		const jsonConfig = isElement$1(element) ? Manipulator.getDataAttribute(element, "config") : {};
		return {
			...this.constructor.Default,
			...typeof jsonConfig === "object" ? jsonConfig : {},
			...isElement$1(element) ? Manipulator.getDataAttributes(element) : {},
			...typeof config === "object" ? config : {}
		};
	}
	_typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
		for (const [property, expectedTypes] of Object.entries(configTypes)) {
			const value = config[property];
			const valueType = isElement$1(value) ? "element" : toType(value);
			if (!new RegExp(expectedTypes).test(valueType)) throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
		}
	}
};
// node_modules/bootstrap/js/dist/base-component.js
/*!
* Bootstrap base-component.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
/**
* --------------------------------------------------------------------------
* Bootstrap base-component.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
var VERSION = "6.0.0-alpha.2";
/**
* Class definition
*/
var BaseComponent = class extends Config {
	constructor(element, config) {
		super();
		element = getElement(element);
		if (!element) return;
		this._element = element;
		this._config = this._getConfig(config);
		const existingInstance = data_default.get(this._element, this.constructor.DATA_KEY);
		if (existingInstance) existingInstance.dispose();
		data_default.set(this._element, this.constructor.DATA_KEY, this);
	}
	dispose() {
		data_default.remove(this._element, this.constructor.DATA_KEY);
		EventHandler.off(this._element, this.constructor.EVENT_KEY);
		for (const propertyName of Object.getOwnPropertyNames(this)) this[propertyName] = null;
	}
	_queueCallback(callback, element, isAnimated = true) {
		return new Promise((resolve) => {
			executeAfterTransition(() => {
				if (this._element) callback();
				resolve();
			}, element, isAnimated);
		});
	}
	_getConfig(config) {
		config = this._mergeConfigObj(config, this._element);
		config = this._configAfterMerge(config);
		this._typeCheckConfig(config);
		return config;
	}
	static getInstance(element) {
		return data_default.get(getElement(element), this.DATA_KEY);
	}
	static getOrCreateInstance(element, config = {}) {
		return this.getInstance(element) || new this(element, typeof config === "object" ? config : null);
	}
	static get VERSION() {
		return VERSION;
	}
	static get DATA_KEY() {
		return `bs.${this.NAME}`;
	}
	static get EVENT_KEY() {
		return `.${this.DATA_KEY}`;
	}
	static eventName(name) {
		return `${name}${this.EVENT_KEY}`;
	}
};
// node_modules/bootstrap/js/dist/dom/selector-engine.js
/*!
* Bootstrap selector-engine.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
/**
* --------------------------------------------------------------------------
* Bootstrap dom/selector-engine.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
var getSelector = (element) => {
	let selector = element.getAttribute("data-bs-target");
	if (!selector || selector === "#") {
		let hrefAttribute = element.getAttribute("href");
		if (!hrefAttribute || !hrefAttribute.includes("#") && !hrefAttribute.startsWith(".")) return null;
		if (hrefAttribute.includes("#") && !hrefAttribute.startsWith("#")) hrefAttribute = `#${hrefAttribute.split("#")[1]}`;
		selector = hrefAttribute && hrefAttribute !== "#" ? hrefAttribute.trim() : null;
	}
	return selector ? selector.split(",").map((sel) => parseSelector(sel)).join(",") : null;
};
var SelectorEngine = {
	find(selector, element = document.documentElement) {
		return [...Element.prototype.querySelectorAll.call(element, selector)];
	},
	findOne(selector, element = document.documentElement) {
		return Element.prototype.querySelector.call(element, selector);
	},
	parents(element, selector) {
		const parents = [];
		let ancestor = element.parentNode.closest(selector);
		while (ancestor) {
			parents.push(ancestor);
			ancestor = ancestor.parentNode.closest(selector);
		}
		return parents;
	},
	closest(element, selector) {
		return Element.prototype.closest.call(element, selector);
	},
	prev(element, selector) {
		let previous = element.previousElementSibling;
		while (previous) {
			if (previous.matches(selector)) return [previous];
			previous = previous.previousElementSibling;
		}
		return [];
	},
	next(element, selector) {
		let next = element.nextElementSibling;
		while (next) {
			if (next.matches(selector)) return [next];
			next = next.nextElementSibling;
		}
		return [];
	},
	getSelectorFromElement(element) {
		const selector = getSelector(element);
		if (selector) return SelectorEngine.findOne(selector) ? selector : null;
		return null;
	},
	getElementFromSelector(element) {
		const selector = getSelector(element);
		return selector ? SelectorEngine.findOne(selector) : null;
	},
	getMultipleElementsFromSelector(element) {
		const selector = getSelector(element);
		return selector ? SelectorEngine.find(selector) : [];
	}
};
// node_modules/bootstrap/js/dist/util/component-functions.js
/*!
* Bootstrap component-functions.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
var enableDismissTrigger = (component, method = "hide") => {
	const clickEvent = `click.dismiss${component.EVENT_KEY}`;
	const name = component.NAME;
	const usesNativeDialog = name === "dialog" || name === "drawer";
	EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function(event) {
		if (["A", "AREA"].includes(this.tagName)) event.preventDefault();
		if (isDisabled(this)) return;
		const target = SelectorEngine.getElementFromSelector(this) || this.closest(`.${name}, [class*=":${name}"]`);
		if (!target || usesNativeDialog && !(target instanceof HTMLDialogElement)) return;
		component.getOrCreateInstance(target)[method]();
	});
};
var onDocumentReady = (eventName, callback) => {
	EventHandler.on(document, eventName, callback);
	if (document.readyState !== "loading") callback();
};
// node_modules/bootstrap/js/dist/button.js
/*!
* Bootstrap button.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
/**
* --------------------------------------------------------------------------
* Bootstrap button.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
var NAME$9 = "button";
var EVENT_KEY$9 = `.bs.button`;
var DATA_API_KEY$7 = ".data-api";
var CLASS_NAME_ACTIVE$2 = "active";
var SELECTOR_DATA_TOGGLE$7 = "[data-bs-toggle=\"button\"]";
var EVENT_CLICK_DATA_API$8 = `click${EVENT_KEY$9}${DATA_API_KEY$7}`;
var EVENT_DOM_CONTENT_LOADED = `DOMContentLoaded${EVENT_KEY$9}${DATA_API_KEY$7}`;
/**
* Class definition
*/
var Button = class extends BaseComponent {
	static get NAME() {
		return NAME$9;
	}
	toggle() {
		setAriaAttribute(this._element, "aria-pressed", this._element.classList.toggle(CLASS_NAME_ACTIVE$2));
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, EVENT_CLICK_DATA_API$8, SELECTOR_DATA_TOGGLE$7, (event) => {
	event.preventDefault();
	const button = event.target.closest(SELECTOR_DATA_TOGGLE$7);
	Button.getOrCreateInstance(button).toggle();
});
onDocumentReady(EVENT_DOM_CONTENT_LOADED, () => {
	for (const element of SelectorEngine.find(SELECTOR_DATA_TOGGLE$7)) if (!element.hasAttribute("aria-pressed")) setAriaAttribute(element, "aria-pressed", element.classList.contains(CLASS_NAME_ACTIVE$2));
});
// node_modules/bootstrap/js/dist/carousel.js
/*!
* Bootstrap carousel.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
/**
* --------------------------------------------------------------------------
* Bootstrap carousel.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
var NAME$8 = "carousel";
var EVENT_KEY$8 = `.bs.carousel`;
var DATA_API_KEY$6 = ".data-api";
var ARROW_LEFT_KEY$2 = "ArrowLeft";
var ARROW_RIGHT_KEY$2 = "ArrowRight";
var DIRECTION_LEFT = "left";
var DIRECTION_RIGHT = "right";
var EVENT_SLIDE = `slide${EVENT_KEY$8}`;
var EVENT_SLID = `slid${EVENT_KEY$8}`;
var EVENT_KEYDOWN$2 = `keydown${EVENT_KEY$8}`;
var EVENT_MOUSEENTER = `mouseenter${EVENT_KEY$8}`;
var EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY$8}`;
var EVENT_POINTERDOWN$2 = `pointerdown${EVENT_KEY$8}`;
var EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$8}${DATA_API_KEY$6}`;
var EVENT_CLICK_DATA_API$7 = `click${EVENT_KEY$8}${DATA_API_KEY$6}`;
var CLASS_NAME_CAROUSEL = "carousel";
var CLASS_NAME_ACTIVE$1 = "active";
var CLASS_NAME_FADE = "carousel-fade";
var CLASS_NAME_CENTER = "carousel-center";
var CLASS_NAME_AUTO = "carousel-auto";
var CLASS_NAME_CLONE = "carousel-item-clone";
var CLASS_NAME_PAUSED = "paused";
var CLASS_NAME_PLAYING = "carousel-playing";
var PROPERTY_INTERVAL = "--bs-carousel-interval";
var SCROLL_DURATION = 300;
var ACTIVE_RATIO_TOLERANCE = .05;
var SELECTOR_ACTIVE = ".active";
var SELECTOR_ITEM = `.carousel-item:not(.${CLASS_NAME_CLONE})`;
var SELECTOR_ACTIVE_ITEM = SELECTOR_ACTIVE + SELECTOR_ITEM;
var SELECTOR_INNER$1 = ".carousel-inner";
var SELECTOR_INDICATORS = ".carousel-indicators";
var SELECTOR_PLAY_PAUSE = ".carousel-control-play-pause";
var SELECTOR_DATA_SLIDE = "[data-bs-slide], [data-bs-slide-to]";
var SELECTOR_DATA_SLIDE_PREV = "[data-bs-slide=\"prev\"]";
var SELECTOR_DATA_SLIDE_NEXT = "[data-bs-slide=\"next\"]";
var SELECTOR_DATA_AUTOPLAY = "[data-bs-autoplay=\"true\"]";
var ENDS_STOP = "stop";
var ENDS_WRAP = "wrap";
var ENDS_LOOP = "loop";
var Default$7 = {
	autoplay: false,
	ends: ENDS_LOOP,
	interval: 5e3,
	keyboard: true,
	pause: "hover"
};
var DefaultType$7 = {
	autoplay: "boolean",
	ends: "string",
	interval: "number",
	keyboard: "boolean",
	pause: "(string|boolean)"
};
var easeInOutCubic = (progress) => progress < .5 ? 4 * progress * progress * progress : 1 - (-2 * progress + 2) ** 3 / 2;
/**
* Class definition
*/
var Carousel = class extends BaseComponent {
	constructor(element, config) {
		super(element, config);
		this._viewport = SelectorEngine.findOne(SELECTOR_INNER$1, this._element) || this._element;
		this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
		this._playPauseElement = SelectorEngine.findOne(SELECTOR_PLAY_PAUSE, this._element);
		this._prevControls = SelectorEngine.find(SELECTOR_DATA_SLIDE_PREV, this._element);
		this._nextControls = SelectorEngine.find(SELECTOR_DATA_SLIDE_NEXT, this._element);
		this._interval = null;
		this._observer = null;
		this._scrollFrame = null;
		this._looping = false;
		this._visibility = /* @__PURE__ */ new Map();
		this._playing = this._config.autoplay;
		this._activeIndex = this._initialActiveIndex();
		this._addEventListeners();
		this._observeItems();
		this._refreshActiveState();
		if (this._playing) this.cycle();
		this._updatePlayPauseControl();
	}
	static get Default() {
		return Default$7;
	}
	static get DefaultType() {
		return DefaultType$7;
	}
	static get NAME() {
		return NAME$8;
	}
	next() {
		this.to(this._navIndex() + 1);
	}
	nextWhenVisible() {
		if (document.visibilityState === "visible" && isVisible(this._element)) this.next();
	}
	prev() {
		this.to(this._navIndex() - 1);
	}
	pause() {
		this._clearInterval();
		this._element.classList.remove(CLASS_NAME_PLAYING);
	}
	cycle() {
		this._clearInterval();
		this._scheduleAutoplay();
		this._element.classList.add(CLASS_NAME_PLAYING);
	}
	to(index) {
		if (this._looping) return;
		const items = this._getItems();
		const rawIndex = Number.parseInt(index, 10);
		if (this._config.ends === ENDS_LOOP && !this._prefersReducedMotion() && this._canLoop()) {
			if (rawIndex > items.length - 1) {
				this._loopTransition(true);
				return;
			}
			if (rawIndex < 0) {
				this._loopTransition(false);
				return;
			}
		}
		const targetIndex = this._normalizeIndex(rawIndex, items.length);
		const currentIndex = this._navIndex();
		if (targetIndex === null || targetIndex === currentIndex) return;
		if (EventHandler.trigger(this._element, EVENT_SLIDE, {
			relatedTarget: items[targetIndex],
			direction: this._direction(currentIndex, targetIndex),
			from: currentIndex,
			to: targetIndex
		}).defaultPrevented) return;
		if (this._isFade()) {
			this._fadeTo(targetIndex);
			return;
		}
		this._scrollToIndex(targetIndex);
	}
	dispose() {
		this._clearInterval();
		if (this._observer) this._observer.disconnect();
		if (this._scrollFrame !== null) cancelAnimationFrame(this._scrollFrame);
		for (const clone of SelectorEngine.find(`.${CLASS_NAME_CLONE}`, this._viewport)) clone.remove();
		this._viewport.style.scrollSnapType = "";
		EventHandler.off(this._viewport, EVENT_KEY$8);
		super.dispose();
	}
	_configAfterMerge(config) {
		if (![
			ENDS_STOP,
			ENDS_WRAP,
			ENDS_LOOP
		].includes(config.ends)) config.ends = Default$7.ends;
		return config;
	}
	_initialActiveIndex() {
		const active = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
		const index = active ? this._getItems().indexOf(active) : 0;
		return Math.max(index, 0);
	}
	_addEventListeners() {
		if (this._config.keyboard) EventHandler.on(this._element, EVENT_KEYDOWN$2, (event) => this._keydown(event));
		if (this._config.pause === "hover") {
			EventHandler.on(this._element, EVENT_MOUSEENTER, () => this.pause());
			EventHandler.on(this._element, EVENT_MOUSELEAVE, () => this._maybeEnableCycle());
		}
		EventHandler.on(this._viewport, EVENT_POINTERDOWN$2, () => this._pauseFromInteraction());
	}
	_keydown(event) {
		if (/input|textarea/i.test(event.target.tagName)) return;
		const { key } = event;
		if (key !== ARROW_LEFT_KEY$2 && key !== ARROW_RIGHT_KEY$2) return;
		event.preventDefault();
		this._pauseFromInteraction();
		if (key === (isRTL$1() ? ARROW_LEFT_KEY$2 : ARROW_RIGHT_KEY$2)) this.next();
		else this.prev();
	}
	_observeItems() {
		if (this._isFade() || typeof IntersectionObserver === "undefined") return;
		this._observer = new IntersectionObserver((entries) => this._handleIntersection(entries), {
			root: this._viewport,
			threshold: [
				0,
				.25,
				.5,
				.75,
				1
			]
		});
		for (const item of this._getItems()) this._observer.observe(item);
	}
	_handleIntersection(entries) {
		if (this._looping) return;
		for (const entry of entries) this._visibility.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
		const ratios = this._getItems().map((item) => this._visibility.get(item) ?? 0);
		const maxRatio = Math.max(...ratios);
		let bestIndex = this._activeIndex;
		if (maxRatio > 0) bestIndex = ratios.findIndex((ratio) => ratio >= maxRatio - ACTIVE_RATIO_TOLERANCE);
		this._setActive(bestIndex);
		this._updateEndControls();
	}
	_navIndex() {
		if (this._isFade() || this._viewport.scrollWidth - this._viewport.clientWidth <= 0) return this._activeIndex;
		let index = this._activeIndex;
		let smallestDelta = Number.POSITIVE_INFINITY;
		for (const [itemIndex, item] of this._getItems().entries()) {
			const delta = Math.abs(this._scrollDelta(item));
			if (delta < smallestDelta) {
				smallestDelta = delta;
				index = itemIndex;
			}
		}
		return index;
	}
	_scrollToIndex(index) {
		const item = this._getItems()[index];
		if (!item) return;
		const left = this._scrollDelta(item);
		if (Math.abs(left) < 1) return;
		const targetLeft = this._viewport.scrollLeft + left;
		this._viewport.style.scrollSnapType = "none";
		this._animateScroll(targetLeft, () => {
			this._viewport.style.scrollSnapType = "";
			if (!this._observer) this._setActive(index);
			this._updateEndControls();
		});
	}
	_animateScroll(targetLeft, onComplete) {
		if (this._scrollFrame !== null) {
			cancelAnimationFrame(this._scrollFrame);
			this._scrollFrame = null;
		}
		const startLeft = this._viewport.scrollLeft;
		const distance = targetLeft - startLeft;
		if (this._prefersReducedMotion() || typeof requestAnimationFrame === "undefined") {
			this._viewport.scrollTo({
				left: targetLeft,
				behavior: "instant"
			});
			onComplete();
			return;
		}
		let startTime = null;
		const step = (now) => {
			if (startTime === null) startTime = now;
			const progress = Math.min((now - startTime) / SCROLL_DURATION, 1);
			this._viewport.scrollTo({
				left: startLeft + distance * easeInOutCubic(progress),
				behavior: "instant"
			});
			if (progress < 1) {
				this._scrollFrame = requestAnimationFrame(step);
				return;
			}
			this._viewport.scrollTo({
				left: targetLeft,
				behavior: "instant"
			});
			this._scrollFrame = null;
			onComplete();
		};
		this._scrollFrame = requestAnimationFrame(step);
	}
	_scrollDelta(element) {
		const viewportRect = this._viewport.getBoundingClientRect();
		const rect = element.getBoundingClientRect();
		if (this._element.classList.contains(CLASS_NAME_CENTER)) return rect.left + rect.width / 2 - (viewportRect.left + viewportRect.width / 2);
		const padStart = Number.parseFloat(getComputedStyle(this._viewport).scrollPaddingInlineStart) || 0;
		return isRTL$1() ? rect.right - (viewportRect.right - padStart) : rect.left - (viewportRect.left + padStart);
	}
	_loopTransition(isNext) {
		const items = this._getItems();
		const last = items.length - 1;
		const fromIndex = this._activeIndex;
		const toIndex = isNext ? 0 : last;
		const direction = this._loopDirection(isNext);
		if (EventHandler.trigger(this._element, EVENT_SLIDE, {
			relatedTarget: items[toIndex],
			direction,
			from: fromIndex,
			to: toIndex
		}).defaultPrevented) return;
		this._looping = true;
		const clone = (isNext ? items[0] : items[last]).cloneNode(true);
		clone.classList.add(CLASS_NAME_CLONE);
		clone.classList.remove(CLASS_NAME_ACTIVE$1);
		clone.removeAttribute("id");
		for (const node of SelectorEngine.find("[id]", clone)) node.removeAttribute("id");
		clone.setAttribute("aria-hidden", "true");
		clone.inert = true;
		this._viewport.style.scrollSnapType = "none";
		if (isNext) this._viewport.append(clone);
		else {
			this._viewport.prepend(clone);
			this._jumpScroll(this._scrollDelta(items[fromIndex]));
		}
		this._animateScroll(this._viewport.scrollLeft + this._scrollDelta(clone), () => {
			clone.remove();
			this._jumpScroll(this._scrollDelta(items[toIndex]));
			this._activeIndex = toIndex;
			this._refreshActiveState();
			EventHandler.trigger(this._element, EVENT_SLID, {
				relatedTarget: items[toIndex],
				direction,
				from: fromIndex,
				to: toIndex
			});
			this._viewport.style.scrollSnapType = "";
			this._looping = false;
		});
	}
	_loopDirection(isNext) {
		if (isRTL$1()) return isNext ? DIRECTION_RIGHT : DIRECTION_LEFT;
		return isNext ? DIRECTION_LEFT : DIRECTION_RIGHT;
	}
	_jumpScroll(delta) {
		this._viewport.style.scrollSnapType = "none";
		this._viewport.scrollBy({
			left: delta,
			top: 0,
			behavior: "instant"
		});
	}
	_fadeTo(index) {
		this._setActive(index);
	}
	_setActive(index) {
		const items = this._getItems();
		if (index === this._activeIndex || !items[index]) return;
		const from = this._activeIndex;
		this._activeIndex = index;
		this._refreshActiveState();
		EventHandler.trigger(this._element, EVENT_SLID, {
			relatedTarget: items[index],
			direction: this._direction(from, index),
			from,
			to: index
		});
	}
	_refreshActiveState() {
		const items = this._getItems();
		for (const [index, item] of items.entries()) item.classList.toggle(CLASS_NAME_ACTIVE$1, index === this._activeIndex);
		this._setActiveIndicatorElement(this._activeIndex);
		this._updateEndControls();
	}
	_updateEndControls() {
		if (this._config.ends !== ENDS_STOP) return;
		const viewport = this._viewport;
		const maxScroll = viewport.scrollWidth - viewport.clientWidth;
		let atStart;
		let atEnd;
		if (maxScroll > 0) {
			const progress = Math.abs(viewport.scrollLeft);
			atStart = progress <= 1;
			atEnd = progress >= maxScroll - 1;
		} else {
			const last = this._getItems().length - 1;
			atStart = this._activeIndex <= 0;
			atEnd = this._activeIndex >= last;
		}
		this._setControlsDisabled(this._prevControls, atStart);
		this._setControlsDisabled(this._nextControls, atEnd);
	}
	_setControlsDisabled(controls, disabled) {
		for (const control of controls) {
			if (disabled && control === document.activeElement) {
				((controls === this._prevControls ? this._nextControls : this._prevControls)[0] ?? this._viewport).focus({ preventScroll: true });
				if (document.activeElement === control) control.blur();
			}
			control.disabled = disabled;
		}
	}
	_setActiveIndicatorElement(index) {
		if (!this._indicatorsElement) return;
		const active = SelectorEngine.findOne(SELECTOR_ACTIVE, this._indicatorsElement);
		if (active) {
			active.classList.remove(CLASS_NAME_ACTIVE$1);
			active.removeAttribute("aria-current");
		}
		const newActive = SelectorEngine.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement);
		if (newActive) {
			newActive.classList.add(CLASS_NAME_ACTIVE$1);
			newActive.setAttribute("aria-current", "true");
		}
	}
	_normalizeIndex(index, length) {
		if (Number.isNaN(index) || length === 0) return null;
		if (index < 0) return this._wrapsAround() ? length - 1 : null;
		if (index > length - 1) return this._wrapsAround() ? 0 : null;
		return index;
	}
	_wrapsAround() {
		return this._config.ends === ENDS_WRAP || this._config.ends === ENDS_LOOP;
	}
	_canLoop() {
		if (this._isFade() || this._getItems().length < 2) return false;
		const styles = getComputedStyle(this._element);
		const num = (name) => Number.parseFloat(styles.getPropertyValue(name)) || 0;
		return (num("--bs-carousel-items") || 1) === 1 && num("--bs-carousel-items-peek") === 0 && !this._element.classList.contains(CLASS_NAME_CENTER) && !this._element.classList.contains(CLASS_NAME_AUTO);
	}
	_direction(from, to) {
		const isNext = to > from;
		if (isRTL$1()) return isNext ? DIRECTION_RIGHT : DIRECTION_LEFT;
		return isNext ? DIRECTION_LEFT : DIRECTION_RIGHT;
	}
	_scheduleAutoplay(index = this._activeIndex) {
		const interval = this._itemInterval(index);
		this._element.style.setProperty(PROPERTY_INTERVAL, `${interval}ms`);
		this._interval = setTimeout(() => {
			const upcoming = this._upcomingIndex();
			this.nextWhenVisible();
			if (upcoming === null) {
				this.pause();
				return;
			}
			this._scheduleAutoplay(upcoming);
		}, interval);
	}
	_upcomingIndex() {
		return this._normalizeIndex(this._navIndex() + 1, this._getItems().length);
	}
	_itemInterval(index = this._activeIndex) {
		const item = this._getItems()[index];
		const interval = item ? Number.parseInt(item.getAttribute("data-bs-interval"), 10) : NaN;
		return Number.isNaN(interval) ? this._config.interval : interval;
	}
	_maybeEnableCycle() {
		if (!this._playing) return;
		this.cycle();
	}
	_pauseFromInteraction() {
		this._playing = false;
		this.pause();
		this._updatePlayPauseControl();
	}
	_togglePlayPause() {
		if (this._playing) {
			this._pauseFromInteraction();
			return;
		}
		this._playing = true;
		this.cycle();
		this._updatePlayPauseControl();
	}
	_updatePlayPauseControl() {
		if (!this._playPauseElement) return;
		this._playPauseElement.classList.toggle(CLASS_NAME_PAUSED, !this._playing);
		const label = this._playPauseElement.getAttribute(this._playing ? "data-bs-pause-label" : "data-bs-play-label");
		if (label) this._playPauseElement.setAttribute("aria-label", label);
	}
	_isFade() {
		return this._element.classList.contains(CLASS_NAME_FADE);
	}
	_prefersReducedMotion() {
		return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	}
	_getItems() {
		return SelectorEngine.find(SELECTOR_ITEM, this._element);
	}
	_clearInterval() {
		if (this._interval) {
			clearTimeout(this._interval);
			this._interval = null;
		}
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, EVENT_CLICK_DATA_API$7, SELECTOR_DATA_SLIDE, function(event) {
	const target = SelectorEngine.getElementFromSelector(this);
	if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) return;
	event.preventDefault();
	const carousel = Carousel.getOrCreateInstance(target);
	carousel._pauseFromInteraction();
	const slideIndex = this.getAttribute("data-bs-slide-to");
	if (slideIndex) {
		carousel.to(slideIndex);
		return;
	}
	if (Manipulator.getDataAttribute(this, "slide") === "next") {
		carousel.next();
		return;
	}
	carousel.prev();
});
EventHandler.on(document, EVENT_CLICK_DATA_API$7, SELECTOR_PLAY_PAUSE, function(event) {
	const target = SelectorEngine.getElementFromSelector(this);
	if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) return;
	event.preventDefault();
	Carousel.getOrCreateInstance(target)._togglePlayPause();
});
EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
	const carousels = SelectorEngine.find(SELECTOR_DATA_AUTOPLAY);
	for (const carousel of carousels) Carousel.getOrCreateInstance(carousel);
});
// node_modules/bootstrap/js/dist/util/hash-target.js
/*!
* Bootstrap hash-target.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
/**
* Decode a URL fragment id, tolerating malformed escapes (returns it as-is).
*/
var decodeFragment = (value) => {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
};
/**
* Resolve the element named by `location.hash` when it opts in with `data-bs-hash`.
*/
var getHashTarget = () => {
	const { hash } = window.location;
	if (!hash || hash === "#") return null;
	const id = decodeFragment(hash.slice(1));
	if (!id) return null;
	const element = document.getElementById(id);
	if (!element?.hasAttribute("data-bs-hash")) return null;
	return element;
};
/**
* Open an opted-in hash target on `load` and `hashchange`.
* Put `data-bs-hash` on the collapse or tab pane that the URL fragment names.
*
* Scrolls a visible anchor first when one exists, then opens the target, then
* scrolls the target into view after it is shown.
*/
var enableHashTarget = (namespace, handler) => {
	let generation = 0;
	const onHash = () => {
		const current = ++generation;
		const element = getHashTarget();
		if (!element || !handler.matches(element)) return;
		const anchor = handler.getAnchor?.(element);
		if (anchor) anchor.scrollIntoView();
		handler.open(element, () => {
			if (current === generation && element.isConnected && getHashTarget() === element) element.scrollIntoView();
		});
	};
	EventHandler.on(window, `load${namespace}`, onHash);
	EventHandler.on(window, `hashchange${namespace}`, onHash);
	if (document.readyState === "complete") onHash();
};
// node_modules/bootstrap/js/dist/collapse.js
/*!
* Bootstrap collapse.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
/**
* --------------------------------------------------------------------------
* Bootstrap collapse.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
var NAME$7 = "collapse";
var EVENT_KEY$7 = `.bs.collapse`;
var DATA_API_KEY$5 = ".data-api";
var EVENT_SHOW$3 = `show${EVENT_KEY$7}`;
var EVENT_SHOWN$3 = `shown${EVENT_KEY$7}`;
var EVENT_HIDE$3 = `hide${EVENT_KEY$7}`;
var EVENT_HIDDEN$3 = `hidden${EVENT_KEY$7}`;
var EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$7}${DATA_API_KEY$5}`;
var CLASS_NAME_SHOW$3 = "show";
var CLASS_NAME_COLLAPSE = "collapse";
var CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
var SELECTOR_ACTIVES = ".collapse.show";
var SELECTOR_DATA_TOGGLE$6 = "[data-bs-toggle=\"collapse\"]";
var Default$6 = { parent: null };
var DefaultType$6 = { parent: "(null|element)" };
/**
* Class definition
*/
var Collapse = class Collapse extends BaseComponent {
	constructor(element, config) {
		super(element, config);
		this._isTransitioning = false;
		this._triggerArray = [];
		const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$6);
		for (const elem of toggleList) {
			const selector = SelectorEngine.getSelectorFromElement(elem);
			const filterElement = SelectorEngine.find(selector).filter((foundElement) => foundElement === this._element);
			if (selector !== null && filterElement.length) this._triggerArray.push(elem);
		}
		this._initializeChildren();
		if (!this._config.parent) this._setAriaExpanded(this._triggerArray, this._isShown());
	}
	static get Default() {
		return Default$6;
	}
	static get DefaultType() {
		return DefaultType$6;
	}
	static get NAME() {
		return NAME$7;
	}
	toggle() {
		return this._isShown() ? this.hide() : this.show();
	}
	async show() {
		if (this._isTransitioning || this._isShown()) return;
		let activeChildren = [];
		if (this._config.parent) activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES).filter((element) => element !== this._element && !this._sharesTrigger(element)).map((element) => Collapse.getOrCreateInstance(element));
		if (activeChildren.length && activeChildren[0]._isTransitioning) return;
		if (EventHandler.trigger(this._element, EVENT_SHOW$3).defaultPrevented) return;
		for (const activeInstance of activeChildren) activeInstance.hide();
		this._element.classList.add(CLASS_NAME_SHOW$3);
		this._setAriaExpanded(this._triggerArray, true);
		this._isTransitioning = true;
		const complete = () => {
			this._isTransitioning = false;
			EventHandler.trigger(this._element, EVENT_SHOWN$3);
		};
		await this._queueCallback(complete, this._element, this._isAnimated());
	}
	async hide() {
		if (this._isTransitioning || !this._isShown()) return;
		if (EventHandler.trigger(this._element, EVENT_HIDE$3).defaultPrevented) return;
		this._element.classList.remove(CLASS_NAME_SHOW$3);
		for (const trigger of this._triggerArray) {
			const element = SelectorEngine.getElementFromSelector(trigger);
			if (element && !this._isShown(element)) this._setAriaExpanded([trigger], false);
		}
		this._isTransitioning = true;
		const complete = () => {
			this._isTransitioning = false;
			EventHandler.trigger(this._element, EVENT_HIDDEN$3);
		};
		await this._queueCallback(complete, this._element, this._isAnimated());
	}
	_isShown(element = this._element) {
		return element.classList.contains(CLASS_NAME_SHOW$3);
	}
	_isAnimated() {
		return getTransitionDurationFromElement(this._element) > 0;
	}
	_sharesTrigger(element) {
		return this._triggerArray.some((trigger) => SelectorEngine.getMultipleElementsFromSelector(trigger).includes(element));
	}
	_configAfterMerge(config) {
		config.parent = getElement(config.parent);
		return config;
	}
	_initializeChildren() {
		if (!this._config.parent) return;
		const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE$6);
		for (const element of children) {
			const selected = SelectorEngine.getElementFromSelector(element);
			if (selected) this._setAriaExpanded([element], this._isShown(selected));
		}
	}
	_getFirstLevelChildren(selector) {
		const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
		return SelectorEngine.find(selector, this._config.parent).filter((element) => !children.includes(element));
	}
	_setAriaExpanded(triggerArray, isOpen) {
		if (!triggerArray.length) return;
		for (const element of triggerArray) setAriaAttribute(element, "aria-expanded", isOpen);
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$6, function(event) {
	if (event.target.tagName === "A" || event.delegateTarget && event.delegateTarget.tagName === "A") event.preventDefault();
	for (const element of SelectorEngine.getMultipleElementsFromSelector(this)) Collapse.getOrCreateInstance(element).toggle();
});
/**
* Find a trigger that targets this collapse.
*/
var getCollapseTrigger = (collapseEl) => {
	for (const trigger of SelectorEngine.find(SELECTOR_DATA_TOGGLE$6)) if (SelectorEngine.getMultipleElementsFromSelector(trigger).includes(collapseEl)) return trigger;
	return null;
};
/**
* Open opted-in collapses when the URL fragment matches their id.
* Put `data-bs-hash` on the collapsible target.
*/
enableHashTarget(`${EVENT_KEY$7}${DATA_API_KEY$5}`, {
	matches: (element) => element.classList.contains(CLASS_NAME_COLLAPSE),
	getAnchor: getCollapseTrigger,
	async open(element, done) {
		if (element.classList.contains(CLASS_NAME_SHOW$3)) {
			done();
			return;
		}
		await Collapse.getOrCreateInstance(element).show();
		if (element.classList.contains(CLASS_NAME_SHOW$3)) done();
	}
});
// node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
var min = Math.min;
var max = Math.max;
var round = Math.round;
var floor = Math.floor;
var createCoords = (v) => ({
	x: v,
	y: v
});
var oppositeSideMap = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function clamp(start, value, end) {
	return max(start, min(value, end));
}
function evaluate(value, param) {
	return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
	return placement.split("-")[0];
}
function getAlignment(placement) {
	return placement.split("-")[1];
}
function getOppositeAxis(axis) {
	return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
	return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
	const firstChar = placement[0];
	return firstChar === "t" || firstChar === "b" ? "y" : "x";
}
function getAlignmentAxis(placement) {
	return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
	if (rtl === void 0) rtl = false;
	const alignment = getAlignment(placement);
	const alignmentAxis = getAlignmentAxis(placement);
	const length = getAxisLength(alignmentAxis);
	let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
	if (rects.reference[length] > rects.floating[length]) mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
	return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
	const oppositePlacement = getOppositePlacement(placement);
	return [
		getOppositeAlignmentPlacement(placement),
		oppositePlacement,
		getOppositeAlignmentPlacement(oppositePlacement)
	];
}
function getOppositeAlignmentPlacement(placement) {
	return placement.includes("start") ? placement.replace("start", "end") : placement.replace("end", "start");
}
var lrPlacement = ["left", "right"];
var rlPlacement = ["right", "left"];
var tbPlacement = ["top", "bottom"];
var btPlacement = ["bottom", "top"];
function getSideList(side, isStart, rtl) {
	switch (side) {
		case "top":
		case "bottom":
			if (rtl) return isStart ? rlPlacement : lrPlacement;
			return isStart ? lrPlacement : rlPlacement;
		case "left":
		case "right": return isStart ? tbPlacement : btPlacement;
		default: return [];
	}
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
	const alignment = getAlignment(placement);
	let list = getSideList(getSide(placement), direction === "start", rtl);
	if (alignment) {
		list = list.map((side) => side + "-" + alignment);
		if (flipAlignment) list = list.concat(list.map(getOppositeAlignmentPlacement));
	}
	return list;
}
function getOppositePlacement(placement) {
	const side = getSide(placement);
	return oppositeSideMap[side] + placement.slice(side.length);
}
function expandPaddingObject(padding) {
	var _padding$top, _padding$right, _padding$bottom, _padding$left;
	return {
		top: (_padding$top = padding.top) != null ? _padding$top : 0,
		right: (_padding$right = padding.right) != null ? _padding$right : 0,
		bottom: (_padding$bottom = padding.bottom) != null ? _padding$bottom : 0,
		left: (_padding$left = padding.left) != null ? _padding$left : 0
	};
}
function getPaddingObject(padding) {
	return typeof padding !== "number" ? expandPaddingObject(padding) : {
		top: padding,
		right: padding,
		bottom: padding,
		left: padding
	};
}
function rectToClientRect(rect) {
	const { x, y, width, height } = rect;
	return {
		width,
		height,
		top: y,
		left: x,
		right: x + width,
		bottom: y + height,
		x,
		y
	};
}
// node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function computeCoordsFromPlacement(_ref, placement, rtl) {
	let { reference, floating } = _ref;
	const sideAxis = getSideAxis(placement);
	const alignmentAxis = getAlignmentAxis(placement);
	const alignLength = getAxisLength(alignmentAxis);
	const side = getSide(placement);
	const isVertical = sideAxis === "y";
	const commonX = reference.x + reference.width / 2 - floating.width / 2;
	const commonY = reference.y + reference.height / 2 - floating.height / 2;
	const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
	let coords;
	switch (side) {
		case "top":
			coords = {
				x: commonX,
				y: reference.y - floating.height
			};
			break;
		case "bottom":
			coords = {
				x: commonX,
				y: reference.y + reference.height
			};
			break;
		case "right":
			coords = {
				x: reference.x + reference.width,
				y: commonY
			};
			break;
		case "left":
			coords = {
				x: reference.x - floating.width,
				y: commonY
			};
			break;
		default: coords = {
			x: reference.x,
			y: reference.y
		};
	}
	const alignment = getAlignment(placement);
	if (alignment) coords[alignmentAxis] += commonAlign * (alignment === "end" ? 1 : -1) * (rtl && isVertical ? -1 : 1);
	return coords;
}
/**
* Resolves with an object of overflow side offsets that determine how much the
* element is overflowing a given clipping boundary on each side.
* - positive = overflowing the boundary by that number of pixels
* - negative = how many pixels left before it will overflow
* - 0 = lies flush with the boundary
* @see https://floating-ui.com/docs/detectOverflow
*/
async function detectOverflow(state, options) {
	var _await$platform$isEle;
	if (options === void 0) options = {};
	const { x, y, platform, rects, elements, strategy } = state;
	const { boundary = "clippingAncestors", rootBoundary = "viewport", elementContext = "floating", altBoundary = false, padding = 0 } = evaluate(options, state);
	const paddingObject = getPaddingObject(padding);
	const element = elements[altBoundary ? elementContext === "floating" ? "reference" : "floating" : elementContext];
	const clippingClientRect = rectToClientRect(await platform.getClippingRect({
		element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating)),
		boundary,
		rootBoundary,
		strategy
	}));
	const rect = elementContext === "floating" ? {
		x,
		y,
		width: rects.floating.width,
		height: rects.floating.height
	} : rects.reference;
	const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
	const offsetScale = await (platform.isElement == null ? void 0 : platform.isElement(offsetParent)) && await (platform.getScale == null ? void 0 : platform.getScale(offsetParent)) || {
		x: 1,
		y: 1
	};
	const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
		elements,
		rect,
		offsetParent,
		strategy
	}) : rect);
	return {
		top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
		bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
		left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
		right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
	};
}
var MAX_RESET_COUNT = 50;
/**
* Computes the `x` and `y` coordinates that will place the floating element
* next to a given reference element.
*
* This export does not have any `platform` interface logic. You will need to
* write one for the platform you are using Floating UI with.
*/
var computePosition$1 = async (reference, floating, config) => {
	const { placement = "bottom", strategy = "absolute", middleware = [], platform } = config;
	const platformWithDetectOverflow = platform.detectOverflow ? platform : {
		...platform,
		detectOverflow
	};
	const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
	let rects = await platform.getElementRects({
		reference,
		floating,
		strategy
	});
	let { x, y } = computeCoordsFromPlacement(rects, placement, rtl);
	let statefulPlacement = placement;
	let resetCount = 0;
	const middlewareData = {};
	for (let i = 0; i < middleware.length; i++) {
		const currentMiddleware = middleware[i];
		if (!currentMiddleware) continue;
		const { name, fn } = currentMiddleware;
		const { x: nextX, y: nextY, data, reset } = await fn({
			x,
			y,
			initialPlacement: placement,
			placement: statefulPlacement,
			strategy,
			middlewareData,
			rects,
			platform: platformWithDetectOverflow,
			elements: {
				reference,
				floating
			}
		});
		x = nextX != null ? nextX : x;
		y = nextY != null ? nextY : y;
		middlewareData[name] = {
			...middlewareData[name],
			...data
		};
		if (reset && resetCount < MAX_RESET_COUNT) {
			resetCount++;
			if (typeof reset === "object") {
				if (reset.placement) statefulPlacement = reset.placement;
				if (reset.rects) rects = reset.rects === true ? await platform.getElementRects({
					reference,
					floating,
					strategy
				}) : reset.rects;
				({x, y} = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
			}
			i = -1;
		}
	}
	return {
		x,
		y,
		placement: statefulPlacement,
		strategy,
		middlewareData
	};
};
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
var flip$1 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "flip",
		options,
		async fn(state) {
			var _middlewareData$arrow, _middlewareData$flip;
			const { placement, middlewareData, rects, initialPlacement, platform, elements } = state;
			const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true, fallbackPlacements: specifiedFallbackPlacements, fallbackStrategy = "bestFit", fallbackAxisSideDirection = "none", flipAlignment = true, ...detectOverflowOptions } = evaluate(options, state);
			if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) return {};
			const side = getSide(placement);
			const initialSideAxis = getSideAxis(initialPlacement);
			const isBasePlacement = getSide(initialPlacement) === initialPlacement;
			const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
			const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
			const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
			if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
			const placements = [initialPlacement, ...fallbackPlacements];
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const overflows = [];
			let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
			if (checkMainAxis) overflows.push(overflow[side]);
			if (checkCrossAxis) {
				const sides = getAlignmentSides(placement, rects, rtl);
				overflows.push(overflow[sides[0]], overflow[sides[1]]);
			}
			overflowsData = [...overflowsData, {
				placement,
				overflows
			}];
			if (!overflows.every((side) => side <= 0)) {
				var _middlewareData$flip2, _overflowsData$filter;
				const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
				const nextPlacement = placements[nextIndex];
				if (nextPlacement) {
					if (!(checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false) || overflowsData.every((d) => getSideAxis(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) return {
						data: {
							index: nextIndex,
							overflows: overflowsData
						},
						reset: { placement: nextPlacement }
					};
				}
				let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
				if (!resetPlacement) switch (fallbackStrategy) {
					case "bestFit": {
						var _overflowsData$filter2;
						const placement = (_overflowsData$filter2 = overflowsData.filter((d) => {
							if (hasFallbackAxisSideDirection) {
								const currentSideAxis = getSideAxis(d.placement);
								return currentSideAxis === initialSideAxis || currentSideAxis === "y";
							}
							return true;
						}).map((d) => [d.placement, d.overflows.filter((overflow) => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
						if (placement) resetPlacement = placement;
						break;
					}
					case "initialPlacement": resetPlacement = initialPlacement;
				}
				if (placement !== resetPlacement) return { reset: { placement: resetPlacement } };
			}
			return {};
		}
	};
};
var originSides = /*#__PURE__*/ new Set(["left", "top"]);
async function convertValueToCoords(state, options) {
	const { placement, platform, elements } = state;
	const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
	const side = getSide(placement);
	const alignment = getAlignment(placement);
	const isVertical = getSideAxis(placement) === "y";
	const mainAxisMulti = originSides.has(side) ? -1 : 1;
	const crossAxisMulti = rtl && isVertical ? -1 : 1;
	const rawValue = evaluate(options, state);
	let { mainAxis, crossAxis, alignmentAxis } = typeof rawValue === "number" ? {
		mainAxis: rawValue,
		crossAxis: 0,
		alignmentAxis: null
	} : {
		mainAxis: rawValue.mainAxis || 0,
		crossAxis: rawValue.crossAxis || 0,
		alignmentAxis: rawValue.alignmentAxis
	};
	if (alignment && typeof alignmentAxis === "number") crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
	return isVertical ? {
		x: crossAxis * crossAxisMulti,
		y: mainAxis * mainAxisMulti
	} : {
		x: mainAxis * mainAxisMulti,
		y: crossAxis * crossAxisMulti
	};
}
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
var offset$1 = function(options) {
	if (options === void 0) options = 0;
	return {
		name: "offset",
		options,
		async fn(state) {
			var _middlewareData$offse, _middlewareData$arrow;
			const { x, y, placement, middlewareData } = state;
			const diffCoords = await convertValueToCoords(state, options);
			if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) return {};
			return {
				x: x + diffCoords.x,
				y: y + diffCoords.y,
				data: {
					...diffCoords,
					placement
				}
			};
		}
	};
};
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
var shift$1 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "shift",
		options,
		async fn(state) {
			const { x, y, placement, platform } = state;
			const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = false, limiter = { fn: (_ref) => {
				let { x, y } = _ref;
				return {
					x,
					y
				};
			} }, ...detectOverflowOptions } = evaluate(options, state);
			const coords = {
				x,
				y
			};
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const crossAxis = getSideAxis(placement);
			const mainAxis = getOppositeAxis(crossAxis);
			let mainAxisCoord = coords[mainAxis];
			let crossAxisCoord = coords[crossAxis];
			const clampCoord = (axis, coord) => clamp(coord + overflow[axis === "y" ? "top" : "left"], coord, coord - overflow[axis === "y" ? "bottom" : "right"]);
			if (checkMainAxis) mainAxisCoord = clampCoord(mainAxis, mainAxisCoord);
			if (checkCrossAxis) crossAxisCoord = clampCoord(crossAxis, crossAxisCoord);
			const limitedCoords = limiter.fn({
				...state,
				[mainAxis]: mainAxisCoord,
				[crossAxis]: crossAxisCoord
			});
			return {
				...limitedCoords,
				data: {
					x: limitedCoords.x - x,
					y: limitedCoords.y - y,
					enabled: {
						[mainAxis]: checkMainAxis,
						[crossAxis]: checkCrossAxis
					}
				}
			};
		}
	};
};
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
var size$1 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "size",
		options,
		async fn(state) {
			const { placement, rects, platform, elements } = state;
			const { apply = () => {}, ...detectOverflowOptions } = evaluate(options, state);
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const side = getSide(placement);
			const alignment = getAlignment(placement);
			const isYAxis = getSideAxis(placement) === "y";
			const { width, height } = rects.floating;
			let heightSide;
			let widthSide;
			if (side === "top" || side === "bottom") {
				heightSide = side;
				widthSide = alignment === (await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
			} else {
				widthSide = side;
				heightSide = alignment === "end" ? "top" : "bottom";
			}
			const maximumClippingHeight = height - overflow.top - overflow.bottom;
			const maximumClippingWidth = width - overflow.left - overflow.right;
			const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
			const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
			const shiftData = state.middlewareData.shift;
			const noShift = !shiftData;
			let availableHeight = overflowAvailableHeight;
			let availableWidth = overflowAvailableWidth;
			if (shiftData != null && shiftData.enabled.x) availableWidth = maximumClippingWidth;
			if (shiftData != null && shiftData.enabled.y) availableHeight = maximumClippingHeight;
			if (noShift && !alignment) {
				if (isYAxis) availableWidth = width - 2 * max(overflow.left, overflow.right);
				else availableHeight = height - 2 * max(overflow.top, overflow.bottom);
			}
			await apply({
				...state,
				availableWidth,
				availableHeight
			});
			const nextDimensions = await platform.getDimensions(elements.floating);
			if (width !== nextDimensions.width || height !== nextDimensions.height) return { reset: { rects: true } };
			return {};
		}
	};
};
// node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function hasWindow() {
	return typeof window !== "undefined";
}
function getNodeName(node) {
	if (isNode(node)) return (node.nodeName || "").toLowerCase();
	return "#document";
}
function getWindow(node) {
	var _node$ownerDocument;
	return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
	var _ref;
	return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
	if (!hasWindow()) return false;
	return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
	if (!hasWindow()) return false;
	return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
	if (!hasWindow()) return false;
	return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
	if (!hasWindow() || typeof ShadowRoot === "undefined") return false;
	return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
	const { overflow, overflowX, overflowY, display } = getComputedStyle$1(element);
	return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== "inline" && display !== "contents";
}
function isTableElement(element) {
	return /^(table|td|th)$/.test(getNodeName(element));
}
function isTopLayer(element) {
	try {
		if (element.matches(":popover-open")) return true;
	} catch (_e) {}
	try {
		return element.matches(":modal");
	} catch (_e) {
		return false;
	}
}
var willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
var containRe = /paint|layout|strict|content/;
var isNotNone = (value) => !!value && value !== "none";
var isWebKitValue;
function isContainingBlock(elementOrCss) {
	const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
	return isNotNone(css.transform) || isNotNone(css.translate) || isNotNone(css.scale) || isNotNone(css.rotate) || isNotNone(css.perspective) || !isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter)) || willChangeRe.test(css.willChange || "") || containRe.test(css.contain || "");
}
function getContainingBlock(element) {
	let currentNode = getParentNode(element);
	while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
		if (isContainingBlock(currentNode)) return currentNode;
		else if (isTopLayer(currentNode)) return null;
		currentNode = getParentNode(currentNode);
	}
	return null;
}
function isWebKit() {
	if (isWebKitValue == null) isWebKitValue = typeof CSS !== "undefined" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none");
	return isWebKitValue;
}
function isLastTraversableNode(node) {
	return /^(html|body|#document)$/.test(getNodeName(node));
}
function getComputedStyle$1(element) {
	return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
	if (isElement(element)) return {
		scrollLeft: element.scrollLeft,
		scrollTop: element.scrollTop
	};
	return {
		scrollLeft: element.scrollX,
		scrollTop: element.scrollY
	};
}
function getParentNode(node) {
	if (getNodeName(node) === "html") return node;
	const result = node.assignedSlot || node.parentNode || isShadowRoot(node) && node.host || getDocumentElement(node);
	return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
	const parentNode = getParentNode(node);
	if (isLastTraversableNode(parentNode)) return (node.ownerDocument || node).body;
	if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) return parentNode;
	return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
	var _node$ownerDocument2;
	if (list === void 0) list = [];
	if (traverseIframes === void 0) traverseIframes = true;
	const scrollableAncestor = getNearestOverflowAncestor(node);
	const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
	const win = getWindow(scrollableAncestor);
	if (isBody) {
		const frameElement = getFrameElement(win);
		return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
	} else return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
	return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
// node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function getCssDimensions(element) {
	const css = getComputedStyle$1(element);
	let width = parseFloat(css.width) || 0;
	let height = parseFloat(css.height) || 0;
	const hasOffset = isHTMLElement(element);
	const offsetWidth = hasOffset ? element.offsetWidth : width;
	const offsetHeight = hasOffset ? element.offsetHeight : height;
	const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
	if (shouldFallback) {
		width = offsetWidth;
		height = offsetHeight;
	}
	return {
		width,
		height,
		$: shouldFallback
	};
}
function unwrapElement(element) {
	return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
	const domElement = unwrapElement(element);
	if (!isHTMLElement(domElement)) return createCoords(1);
	const rect = domElement.getBoundingClientRect();
	const { width, height, $ } = getCssDimensions(domElement);
	let x = ($ ? round(rect.width) : rect.width) / width;
	let y = ($ ? round(rect.height) : rect.height) / height;
	if (!x || !Number.isFinite(x)) x = 1;
	if (!y || !Number.isFinite(y)) y = 1;
	return {
		x,
		y
	};
}
var noOffsets = /*#__PURE__*/ createCoords(0);
function getVisualOffsets(element) {
	const win = getWindow(element);
	if (!isWebKit() || !win.visualViewport) return noOffsets;
	return {
		x: win.visualViewport.offsetLeft,
		y: win.visualViewport.offsetTop
	};
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
	if (isFixed === void 0) isFixed = false;
	return !!floatingOffsetParent && isFixed && floatingOffsetParent === getWindow(element);
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
	if (includeScale === void 0) includeScale = false;
	if (isFixedStrategy === void 0) isFixedStrategy = false;
	const clientRect = element.getBoundingClientRect();
	const domElement = unwrapElement(element);
	let scale = createCoords(1);
	if (includeScale) {
		if (offsetParent) {
			if (isElement(offsetParent)) scale = getScale(offsetParent);
		} else scale = getScale(element);
	}
	const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
	let x = (clientRect.left + visualOffsets.x) / scale.x;
	let y = (clientRect.top + visualOffsets.y) / scale.y;
	let width = clientRect.width / scale.x;
	let height = clientRect.height / scale.y;
	if (domElement && offsetParent) {
		const win = getWindow(domElement);
		const offsetWin = isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
		let currentWin = win;
		let currentIFrame = getFrameElement(currentWin);
		while (currentIFrame && offsetWin !== currentWin) {
			const iframeScale = getScale(currentIFrame);
			const iframeRect = currentIFrame.getBoundingClientRect();
			const css = getComputedStyle$1(currentIFrame);
			const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
			const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
			x *= iframeScale.x;
			y *= iframeScale.y;
			width *= iframeScale.x;
			height *= iframeScale.y;
			x += left;
			y += top;
			currentWin = getWindow(currentIFrame);
			currentIFrame = getFrameElement(currentWin);
		}
	}
	return rectToClientRect({
		width,
		height,
		x,
		y
	});
}
function getWindowScrollBarX(element, rect) {
	const leftScroll = getNodeScroll(element).scrollLeft;
	if (!rect) return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
	return rect.left + leftScroll;
}
function getHTMLOffset(documentElement, scroll) {
	const htmlRect = documentElement.getBoundingClientRect();
	return {
		x: htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect),
		y: htmlRect.top + scroll.scrollTop
	};
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
	let { elements, rect, offsetParent, strategy } = _ref;
	const isFixed = strategy === "fixed";
	const documentElement = getDocumentElement(offsetParent);
	const topLayer = elements ? isTopLayer(elements.floating) : false;
	if (offsetParent === documentElement || topLayer && isFixed) return rect;
	let scroll = {
		scrollLeft: 0,
		scrollTop: 0
	};
	let scale = createCoords(1);
	const offsets = createCoords(0);
	const isOffsetParentAnElement = isHTMLElement(offsetParent);
	if (isOffsetParentAnElement || !isFixed) {
		if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) scroll = getNodeScroll(offsetParent);
		if (isOffsetParentAnElement) {
			const offsetRect = getBoundingClientRect(offsetParent);
			scale = getScale(offsetParent);
			offsets.x = offsetRect.x + offsetParent.clientLeft;
			offsets.y = offsetRect.y + offsetParent.clientTop;
		}
	}
	const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
	return {
		width: rect.width * scale.x,
		height: rect.height * scale.y,
		x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
		y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
	};
}
function getClientRects(element) {
	return element.getClientRects ? Array.from(element.getClientRects()) : [];
}
function getDocumentRect(html) {
	const scroll = getNodeScroll(html);
	const body = html.ownerDocument.body;
	const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
	const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
	let x = -scroll.scrollLeft + getWindowScrollBarX(html);
	const y = -scroll.scrollTop;
	if (getComputedStyle$1(body).direction === "rtl") x += max(html.clientWidth, body.clientWidth) - width;
	return {
		width,
		height,
		x,
		y
	};
}
var SCROLLBAR_MAX = 25;
function getViewportRect(element, strategy, rootBoundary) {
	if (rootBoundary === void 0) rootBoundary = "viewport";
	const isLayoutViewport = rootBoundary === "layoutViewport";
	const win = getWindow(element);
	const html = getDocumentElement(element);
	const visualViewport = win.visualViewport;
	let width = html.clientWidth;
	let height = html.clientHeight;
	let x = 0;
	let y = 0;
	if (visualViewport) {
		const layoutRelativeClientCoords = !isWebKit() || strategy === "fixed";
		if (isLayoutViewport) {
			if (!layoutRelativeClientCoords) {
				x = -visualViewport.offsetLeft;
				y = -visualViewport.offsetTop;
			}
		} else {
			width = visualViewport.width;
			height = visualViewport.height;
			if (layoutRelativeClientCoords) {
				x = visualViewport.offsetLeft;
				y = visualViewport.offsetTop;
			}
		}
	}
	if (getWindowScrollBarX(html) <= 0) {
		const doc = html.ownerDocument;
		const body = doc.body;
		const bodyStyles = getComputedStyle(body);
		const bodyMarginInline = doc.compatMode === "CSS1Compat" ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
		const reservedWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
		const gutter = getComputedStyle(html).scrollbarGutter === "stable both-edges" ? reservedWidth / 2 : reservedWidth;
		if (gutter <= SCROLLBAR_MAX) width -= gutter;
	}
	return {
		width,
		height,
		x,
		y
	};
}
function getInnerBoundingClientRect(element, strategy) {
	const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
	const top = clientRect.top + element.clientTop;
	const left = clientRect.left + element.clientLeft;
	const scale = getScale(element);
	return {
		width: element.clientWidth * scale.x,
		height: element.clientHeight * scale.y,
		x: left * scale.x,
		y: top * scale.y
	};
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
	let rect;
	if (clippingAncestor === "viewport" || clippingAncestor === "layoutViewport") rect = getViewportRect(element, strategy, clippingAncestor);
	else if (clippingAncestor === "document") rect = getDocumentRect(getDocumentElement(element));
	else if (isElement(clippingAncestor)) rect = getInnerBoundingClientRect(clippingAncestor, strategy);
	else {
		const visualOffsets = getVisualOffsets(element);
		rect = {
			x: clippingAncestor.x - visualOffsets.x,
			y: clippingAncestor.y - visualOffsets.y,
			width: clippingAncestor.width,
			height: clippingAncestor.height
		};
	}
	return rectToClientRect(rect);
}
function getClippingElementAncestors(element, cache) {
	const cachedResult = cache.get(element);
	if (cachedResult) return cachedResult;
	let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
	let lastKeptComputedStyle = null;
	const elementIsFixed = getComputedStyle$1(element).position === "fixed";
	let currentNode = elementIsFixed ? getParentNode(element) : element;
	while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
		const computedStyle = getComputedStyle$1(currentNode);
		const currentNodeIsContaining = isContainingBlock(currentNode);
		const lastPosition = lastKeptComputedStyle ? lastKeptComputedStyle.position : elementIsFixed ? "fixed" : "";
		if (!currentNodeIsContaining && (lastPosition === "fixed" || lastPosition === "absolute" && computedStyle.position === "static")) result = result.filter((ancestor) => ancestor !== currentNode);
		else lastKeptComputedStyle = computedStyle;
		currentNode = getParentNode(currentNode);
	}
	cache.set(element, result);
	return result;
}
function getClippingRect(_ref) {
	let { element, boundary, rootBoundary, strategy } = _ref;
	const clippingAncestors = [...boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary), rootBoundary];
	const firstRect = getClientRectFromClippingAncestor(element, clippingAncestors[0], strategy);
	let top = firstRect.top;
	let right = firstRect.right;
	let bottom = firstRect.bottom;
	let left = firstRect.left;
	for (let i = 1; i < clippingAncestors.length; i++) {
		const rect = getClientRectFromClippingAncestor(element, clippingAncestors[i], strategy);
		top = max(rect.top, top);
		right = min(rect.right, right);
		bottom = min(rect.bottom, bottom);
		left = max(rect.left, left);
	}
	return {
		width: right - left,
		height: bottom - top,
		x: left,
		y: top
	};
}
function getDimensions(element) {
	const { width, height } = getCssDimensions(element);
	return {
		width,
		height
	};
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
	const isOffsetParentAnElement = isHTMLElement(offsetParent);
	const documentElement = getDocumentElement(offsetParent);
	const isFixed = strategy === "fixed";
	const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
	let scroll = {
		scrollLeft: 0,
		scrollTop: 0
	};
	const offsets = createCoords(0);
	if (isOffsetParentAnElement || !isFixed) {
		if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) scroll = getNodeScroll(offsetParent);
		if (isOffsetParentAnElement) {
			const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
			offsets.x = offsetRect.x + offsetParent.clientLeft;
			offsets.y = offsetRect.y + offsetParent.clientTop;
		}
	}
	if (!isOffsetParentAnElement && documentElement) offsets.x = getWindowScrollBarX(documentElement);
	const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
	return {
		x: rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x,
		y: rect.top + scroll.scrollTop - offsets.y - htmlOffset.y,
		width: rect.width,
		height: rect.height
	};
}
function isStaticPositioned(element) {
	return getComputedStyle$1(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
	if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") return null;
	if (polyfill) return polyfill(element);
	let rawOffsetParent = element.offsetParent;
	if (getDocumentElement(element) === rawOffsetParent) rawOffsetParent = rawOffsetParent.ownerDocument.body;
	return rawOffsetParent;
}
function getOffsetParent(element, polyfill) {
	const win = getWindow(element);
	if (isTopLayer(element)) return win;
	if (!isHTMLElement(element)) {
		let svgOffsetParent = getParentNode(element);
		while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
			if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) return svgOffsetParent;
			svgOffsetParent = getParentNode(svgOffsetParent);
		}
		return win;
	}
	let offsetParent = getTrueOffsetParent(element, polyfill);
	while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) offsetParent = getTrueOffsetParent(offsetParent, polyfill);
	if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) return win;
	return offsetParent || getContainingBlock(element) || win;
}
var getElementRects = async function(data) {
	const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
	const getDimensionsFn = this.getDimensions;
	const floatingDimensions = await getDimensionsFn(data.floating);
	return {
		reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
		floating: {
			x: 0,
			y: 0,
			width: floatingDimensions.width,
			height: floatingDimensions.height
		}
	};
};
function isRTL(element) {
	return getComputedStyle$1(element).direction === "rtl";
}
var platform = {
	convertOffsetParentRelativeRectToViewportRelativeRect,
	getDocumentElement,
	getClippingRect,
	getOffsetParent,
	getElementRects,
	getClientRects,
	getDimensions,
	getScale,
	isElement,
	isRTL
};
function rectsAreEqual(a, b) {
	return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}
function observeMove(element, onMove, ancestorResize) {
	let io = null;
	let timeoutId;
	const root = getDocumentElement(element);
	function cleanup() {
		var _io;
		clearTimeout(timeoutId);
		(_io = io) == null || _io.disconnect();
		io = null;
	}
	function refresh(skip, threshold) {
		if (skip === void 0) skip = false;
		if (threshold === void 0) threshold = 1;
		cleanup();
		const elementRectForRootMargin = element.getBoundingClientRect();
		const { left, top, width, height } = elementRectForRootMargin;
		if (!skip) onMove();
		if (!width || !height) return;
		const insetTop = floor(top);
		const insetRight = floor(root.clientWidth - (left + width));
		const insetBottom = floor(root.clientHeight - (top + height));
		const insetLeft = floor(left);
		const options = {
			rootMargin: -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px",
			threshold: max(0, min(1, threshold)) || 1
		};
		let isFirstUpdate = true;
		function handleObserve(entries) {
			const ratio = entries[0].intersectionRatio;
			if (!rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) return refresh();
			if (ratio !== threshold) {
				if (!isFirstUpdate) return refresh();
				if (!ratio) timeoutId = setTimeout(() => {
					refresh(false, 1e-7);
				}, 1e3);
				else refresh(false, ratio);
			}
			isFirstUpdate = false;
		}
		try {
			io = new IntersectionObserver(handleObserve, {
				...options,
				root: root.ownerDocument
			});
		} catch (_e) {
			io = new IntersectionObserver(handleObserve, options);
		}
		io.observe(element);
	}
	const win = getWindow(element);
	const handleResize = () => refresh(ancestorResize);
	win.addEventListener("resize", handleResize);
	refresh(true);
	return () => {
		win.removeEventListener("resize", handleResize);
		cleanup();
	};
}
/**
* Automatically updates the position of the floating element when necessary.
* Should only be called when the floating element is mounted on the DOM or
* visible on the screen.
* @returns cleanup function that should be invoked when the floating element is
* removed from the DOM or hidden from the screen.
* @see https://floating-ui.com/docs/autoUpdate
*/
function autoUpdate(reference, floating, update, options) {
	if (options === void 0) options = {};
	const { ancestorScroll = true, ancestorResize = true, elementResize = typeof ResizeObserver === "function", layoutShift = typeof IntersectionObserver === "function", animationFrame = false } = options;
	const referenceEl = unwrapElement(reference);
	const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...floating ? getOverflowAncestors(floating) : []] : [];
	ancestors.forEach((ancestor) => {
		ancestorScroll && ancestor.addEventListener("scroll", update);
		ancestorResize && ancestor.addEventListener("resize", update);
	});
	const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update, ancestorResize) : null;
	let reobserveFrame = -1;
	let resizeObserver = null;
	if (elementResize) {
		resizeObserver = new ResizeObserver((_ref) => {
			let [firstEntry] = _ref;
			if (firstEntry && firstEntry.target === referenceEl && resizeObserver && floating) {
				resizeObserver.unobserve(floating);
				cancelAnimationFrame(reobserveFrame);
				reobserveFrame = requestAnimationFrame(() => {
					var _resizeObserver;
					(_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
				});
			}
			update();
		});
		if (referenceEl && !animationFrame) resizeObserver.observe(referenceEl);
		if (floating) resizeObserver.observe(floating);
	}
	let frameId;
	let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
	if (animationFrame) frameLoop();
	function frameLoop() {
		const nextRefRect = getBoundingClientRect(reference);
		if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) update();
		prevRefRect = nextRefRect;
		frameId = requestAnimationFrame(frameLoop);
	}
	update();
	return () => {
		var _resizeObserver2;
		ancestors.forEach((ancestor) => {
			ancestorScroll && ancestor.removeEventListener("scroll", update);
			ancestorResize && ancestor.removeEventListener("resize", update);
		});
		cleanupIo?.();
		(_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
		resizeObserver = null;
		if (animationFrame) cancelAnimationFrame(frameId);
	};
}
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
var offset = offset$1;
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
var shift = shift$1;
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
var flip = flip$1;
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
var size = size$1;
/**
* Computes the `x` and `y` coordinates that will place the floating element
* next to a given reference element.
*/
var computePosition = (reference, floating, options) => {
	const cache = /* @__PURE__ */ new Map();
	const mergedOptions = options != null ? options : {};
	const platformWithCache = {
		...platform,
		...mergedOptions.platform,
		_c: cache
	};
	return computePosition$1(reference, floating, {
		...mergedOptions,
		platform: platformWithCache
	});
};
// node_modules/bootstrap/js/dist/util/floating-ui.js
/*!
* Bootstrap floating-ui.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
/**
* --------------------------------------------------------------------------
* Bootstrap util/floating-ui.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Breakpoints for responsive placement (matches SCSS $breakpoints)
*/
var BREAKPOINTS = {
	sm: 576,
	md: 768,
	lg: 1024,
	xl: 1280,
	"2xl": 1536
};
/**
* Parse a placement string that may contain responsive prefixes
* Example: "bottom-start md:top-end lg:right" returns { xs: 'bottom-start', md: 'top-end', lg: 'right' }
*
* @param placementString - The placement string to parse
* @param defaultPlacement - The default placement to use for xs/base
* @returns Object with breakpoint keys and placement values, or null if not responsive
*/
var parseResponsivePlacement = (placementString, defaultPlacement = "bottom") => {
	if (!placementString || !placementString.includes(":")) return null;
	const parts = placementString.split(/\s+/);
	const placements = { xs: defaultPlacement };
	for (const part of parts) if (part.includes(":")) {
		const [breakpoint, placement] = part.split(":");
		if (BREAKPOINTS[breakpoint] !== void 0) placements[breakpoint] = placement;
	} else placements.xs = part;
	return placements;
};
/**
* Get the active placement for the current viewport width
*
* @param responsivePlacements - Object with breakpoint keys and placement values
* @param defaultPlacement - Fallback placement
* @returns The active placement for current viewport
*/
var getResponsivePlacement = (responsivePlacements, defaultPlacement = "bottom") => {
	if (!responsivePlacements) return defaultPlacement;
	const viewportWidth = window.innerWidth;
	let activePlacement = responsivePlacements.xs || defaultPlacement;
	for (const breakpoint of [
		"sm",
		"md",
		"lg",
		"xl",
		"2xl"
	]) if (viewportWidth >= BREAKPOINTS[breakpoint] && responsivePlacements[breakpoint]) activePlacement = responsivePlacements[breakpoint];
	return activePlacement;
};
/**
* Create media query listeners for responsive placement changes
*
* @param callback - Callback to run when breakpoint changes
* @returns Array of { mql, handler } objects for cleanup
*/
var createBreakpointListeners = (callback) => {
	const listeners = [];
	for (const breakpoint of Object.keys(BREAKPOINTS)) {
		const minWidth = BREAKPOINTS[breakpoint];
		const mql = window.matchMedia(`(min-width: ${minWidth}px)`);
		mql.addEventListener("change", callback);
		listeners.push({
			mql,
			handler: callback
		});
	}
	return listeners;
};
/**
* Clean up media query listeners
*
* @param listeners - Array of { mql, handler } objects
*/
var disposeBreakpointListeners = (listeners) => {
	for (const { mql, handler } of listeners) mql.removeEventListener("change", handler);
};
/**
* Normalize an offset value into Floating UI's offset shape.
* A `[skidding, distance]` array becomes `{ mainAxis: distance, crossAxis: skidding }`;
* numbers and axis objects pass through unchanged.
*/
var toFloatingOffset = (value) => {
	return Array.isArray(value) ? {
		mainAxis: value[1] || 0,
		crossAxis: value[0] || 0
	} : value;
};
// node_modules/bootstrap/js/dist/menu.js
/*!
* Bootstrap menu.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
/**
* --------------------------------------------------------------------------
* Bootstrap menu.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
var NAME$6 = "menu";
var EVENT_KEY$6 = `.bs.menu`;
var DATA_API_KEY$4 = ".data-api";
var ESCAPE_KEY$1 = "Escape";
var TAB_KEY$1 = "Tab";
var ARROW_UP_KEY$2 = "ArrowUp";
var ARROW_DOWN_KEY$2 = "ArrowDown";
var ARROW_LEFT_KEY$1 = "ArrowLeft";
var ARROW_RIGHT_KEY$1 = "ArrowRight";
var HOME_KEY$2 = "Home";
var END_KEY$2 = "End";
var ENTER_KEY$1 = "Enter";
var SPACE_KEY$1 = " ";
var ITEM_NAVIGATION_KEYS = /* @__PURE__ */ new Set([
	ARROW_UP_KEY$2,
	ARROW_DOWN_KEY$2,
	ARROW_LEFT_KEY$1,
	ARROW_RIGHT_KEY$1,
	HOME_KEY$2,
	END_KEY$2
]);
var RIGHT_MOUSE_BUTTON = 2;
var SUBMENU_CLOSE_DELAY = 100;
var EVENT_HIDE$2 = `hide${EVENT_KEY$6}`;
var EVENT_HIDDEN$2 = `hidden${EVENT_KEY$6}`;
var EVENT_SHOW$2 = `show${EVENT_KEY$6}`;
var EVENT_SHOWN$2 = `shown${EVENT_KEY$6}`;
var EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$6}${DATA_API_KEY$4}`;
var EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$6}${DATA_API_KEY$4}`;
var EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$6}${DATA_API_KEY$4}`;
var EVENT_TOUCH_MOUSEOVER = `mouseover${EVENT_KEY$6}`;
var CLASS_NAME_SHOW$2 = "show";
var CLASS_NAME_MENU_BACK = "menu-back";
var SELECTOR_DATA_TOGGLE$5 = "[data-bs-toggle=\"menu\"]:not(.disabled):not(:disabled)";
var SELECTOR_MENU$2 = ".menu";
var SELECTOR_SUBMENU = ".submenu";
var SELECTOR_SUBMENU_TOGGLE = ".submenu > .menu-item";
var SELECTOR_NAVBAR_NAV = ".navbar-nav";
var SELECTOR_VISIBLE_ITEMS$1 = ".menu-item:not(.disabled):not(:disabled)";
var SELECTOR_TAB_STOPS = ":is(a[href], button, input, select, textarea, summary, [tabindex], [contenteditable]):not(:disabled, .disabled)";
var DEFAULT_PLACEMENT = "bottom-start";
var SUBMENU_PLACEMENT = "end-start";
var resolveLogicalPlacement = (placement) => {
	if (isRTL$1()) return placement.replace(/^start(?=-|$)/, "right").replace(/^end(?=-|$)/, "left");
	return placement.replace(/^start(?=-|$)/, "left").replace(/^end(?=-|$)/, "right");
};
var triangleSign = (p1, p2, p3) => (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
var Default$5 = {
	autoClose: true,
	boundary: "clippingParents",
	container: false,
	display: "dynamic",
	offset: [0, 2],
	floatingConfig: null,
	menu: null,
	placement: DEFAULT_PLACEMENT,
	reference: "toggle",
	strategy: "absolute",
	submenuTrigger: "both",
	submenuDelay: SUBMENU_CLOSE_DELAY
};
var DefaultType$5 = {
	autoClose: "(boolean|string)",
	boundary: "(string|element)",
	container: "(string|element|boolean)",
	display: "string",
	offset: "(array|string|function)",
	floatingConfig: "(null|object|function)",
	menu: "(null|element)",
	placement: "string",
	reference: "(string|element|object)",
	strategy: "string",
	submenuTrigger: "string",
	submenuDelay: "number"
};
/**
* Class definition
*/
var Menu = class Menu extends BaseComponent {
	static _openInstances = /* @__PURE__ */ new Set();
	constructor(element, config) {
		if (typeof computePosition === "undefined") throw new TypeError("Bootstrap's menus require Floating UI (https://floating-ui.com)");
		super(element, config);
		this._floatingCleanup = null;
		this._mediaQueryListeners = [];
		this._responsivePlacements = null;
		this._parent = this._element.parentNode;
		this._openSubmenus = /* @__PURE__ */ new Map();
		this._submenuCloseTimeouts = /* @__PURE__ */ new Map();
		this._hoverIntentData = null;
		this._submenuPointerType = "mouse";
		this._touchMouseover = () => void 0;
		this._touchMouseoverTargets = /* @__PURE__ */ new Set();
		this._menu = this._config.menu || this._findMenu();
		if (!this._config.menu && this._menu) this._parent = this._findWrapper(this._menu);
		this._isSubmenu = this._parent.classList?.contains("submenu");
		this._menuOriginalParent = this._menu?.parentNode;
		this._menuOriginalNextSibling = null;
		this._parseResponsivePlacements();
		this._setupSubmenuListeners();
		this._initSubmenuTriggers();
	}
	static get Default() {
		return Default$5;
	}
	static get DefaultType() {
		return DefaultType$5;
	}
	static get NAME() {
		return NAME$6;
	}
	toggle() {
		return this._isShown() ? this.hide() : this.show();
	}
	show() {
		return this._show();
	}
	async _show(focus) {
		if (isDisabled(this._element) || this._isShown()) return;
		const relatedTarget = { relatedTarget: this._element };
		if (EventHandler.trigger(this._element, EVENT_SHOW$2, relatedTarget).defaultPrevented) return;
		this._moveMenuToContainer();
		this._disposeFloating();
		this._submenuPointerType = "mouse";
		if ("ontouchstart" in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV)) for (const element of document.body.children) {
			EventHandler.on(element, EVENT_TOUCH_MOUSEOVER, this._touchMouseover);
			this._touchMouseoverTargets.add(element);
		}
		this._element.setAttribute("aria-expanded", "true");
		this._menu.classList.add(CLASS_NAME_SHOW$2);
		this._element.classList.add(CLASS_NAME_SHOW$2);
		if (this._parent) this._parent.classList.add(CLASS_NAME_SHOW$2);
		this._syncSubmenuLayout();
		this._createFloating();
		Menu._openInstances.add(this);
		if (focus) focus();
		else this._element.focus({ focusVisible: false });
		if (!this._element || !this._isShown()) return;
		await this._queueCallback(() => {
			if (this._menu && this._isShown()) EventHandler.trigger(this._element, EVENT_SHOWN$2, relatedTarget);
		}, this._menu, this._isAnimated());
	}
	async hide() {
		if (isDisabled(this._element) || !this._isShown()) return;
		const relatedTarget = { relatedTarget: this._element };
		await this._completeHide(relatedTarget);
	}
	dispose() {
		this._removeTouchMouseoverListeners();
		EventHandler.off(this._menu, EVENT_KEY$6);
		this._disposeFloating();
		this._clearSize();
		this._restoreMenuToOriginalParent();
		this._disposeMediaQueryListeners();
		this._closeAllSubmenus();
		this._clearAllSubmenuTimeouts();
		Menu._openInstances.delete(this);
		super.dispose();
	}
	update() {
		if (this._floatingCleanup) this._updateFloatingPosition();
	}
	_findMenu() {
		const wrapper = SelectorEngine.closest(this._element, `:has(${SELECTOR_MENU$2})`);
		return SelectorEngine.next(this._element, SELECTOR_MENU$2)[0] || SelectorEngine.prev(this._element, SELECTOR_MENU$2)[0] || SelectorEngine.findOne(SELECTOR_MENU$2, wrapper || this._parent);
	}
	_findWrapper(menu) {
		let wrapper = this._element.parentNode;
		while (wrapper instanceof Element && !wrapper.contains(menu)) wrapper = wrapper.parentNode;
		return wrapper instanceof Element ? wrapper : this._element.parentNode;
	}
	async _completeHide(relatedTarget) {
		if (EventHandler.trigger(this._element, EVENT_HIDE$2, relatedTarget).defaultPrevented) return;
		this._closeAllSubmenus();
		this._removeTouchMouseoverListeners();
		this._menu.classList.remove(CLASS_NAME_SHOW$2);
		this._element.classList.remove(CLASS_NAME_SHOW$2);
		if (this._parent) this._parent.classList.remove(CLASS_NAME_SHOW$2);
		this._element.setAttribute("aria-expanded", "false");
		Menu._openInstances.delete(this);
		await this._queueCallback(() => {
			if (!this._menu || this._isShown()) return;
			this._disposeFloating();
			this._clearSize();
			this._restoreMenuToOriginalParent();
			Manipulator.removeDataAttribute(this._menu, "placement");
			Manipulator.removeDataAttribute(this._menu, "display");
			EventHandler.trigger(this._element, EVENT_HIDDEN$2, relatedTarget);
		}, this._menu, this._isAnimated());
	}
	_removeTouchMouseoverListeners() {
		for (const element of this._touchMouseoverTargets) EventHandler.off(element, EVENT_TOUCH_MOUSEOVER, this._touchMouseover);
		this._touchMouseoverTargets.clear();
	}
	_getConfig(config) {
		config = super._getConfig(config);
		if (typeof config.reference === "object" && !isElement$1(config.reference) && typeof config.reference.getBoundingClientRect !== "function") throw new TypeError(`${NAME$6.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
		return config;
	}
	_createFloating() {
		if (this._config.display === "static") {
			Manipulator.setDataAttribute(this._menu, "display", "static");
			return;
		}
		let referenceElement = this._element;
		if (this._config.reference === "parent") referenceElement = this._parent;
		else if (isElement$1(this._config.reference)) referenceElement = getElement(this._config.reference);
		else if (typeof this._config.reference === "object") referenceElement = this._config.reference;
		this._floatingCleanup = autoUpdate(referenceElement, this._menu, () => this._updateFloatingPosition(referenceElement));
	}
	async _updateFloatingPosition(referenceElement = null) {
		if (!this._menu) return;
		if (!referenceElement) if (this._config.reference === "parent") referenceElement = this._parent;
		else if (isElement$1(this._config.reference)) referenceElement = getElement(this._config.reference);
		else if (typeof this._config.reference === "object") referenceElement = this._config.reference;
		else referenceElement = this._element;
		const placement = this._getPlacement();
		const middleware = this._getFloatingMiddleware();
		const floatingConfig = this._getFloatingConfig(placement, middleware);
		await this._applyFloatingPosition(referenceElement, this._menu, floatingConfig.placement, floatingConfig.middleware, floatingConfig.strategy);
	}
	_isShown() {
		return this._menu.classList.contains(CLASS_NAME_SHOW$2);
	}
	_isAnimated() {
		return getTransitionDurationFromElement(this._menu) > 0;
	}
	_getPlacement() {
		return resolveLogicalPlacement(this._responsivePlacements ? getResponsivePlacement(this._responsivePlacements, DEFAULT_PLACEMENT) : this._config.placement);
	}
	_parseResponsivePlacements() {
		this._responsivePlacements = parseResponsivePlacement(this._config.placement, DEFAULT_PLACEMENT);
		if (this._responsivePlacements) this._setupMediaQueryListeners();
	}
	_setupMediaQueryListeners() {
		this._disposeMediaQueryListeners();
		this._mediaQueryListeners = createBreakpointListeners(() => {
			if (this._isShown()) this._updateFloatingPosition();
		});
	}
	_disposeMediaQueryListeners() {
		disposeBreakpointListeners(this._mediaQueryListeners);
		this._mediaQueryListeners = [];
	}
	_getOffset() {
		const { offset: offsetConfig } = this._config;
		if (typeof offsetConfig === "string") return offsetConfig.split(",").map((value) => Number.parseInt(value, 10));
		if (typeof offsetConfig === "function") return ({ placement, rects }) => {
			return toFloatingOffset(offsetConfig({
				placement,
				reference: rects.reference,
				floating: rects.floating
			}, this._element));
		};
		return offsetConfig;
	}
	_getFloatingMiddleware() {
		const offsetValue = this._getOffset();
		const boundary = this._config.boundary === "clippingParents" ? "clippingAncestors" : this._config.boundary;
		return [
			offset(typeof offsetValue === "function" ? offsetValue : toFloatingOffset(offsetValue)),
			flip({
				boundary,
				fallbackPlacements: this._getFallbackPlacements()
			}),
			shift({ boundary }),
			size({
				boundary,
				apply: ({ availableWidth, availableHeight, elements }) => {
					if (this._menu !== elements.floating || !this._isShown() || getComputedStyle(this._menu).position === "static") return;
					this._menu.style.setProperty("--bs-menu-available-width", `${Math.max(0, Math.floor(availableWidth))}px`);
					this._menu.style.setProperty("--bs-menu-available-height", `${Math.max(0, Math.floor(availableHeight))}px`);
					this._syncSubmenuLayout();
				}
			})
		];
	}
	_syncSubmenuLayout() {
		if (!this._openSubmenus.size) this._menu.toggleAttribute("data-bs-menu-constrained", this._menu.scrollHeight > this._menu.clientHeight);
		else if (this._usesStackedSubmenus() && this._menu.scrollHeight > this._menu.clientHeight) this._menu.setAttribute("data-bs-menu-constrained", "");
		const { overflowX, overflowY } = getComputedStyle(this._menu);
		this._menu.toggleAttribute("data-bs-menu-stacked", overflowX !== "visible" || overflowY !== "visible");
	}
	_clearSize() {
		if (this._menu) {
			this._menu.style.removeProperty("--bs-menu-available-width");
			this._menu.style.removeProperty("--bs-menu-available-height");
			this._menu.removeAttribute("data-bs-menu-constrained");
			this._menu.removeAttribute("data-bs-menu-stacked");
		}
	}
	_getFallbackPlacements() {
		return {
			bottom: [
				"top",
				"bottom-start",
				"bottom-end",
				"top-start",
				"top-end"
			],
			"bottom-start": [
				"top-start",
				"bottom-end",
				"top-end"
			],
			"bottom-end": [
				"top-end",
				"bottom-start",
				"top-start"
			],
			top: [
				"bottom",
				"top-start",
				"top-end",
				"bottom-start",
				"bottom-end"
			],
			"top-start": [
				"bottom-start",
				"top-end",
				"bottom-end"
			],
			"top-end": [
				"bottom-end",
				"top-start",
				"bottom-start"
			],
			right: [
				"left",
				"right-start",
				"right-end",
				"left-start",
				"left-end"
			],
			"right-start": [
				"left-start",
				"right-end",
				"left-end",
				"top-start",
				"bottom-start"
			],
			"right-end": [
				"left-end",
				"right-start",
				"left-start",
				"top-end",
				"bottom-end"
			],
			left: [
				"right",
				"left-start",
				"left-end",
				"right-start",
				"right-end"
			],
			"left-start": [
				"right-start",
				"left-end",
				"right-end",
				"top-start",
				"bottom-start"
			],
			"left-end": [
				"right-end",
				"left-start",
				"right-start",
				"top-end",
				"bottom-end"
			]
		}[this._getPlacement()] || [
			"top",
			"bottom",
			"right",
			"left"
		];
	}
	_getFloatingConfig(placement, middleware) {
		const defaultConfig = {
			placement,
			middleware,
			strategy: this._config.strategy
		};
		return {
			...defaultConfig,
			...execute(this._config.floatingConfig, [void 0, defaultConfig])
		};
	}
	_disposeFloating() {
		if (this._floatingCleanup) {
			this._floatingCleanup();
			this._floatingCleanup = null;
		}
	}
	_getContainer() {
		const { container } = this._config;
		if (container === false) return null;
		return container === true ? document.body : getElement(container);
	}
	_moveMenuToContainer() {
		const container = this._getContainer();
		if (!container || !this._menu) return;
		if (this._menu.parentNode !== container) {
			this._menuOriginalNextSibling = this._menu.nextSibling;
			container.append(this._menu);
		}
	}
	_restoreMenuToOriginalParent() {
		if (!this._menuOriginalParent || !this._menu) return;
		if (this._menu.parentNode !== this._menuOriginalParent) {
			const nextSibling = this._menuOriginalNextSibling;
			this._menuOriginalParent.insertBefore(this._menu, nextSibling?.parentNode === this._menuOriginalParent ? nextSibling : null);
		}
	}
	async _applyFloatingPosition(reference, floating, placement, middleware, strategy = "absolute") {
		if (!floating.isConnected) return null;
		const { x, y, placement: finalPlacement } = await computePosition(reference, floating, {
			placement,
			middleware,
			strategy
		});
		if (!floating.isConnected) return null;
		Object.assign(floating.style, {
			position: strategy,
			left: `${x}px`,
			top: `${y}px`,
			margin: "0"
		});
		Manipulator.setDataAttribute(floating, "placement", finalPlacement);
		return finalPlacement;
	}
	_setupSubmenuListeners() {
		if (this._config.submenuTrigger === "hover" || this._config.submenuTrigger === "both") {
			EventHandler.on(this._menu, `mouseenter${EVENT_KEY$6}`, SELECTOR_SUBMENU_TOGGLE, (event) => {
				this._onSubmenuTriggerEnter(event);
			});
			EventHandler.on(this._menu, `mouseleave${EVENT_KEY$6}`, SELECTOR_SUBMENU, (event) => {
				this._onSubmenuLeave(event);
			});
			EventHandler.on(this._menu, `mousemove${EVENT_KEY$6}`, (event) => {
				this._trackMousePosition(event);
			});
		}
		if (this._config.submenuTrigger === "both") EventHandler.on(this._menu, `pointerover${EVENT_KEY$6}`, (event) => {
			this._submenuPointerType = event.pointerType;
		});
		if ([
			"click",
			"hover",
			"both"
		].includes(this._config.submenuTrigger)) EventHandler.on(this._menu, `click${EVENT_KEY$6}`, SELECTOR_SUBMENU_TOGGLE, (event) => {
			if (this._config.submenuTrigger !== "hover" || this._usesStackedSubmenus()) this._onSubmenuTriggerClick(event);
		});
	}
	_usesStackedSubmenus() {
		return getComputedStyle(this._menu).getPropertyValue("--bs-menu-stack-submenus") === "1";
	}
	_onSubmenuTriggerEnter(event) {
		if (this._submenuPointerType !== "mouse" || this._usesStackedSubmenus()) return;
		const trigger = event.target.closest(SELECTOR_SUBMENU_TOGGLE);
		if (!trigger) return;
		const submenuWrapper = trigger.closest(SELECTOR_SUBMENU);
		const submenu = SelectorEngine.findOne(SELECTOR_MENU$2, submenuWrapper);
		if (!submenu) return;
		this._cancelSubmenuCloseTimeout(submenu);
		this._closeSiblingSubmenus(submenuWrapper);
		this._openSubmenu(trigger, submenu, submenuWrapper);
	}
	_onSubmenuLeave(event) {
		if (this._submenuPointerType !== "mouse" || this._usesStackedSubmenus()) return;
		const submenuWrapper = event.target.closest(SELECTOR_SUBMENU);
		const submenu = SelectorEngine.findOne(SELECTOR_MENU$2, submenuWrapper);
		if (!submenu || !this._openSubmenus.has(submenu)) return;
		if (this._isMovingTowardSubmenu(event, submenu)) return;
		this._scheduleSubmenuClose(submenu, submenuWrapper);
	}
	_onSubmenuTriggerClick(event) {
		const trigger = event.target.closest(SELECTOR_SUBMENU_TOGGLE);
		if (!trigger) return;
		event.preventDefault();
		event.stopPropagation();
		const submenuWrapper = trigger.closest(SELECTOR_SUBMENU);
		const submenu = SelectorEngine.findOne(SELECTOR_MENU$2, submenuWrapper);
		if (!submenu) return;
		if (this._openSubmenus.has(submenu)) this._closeSubmenu(submenu, submenuWrapper);
		else {
			this._closeSiblingSubmenus(submenuWrapper);
			this._openSubmenu(trigger, submenu, submenuWrapper);
			if (this._usesStackedSubmenus()) this._getItemsInMenu(submenu)[0]?.focus();
		}
	}
	_initSubmenuTriggers() {
		if (!this._menu) return;
		for (const trigger of SelectorEngine.find(SELECTOR_SUBMENU_TOGGLE, this._menu)) {
			if (!SelectorEngine.findOne(SELECTOR_MENU$2, trigger.parentElement)) continue;
			trigger.setAttribute("aria-haspopup", "true");
			if (!trigger.hasAttribute("aria-expanded")) trigger.setAttribute("aria-expanded", "false");
		}
	}
	_openSubmenu(trigger, submenu, submenuWrapper) {
		if (this._openSubmenus.has(submenu)) return;
		trigger.setAttribute("aria-expanded", "true");
		trigger.setAttribute("aria-haspopup", "true");
		submenu.style.opacity = "0";
		submenu.classList.add(CLASS_NAME_SHOW$2);
		submenuWrapper.classList.add(CLASS_NAME_SHOW$2);
		const backItem = document.createElement(submenu.matches("ul, ol, menu") ? "li" : "div");
		backItem.className = CLASS_NAME_MENU_BACK;
		const backButton = document.createElement("button");
		backButton.type = "button";
		backButton.className = "menu-item";
		backButton.textContent = "Back";
		backButton.addEventListener("click", (event) => {
			event.stopPropagation();
			this._closeSubmenu(submenu, submenuWrapper);
			trigger.focus();
		});
		backItem.append(backButton);
		submenu.prepend(backItem);
		const cleanup = this._createSubmenuFloating(submenu, submenuWrapper);
		this._openSubmenus.set(submenu, () => {
			cleanup();
			backItem.remove();
		});
		EventHandler.on(submenu, `mouseenter${EVENT_KEY$6}`, () => {
			this._cancelSubmenuCloseTimeout(submenu);
		});
	}
	_closeSubmenu(submenu, submenuWrapper) {
		if (!this._openSubmenus.has(submenu)) return;
		const nestedSubmenus = SelectorEngine.find(`${SELECTOR_SUBMENU} ${SELECTOR_MENU$2}.${CLASS_NAME_SHOW$2}`, submenu);
		for (const nested of nestedSubmenus) {
			const nestedWrapper = nested.closest(SELECTOR_SUBMENU);
			this._closeSubmenu(nested, nestedWrapper);
		}
		const trigger = SelectorEngine.findOne(SELECTOR_SUBMENU_TOGGLE, submenuWrapper);
		const cleanup = this._openSubmenus.get(submenu);
		if (cleanup) cleanup();
		this._openSubmenus.delete(submenu);
		EventHandler.off(submenu, `mouseenter${EVENT_KEY$6}`);
		this._cancelSubmenuCloseTimeout(submenu);
		if (trigger) trigger.setAttribute("aria-expanded", "false");
		submenu.classList.remove(CLASS_NAME_SHOW$2);
		submenuWrapper.classList.remove(CLASS_NAME_SHOW$2);
		submenu.style.opacity = "";
	}
	_closeAllSubmenus() {
		for (const [submenu] of this._openSubmenus) {
			const submenuWrapper = submenu.closest(SELECTOR_SUBMENU);
			this._closeSubmenu(submenu, submenuWrapper);
		}
	}
	_closeSiblingSubmenus(currentSubmenuWrapper) {
		const parent = currentSubmenuWrapper.parentNode;
		const siblingSubmenus = SelectorEngine.find(`${SELECTOR_SUBMENU} > ${SELECTOR_MENU$2}.${CLASS_NAME_SHOW$2}`, parent);
		for (const siblingMenu of siblingSubmenus) {
			const siblingWrapper = siblingMenu.closest(SELECTOR_SUBMENU);
			if (siblingWrapper !== currentSubmenuWrapper) this._closeSubmenu(siblingMenu, siblingWrapper);
		}
	}
	_createSubmenuFloating(submenu, submenuWrapper) {
		const referenceElement = submenuWrapper;
		const placement = resolveLogicalPlacement(SUBMENU_PLACEMENT);
		const middleware = [
			offset({
				mainAxis: 0,
				crossAxis: -4
			}),
			flip({ fallbackPlacements: [
				resolveLogicalPlacement("start-start"),
				resolveLogicalPlacement("end-end"),
				resolveLogicalPlacement("start-end")
			] }),
			shift({ padding: 8 })
		];
		const updatePosition = async () => {
			if (this._usesStackedSubmenus()) {
				submenu.style.opacity = "";
				return;
			}
			await this._applyFloatingPosition(referenceElement, submenu, placement, middleware);
			submenu.style.opacity = "";
		};
		return autoUpdate(referenceElement, submenu, updatePosition);
	}
	_scheduleSubmenuClose(submenu, submenuWrapper) {
		this._cancelSubmenuCloseTimeout(submenu);
		const timeoutId = setTimeout(() => {
			this._closeSubmenu(submenu, submenuWrapper);
			this._submenuCloseTimeouts.delete(submenu);
		}, this._config.submenuDelay);
		this._submenuCloseTimeouts.set(submenu, timeoutId);
	}
	_cancelSubmenuCloseTimeout(submenu) {
		const timeoutId = this._submenuCloseTimeouts.get(submenu);
		if (timeoutId) {
			clearTimeout(timeoutId);
			this._submenuCloseTimeouts.delete(submenu);
		}
	}
	_clearAllSubmenuTimeouts() {
		for (const timeoutId of this._submenuCloseTimeouts.values()) clearTimeout(timeoutId);
		this._submenuCloseTimeouts.clear();
	}
	_trackMousePosition(event) {
		this._hoverIntentData = {
			x: event.clientX,
			y: event.clientY,
			timestamp: Date.now()
		};
	}
	_isMovingTowardSubmenu(event, submenu) {
		if (!this._hoverIntentData) return false;
		const submenuRect = submenu.getBoundingClientRect();
		const currentPos = {
			x: event.clientX,
			y: event.clientY
		};
		const lastPos = {
			x: this._hoverIntentData.x,
			y: this._hoverIntentData.y
		};
		const targetX = isRTL$1() ? submenuRect.right : submenuRect.left;
		const topCorner = {
			x: targetX,
			y: submenuRect.top
		};
		const bottomCorner = {
			x: targetX,
			y: submenuRect.bottom
		};
		return this._pointInTriangle(currentPos, lastPos, topCorner, bottomCorner);
	}
	_pointInTriangle(point, v1, v2, v3) {
		const d1 = triangleSign(point, v1, v2);
		const d2 = triangleSign(point, v2, v3);
		const d3 = triangleSign(point, v3, v1);
		return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
	}
	_getItemsInMenu(menu) {
		const backSelector = this._usesStackedSubmenus() ? `, :scope > .${CLASS_NAME_MENU_BACK} > ${SELECTOR_VISIBLE_ITEMS$1}` : "";
		return SelectorEngine.find(`:scope > ${SELECTOR_VISIBLE_ITEMS$1}, :scope > ${SELECTOR_SUBMENU} > ${SELECTOR_VISIBLE_ITEMS$1}${backSelector}`, menu).filter((element) => isVisible(element));
	}
	_selectMenuItem({ key, target }) {
		const currentMenu = target.closest(SELECTOR_MENU$2) || this._menu;
		const items = this._getItemsInMenu(currentMenu);
		if (!items.length) return;
		const nextItem = getNextActiveElement(items, target, key === ARROW_DOWN_KEY$2, !items.includes(target));
		nextItem.focus();
		this._closeUnrelatedSubmenus(currentMenu, nextItem);
	}
	_handlePortaledTab(event) {
		if (!this._isShown() || this._menu.parentNode === this._menuOriginalParent || event.defaultPrevented) return;
		const stops = SelectorEngine.find(SELECTOR_TAB_STOPS, this._menu).filter((element) => (element.tabIndex >= 0 || element.isContentEditable && !element.hasAttribute("tabindex")) && !element.closest("[inert]") && isVisible(element));
		const first = stops[0];
		if (event.target === this._element && !event.shiftKey && first) {
			event.preventDefault();
			first.focus();
			return;
		}
		if (event.shiftKey && event.target === first) {
			event.preventDefault();
			this._element.focus();
		} else if (!event.shiftKey && event.target === stops.at(-1)) this._element.focus();
	}
	_closeUnrelatedSubmenus(currentMenu, focusedElement) {
		for (const [submenu] of this._openSubmenus) {
			const submenuWrapper = submenu.closest(SELECTOR_SUBMENU);
			if (!submenuWrapper || submenuWrapper.parentElement !== currentMenu || submenuWrapper.contains(focusedElement)) continue;
			this._closeSubmenu(submenu, submenuWrapper);
		}
	}
	_handleSubmenuKeydown(event) {
		const { key, target } = event;
		const isRtl = isRTL$1();
		const enterKey = isRtl ? ARROW_LEFT_KEY$1 : ARROW_RIGHT_KEY$1;
		const exitKey = isRtl ? ARROW_RIGHT_KEY$1 : ARROW_LEFT_KEY$1;
		const submenuWrapper = target.closest(SELECTOR_SUBMENU);
		const isSubmenuToggle = target.matches(SELECTOR_SUBMENU_TOGGLE);
		if ((key === ENTER_KEY$1 || key === SPACE_KEY$1 || key === enterKey) && submenuWrapper && isSubmenuToggle) {
			event.preventDefault();
			event.stopPropagation();
			const submenu = SelectorEngine.findOne(SELECTOR_MENU$2, submenuWrapper);
			if (submenu) {
				this._closeSiblingSubmenus(submenuWrapper);
				this._openSubmenu(target, submenu, submenuWrapper);
				requestAnimationFrame(() => {
					if (this._openSubmenus?.has(submenu)) (this._usesStackedSubmenus() ? this._getItemsInMenu(submenu)[0] : SelectorEngine.findOne(`${SELECTOR_VISIBLE_ITEMS$1}:not(.${CLASS_NAME_MENU_BACK} > *)`, submenu))?.focus();
				});
			}
			return true;
		}
		if (key === exitKey) {
			const currentMenu = target.closest(SELECTOR_MENU$2);
			const parentSubmenuWrapper = currentMenu?.closest(SELECTOR_SUBMENU);
			if (parentSubmenuWrapper) {
				event.preventDefault();
				event.stopPropagation();
				const parentTrigger = SelectorEngine.findOne(SELECTOR_SUBMENU_TOGGLE, parentSubmenuWrapper);
				this._closeSubmenu(currentMenu, parentSubmenuWrapper);
				if (parentTrigger) parentTrigger.focus();
				return true;
			}
		}
		if (key === HOME_KEY$2 || key === END_KEY$2) {
			const currentMenu = target.closest(SELECTOR_MENU$2);
			if (!currentMenu) return false;
			event.preventDefault();
			event.stopPropagation();
			const items = this._getItemsInMenu(currentMenu);
			if (items.length) {
				const targetItem = key === HOME_KEY$2 ? items[0] : items.at(-1);
				targetItem.focus();
				this._closeUnrelatedSubmenus(currentMenu, targetItem);
			}
			return true;
		}
		return false;
	}
	_handleEscape(event) {
		if (!this._isShown()) return;
		event.preventDefault();
		event.stopPropagation();
		const currentMenu = event.target.closest(SELECTOR_MENU$2);
		const parentSubmenuWrapper = currentMenu?.closest(SELECTOR_SUBMENU);
		if (currentMenu && parentSubmenuWrapper && this._openSubmenus.has(currentMenu)) {
			this._closeSubmenu(currentMenu, parentSubmenuWrapper);
			SelectorEngine.findOne(SELECTOR_SUBMENU_TOGGLE, parentSubmenuWrapper)?.focus();
			return;
		}
		this.hide();
		this._element.focus();
	}
	static clearMenus(event) {
		if (event.button === RIGHT_MOUSE_BUTTON || event.type === "keyup" && event.key !== TAB_KEY$1) return;
		for (const instance of Menu._openInstances) {
			if (instance._config.autoClose === false) continue;
			const composedPath = event.composedPath();
			const isMenuTarget = composedPath.includes(instance._menu);
			if (composedPath.includes(instance._element) || instance._config.autoClose === "inside" && !isMenuTarget || instance._config.autoClose === "outside" && isMenuTarget) continue;
			const formAncestor = event.target.closest?.("form");
			const isInsideMenuForm = Boolean(formAncestor) && instance._menu.contains(formAncestor);
			if (instance._menu.contains(event.target) && (event.type === "keyup" && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName) || isInsideMenuForm)) continue;
			const relatedTarget = { relatedTarget: instance._element };
			if (event.type === "click") relatedTarget.clickEvent = event;
			instance._completeHide(relatedTarget);
		}
	}
	static _getToggleFromKeydownContext(element, event) {
		if (element.matches(SELECTOR_DATA_TOGGLE$5)) return element;
		for (const instance of Menu._openInstances) if (instance._element === event.target || instance._menu?.contains(event.target)) return instance._element;
		return SelectorEngine.prev(element, SELECTOR_DATA_TOGGLE$5)[0] || SelectorEngine.next(element, SELECTOR_DATA_TOGGLE$5)[0] || SelectorEngine.findOne(SELECTOR_DATA_TOGGLE$5, event.delegateTarget.parentNode);
	}
	static dataApiKeydownHandler(event) {
		if (event.isComposing || event.keyCode === 229) return;
		const { key, target } = event;
		if (key !== ESCAPE_KEY$1 && key !== TAB_KEY$1) {
			const activatesSubmenu = (key === ENTER_KEY$1 || key === SPACE_KEY$1) && target.matches(SELECTOR_SUBMENU_TOGGLE);
			const isMenuItemOrToggle = target.matches(`${SELECTOR_DATA_TOGGLE$5}, .menu-item`);
			if (!(ITEM_NAVIGATION_KEYS.has(key) || activatesSubmenu) || !isMenuItemOrToggle || target.isContentEditable || target.matches("input, select, textarea")) return;
		}
		const getToggleButton = Menu._getToggleFromKeydownContext(this, event);
		if (!getToggleButton) return;
		if (key === TAB_KEY$1) {
			Menu.getInstance(getToggleButton)?._handlePortaledTab(event);
			return;
		}
		const instance = Menu.getOrCreateInstance(getToggleButton);
		if (key === ESCAPE_KEY$1) instance._handleEscape(event);
		else if (key === ARROW_UP_KEY$2 || key === ARROW_DOWN_KEY$2) {
			event.preventDefault();
			event.stopPropagation();
			instance.show();
			instance._selectMenuItem(event);
		} else instance._handleSubmenuKeydown(event);
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$5, Menu.dataApiKeydownHandler);
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU$2, Menu.dataApiKeydownHandler);
EventHandler.on(document, EVENT_CLICK_DATA_API$5, Menu.clearMenus);
EventHandler.on(document, EVENT_KEYUP_DATA_API, Menu.clearMenus);
EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_TOGGLE$5, function(event) {
	event.preventDefault();
	Menu.getOrCreateInstance(this).toggle();
});
// node_modules/bootstrap/js/dist/combobox.js
/*!
* Bootstrap combobox.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
/**
* Constants
*/
var NAME$5 = "combobox";
var EVENT_KEY$5 = `.bs.combobox`;
var DATA_API_KEY$3 = ".data-api";
var ESCAPE_KEY = "Escape";
var TAB_KEY = "Tab";
var ARROW_UP_KEY$1 = "ArrowUp";
var ARROW_DOWN_KEY$1 = "ArrowDown";
var HOME_KEY$1 = "Home";
var END_KEY$1 = "End";
var ENTER_KEY = "Enter";
var SPACE_KEY = " ";
var EVENT_CHANGE$1 = `change${EVENT_KEY$5}`;
var EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$5}${DATA_API_KEY$3}`;
var CLASS_NAME_SHOW$1 = "show";
var CLASS_NAME_SELECTED = "selected";
var CLASS_NAME_PLACEHOLDER = "combobox-placeholder";
var DISMISS_ICON = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" aria-hidden=\"true\"><line x1=\"4\" y1=\"4\" x2=\"12\" y2=\"12\"/><line x1=\"12\" y1=\"4\" x2=\"4\" y2=\"12\"/></svg>";
var SELECTOR_DATA_TOGGLE$4 = "[data-bs-toggle=\"combobox\"]";
var SELECTOR_MENU$1 = ".menu";
var SELECTOR_MENU_ITEM = ".menu-item[data-bs-value]";
var SELECTOR_VISIBLE_ITEMS = ".menu-item[data-bs-value]:not(.disabled):not(:disabled)";
var SELECTOR_VALUE = ".combobox-value";
var SELECTOR_SEARCH_INPUT = ".combobox-search-input";
var SELECTOR_NO_RESULTS = ".combobox-no-results";
var ComboboxMenu = class extends Menu {
	show(focus) {
		return this._show(focus);
	}
};
var Default$4 = {
	allowCustom: false,
	createOnBlur: false,
	maxItems: null,
	separator: null,
	boundary: "clippingParents",
	input: null,
	multiple: false,
	name: null,
	offset: [0, 2],
	placeholder: "",
	placement: "bottom-start",
	search: false,
	searchNormalize: false
};
var DefaultType$4 = {
	allowCustom: "boolean",
	createOnBlur: "boolean",
	maxItems: "(number|null)",
	separator: "(string|null)",
	boundary: "(string|element)",
	input: "(null|element)",
	multiple: "boolean",
	name: "(string|null)",
	offset: "(array|string|function)",
	placeholder: "string",
	placement: "string",
	search: "boolean",
	searchNormalize: "boolean"
};
/**
* Class definition
*/
var Combobox = class extends BaseComponent {
	constructor(element, config) {
		super(element, config);
		this._editor = this._element.matches("input") ? this._element : SelectorEngine.findOne(".combobox-input, .form-ghost", this._element);
		if (this._editor === this._element && this._config.multiple) throw new TypeError("COMBOBOX: Multiple selection requires a wrapping element.");
		this._toggle = this._editor ?? this._element;
		const field = this._editor && !this._element.matches("input") ? this._element : this._toggle;
		this._menu = SelectorEngine.next(field, SELECTOR_MENU$1)[0];
		this._ownsMenu = !this._menu && Boolean(this._editor);
		if (this._ownsMenu) {
			this._menu = document.createElement("div");
			this._menu.className = "menu";
			field.after(this._menu);
		}
		this._menuMinWidth = this._menu.style.minWidth;
		this._valueDisplay = SelectorEngine.findOne(SELECTOR_VALUE, this._toggle);
		this._searchInput = this._editor ?? SelectorEngine.findOne(SELECTOR_SEARCH_INPUT, this._menu);
		this._noResults = SelectorEngine.findOne(SELECTOR_NO_RESULTS, this._menu);
		this._activeItem = null;
		this._chips = /* @__PURE__ */ new Map();
		this._selectedChips = /* @__PURE__ */ new Set();
		this._anchorChip = null;
		this._focusingChip = false;
		this._composing = false;
		this._query = null;
		this._status = null;
		this._attributes = /* @__PURE__ */ new Map();
		if (this._editor) this._setupEditor();
		this._hiddenInput = null;
		this._menuInstance = null;
		this._ownsInput = false;
		this._inputDisabled = false;
		this._extraInputs = [];
		this._initialSelection = this._getSelectedItems();
		this._form = null;
		this._menuEventHandlers = /* @__PURE__ */ new Map();
		this._changeId = 0;
		this._formObserver = new MutationObserver((records) => {
			this._readInputDisabled(records);
			this.update();
		});
		this._submitHandler = () => this.update();
		this._resetTimeouts = /* @__PURE__ */ new Set();
		this._resetHandler = (event) => {
			const timeout = window.setTimeout(() => {
				this._resetTimeouts.delete(timeout);
				if (!this._element || event.defaultPrevented || event.target !== this._form) return;
				const selected = new Set(this._initialSelection);
				for (const item of SelectorEngine.find(SELECTOR_MENU_ITEM, this._menu)) {
					item.classList.toggle(CLASS_NAME_SELECTED, selected.has(item));
					setAriaAttribute(item, "aria-selected", selected.has(item));
				}
				this._query = null;
				this._selectedChips.clear();
				this._anchorChip = null;
				this.update();
			});
			this._resetTimeouts.add(timeout);
		};
		this._createHiddenInput();
		this._createMenuInstance();
		this.update();
		this._addEventListeners();
	}
	static get Default() {
		return Default$4;
	}
	static get DefaultType() {
		return DefaultType$4;
	}
	static get NAME() {
		return NAME$5;
	}
	toggle() {
		return this._isShown() ? this.hide() : this.show();
	}
	show() {
		return this._showMenu();
	}
	async hide() {
		await this._menuInstance.hide();
	}
	update() {
		this._changeId++;
		this._readInputDisabled(this._formObserver.takeRecords());
		this._syncOptionRoles();
		this._updateToggleText();
		this._updateHiddenInput();
		this._observeFormState();
		if (this._editor && this._activeItem && !this._getVisibleItems().includes(this._activeItem)) this._setActiveItem(null);
	}
	dispose() {
		this._resetTimeouts.forEach((timeout) => clearTimeout(timeout));
		this._readInputDisabled(this._formObserver.takeRecords());
		this._formObserver.disconnect();
		EventHandler.off(this._form, `reset${EVENT_KEY$5}`, this._resetHandler);
		EventHandler.off(this._form, `submit${EVENT_KEY$5}`, this._submitHandler);
		for (const [event, handler] of this._menuEventHandlers) EventHandler.off(this._toggle, event, handler);
		this._removeExtraInputs();
		if (this._hiddenInput && !this._ownsInput) this._hiddenInput.disabled = this._inputDisabled;
		if (this._menuInstance) {
			this._menuInstance.dispose();
			this._menuInstance = null;
		}
		if (this._hiddenInput && this._ownsInput) {
			this._hiddenInput.remove();
			this._hiddenInput = null;
		}
		for (const chip of this._chips.values()) chip.remove();
		if (this._editor) {
			this._editor.classList.remove(CLASS_NAME_SHOW$1);
			this._element.classList.remove(CLASS_NAME_SHOW$1);
			this._menu.classList.remove(CLASS_NAME_SHOW$1);
			this._activeItem?.classList.remove("active");
		}
		this._status?.remove();
		this._menu.style.minWidth = this._menuMinWidth;
		for (const [element, attributes] of this._attributes) for (const [name, value] of attributes) if (value === null) element.removeAttribute(name);
		else element.setAttribute(name, value);
		if (this._ownsMenu) this._menu.remove();
		EventHandler.off(this._menu, EVENT_KEY$5);
		EventHandler.off(this._toggle, EVENT_KEY$5);
		EventHandler.off(this._searchInput, EVENT_KEY$5);
		super.dispose();
	}
	getValues() {
		return this._getSelectedItems().map((item) => item.dataset.bsValue ?? "");
	}
	add(value) {
		if (this._isDisabled() || this._config.multiple && this._config.maxItems !== null && this.getValues().length >= this._config.maxItems) return null;
		let item = SelectorEngine.find(SELECTOR_MENU_ITEM, this._menu).find((option) => option.dataset.bsValue === value);
		if (!item && this._config.allowCustom && value.trim()) {
			item = document.createElement("button");
			item.setAttribute("type", "button");
			item.className = "menu-item";
			item.dataset.bsValue = value;
			item.textContent = value;
			this._menu.append(item);
		}
		if (!item || item.classList.contains(CLASS_NAME_SELECTED) || isDisabled(item)) return null;
		this._selectItem(item);
		return this._element && item.classList.contains(CLASS_NAME_SELECTED) ? this._chips.get(item) ?? item : null;
	}
	remove(value) {
		const item = this._getSelectedItems().find((option) => typeof value === "string" ? option.dataset.bsValue === value : option === value || this._chips.get(option) === value);
		if (!item || isDisabled(item) || this._isDisabled()) return false;
		return this._removeItems([item]);
	}
	clear() {
		this._clearSelection(null);
	}
	_clearSelection(query) {
		this._removeItems(this._getSelectedItems(), query);
	}
	focus() {
		this._toggle?.focus();
	}
	getSelectedValues() {
		return this._getSelectedItems().filter((item) => this._selectedChips.has(this._chips.get(item))).map((item) => item.dataset.bsValue ?? "");
	}
	selectChip(chip, options = {}) {
		const chips = this._getChipElements();
		if (this._isDisabled() || !chips.includes(chip)) return;
		const previous = new Set(this._selectedChips);
		const { addToSelection = false, rangeSelect = false } = options;
		if (rangeSelect && this._anchorChip && chips.includes(this._anchorChip)) {
			const anchor = chips.indexOf(this._anchorChip);
			const target = chips.indexOf(chip);
			if (!addToSelection) this._selectedChips.clear();
			for (let index = Math.min(anchor, target); index <= Math.max(anchor, target); index++) this._selectedChips.add(chips[index]);
		} else if (addToSelection) if (this._selectedChips.has(chip)) this._selectedChips.delete(chip);
		else {
			this._selectedChips.add(chip);
			this._anchorChip = chip;
		}
		else {
			this._selectedChips = /* @__PURE__ */ new Set([chip]);
			this._anchorChip = chip;
		}
		if (previous.size !== this._selectedChips.size || [...previous].some((element) => !this._selectedChips.has(element))) this._notifyChipSelection();
	}
	clearSelection() {
		this._anchorChip = null;
		if (!this._selectedChips.size) return;
		this._selectedChips.clear();
		this._notifyChipSelection();
	}
	removeSelected() {
		const chips = this._getChipElements();
		const active = document.activeElement?.closest(".chip");
		const index = Math.max(0, chips.indexOf(active));
		const items = this._getSelectedItems().filter((item) => this._selectedChips.has(this._chips.get(item)));
		const changed = this._removeItems(items);
		if (changed && this._element) {
			const remaining = this._getChipElements();
			const target = remaining[Math.min(index, remaining.length - 1)];
			if (target) this._focusChip(target);
			else this._editor.focus();
		}
		return changed;
	}
	_getChipElements() {
		return this._getSelectedItems().filter((item) => !isDisabled(item)).map((item) => this._chips.get(item)).filter((chip) => Boolean(chip));
	}
	_syncChipSelection() {
		for (const chip of this._chips.values()) {
			const selected = this._selectedChips.has(chip);
			chip.classList.toggle("active", selected);
			if (selected) chip.setAttribute("aria-description", "Selected for removal");
			else chip.removeAttribute("aria-description");
		}
	}
	_notifyChipSelection() {
		this._syncChipSelection();
		const items = this._getSelectedItems().filter((item) => this._selectedChips.has(this._chips.get(item)));
		const selected = items.map((item) => item.dataset.bsValue ?? "");
		if (this._status) this._status.textContent = selected.length ? `${selected.length} chip${selected.length === 1 ? "" : "s"} selected for removal` : "Chip selection cleared";
		EventHandler.trigger(this._element, `select${EVENT_KEY$5}`, {
			selected,
			items
		});
	}
	_focusChip(chip, options = {}) {
		this.selectChip(chip, options);
		if (!this._element) return;
		this.hide();
		if (this._element) this._focusSelectedChip(chip);
	}
	_focusSelectedChip(chip) {
		this._focusingChip = true;
		try {
			chip.focus();
		} finally {
			if (this._element) this._focusingChip = false;
		}
	}
	_selectAllChips() {
		const chips = this._getChipElements();
		if (!chips.length) return;
		this._selectedChips = new Set(chips);
		this._anchorChip ??= chips[0];
		this._notifyChipSelection();
	}
	_removeItems(items, query = null) {
		if (this._isDisabled() || !items.length) return false;
		const allowed = [];
		const changeId = this._changeId;
		for (const item of items) {
			if (isDisabled(item)) continue;
			const event = EventHandler.trigger(this._element, `remove${EVENT_KEY$5}`, {
				value: item.dataset.bsValue,
				item
			});
			if (!this._element || changeId !== this._changeId) return false;
			if (!event.defaultPrevented) allowed.push(item);
		}
		for (const item of allowed) {
			item.classList.remove(CLASS_NAME_SELECTED);
			setAriaAttribute(item, "aria-selected", false);
		}
		if (allowed.length) this._selectionChanged(allowed.length === 1 ? allowed[0] : null, query);
		return allowed.length > 0;
	}
	_isDisabled() {
		return isDisabled(this._element) || isDisabled(this._toggle) || this._toggle.matches(":disabled");
	}
	_setAttribute(element, name, value) {
		if (!this._attributes.has(element)) this._attributes.set(element, /* @__PURE__ */ new Map());
		const attributes = this._attributes.get(element);
		if (!attributes.has(name)) attributes.set(name, element.getAttribute(name));
		element.setAttribute(name, value);
	}
	_syncOptionRoles() {
		if (!this._menu.id) this._setAttribute(this._menu, "id", getUID("combobox-"));
		this._setAttribute(this._toggle, "aria-controls", this._menu.id);
		this._setAttribute(this._toggle, "aria-haspopup", "listbox");
		this._setAttribute(this._menu, "role", "listbox");
		if (this._config.multiple) this._setAttribute(this._menu, "aria-multiselectable", "true");
		for (const item of SelectorEngine.find(SELECTOR_MENU_ITEM, this._menu)) {
			this._setAttribute(item, "role", "option");
			this._setAttribute(item, "aria-selected", String(item.classList.contains(CLASS_NAME_SELECTED)));
		}
	}
	_setupEditor() {
		const editor = this._editor;
		if (this._config.placeholder && !editor.placeholder) this._setAttribute(editor, "placeholder", this._config.placeholder);
		if (!this._menu.id) this._setAttribute(this._menu, "id", getUID("combobox-"));
		this._setAttribute(editor, "role", "combobox");
		this._setAttribute(editor, "aria-autocomplete", "list");
		this._setAttribute(editor, "aria-expanded", "false");
		this._setAttribute(editor, "aria-controls", this._menu.id);
		this._setAttribute(editor, "autocomplete", "off");
		this._setAttribute(editor, "aria-activedescendant", "");
		editor.removeAttribute("aria-activedescendant");
		this._setAttribute(this._menu, "role", "listbox");
		if (this._config.multiple) this._setAttribute(this._menu, "aria-multiselectable", "true");
		this._status = document.createElement("span");
		this._status.className = "visually-hidden";
		this._status.setAttribute("role", "status");
		this._menu.after(this._status);
	}
	_getItemLabel(item) {
		return SelectorEngine.findOne(".menu-item-content > span:first-child", item)?.textContent ?? item.textContent.trim();
	}
	_renderEditor() {
		const editor = this._editor;
		const selected = this._getSelectedItems();
		const selectedSet = new Set(selected);
		for (const [item, chip] of this._chips) if (!selectedSet.has(item)) {
			chip.remove();
			this._chips.delete(item);
			this._selectedChips.delete(chip);
			if (this._anchorChip === chip) this._anchorChip = null;
		}
		for (const item of SelectorEngine.find(SELECTOR_MENU_ITEM, this._menu)) {
			if (!item.id) this._setAttribute(item, "id", getUID("combobox-option-"));
			this._setAttribute(item, "tabindex", "-1");
		}
		if (!this._config.multiple) {
			const value = this._query ?? (selected.length ? this._getItemLabel(selected[0]) : "");
			if (editor.value !== value) editor.value = value;
			return;
		}
		let next = this._hiddenInput?.parentElement === editor.parentElement && this._hiddenInput.compareDocumentPosition(editor) === Node.DOCUMENT_POSITION_FOLLOWING ? this._hiddenInput : editor;
		for (let index = selected.length - 1; index >= 0; index--) {
			const item = selected[index];
			let chip = this._chips.get(item);
			const label = this._getItemLabel(item);
			if (!chip) {
				chip = document.createElement("span");
				chip.className = "chip";
				chip.tabIndex = -1;
				const text = document.createElement("span");
				const button = document.createElement("button");
				button.type = "button";
				button.className = "chip-dismiss";
				button.innerHTML = DISMISS_ICON;
				chip.append(text, button);
				this._chips.set(item, chip);
			}
			this._updateChipState(item, chip, label);
			if (chip.nextElementSibling !== next) next.before(chip);
			next = chip;
		}
		this._syncChipSelection();
		const value = this._query ?? "";
		if (editor.value !== value) editor.value = value;
		this._menuInstance?.update();
	}
	_updateChipState(item, chip, label) {
		chip.firstElementChild.textContent = label;
		const button = chip.lastElementChild;
		button.setAttribute("aria-label", `Remove ${label}`);
		button.disabled = this._isDisabled() || isDisabled(item);
		chip.setAttribute("role", "group");
		chip.setAttribute("aria-label", label);
		chip.classList.toggle("disabled", button.disabled);
		if (button.disabled) {
			chip.setAttribute("aria-disabled", "true");
			this._selectedChips.delete(chip);
			if (this._anchorChip === chip) this._anchorChip = null;
		} else chip.removeAttribute("aria-disabled");
	}
	_setActiveItem(item) {
		this._activeItem?.classList.remove("active");
		this._activeItem = item;
		if (!item) {
			this._editor.removeAttribute("aria-activedescendant");
			return;
		}
		item.classList.add("active");
		this._editor.setAttribute("aria-activedescendant", item.id);
		item.scrollIntoView({ block: "nearest" });
	}
	_addEditorListeners() {
		const editor = this._editor;
		EventHandler.on(this._menu, `mousedown${EVENT_KEY$5}`, SELECTOR_MENU_ITEM, (event) => event.preventDefault());
		EventHandler.on(editor, `input${EVENT_KEY$5}`, (event) => {
			if (this._composing || event.isComposing) {
				this._query = editor.value;
				return;
			}
			if (this._isDisabled()) return;
			this._handleEditorInput();
		});
		EventHandler.on(editor, `compositionstart${EVENT_KEY$5}`, () => {
			this._composing = true;
		});
		EventHandler.on(editor, `compositionend${EVENT_KEY$5}`, () => {
			this._composing = false;
			if (this._element && !this._isDisabled()) this._handleEditorInput(document.activeElement === editor);
		});
		EventHandler.on(editor, `paste${EVENT_KEY$5}`, (event) => {
			const { separator, allowCustom } = this._config;
			const text = event.clipboardData?.getData("text") ?? "";
			if (!allowCustom || !separator || !text.includes(separator) || this._isDisabled()) return;
			event.preventDefault();
			for (const value of text.split(separator)) {
				this.add(value.trim());
				if (!this._element) return;
			}
		});
		EventHandler.on(editor, `blur${EVENT_KEY$5}`, (event) => {
			if (!this._composing && this._config.allowCustom && this._config.createOnBlur && !event.relatedTarget?.closest(".chip, .menu")) this.add(editor.value.trim());
		});
		EventHandler.on(editor, `focus${EVENT_KEY$5}`, () => this.clearSelection());
		EventHandler.on(this._element, `mousedown${EVENT_KEY$5}`, ".chip", (event) => {
			if (!event.target.closest(".chip-dismiss")) event.preventDefault();
		});
		EventHandler.on(this._element, `focusin${EVENT_KEY$5}`, ".chip", (event) => {
			if (this._focusingChip || this._isDisabled()) return;
			const chip = event.target.closest(".chip");
			if (!this._selectedChips.has(chip)) this.selectChip(chip);
			if (this._element) this.hide();
		});
		EventHandler.on(this._element, `click${EVENT_KEY$5}`, ".chip", (event) => {
			if (event.target.closest(".chip-dismiss") || this._isDisabled()) return;
			event.preventDefault();
			event.stopPropagation();
			const chip = event.target.closest(".chip");
			this._focusChip(chip, {
				addToSelection: event.metaKey || event.ctrlKey,
				rangeSelect: event.shiftKey
			});
		});
		EventHandler.on(this._element, `keydown${EVENT_KEY$5}`, ".chip", (event) => this._handleChipKeydown(event));
		EventHandler.on(this._element, `click${EVENT_KEY$5}`, ".chip-dismiss", (event) => {
			event.preventDefault();
			event.stopPropagation();
			const chip = event.target.closest(".chip");
			this.remove(chip);
			if (this._element) editor.focus();
		});
	}
	_handleEditorInput(openMenu = true) {
		const editor = this._editor;
		let query = editor.value;
		if (this._config.allowCustom && this._config.separator && query.includes(this._config.separator)) {
			const parts = query.split(this._config.separator);
			query = parts.pop();
			for (const part of parts) {
				this.add(part.trim());
				if (!this._element) return;
			}
		}
		if (!this._config.multiple && this._getSelectedItems().length) {
			this._clearSelection(query);
			if (!this._element) return;
			if (this._getSelectedItems().length) {
				this._query = null;
				this._renderEditor();
				return;
			}
		}
		this._query = query;
		if (editor.value !== query) editor.value = query;
		this._filterItems(query);
		this._setActiveItem(null);
		if (openMenu && this._getVisibleItems().length) this.show();
		else this.hide();
	}
	_handleEditorKeydown(event) {
		if (this._composing || event.isComposing || event.keyCode === 229 || this._isDisabled()) return;
		const editor = this._editor;
		if ([ARROW_DOWN_KEY$1, ARROW_UP_KEY$1].includes(event.key)) {
			event.preventDefault();
			const items = this._getVisibleItems();
			if (items.length) {
				const item = getNextActiveElement(items, this._activeItem, event.key === ARROW_DOWN_KEY$1, true);
				this.show();
				if (this._element) this._setActiveItem(item);
			}
			return;
		}
		if (event.key === ENTER_KEY) {
			if (this._activeItem && this._isShown()) {
				event.preventDefault();
				this._selectItem(this._activeItem);
			} else if (this._config.allowCustom && editor.value.trim()) {
				event.preventDefault();
				this.add(editor.value.trim());
			}
			return;
		}
		if (event.key === ESCAPE_KEY || event.key === TAB_KEY) {
			if (event.key === ESCAPE_KEY && this._isShown()) event.preventDefault();
			this.hide();
			if (this._element) this._setActiveItem(null);
			return;
		}
		this._handleEditorChipFocus(event);
	}
	_handleEditorChipFocus(event) {
		const editor = this._editor;
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "a" && !editor.value) {
			const chips = this._getChipElements();
			if (chips.length) {
				event.preventDefault();
				this._selectAllChips();
				if (this._element) {
					this.hide();
					if (this._element) this._focusSelectedChip(chips.at(-1));
				}
			}
			return;
		}
		if (event.metaKey || event.ctrlKey || event.altKey) return;
		const previousKey = getComputedStyle(editor).direction === "rtl" ? "ArrowRight" : "ArrowLeft";
		const backwardDelete = ["Backspace", "Delete"].includes(event.key) && !editor.value;
		const atStart = event.key === previousKey && editor.selectionStart === 0 && editor.selectionEnd === 0;
		if (backwardDelete || atStart) {
			const chip = this._getChipElements().at(-1);
			if (chip) {
				event.preventDefault();
				this._focusChip(chip, { addToSelection: event.shiftKey });
			}
		}
	}
	_handleChipKeydown(event) {
		if (this._composing || event.isComposing || event.keyCode === 229 || this._isDisabled()) return;
		const chip = event.target.closest(".chip");
		const chips = this._getChipElements();
		const index = chips.indexOf(chip);
		if (index === -1) return;
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "a") {
			event.preventDefault();
			this._selectAllChips();
			return;
		}
		if (["Backspace", "Delete"].includes(event.key)) {
			event.preventDefault();
			this._deleteChipSelection(chip);
			return;
		}
		const rtl = getComputedStyle(this._editor).direction === "rtl";
		if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
			event.preventDefault();
			const next = index + (event.key === "ArrowRight" === rtl ? -1 : 1);
			if (next >= chips.length) {
				this.clearSelection();
				if (this._element) this._editor.focus();
			} else this._focusChip(chips[Math.max(0, next)], { rangeSelect: event.shiftKey });
		} else if (event.key === HOME_KEY$1 || event.key === END_KEY$1 && event.shiftKey) {
			event.preventDefault();
			const target = event.key === HOME_KEY$1 ? chips[0] : chips.at(-1);
			this._focusChip(target, { rangeSelect: event.shiftKey });
		} else if ([END_KEY$1, ESCAPE_KEY].includes(event.key)) {
			event.preventDefault();
			this.clearSelection();
			if (this._element) this._editor.focus();
		}
	}
	_deleteChipSelection(chip) {
		if (!this._selectedChips.has(chip)) this.selectChip(chip);
		if (this._element) this.removeSelected();
	}
	_isShown() {
		return this._menu.classList.contains(CLASS_NAME_SHOW$1);
	}
	_configAfterMerge(config) {
		if (config.maxItems !== null && (!Number.isSafeInteger(config.maxItems) || config.maxItems < 1)) throw new TypeError("COMBOBOX: Option \"maxItems\" must be a positive integer or null.");
		if (config.input !== null) {
			const input = getElement(config.input);
			if (!(input instanceof HTMLInputElement) || input.type !== "hidden") throw new TypeError("COMBOBOX: Option \"input\" must reference a hidden input.");
			config.input = input;
		}
		return config;
	}
	_createHiddenInput() {
		if (this._config.input) {
			this._hiddenInput = this._config.input;
			this._inputDisabled = this._hiddenInput.disabled;
			return;
		}
		if (!this._config.name) return;
		this._hiddenInput = document.createElement("input");
		this._hiddenInput.type = "hidden";
		this._hiddenInput.name = this._config.name;
		(this._editor ? this._element : this._toggle).before(this._hiddenInput);
		this._ownsInput = true;
	}
	_removeExtraInputs() {
		for (const input of this._extraInputs) input.remove();
		this._extraInputs = [];
	}
	_readInputDisabled(records) {
		if (!this._ownsInput && records.some((record) => record.target === this._hiddenInput && record.attributeName === "disabled")) this._inputDisabled = this._hiddenInput.disabled;
	}
	_observeFormState() {
		this._formObserver.disconnect();
		if (this._element !== this._toggle) this._formObserver.observe(this._element, {
			attributes: true,
			attributeFilter: ["class"]
		});
		this._formObserver.observe(this._toggle, {
			attributes: true,
			attributeFilter: [
				"disabled",
				"class",
				"form"
			]
		});
		if (this._hiddenInput) this._formObserver.observe(this._hiddenInput, {
			attributes: true,
			attributeFilter: [
				"disabled",
				"name",
				"form"
			]
		});
		const fieldsets = /* @__PURE__ */ new Set();
		for (const element of [this._toggle, this._hiddenInput]) for (let parent = element?.parentElement; parent; parent = parent.parentElement) if (parent.matches("fieldset")) fieldsets.add(parent);
		for (const fieldset of fieldsets) this._formObserver.observe(fieldset, {
			attributes: true,
			attributeFilter: ["disabled"]
		});
		const form = this._hiddenInput ? this._hiddenInput.form : this._toggle instanceof HTMLInputElement || this._toggle instanceof HTMLButtonElement ? this._toggle.form : this._toggle.closest("form");
		if (form !== this._form) {
			EventHandler.off(this._form, `reset${EVENT_KEY$5}`, this._resetHandler);
			EventHandler.off(this._form, `submit${EVENT_KEY$5}`, this._submitHandler);
			this._form = form;
			EventHandler.on(this._form, `reset${EVENT_KEY$5}`, this._resetHandler);
			EventHandler.on(this._form, `submit${EVENT_KEY$5}`, this._submitHandler);
		}
	}
	async _showMenu(focus) {
		if (this._isDisabled() || this._isShown() || this._editor && !this._getVisibleItems().length) return;
		const search = this._editor || isDisabled(this._searchInput) ? null : this._searchInput;
		await this._menuInstance.show(focus ?? (search ? () => search.focus({ preventScroll: true }) : void 0));
	}
	_createMenuInstance() {
		this._menuInstance = new ComboboxMenu(this._toggle, {
			menu: this._menu,
			reference: this._editor ? this._element : "toggle",
			autoClose: this._config.multiple ? "outside" : true,
			boundary: this._config.boundary,
			offset: this._config.offset,
			placement: this._config.placement,
			floatingConfig: this._editor ? (config) => ({
				...config,
				middleware: [...config.middleware, {
					name: "comboboxSize",
					fn: ({ elements, rects }) => {
						if (this._element) elements.floating.style.minWidth = `${rects.reference.width}px`;
						return {};
					}
				}]
			}) : null
		});
	}
	_addEventListeners() {
		for (const type of [
			"show",
			"shown",
			"hide",
			"hidden"
		]) {
			const event = Menu.eventName(type);
			const handler = (menuEvent) => {
				if (!this._element) return;
				if (type === "hidden" && this._editor) this._setActiveItem(null);
				if (EventHandler.trigger(this._element, this.constructor.eventName(type))?.defaultPrevented || !this._element) {
					menuEvent.preventDefault();
					return;
				}
				if (type === "show" && !menuEvent.defaultPrevented && this._searchInput && !this._editor) {
					this._searchInput.value = "";
					this._filterItems("");
				}
			};
			this._menuEventHandlers.set(event, handler);
			EventHandler.on(this._toggle, event, handler);
		}
		EventHandler.on(this._menu, `click${EVENT_KEY$5}`, SELECTOR_MENU_ITEM, (event) => {
			const item = event.target.closest(SELECTOR_MENU_ITEM);
			if (!item || isDisabled(item)) return;
			event.preventDefault();
			event.stopPropagation();
			this._selectItem(item);
		});
		EventHandler.on(this._toggle, `keydown${EVENT_KEY$5}`, (event) => {
			if (this._editor) this._handleEditorKeydown(event);
			else this._handleToggleKeydown(event);
		});
		EventHandler.on(this._menu, `keydown${EVENT_KEY$5}`, (event) => {
			this._handleMenuKeydown(event);
		});
		if (this._editor) {
			this._addEditorListeners();
			return;
		}
		if (this._searchInput) {
			EventHandler.on(this._toggle, `mousedown${EVENT_KEY$5}`, (event) => {
				if (event.button === 0 && !this._isShown() && !this._isDisabled() && !isDisabled(this._searchInput)) event.preventDefault();
			});
			EventHandler.on(this._searchInput, `input${EVENT_KEY$5}`, () => {
				this._filterItems(this._searchInput.value);
			});
			EventHandler.on(this._searchInput, `keydown${EVENT_KEY$5}`, (event) => {
				if (event.isComposing || event.keyCode === 229) return;
				if (event.key === ARROW_DOWN_KEY$1) {
					event.preventDefault();
					const items = this._getVisibleItems();
					if (items.length > 0) items[0].focus();
				}
				if (event.key === ESCAPE_KEY) {
					this.hide();
					this._toggle?.focus();
				}
			});
		}
	}
	_selectItem(item) {
		if (this._isDisabled() || isDisabled(item) || !this._menu.contains(item)) return;
		const previous = this._getSelectedItems();
		if (this._config.multiple && !previous.includes(item) && this._config.maxItems !== null && previous.length >= this._config.maxItems) return;
		if (!this._config.multiple && previous.length === 1 && previous[0] === item) return;
		const changeId = this._changeId;
		const type = this._config.multiple && previous.includes(item) ? "remove" : "add";
		const event = EventHandler.trigger(this._element, `${type}${EVENT_KEY$5}`, {
			value: item.dataset.bsValue,
			item
		});
		if (!this._element || event.defaultPrevented || changeId !== this._changeId || this._isDisabled() || isDisabled(item) || !this._menu.contains(item)) return;
		if (this._config.multiple) {
			item.classList.toggle(CLASS_NAME_SELECTED);
			setAriaAttribute(item, "aria-selected", item.classList.contains(CLASS_NAME_SELECTED));
		} else {
			for (const selected of previous) {
				selected.classList.remove(CLASS_NAME_SELECTED);
				selected.setAttribute("aria-selected", "false");
			}
			item.classList.add(CLASS_NAME_SELECTED);
			item.setAttribute("aria-selected", "true");
		}
		this._selectionChanged(item);
	}
	_selectionChanged(item, query = null) {
		this._query = query;
		this.update();
		const changeId = this._changeId;
		const { multiple } = this._config;
		const values = this.getValues();
		const value = multiple ? values : values[0] ?? "";
		const target = this._hiddenInput ?? this._element;
		for (const event of ["input", "change"]) {
			EventHandler.trigger(target, event);
			if (!this._element || changeId !== this._changeId) return;
		}
		EventHandler.trigger(this._element, EVENT_CHANGE$1, {
			value,
			item
		});
		if (!this._element || changeId !== this._changeId) return;
		if (this._editor) {
			this._setActiveItem(null);
			this._filterItems("");
			if (this._status) this._status.textContent = `${values.length} selected`;
		}
		if (!multiple && query === null) {
			this.hide();
			this._toggle?.focus();
		}
	}
	_updateToggleText() {
		if (this._editor) {
			this._renderEditor();
			return;
		}
		const selectedItems = this._getSelectedItems();
		if (selectedItems.length === 0) {
			this._showPlaceholder();
			return;
		}
		this._valueDisplay.classList.remove(CLASS_NAME_PLACEHOLDER);
		if (this._config.multiple && selectedItems.length > 1) this._valueDisplay.textContent = `${selectedItems.length} selected`;
		else {
			const item = selectedItems[0];
			const label = SelectorEngine.findOne(".menu-item-content > span:first-child", item);
			this._valueDisplay.textContent = label ? label.textContent : item.textContent.trim();
		}
	}
	_showPlaceholder() {
		const { placeholder } = this._config;
		this._valueDisplay.textContent = placeholder;
		this._valueDisplay.classList.toggle(CLASS_NAME_PLACEHOLDER, Boolean(placeholder));
	}
	_updateHiddenInput() {
		const input = this._hiddenInput;
		if (!input) return;
		const selected = this._getSelectedItems();
		const values = selected.filter((item) => !isDisabled(item)).map((item) => item.dataset.bsValue ?? "");
		const submittedValues = this._config.multiple ? values : [values[0] ?? ""];
		const disabled = this._inputDisabled || this._isDisabled() || selected.length > 0 && values.length === 0;
		if (this._ownsInput) {
			const anchor = this._editor ? this._element : this._toggle;
			const fields = [input, ...this._extraInputs];
			if (fields.at(-1).nextElementSibling !== anchor) for (const field of fields) anchor.before(field);
			const form = this._toggle.getAttribute("form");
			if (form === null) input.removeAttribute("form");
			else input.setAttribute("form", form);
		}
		input.value = submittedValues[0] ?? "";
		input.disabled = disabled || submittedValues.length === 0;
		for (let index = 1; index < submittedValues.length; index++) {
			let extra = this._extraInputs[index - 1];
			if (!extra) {
				extra = document.createElement("input");
				extra.type = "hidden";
				this._extraInputs.push(extra);
			}
			const previous = this._extraInputs[index - 2] ?? input;
			if (!previous.parentNode) extra.remove();
			else if (extra.previousElementSibling !== previous) previous.after(extra);
			extra.name = input.name;
			extra.value = submittedValues[index];
			extra.disabled = disabled;
			const form = input.getAttribute("form");
			if (form === null) extra.removeAttribute("form");
			else extra.setAttribute("form", form);
		}
		for (const extra of this._extraInputs.splice(Math.max(0, submittedValues.length - 1))) extra.remove();
		this._formObserver.takeRecords();
	}
	_getSelectedItems() {
		return SelectorEngine.find(`${SELECTOR_MENU_ITEM}.${CLASS_NAME_SELECTED}`, this._menu);
	}
	_getVisibleItems() {
		return SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter((item) => {
			if (!this._editor) return isVisible(item);
			for (let current = item; current && current !== this._menu; current = current.parentElement) {
				const style = getComputedStyle(current);
				if (current.hidden || style.display === "none" || style.visibility === "hidden") return false;
			}
			return true;
		});
	}
	_filterItems(query) {
		const normalizedQuery = this._normalizeText(query.toLowerCase().trim());
		const items = SelectorEngine.find(SELECTOR_MENU_ITEM, this._menu);
		let visibleCount = 0;
		for (const item of items) {
			const text = this._normalizeText(item.textContent.toLowerCase().trim());
			const matches = !normalizedQuery || text.includes(normalizedQuery);
			item.style.display = matches ? "" : "none";
			if (matches) visibleCount++;
		}
		if (this._noResults) this._noResults.classList.toggle("d-none", visibleCount > 0);
	}
	_normalizeText(text) {
		if (this._config.searchNormalize) return text.normalize("NFD").replace(/[\u0300-\u036F]/g, "");
		return text;
	}
	_handleToggleKeydown(event) {
		if (event.isComposing || event.keyCode === 229) return;
		const { key } = event;
		if (key === ARROW_DOWN_KEY$1 || key === ARROW_UP_KEY$1) {
			event.preventDefault();
			const focusItem = () => {
				const items = this._getVisibleItems();
				((key === ARROW_DOWN_KEY$1 ? items[0] : items.at(-1)) ?? (isDisabled(this._searchInput) ? this._toggle : this._searchInput))?.focus();
			};
			if (this._isShown()) focusItem();
			else this._showMenu(focusItem);
			return;
		}
		if (key === ESCAPE_KEY && this._isShown()) {
			event.preventDefault();
			event.stopPropagation();
			this.hide();
			return;
		}
		if ((key === ENTER_KEY || key === SPACE_KEY) && !this._isShown()) {
			event.preventDefault();
			this.show();
		}
	}
	_handleMenuKeydown(event) {
		if (event.isComposing || event.keyCode === 229) return;
		const { key, target } = event;
		if (key === ESCAPE_KEY) {
			event.preventDefault();
			event.stopPropagation();
			this.hide();
			this._toggle?.focus();
			return;
		}
		if (key === TAB_KEY) {
			this.hide();
			return;
		}
		const isInput = target.matches("input");
		if (key === ARROW_DOWN_KEY$1 || key === ARROW_UP_KEY$1) {
			event.preventDefault();
			const items = this._getVisibleItems();
			if (items.length > 0) getNextActiveElement(items, target, key === ARROW_DOWN_KEY$1, !items.includes(target)).focus();
			return;
		}
		if ((key === HOME_KEY$1 || key === END_KEY$1) && !isInput) {
			event.preventDefault();
			const items = this._getVisibleItems();
			if (items.length > 0) (key === HOME_KEY$1 ? items[0] : items.at(-1)).focus();
			return;
		}
		if ((key === ENTER_KEY || key === SPACE_KEY) && !isInput) {
			event.preventDefault();
			const item = target.closest(SELECTOR_MENU_ITEM);
			if (item && !isDisabled(item)) this._selectItem(item);
		}
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function(event) {
	const instance = Combobox.getOrCreateInstance(this);
	if (this.matches("input") || this.querySelector(".combobox-input, .form-ghost")) {
		if (!event.target.closest(".chip")) {
			instance.focus();
			instance.show();
		}
		return;
	}
	event.preventDefault();
	instance.toggle();
});
onDocumentReady("DOMContentLoaded", () => {
	for (const toggle of SelectorEngine.find(SELECTOR_DATA_TOGGLE$4)) Combobox.getOrCreateInstance(toggle);
});
// node_modules/vanilla-calendar-pro/index.mjs
/*! name: vanilla-calendar-pro v3.4.1 | url: https://github.com/uvarov-frontend/vanilla-calendar-pro */
var e = (e) => /* @__PURE__ */ new Date(`${e}T00:00:00`);
var t = (e) => `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
var n = (n, a) => n.reduce((n, l) => {
	if (l instanceof Date || "number" == typeof l) {
		let e = l instanceof Date ? l : new Date(l);
		n.push(t(e));
	} else l.match(/^(\d{4}-\d{2}-\d{2})$/g) ? n.push(l) : l.replace(/(\d{4}-\d{2}-\d{2}).*?(\d{4}-\d{2}-\d{2})/g, (l, o, r) => {
		var i;
		let s = `${o}:${r}`, c = a ? a.start.getTime() : -1 / 0, d = null == a || null == (i = a.cursors) ? void 0 : i.get(s), u = void 0 !== d && d <= c ? new Date(d) : e(o), m = e(r).setHours(23, 59, 59, 999);
		if (a) {
			if (m < c) return l;
			m = Math.min(m, new Date(a.end).setHours(23, 59, 59, 999));
		}
		let p = !1;
		for (let e = u.getTime(); e <= m; e = u.setDate(u.getDate() + 1)) (!a || e >= c) && (null != a && a.cursors && !p && (a.cursors.set(s, e), p = !0), n.push(t(u)));
		return l;
	});
	return n;
}, []);
var a = (e, t) => {
	if (t && t.values.length === e.length) {
		let n = 0;
		for (; n < e.length && t.values[n] === e[n];) n++;
		if (n === e.length) return t;
	}
	return {
		values: e.slice(),
		set: new Set(e)
	};
};
var l = /* @__PURE__ */ new WeakMap();
var o = (e) => {
	var t;
	let o = null != (t = e.selectedHolidays) && t[0] ? e.selectedHolidays : [], r = JSON.stringify(o.map((e) => e instanceof Date ? e.getTime() : e)), i = l.get(e);
	l.set(e, {
		holidayKey: r,
		holidays: (null == i ? void 0 : i.holidayKey) === r ? i.holidays : new Set(n(o)),
		selected: a(e.context.selectedDates, null == i ? void 0 : i.selected),
		disabled: a(e.context.disableDates, null == i ? void 0 : i.disabled),
		enabled: a(e.context.enableDates, null == i ? void 0 : i.enabled),
		min: Date.parse(`${e.context.displayDateMin}T00:00:00`),
		max: Date.parse(`${e.context.displayDateMax}T00:00:00`),
		first: Date.parse(`${e.context.selectedDates[0]}T00:00:00`),
		last: Date.parse(`${e.context.selectedDates[e.context.selectedDates.length - 1]}T00:00:00`)
	});
};
var r = (e) => l.get(e);
var i = [
	"motion",
	"time",
	"annotations",
	"weeks",
	"months"
];
var s = /* @__PURE__ */ new WeakMap();
var c = {};
var d = /* @__PURE__ */ Object.freeze([]);
var u = (e) => {
	var t;
	return null == (t = s.get(e)) ? c : t;
};
var m = (e, t = e) => {
	if (t.extensions && t.extensions !== e.extensions && (new Set(t.extensions).size !== e.extensions.length || t.extensions.some((t) => !e.extensions.includes(t)))) throw Error("Calendar extensions are fixed at construction. Create a new Calendar to change them.");
	let n = u(e), a = (e, t, a) => {
		if (e && !n[t]) throw Error(`The "${a}" option requires ${t}. Import { ${t} } from 'vanilla-calendar-pro' and add it to extensions: [${t}].`);
	};
	a(t.animation || t.enableSwipe, "motion", t.animation ? "animation" : "enableSwipe"), a(t.selectionTimeMode, "time", "selectionTimeMode"), a(t.popups && Object.keys(t.popups).length || t.onCreateDateRangeTooltip, "annotations", t.onCreateDateRangeTooltip ? "onCreateDateRangeTooltip" : "popups"), a("multiple" === t.type, "months", "type"), a("week" === t.type || t.enableCollapse || t.enableWeekNumbers || t.onClickWeekDay, "weeks", "week" === t.type ? "type" : t.enableCollapse ? "enableCollapse" : t.enableWeekNumbers ? "enableWeekNumbers" : "onClickWeekDay");
};
var p = (e, t, n) => {
	var a;
	return null == (a = u(e).annotations) ? void 0 : a.tooltip(e, t, n);
};
var h = /* @__PURE__ */ new WeakMap();
var v = (e) => {
	let t = h.get(e);
	return t || (t = {
		lastDateEl: null,
		isHovering: !1,
		rangeMin: void 0,
		rangeMax: void 0,
		tooltipEl: null,
		timeoutId: null,
		frameId: null
	}, h.set(e, t)), t;
};
var y = (e) => {
	e.context.mainElement.querySelectorAll("[data-vc-date-hover]").forEach((e) => e.removeAttribute("data-vc-date-hover"));
};
var g = (e, t, n) => {
	e.context[t] = n;
};
var f = (e, t) => void 0 === t || ("function" == typeof t ? t(e) : t);
var x = (e) => f(e, e.enableDateToggle);
var b = (e) => {
	if (e.length < 3 || e.includes(void 0)) return e.sort((e, t) => +new Date(e) - new Date(t));
	let t = e.map((e) => ({
		date: e,
		time: +new Date(e)
	}));
	return t.sort((e, t) => e.time - t.time), t.forEach((t, n) => e[n] = t.date), e;
};
var D = (e) => {
	var t;
	let n = h.get(e);
	n && (null == (t = n.cleanup) || t.call(n), n.cleanup = void 0, null !== n.timeoutId && clearTimeout(n.timeoutId), null !== n.frameId && cancelAnimationFrame(n.frameId), n.lastDateEl = null, n.tooltipEl = null, n.timeoutId = null, n.frameId = null, h.delete(e));
};
var M = (a, l, o = !0) => {
	let r = v(a);
	if (r.lastDateEl = l, y(a), !r.cleanup) {
		let n = a.context.mainElement, l = ((n) => (a) => {
			if (!n.context.selectedDates[0] || 1 !== n.context.selectedDates.length && !n.onCreateDateRangeTooltip) return;
			let l = v(n);
			if (l.isHovering) return;
			let o = a.target;
			l.isHovering = !0, l.frameId = requestAnimationFrame(() => {
				var a;
				l.frameId = null, l.isHovering = !1, !n.context.isDestroyed && n.context.mainElement.contains(o) && (1 === n.context.selectedDates.length ? ((n, a) => {
					var l;
					let o = v(n);
					if (n.context.mainElement.hasAttribute("data-vc-dragging") || !a || null == n || null == (l = n.context) || !l.selectedDates[0]) return;
					if (!a.closest("[data-vc=\"dates\"]")) return o.lastDateEl = null, p(n, o.tooltipEl, null), void y(n);
					let r = a.closest("[data-vc-date]");
					if (!r || o.lastDateEl === r) return;
					o.lastDateEl = r, p(n, o.tooltipEl, r), y(n);
					let i = r.dataset.vcDate, s = e(n.context.selectedDates[0]), c = e(i), [d, u] = s < c ? [s, c] : [c, s], [m, h] = s < c ? [n.context.selectedDates[0], i] : [i, n.context.selectedDates[0]], g = new Set(n.context.disableDates), f = new Date(d);
					for (; f <= u && g.has(t(f));) f.setDate(f.getDate() + 1);
					f <= u && n.context.mainElement.querySelectorAll("[data-vc-date]").forEach((t) => {
						let n = t.dataset.vcDate;
						if (n === m || n === h) t.dataset.vcDateHover = m === h ? "first-and-last" : n === m ? "first" : "last";
						else {
							let a = e(n);
							a >= d && a <= u && !g.has(n) && (t.dataset.vcDateHover = "");
						}
					});
				})(n, o) : n.context.selectedDates[0] && n.onCreateDateRangeTooltip && (null == (a = u(n).annotations) || a.hover(n, o)));
			});
		})(a), o = () => ((e) => {
			let t = v(e);
			null !== t.timeoutId && clearTimeout(t.timeoutId), t.timeoutId = setTimeout(() => {
				t.timeoutId = null, !e.context.isDestroyed && (t.lastDateEl = null, p(e, t.tooltipEl, null), y(e));
			}, 50);
		})(a), i = (e) => ((e, t) => {
			if ("Escape" !== t.key || 1 !== e.context.selectedDates.length) return;
			let n = v(e);
			n.lastDateEl = null, g(e, "selectedDates", []), p(e, n.tooltipEl, null), y(e);
		})(a, e);
		n.addEventListener("mousemove", l), n.addEventListener("mouseleave", o), n.addEventListener("keydown", i), r.cleanup = () => {
			n.removeEventListener("mousemove", l), n.removeEventListener("mouseleave", o), n.removeEventListener("keydown", i);
		};
	}
	a.disableDatesGaps && (r.rangeMin ??= a.context.displayDateMin, r.rangeMax ??= a.context.displayDateMax), r.tooltipEl = a.onCreateDateRangeTooltip ? a.context.mainElement.querySelector("[data-vc-date-range-tooltip]") : null;
	let i = null == l ? void 0 : l.dataset.vcDate;
	if (i) {
		let e = 1 === a.context.selectedDates.length && a.context.selectedDates[0].includes(i);
		g(a, "selectedDates", e && !x(a) ? [i, i] : e && x(a) ? [] : a.context.selectedDates.length > 1 ? [i] : [...a.context.selectedDates, i]), a.context.selectedDates.length > 1 && b(a.context.selectedDates);
	}
	({
		set: () => {
			a.disableDatesGaps && ((n) => {
				var a, l;
				if (null == n || null == (a = n.context) || null == (a = a.selectedDates) || !a[0] || null == (l = n.context.disableDates) || !l[0]) return;
				let o = e(n.context.selectedDates[0]), [r, i] = n.context.disableDates.map((t) => e(t)).reduce(([e, t], n) => [o >= n ? n : e, o < n && null === t ? n : t], [null, null]);
				r && g(n, "displayDateMin", t(new Date(r.setDate(r.getDate() + 1)))), i && g(n, "displayDateMax", t(new Date(i.setDate(i.getDate() - 1)))), n.disableDatesPast && !n.disableAllDates && e(n.context.displayDateMin) < e(n.context.dateToday) && g(n, "displayDateMin", n.context.dateToday);
			})(a), p(a, r.tooltipEl, l);
		},
		reset: () => {
			if (!o) return;
			let [e, t] = [a.context.selectedDates[0], a.context.selectedDates[a.context.selectedDates.length - 1]];
			g(a, "selectedDates", a.context.selectedDates[0] === a.context.selectedDates[a.context.selectedDates.length - 1] ? [a.context.selectedDates[0], a.context.selectedDates[0]] : a.enableEdgeDatesOnly ? [e, t] : (() => {
				let l = new Set(a.context.disableDates);
				return n([`${e}:${t}`]).filter((e) => !l.has(e));
			})()), a.disableDatesGaps && (g(a, "displayDateMin", r.rangeMin), g(a, "displayDateMax", r.rangeMax)), a.onCreateDateRangeTooltip && p(a, r.tooltipEl, a.context.selectedDates[0] ? l : null);
		}
	})[1 === a.context.selectedDates.length ? "set" : "reset"]();
};
var w = (e) => e.getRootNode ? e.getRootNode() : document;
var E = /* @__PURE__ */ new WeakSet();
var k = "data-vc-prev-tabindex";
var T = (e) => e.tabIndex >= 0 && !e.hasAttribute("disabled") && "true" !== e.getAttribute("aria-disabled");
var A = (e) => {
	if (e.hasAttribute(k)) return;
	let t = e.getAttribute("tabindex");
	e.setAttribute(k, null == t ? "" : t);
};
var C = (e) => {
	if (!e.hasAttribute(k)) return;
	let t = e.getAttribute(k);
	"" === t || null === t ? e.removeAttribute("tabindex") : e.setAttribute("tabindex", t), e.removeAttribute(k);
};
var S = (e) => {
	e.setAttribute("inert", ""), e.ariaHidden = "true", ((e) => {
		T(e) && (A(e), e.tabIndex = -1);
		let t = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, { acceptNode: (e) => T(e) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP });
		for (; t.nextNode();) {
			let e = t.currentNode;
			A(e), e.tabIndex = -1;
		}
	})(e);
};
var $ = (e) => {
	var t;
	if (O(e), !e.context.isShowInInputMode || !e.context.currentType) return;
	let n = e.context.mainElement.contains(w(e.context.mainElement).activeElement);
	e.context.mainElement.dataset.vcCalendarHidden = "", g(e, "isShowInInputMode", !1), e.inputMode && S(e.context.mainElement), null != (t = e.context.inputElement) && t.hasAttribute("aria-expanded") && e.context.inputElement.setAttribute("aria-expanded", "false"), e.context.cleanupHandlers[0] && (e.context.cleanupHandlers.forEach((e) => e()), g(e, "cleanupHandlers", [])), e.inputMode && e.context.inputElement && n && (("function" == typeof e.openOnFocus || !0 === e.openOnFocus) && ((e) => {
		E.add(e);
	})(e), e.context.inputElement.focus()), e.onHide && e.onHide(e);
};
var Y = (e) => {
	let t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, { acceptNode: (e) => {
		let t = e;
		return t.hasAttribute("inert") ? NodeFilter.FILTER_REJECT : t.tabIndex >= 0 && !t.hasAttribute("disabled") && "true" !== t.getAttribute("aria-disabled") && "hidden" !== t.style.visibility ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	} });
	for (; n.nextNode();) t.push(n.currentNode);
	return t;
};
function N(e) {
	if (null == e || !e.getBoundingClientRect) return {
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	};
	let t = e.getBoundingClientRect(), n = document.documentElement;
	return {
		bottom: t.bottom,
		right: t.right,
		top: t.top + window.scrollY - n.clientTop,
		left: t.left + window.scrollX - n.clientLeft
	};
}
function I() {
	return {
		vw: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
		vh: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
	};
}
function L(e, t, n = 5) {
	let a = {
		top: !0,
		bottom: !0,
		left: !0,
		right: !0
	}, l = [];
	if (!t || !e) return {
		canShow: a,
		parentPositions: l
	};
	let { bottom: o, top: r } = function(e) {
		let { top: t, left: n } = {
			left: window.scrollX || document.documentElement.scrollLeft || 0,
			top: window.scrollY || document.documentElement.scrollTop || 0
		}, { top: a, left: l } = N(e), { vh: o, vw: r } = I(), i = a - t, s = l - n;
		return {
			top: i,
			bottom: o - (i + e.clientHeight),
			left: s,
			right: r - (s + e.clientWidth)
		};
	}(e), { top: i, left: s } = N(e), { height: c, width: d } = t.getBoundingClientRect(), { vh: u, vw: m } = I(), p = m / 2, h = u / 2;
	return [
		{
			condition: i < h,
			position: "top"
		},
		{
			condition: i > h,
			position: "bottom"
		},
		{
			condition: s < p,
			position: "left"
		},
		{
			condition: s > p,
			position: "right"
		}
	].forEach(({ condition: e, position: t }) => {
		e && l.push(t);
	}), Object.assign(a, {
		top: c <= r - n,
		bottom: c <= o - n,
		left: d <= s,
		right: d <= m - s
	}), {
		canShow: a,
		parentPositions: l
	};
}
var W = (e, t, n) => {
	if (!e) return;
	let a = "auto" === n ? function(e, t) {
		let n = "left";
		if (!t || !e) return n;
		let { canShow: a, parentPositions: l } = L(e, t), o = a.left && a.right;
		return (o && a.bottom ? "center" : o && a.top ? ["top", "center"] : Array.isArray(l) ? ["bottom" === l[0] ? "top" : "bottom", ...l.slice(1)] : l) || n;
	}(e, t) : n, l = {
		top: -t.offsetHeight,
		bottom: e.offsetHeight,
		left: 0,
		center: e.offsetWidth / 2 - t.offsetWidth / 2,
		right: e.offsetWidth - t.offsetWidth
	}, o = Array.isArray(a) ? a[0] : "bottom", r = Array.isArray(a) ? a[1] : a;
	t.dataset.vcPosition = o;
	let { top: i, left: s } = N(e), c = i + l[o], d = s + l[r], { vw: u } = I();
	if (d + t.clientWidth > u) {
		let e = window.innerWidth - document.body.clientWidth;
		d = u - t.clientWidth - e;
	} else d < 0 && (d = 0);
	Object.assign(t.style, {
		left: `${d}px`,
		top: `${c}px`
	});
};
var H = /* @__PURE__ */ new WeakMap();
var O = (e) => {
	clearTimeout(H.get(e)), H.delete(e);
};
var q = (e) => {
	O(e), H.set(e, setTimeout(() => {
		H.delete(e), e.context.isDestroyed || F(e);
	}));
};
var F = (e) => {
	var t, n;
	if (O(e), e.context.isShowInInputMode || e.context.isDestroyed) return;
	if (!e.context.currentType) return void e.context.mainElement.click();
	g(e, "cleanupHandlers", []), g(e, "isShowInInputMode", !0), e.inputMode && ((n = e.context.mainElement).removeAttribute("inert"), n.removeAttribute("aria-hidden"), ((e) => {
		C(e), e.querySelectorAll(`[${k}]`).forEach(C);
	})(n)), W(e.context.inputElement, e.context.mainElement, e.positionToInput), e.context.mainElement.removeAttribute("data-vc-calendar-hidden"), null != (t = e.context.inputElement) && t.hasAttribute("aria-expanded") && e.context.inputElement.setAttribute("aria-expanded", "true");
	let a = () => {
		W(e.context.inputElement, e.context.mainElement, e.positionToInput);
	};
	window.addEventListener("resize", a), e.context.cleanupHandlers.push(() => window.removeEventListener("resize", a));
	let l = (t) => {
		if ("Escape" === t.key) return $(e);
		if ("Tab" !== t.key) return;
		let n = Y(e.context.mainElement);
		t.composedPath()[0] === n[t.shiftKey ? 0 : n.length - 1] && (t.shiftKey && t.preventDefault(), $(e));
	};
	document.addEventListener("keydown", l), e.context.cleanupHandlers.push(() => document.removeEventListener("keydown", l));
	let o = (t) => {
		var n;
		let a = null == (n = t.composedPath()[0]) ? t.target : n;
		a === e.context.inputElement || e.context.mainElement.contains(a) || $(e);
	};
	document.addEventListener("click", o, { capture: !0 }), e.context.cleanupHandlers.push(() => document.removeEventListener("click", o, { capture: !0 })), e.onShow && e.onShow(e);
};
var P = "The calendar has not been initialized, please initialize it using the \"init()\" method first.";
var R = "You specified an incorrect language label or did not specify the required number of values ​​for «locale.weekdays» or «locale.months».";
var _ = (e) => String(e).replace(/[&<>"']/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
})[e]);
var j = (e, t) => `\n  <div class="${_(e.styles.header)}" data-vc="header" role="group" aria-label="${_(e.labels.navigation)}">\n${t ? `    <#ArrowPrev [${t}] />\n` : ""}    <div class="${_(e.styles.headerContent)}" data-vc-header="content" aria-live="polite" aria-atomic="true">\n      <#Month />\n      <#Year />\n    </div>\n${t ? `    <#ArrowNext [${t}] />\n` : ""}  </div>\n`;
var z = (e, t = "month") => `${j(e, t)}  <div class="${_(e.styles.wrapper)}" data-vc="wrapper">\n    <#WeekNumbers />\n    <div class="${_(e.styles.content)}" data-vc="content" role="grid">\n      <#Week />\n      <#Dates />\n      <#DateRangeTooltip />\n    </div>\n  </div>\n  <#Collapse />\n  <#ControlTime />\n`;
var K = (e) => e;
var B = /* @__PURE__ */ new WeakMap();
var U = (e) => {
	var t;
	null == (t = B.get(e)) || t.observer.disconnect(), B.delete(e);
};
var X = U;
var G = (e) => {
	var t;
	return !(e.animation || e.enableCollapse || e.onCreateDateEls || e.onCreateDateRangeTooltip || e.disableDatesGaps || e.popups && Object.keys(e.popups).length || e.sanitizerHTML !== K || "default" !== e.context.currentType && "multiple" !== e.context.currentType || e.layouts[e.context.currentType] !== ("multiple" === e.context.currentType ? null == (t = u(e).months) ? void 0 : t.layout(e) : z(e)));
};
var Z = (e) => JSON.stringify(Object.entries(e).filter(([e]) => "context" !== e && "selectedDates" !== e), (e, t) => "function" == typeof t || t);
var J = ({ context: e }) => JSON.stringify([
	e.currentType,
	e.locale,
	e.dateToday,
	e.dateMin,
	e.dateMax,
	e.displayDateMin,
	e.displayDateMax,
	e.selectedYear,
	e.selectedMonth,
	e.displayMonthsCount,
	e.selectedHours,
	e.selectedMinutes,
	e.selectedKeeping,
	e.selectedTime
]);
var V = (e) => JSON.stringify([
	J(e),
	e.context.displayYear,
	e.context.displayWeekDate,
	e.context.selectedDates,
	e.context.disableDates,
	e.context.enableDates
]);
var Q = (e, t = !1) => {
	let n = B.get(e);
	if (!n || !t && !n.fullLayout || n.dirty || n.observer.takeRecords().length || !G(e)) return;
	let a = w(e.context.mainElement).activeElement;
	if (!a || a === e.context.mainElement || !e.context.mainElement.contains(a) || t && !a.closest("[data-vc=\"column\"], [data-vc=\"dates\"], [data-vc-week=\"numbers\"]")) try {
		if (n.options === Z(e) && n.context === V(e) && n.timezone === new Intl.DateTimeFormat().resolvedOptions().timeZone) return n;
	} catch (l) {}
};
var ee = (e, t = !1) => {
	if (U(e), G(e) && !e.context.isDestroyed) try {
		let n = Z(e), a = V(e);
		if (n.length + a.length > 262144) return;
		let l = Array.from(e.context.mainElement.querySelectorAll("[data-vc=\"dates\"]"));
		if (l.length !== e.context.displayMonthsCount) return;
		let o = {
			observer: new MutationObserver(() => o.dirty = !0),
			dirty: !1,
			fullLayout: t,
			options: n,
			context: a,
			structure: J(e),
			timezone: new Intl.DateTimeFormat().resolvedOptions().timeZone,
			month: 12 * e.context.selectedYear + e.context.selectedMonth,
			count: l.length
		};
		o.observer.observe(e.context.mainElement, {
			subtree: !0,
			childList: !0,
			attributes: !0,
			characterData: !0
		}), B.set(e, o);
	} catch (n) {
		U(e);
	}
};
var te = (e, t, n, a = "") => {
	t ? e.getAttribute(n) !== a && e.setAttribute(n, a) : e.getAttribute(n) === a && e.removeAttribute(n);
};
var ne = (t, n, a, l, o, i, s) => {
	var c;
	let d = (p = i, Date.parse(`${p}T00:00:00`)), u = r(t), m = u.min > d || u.max < d || u.disabled.set.has(i) || !t.selectionMonthsMode && "current" !== s || !t.selectionYearsMode && e(i).getFullYear() !== n;
	var p;
	te(a, m, "data-vc-date-disabled"), l && te(l, m, "aria-disabled", "true"), l && m && te(l, !0, "tabindex", "-1"), l && l.disabled !== !!m && (l.disabled = !!m), te(a, !t.disableToday && t.context.dateToday === i, "data-vc-date-today"), te(a, !t.disableToday && t.context.dateToday === i, "aria-current", "date"), te(a, null == (c = t.selectedWeekends) ? void 0 : c.includes(o), "data-vc-date-weekend"), te(a, u.holidays.has(i), "data-vc-date-holiday");
	let h = u.selected.set.has(i), v = h ? "" : void 0;
	h ? (te(a, !0, "aria-selected", "true"), t.context.selectedDates.length > 1 && "multiple-ranged" === t.selectionDatesMode && (t.context.selectedDates[0] === i && t.context.selectedDates[t.context.selectedDates.length - 1] === i ? v = "first-and-last" : t.context.selectedDates[0] === i ? v = "first" : t.context.selectedDates[t.context.selectedDates.length - 1] === i && (v = "last"), t.context.selectedDates[0] !== i && t.context.selectedDates[t.context.selectedDates.length - 1] !== i && (v = "middle"))) : a.hasAttribute("data-vc-date-selected") && a.removeAttribute("aria-selected"), !u.disabled.set.has(i) && t.enableEdgeDatesOnly && t.context.selectedDates.length > 1 && "multiple-ranged" === t.selectionDatesMode && (d > u.first && d < u.last ? v = "middle" : "middle" === v && (v = void 0)), void 0 === v ? a.hasAttribute("data-vc-date-selected") && a.removeAttribute("data-vc-date-selected") : te(a, !0, "data-vc-date-selected", v);
};
var ae = /* @__PURE__ */ new Map();
var le = /* @__PURE__ */ new Map();
var oe = (e, t, n) => {
	var a, l;
	let o = null == (a = e.disableWeekdays) ? void 0 : a.includes(n), i = e.disableAllDates && !(null == (l = e.context.enableDates) || !l[0]), s = r(e);
	if ((o || i) && !s.enabled.set.has(t) && !s.disabled.set.has(t)) {
		let n = e.context.disableDates;
		if (s.disabled.set.add(t), e.onCreateDateEls) n.push(t), b(n), s.disabled.values = n.slice();
		else {
			let e = +new Date(t), a = 0, l = n.length;
			for (; a < l;) {
				let t = a + l >>> 1;
				+new Date(n[t]) <= e ? a = t + 1 : l = t;
			}
			n.splice(a, 0, t), s.disabled.values.splice(a, 0, t);
		}
	}
};
var re = (t, n, a, l, r, i) => {
	var s;
	let c, d = e(r).getDay(), m = "string" == typeof t.locale && t.locale.length ? t.locale : "en", p = document.createElement("div");
	p.className = t.styles.date, p.dataset.vcDate = r, p.dataset.vcDateMonth = i, p.dataset.vcDateWeekDay = String(d), p.role = "gridcell", ("current" === i || t.displayDatesOutside) && (c = document.createElement("button"), c.className = t.styles.dateBtn, c.type = "button", c.dataset.vcDateBtn = "", c.ariaLabel = ((e, t) => {
		let n = `${t}:${e}`, a = le.get(n);
		if (void 0 !== a) return a;
		let l = ae.get(t);
		l || (l = new Intl.DateTimeFormat(t, {
			dateStyle: "long",
			timeZone: "UTC"
		}), ae.size >= 8 && ae.delete(ae.keys().next().value), ae.set(t, l));
		let o = l.format(/* @__PURE__ */ new Date(`${e}T00:00:00.000Z`));
		return le.size >= 512 && le.delete(le.keys().next().value), le.set(n, o), o;
	})(r, m), c.innerText = String(l), p.appendChild(c)), t.enableWeekNumbers && (null == (s = u(t).weeks) || s.date(t, p, r)), oe(t, r, d), ne(t, n, p, c, d, r, i), a.addDate(p), t.onCreateDateEls && (t.onCreateDateEls(t, p), o(t));
};
var ie = [
	{
		container: "[data-vc=\"dates\"]",
		item: "[data-vc-date-btn]",
		active: ["[data-vc-date-selected] [data-vc-date-btn]", "[data-vc-date-today] [data-vc-date-btn]"]
	},
	{
		container: "[data-vc=\"months\"]",
		item: "[data-vc-months-month]",
		active: ["[data-vc-months-month-selected]"]
	},
	{
		container: "[data-vc=\"years\"]",
		item: "[data-vc-years-year]",
		active: ["[data-vc-years-year-selected]"]
	}
];
var se = (e) => !e.hasAttribute("disabled") && "true" !== e.getAttribute("aria-disabled");
var ce = (e, t, n) => {
	if (n && se(n)) return e.querySelectorAll(`${t.item}:not([tabindex="-1"])`).forEach((e) => {
		e !== n && (e.tabIndex = -1);
	}), void ("0" !== n.getAttribute("tabindex") && (n.tabIndex = 0));
	let a = Array.from(e.querySelectorAll(t.item));
	if (!a[0]) return;
	let l = ((e, t, n) => {
		var a;
		let l = t.active.map((t) => e.querySelector(t)).find((e) => !!e && se(e));
		return null == (a = null == l ? n.find(se) : l) ? n[0] : a;
	})(e, t, a);
	a.forEach((e) => {
		let t = e === l ? 0 : -1;
		e.getAttribute("tabindex") !== String(t) && (e.tabIndex = t);
	});
};
var de = (e) => {
	let t = e.target, n = ie.find((e) => {
		var n;
		return null == (n = t.matches) ? void 0 : n.call(t, e.item);
	}), a = n ? t.closest(n.container) : null;
	n && a && ce(a, n, t);
};
var ue = (e) => {
	ie.forEach((t) => {
		e.context.mainElement.querySelectorAll(t.container).forEach((e) => {
			e.closest("[data-vc-ghost]") || ce(e, t, null);
		});
	});
};
var me = (e, n, a = !0) => {
	var l;
	X(e);
	let r = new Date(e.context.selectedYear, e.context.selectedMonth, 1), i = e.context.mainElement.querySelectorAll("[data-vc=\"dates\"]"), s = u(e).weeks, c = e.enableWeekNumbers ? e.context.mainElement.querySelectorAll("[data-vc-week=\"numbers\"]") : [], d = null == (l = u(e).annotations) ? void 0 : l.prepare(e, i.length);
	i.forEach((a, l) => {
		e.selectionDatesMode || (a.dataset.vcDatesDisabled = "");
		let i = n ? 12 * e.context.selectedYear + e.context.selectedMonth + l - n.month : -1;
		if (n && i >= 0 && i < n.count) return;
		if (a.textContent = "", o(e), "week" === e.context.currentType) return s?.dates(e, a), d?.(a), void (null == s || s.numbers(e, 0, 7, c[l], a));
		let u = new Date(r);
		u.setMonth(u.getMonth() + l);
		let m = u.getMonth(), p = u.getFullYear(), h = (new Date(p, m, 1).getDay() - e.firstWeekday + 7) % 7, v = new Date(p, m + 1, 0).getDate(), y = h + v, g = Math.ceil(y / 7), f = 7 * g - y, x = [];
		for (let t = 0; t < g; t++) {
			let t = document.createElement("div");
			t.className = e.styles.datesRow, t.setAttribute("data-vc-dates", "row"), t.setAttribute("role", "row"), x.push(t);
		}
		let b = 0, D = 0, M = { addDate: (e) => {
			x[b].appendChild(e), D++, D >= 7 && (b++, D = 0);
		} };
		((e, t, n, a, l) => {
			let o = new Date(n, a, 0).getDate() - (l - 1), r = 0 === a ? n - 1 : n, i = 0 === a ? 12 : a < 10 ? `0${a}` : a;
			for (let s = l; s > 0; s--, o++) re(e, n, t, o, `${r}-${i}-${o}`, "prev");
		})(e, M, p, m, h), ((e, n, a, l, o) => {
			for (let r = 1; r <= a; r++) {
				let a = new Date(l, o, r);
				re(e, l, n, r, t(a), "current");
			}
		})(e, M, v, p, m), ((e, t, n, a, l) => {
			let o = l + 1 === 12 ? a + 1 : a, r = l + 1 === 12 ? "01" : l + 2 < 10 ? `0${l + 2}` : l + 2;
			for (let i = 1; i <= n; i++) {
				let n = `${o}-${r}-${i < 10 ? `0${i}` : String(i)}`;
				re(e, a, t, i, n, "next");
			}
		})(e, M, f, p, m);
		for (let e of x) a.appendChild(e);
		d?.(a), s?.numbers(e, h, v, c[l], a);
	}), ue(e), a && ee(e, null == n ? void 0 : n.fullLayout);
};
var pe = (e, t) => `${j(e, "Years" === t ? "year" : void 0)}  <div class="${_(e.styles.wrapper)}" data-vc="wrapper">\n    <div class="${_(e.styles.content)}" data-vc="content">\n      <#${t} />\n    </div>\n  </div>\n`;
var he = (e) => pe(e, "Months");
var ve = (e) => pe(e, "Years");
var ge = (e, t, n) => e.labels["arrow" + ("prev" === t ? "Prev" : "Next")][n];
var fe = {
	ArrowNext: (e, t) => `<button type="button" class="${_(e.styles.arrowNext)}" data-vc-arrow="next" aria-label="${_(ge(e, "next", t))}"></button>`,
	ArrowPrev: (e, t) => `<button type="button" class="${_(e.styles.arrowPrev)}" data-vc-arrow="prev" aria-label="${_(ge(e, "prev", t))}"></button>`,
	Dates: (e) => `<div class="${_(e.styles.dates)}" data-vc="dates" role="rowgroup" aria-label="${_(e.labels.dates)}"></div>`,
	Month: (e) => `<button type="button" class="${_(e.styles.month)}" data-vc="month"></button>`,
	Months: (e) => `<div class="${_(e.styles.months)}" data-vc="months" role="grid" aria-label="${_(e.labels.months)}"></div>`,
	Week: (e) => `<div class="${_(e.styles.week)}" data-vc="week" role="row" aria-label="${_(e.labels.week)}"></div>`,
	Year: (e) => `<button type="button" class="${_(e.styles.year)}" data-vc="year"></button>`,
	Years: (e) => `<div class="${_(e.styles.years)}" data-vc="years" role="grid" aria-label="${_(e.labels.years)}"></div>`
};
var xe = (e, t) => t.replace(/[\n\t]/g, "").replace(/<#(?!\/?Multiple)(.*?)>/g, (t, n) => {
	let a = (n.match(/\[(.*?)\]/) || [])[1], l = ((e, t) => {
		var n, a, l, o;
		return "Collapse" === t ? null == (n = u(e).weeks) ? void 0 : n.component : "WeekNumbers" === t ? null == (a = u(e).weeks) ? void 0 : a.numbersComponent : "DateRangeTooltip" === t ? null == (l = u(e).annotations) ? void 0 : l.component : "ControlTime" === t ? null == (o = u(e).time) ? void 0 : o.component : Object.prototype.hasOwnProperty.call(fe, t) ? fe[t] : void 0;
	})(e, n.replace(/[/\s\n\t]|\[(.*?)\]/g, "")), o = l ? l(e, null == a ? null : a) : "";
	return e.sanitizerHTML(o);
}).replace(/[\n\t]/g, "");
var be = (e, t) => {
	var n, a, l;
	let o = u(e), r = {
		default: z,
		month: he,
		year: ve,
		multiple: null == (n = o.months) ? void 0 : n.layout,
		week: null == (a = o.weeks) ? void 0 : a.layout
	};
	var i;
	Object.keys(r).forEach((t) => {
		var n, a;
		let l = t;
		e.layouts[l].length || (e.layouts[l] = null == (n = null == (a = r[l]) ? void 0 : a.call(r, e)) ? "" : n);
	}), e.context.mainElement.className = e.styles.calendar, e.context.mainElement.dataset.vc = "calendar", e.context.mainElement.dataset.vcType = e.context.currentType, e.context.mainElement.toggleAttribute("data-vc-swipe", e.enableSwipe), e.context.mainElement.role = e.inputMode ? "dialog" : "group", e.context.mainElement.tabIndex = -1, e.context.mainElement.ariaLabel = e.labels.application, null != (l = o.months) && l.render(e, t) || (null == (i = o.time) || i.destroy(e), e.context.mainElement.innerHTML = e.sanitizerHTML(xe(e, e.layouts[e.context.currentType]))), ((e) => {
		let t = ["multiple", "multiple-ranged"].includes(String(e.selectionDatesMode));
		e.context.mainElement.querySelectorAll("[data-vc=\"content\"][role=\"grid\"]").forEach((e) => {
			t ? e.setAttribute("aria-multiselectable", "true") : e.removeAttribute("aria-multiselectable");
		});
	})(e);
};
var De = (e, t, n, a) => {
	e.style.visibility = n ? "hidden" : "", t.style.visibility = a ? "hidden" : "";
};
var Me = (n) => {
	if ("month" === n.context.currentType) return;
	let a = n.context.mainElement.querySelector("[data-vc-arrow=\"prev\"]"), l = n.context.mainElement.querySelector("[data-vc-arrow=\"next\"]");
	a && l && {
		default: () => ((n, a, l) => {
			let o = e(t(new Date(n.context.selectedYear, n.context.selectedMonth, 1))), r = new Date(o.getTime()), i = new Date(o.getTime());
			r.setMonth(r.getMonth() - n.monthsToSwitch), i.setMonth(i.getMonth() + n.monthsToSwitch);
			let s = e(n.context.dateMin), c = e(n.context.dateMax);
			n.selectionYearsMode || (s.setFullYear(o.getFullYear()), c.setFullYear(o.getFullYear())), De(a, l, !n.selectionMonthsMode || r.getFullYear() < s.getFullYear() || r.getFullYear() === s.getFullYear() && r.getMonth() < s.getMonth(), !n.selectionMonthsMode || i.getFullYear() > c.getFullYear() || i.getFullYear() === c.getFullYear() && i.getMonth() > c.getMonth() - (n.context.displayMonthsCount - 1));
		})(n, a, l),
		year: () => ((t, n, a) => {
			let l = e(t.context.dateMin), o = e(t.context.dateMax);
			De(n, a, !!(l.getFullYear() && t.context.displayYear - 7 <= l.getFullYear()), !!(o.getFullYear() && t.context.displayYear + 7 >= o.getFullYear()));
		})(n, a, l),
		week: () => {
			var e;
			return null == (e = u(n).weeks) ? void 0 : e.arrows(n, a, l);
		}
	}["multiple" === n.context.currentType ? "default" : n.context.currentType]();
};
var we = (e, t) => {
	let n = e.context.mainElement.querySelectorAll("[data-vc=\"month\"]"), a = e.context.mainElement.querySelectorAll("[data-vc=\"year\"]"), l = new Date(e.context.selectedYear, e.context.selectedMonth, 1);
	[n, a].forEach((n) => null == n ? void 0 : n.forEach((n, a) => {
		(!t || t.includes(a)) && ((e, t, n, a, l) => {
			let o = new Date(a.setFullYear(e.context.selectedYear, e.context.selectedMonth + n)).getFullYear(), r = new Date(a.setMonth(e.context.selectedMonth + n)).getMonth(), i = e.context.locale.months.long[r], s = t.closest("[data-vc=\"column\"]");
			s && (s.ariaLabel = `${i} ${o}`);
			let c = {
				month: {
					id: r,
					label: i
				},
				year: {
					id: o,
					label: o
				}
			};
			t.innerText = String(c[l].label), t.dataset[`vc${l.charAt(0).toUpperCase() + l.slice(1)}`] = String(c[l].id), t.ariaLabel = `${e.labels[l]} ${c[l].label}`;
			let d = {
				month: e.selectionMonthsMode,
				year: e.selectionYearsMode
			}, u = !1 === d[l] || "only-arrows" === d[l];
			u && (t.tabIndex = -1), t.disabled = u;
		})(e, n, a, l, n.dataset.vc);
	}));
};
var Ee = (e, t, n, a, l) => {
	let o = {
		month: {
			selected: "data-vc-months-month-selected",
			aria: "aria-selected",
			value: "vcMonthsMonth",
			selectedProperty: "selectedMonth"
		},
		year: {
			selected: "data-vc-years-year-selected",
			aria: "aria-selected",
			value: "vcYearsYear",
			selectedProperty: "selectedYear"
		}
	};
	var r, i;
	l && (null == (r = e.context.mainElement.querySelectorAll({
		month: "[data-vc-months-month]",
		year: "[data-vc-years-year]"
	}[n])) || r.forEach((e) => {
		var t;
		e.removeAttribute(o[n].selected), null == (t = e.parentElement) || t.removeAttribute(o[n].aria);
	}), g(e, o[n].selectedProperty, Number(t.dataset[o[n].value])), we(e), "year" === n && Me(e)), a && (t.setAttribute(o[n].selected, ""), null == (i = t.parentElement) || i.setAttribute(o[n].aria, "true"));
};
var ke = (e, t, n, a, l, o, r, i) => {
	let s = "month" === t ? "months" : "years", c = document.createElement("div");
	c.className = e.styles[`${s}Cell`], c.setAttribute(`data-vc-${s}`, "cell"), c.role = "gridcell";
	let d = n.cloneNode(!1);
	return d.className = e.styles["month" === t ? "monthsMonth" : "yearsYear"], d.innerText = r, d.ariaLabel = i, d.setAttribute(`data-vc-${s}-${t}`, String(o)), l && (d.ariaDisabled = "true"), l && (d.tabIndex = -1), d.disabled = l, c.appendChild(d), Ee(e, d, t, a === o, !1), c;
};
var Te = (e, t) => {
	var n, a;
	return null == (n = null == (a = u(e).months) ? void 0 : a.column(e, t)) ? {
		currentValue: null,
		columnID: 0
	} : n;
};
var Ae = (t, n) => {
	var a;
	let l = null == n || null == (a = n.closest("[data-vc=\"header\"]")) ? void 0 : a.querySelector("[data-vc=\"year\"]"), o = l ? Number(l.dataset.vcYear) : t.context.selectedYear, r = null != n && n.dataset.vcMonth ? Number(n.dataset.vcMonth) : t.context.selectedMonth;
	g(t, "currentType", "month"), be(t, n), we(t);
	let i = t.context.mainElement.querySelector("[data-vc=\"months\"]");
	if (!t.selectionMonthsMode || !i) return;
	let s = t.monthsToSwitch > 1 ? t.context.locale.months.long.map((e, n) => r - t.monthsToSwitch * n).concat(t.context.locale.months.long.map((e, n) => r + t.monthsToSwitch * n)).filter((e) => e >= 0 && e <= 12) : Array.from(Array(12).keys()), c = document.createElement("button");
	c.type = "button";
	let d, u = () => ({
		min: e(t.context.dateMin),
		max: e(t.context.dateMax),
		monthCount: t.context.displayMonthsCount - 1,
		columnID: Te(t, "month").columnID
	}), m = t.onCreateMonthEls ? void 0 : u();
	for (let e = 0; e < 12; e++) {
		e % 4 == 0 && (d = document.createElement("div"), d.className = t.styles.monthsRow, d.dataset.vcMonths = "row", d.role = "row", i.appendChild(d));
		let { min: n, max: a, monthCount: l, columnID: p } = null == m ? u() : m, h = ke(t, "month", c, r, o <= n.getFullYear() && e < n.getMonth() + p || o >= a.getFullYear() && e > a.getMonth() - l + p || o > a.getFullYear() || e !== r && !s.includes(e), e, t.context.locale.months.short[e], t.context.locale.months.long[e]);
		d?.appendChild(h), t.onCreateMonthEls && t.onCreateMonthEls(t, h);
	}
	ue(t);
};
var Ce = (e) => {
	var t;
	let n = e.selectedWeekends ? [...e.selectedWeekends] : [], a = [...e.context.locale.weekdays.long].map((t, a) => ({
		id: a,
		titleShort: e.context.locale.weekdays.short[a],
		titleLong: t,
		isWeekend: n.includes(a)
	})), l = [...a.slice(e.firstWeekday), ...a.slice(0, e.firstWeekday)], o = null == (t = u(e).weeks) ? void 0 : t.weekday(e), r = document.createElement(o ? "div" : "b");
	e.context.mainElement.querySelectorAll("[data-vc=\"week\"]").forEach((t) => {
		l.forEach((n) => {
			let a = r.cloneNode(!1);
			a.className = e.styles.weekDay, a.role = "columnheader", a.ariaLabel = n.titleLong, a.dataset.vcWeekDay = String(n.id), n.isWeekend && (a.dataset.vcWeekDayOff = ""), o ? o(a, n.titleShort, n.titleLong) : a.innerText = n.titleShort, t.appendChild(a);
		});
	});
};
var Se = (t, n) => {
	let a = null != n && n.dataset.vcYear ? Number(n.dataset.vcYear) : t.context.selectedYear;
	g(t, "currentType", "year"), be(t, n), we(t), Me(t);
	let l = t.context.mainElement.querySelector("[data-vc=\"years\"]");
	if (!t.selectionYearsMode || !l) return;
	let o = "multiple" === t.type ? t.context.selectedYear === a ? 0 : 1 : 0, r = document.createElement("button");
	r.type = "button";
	let i, s = () => [e(t.context.dateMin).getFullYear(), e(t.context.dateMax).getFullYear()], c = t.onCreateYearEls ? void 0 : s();
	for (let e = t.context.displayYear - 7; e < t.context.displayYear + 8; e++) {
		(e - (t.context.displayYear - 7)) % 5 == 0 && (i = document.createElement("div"), i.className = t.styles.yearsRow, i.dataset.vcYears = "row", i.role = "row", l.appendChild(i));
		let [n, d] = null == c ? s() : c, u = ke(t, "year", r, a, e < n + o || e > d, e, String(e), String(e));
		i?.appendChild(u), t.onCreateYearEls && t.onCreateYearEls(t, u);
	}
	ue(t);
};
var $e = /* @__PURE__ */ new WeakMap();
var Ye = (e) => {
	var t, n;
	let a = "not all" !== window.matchMedia("(prefers-color-scheme)").media;
	var l, o;
	if (!a || "system" !== e.selectedTheme) return null == (l = (o = e.context).cleanupSystemTheme) || l.call(o), void (e.context.mainElement.dataset.vcTheme = a ? e.selectedTheme : "light");
	let r = e.themeAttrDetect.length ? document.querySelector(e.themeAttrDetect) : null, i = e.themeAttrDetect.replace(/^.*\[(.+)\]/g, (e, t) => t), s = $e.get(e);
	if ((null == s ? void 0 : s.element) === r && s.attr === i) return void s.update();
	null == (t = (n = e.context).cleanupSystemTheme) || t.call(n);
	let c, d = window.matchMedia("(prefers-color-scheme: dark)"), u = () => {
		let t = null == r ? void 0 : r.getAttribute(i), n = !t || "system" === t;
		e.context.mainElement.dataset.vcTheme = n ? d.matches ? "dark" : "light" : t, n && !c ? d.addEventListener ? (d.addEventListener("change", u), c = () => d.removeEventListener("change", u)) : (d.addListener(u), c = () => d.removeListener(u)) : !n && c && (c(), c = void 0);
	}, m = r ? ((e, t, n) => {
		let a = new MutationObserver((e) => {
			for (let a = 0; a < e.length; a++) if (e[a].attributeName === t) {
				n();
				break;
			}
		});
		return a.observe(e, {
			attributes: !0,
			attributeFilter: [t]
		}), () => a.disconnect();
	})(r, i, u) : void 0;
	$e.set(e, {
		element: r,
		attr: i,
		update: u
	}), g(e, "cleanupSystemTheme", () => {
		m?.(), c?.(), $e.delete(e), g(e, "cleanupSystemTheme", void 0);
	}), u();
};
function Ne(e) {
	return Ne = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
		return typeof e;
	} : function(e) {
		return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, Ne(e);
}
function Ie(e, t, n) {
	return (t = function(e) {
		var t = function(e) {
			if ("object" != Ne(e) || !e) return e;
			var t = e[Symbol.toPrimitive];
			if (void 0 !== t) {
				var n = t.call(e, "string");
				if ("object" != Ne(n)) return n;
				throw TypeError("@@toPrimitive must return a primitive value.");
			}
			return String(e);
		}(e);
		return "symbol" == Ne(t) ? t : t + "";
	}(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Le(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		t && (a = a.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, a);
	}
	return n;
}
function We(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = null == arguments[t] ? {} : arguments[t];
		t % 2 ? Le(Object(n), !0).forEach(function(t) {
			Ie(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Le(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
var He = /* @__PURE__ */ new Map();
var Oe = (e, t, n) => {
	let a = new Intl.DateTimeFormat(e, {
		[t]: n,
		timeZone: "UTC"
	});
	return Array.from({ length: "weekday" === t ? 7 : 12 }, (e, n) => {
		return (l = a.format(new Date(Date.UTC(1978, "month" === t ? n : 0, "weekday" === t ? n + 1 : 1)))).charAt(0).toUpperCase() + l.slice(1).replace(/\./, "");
		var l;
	});
};
var qe = (e) => {
	if (e.context.locale.weekdays.short[6] && e.context.locale.weekdays.long[6] && e.context.locale.months.short[11] && e.context.locale.months.long[11]) return;
	if ("string" != typeof e.locale) {
		var t, n, a, l;
		if (!(null != (t = e.locale) && null != (t = t.weekdays) && t.short[6] && null != (n = e.locale) && null != (n = n.weekdays) && n.long[6] && null != (a = e.locale) && null != (a = a.months) && a.short[11] && null != (l = e.locale) && null != (l = l.months) && l.long[11])) throw Error(R);
		g(e, "locale", We({}, e.locale));
		return;
	}
	if ("string" == typeof e.locale && !e.locale.length) throw Error(R);
	let o = He.get(e.locale);
	o || (o = {
		weekdays: {
			short: Oe(e.locale, "weekday", "short"),
			long: Oe(e.locale, "weekday", "long")
		},
		months: {
			short: Oe(e.locale, "month", "short"),
			long: Oe(e.locale, "month", "long")
		}
	}, He.size >= 8 && He.delete(He.keys().next().value), He.set(e.locale, o));
	for (let r of ["weekdays", "months"]) for (let t of ["short", "long"]) e.context.locale[r][t].push(...o[r][t]);
};
var Fe = (e, t = !0) => {
	var n;
	X(e), Ye(e), qe(e), be(e), we(e), Me(e), null == (n = u(e).time) || n.render(e), {
		default: () => {
			Ce(e), me(e, void 0, !1);
		},
		multiple: () => {
			Ce(e), me(e, void 0, !1);
		},
		week: () => {
			var t;
			null == (t = u(e).weeks) || t.init(e), Ce(e), me(e, void 0, !1);
		},
		month: () => Ae(e),
		year: () => Se(e)
	}[e.context.currentType](), t && ee(e, !0);
};
var Pe = (t, n = !1) => {
	o(t), t.context.mainElement.querySelectorAll("[data-vc-date]").forEach((a) => {
		let l = a.querySelector("[data-vc-date-btn]"), o = a.dataset.vcDate, r = e(o), i = r.getDay();
		n && oe(t, o, i);
		let s = n ? a.dataset.vcDateMonth : "current";
		"prev" === s && r.setMonth(r.getMonth() + 1, 1), "next" === s && r.setMonth(r.getMonth() - 1, 1), ne(t, n ? r.getFullYear() : t.context.selectedYear, a, l, i, o, s);
	}), ue(t);
};
var Re = (e) => {
	let t = [
		{
			container: "[data-vc=\"dates\"]",
			row: "[data-vc-dates=\"row\"]",
			item: "[data-vc-date-btn]"
		},
		{
			container: "[data-vc=\"months\"]",
			row: "[data-vc-months=\"row\"]",
			item: "[data-vc-months-month]"
		},
		{
			container: "[data-vc=\"years\"]",
			row: "[data-vc-years=\"row\"]",
			item: "[data-vc-years-year]"
		}
	], n = (e) => !e.disabled && "true" !== e.getAttribute("aria-disabled"), a = (e) => {
		let a = e.target.closest("button");
		if (!a || ![
			"ArrowUp",
			"ArrowDown",
			"ArrowLeft",
			"ArrowRight"
		].includes(e.key)) return;
		let l, o = t.find((e) => a.matches(e.item)), r = o ? a.closest(o.container) : null;
		if (o && r && !r.closest("[data-vc-ghost]") && n(a)) {
			if ("ArrowUp" === e.key || "ArrowDown" === e.key) l = ((e, t, a, l) => {
				var o;
				let r = a.closest(t.row);
				if (!r) return a;
				let i = Array.from(e.querySelectorAll(t.row)), s = i.indexOf(r), c = Array.from(r.children).indexOf(a.parentElement), d = i[s + l], u = null == d || null == (o = d.children[c]) ? void 0 : o.querySelector(t.item);
				return u && n(u) ? u : a;
			})(r, o, a, "ArrowUp" === e.key ? -1 : 1);
			else {
				let t = Array.from(r.querySelectorAll(o.item)).filter(n), i = t.indexOf(a);
				if (-1 === i) return;
				l = "ArrowLeft" === e.key ? t[Math.max(0, i - 1)] : t[Math.min(t.length - 1, i + 1)];
			}
			e.preventDefault(), l?.focus();
		}
	};
	return e.context.mainElement.addEventListener("keydown", a), e.context.mainElement.addEventListener("focusin", de), () => {
		e.context.mainElement.removeEventListener("keydown", a), e.context.mainElement.removeEventListener("focusin", de);
	};
};
var _e = "[data-vc=\"dates\"]";
var je = (e, t) => "next" === e ? t : -t;
var ze = (n) => {
	let a = {
		selector: _e,
		shift: (a) => ((n, a) => {
			let l = e(t(new Date(n.context.selectedYear, n.context.selectedMonth, 1)));
			l.setMonth(l.getMonth() + je(a, n.monthsToSwitch)), g(n, "selectedMonth", l.getMonth()), g(n, "selectedYear", l.getFullYear());
		})(n, a),
		render: (e, t) => me(n, t)
	};
	return {
		default: a,
		multiple: a,
		week: {
			selector: _e,
			shift: (e) => {
				var t;
				return null == (t = u(n).weeks) ? void 0 : t.shift(n, e);
			},
			render: () => me(n)
		},
		year: {
			selector: "[data-vc=\"years\"]",
			shift: (e) => g(n, "displayYear", n.context.displayYear + je(e, 15)),
			render: (e) => Se(n, e)
		},
		month: null
	}[n.context.currentType];
};
var Ke = (e, t, n) => {
	var a;
	let l = ze(e);
	if (!l) return;
	let { mainElement: o } = e.context, r = o.contains(w(o).activeElement), i = "multiple" === e.context.currentType ? Q(e, !0) : void 0;
	X(e), l.shift(t);
	let s = i ? null == (a = u(e).months) ? void 0 : a.rotate(e, i) : void 0;
	s || (i = void 0), we(e, s), Me(e);
	let c = u(e).motion;
	c && e.animation ? c.navigate(e, l.selector, t, () => l.render(n, i)) : l.render(n, i), ((e, t, n) => {
		var a;
		let { mainElement: l } = e.context;
		if (!n || l.contains(w(l).activeElement)) return;
		let o = l.querySelector(`[data-vc-arrow="${t}"]`);
		if (o && "hidden" !== o.style.visibility) return o.focus();
		null == (a = Array.from(l.querySelectorAll("[tabindex=\"0\"]")).find((e) => !e.closest("[data-vc-ghost]"))) || a.focus();
	})(e, t, r);
};
var Be = (e, t, n) => {
	let a = t.dataset.vcDate, l = t.closest("[data-vc-date][data-vc-date-selected]"), o = x(e);
	(!l || o) && g(e, "selectedDates", l ? e.context.selectedDates.filter((e) => e !== a) : n ? [...e.context.selectedDates, a] : [a]);
};
var Ue = (e) => {
	var t;
	return e.inputMode && !0 === (null == (t = e.context.inputElement) ? void 0 : t.matches(":disabled"));
};
var Xe = ["month", "year"];
var Ge = "[data-vc=\"column\"]";
var Ze = (e, t, n) => {
	let a = u(e).motion;
	a && e.animation ? a.changeView(e, t, n) : n();
};
var Je = (e, t) => {
	var n;
	let { columnID: a } = Te(e, e.context.currentType);
	g(e, "currentType", e.type), Ze(e, a, () => Fe(e)), null == (n = e.context.mainElement.querySelector(`[data-vc="${t}"]`)) || n.focus();
};
var Ve = (e) => {
	let t = (t) => {
		var n, a;
		((e, t) => {
			let n = t.target, a = n.closest("[data-vc-arrow]");
			a && (Ke(e, a.dataset.vcArrow, n), e.onClickArrow && e.onClickArrow(e, t));
		})(e, t), null == (n = u(e).weeks) || n.click(e, t), ((e, t) => {
			let n = t.target, a = n.closest("[data-vc-date-btn]");
			if (!e.selectionDatesMode || ![
				"single",
				"multiple",
				"multiple-ranged"
			].includes(e.selectionDatesMode) || !a || Ue(e)) return;
			let l = a.closest("[data-vc-date]");
			({
				single: () => Be(e, l, !1),
				multiple: () => Be(e, l, !0),
				"multiple-ranged": () => M(e, l)
			})[e.selectionDatesMode](), e.context.selectedDates && b(e.context.selectedDates), e.onClickDate && e.onClickDate(e, t), e.inputMode && e.context.inputElement && e.context.mainElement && e.onChangeToInput && e.onChangeToInput(e, t);
			let o = n.closest("[data-vc-date-month=\"prev\"]"), r = n.closest("[data-vc-date-month=\"next\"]");
			({
				prev: () => e.enableMonthChangeOnDayClick ? Ke(e, "prev") : Pe(e),
				next: () => e.enableMonthChangeOnDayClick ? Ke(e, "next") : Pe(e),
				current: () => Pe(e)
			})[o ? "prev" : r ? "next" : "current"]();
		})(e, t), ((e, t) => {
			let n = {
				month: e.selectionMonthsMode,
				year: e.selectionYearsMode
			};
			Xe.forEach((a) => {
				n[a] && t.target && ((e, t, n) => {
					let a = t.target, l = a.closest(`[data-vc="${n}"]`), o = ((e, t) => {
						let n = t.closest(Ge);
						return n ? Array.from(e.context.mainElement.querySelectorAll(Ge)).indexOf(n) : 0;
					})(e, a), r = {
						year: () => Ze(e, o, () => Se(e, a)),
						month: () => Ze(e, o, () => Ae(e, a))
					};
					if (l && e.onClickTitle && e.onClickTitle(e, t), l && e.context.currentType !== n) {
						let t = a.closest(Ge);
						return r[n](), ((e, t, n) => {
							var a;
							return null == (a = (null == n ? e.context.mainElement : n).querySelector(`[data-vc-${t}s-${t}][tabindex="0"]`)) ? void 0 : a.focus();
						})(e, n, t);
					}
					let i = a.closest(`[data-vc-${n}s-${n}]`);
					if (i) return ((e, t, n, a) => {
						({
							year: () => {
								var t;
								if ("multiple" === e.type) return null == (t = u(e).months) ? void 0 : t.select(e, "year", a);
								g(e, "selectedYear", Number(a.dataset.vcYearsYear));
							},
							month: () => {
								var t;
								if ("multiple" === e.type) return null == (t = u(e).months) ? void 0 : t.select(e, "month", a);
								g(e, "selectedMonth", Number(a.dataset.vcMonthsMonth));
							}
						})[n](), {
							year: () => {
								var n;
								return null == (n = e.onClickYear) ? void 0 : n.call(e, e, t);
							},
							month: () => {
								var n;
								return null == (n = e.onClickMonth) ? void 0 : n.call(e, e, t);
							}
						}[n](), e.context.currentType === e.type ? Ee(e, a, n, !0, !0) : Je(e, n);
					})(e, t, n, i);
					let s = a.closest("[data-vc=\"grid\"]"), c = a.closest("[data-vc=\"column\"]");
					(e.context.currentType === n && l || "multiple" === e.type && e.context.currentType === n && s && !c) && Je(e, n);
				})(e, t, a);
			});
		})(e, t), null == (a = u(e).weeks) || a.collapseClick(e, t);
	};
	return e.context.mainElement.addEventListener("click", t), () => e.context.mainElement.removeEventListener("click", t);
};
var Qe = /* @__PURE__ */ new WeakMap();
var et = (e, t) => {
	let a = e[t].map((e) => e instanceof Date ? e.getTime() : e), l = Qe.get(e), o = null == l ? void 0 : l[t];
	if (o && a.length === o.values.length) {
		let e = 0;
		for (; e < a.length && a[e] === o.values[e];) e++;
		if (e === a.length && o.timezone === new Intl.DateTimeFormat().resolvedOptions().timeZone) return o.dates.slice();
	}
	let r = n(e[t]);
	if (r.length > 1 && b(r), r.length > 128 && r.length <= 1e4 && a.length <= 1e4) {
		let n = null == l ? {} : l;
		n[t] = {
			values: a,
			dates: r.slice(),
			timezone: new Intl.DateTimeFormat().resolvedOptions().timeZone
		}, Qe.set(e, n);
	} else l && delete l[t];
	return r;
};
var tt = (e, t) => "today" === e ? (() => {
	let e = /* @__PURE__ */ new Date();
	/* @__PURE__ */
	return (/* @__PURE__ */ new Date(e.getTime() - 6e4 * e.getTimezoneOffset())).toISOString().substring(0, 10);
})() : e instanceof Date || "number" == typeof e || "string" == typeof e ? n([e])[0] : t;
var nt = (e, t, n) => {
	g(e, "selectedMonth", t), g(e, "selectedYear", n), g(e, "displayYear", n);
};
var at = (t) => {
	var a, l;
	if (t.enableCollapse && !["default", "week"].includes(t.type)) throw Error("The «enableCollapse» parameter is only supported by the «default» and «week» calendar types.");
	g(t, "currentType", t.type), ((e) => {
		if ("multiple" === e.type && (e.displayMonthsCount <= 1 || e.displayMonthsCount > 12) || "multiple" !== e.type && e.displayMonthsCount > 1) throw Error("For the «multiple» calendar type, the «displayMonthsCount» parameter can have a value from 2 to 12, and for all others it cannot be greater than 1.");
		g(e, "displayMonthsCount", e.displayMonthsCount ? e.displayMonthsCount : "multiple" === e.type ? 2 : 1);
	})(t), ((t) => {
		var n, a, l;
		let o = tt(t.dateMin, t.dateMin), r = tt(t.dateMax, t.dateMax), i = tt(t.displayDateMin, o), s = tt(t.displayDateMax, r);
		if (g(t, "dateToday", tt(t.dateToday, t.dateToday)), g(t, "displayDateMin", i ? e(o) >= e(i) ? o : i : o), g(t, "displayDateMax", s ? e(r) <= e(s) ? r : s : r), g(t, "displayDateMin", t.disableDatesPast && !t.disableAllDates && e(i) < e(t.context.dateToday) || t.disableAllDates ? t.context.dateToday : i), g(t, "displayDateMax", t.disableAllDates ? t.context.dateToday : s), g(t, "disableDates", t.disableDates[0] && !t.disableAllDates ? et(t, "disableDates") : t.disableAllDates ? [t.context.displayDateMin] : []), g(t, "enableDates", t.enableDates[0] ? et(t, "enableDates") : []), null != (n = t.context.enableDates) && n[0] && null != (a = t.context.disableDates) && a[0]) {
			let e = new Set(t.context.enableDates);
			g(t, "disableDates", t.context.disableDates.filter((t) => !e.has(t)));
		}
		null != (l = t.context.enableDates) && l[0] && t.disableAllDates && (g(t, "displayDateMin", t.context.enableDates[0]), g(t, "displayDateMax", t.context.enableDates[t.context.enableDates.length - 1])), g(t, "dateMin", t.displayDisabledDates ? o : t.context.displayDateMin), g(t, "dateMax", t.displayDisabledDates ? r : t.context.displayDateMax);
	})(t), ((t) => {
		var a;
		if (t.enableJumpToSelectedDate && null != (a = t.selectedDates) && a[0] && void 0 === t.selectedMonth && void 0 === t.selectedYear) {
			let a = e(n(t.selectedDates)[0]);
			nt(t, a.getMonth(), a.getFullYear());
			return;
		}
		if (((t) => {
			let a = (e) => {
				let n = new Date(e);
				nt(t, n.getMonth(), n.getFullYear());
			};
			return t.displayDateMin && "today" !== t.displayDateMin && (l = t.displayDateMin, o = /* @__PURE__ */ new Date(), new Date(l).getTime() > o.getTime()) ? (a(e(tt(t.selectedDates.length && t.selectedDates[0] ? n(t.selectedDates)[0] : t.displayDateMin, t.displayDateMin))), !0) : !(!t.displayDateMax || "today" === t.displayDateMax || !((e, t) => new Date(e).getTime() < t.getTime())(t.displayDateMax, /* @__PURE__ */ new Date()) || (a(e(tt(t.selectedDates.length && t.selectedDates[0] ? n(t.selectedDates)[0] : t.displayDateMax, t.displayDateMax))), 0));
			var l, o;
		})(t)) return;
		let l = void 0 !== t.selectedMonth && Number(t.selectedMonth) >= 0 && Number(t.selectedMonth) < 12, o = void 0 !== t.selectedYear && Number(t.selectedYear) >= 0 && Number(t.selectedYear) <= 9999;
		nt(t, l ? Number(t.selectedMonth) : e(t.context.dateToday).getMonth(), o ? Number(t.selectedYear) : e(t.context.dateToday).getFullYear());
	})(t), ((e) => {
		var t;
		g(e, "selectedDates", null != (t = e.selectedDates) && t[0] ? n(e.selectedDates) : []);
	})(t), null == (a = u(t).weeks) || a.init(t), null == (l = u(t).time) || l.init(t);
};
var lt = (e, { year: t, month: n, dates: a, time: l, locale: o }, r = !0, i) => {
	var s, c, d, m;
	X(e);
	let p = u(e);
	null == (s = p.motion) || s.reset(e), null == (c = p.time) || c.destroy(e), null == (d = p.annotations) || d.destroy(e), D(e);
	let h = {
		year: e.selectedYear,
		month: e.selectedMonth,
		dates: e.selectedDates,
		time: e.selectedTime
	};
	var v;
	e.selectedYear = t ? h.year : e.context.selectedYear, e.selectedMonth = n ? h.month : e.context.selectedMonth, e.selectedTime = l ? h.time : e.context.selectedTime, e.selectedDates = "only-first" === a && null != (m = e.context.selectedDates) && m[0] ? [e.context.selectedDates[0]] : !0 === a ? h.dates : e.context.selectedDates, o && g(e, "locale", {
		months: {
			short: [],
			long: []
		},
		weekdays: {
			short: [],
			long: []
		}
	}), at(e), r && (i && qe(e), i && i.structure === J(e) ? (Ye(e), null == (v = p.time) || v.render(e), Pe(e, !0)) : Fe(e, !1)), e.selectedYear = h.year, e.selectedMonth = h.month, e.selectedDates = h.dates, e.selectedTime = h.time, "multiple-ranged" === e.selectionDatesMode && M(e, null, !!a), r && ee(e, !0);
};
var ot = (e, t, n) => {
	if (!e.context.isInit) throw Error(P);
	m(e), lt(e, We(We({}, {
		year: !0,
		month: !0,
		dates: !0,
		time: !0,
		locale: !0
	}), t), !(e.inputMode && !e.context.inputModeInit), n), e.onUpdate && e.onUpdate(e);
};
var rt = [
	"extensions",
	"context",
	"init",
	"update",
	"destroy",
	"show",
	"hide",
	"set",
	"queryAndMemoize"
];
var it = (e, t, n = !0) => {
	let a = Object.keys(t);
	for (let l = 0; l < a.length; l++) {
		let o = a[l];
		"__proto__" !== o && "constructor" !== o && "prototype" !== o && (n && rt.includes(String(o)) || ("object" != typeof e[o] || null === e[o] || "object" != typeof t[o] || null === t[o] || t[o] instanceof Date || Array.isArray(t[o]) ? void 0 !== t[o] && (e[o] = t[o]) : it(e[o], t[o], !1)));
	}
};
var st = {
	application: "Calendar",
	navigation: "Calendar Navigation",
	arrowNext: {
		month: "Next month",
		year: "Next list of years",
		week: "Next week"
	},
	arrowPrev: {
		month: "Previous month",
		year: "Previous list of years",
		week: "Previous week"
	},
	month: "Select month, current selected month:",
	months: "List of months",
	year: "Select year, current selected year:",
	years: "List of years",
	week: "Days of the week",
	weekNumber: "Numbers of weeks in a year",
	collapse: "Collapse to a single week",
	expand: "Expand to the whole month",
	dates: "Dates in the current month",
	selectingTime: "Selecting a time ",
	inputHour: "Hours",
	inputMinute: "Minutes",
	rangeHour: "Slider for selecting hours",
	rangeMinute: "Slider for selecting minutes",
	btnKeeping: "Switch AM/PM, current position:"
};
var ct = {
	calendar: "vc",
	controls: "vc-controls",
	grid: "vc-grid",
	column: "vc-column",
	header: "vc-header",
	headerContent: "vc-header__content",
	month: "vc-month",
	year: "vc-year",
	arrowPrev: "vc-arrow vc-arrow_prev",
	arrowNext: "vc-arrow vc-arrow_next",
	wrapper: "vc-wrapper",
	content: "vc-content",
	months: "vc-months",
	monthsRow: "vc-months__row",
	monthsCell: "vc-months__cell",
	monthsMonth: "vc-months__month",
	years: "vc-years",
	yearsRow: "vc-years__row",
	yearsCell: "vc-years__cell",
	yearsYear: "vc-years__year",
	week: "vc-week",
	weekDay: "vc-week__day",
	weekDayBtn: "vc-week__day-btn",
	weekNumbers: "vc-week-numbers",
	weekNumbersTitle: "vc-week-numbers__title",
	weekNumbersContent: "vc-week-numbers__content",
	weekNumber: "vc-week-number",
	collapse: "vc-collapse",
	dates: "vc-dates",
	datesRow: "vc-dates__row",
	date: "vc-date",
	dateBtn: "vc-date__btn",
	datePopup: "vc-date__popup",
	dateRangeTooltip: "vc-date-range-tooltip",
	time: "vc-time",
	timeContent: "vc-time__content",
	timeHour: "vc-time__hour",
	timeMinute: "vc-time__minute",
	timeKeeping: "vc-time__keeping",
	timeRanges: "vc-time__ranges",
	timeRange: "vc-time__range"
};
var dt = class {
	constructor() {
		Ie(this, "type", "default"), Ie(this, "inputMode", !1), Ie(this, "openOnFocus", !0), Ie(this, "positionToInput", "left"), Ie(this, "animation", !1), Ie(this, "firstWeekday", 1), Ie(this, "monthsToSwitch", 1), Ie(this, "themeAttrDetect", "html[data-theme]"), Ie(this, "locale", "en"), Ie(this, "dateToday", "today"), Ie(this, "dateMin", "1970-01-01"), Ie(this, "dateMax", "2470-12-31"), Ie(this, "displayDateMin", void 0), Ie(this, "displayDateMax", void 0), Ie(this, "displayDatesOutside", !0), Ie(this, "displayDisabledDates", !1), Ie(this, "displayMonthsCount", void 0), Ie(this, "disableDates", []), Ie(this, "disableAllDates", !1), Ie(this, "disableDatesPast", !1), Ie(this, "disableDatesGaps", !1), Ie(this, "disableWeekdays", []), Ie(this, "disableToday", !1), Ie(this, "enableDates", []), Ie(this, "enableEdgeDatesOnly", !0), Ie(this, "enableDateToggle", !0), Ie(this, "enableWeekNumbers", !1), Ie(this, "enableMonthChangeOnDayClick", !0), Ie(this, "enableJumpToSelectedDate", !1), Ie(this, "enableCollapse", !1), Ie(this, "enableSwipe", !1), Ie(this, "selectionDatesMode", "single"), Ie(this, "selectionMonthsMode", !0), Ie(this, "selectionYearsMode", !0), Ie(this, "selectionTimeMode", !1), Ie(this, "selectedDates", []), Ie(this, "selectedMonth", void 0), Ie(this, "selectedYear", void 0), Ie(this, "selectedHolidays", []), Ie(this, "selectedWeekends", [0, 6]), Ie(this, "selectedTime", void 0), Ie(this, "selectedTheme", "system"), Ie(this, "timeMinHour", 0), Ie(this, "timeMaxHour", 23), Ie(this, "timeMinMinute", 0), Ie(this, "timeMaxMinute", 59), Ie(this, "timeControls", "all"), Ie(this, "timeStepHour", 1), Ie(this, "timeStepMinute", 1), Ie(this, "sanitizerHTML", K), Ie(this, "onClickDate", void 0), Ie(this, "onClickWeekDay", void 0), Ie(this, "onClickWeekNumber", void 0), Ie(this, "onClickTitle", void 0), Ie(this, "onClickMonth", void 0), Ie(this, "onClickYear", void 0), Ie(this, "onClickArrow", void 0), Ie(this, "onChangeTime", void 0), Ie(this, "onChangeToInput", void 0), Ie(this, "onCreateDateRangeTooltip", void 0), Ie(this, "onCreateDateEls", void 0), Ie(this, "onCreateMonthEls", void 0), Ie(this, "onCreateYearEls", void 0), Ie(this, "onInit", void 0), Ie(this, "onUpdate", void 0), Ie(this, "onDestroy", void 0), Ie(this, "onShow", void 0), Ie(this, "onHide", void 0), Ie(this, "popups", {}), Ie(this, "labels", We(We({}, st), {}, {
			arrowNext: We({}, st.arrowNext),
			arrowPrev: We({}, st.arrowPrev)
		})), Ie(this, "layouts", {
			default: "",
			multiple: "",
			month: "",
			year: "",
			week: ""
		}), Ie(this, "styles", We({}, ct));
	}
};
var vt = (e, t) => {
	var n;
	if ("multiple" !== e.type) return {
		currentValue: null,
		columnID: 0
	};
	let a = e.context.mainElement.querySelectorAll("[data-vc=\"column\"]"), l = Array.from(a).findIndex((e) => e.closest(`[data-vc-column="${t}"]`));
	return {
		currentValue: l >= 0 ? Number(null == (n = a[l].querySelector(`[data-vc="${t}"]`)) ? void 0 : n.getAttribute(`data-vc-${t}`)) : null,
		columnID: Math.max(l, 0)
	};
};
var yt = (e, t, n) => {
	let { currentValue: a, columnID: l } = vt(e, t);
	return "month" === e.context.currentType && l >= 0 ? n - l : "year" === e.context.currentType && e.context.selectedYear !== a ? n - 1 : n;
};
var gt = /* @__PURE__ */ Object.freeze({
	name: "months",
	layout: (e) => `\n  <div class="${_(e.styles.controls)}" data-vc="controls" role="group" aria-label="${_(e.labels.navigation)}">\n    <#ArrowPrev [month] />\n    <#ArrowNext [month] />\n  </div>\n  <div class="${_(e.styles.grid)}" data-vc="grid">\n    <#Multiple>\n      <div class="${_(e.styles.column)}" data-vc="column" role="group">\n        <div class="${_(e.styles.header)}" data-vc="header">\n          <div class="${_(e.styles.headerContent)}" data-vc-header="content" aria-live="polite" aria-atomic="true">\n            <#Month />\n            <#Year />\n          </div>\n        </div>\n        <div class="${_(e.styles.wrapper)}" data-vc="wrapper">\n          <#WeekNumbers />\n          <div class="${_(e.styles.content)}" data-vc="content" role="grid">\n            <#Week />\n            <#Dates />\n          </div>\n        </div>\n      </div>\n    <#/Multiple>\n    <#DateRangeTooltip />\n  </div>\n  <#ControlTime />\n`,
	render: (e, t) => {
		var n;
		if ("multiple" === e.context.currentType) return null == (n = u(e).time) || n.destroy(e), e.context.mainElement.innerHTML = e.sanitizerHTML(((e, t) => t.replace(RegExp("<#Multiple>(.*?)<#\\/Multiple>", "gs"), (t, n) => {
			let a = Array(e.context.displayMonthsCount).fill(n).join("");
			return e.sanitizerHTML(a);
		}).replace(/[\n\t]/g, ""))(e, xe(e, e.layouts.multiple))), !0;
		if ("multiple" !== e.type || !t) return !1;
		let a = e.context.mainElement.querySelector("[data-vc=\"controls\"]"), l = e.context.mainElement.querySelector("[data-vc=\"grid\"]"), o = t.closest("[data-vc=\"column\"]");
		return a && a.remove(), l && (l.dataset.vcGrid = "hidden"), o && (o.dataset.vcColumn = e.context.currentType), o && (o.innerHTML = e.sanitizerHTML(xe(e, e.layouts[e.context.currentType]))), !0;
	},
	column: vt,
	select: (t, n, a) => "month" === n ? ((t, n) => {
		let a = n.closest("[data-vc-column=\"month\"]").querySelector("[data-vc=\"year\"]"), l = yt(t, "month", Number(n.dataset.vcMonthsMonth)), o = Number(a.dataset.vcYear), r = e(t.context.dateMin), i = e(t.context.dateMax), s = l < r.getMonth() && o <= r.getFullYear(), c = l > i.getMonth() && o >= i.getFullYear();
		g(t, "selectedYear", o), g(t, "selectedMonth", s ? r.getMonth() : c ? i.getMonth() : l);
	})(t, a) : ((t, n) => {
		let a = yt(t, "year", Number(n.dataset.vcYearsYear)), l = e(t.context.dateMin), o = e(t.context.dateMax), r = t.context.displayMonthsCount - 1, { columnID: i } = vt(t, "year"), s = t.context.selectedMonth < l.getMonth() && a <= l.getFullYear(), c = t.context.selectedMonth > o.getMonth() - r + i && a >= o.getFullYear(), d = a < l.getFullYear(), u = a > o.getFullYear(), m = s || d ? l.getFullYear() : c || u ? o.getFullYear() : a, p = s || d ? l.getMonth() : c || u ? o.getMonth() - r + i : t.context.selectedMonth;
		g(t, "selectedYear", m), g(t, "selectedMonth", p);
	})(t, a),
	rotate: (e, t) => {
		var n;
		let a = 12 * e.context.selectedYear + e.context.selectedMonth - t.month;
		if (!a || Math.abs(a) >= t.count) return;
		let l = Array.from(e.context.mainElement.querySelectorAll("[data-vc=\"column\"]")), o = null == (n = l[0]) ? void 0 : n.parentElement;
		if (!o || l.length !== t.count || l.some((e) => e.parentElement !== o) || Array.from(o.childNodes).some((e) => {
			var t;
			return 1 === e.nodeType ? !l.includes(e) : 3 !== e.nodeType || !(null == (t = e.textContent) || !t.trim());
		})) return;
		let r = [];
		if (a > 0) {
			let e = l[l.length - 1].nextSibling;
			for (let n = 0; n < a; n++) {
				let i = l[n].nextSibling;
				3 === (null == i ? void 0 : i.nodeType) && i !== e && o.insertBefore(i, e), o.insertBefore(l[n], e), r.push(t.count - a + n);
			}
		} else for (let i = t.count + a; i < t.count; i++) {
			let e = l[i].previousSibling;
			o.insertBefore(l[i], l[0]), 3 === (null == e ? void 0 : e.nodeType) && o.insertBefore(e, l[0]), r.push(i - t.count - a);
		}
		return r;
	}
});
var sn = class e extends dt {
	constructor(t, n) {
		var a;
		super(), Ie(this, "extensions", void 0), Ie(this, "init", () => ((e) => {
			var t;
			if (e.context.isInit) throw Error("The calendar has already been initialized, calling init() again is not allowed. Create a new Calendar instance instead.");
			if (m(e), g(e, "originalElement", e.context.mainElement.cloneNode(!0)), g(e, "isInit", !0), e.inputMode) {
				let t = ((e) => {
					g(e, "inputElement", e.context.mainElement);
					let t = e.context.inputElement;
					[
						"input",
						"button",
						"textarea"
					].includes(t.localName) && (t.setAttribute("aria-haspopup", "dialog"), ("button" === t.localName || "combobox" === t.getAttribute("role")) && t.setAttribute("aria-expanded", "false"));
					let n = () => {
						e.context.inputModeInit ? q(e) : ((e) => {
							var t;
							let n = document.createElement("div");
							n.className = e.styles.calendar, n.dataset.vc = "calendar", n.dataset.vcInput = "", n.dataset.vcCalendarHidden = "", Object.assign(n.style, {
								left: "0",
								top: "0"
							}), S(n);
							let a = w(e.context.mainElement), l = a === document ? document.body : a;
							g(e, "inputModeInit", !0), g(e, "isShowInInputMode", !1), g(e, "mainElement", n), l.appendChild(e.context.mainElement), lt(e, {
								year: !0,
								month: !0,
								dates: !0,
								time: !0,
								locale: !0
							}), q(e), e.onInit && e.onInit(e), e.context.isDestroyed || (Re(e), null == (t = u(e).motion) || t.bind(e), Ve(e));
						})(e);
					};
					e.context.inputElement.addEventListener("click", n);
					let a = "function" == typeof e.openOnFocus || !0 === e.openOnFocus, l = () => {
						((e) => E.has(e))(e) ? ((e) => {
							E.delete(e);
						})(e) : ((e) => f(e, e.openOnFocus))(e) && n();
					};
					a && e.context.inputElement.addEventListener("focus", l);
					let o = (t) => {
						let n = "Tab" === t.key && !t.shiftKey, a = [
							"ArrowUp",
							"ArrowDown",
							"ArrowLeft",
							"ArrowRight"
						].includes(t.key);
						(n || a) && ((t) => {
							if (!e.context.isShowInInputMode || w(e.context.mainElement).activeElement !== e.context.inputElement) return !1;
							let n = Y(e.context.mainElement)[0];
							n && (t.preventDefault(), n.focus());
						})(t);
					};
					return e.context.inputElement.addEventListener("keydown", o), () => {
						t.removeEventListener("click", n), a && t.removeEventListener("focus", l), t.removeEventListener("keydown", o);
					};
				})(e);
				return g(e, "cleanupInput", t), t;
			}
			if (at(e), Fe(e), "multiple-ranged" === e.selectionDatesMode && 1 === e.context.selectedDates.length && (M(e, null), Pe(e)), e.onInit && e.onInit(e), !e.context.isDestroyed) return Re(e), null == (t = u(e).motion) || t.bind(e), Ve(e);
		})(this)), Ie(this, "update", (e) => ot(this, e)), Ie(this, "destroy", () => {
			let t = this.inputMode ? this.context.inputElement : this.context.mainElement;
			if (((e) => {
				var t, n, a, o, r, i, s, c;
				if (!e.context.isInit) throw Error(P);
				if (e.context.isDestroyed) throw Error("The calendar has already been destroyed, calling destroy() again is not allowed.");
				U(e);
				let d = u(e);
				var m, p, h, v, y;
				null == (t = d.motion) || t.destroy(e), null == (n = d.time) || n.destroy(e), null == (a = d.annotations) || a.destroy(e), D(e), ((e) => {
					l.delete(e);
				})(e), O(e), null == (o = (r = e.context).cleanupInput) || o.call(r), g(e, "cleanupInput", void 0), null == (i = e.context.cleanupHandlers) || i.forEach((e) => e()), g(e, "cleanupHandlers", []), g(e, "isShowInInputMode", !1), null == (s = (c = e.context).cleanupSystemTheme) || s.call(c), e.inputMode ? (e.context.mainElement !== e.context.inputElement && (null == (h = e.context.mainElement.parentElement) || h.removeChild(e.context.mainElement)), null == (m = e.context.inputElement) || null == (p = m.replaceWith) || p.call(m, e.context.originalElement), g(e, "inputElement", void 0)) : null == (v = (y = e.context.mainElement).replaceWith) || v.call(y, e.context.originalElement), g(e, "mainElement", e.context.originalElement), g(e, "isDestroyed", !0), e.onDestroy && e.onDestroy(e);
			})(this), t) for (let [n, a] of e.memoizedElements) a === t && e.memoizedElements.delete(n);
		}), Ie(this, "show", () => F(this)), Ie(this, "hide", () => $(this)), Ie(this, "set", (e, t) => ((e, t, n) => {
			m(e, t);
			let a = Object.keys(t);
			t.extensions && a.splice(a.indexOf("extensions"), 1);
			let l = 1 === a.length && "selectedDates" === a[0] ? Q(e) : void 0;
			it(e, t), e.context.isInit && ot(e, n, l);
		})(this, e, t)), Ie(this, "context", void 0), this.context = We(We({}, this.context), {}, { locale: {
			months: {
				short: [],
				long: []
			},
			weekdays: {
				short: [],
				long: []
			}
		} }), g(this, "mainElement", "string" == typeof t ? null == (a = e.memoizedElements.get(t)) ? this.queryAndMemoize(t) : a : t);
		let o = null == n ? void 0 : n.extensions;
		this.extensions = null != o && o.length ? Object.freeze(Array.from(new Set(o))) : d, ((e) => {
			if (!e.extensions.length) return;
			let t = {};
			for (let n of e.extensions) {
				let e = n, a = e.name;
				if (!i.includes(a)) throw Error("Unknown calendar extension.");
				if (t[a] && t[a] !== e) throw Error(`Conflicting calendar extension: ${a}.`);
				Object.assign(t, { [a]: e });
			}
			s.set(e, t);
		})(this), n && it(this, n);
	}
	queryAndMemoize(t) {
		let n = document.querySelector(t);
		if (!n) throw Error(((e) => `${e} is not found, check the first argument passed to new Calendar. If the element lives inside a Shadow DOM, a string selector can't reach it - resolve the element yourself (e.g. shadowRoot.querySelector(...)) and pass it directly instead.`)(t));
		return e.memoizedElements.set(t, n), n;
	}
};
Ie(sn, "memoizedElements", /* @__PURE__ */ new Map());
// node_modules/bootstrap/js/dist/datepicker.js
/*!
* Bootstrap datepicker.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
/**
* --------------------------------------------------------------------------
* Bootstrap datepicker.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
var NAME$4 = "datepicker";
var EVENT_KEY$4 = `.bs.datepicker`;
var DATA_API_KEY$2 = ".data-api";
var EVENT_CHANGE = `change${EVENT_KEY$4}`;
var EVENT_SHOW$1 = `show${EVENT_KEY$4}`;
var EVENT_SHOWN$1 = `shown${EVENT_KEY$4}`;
var EVENT_HIDE$1 = `hide${EVENT_KEY$4}`;
var EVENT_HIDDEN$1 = `hidden${EVENT_KEY$4}`;
var EVENT_FOCUSIN = `focusin${EVENT_KEY$4}`;
var EVENT_POINTERDOWN$1 = `pointerdown${EVENT_KEY$4}`;
var EVENT_CLICK = `click${EVENT_KEY$4}`;
var EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$4}${DATA_API_KEY$2}`;
var EVENT_FOCUSIN_DATA_API = `focusin${EVENT_KEY$4}${DATA_API_KEY$2}`;
var SELECTOR_DATA_TOGGLE$3 = "[data-bs-toggle=\"datepicker\"]";
var EVENT_KEYDOWN$1 = `keydown${EVENT_KEY$4}`;
var FOCUSABLE = "a[href], button, input, select, textarea, [tabindex], [contenteditable=\"true\"]";
var Default$3 = {
	datepickerTheme: null,
	dateMin: null,
	dateMax: null,
	dateFormat: null,
	displayElement: null,
	displayMonthsCount: 1,
	firstWeekday: 1,
	invalidDateMessage: "Enter a valid date available in the calendar.",
	inline: false,
	showOnFocus: true,
	toggleElement: null,
	locale: "default",
	positionElement: null,
	selectedDates: [],
	selectionMode: "single",
	rangeEndMessage: "Choose an end date.",
	placement: "left",
	vcpOptions: {}
};
var DefaultType$3 = {
	datepickerTheme: "(null|string)",
	dateMin: "(null|string|number|object)",
	dateMax: "(null|string|number|object)",
	dateFormat: "(null|object|function)",
	displayElement: "(null|string|element|boolean)",
	displayMonthsCount: "number",
	firstWeekday: "number",
	inline: "boolean",
	invalidDateMessage: "string",
	showOnFocus: "boolean",
	toggleElement: "(null|string|element)",
	locale: "string",
	positionElement: "(null|string|element)",
	selectedDates: "array",
	selectionMode: "string",
	placement: "string",
	rangeEndMessage: "string",
	vcpOptions: "object"
};
var formBindings = /* @__PURE__ */ new WeakMap();
var bindFormData = (form, key, serialize) => {
	let binding = formBindings.get(form);
	if (!binding) {
		const state = {
			controls: /* @__PURE__ */ new Map(),
			handler() {}
		};
		state.handler = (event) => {
			const entries = [];
			for (const [name, value] of event.formData) {
				const control = state.controls.get(name);
				if (!control) {
					entries.push([name, value]);
					continue;
				}
				const entry = control();
				if (entry) entries.push(entry);
			}
			for (const name of new Set(event.formData.keys())) event.formData.delete(name);
			for (const [name, value] of entries) event.formData.append(name, value);
		};
		binding = state;
		formBindings.set(form, binding);
		form.addEventListener("formdata", binding.handler, true);
	}
	binding.controls.set(key, serialize);
	return () => {
		binding.controls.delete(key);
		if (binding.controls.size === 0) {
			form.removeEventListener("formdata", binding.handler, true);
			formBindings.delete(form);
		}
	};
};
/**
* Class definition
*/
var Datepicker = class extends BaseComponent {
	constructor(element, config) {
		super(element, config);
		this._calendar = null;
		this._toggleElement = null;
		this._returnFocusElement = this._element;
		this._originalToggleAria = /* @__PURE__ */ new Map();
		this._popup = null;
		this._isShown = false;
		this._floatingCleanup = null;
		this._resetTimeouts = /* @__PURE__ */ new Set();
		this._suppressFocus = false;
		this._positionGeneration = 0;
		this._showGeneration = 0;
		this._inputName = null;
		this._inputObserver = null;
		this._form = null;
		this._formCleanup = null;
		this._dialog = null;
		this._initialDates = [];
		this._rangeDates = [];
		this._pendingRange = false;
		this._rangeStatus = null;
		this._inputError = null;
		this._inputErrorMessage = "";
		this._originalInvalid = null;
		this._eventPending = false;
		this._originalAria = new Map([
			"aria-haspopup",
			"aria-expanded",
			"aria-controls"
		].map((name) => [name, this._element.getAttribute(name)]));
		try {
			this._initCalendar();
		} catch (error) {
			this.dispose();
			throw error;
		}
	}
	static get Default() {
		return Default$3;
	}
	static get DefaultType() {
		return DefaultType$3;
	}
	static get NAME() {
		return NAME$4;
	}
	toggle(relatedTarget) {
		if (this._isInline) return Promise.resolve();
		return this._isShown ? this.hide() : this.show(relatedTarget);
	}
	async show(relatedTarget) {
		if (this._skipFocusTrigger(relatedTarget)) return;
		if (!this._calendar || this._isInline || this._isShown || this._eventPending || this._suppressFocus || isDisabled(this._element) || this._element.matches(":disabled")) return;
		if (this._triggerLifecycleEvent(EVENT_SHOW$1).defaultPrevented || !this._calendar || this._isShown) return;
		this._popup.style.removeProperty("max-inline-size");
		this._popup.style.removeProperty("max-block-size");
		this._returnFocusElement = relatedTarget || this._element;
		const generation = ++this._showGeneration;
		this._isShown = true;
		const popup = this._popup;
		this._mountPopup();
		this._syncDisplayMonths();
		this._syncPopupState(this._calendar);
		popup.removeAttribute("data-vc-calendar-closing");
		if (typeof popup.showPopover === "function" && !popup.matches(":popover-open")) popup.showPopover();
		this._element.setAttribute("aria-expanded", "true");
		await this._updatePosition();
		if (!this._isCurrentOpening(generation)) return;
		this._floatingCleanup?.();
		this._floatingCleanup = autoUpdate(this._positionElement, popup, () => {
			this._syncDisplayMonths();
			this._updatePosition();
		});
		if (!this._isInput || relatedTarget && relatedTarget !== this._element) this._focusCalendarDate();
		await this._queueCallback(() => {
			if (this._isCurrentOpening(generation)) EventHandler.trigger(this._element, EVENT_SHOWN$1);
		}, popup, getTransitionDurationFromElement(popup) > 0);
	}
	async hide() {
		if (!this._calendar || this._isInline || !this._isShown || this._eventPending) return;
		if (this._triggerLifecycleEvent(EVENT_HIDE$1).defaultPrevented || !this._calendar) return;
		const popup = this._popup;
		const animated = getTransitionDurationFromElement(popup) > 0;
		this._closePopup(animated);
		const generation = this._showGeneration;
		await this._queueCallback(() => {
			if (this._calendar && !this._isShown && generation === this._showGeneration) {
				this._finishPopupClose();
				EventHandler.trigger(this._element, EVENT_HIDDEN$1);
			}
		}, popup, animated);
	}
	_triggerLifecycleEvent(name) {
		this._eventPending = true;
		try {
			return EventHandler.trigger(this._element, name);
		} finally {
			this._eventPending = false;
		}
	}
	_closePopup(animated = false) {
		this._showGeneration++;
		this._isShown = false;
		this._positionGeneration++;
		if (animated) this._popup?.setAttribute("data-vc-calendar-closing", "");
		else this._finishPopupClose();
		if (this._calendar) {
			this._cancelPendingRange();
			this._syncPopupState(this._calendar);
		}
		this._element?.setAttribute("aria-expanded", "false");
	}
	_finishPopupClose() {
		this._floatingCleanup?.();
		this._floatingCleanup = null;
		if (this._popup?.matches(":popover-open")) this._popup.hidePopover();
		this._popup?.removeAttribute("data-vc-calendar-closing");
	}
	dispose() {
		this._syncBoundInput();
		this._setInputError("");
		if (this._onInvalid) this._element.removeEventListener("invalid", this._onInvalid);
		this._resetTimeouts.forEach((timeout) => clearTimeout(timeout));
		this._closePopup();
		this._themeObserver?.disconnect();
		this._inputObserver?.disconnect();
		this._formCleanup?.();
		if (this._form && this._onReset) EventHandler.off(this._form, `reset${EVENT_KEY$4}`, this._onReset);
		if (this._onOutside) {
			EventHandler.off(document, EVENT_FOCUSIN, this._onOutside);
			EventHandler.off(document, EVENT_POINTERDOWN$1, this._onOutside);
		}
		if (this._onKeydown) {
			EventHandler.off(this._element, EVENT_KEYDOWN$1, this._onKeydown);
			this._popup?.removeEventListener("keydown", this._onKeydown, true);
		}
		if (this._toggleElement) {
			EventHandler.off(this._toggleElement, EVENT_CLICK, this._onToggleClick);
			EventHandler.off(this._toggleElement, EVENT_KEYDOWN$1, this._onKeydown);
			this._restoreAria(this._toggleElement, this._originalToggleAria);
		}
		if (this._onTriggerClick) EventHandler.off(this._positionElement, EVENT_CLICK, this._onTriggerClick);
		if (this._dialog) EventHandler.off(this._dialog, "close", this._onDialogClose);
		if (this._calendar?.context.isInit) {
			this._calendar.destroy();
			this._calendar.context.mainElement.remove();
		} else this._popup?.remove();
		if (this._inputName !== null) {
			this._element.setAttribute("name", this._inputName);
			this._boundInput?.remove();
		}
		this._restoreAria(this._element, this._originalAria);
		this._calendar = null;
		super.dispose();
	}
	getSelectedDates() {
		const dates = this._config?.selectionMode === "multiple-ranged" ? this._rangeDates : this._calendar?.context.selectedDates;
		return dates ? [...dates] : [];
	}
	setSelectedDates(dates) {
		if (this._calendar) {
			for (const date of dates) if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date) && !this._parseIsoDate(date)) throw new TypeError("Invalid ISO date");
			this._pendingRange = false;
			this._calendar.set({ selectedDates: dates });
			this._rangeDates = [...this._calendar.context.selectedDates];
			this._syncSelectedDates(this.getSelectedDates());
		}
	}
	_getConfig(config) {
		return super._getConfig({
			vcpOptions: Default$3.vcpOptions,
			...config
		});
	}
	_isCurrentOpening(generation) {
		return Boolean(this._calendar) && this._isShown && generation === this._showGeneration;
	}
	_skipFocusTrigger(relatedTarget) {
		return this._isInput && relatedTarget === this._element && !this._config.showOnFocus;
	}
	_containsTrigger(target) {
		return this._positionElement.contains(target) || this._element.contains(target) || Boolean(this._toggleElement?.contains(target));
	}
	_restoreAria(element, original) {
		for (const [name, value] of original) if (value === null) element.removeAttribute(name);
		else element.setAttribute(name, value);
	}
	_initCalendar() {
		this._isInput = this._element.tagName === "INPUT";
		this._isInline = this._config.inline;
		if (this._isInline && !this._isInput) this._boundInput = this._element.querySelector("input[type=\"hidden\"], input[name]");
		if (this._isInput && !this._isInline && this._config.toggleElement) {
			const root = this._element.getRootNode();
			this._toggleElement = typeof this._config.toggleElement === "string" ? root.querySelector(this._config.toggleElement) : this._config.toggleElement;
			if (this._toggleElement === this._element) throw new TypeError("The Datepicker toggle must be separate from its input");
			if (this._toggleElement) this._originalToggleAria = new Map([
				"aria-haspopup",
				"aria-expanded",
				"aria-controls"
			].map((name) => [name, this._toggleElement.getAttribute(name)]));
		}
		this._positionElement = this._resolvePositionElement();
		this._displayElement = this._resolveDisplayElement();
		const display = this._displayElement;
		this._displayPlaceholder = display && this._element.contains(display) && display.hasAttribute("data-bs-datepicker-display") ? display.textContent : "";
		this._popup = document.createElement("div");
		if (this._isInline) this._element.append(this._popup);
		else {
			this._popup.id = getUID("bs-datepicker-calendar-");
			this._popup.setAttribute("popover", "manual");
			this._element.setAttribute("aria-haspopup", "dialog");
			this._element.setAttribute("aria-expanded", "false");
			this._element.setAttribute("aria-controls", this._popup.id);
			if (this._toggleElement) {
				this._toggleElement.setAttribute("aria-haspopup", "dialog");
				this._toggleElement.setAttribute("aria-controls", this._popup.id);
			}
			this._mountPopup();
		}
		this._calendar = new sn(this._popup, this._buildCalendarOptions());
		this._calendar.init();
		this._rangeDates = [...this._calendar.context.selectedDates];
		if (this._isInput && this._element.value && (!this._element.readOnly || !this._rangeDates.length)) this._parseInputValue();
		this._initialDates = this.getSelectedDates();
		if (this._isInput && !this._isInline) {
			this._createBoundInput();
			this._bindInputForm();
			EventHandler.on(this._element, `input${EVENT_KEY$4}`, () => this._parseInputValue());
			this._onInvalid = () => this._showInputError();
			EventHandler.on(this._element, `blur${EVENT_KEY$4}`, this._onInvalid);
			this._element.addEventListener("invalid", this._onInvalid);
		}
		this._updateDisplayWithSelectedDates();
		if (this._isInline && this._boundInput) this._bindInputForm();
		this._setupThemeObserver();
		this._setupDismiss();
	}
	_createBoundInput() {
		const name = this._element.getAttribute("name");
		if (!name) return;
		this._inputName = name;
		this._boundInput = document.createElement("input");
		this._boundInput.type = "hidden";
		this._boundInput.id = getUID("bs-datepicker-");
		this._boundInput.name = this._boundInput.id;
		this._element.before(this._boundInput);
		this._element.removeAttribute("name");
		this._syncBoundInput();
		this._inputObserver = new MutationObserver(() => {
			this._syncBoundInput();
			this._bindInputForm();
		});
		this._inputObserver.observe(this._element, {
			attributes: true,
			attributeFilter: [
				"name",
				"disabled",
				"form"
			]
		});
	}
	_syncBoundInput() {
		if (this._inputName === null || !this._boundInput) return;
		const name = this._element.getAttribute("name");
		if (name !== null) {
			this._inputName = name;
			this._element.removeAttribute("name");
		}
		const form = this._element.getAttribute("form");
		if (form === null) this._boundInput.removeAttribute("form");
		else this._boundInput.setAttribute("form", form);
		this._boundInput.value = this.getSelectedDates().join(",");
	}
	_bindInputForm() {
		const form = this._isInput ? this._element.form : this._boundInput?.form ?? null;
		if (form === this._form) return;
		this._formCleanup?.();
		this._resetTimeouts.forEach((timeout) => clearTimeout(timeout));
		this._resetTimeouts.clear();
		if (this._form) EventHandler.off(this._form, `reset${EVENT_KEY$4}`, this._onReset);
		this._form = form;
		if (!form) return;
		if (this._inputName !== null && this._boundInput) this._formCleanup = bindFormData(form, this._boundInput.name, () => {
			this._syncBoundInput();
			return this._element.matches(":disabled") || isDisabled(this._element) || !this._inputName ? null : [this._inputName, this.getSelectedDates().join(",")];
		});
		this._onReset = (event) => {
			const timeout = setTimeout(() => {
				this._resetTimeouts.delete(timeout);
				if (!event.defaultPrevented && this._calendar && event.target === this._form) this.setSelectedDates(this._initialDates);
			}, 0);
			this._resetTimeouts.add(timeout);
		};
		EventHandler.on(form, `reset${EVENT_KEY$4}`, this._onReset);
	}
	_mountPopup() {
		let ancestor = this._element;
		let dialog = null;
		while (ancestor && !dialog) {
			dialog = ancestor.closest("dialog[open]");
			const root = ancestor.getRootNode();
			ancestor = root instanceof ShadowRoot ? root.host : null;
		}
		if (dialog !== this._dialog) {
			if (this._dialog) EventHandler.off(this._dialog, "close", this._onDialogClose);
			this._dialog = dialog;
			this._onDialogClose = () => this._closePopup();
			if (dialog) EventHandler.on(dialog, "close", this._onDialogClose);
		}
		const root = this._element.getRootNode();
		const parent = root instanceof ShadowRoot ? root : dialog || document.body;
		if (this._popup.parentNode !== parent) parent.append(this._popup);
	}
	async _updatePosition() {
		const popup = this._popup;
		if (!popup || !this._isShown && !popup.hasAttribute("data-vc-calendar-closing")) return;
		const generation = ++this._positionGeneration;
		const left = popup.dir === "rtl" ? "-end" : "-start";
		const right = popup.dir === "rtl" ? "-start" : "-end";
		const alignment = this._config.placement === "center" ? "" : this._config.placement === "right" ? right : left;
		const result = await computePosition(this._positionElement, popup, {
			placement: `bottom${alignment}`,
			strategy: "fixed",
			middleware: [
				offset(4),
				flip({ padding: 8 }),
				shift({
					padding: 8,
					crossAxis: true
				}),
				size({
					padding: 8,
					apply: ({ availableWidth, availableHeight, elements }) => {
						if (generation === this._positionGeneration) Object.assign(elements.floating.style, {
							maxInlineSize: `${Math.max(0, availableWidth)}px`,
							maxBlockSize: `${Math.max(0, availableHeight)}px`
						});
					}
				})
			]
		});
		if (generation !== this._positionGeneration || !this._isShown && !popup.hasAttribute("data-vc-calendar-closing")) return;
		Object.assign(popup.style, {
			position: result.strategy,
			left: `${result.x}px`,
			top: `${result.y}px`
		});
		popup.dataset.vcPosition = result.placement.startsWith("top") ? "top" : "bottom";
	}
	_getCalendarLabel() {
		const root = this._element.getRootNode();
		const label = this._element.getAttribute("aria-labelledby")?.trim().split(/\s+/).map((id) => {
			const label = root.getElementById?.(id);
			return label?.hasAttribute("data-bs-datepicker-display") ? "" : label?.textContent.trim();
		}).filter(Boolean).join(" ") || this._element.getAttribute("aria-label");
		if (label) return label;
		if (this._isInput) return [...this._element.labels || []].map((label) => label.textContent.trim()).filter(Boolean).join(" ");
		return "";
	}
	_getDisplayMonths() {
		const { displayMonthsCount } = this._config;
		return displayMonthsCount > 1 && !this._isInline && window.matchMedia("(width < 576px)").matches ? 1 : displayMonthsCount;
	}
	_syncDisplayMonths() {
		const calendar = this._calendar;
		const count = this._getDisplayMonths();
		if (!calendar || calendar.displayMonthsCount === count) return;
		const root = this._popup.getRootNode();
		const hadFocus = this._popup.contains(root.activeElement);
		calendar.set({
			type: count > 1 ? "multiple" : "default",
			displayMonthsCount: count,
			selectedDates: [...calendar.context.selectedDates]
		}, {
			month: false,
			year: false
		});
		if (hadFocus) this._focusCalendarDate();
	}
	_syncPopupState(self) {
		this._normalizeRangeDates(self);
		const popup = self.context.mainElement;
		if (!this._isInline) {
			popup.dataset.vcInput = "";
			popup.role = "dialog";
			const label = this._getCalendarLabel();
			if (label) popup.setAttribute("aria-label", label);
			popup.toggleAttribute("data-vc-calendar-hidden", !this._isShown);
			popup.inert = !this._isShown;
			popup.setAttribute("aria-hidden", String(!this._isShown));
			this._toggleElement?.setAttribute("aria-expanded", String(this._isShown));
		}
		if (this._config.selectionMode === "multiple-ranged") {
			this._rangeStatus ??= document.createElement("span");
			if (!popup.contains(this._rangeStatus)) {
				this._rangeStatus.className = "visually-hidden";
				this._rangeStatus.setAttribute("role", "status");
				popup.append(this._rangeStatus);
			}
			this._updateRangeStatus();
		}
		this._syncThemeAttribute(popup);
	}
	_updateRangeStatus() {
		const message = this._pendingRange ? this._config.rangeEndMessage : "";
		if (this._rangeStatus && this._rangeStatus.textContent !== message) this._rangeStatus.textContent = message;
	}
	_updateDisplayWithSelectedDates() {
		const selectedDates = this.getSelectedDates();
		if (selectedDates.length > 0) this._syncSelectedDates(selectedDates);
	}
	_syncSelectedDates(selectedDates) {
		this._setInputError("");
		const formattedDate = this._formatDateForInput(selectedDates);
		if (this._isInput) this._element.value = formattedDate;
		if (this._boundInput) {
			this._boundInput.value = selectedDates.join(",");
			this._syncBoundInput();
		}
		this._syncDisplay(selectedDates, formattedDate);
	}
	_syncDisplay(selectedDates, formattedDate = this._formatDateForInput(selectedDates)) {
		if (this._displayElement) {
			const endPlaceholder = this._displayElement.dataset.bsDatepickerEndPlaceholder;
			const partialRange = this._config.selectionMode === "multiple-ranged" && selectedDates.length === 1;
			this._displayElement.textContent = partialRange && endPlaceholder ? `${formattedDate} – ${endPlaceholder}` : selectedDates.length ? formattedDate : this._displayPlaceholder;
		}
	}
	_resolvePositionElement() {
		let { positionElement } = this._config;
		if (typeof positionElement === "string") positionElement = this._element.getRootNode().querySelector(positionElement);
		if (!positionElement && this._isInput && !this._isInline) {
			const parent = this._element.closest(".form-adorn");
			if (parent) positionElement = parent;
		}
		return positionElement || this._element;
	}
	_resolveDisplayElement() {
		const { displayElement } = this._config;
		if (typeof displayElement === "string") return this._element.getRootNode().querySelector(displayElement);
		if (displayElement === true || displayElement === null && !this._isInput && !this._isInline) return this._element.querySelector("[data-bs-datepicker-display]") || this._element;
		return displayElement;
	}
	_getThemeAncestor() {
		return this._element.closest("[data-bs-theme]");
	}
	_getEffectiveTheme() {
		return this._config.datepickerTheme || this._getThemeAncestor()?.getAttribute("data-bs-theme") || null;
	}
	_syncThemeAttribute(element) {
		if (!element) return;
		const theme = this._getEffectiveTheme();
		if (theme) element.setAttribute("data-bs-theme", theme);
		else element.removeAttribute("data-bs-theme");
		const computed = getComputedStyle(this._element);
		element.dir = computed.direction;
		const explicit = this._config.datepickerTheme;
		element.style.colorScheme = explicit === "auto" ? "light dark" : explicit === "light" || explicit === "dark" ? explicit : computed.colorScheme;
		if (!this._isInline) for (const prefix of ["", "bs-"]) for (const role of [
			"base",
			"bg",
			"bg-subtle",
			"bg-muted",
			"fg",
			"fg-emphasis",
			"contrast",
			"border",
			"focus-ring"
		]) {
			const property = `--${prefix}theme-${role}`;
			const value = computed.getPropertyValue(property);
			if (value) element.style.setProperty(property, value);
			else element.style.removeProperty(property);
		}
	}
	_setupThemeObserver() {
		this._themeObserver = new MutationObserver((records) => {
			if (records.some((record) => {
				if (!(record.target instanceof Element)) return false;
				let node = this._element;
				while (node) {
					if (record.target.contains(node)) return true;
					const root = node.getRootNode();
					node = root instanceof ShadowRoot ? root.host : null;
				}
				return false;
			})) this._syncThemeAttribute(this._popup ?? void 0);
		});
		const root = this._element.getRootNode();
		const options = {
			subtree: true,
			attributes: true,
			attributeFilter: [
				"data-bs-theme",
				"class",
				"style",
				"dir"
			]
		};
		this._themeObserver.observe(document.documentElement, options);
		if (root instanceof ShadowRoot) this._themeObserver.observe(root, options);
	}
	_setupDismiss() {
		this._onKeydown = (event) => this._handleKeydown(event);
		this._popup?.addEventListener("keydown", this._onKeydown, true);
		if (this._isInline) return;
		this._onTriggerClick = (event) => {
			if (event.target instanceof Node && this._toggleElement?.contains(event.target)) return;
			if (this._isInput) this.show(this._element);
			else if (this._element.dataset.bsToggle !== NAME$4) this.toggle();
		};
		EventHandler.on(this._positionElement, EVENT_CLICK, this._onTriggerClick);
		if (this._isInput) EventHandler.on(this._element, EVENT_FOCUSIN, () => this.show(this._element));
		this._onOutside = (event) => {
			if (!this._isShown) return;
			if (!event.composedPath().some((node) => node instanceof Node && (this._positionElement.contains(node) || this._element.contains(node) || this._toggleElement?.contains(node) || this._popup?.contains(node)))) this.hide();
		};
		EventHandler.on(document, EVENT_FOCUSIN, this._onOutside);
		EventHandler.on(document, EVENT_POINTERDOWN$1, this._onOutside);
		EventHandler.on(this._element, EVENT_KEYDOWN$1, this._onKeydown);
		if (this._toggleElement) {
			this._onToggleClick = () => {
				if (!isDisabled(this._toggleElement) && !this._toggleElement.matches(":disabled")) this.toggle(this._toggleElement);
			};
			EventHandler.on(this._toggleElement, EVENT_CLICK, this._onToggleClick);
			EventHandler.on(this._toggleElement, EVENT_KEYDOWN$1, this._onKeydown);
		}
	}
	_focusCalendarDate() {
		for (const selector of [
			"[data-vc-date-selected] [data-vc-date-btn]",
			"[data-vc-date-today] [data-vc-date-btn]",
			"[data-vc-date-btn][tabindex=\"0\"]",
			"button"
		]) {
			const control = [...this._popup?.querySelectorAll(selector) || []].find((element) => !isDisabled(element) && isVisible(element));
			if (control) {
				control.focus();
				return;
			}
		}
	}
	_focusTrigger() {
		if (!this._element) return;
		this._suppressFocus = true;
		(this._returnFocusElement?.isConnected ? this._returnFocusElement : this._element).focus();
		this._suppressFocus = false;
	}
	_handleKeydown(event) {
		const { target } = event;
		if (!this._isShown && !this._isInline || !(target instanceof Node) || !this._containsTrigger(target) && !this._popup?.contains(target)) return;
		if (this._handleCalendarNavigation(event)) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}
		if (this._isInline) {
			this._handleInlineEscape(event);
			return;
		}
		if (event.key === "Escape") {
			event.preventDefault();
			event.stopPropagation();
			this.hide();
			if (!this._isShown) this._focusTrigger();
			return;
		}
		if (event.key !== "Tab") return;
		const controls = [...this._popup.querySelectorAll(FOCUSABLE)].filter((element) => element.tabIndex >= 0 && !isDisabled(element) && isVisible(element));
		if (this._containsTrigger(target)) {
			if (!event.shiftKey && controls[0]) {
				event.preventDefault();
				controls[0].focus();
			} else this.hide();
			return;
		}
		if (target === (event.shiftKey ? controls[0] : controls.at(-1))) {
			this.hide();
			if (this._isShown) event.preventDefault();
			else {
				this._focusTrigger();
				if (event.shiftKey) event.preventDefault();
			}
		}
	}
	_handleInlineEscape(event) {
		if (event.key !== "Escape" || !this._pendingRange) return;
		event.preventDefault();
		event.stopPropagation();
		const date = event.target.closest("[data-vc-date]")?.dataset.vcDate;
		this._cancelPendingRange();
		const control = date && this._findCalendarDay(date);
		if (control) this._focusDay(control);
		else this._focusCalendarDate();
	}
	_findCalendarDay(date) {
		return this._popup?.querySelector(`[data-vc-date="${date}"][data-vc-date-month="current"] [data-vc-date-btn]:not(:disabled)`) ?? null;
	}
	_focusDay(day) {
		day.closest("[role=\"grid\"]")?.querySelectorAll("[data-vc-date-btn][tabindex=\"0\"]").forEach((control) => {
			control.tabIndex = -1;
		});
		day.tabIndex = 0;
		day.focus();
	}
	_handleCalendarNavigation(event) {
		const { target } = event;
		if (!this._calendar || !(target instanceof HTMLElement) || !target.matches("[data-vc-date-btn]") || event.altKey || event.ctrlKey || event.metaKey) return false;
		const day = target.closest("[data-vc-date]");
		const date = this._parseIsoDate(day?.dataset.vcDate || "");
		if (!date) return false;
		const { key } = event;
		const page = key === "PageUp" || key === "PageDown";
		const week = key === "Home" || key === "End";
		if (!page && !week && !key.startsWith("Arrow")) return false;
		const currentMonth = date.getMonth();
		let direction;
		if (page) {
			direction = key === "PageUp" ? -1 : 1;
			const dayOfMonth = date.getDate();
			date.setDate(1);
			date.setMonth(currentMonth + (event.shiftKey ? 12 : 1) * direction);
			const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
			date.setDate(Math.min(dayOfMonth, monthEnd));
		} else if (week) {
			const weekday = (date.getDay() - this._config.firstWeekday + 7) % 7;
			date.setDate(date.getDate() + (key === "Home" ? -weekday : 6 - weekday));
			direction = key === "Home" ? 1 : -1;
		} else {
			const rtl = this._popup?.dir === "rtl";
			const step = {
				ArrowLeft: rtl ? 1 : -1,
				ArrowRight: rtl ? -1 : 1,
				ArrowUp: -7,
				ArrowDown: 7
			}[key];
			if (!step) return false;
			date.setDate(date.getDate() + step);
			if (date.getMonth() === currentMonth && day?.dataset.vcDateMonth === "current") return false;
			direction = Math.sign(step);
		}
		this._focusNavigationDate(date, direction, target);
		return true;
	}
	_focusNavigationDate(date, direction, target) {
		const calendar = this._calendar;
		const { displayDateMin, displayDateMax } = calendar.context;
		let iso = this._toIsoDate(date);
		if (iso < displayDateMin) iso = displayDateMin;
		else if (iso > displayDateMax) iso = displayDateMax;
		date = this._parseIsoDate(iso) || date;
		const month = date.getMonth();
		if (!this._findCalendarDay(iso) && (month !== calendar.context.selectedMonth || date.getFullYear() !== calendar.context.selectedYear)) calendar.set({
			selectedMonth: month,
			selectedYear: date.getFullYear(),
			selectedDates: [...calendar.context.selectedDates]
		});
		let control = this._findCalendarDay(iso);
		while (!control && date.getMonth() === month) {
			date.setDate(date.getDate() + direction);
			if (date.getMonth() === month) control = this._findCalendarDay(this._toIsoDate(date));
		}
		if (control) this._focusDay(control);
		else if (!target.isConnected) this._focusCalendarDate();
	}
	_buildCalendarOptions() {
		const theme = this._getEffectiveTheme();
		const vcpTheme = !theme || theme === "auto" ? "system" : theme;
		const displayMonthsCount = this._getDisplayMonths();
		const calendarOptions = {
			...this._config.vcpOptions,
			extensions: [gt],
			inputMode: false,
			positionToInput: this._config.placement,
			firstWeekday: this._config.firstWeekday,
			locale: this._config.vcpOptions.locale ?? this._config.locale,
			selectionDatesMode: this._config.selectionMode,
			selectedDates: this._config.selectedDates,
			displayMonthsCount,
			type: displayMonthsCount > 1 ? "multiple" : "default",
			selectedTheme: vcpTheme,
			themeAttrDetect: "[data-bs-theme]",
			onClickDate: (self, event) => this._handleDateClick(self, event),
			onInit: (self) => this._syncPopupState(self),
			onUpdate: (self) => this._syncPopupState(self)
		};
		if (this._config.selectedDates.length > 0) {
			const firstDate = this._parseIsoDate(this._config.selectedDates[0]);
			if (!firstDate) throw new TypeError("Invalid ISO date");
			calendarOptions.selectedMonth = firstDate.getMonth();
			calendarOptions.selectedYear = firstDate.getFullYear();
		}
		if (this._config.dateMin) calendarOptions.dateMin = this._config.dateMin;
		if (this._config.dateMax) calendarOptions.dateMax = this._config.dateMax;
		return calendarOptions;
	}
	_normalizeRangeDates(self) {
		if (this._config.selectionMode === "multiple-ranged" && self.context.selectedDates.length && !self.context.selectedDates[0]) self.context.selectedDates.length = 0;
	}
	_cancelPendingRange() {
		if (!this._pendingRange || !this._calendar) return;
		this._pendingRange = false;
		this._calendar.set({ selectedDates: this._rangeDates }, {
			month: false,
			year: false
		});
		this._syncDisplay(this._rangeDates);
	}
	_handleDateClick(self, event) {
		this._normalizeRangeDates(self);
		const selectedDates = [...self.context.selectedDates];
		if (this._config.selectionMode === "multiple-ranged") {
			if (selectedDates.length === 1) {
				this._pendingRange = true;
				this._updateRangeStatus();
				this._syncDisplay(selectedDates);
				return;
			}
			if (this._pendingRange && selectedDates.length === 0) {
				this._cancelPendingRange();
				return;
			}
			this._pendingRange = false;
			this._rangeDates = selectedDates;
			this._updateRangeStatus();
		}
		this._syncSelectedDates(selectedDates);
		EventHandler.trigger(this._element, EVENT_CHANGE, {
			dates: selectedDates,
			event
		});
		if (this._calendar && this._element) this._maybeHideAfterSelection(selectedDates);
	}
	_maybeHideAfterSelection(selectedDates) {
		if (this._isInline) return;
		if (this._config.selectionMode === "single" && selectedDates.length > 0 || this._config.selectionMode === "multiple-ranged" && selectedDates.length >= 2) {
			const root = this._popup.getRootNode();
			const wasInCalendar = this._popup?.contains(root.activeElement);
			this.hide();
			const active = root.activeElement;
			if (!this._isShown && this._calendar && wasInCalendar && (active === document.body || this._popup?.contains(active))) this._focusTrigger();
		}
	}
	_parseIsoDate(value) {
		const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
		if (!parts) return null;
		const year = Number(parts[1]);
		const month = Number(parts[2]) - 1;
		const day = Number(parts[3]);
		const date = /* @__PURE__ */ new Date(0);
		date.setHours(0, 0, 0, 0);
		date.setFullYear(year, month, day);
		return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day ? date : null;
	}
	_parseDate(value) {
		return this._parseIsoDate(value) ?? /* @__PURE__ */ new Date(NaN);
	}
	_toIsoDate(date) {
		return `${String(date.getFullYear()).padStart(4, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
	}
	_formatDate(dateStr) {
		const date = this._parseDate(dateStr);
		const locale = this._config.locale === "default" ? void 0 : this._config.locale;
		const { dateFormat } = this._config;
		if (typeof dateFormat === "function") return dateFormat(date, locale);
		if (dateFormat && typeof dateFormat === "object") return new Intl.DateTimeFormat(locale, dateFormat).format(date);
		return date.toLocaleDateString(locale);
	}
	_formatDateForInput(dates) {
		if (dates.length === 0) return "";
		if (dates.length === 1) return this._formatDate(dates[0]);
		const separator = this._config.selectionMode === "multiple-ranged" ? " – " : ", ";
		return dates.map((d) => this._formatDate(d)).join(separator);
	}
	_setInputError(message) {
		if (!this._isInput) return;
		const input = this._element;
		if (!input.validity.customError || input.validationMessage === this._inputErrorMessage) input.setCustomValidity(message);
		this._inputErrorMessage = message;
		if (!message && this._inputError) {
			const descriptions = (input.getAttribute("aria-describedby") || "").split(/\s+/).filter((id) => id && id !== this._inputError.id);
			if (descriptions.length) input.setAttribute("aria-describedby", descriptions.join(" "));
			else input.removeAttribute("aria-describedby");
			if (this._originalInvalid === null) input.removeAttribute("aria-invalid");
			else input.setAttribute("aria-invalid", this._originalInvalid);
			this._inputError.remove();
			this._inputError = null;
		}
	}
	_showInputError() {
		if (!this._inputErrorMessage || this._inputError) return;
		const error = document.createElement("div");
		error.id = getUID("bs-datepicker-error-");
		error.className = "form-text fg-danger";
		error.setAttribute("role", "status");
		this._positionElement.after(error);
		error.textContent = this._inputErrorMessage;
		this._inputError = error;
		this._originalInvalid = this._element.getAttribute("aria-invalid");
		this._element.setAttribute("aria-invalid", "true");
		const describedBy = this._element.getAttribute("aria-describedby");
		this._element.setAttribute("aria-describedby", describedBy ? `${describedBy} ${error.id}` : error.id);
	}
	_parseInputValue() {
		this._pendingRange = false;
		const value = this._element.value.trim();
		let date = this._parseIsoDate(value);
		if (!date && !/^\d{4}-/.test(value) && typeof this._config.dateFormat !== "function") {
			const numbers = value.match(/\d+/g);
			const locale = this._config.locale === "default" ? void 0 : this._config.locale;
			const order = new Intl.DateTimeFormat(locale, this._config.dateFormat ?? void 0).formatToParts(new Date(2e3, 0, 1)).filter((part) => [
				"year",
				"month",
				"day"
			].includes(part.type));
			if (numbers?.length === 3 && order.length === 3) {
				const parts = Object.fromEntries(order.map((part, index) => [part.type, numbers[index]]));
				if (parts.year.length === 4) {
					const iso = `${parts.year}-${parts.month.padStart(2, "0")}-${parts.day.padStart(2, "0")}`;
					const candidate = this._parseIsoDate(iso);
					if (candidate && this._formatDate(iso) === value) date = candidate;
				}
			}
		}
		const dates = date && this._config.selectionMode !== "multiple-ranged" ? [this._toIsoDate(date)] : [];
		this._calendar?.set({
			selectedDates: dates,
			...date ? {
				selectedMonth: date.getMonth(),
				selectedYear: date.getFullYear()
			} : {}
		});
		if (dates.length && this._calendar) {
			const button = this._popup?.querySelector(`[data-vc-date="${dates[0]}"] [data-vc-date-btn]`);
			if (!button || isDisabled(button)) this._calendar.set({ selectedDates: [] });
		}
		this._rangeDates = [...this._calendar?.context.selectedDates || []];
		this._setInputError(this._element.value && this.getSelectedDates().length === 0 ? this._config.invalidDateMessage : "");
		this._syncBoundInput();
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function(event) {
	if (this.tagName === "INPUT" || this.dataset.bsInline === "true") return;
	event.preventDefault();
	Datepicker.getOrCreateInstance(this).toggle(this);
});
EventHandler.on(document, EVENT_FOCUSIN_DATA_API, SELECTOR_DATA_TOGGLE$3, function() {
	if (this.tagName !== "INPUT") return;
	Datepicker.getOrCreateInstance(this).show(this);
});
onDocumentReady(`DOMContentLoaded${EVENT_KEY$4}${DATA_API_KEY$2}`, () => {
	const selector = [
		`${SELECTOR_DATA_TOGGLE$3}[data-bs-inline="true"]`,
		`${SELECTOR_DATA_TOGGLE$3}[data-bs-selected-dates]`,
		`input${SELECTOR_DATA_TOGGLE$3}[value]:not([value=""])`,
		`input${SELECTOR_DATA_TOGGLE$3}[data-bs-toggle-element]`
	].join(", ");
	for (const element of document.querySelectorAll(selector)) Datepicker.getOrCreateInstance(element);
});
// node_modules/bootstrap/js/dist/util/scroll-lock.js
/*!
* Bootstrap scroll-lock.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
/**
* --------------------------------------------------------------------------
* Bootstrap util/scroll-lock.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
var CLASS_NAME_OPEN = "dialog-open";
var SELECTOR_FIXED_CONTENT = ".fixed-top, .fixed-bottom, .is-fixed";
var owners = /* @__PURE__ */ new Map();
var restore = null;
var observer = null;
var getStyleChange = (element, property, offset) => {
	const value = Number.parseFloat(getComputedStyle(element).getPropertyValue(property)) || 0;
	return {
		element,
		property,
		value: element.style.getPropertyValue(property),
		priority: element.style.getPropertyPriority(property),
		adjustedValue: `${value + offset}px`
	};
};
var releaseUnusedLock = () => {
	for (const [owner, onDetach] of owners) if (!owner.isConnected) {
		owners.delete(owner);
		if (onDetach) queueMicrotask(onDetach);
	} else if (!owner.open) owners.delete(owner);
	if (owners.size === 0 && restore) {
		observer?.disconnect();
		observer = null;
		restore();
		restore = null;
	}
};
var lockScroll = (owner, onDetach) => {
	releaseUnusedLock();
	if (owners.has(owner)) return;
	owners.set(owner, onDetach);
	if (owners.size > 1) return;
	const root = document.documentElement;
	const alreadyLocked = root.classList.contains(CLASS_NAME_OPEN);
	const initialWidth = root.offsetWidth;
	const viewportWidth = root.clientWidth;
	const initialLeft = root.getBoundingClientRect().left + root.clientLeft + window.scrollX;
	const changes = [];
	const fixed = SelectorEngine.find(SELECTOR_FIXED_CONTENT).filter((element) => !element.closest("dialog") && getComputedStyle(element).position === "fixed" && element.clientWidth >= viewportWidth).map((element) => ({
		element,
		width: element.offsetWidth
	}));
	root.classList.add(CLASS_NAME_OPEN);
	const width = Math.max(0, root.offsetWidth - initialWidth);
	const side = initialLeft > root.getBoundingClientRect().left + root.clientLeft + window.scrollX ? "left" : "right";
	const fixedChanges = fixed.map((item) => ({
		element: item.element,
		width: Math.max(0, item.element.offsetWidth - item.width)
	}));
	if (width > 0) changes.push(getStyleChange(root, `padding-${side}`, width));
	for (const item of fixedChanges) if (item.width > 0) changes.push(getStyleChange(item.element, `margin-${side}`, item.width));
	for (const { element, property, adjustedValue } of changes) element.style.setProperty(property, adjustedValue, "important");
	restore = () => {
		for (const { element, property, value, priority } of changes) if (value) element.style.setProperty(property, value, priority);
		else element.style.removeProperty(property);
		if (!alreadyLocked) root.classList.remove(CLASS_NAME_OPEN);
	};
	observer = new MutationObserver(releaseUnusedLock);
	observer.observe(root, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: ["open"]
	});
};
var unlockScroll = (owner) => {
	owners.delete(owner);
	releaseUnusedLock();
};
// node_modules/bootstrap/js/dist/dialog-base.js
/*!
* Bootstrap dialog-base.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
/**
* --------------------------------------------------------------------------
* Bootstrap dialog-base.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Class definition
*
* Shared base class for Dialog and Drawer components that use
* the native <dialog> element. Provides common behavior for:
* - Show/hide/toggle lifecycle with events
* - Opening/closing via showModal()/show()/close()
* - Escape key handling (modal and non-modal)
* - Backdrop click handling
* - Static backdrop transition ("bounce")
* - Body scroll prevention
* - Transition coordination
* - Child component cleanup (tooltips, popovers, toasts)
*/
var DialogBase = class extends BaseComponent {
	constructor(element, config) {
		super(element, config);
		this._isTransitioning = false;
		this._opening = false;
		this._active = Boolean(this._element?.open);
		this._openedAsModal = Boolean(this._element?.matches(":modal"));
		this._operation = 0;
		this._returnFocus = null;
		this._closedBy = void 0;
		this._cancelTransition = null;
		this._addDialogListeners();
	}
	static get NAME() {
		return "dialogbase";
	}
	toggle(relatedTarget) {
		return this._element?.open ? this.hide() : this.show(relatedTarget);
	}
	async show(relatedTarget) {
		if (!this._canShow(relatedTarget)) return;
		await this._show(relatedTarget);
	}
	async hide() {
		if (!this._canHide()) return;
		await this._hide();
	}
	_canShow(relatedTarget) {
		if (this._active && this._element?.isConnected && !this._element.open) {
			unlockScroll(this._element);
			this._finishHide();
		}
		if (!this._element?.isConnected || this._element.open || this._isTransitioning) return false;
		return !EventHandler.trigger(this._element, this.constructor.eventName("show"), { relatedTarget }).defaultPrevented;
	}
	async _show(relatedTarget, returnFocus = relatedTarget) {
		if (!this._element?.isConnected || this._element.open || this._isTransitioning) return;
		const operation = ++this._operation;
		this._isTransitioning = true;
		this._opening = true;
		this._active = true;
		const previousFocus = this._element.ownerDocument.activeElement;
		this._returnFocus = returnFocus === void 0 && previousFocus instanceof HTMLElement ? previousFocus : returnFocus ?? null;
		this._onBeforeShow();
		const { modal, preventBodyScroll } = this._getShowOptions();
		this._showElement({
			modal,
			preventBodyScroll
		});
		if (!this._element || this._operation !== operation) return;
		if (!this._element.open) {
			this._clearOpenState();
			this._active = false;
			this._returnFocus = null;
			this._isTransitioning = false;
			this._opening = false;
			return;
		}
		await this._queueLifecycle(() => {
			if (this._operation !== operation || !this._element.open || !this._element.isConnected) return;
			this._isTransitioning = false;
			this._opening = false;
			EventHandler.trigger(this._element, this.constructor.eventName("shown"), { relatedTarget });
		}, this._isAnimated());
	}
	_canHide() {
		if (!this._element?.open || this._isTransitioning && !this._opening) return false;
		return !EventHandler.trigger(this._element, this.constructor.eventName("hide")).defaultPrevented;
	}
	async _hide(restoreFocus = true) {
		if (!this._element?.open || this._isTransitioning && !this._opening) return;
		const operation = ++this._operation;
		this._cancelTransition?.();
		this._isTransitioning = true;
		this._opening = false;
		if (!restoreFocus) this._returnFocus = null;
		this._hideElement();
		await this._queueLifecycle(() => {
			if (this._operation === operation) {
				this._closeAndCleanup();
				if (this._element && !this._element.open && this._operation === operation) this._finishHide();
			}
		}, this._shouldDeferClose());
	}
	dispose() {
		if (!this._element) return;
		this._cancelTransition?.();
		if (this._element.open) {
			this._hideChildComponents();
			this._closeAndCleanup();
		}
		if (!this._element) return;
		unlockScroll(this._element);
		this._clearOpenState();
		EventHandler.off(this._element, "cancel", this._cancelHandler);
		EventHandler.off(this._element, "close", this._closeHandler);
		EventHandler.off(this._element, "toggle", this._toggleHandler);
		super.dispose();
	}
	_getShowOptions() {
		return {
			modal: true,
			preventBodyScroll: true
		};
	}
	_onBeforeShow() {}
	_onAfterHide() {}
	_isAnimated() {
		return !this._element.classList.contains(this._getInstantClassName());
	}
	_getInstantClassName() {
		return "dialog-instant";
	}
	_getStaticClassName() {
		return "dialog-static";
	}
	_onCancel() {}
	_showElement({ modal = true, preventBodyScroll = true } = {}) {
		this._openedAsModal = modal;
		this._closedBy = this._element.getAttribute("closedby");
		this._element.setAttribute("closedby", modal && this._config.keyboard ? "closerequest" : "none");
		this._element.classList.toggle("dialog-no-backdrop", !this._config.backdrop);
		if (modal) this._element.showModal();
		else this._element.show();
		if (preventBodyScroll && this._element?.open) {
			const element = this._element;
			lockScroll(element, () => {
				if (this._element === element && this._active && !element.isConnected) {
					this._hideChildComponents();
					this._closeAndCleanup();
					this._finishHide();
				}
			});
		}
	}
	_hideElement() {
		this._hideChildComponents();
		this._element.classList.add("hiding");
	}
	_closeAndCleanup() {
		const element = this._element;
		element.close();
		unlockScroll(element);
	}
	_clearOpenState() {
		this._openedAsModal = false;
		this._element.classList.remove("hiding", "dialog-no-backdrop", this._getStaticClassName());
		if (this._closedBy === null) this._element.removeAttribute("closedby");
		else if (this._closedBy !== void 0) this._element.setAttribute("closedby", this._closedBy);
		this._closedBy = void 0;
		this._onAfterHide();
	}
	_finishHide() {
		const element = this._element;
		const trigger = this._returnFocus;
		const { activeElement, body } = element.ownerDocument;
		const restoreFocus = activeElement === body || element.contains(activeElement);
		this._cancelTransition?.();
		this._clearOpenState();
		this._active = false;
		this._returnFocus = null;
		this._isTransitioning = false;
		this._opening = false;
		this._operation++;
		if (trigger && restoreFocus && isVisible(trigger)) trigger.focus({ preventScroll: true });
		EventHandler.trigger(element, this.constructor.eventName("hidden"));
	}
	_queueLifecycle(callback, animated) {
		if (!animated) {
			callback();
			return Promise.resolve();
		}
		return new Promise((resolve) => {
			const cancel = executeAfterTransition(() => {
				this._cancelTransition = null;
				callback();
				resolve();
			}, this._element);
			this._cancelTransition = () => {
				cancel?.();
				this._cancelTransition = null;
				resolve();
			};
		});
	}
	_shouldDeferClose() {
		return false;
	}
	_triggerBackdropTransition() {
		if (EventHandler.trigger(this._element, this.constructor.eventName("hidePrevented")).defaultPrevented) return;
		const staticClass = this._getStaticClassName();
		this._element.classList.add(staticClass);
		this._queueCallback(() => {
			this._element.classList.remove(staticClass);
		}, this._element);
	}
	_hideChildComponents() {
		for (const el of SelectorEngine.find("[data-bs-toggle=\"tooltip\"], [data-bs-toggle=\"popover\"], [data-bs-toggle=\"datepicker\"]", this._element)) {
			const instance = data_default.get(el, `bs.${el.getAttribute("data-bs-toggle")}`);
			if (instance && typeof instance.hide === "function") instance.hide();
		}
		for (const el of SelectorEngine.find(".toast.show", this._element)) {
			const instance = data_default.get(el, "bs.toast");
			if (instance && typeof instance.hide === "function") instance.hide();
		}
	}
	_addDialogListeners() {
		if (!this._element) return;
		const eventKey = this.constructor.EVENT_KEY;
		this._closeHandler = () => {
			if (!this._element.open) {
				unlockScroll(this._element);
				if (this._active) {
					this._hideChildComponents();
					this._finishHide();
				}
			}
		};
		EventHandler.on(this._element, "close", this._closeHandler);
		this._toggleHandler = () => {
			if (this._element.open && !this._active) {
				this._active = true;
				this._openedAsModal = this._element.matches(":modal");
			}
		};
		EventHandler.on(this._element, "toggle", this._toggleHandler);
		this._cancelHandler = (event) => {
			if (event.target !== this._element) return;
			event.preventDefault();
			if (!this._config.keyboard) {
				this._triggerBackdropTransition();
				return;
			}
			this._onCancel();
			this.hide();
		};
		EventHandler.on(this._element, "cancel", this._cancelHandler);
		EventHandler.on(this._element, `keydown${eventKey}`, (event) => {
			if (event.key !== "Escape" || event.defaultPrevented || !this._element.open || event.target.closest("dialog") !== this._element) return;
			if (this._openedAsModal && this._config.keyboard) return;
			event.preventDefault();
			if (!this._config.keyboard) {
				if (this._openedAsModal) this._triggerBackdropTransition();
				return;
			}
			this._onCancel();
			this.hide();
		});
		const isOutside = (event) => {
			const { left, right, top, bottom } = this._element.getBoundingClientRect();
			return event.clientX < left || event.clientX >= right || event.clientY < top || event.clientY >= bottom;
		};
		let backdropPress = false;
		EventHandler.on(this._element, `pointerdown${eventKey}`, (event) => {
			backdropPress = event.button === 0 && event.target === this._element && isOutside(event);
		});
		EventHandler.on(this._element, `pointercancel${eventKey}`, () => {
			backdropPress = false;
		});
		EventHandler.on(this._element, `click${eventKey}`, (event) => {
			const startedOutside = backdropPress;
			backdropPress = false;
			if (!startedOutside || !event.detail || event.target !== this._element || !this._openedAsModal || !isOutside(event)) return;
			if (this._config.backdrop === false) return;
			if (this._config.backdrop === "static") {
				this._triggerBackdropTransition();
				return;
			}
			this.hide();
		});
	}
};
// node_modules/bootstrap/js/dist/dialog.js
/*!
* Bootstrap dialog.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
/**
* --------------------------------------------------------------------------
* Bootstrap dialog.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
var NAME$3 = "dialog";
var EVENT_KEY$3 = `.bs.dialog`;
var DATA_API_KEY$1 = ".data-api";
var EVENT_CANCEL = `cancel${EVENT_KEY$3}`;
var EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$3}${DATA_API_KEY$1}`;
var CLASS_NAME_NONMODAL = "dialog-nonmodal";
var CLASS_NAME_INSTANT = "dialog-instant";
var CLASS_NAME_SWAP_IN = "dialog-swap-in";
var SELECTOR_DATA_TOGGLE$2 = "[data-bs-toggle=\"dialog\"]";
var Default$2 = {
	backdrop: true,
	keyboard: true,
	modal: true
};
var DefaultType$2 = {
	backdrop: "(boolean|string)",
	keyboard: "boolean",
	modal: "boolean"
};
/**
* Class definition
*/
var Dialog = class Dialog extends DialogBase {
	constructor(element, config) {
		super(element, config);
	}
	static get Default() {
		return Default$2;
	}
	static get DefaultType() {
		return DefaultType$2;
	}
	static get NAME() {
		return NAME$3;
	}
	static {
		EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function(event) {
			Dialog._handleDataApiClick(this, event);
		});
	}
	static _handleDataApiClick(trigger, event) {
		const target = SelectorEngine.getElementFromSelector(trigger);
		if (!(target instanceof HTMLDialogElement) || isDisabled(trigger)) return;
		if (["A", "AREA"].includes(trigger.tagName)) event.preventDefault();
		const config = Manipulator.getDataAttributes(trigger);
		const currentDialog = trigger.closest("dialog.dialog[open]");
		if (currentDialog === target) return;
		if (!(currentDialog && currentDialog !== target)) {
			Dialog.getOrCreateInstance(target, config).toggle(trigger);
			return;
		}
		if (currentDialog.classList.contains(CLASS_NAME_SWAP_IN)) return;
		const newDialog = Dialog.getOrCreateInstance(target, config);
		const currentInstance = Dialog.getOrCreateInstance(currentDialog);
		if (!newDialog._canShow(trigger) || !currentInstance._canHide()) return;
		const returnFocus = currentInstance._returnFocus;
		const wasInstant = currentDialog.classList.contains(CLASS_NAME_INSTANT);
		target.classList.add(CLASS_NAME_SWAP_IN);
		newDialog._show(trigger, returnFocus).finally(() => {
			target.classList.remove(CLASS_NAME_SWAP_IN);
		});
		if (target.open) {
			currentDialog.classList.add(CLASS_NAME_INSTANT);
			currentInstance._hide(false).finally(() => {
				if (!wasInstant) currentDialog.classList.remove(CLASS_NAME_INSTANT);
			});
		}
	}
	handleUpdate() {}
	_getShowOptions() {
		return {
			modal: this._config.modal,
			preventBodyScroll: this._config.modal
		};
	}
	_onBeforeShow() {
		if (!this._config.modal) this._element.classList.add(CLASS_NAME_NONMODAL);
	}
	_onAfterHide() {
		this._element.classList.remove(CLASS_NAME_NONMODAL);
	}
	_shouldDeferClose() {
		return this._isAnimated();
	}
	_onCancel() {
		EventHandler.trigger(this._element, EVENT_CANCEL);
	}
};
/**
* Data API implementation
*/
enableDismissTrigger(Dialog);
// node_modules/bootstrap/js/dist/util/swipe.js
/*!
* Bootstrap swipe.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
/**
* --------------------------------------------------------------------------
* Bootstrap util/swipe.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
var NAME$2 = "swipe";
var EVENT_KEY$2 = ".bs.swipe";
var EVENT_TOUCHSTART = `touchstart${EVENT_KEY$2}`;
var EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$2}`;
var EVENT_TOUCHEND = `touchend${EVENT_KEY$2}`;
var EVENT_TOUCHCANCEL = `touchcancel${EVENT_KEY$2}`;
var EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$2}`;
var EVENT_POINTERUP = `pointerup${EVENT_KEY$2}`;
var EVENT_POINTERCANCEL = `pointercancel${EVENT_KEY$2}`;
var POINTER_TYPE_TOUCH = "touch";
var POINTER_TYPE_PEN = "pen";
var CLASS_NAME_POINTER_EVENT = "pointer-event";
var SWIPE_THRESHOLD = 40;
var Default$1 = {
	endCallback: null,
	leftCallback: null,
	rightCallback: null,
	upCallback: null,
	downCallback: null
};
var DefaultType$1 = {
	endCallback: "(function|null)",
	leftCallback: "(function|null)",
	rightCallback: "(function|null)",
	upCallback: "(function|null)",
	downCallback: "(function|null)"
};
/**
* Class definition
*/
var Swipe = class Swipe extends Config {
	constructor(element, config) {
		super();
		this._element = element;
		if (!element || !Swipe.isSupported()) return;
		this._config = this._getConfig(config);
		this._deltaX = 0;
		this._deltaY = 0;
		this._pointerId = null;
		this._touchStart = null;
		this._supportPointerEvents = Boolean(window.PointerEvent);
		this._initEvents();
	}
	static get Default() {
		return Default$1;
	}
	static get DefaultType() {
		return DefaultType$1;
	}
	static get NAME() {
		return NAME$2;
	}
	dispose() {
		EventHandler.off(this._element, EVENT_KEY$2);
		this._element?.classList.remove(CLASS_NAME_POINTER_EVENT);
	}
	_start(event) {
		if (!this._supportPointerEvents) {
			this._touchStart = event.touches.length === 1 ? event.touches[0] : null;
			this._deltaX = 0;
			this._deltaY = 0;
			return;
		}
		if (this._eventIsPointerPenTouch(event)) {
			this._pointerId = event.pointerId;
			this._deltaX = event.clientX;
			this._deltaY = event.clientY;
		}
	}
	_end(event) {
		if (this._supportPointerEvents) {
			if (!this._eventIsPointerPenTouch(event) || this._pointerId !== event.pointerId) return;
			this._pointerId = null;
			this._deltaX = event.clientX - this._deltaX;
			this._deltaY = event.clientY - this._deltaY;
		} else if (!this._touchStart) return;
		this._touchStart = null;
		this._handleSwipe();
		execute(this._config.endCallback);
	}
	_move(event) {
		if (event.touches.length !== 1) this._touchStart = null;
		if (!this._touchStart) return;
		this._deltaX = event.touches[0].clientX - this._touchStart.clientX;
		this._deltaY = event.touches[0].clientY - this._touchStart.clientY;
	}
	_handleSwipe() {
		const absDeltaX = Math.abs(this._deltaX);
		const absDeltaY = Math.abs(this._deltaY);
		if (absDeltaY > absDeltaX && absDeltaY > SWIPE_THRESHOLD) {
			const direction = this._deltaY > 0 ? "down" : "up";
			this._deltaX = 0;
			this._deltaY = 0;
			execute(direction === "down" ? this._config.downCallback : this._config.upCallback);
			return;
		}
		if (absDeltaX > SWIPE_THRESHOLD) {
			const direction = absDeltaX / this._deltaX;
			this._deltaX = 0;
			this._deltaY = 0;
			if (!direction) return;
			execute(direction > 0 ? this._config.rightCallback : this._config.leftCallback);
			return;
		}
		this._deltaX = 0;
		this._deltaY = 0;
	}
	_initEvents() {
		if (this._supportPointerEvents) {
			EventHandler.on(this._element, EVENT_POINTERDOWN, (event) => this._start(event));
			EventHandler.on(this._element, EVENT_POINTERUP, (event) => this._end(event));
			EventHandler.on(this._element, EVENT_POINTERCANCEL, (event) => {
				if (this._pointerId === event.pointerId) this._pointerId = null;
			});
			this._element.classList.add(CLASS_NAME_POINTER_EVENT);
		} else {
			EventHandler.on(this._element, EVENT_TOUCHSTART, (event) => this._start(event));
			EventHandler.on(this._element, EVENT_TOUCHMOVE, (event) => this._move(event));
			EventHandler.on(this._element, EVENT_TOUCHEND, (event) => this._end(event));
			EventHandler.on(this._element, EVENT_TOUCHCANCEL, () => {
				this._touchStart = null;
			});
		}
	}
	_eventIsPointerPenTouch(event) {
		return this._supportPointerEvents && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
	}
	static isSupported() {
		return "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0;
	}
};
// node_modules/bootstrap/js/dist/drawer.js
/*!
* Bootstrap drawer.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
/**
* --------------------------------------------------------------------------
* Bootstrap drawer.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
var NAME$1 = "drawer";
var EVENT_KEY$1 = `.bs.drawer`;
var DATA_API_KEY = ".data-api";
var EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$1}${DATA_API_KEY}`;
var EVENT_RESIZE = `resize${EVENT_KEY$1}`;
var EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$1}${DATA_API_KEY}`;
var SELECTOR_DATA_TOGGLE$1 = "[data-bs-toggle=\"drawer\"]";
var SELECTOR_RESPONSIVE = "dialog[class*=\"\\:drawer\"]";
var SELECTOR_OPEN = "dialog.drawer[open], dialog[open][class*=\"\\:drawer\"]";
var SELECTOR_RESIZE = `${SELECTOR_OPEN}, ${SELECTOR_RESPONSIVE}`;
var inlineAttributes = /* @__PURE__ */ new WeakMap();
var drawerIsInline = (element) => element.matches(SELECTOR_RESPONSIVE) && getComputedStyle(element).getPropertyValue("--drawer-inline").trim() === "1";
var syncInlineSemantics = (element, inline) => {
	const saved = inlineAttributes.get(element);
	if (inline && !saved) {
		const attributes = /* @__PURE__ */ new Map();
		for (const name of [
			"role",
			"aria-label",
			"aria-labelledby",
			"aria-describedby",
			"aria-modal"
		]) {
			attributes.set(name, element.getAttribute(name));
			element.removeAttribute(name);
		}
		element.setAttribute("role", "presentation");
		inlineAttributes.set(element, attributes);
	} else if (!inline && saved) {
		for (const [name, value] of saved) if (value === null) element.removeAttribute(name);
		else element.setAttribute(name, value);
		inlineAttributes.delete(element);
	}
};
var Default = {
	backdrop: true,
	keyboard: true,
	scroll: false
};
var DefaultType = {
	backdrop: "(boolean|string)",
	keyboard: "boolean",
	scroll: "boolean"
};
/**
* Class definition
*/
var Drawer = class Drawer extends DialogBase {
	constructor(element, config) {
		super(element, config);
		this._swipeHelper = null;
		this._resizeObserver = null;
		this._resizeFrame = null;
		this._initResizeObserver();
	}
	static get Default() {
		return Default;
	}
	static get DefaultType() {
		return DefaultType;
	}
	static get NAME() {
		return NAME$1;
	}
	static {
		EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function(event) {
			const target = SelectorEngine.getElementFromSelector(this);
			if (!(target instanceof HTMLDialogElement) || isDisabled(this)) return;
			if (["A", "AREA"].includes(this.tagName)) event.preventDefault();
			Drawer._toggleDrawer(target, this);
		});
	}
	static _toggleDrawer(target, trigger) {
		const drawer = Drawer.getOrCreateInstance(target, Manipulator.getDataAttributes(trigger));
		if (target.open) {
			drawer.hide();
			return;
		}
		const other = SelectorEngine.findOne(SELECTOR_OPEN);
		if (!other) {
			drawer.show(trigger);
			return;
		}
		const source = Drawer.getOrCreateInstance(other);
		if (!drawer._canShow(trigger) || !source._canHide()) return;
		const returnFocus = other.contains(trigger) ? source._returnFocus : trigger;
		drawer._show(trigger, returnFocus);
		if (target.open) source._hide(false);
	}
	dispose() {
		if (this._swipeHelper) this._swipeHelper.dispose();
		if (this._resizeObserver) this._resizeObserver.disconnect();
		if (this._resizeFrame !== null) cancelAnimationFrame(this._resizeFrame);
		super.dispose();
	}
	_getShowOptions() {
		return {
			modal: Boolean(this._config.backdrop) || !this._config.scroll,
			preventBodyScroll: !this._config.scroll
		};
	}
	_onBeforeShow() {
		this._swipeHelper?.dispose();
		this._swipeHelper = null;
		this._initSwipe();
	}
	_canShow(relatedTarget) {
		return !this._isInline() && super._canShow(relatedTarget);
	}
	async _show(relatedTarget, returnFocus = relatedTarget) {
		if (this._isInline()) return;
		await super._show(relatedTarget, returnFocus);
		if (this._element?.open && this._isInline()) await this.hide();
	}
	_onAfterHide() {
		syncInlineSemantics(this._element, this._isInline());
	}
	_isInline() {
		return Boolean(this._element && drawerIsInline(this._element));
	}
	_getInstantClassName() {
		return "drawer-instant";
	}
	_getStaticClassName() {
		return "drawer-static";
	}
	_shouldDeferClose() {
		return this._isAnimated();
	}
	_initResizeObserver() {
		const navbar = this._element?.closest(".navbar");
		if (!navbar || typeof ResizeObserver === "undefined") return;
		this._resizeObserver = new ResizeObserver(() => {
			if (this._resizeFrame !== null) cancelAnimationFrame(this._resizeFrame);
			this._resizeFrame = requestAnimationFrame(() => {
				this._resizeFrame = null;
				if (this._element.open && getComputedStyle(this._element).position !== "fixed") this.hide();
			});
		});
		this._resizeObserver.observe(navbar);
	}
	_initSwipe() {
		if (this._swipeHelper || !Swipe.isSupported()) return;
		const swipeConfig = {};
		const element = this._element;
		const rtl = element.matches(":dir(rtl)");
		if (element.classList.contains("drawer-bottom")) swipeConfig.downCallback = () => this.hide();
		else if (element.classList.contains("drawer-top")) swipeConfig.upCallback = () => this.hide();
		else if (element.classList.contains("drawer-end")) if (rtl) swipeConfig.leftCallback = () => this.hide();
		else swipeConfig.rightCallback = () => this.hide();
		else if (rtl) swipeConfig.rightCallback = () => this.hide();
		else swipeConfig.leftCallback = () => this.hide();
		this._swipeHelper = new Swipe(SelectorEngine.findOne(".drawer-header", element) || element, swipeConfig);
	}
};
/**
* Data API implementation
*/
EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => {
	for (const element of SelectorEngine.find(SELECTOR_OPEN)) Drawer.getOrCreateInstance(element);
});
onDocumentReady(`DOMContentLoaded${EVENT_KEY$1}${DATA_API_KEY}`, () => {
	for (const element of SelectorEngine.find(SELECTOR_RESPONSIVE)) syncInlineSemantics(element, !element.open && drawerIsInline(element));
});
document.addEventListener("beforetoggle", (event) => {
	if (event.target instanceof HTMLDialogElement && event.newState === "open") syncInlineSemantics(event.target, false);
}, true);
document.addEventListener("close", (event) => {
	if (event.target instanceof HTMLDialogElement && event.target.matches(SELECTOR_RESPONSIVE)) syncInlineSemantics(event.target, !event.target.open && drawerIsInline(event.target));
}, true);
EventHandler.on(window, EVENT_RESIZE, () => {
	for (const element of SelectorEngine.find(SELECTOR_RESIZE)) {
		const inline = drawerIsInline(element);
		syncInlineSemantics(element, !element.open && inline);
		if (element.open && (inline || getComputedStyle(element).position !== "fixed")) Drawer.getOrCreateInstance(element).hide();
	}
});
enableDismissTrigger(Drawer);
// node_modules/bootstrap/js/dist/tab.js
/*!
* Bootstrap tab.js v6.0.0-alpha.2 (https://getbootstrap.com/)
* Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
*/
/**
* --------------------------------------------------------------------------
* Bootstrap tab.ts
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
* --------------------------------------------------------------------------
*/
/**
* Constants
*/
var NAME = "tab";
var EVENT_KEY = `.bs.tab`;
var EVENT_HIDE = `hide${EVENT_KEY}`;
var EVENT_HIDDEN = `hidden${EVENT_KEY}`;
var EVENT_SHOW = `show${EVENT_KEY}`;
var EVENT_SHOWN = `shown${EVENT_KEY}`;
var EVENT_CLICK_DATA_API = `click${EVENT_KEY}`;
var EVENT_KEYDOWN = `keydown${EVENT_KEY}`;
var EVENT_LOAD_DATA_API = `load${EVENT_KEY}`;
var ARROW_LEFT_KEY = "ArrowLeft";
var ARROW_RIGHT_KEY = "ArrowRight";
var ARROW_UP_KEY = "ArrowUp";
var ARROW_DOWN_KEY = "ArrowDown";
var HOME_KEY = "Home";
var END_KEY = "End";
var CLASS_NAME_ACTIVE = "active";
var CLASS_NAME_SHOW = "show";
var SELECTOR_MENU_TOGGLE = "[data-bs-toggle=\"menu\"]";
var SELECTOR_MENU = ".menu";
var NOT_SELECTOR_MENU_TOGGLE = `:not(${SELECTOR_MENU_TOGGLE})`;
var SELECTOR_TAB_PANEL = ".list-group, .nav, [role=\"tablist\"]";
var SELECTOR_OUTER = ".nav-item, .list-group-item";
var SELECTOR_INNER = `.nav-link${NOT_SELECTOR_MENU_TOGGLE}, .list-group-item${NOT_SELECTOR_MENU_TOGGLE}, [role="tab"]${NOT_SELECTOR_MENU_TOGGLE}`;
var SELECTOR_DATA_TOGGLE = "[data-bs-toggle=\"tab\"]";
var SELECTOR_INNER_ELEM = `${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE}`;
var SELECTOR_DATA_TOGGLE_ACTIVE = `.${CLASS_NAME_ACTIVE}[data-bs-toggle="tab"]`;
var activationIds = /* @__PURE__ */ new WeakMap();
/**
* Class definition
*/
var Tab = class Tab extends BaseComponent {
	constructor(element) {
		super(element);
		this._parent = this._element.closest(SELECTOR_TAB_PANEL);
		if (!this._parent) throw new TypeError(`${this._element.outerHTML} has no valid parent ${SELECTOR_TAB_PANEL}`);
		this._setInitialAttributes(this._parent, this._getChildren());
		EventHandler.on(this._element, EVENT_KEYDOWN, (event) => this._keydown(event));
	}
	static get NAME() {
		return NAME;
	}
	async show() {
		const innerElem = this._element;
		if (this._elemIsActive(innerElem)) return;
		const active = this._getActiveElem();
		const hideEvent = active ? EventHandler.trigger(active, EVENT_HIDE, { relatedTarget: innerElem }) : null;
		if (EventHandler.trigger(innerElem, EVENT_SHOW, { relatedTarget: active }).defaultPrevented || hideEvent && hideEvent.defaultPrevented) return;
		const activationId = (activationIds.get(this._parent) || 0) + 1;
		activationIds.set(this._parent, activationId);
		this._deactivate(active, innerElem);
		await this._activate(innerElem, active, activationId);
	}
	async _activate(element, relatedElem, activationId) {
		if (!element) return;
		element.classList.add(CLASS_NAME_ACTIVE);
		if (element.getAttribute("role") !== "tab") {
			element.classList.add(CLASS_NAME_SHOW);
			return;
		}
		const pane = SelectorEngine.getElementFromSelector(element);
		this._activate(pane);
		const complete = () => {
			if (activationId !== activationIds.get(this._parent) || !this._elemIsActive(element)) return;
			element.removeAttribute("tabindex");
			setAriaAttribute(element, "aria-selected", true);
			this._toggleMenu(element, true);
			EventHandler.trigger(element, EVENT_SHOWN, { relatedTarget: relatedElem });
		};
		await this._queueCallback(complete, pane ?? element, getTransitionDurationFromElement(pane) > 0);
	}
	async _deactivate(element, relatedElem) {
		if (!element) return;
		element.classList.remove(CLASS_NAME_ACTIVE);
		element.blur();
		if (element.getAttribute("role") !== "tab") {
			element.classList.remove(CLASS_NAME_SHOW);
			return;
		}
		this._deactivate(SelectorEngine.getElementFromSelector(element));
		const complete = () => {
			setAriaAttribute(element, "aria-selected", false);
			element.setAttribute("tabindex", "-1");
			this._toggleMenu(element, false);
			EventHandler.trigger(element, EVENT_HIDDEN, { relatedTarget: relatedElem });
		};
		await this._queueCallback(complete, element, false);
	}
	_keydown(event) {
		if (![
			ARROW_LEFT_KEY,
			ARROW_RIGHT_KEY,
			ARROW_UP_KEY,
			ARROW_DOWN_KEY,
			HOME_KEY,
			END_KEY
		].includes(event.key)) return;
		if (event.altKey || event.ctrlKey || event.metaKey) return;
		event.stopPropagation();
		event.preventDefault();
		const children = this._getChildren().filter((element) => !isDisabled(element));
		let nextActiveElement;
		if ([HOME_KEY, END_KEY].includes(event.key)) nextActiveElement = event.key === HOME_KEY ? children[0] : children.at(-1);
		else {
			const isNext = [ARROW_RIGHT_KEY, ARROW_DOWN_KEY].includes(event.key);
			nextActiveElement = getNextActiveElement(children, event.target, isNext, true);
		}
		if (nextActiveElement) {
			nextActiveElement.focus({ preventScroll: true });
			Tab.getOrCreateInstance(nextActiveElement).show();
		}
	}
	_getChildren() {
		return SelectorEngine.find(SELECTOR_INNER_ELEM, this._parent);
	}
	_getActiveElem() {
		return this._getChildren().find((child) => this._elemIsActive(child)) || null;
	}
	_setInitialAttributes(parent, children) {
		this._setAttributeIfNotExists(parent, "role", "tablist");
		for (const child of children) this._setInitialAttributesOnChild(child);
	}
	_setInitialAttributesOnChild(child) {
		child = this._getInnerElement(child);
		const isActive = this._elemIsActive(child);
		const outerElem = this._getOuterElement(child);
		setAriaAttribute(child, "aria-selected", isActive);
		if (outerElem !== child) this._setAttributeIfNotExists(outerElem, "role", "presentation");
		if (!isActive) child.setAttribute("tabindex", "-1");
		this._setAttributeIfNotExists(child, "role", "tab");
		this._setInitialAttributesOnTargetPanel(child);
	}
	_setInitialAttributesOnTargetPanel(child) {
		const target = SelectorEngine.getElementFromSelector(child);
		if (!target) return;
		this._setAttributeIfNotExists(target, "role", "tabpanel");
		if (child.id) this._setAttributeIfNotExists(target, "aria-labelledby", `${child.id}`);
	}
	_toggleMenu(element, open) {
		const outerElem = this._getOuterElement(element);
		const menuToggle = SelectorEngine.findOne(SELECTOR_MENU_TOGGLE, outerElem);
		if (!menuToggle) return;
		const menu = SelectorEngine.findOne(SELECTOR_MENU, outerElem);
		menuToggle.classList.toggle(CLASS_NAME_ACTIVE, open);
		if (menu) menu.classList.toggle(CLASS_NAME_SHOW, open);
		setAriaAttribute(menuToggle, "aria-expanded", open);
	}
	_setAttributeIfNotExists(element, attribute, value) {
		if (!element.hasAttribute(attribute)) element.setAttribute(attribute, value);
	}
	_elemIsActive(elem) {
		return elem.classList.contains(CLASS_NAME_ACTIVE);
	}
	_getInnerElement(elem) {
		return elem.matches(SELECTOR_INNER_ELEM) ? elem : SelectorEngine.findOne(SELECTOR_INNER_ELEM, elem);
	}
	_getOuterElement(elem) {
		return elem.closest(SELECTOR_OUTER) || elem;
	}
};
/**
* Data API implementation
*/
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(event) {
	if (["A", "AREA"].includes(this.tagName)) event.preventDefault();
	if (isDisabled(this)) return;
	Tab.getOrCreateInstance(this).show();
});
/**
* Initialize on focus
*/
EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
	for (const element of SelectorEngine.find(SELECTOR_DATA_TOGGLE_ACTIVE)) Tab.getOrCreateInstance(element);
});
/**
* Find the tab trigger that targets a pane.
*/
var getTabTriggerFromPane = (pane) => {
	const labelledBy = pane.getAttribute("aria-labelledby");
	if (labelledBy) {
		const byLabel = document.getElementById(labelledBy);
		if (byLabel?.matches(SELECTOR_DATA_TOGGLE)) return byLabel;
	}
	const { id } = pane;
	if (!id) return null;
	const escapedId = CSS.escape(id);
	return SelectorEngine.findOne(`${SELECTOR_DATA_TOGGLE}[data-bs-target="#${escapedId}"], ${SELECTOR_DATA_TOGGLE}[href="#${escapedId}"]`);
};
/**
* Open opted-in tab panes when the URL fragment matches their id.
* Put `data-bs-hash` on the tab pane.
*/
enableHashTarget(`${EVENT_KEY}.data-api`, {
	matches: (element) => Boolean(getTabTriggerFromPane(element)),
	getAnchor: getTabTriggerFromPane,
	async open(element, done) {
		const trigger = getTabTriggerFromPane(element);
		if (!trigger) return;
		if (trigger.classList.contains(CLASS_NAME_ACTIVE)) {
			done();
			return;
		}
		await Tab.getOrCreateInstance(trigger).show();
		if (trigger.classList.contains(CLASS_NAME_ACTIVE)) done();
	}
});
export { Combobox as a, Carousel as c, EventHandler as d, Datepicker as i, Button as l, Drawer as n, Menu as o, Dialog as r, Collapse as s, Tab as t, BaseComponent as u };

//# sourceMappingURL=vendor-bootstrap-BzDtiPY7.js.map
import { i as __toCommonJS, n as __esmMin, r as __exportAll, t as __commonJSMin } from "./rolldown-runtime-CL6CfywC.js";
//#region node_modules/bootstrap/js/dist/dom/data.js
var require_data = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap data.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Data = factory());
	})(exports, (function() {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap dom/data.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		/**
		* Constants
		*/
		const elementMap = /* @__PURE__ */ new Map();
		return {
			set(element, key, instance) {
				if (!elementMap.has(element)) elementMap.set(element, /* @__PURE__ */ new Map());
				const instanceMap = elementMap.get(element);
				if (!instanceMap.has(key) && instanceMap.size !== 0) {
					console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
					return;
				}
				instanceMap.set(key, instance);
			},
			get(element, key) {
				if (elementMap.has(element)) return elementMap.get(element).get(key) || null;
				return null;
			},
			remove(element, key) {
				if (!elementMap.has(element)) return;
				const instanceMap = elementMap.get(element);
				instanceMap.delete(key);
				if (instanceMap.size === 0) elementMap.delete(element);
			}
		};
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/util/index.js
var require_util = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap index.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.Index = {}));
	})(exports, (function(exports$2) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap util/index.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		const MAX_UID = 1e6;
		const MILLISECONDS_MULTIPLIER = 1e3;
		const TRANSITION_END = "transitionend";
		/**
		* Properly escape IDs selectors to handle weird IDs
		* @param {string} selector
		* @returns {string}
		*/
		const parseSelector = (selector) => {
			if (selector && window.CSS && window.CSS.escape) selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`);
			return selector;
		};
		const toType = (object) => {
			if (object === null || object === void 0) return `${object}`;
			return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
		};
		/**
		* Public Util API
		*/
		const getUID = (prefix) => {
			do
				prefix += Math.floor(Math.random() * MAX_UID);
			while (document.getElementById(prefix));
			return prefix;
		};
		const getTransitionDurationFromElement = (element) => {
			if (!element) return 0;
			let { transitionDuration, transitionDelay } = window.getComputedStyle(element);
			if (!Number.parseFloat(transitionDuration) && !Number.parseFloat(transitionDelay)) return 0;
			transitionDuration = transitionDuration.split(",")[0];
			transitionDelay = transitionDelay.split(",")[0];
			return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
		};
		const triggerTransitionEnd = (element) => {
			element.dispatchEvent(new Event(TRANSITION_END));
		};
		const isElement = (object) => {
			if (!object || typeof object !== "object") return false;
			if (typeof object.jquery !== "undefined") object = object[0];
			return typeof object.nodeType !== "undefined";
		};
		const getElement = (object) => {
			if (isElement(object)) return object.jquery ? object[0] : object;
			if (typeof object === "string" && object.length > 0) return document.querySelector(parseSelector(object));
			return null;
		};
		const isVisible = (element) => {
			if (!isElement(element) || element.getClientRects().length === 0) return false;
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
		const isDisabled = (element) => {
			if (!element || element.nodeType !== Node.ELEMENT_NODE) return true;
			if (element.classList.contains("disabled")) return true;
			if (typeof element.disabled !== "undefined") return element.disabled;
			return element.hasAttribute("disabled") && element.getAttribute("disabled") !== "false";
		};
		const findShadowRoot = (element) => {
			if (!document.documentElement.attachShadow) return null;
			if (typeof element.getRootNode === "function") {
				const root = element.getRootNode();
				return root instanceof ShadowRoot ? root : null;
			}
			if (element instanceof ShadowRoot) return element;
			if (!element.parentNode) return null;
			return findShadowRoot(element.parentNode);
		};
		const noop = () => {};
		/**
		* Trick to restart an element's animation
		*
		* @param {HTMLElement} element
		* @return void
		*
		* @see https://www.harrytheo.com/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
		*/
		const reflow = (element) => {
			element.offsetHeight;
		};
		const getjQuery = () => {
			if (window.jQuery && !document.body.hasAttribute("data-bs-no-jquery")) return window.jQuery;
			return null;
		};
		const DOMContentLoadedCallbacks = [];
		const onDOMContentLoaded = (callback) => {
			if (document.readyState === "loading") {
				if (!DOMContentLoadedCallbacks.length) document.addEventListener("DOMContentLoaded", () => {
					for (const callback of DOMContentLoadedCallbacks) callback();
				});
				DOMContentLoadedCallbacks.push(callback);
			} else callback();
		};
		const isRTL = () => document.documentElement.dir === "rtl";
		const defineJQueryPlugin = (plugin) => {
			onDOMContentLoaded(() => {
				const $ = getjQuery();
				/* istanbul ignore if */
				if ($) {
					const name = plugin.NAME;
					const JQUERY_NO_CONFLICT = $.fn[name];
					$.fn[name] = plugin.jQueryInterface;
					$.fn[name].Constructor = plugin;
					$.fn[name].noConflict = () => {
						$.fn[name] = JQUERY_NO_CONFLICT;
						return plugin.jQueryInterface;
					};
				}
			});
		};
		const execute = (possibleCallback, args = [], defaultValue = possibleCallback) => {
			return typeof possibleCallback === "function" ? possibleCallback.call(...args) : defaultValue;
		};
		const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
			if (!waitForTransition) {
				execute(callback);
				return;
			}
			const emulatedDuration = getTransitionDurationFromElement(transitionElement) + 5;
			let called = false;
			const handler = ({ target }) => {
				if (target !== transitionElement) return;
				called = true;
				transitionElement.removeEventListener(TRANSITION_END, handler);
				execute(callback);
			};
			transitionElement.addEventListener(TRANSITION_END, handler);
			setTimeout(() => {
				if (!called) triggerTransitionEnd(transitionElement);
			}, emulatedDuration);
		};
		/**
		* Return the previous/next element of a list.
		*
		* @param {array} list    The list of elements
		* @param activeElement   The active element
		* @param shouldGetNext   Choose to get next or previous element
		* @param isCycleAllowed
		* @return {Element|elem} The proper element
		*/
		const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
			const listLength = list.length;
			let index = list.indexOf(activeElement);
			if (index === -1) return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
			index += shouldGetNext ? 1 : -1;
			if (isCycleAllowed) index = (index + listLength) % listLength;
			return list[Math.max(0, Math.min(index, listLength - 1))];
		};
		exports$2.defineJQueryPlugin = defineJQueryPlugin;
		exports$2.execute = execute;
		exports$2.executeAfterTransition = executeAfterTransition;
		exports$2.findShadowRoot = findShadowRoot;
		exports$2.getElement = getElement;
		exports$2.getNextActiveElement = getNextActiveElement;
		exports$2.getTransitionDurationFromElement = getTransitionDurationFromElement;
		exports$2.getUID = getUID;
		exports$2.getjQuery = getjQuery;
		exports$2.isDisabled = isDisabled;
		exports$2.isElement = isElement;
		exports$2.isRTL = isRTL;
		exports$2.isVisible = isVisible;
		exports$2.noop = noop;
		exports$2.onDOMContentLoaded = onDOMContentLoaded;
		exports$2.parseSelector = parseSelector;
		exports$2.reflow = reflow;
		exports$2.toType = toType;
		exports$2.triggerTransitionEnd = triggerTransitionEnd;
		Object.defineProperty(exports$2, Symbol.toStringTag, { value: "Module" });
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/dom/event-handler.js
var require_event_handler = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap event-handler.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_util()) : typeof define === "function" && define.amd ? define(["../util/index"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.EventHandler = factory(global.Index));
	})(exports, (function(index_js) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap dom/event-handler.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		/**
		* Constants
		*/
		const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
		const stripNameRegex = /\..*/;
		const stripUidRegex = /::\d+$/;
		const eventRegistry = {};
		let uidEvent = 1;
		const customEvents = {
			mouseenter: "mouseover",
			mouseleave: "mouseout"
		};
		const nativeEvents = /* @__PURE__ */ new Set([
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
			"orientationchange",
			"touchstart",
			"touchmove",
			"touchend",
			"touchcancel",
			"pointerdown",
			"pointermove",
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
			"scroll"
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
		function bootstrapHandler(element, fn) {
			return function handler(event) {
				hydrateObj(event, { delegateTarget: element });
				if (handler.oneOff) EventHandler.off(element, event.type, fn);
				return fn.apply(element, [event]);
			};
		}
		function bootstrapDelegationHandler(element, selector, fn) {
			return function handler(event) {
				const domElements = element.querySelectorAll(selector);
				for (let { target } = event; target && target !== this; target = target.parentNode) for (const domElement of domElements) {
					if (domElement !== target) continue;
					hydrateObj(event, { delegateTarget: target });
					if (handler.oneOff) EventHandler.off(element, event.type, selector, fn);
					return fn.apply(target, [event]);
				}
			};
		}
		function findHandler(events, callable, delegationSelector = null) {
			return Object.values(events).find((event) => event.callable === callable && event.delegationSelector === delegationSelector);
		}
		function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
			const isDelegated = typeof handler === "string";
			const callable = isDelegated ? delegationFunction : handler || delegationFunction;
			let typeEvent = getTypeEvent(originalTypeEvent);
			if (!nativeEvents.has(typeEvent)) typeEvent = originalTypeEvent;
			return [
				isDelegated,
				callable,
				typeEvent
			];
		}
		function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
			if (typeof originalTypeEvent !== "string" || !element) return;
			let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
			if (originalTypeEvent in customEvents) {
				const wrapFunction = (fn) => {
					return function(event) {
						if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) return fn.call(this, event);
					};
				};
				callable = wrapFunction(callable);
			}
			const events = getElementEvents(element);
			const handlers = events[typeEvent] || (events[typeEvent] = {});
			const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);
			if (previousFunction) {
				previousFunction.oneOff = previousFunction.oneOff && oneOff;
				return;
			}
			const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ""));
			const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable);
			fn.delegationSelector = isDelegated ? handler : null;
			fn.callable = callable;
			fn.oneOff = oneOff;
			fn.uidEvent = uid;
			handlers[uid] = fn;
			element.addEventListener(typeEvent, fn, isDelegated);
		}
		function removeHandler(element, events, typeEvent, handler, delegationSelector) {
			const fn = findHandler(events[typeEvent], handler, delegationSelector);
			if (!fn) return;
			element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
			delete events[typeEvent][fn.uidEvent];
		}
		function removeNamespacedHandlers(element, events, typeEvent, namespace) {
			const storeElementEvent = events[typeEvent] || {};
			for (const [handlerKey, event] of Object.entries(storeElementEvent)) if (handlerKey.includes(namespace)) removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
		}
		function getTypeEvent(event) {
			event = event.replace(stripNameRegex, "");
			return customEvents[event] || event;
		}
		const EventHandler = {
			on(element, event, handler, delegationFunction) {
				addHandler(element, event, handler, delegationFunction, false);
			},
			one(element, event, handler, delegationFunction) {
				addHandler(element, event, handler, delegationFunction, true);
			},
			off(element, originalTypeEvent, handler, delegationFunction) {
				if (typeof originalTypeEvent !== "string" || !element) return;
				const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
				const inNamespace = typeEvent !== originalTypeEvent;
				const events = getElementEvents(element);
				const storeElementEvent = events[typeEvent] || {};
				const isNamespace = originalTypeEvent.startsWith(".");
				if (typeof callable !== "undefined") {
					if (!Object.keys(storeElementEvent).length) return;
					removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
					return;
				}
				if (isNamespace) for (const elementEvent of Object.keys(events)) removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
				for (const [keyHandlers, event] of Object.entries(storeElementEvent)) {
					const handlerKey = keyHandlers.replace(stripUidRegex, "");
					if (!inNamespace || originalTypeEvent.includes(handlerKey)) removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
				}
			},
			trigger(element, event, args) {
				if (typeof event !== "string" || !element) return null;
				const $ = index_js.getjQuery();
				const inNamespace = event !== getTypeEvent(event);
				let jQueryEvent = null;
				let bubbles = true;
				let nativeDispatch = true;
				let defaultPrevented = false;
				if (inNamespace && $) {
					jQueryEvent = $.Event(event, args);
					$(element).trigger(jQueryEvent);
					bubbles = !jQueryEvent.isPropagationStopped();
					nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
					defaultPrevented = jQueryEvent.isDefaultPrevented();
				}
				const evt = hydrateObj(new Event(event, {
					bubbles,
					cancelable: true
				}), args);
				if (defaultPrevented) evt.preventDefault();
				if (nativeDispatch) element.dispatchEvent(evt);
				if (evt.defaultPrevented && jQueryEvent) jQueryEvent.preventDefault();
				return evt;
			}
		};
		function hydrateObj(obj, meta = {}) {
			for (const [key, value] of Object.entries(meta)) try {
				obj[key] = value;
			} catch (_unused) {
				Object.defineProperty(obj, key, {
					configurable: true,
					get() {
						return value;
					}
				});
			}
			return obj;
		}
		return EventHandler;
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/dom/manipulator.js
var require_manipulator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap manipulator.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Manipulator = factory());
	})(exports, (function() {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap dom/manipulator.js
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
			} catch (_unused) {
				return value;
			}
		}
		function normalizeDataKey(key) {
			return key.replace(/[A-Z]/g, (chr) => `-${chr.toLowerCase()}`);
		}
		return {
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
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/util/config.js
var require_config = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap config.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_manipulator(), require_util()) : typeof define === "function" && define.amd ? define(["../dom/manipulator", "./index"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Config = factory(global.Manipulator, global.Index));
	})(exports, (function(Manipulator, index_js) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap util/config.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		/**
		* Class definition
		*/
		class Config {
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
				const jsonConfig = index_js.isElement(element) ? Manipulator.getDataAttribute(element, "config") : {};
				return {
					...this.constructor.Default,
					...typeof jsonConfig === "object" ? jsonConfig : {},
					...index_js.isElement(element) ? Manipulator.getDataAttributes(element) : {},
					...typeof config === "object" ? config : {}
				};
			}
			_typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
				for (const [property, expectedTypes] of Object.entries(configTypes)) {
					const value = config[property];
					const valueType = index_js.isElement(value) ? "element" : index_js.toType(value);
					if (!new RegExp(expectedTypes).test(valueType)) throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
				}
			}
		}
		return Config;
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/base-component.js
var require_base_component = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap base-component.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_data(), require_event_handler(), require_config(), require_util()) : typeof define === "function" && define.amd ? define([
			"./dom/data",
			"./dom/event-handler",
			"./util/config",
			"./util/index"
		], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.BaseComponent = factory(global.Data, global.EventHandler, global.Config, global.Index));
	})(exports, (function(Data, EventHandler, Config, index_js) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap base-component.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		/**
		* Constants
		*/
		const VERSION = "5.3.8";
		/**
		* Class definition
		*/
		class BaseComponent extends Config {
			constructor(element, config) {
				super();
				element = index_js.getElement(element);
				if (!element) return;
				this._element = element;
				this._config = this._getConfig(config);
				Data.set(this._element, this.constructor.DATA_KEY, this);
			}
			dispose() {
				Data.remove(this._element, this.constructor.DATA_KEY);
				EventHandler.off(this._element, this.constructor.EVENT_KEY);
				for (const propertyName of Object.getOwnPropertyNames(this)) this[propertyName] = null;
			}
			_queueCallback(callback, element, isAnimated = true) {
				index_js.executeAfterTransition(callback, element, isAnimated);
			}
			_getConfig(config) {
				config = this._mergeConfigObj(config, this._element);
				config = this._configAfterMerge(config);
				this._typeCheckConfig(config);
				return config;
			}
			static getInstance(element) {
				return Data.get(index_js.getElement(element), this.DATA_KEY);
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
		}
		return BaseComponent;
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/button.js
var require_button = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap button.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_base_component(), require_event_handler(), require_util()) : typeof define === "function" && define.amd ? define([
			"./base-component",
			"./dom/event-handler",
			"./util/index"
		], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Button = factory(global.BaseComponent, global.EventHandler, global.Index));
	})(exports, (function(BaseComponent, EventHandler, index_js) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap button.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		/**
		* Constants
		*/
		const NAME = "button";
		const EVENT_KEY = `.bs.button`;
		const DATA_API_KEY = ".data-api";
		const CLASS_NAME_ACTIVE = "active";
		const SELECTOR_DATA_TOGGLE = "[data-bs-toggle=\"button\"]";
		const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
		/**
		* Class definition
		*/
		class Button extends BaseComponent {
			static get NAME() {
				return NAME;
			}
			toggle() {
				this._element.setAttribute("aria-pressed", this._element.classList.toggle(CLASS_NAME_ACTIVE));
			}
			static jQueryInterface(config) {
				return this.each(function() {
					const data = Button.getOrCreateInstance(this);
					if (config === "toggle") data[config]();
				});
			}
		}
		/**
		* Data API implementation
		*/
		EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, (event) => {
			event.preventDefault();
			const button = event.target.closest(SELECTOR_DATA_TOGGLE);
			Button.getOrCreateInstance(button).toggle();
		});
		/**
		* jQuery
		*/
		index_js.defineJQueryPlugin(Button);
		return Button;
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/dom/selector-engine.js
var require_selector_engine = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap selector-engine.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_util()) : typeof define === "function" && define.amd ? define(["../util/index"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.SelectorEngine = factory(global.Index));
	})(exports, (function(index_js) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap dom/selector-engine.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		const getSelector = (element) => {
			let selector = element.getAttribute("data-bs-target");
			if (!selector || selector === "#") {
				let hrefAttribute = element.getAttribute("href");
				if (!hrefAttribute || !hrefAttribute.includes("#") && !hrefAttribute.startsWith(".")) return null;
				if (hrefAttribute.includes("#") && !hrefAttribute.startsWith("#")) hrefAttribute = `#${hrefAttribute.split("#")[1]}`;
				selector = hrefAttribute && hrefAttribute !== "#" ? hrefAttribute.trim() : null;
			}
			return selector ? selector.split(",").map((sel) => index_js.parseSelector(sel)).join(",") : null;
		};
		const SelectorEngine = {
			find(selector, element = document.documentElement) {
				return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
			},
			findOne(selector, element = document.documentElement) {
				return Element.prototype.querySelector.call(element, selector);
			},
			children(element, selector) {
				return [].concat(...element.children).filter((child) => child.matches(selector));
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
			focusableChildren(element) {
				const focusables = [
					"a",
					"button",
					"input",
					"textarea",
					"select",
					"details",
					"[tabindex]",
					"[contenteditable=\"true\"]"
				].map((selector) => `${selector}:not([tabindex^="-"])`).join(",");
				return this.find(focusables, element).filter((el) => !index_js.isDisabled(el) && index_js.isVisible(el));
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
		return SelectorEngine;
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/util/swipe.js
var require_swipe = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap swipe.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_event_handler(), require_config(), require_util()) : typeof define === "function" && define.amd ? define([
			"../dom/event-handler",
			"./config",
			"./index"
		], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Swipe = factory(global.EventHandler, global.Config, global.Index));
	})(exports, (function(EventHandler, Config, index_js) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap util/swipe.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		/**
		* Constants
		*/
		const NAME = "swipe";
		const EVENT_KEY = ".bs.swipe";
		const EVENT_TOUCHSTART = `touchstart${EVENT_KEY}`;
		const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY}`;
		const EVENT_TOUCHEND = `touchend${EVENT_KEY}`;
		const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY}`;
		const EVENT_POINTERUP = `pointerup${EVENT_KEY}`;
		const POINTER_TYPE_TOUCH = "touch";
		const POINTER_TYPE_PEN = "pen";
		const CLASS_NAME_POINTER_EVENT = "pointer-event";
		const SWIPE_THRESHOLD = 40;
		const Default = {
			endCallback: null,
			leftCallback: null,
			rightCallback: null
		};
		const DefaultType = {
			endCallback: "(function|null)",
			leftCallback: "(function|null)",
			rightCallback: "(function|null)"
		};
		/**
		* Class definition
		*/
		class Swipe extends Config {
			constructor(element, config) {
				super();
				this._element = element;
				if (!element || !Swipe.isSupported()) return;
				this._config = this._getConfig(config);
				this._deltaX = 0;
				this._supportPointerEvents = Boolean(window.PointerEvent);
				this._initEvents();
			}
			static get Default() {
				return Default;
			}
			static get DefaultType() {
				return DefaultType;
			}
			static get NAME() {
				return NAME;
			}
			dispose() {
				EventHandler.off(this._element, EVENT_KEY);
			}
			_start(event) {
				if (!this._supportPointerEvents) {
					this._deltaX = event.touches[0].clientX;
					return;
				}
				if (this._eventIsPointerPenTouch(event)) this._deltaX = event.clientX;
			}
			_end(event) {
				if (this._eventIsPointerPenTouch(event)) this._deltaX = event.clientX - this._deltaX;
				this._handleSwipe();
				index_js.execute(this._config.endCallback);
			}
			_move(event) {
				this._deltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this._deltaX;
			}
			_handleSwipe() {
				const absDeltaX = Math.abs(this._deltaX);
				if (absDeltaX <= SWIPE_THRESHOLD) return;
				const direction = absDeltaX / this._deltaX;
				this._deltaX = 0;
				if (!direction) return;
				index_js.execute(direction > 0 ? this._config.rightCallback : this._config.leftCallback);
			}
			_initEvents() {
				if (this._supportPointerEvents) {
					EventHandler.on(this._element, EVENT_POINTERDOWN, (event) => this._start(event));
					EventHandler.on(this._element, EVENT_POINTERUP, (event) => this._end(event));
					this._element.classList.add(CLASS_NAME_POINTER_EVENT);
				} else {
					EventHandler.on(this._element, EVENT_TOUCHSTART, (event) => this._start(event));
					EventHandler.on(this._element, EVENT_TOUCHMOVE, (event) => this._move(event));
					EventHandler.on(this._element, EVENT_TOUCHEND, (event) => this._end(event));
				}
			}
			_eventIsPointerPenTouch(event) {
				return this._supportPointerEvents && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
			}
			static isSupported() {
				return "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0;
			}
		}
		return Swipe;
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/carousel.js
var require_carousel = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap carousel.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_base_component(), require_event_handler(), require_manipulator(), require_selector_engine(), require_util(), require_swipe()) : typeof define === "function" && define.amd ? define([
			"./base-component",
			"./dom/event-handler",
			"./dom/manipulator",
			"./dom/selector-engine",
			"./util/index",
			"./util/swipe"
		], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Carousel = factory(global.BaseComponent, global.EventHandler, global.Manipulator, global.SelectorEngine, global.Index, global.Swipe));
	})(exports, (function(BaseComponent, EventHandler, Manipulator, SelectorEngine, index_js, Swipe) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap carousel.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		/**
		* Constants
		*/
		const NAME = "carousel";
		const EVENT_KEY = `.bs.carousel`;
		const DATA_API_KEY = ".data-api";
		const ARROW_LEFT_KEY = "ArrowLeft";
		const ARROW_RIGHT_KEY = "ArrowRight";
		const TOUCHEVENT_COMPAT_WAIT = 500;
		const ORDER_NEXT = "next";
		const ORDER_PREV = "prev";
		const DIRECTION_LEFT = "left";
		const DIRECTION_RIGHT = "right";
		const EVENT_SLIDE = `slide${EVENT_KEY}`;
		const EVENT_SLID = `slid${EVENT_KEY}`;
		const EVENT_KEYDOWN = `keydown${EVENT_KEY}`;
		const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY}`;
		const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY}`;
		const EVENT_DRAG_START = `dragstart${EVENT_KEY}`;
		const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
		const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
		const CLASS_NAME_CAROUSEL = "carousel";
		const CLASS_NAME_ACTIVE = "active";
		const CLASS_NAME_SLIDE = "slide";
		const CLASS_NAME_END = "carousel-item-end";
		const CLASS_NAME_START = "carousel-item-start";
		const CLASS_NAME_NEXT = "carousel-item-next";
		const CLASS_NAME_PREV = "carousel-item-prev";
		const SELECTOR_ACTIVE = ".active";
		const SELECTOR_ITEM = ".carousel-item";
		const SELECTOR_ACTIVE_ITEM = ".active.carousel-item";
		const SELECTOR_ITEM_IMG = ".carousel-item img";
		const SELECTOR_INDICATORS = ".carousel-indicators";
		const SELECTOR_DATA_SLIDE = "[data-bs-slide], [data-bs-slide-to]";
		const SELECTOR_DATA_RIDE = "[data-bs-ride=\"carousel\"]";
		const KEY_TO_DIRECTION = {
			[ARROW_LEFT_KEY]: DIRECTION_RIGHT,
			[ARROW_RIGHT_KEY]: DIRECTION_LEFT
		};
		const Default = {
			interval: 5e3,
			keyboard: true,
			pause: "hover",
			ride: false,
			touch: true,
			wrap: true
		};
		const DefaultType = {
			interval: "(number|boolean)",
			keyboard: "boolean",
			pause: "(string|boolean)",
			ride: "(boolean|string)",
			touch: "boolean",
			wrap: "boolean"
		};
		/**
		* Class definition
		*/
		class Carousel extends BaseComponent {
			constructor(element, config) {
				super(element, config);
				this._interval = null;
				this._activeElement = null;
				this._isSliding = false;
				this.touchTimeout = null;
				this._swipeHelper = null;
				this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
				this._addEventListeners();
				if (this._config.ride === CLASS_NAME_CAROUSEL) this.cycle();
			}
			static get Default() {
				return Default;
			}
			static get DefaultType() {
				return DefaultType;
			}
			static get NAME() {
				return NAME;
			}
			next() {
				this._slide(ORDER_NEXT);
			}
			nextWhenVisible() {
				if (!document.hidden && index_js.isVisible(this._element)) this.next();
			}
			prev() {
				this._slide(ORDER_PREV);
			}
			pause() {
				if (this._isSliding) index_js.triggerTransitionEnd(this._element);
				this._clearInterval();
			}
			cycle() {
				this._clearInterval();
				this._updateInterval();
				this._interval = setInterval(() => this.nextWhenVisible(), this._config.interval);
			}
			_maybeEnableCycle() {
				if (!this._config.ride) return;
				if (this._isSliding) {
					EventHandler.one(this._element, EVENT_SLID, () => this.cycle());
					return;
				}
				this.cycle();
			}
			to(index) {
				const items = this._getItems();
				if (index > items.length - 1 || index < 0) return;
				if (this._isSliding) {
					EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
					return;
				}
				const activeIndex = this._getItemIndex(this._getActive());
				if (activeIndex === index) return;
				const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;
				this._slide(order, items[index]);
			}
			dispose() {
				if (this._swipeHelper) this._swipeHelper.dispose();
				super.dispose();
			}
			_configAfterMerge(config) {
				config.defaultInterval = config.interval;
				return config;
			}
			_addEventListeners() {
				if (this._config.keyboard) EventHandler.on(this._element, EVENT_KEYDOWN, (event) => this._keydown(event));
				if (this._config.pause === "hover") {
					EventHandler.on(this._element, EVENT_MOUSEENTER, () => this.pause());
					EventHandler.on(this._element, EVENT_MOUSELEAVE, () => this._maybeEnableCycle());
				}
				if (this._config.touch && Swipe.isSupported()) this._addTouchEventListeners();
			}
			_addTouchEventListeners() {
				for (const img of SelectorEngine.find(SELECTOR_ITEM_IMG, this._element)) EventHandler.on(img, EVENT_DRAG_START, (event) => event.preventDefault());
				const endCallBack = () => {
					if (this._config.pause !== "hover") return;
					this.pause();
					if (this.touchTimeout) clearTimeout(this.touchTimeout);
					this.touchTimeout = setTimeout(() => this._maybeEnableCycle(), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
				};
				const swipeConfig = {
					leftCallback: () => this._slide(this._directionToOrder(DIRECTION_LEFT)),
					rightCallback: () => this._slide(this._directionToOrder(DIRECTION_RIGHT)),
					endCallback: endCallBack
				};
				this._swipeHelper = new Swipe(this._element, swipeConfig);
			}
			_keydown(event) {
				if (/input|textarea/i.test(event.target.tagName)) return;
				const direction = KEY_TO_DIRECTION[event.key];
				if (direction) {
					event.preventDefault();
					this._slide(this._directionToOrder(direction));
				}
			}
			_getItemIndex(element) {
				return this._getItems().indexOf(element);
			}
			_setActiveIndicatorElement(index) {
				if (!this._indicatorsElement) return;
				const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE, this._indicatorsElement);
				activeIndicator.classList.remove(CLASS_NAME_ACTIVE);
				activeIndicator.removeAttribute("aria-current");
				const newActiveIndicator = SelectorEngine.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement);
				if (newActiveIndicator) {
					newActiveIndicator.classList.add(CLASS_NAME_ACTIVE);
					newActiveIndicator.setAttribute("aria-current", "true");
				}
			}
			_updateInterval() {
				const element = this._activeElement || this._getActive();
				if (!element) return;
				const elementInterval = Number.parseInt(element.getAttribute("data-bs-interval"), 10);
				this._config.interval = elementInterval || this._config.defaultInterval;
			}
			_slide(order, element = null) {
				if (this._isSliding) return;
				const activeElement = this._getActive();
				const isNext = order === ORDER_NEXT;
				const nextElement = element || index_js.getNextActiveElement(this._getItems(), activeElement, isNext, this._config.wrap);
				if (nextElement === activeElement) return;
				const nextElementIndex = this._getItemIndex(nextElement);
				const triggerEvent = (eventName) => {
					return EventHandler.trigger(this._element, eventName, {
						relatedTarget: nextElement,
						direction: this._orderToDirection(order),
						from: this._getItemIndex(activeElement),
						to: nextElementIndex
					});
				};
				if (triggerEvent(EVENT_SLIDE).defaultPrevented) return;
				if (!activeElement || !nextElement) return;
				const isCycling = Boolean(this._interval);
				this.pause();
				this._isSliding = true;
				this._setActiveIndicatorElement(nextElementIndex);
				this._activeElement = nextElement;
				const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
				const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
				nextElement.classList.add(orderClassName);
				index_js.reflow(nextElement);
				activeElement.classList.add(directionalClassName);
				nextElement.classList.add(directionalClassName);
				const completeCallBack = () => {
					nextElement.classList.remove(directionalClassName, orderClassName);
					nextElement.classList.add(CLASS_NAME_ACTIVE);
					activeElement.classList.remove(CLASS_NAME_ACTIVE, orderClassName, directionalClassName);
					this._isSliding = false;
					triggerEvent(EVENT_SLID);
				};
				this._queueCallback(completeCallBack, activeElement, this._isAnimated());
				if (isCycling) this.cycle();
			}
			_isAnimated() {
				return this._element.classList.contains(CLASS_NAME_SLIDE);
			}
			_getActive() {
				return SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
			}
			_getItems() {
				return SelectorEngine.find(SELECTOR_ITEM, this._element);
			}
			_clearInterval() {
				if (this._interval) {
					clearInterval(this._interval);
					this._interval = null;
				}
			}
			_directionToOrder(direction) {
				if (index_js.isRTL()) return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
				return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
			}
			_orderToDirection(order) {
				if (index_js.isRTL()) return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
				return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
			}
			static jQueryInterface(config) {
				return this.each(function() {
					const data = Carousel.getOrCreateInstance(this, config);
					if (typeof config === "number") {
						data.to(config);
						return;
					}
					if (typeof config === "string") {
						if (data[config] === void 0 || config.startsWith("_") || config === "constructor") throw new TypeError(`No method named "${config}"`);
						data[config]();
					}
				});
			}
		}
		/**
		* Data API implementation
		*/
		EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_SLIDE, function(event) {
			const target = SelectorEngine.getElementFromSelector(this);
			if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) return;
			event.preventDefault();
			const carousel = Carousel.getOrCreateInstance(target);
			const slideIndex = this.getAttribute("data-bs-slide-to");
			if (slideIndex) {
				carousel.to(slideIndex);
				carousel._maybeEnableCycle();
				return;
			}
			if (Manipulator.getDataAttribute(this, "slide") === "next") {
				carousel.next();
				carousel._maybeEnableCycle();
				return;
			}
			carousel.prev();
			carousel._maybeEnableCycle();
		});
		EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
			const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);
			for (const carousel of carousels) Carousel.getOrCreateInstance(carousel);
		});
		/**
		* jQuery
		*/
		index_js.defineJQueryPlugin(Carousel);
		return Carousel;
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/collapse.js
var require_collapse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap collapse.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_base_component(), require_event_handler(), require_selector_engine(), require_util()) : typeof define === "function" && define.amd ? define([
			"./base-component",
			"./dom/event-handler",
			"./dom/selector-engine",
			"./util/index"
		], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Collapse = factory(global.BaseComponent, global.EventHandler, global.SelectorEngine, global.Index));
	})(exports, (function(BaseComponent, EventHandler, SelectorEngine, index_js) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap collapse.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		/**
		* Constants
		*/
		const NAME = "collapse";
		const EVENT_KEY = `.bs.collapse`;
		const DATA_API_KEY = ".data-api";
		const EVENT_SHOW = `show${EVENT_KEY}`;
		const EVENT_SHOWN = `shown${EVENT_KEY}`;
		const EVENT_HIDE = `hide${EVENT_KEY}`;
		const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
		const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
		const CLASS_NAME_SHOW = "show";
		const CLASS_NAME_COLLAPSE = "collapse";
		const CLASS_NAME_COLLAPSING = "collapsing";
		const CLASS_NAME_COLLAPSED = "collapsed";
		const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
		const CLASS_NAME_HORIZONTAL = "collapse-horizontal";
		const WIDTH = "width";
		const HEIGHT = "height";
		const SELECTOR_ACTIVES = ".collapse.show, .collapse.collapsing";
		const SELECTOR_DATA_TOGGLE = "[data-bs-toggle=\"collapse\"]";
		const Default = {
			parent: null,
			toggle: true
		};
		const DefaultType = {
			parent: "(null|element)",
			toggle: "boolean"
		};
		/**
		* Class definition
		*/
		class Collapse extends BaseComponent {
			constructor(element, config) {
				super(element, config);
				this._isTransitioning = false;
				this._triggerArray = [];
				const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE);
				for (const elem of toggleList) {
					const selector = SelectorEngine.getSelectorFromElement(elem);
					const filterElement = SelectorEngine.find(selector).filter((foundElement) => foundElement === this._element);
					if (selector !== null && filterElement.length) this._triggerArray.push(elem);
				}
				this._initializeChildren();
				if (!this._config.parent) this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
				if (this._config.toggle) this.toggle();
			}
			static get Default() {
				return Default;
			}
			static get DefaultType() {
				return DefaultType;
			}
			static get NAME() {
				return NAME;
			}
			toggle() {
				if (this._isShown()) this.hide();
				else this.show();
			}
			show() {
				if (this._isTransitioning || this._isShown()) return;
				let activeChildren = [];
				if (this._config.parent) activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES).filter((element) => element !== this._element).map((element) => Collapse.getOrCreateInstance(element, { toggle: false }));
				if (activeChildren.length && activeChildren[0]._isTransitioning) return;
				if (EventHandler.trigger(this._element, EVENT_SHOW).defaultPrevented) return;
				for (const activeInstance of activeChildren) activeInstance.hide();
				const dimension = this._getDimension();
				this._element.classList.remove(CLASS_NAME_COLLAPSE);
				this._element.classList.add(CLASS_NAME_COLLAPSING);
				this._element.style[dimension] = 0;
				this._addAriaAndCollapsedClass(this._triggerArray, true);
				this._isTransitioning = true;
				const complete = () => {
					this._isTransitioning = false;
					this._element.classList.remove(CLASS_NAME_COLLAPSING);
					this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);
					this._element.style[dimension] = "";
					EventHandler.trigger(this._element, EVENT_SHOWN);
				};
				const scrollSize = `scroll${dimension[0].toUpperCase() + dimension.slice(1)}`;
				this._queueCallback(complete, this._element, true);
				this._element.style[dimension] = `${this._element[scrollSize]}px`;
			}
			hide() {
				if (this._isTransitioning || !this._isShown()) return;
				if (EventHandler.trigger(this._element, EVENT_HIDE).defaultPrevented) return;
				const dimension = this._getDimension();
				this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
				index_js.reflow(this._element);
				this._element.classList.add(CLASS_NAME_COLLAPSING);
				this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);
				for (const trigger of this._triggerArray) {
					const element = SelectorEngine.getElementFromSelector(trigger);
					if (element && !this._isShown(element)) this._addAriaAndCollapsedClass([trigger], false);
				}
				this._isTransitioning = true;
				const complete = () => {
					this._isTransitioning = false;
					this._element.classList.remove(CLASS_NAME_COLLAPSING);
					this._element.classList.add(CLASS_NAME_COLLAPSE);
					EventHandler.trigger(this._element, EVENT_HIDDEN);
				};
				this._element.style[dimension] = "";
				this._queueCallback(complete, this._element, true);
			}
			_isShown(element = this._element) {
				return element.classList.contains(CLASS_NAME_SHOW);
			}
			_configAfterMerge(config) {
				config.toggle = Boolean(config.toggle);
				config.parent = index_js.getElement(config.parent);
				return config;
			}
			_getDimension() {
				return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
			}
			_initializeChildren() {
				if (!this._config.parent) return;
				const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE);
				for (const element of children) {
					const selected = SelectorEngine.getElementFromSelector(element);
					if (selected) this._addAriaAndCollapsedClass([element], this._isShown(selected));
				}
			}
			_getFirstLevelChildren(selector) {
				const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
				return SelectorEngine.find(selector, this._config.parent).filter((element) => !children.includes(element));
			}
			_addAriaAndCollapsedClass(triggerArray, isOpen) {
				if (!triggerArray.length) return;
				for (const element of triggerArray) {
					element.classList.toggle(CLASS_NAME_COLLAPSED, !isOpen);
					element.setAttribute("aria-expanded", isOpen);
				}
			}
			static jQueryInterface(config) {
				const _config = {};
				if (typeof config === "string" && /show|hide/.test(config)) _config.toggle = false;
				return this.each(function() {
					const data = Collapse.getOrCreateInstance(this, _config);
					if (typeof config === "string") {
						if (typeof data[config] === "undefined") throw new TypeError(`No method named "${config}"`);
						data[config]();
					}
				});
			}
		}
		/**
		* Data API implementation
		*/
		EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(event) {
			if (event.target.tagName === "A" || event.delegateTarget && event.delegateTarget.tagName === "A") event.preventDefault();
			for (const element of SelectorEngine.getMultipleElementsFromSelector(this)) Collapse.getOrCreateInstance(element, { toggle: false }).toggle();
		});
		/**
		* jQuery
		*/
		index_js.defineJQueryPlugin(Collapse);
		return Collapse;
	}));
})), bottom, right, left, auto, basePlacements, start, clippingParents, viewport, popper, reference, variationPlacements, placements, beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite, modifierPhases;
var init_enums = __esmMin((() => {
	bottom = "bottom";
	right = "right";
	left = "left";
	auto = "auto";
	basePlacements = [
		"top",
		bottom,
		right,
		left
	];
	start = "start";
	clippingParents = "clippingParents";
	viewport = "viewport";
	popper = "popper";
	reference = "reference";
	variationPlacements = /*#__PURE__*/ basePlacements.reduce(function(acc, placement) {
		return acc.concat([placement + "-" + start, placement + "-end"]);
	}, []);
	placements = /*#__PURE__*/ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
		return acc.concat([
			placement,
			placement + "-" + start,
			placement + "-end"
		]);
	}, []);
	beforeRead = "beforeRead";
	read = "read";
	afterRead = "afterRead";
	beforeMain = "beforeMain";
	main = "main";
	afterMain = "afterMain";
	beforeWrite = "beforeWrite";
	write = "write";
	afterWrite = "afterWrite";
	modifierPhases = [
		beforeRead,
		read,
		afterRead,
		beforeMain,
		main,
		afterMain,
		beforeWrite,
		write,
		afterWrite
	];
}));
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getNodeName.js
function getNodeName(element) {
	return element ? (element.nodeName || "").toLowerCase() : null;
}
var init_getNodeName = __esmMin((() => {}));
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getWindow.js
function getWindow(node) {
	if (node == null) return window;
	if (node.toString() !== "[object Window]") {
		var ownerDocument = node.ownerDocument;
		return ownerDocument ? ownerDocument.defaultView || window : window;
	}
	return node;
}
var init_getWindow = __esmMin((() => {}));
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/instanceOf.js
function isElement(node) {
	return node instanceof getWindow(node).Element || node instanceof Element;
}
function isHTMLElement(node) {
	return node instanceof getWindow(node).HTMLElement || node instanceof HTMLElement;
}
function isShadowRoot(node) {
	if (typeof ShadowRoot === "undefined") return false;
	return node instanceof getWindow(node).ShadowRoot || node instanceof ShadowRoot;
}
var init_instanceOf = __esmMin((() => {
	init_getWindow();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/applyStyles.js
function applyStyles(_ref) {
	var state = _ref.state;
	Object.keys(state.elements).forEach(function(name) {
		var style = state.styles[name] || {};
		var attributes = state.attributes[name] || {};
		var element = state.elements[name];
		if (!isHTMLElement(element) || !getNodeName(element)) return;
		Object.assign(element.style, style);
		Object.keys(attributes).forEach(function(name) {
			var value = attributes[name];
			if (value === false) element.removeAttribute(name);
			else element.setAttribute(name, value === true ? "" : value);
		});
	});
}
function effect$2(_ref2) {
	var state = _ref2.state;
	var initialStyles = {
		popper: {
			position: state.options.strategy,
			left: "0",
			top: "0",
			margin: "0"
		},
		arrow: { position: "absolute" },
		reference: {}
	};
	Object.assign(state.elements.popper.style, initialStyles.popper);
	state.styles = initialStyles;
	if (state.elements.arrow) Object.assign(state.elements.arrow.style, initialStyles.arrow);
	return function() {
		Object.keys(state.elements).forEach(function(name) {
			var element = state.elements[name];
			var attributes = state.attributes[name] || {};
			var style = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]).reduce(function(style, property) {
				style[property] = "";
				return style;
			}, {});
			if (!isHTMLElement(element) || !getNodeName(element)) return;
			Object.assign(element.style, style);
			Object.keys(attributes).forEach(function(attribute) {
				element.removeAttribute(attribute);
			});
		});
	};
}
var applyStyles_default;
var init_applyStyles = __esmMin((() => {
	init_getNodeName();
	init_instanceOf();
	applyStyles_default = {
		name: "applyStyles",
		enabled: true,
		phase: "write",
		fn: applyStyles,
		effect: effect$2,
		requires: ["computeStyles"]
	};
}));
//#endregion
//#region node_modules/@popperjs/core/lib/utils/getBasePlacement.js
function getBasePlacement(placement) {
	return placement.split("-")[0];
}
var init_getBasePlacement = __esmMin((() => {}));
//#endregion
//#region node_modules/@popperjs/core/lib/utils/math.js
var max, min, round;
var init_math = __esmMin((() => {
	max = Math.max;
	min = Math.min;
	round = Math.round;
}));
//#endregion
//#region node_modules/@popperjs/core/lib/utils/userAgent.js
function getUAString() {
	var uaData = navigator.userAgentData;
	if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) return uaData.brands.map(function(item) {
		return item.brand + "/" + item.version;
	}).join(" ");
	return navigator.userAgent;
}
var init_userAgent = __esmMin((() => {}));
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js
function isLayoutViewport() {
	return !/^((?!chrome|android).)*safari/i.test(getUAString());
}
var init_isLayoutViewport = __esmMin((() => {
	init_userAgent();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js
function getBoundingClientRect(element, includeScale, isFixedStrategy) {
	if (includeScale === void 0) includeScale = false;
	if (isFixedStrategy === void 0) isFixedStrategy = false;
	var clientRect = element.getBoundingClientRect();
	var scaleX = 1;
	var scaleY = 1;
	if (includeScale && isHTMLElement(element)) {
		scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
		scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
	}
	var visualViewport = (isElement(element) ? getWindow(element) : window).visualViewport;
	var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
	var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
	var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
	var width = clientRect.width / scaleX;
	var height = clientRect.height / scaleY;
	return {
		width,
		height,
		top: y,
		right: x + width,
		bottom: y + height,
		left: x,
		x,
		y
	};
}
var init_getBoundingClientRect = __esmMin((() => {
	init_instanceOf();
	init_math();
	init_getWindow();
	init_isLayoutViewport();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js
function getLayoutRect(element) {
	var clientRect = getBoundingClientRect(element);
	var width = element.offsetWidth;
	var height = element.offsetHeight;
	if (Math.abs(clientRect.width - width) <= 1) width = clientRect.width;
	if (Math.abs(clientRect.height - height) <= 1) height = clientRect.height;
	return {
		x: element.offsetLeft,
		y: element.offsetTop,
		width,
		height
	};
}
var init_getLayoutRect = __esmMin((() => {
	init_getBoundingClientRect();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/contains.js
function contains(parent, child) {
	var rootNode = child.getRootNode && child.getRootNode();
	if (parent.contains(child)) return true;
	else if (rootNode && isShadowRoot(rootNode)) {
		var next = child;
		do {
			if (next && parent.isSameNode(next)) return true;
			next = next.parentNode || next.host;
		} while (next);
	}
	return false;
}
var init_contains = __esmMin((() => {
	init_instanceOf();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js
function getComputedStyle$1(element) {
	return getWindow(element).getComputedStyle(element);
}
var init_getComputedStyle = __esmMin((() => {
	init_getWindow();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/isTableElement.js
function isTableElement(element) {
	return [
		"table",
		"td",
		"th"
	].indexOf(getNodeName(element)) >= 0;
}
var init_isTableElement = __esmMin((() => {
	init_getNodeName();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js
function getDocumentElement(element) {
	return ((isElement(element) ? element.ownerDocument : element.document) || window.document).documentElement;
}
var init_getDocumentElement = __esmMin((() => {
	init_instanceOf();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getParentNode.js
function getParentNode(element) {
	if (getNodeName(element) === "html") return element;
	return element.assignedSlot || element.parentNode || (isShadowRoot(element) ? element.host : null) || getDocumentElement(element);
}
var init_getParentNode = __esmMin((() => {
	init_getNodeName();
	init_getDocumentElement();
	init_instanceOf();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js
function getTrueOffsetParent(element) {
	if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") return null;
	return element.offsetParent;
}
function getContainingBlock(element) {
	var isFirefox = /firefox/i.test(getUAString());
	if (/Trident/i.test(getUAString()) && isHTMLElement(element)) {
		if (getComputedStyle$1(element).position === "fixed") return null;
	}
	var currentNode = getParentNode(element);
	if (isShadowRoot(currentNode)) currentNode = currentNode.host;
	while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
		var css = getComputedStyle$1(currentNode);
		if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") return currentNode;
		else currentNode = currentNode.parentNode;
	}
	return null;
}
function getOffsetParent(element) {
	var window = getWindow(element);
	var offsetParent = getTrueOffsetParent(element);
	while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === "static") offsetParent = getTrueOffsetParent(offsetParent);
	if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle$1(offsetParent).position === "static")) return window;
	return offsetParent || getContainingBlock(element) || window;
}
var init_getOffsetParent = __esmMin((() => {
	init_getWindow();
	init_getNodeName();
	init_getComputedStyle();
	init_instanceOf();
	init_isTableElement();
	init_getParentNode();
	init_userAgent();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js
function getMainAxisFromPlacement(placement) {
	return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
}
var init_getMainAxisFromPlacement = __esmMin((() => {}));
//#endregion
//#region node_modules/@popperjs/core/lib/utils/within.js
function within(min$2, value, max$2) {
	return max(min$2, min(value, max$2));
}
function withinMaxClamp(min, value, max) {
	var v = within(min, value, max);
	return v > max ? max : v;
}
var init_within = __esmMin((() => {
	init_math();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/utils/getFreshSideObject.js
function getFreshSideObject() {
	return {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	};
}
var init_getFreshSideObject = __esmMin((() => {}));
//#endregion
//#region node_modules/@popperjs/core/lib/utils/mergePaddingObject.js
function mergePaddingObject(paddingObject) {
	return Object.assign({}, getFreshSideObject(), paddingObject);
}
var init_mergePaddingObject = __esmMin((() => {
	init_getFreshSideObject();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/utils/expandToHashMap.js
function expandToHashMap(value, keys) {
	return keys.reduce(function(hashMap, key) {
		hashMap[key] = value;
		return hashMap;
	}, {});
}
var init_expandToHashMap = __esmMin((() => {}));
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/arrow.js
function arrow(_ref) {
	var _state$modifiersData$;
	var state = _ref.state, name = _ref.name, options = _ref.options;
	var arrowElement = state.elements.arrow;
	var popperOffsets = state.modifiersData.popperOffsets;
	var basePlacement = getBasePlacement(state.placement);
	var axis = getMainAxisFromPlacement(basePlacement);
	var len = ["left", "right"].indexOf(basePlacement) >= 0 ? "height" : "width";
	if (!arrowElement || !popperOffsets) return;
	var paddingObject = toPaddingObject(options.padding, state);
	var arrowRect = getLayoutRect(arrowElement);
	var minProp = axis === "y" ? "top" : left;
	var maxProp = axis === "y" ? bottom : right;
	var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
	var startDiff = popperOffsets[axis] - state.rects.reference[axis];
	var arrowOffsetParent = getOffsetParent(arrowElement);
	var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
	var centerToReference = endDiff / 2 - startDiff / 2;
	var min = paddingObject[minProp];
	var max = clientSize - arrowRect[len] - paddingObject[maxProp];
	var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
	var offset = within(min, center, max);
	var axisProp = axis;
	state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}
function effect$1(_ref2) {
	var state = _ref2.state;
	var _options$element = _ref2.options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
	if (arrowElement == null) return;
	if (typeof arrowElement === "string") {
		arrowElement = state.elements.popper.querySelector(arrowElement);
		if (!arrowElement) return;
	}
	if (!contains(state.elements.popper, arrowElement)) return;
	state.elements.arrow = arrowElement;
}
var toPaddingObject, arrow_default;
var init_arrow = __esmMin((() => {
	init_getBasePlacement();
	init_getLayoutRect();
	init_contains();
	init_getOffsetParent();
	init_getMainAxisFromPlacement();
	init_within();
	init_mergePaddingObject();
	init_expandToHashMap();
	init_enums();
	toPaddingObject = function toPaddingObject(padding, state) {
		padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, { placement: state.placement })) : padding;
		return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
	};
	arrow_default = {
		name: "arrow",
		enabled: true,
		phase: "main",
		fn: arrow,
		effect: effect$1,
		requires: ["popperOffsets"],
		requiresIfExists: ["preventOverflow"]
	};
}));
//#endregion
//#region node_modules/@popperjs/core/lib/utils/getVariation.js
function getVariation(placement) {
	return placement.split("-")[1];
}
var init_getVariation = __esmMin((() => {}));
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/computeStyles.js
function roundOffsetsByDPR(_ref, win) {
	var x = _ref.x, y = _ref.y;
	var dpr = win.devicePixelRatio || 1;
	return {
		x: round(x * dpr) / dpr || 0,
		y: round(y * dpr) / dpr || 0
	};
}
function mapToStyles(_ref2) {
	var _Object$assign2;
	var popper = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
	var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
	var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
		x,
		y
	}) : {
		x,
		y
	};
	x = _ref3.x;
	y = _ref3.y;
	var hasX = offsets.hasOwnProperty("x");
	var hasY = offsets.hasOwnProperty("y");
	var sideX = left;
	var sideY = "top";
	var win = window;
	if (adaptive) {
		var offsetParent = getOffsetParent(popper);
		var heightProp = "clientHeight";
		var widthProp = "clientWidth";
		if (offsetParent === getWindow(popper)) {
			offsetParent = getDocumentElement(popper);
			if (getComputedStyle$1(offsetParent).position !== "static" && position === "absolute") {
				heightProp = "scrollHeight";
				widthProp = "scrollWidth";
			}
		}
		offsetParent = offsetParent;
		if (placement === "top" || (placement === "left" || placement === "right") && variation === "end") {
			sideY = bottom;
			var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : offsetParent[heightProp];
			y -= offsetY - popperRect.height;
			y *= gpuAcceleration ? 1 : -1;
		}
		if (placement === "left" || (placement === "top" || placement === "bottom") && variation === "end") {
			sideX = right;
			var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : offsetParent[widthProp];
			x -= offsetX - popperRect.width;
			x *= gpuAcceleration ? 1 : -1;
		}
	}
	var commonStyles = Object.assign({ position }, adaptive && unsetSides);
	var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
		x,
		y
	}, getWindow(popper)) : {
		x,
		y
	};
	x = _ref4.x;
	y = _ref4.y;
	if (gpuAcceleration) {
		var _Object$assign;
		return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
	}
	return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
}
function computeStyles(_ref5) {
	var state = _ref5.state, options = _ref5.options;
	var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
	var commonStyles = {
		placement: getBasePlacement(state.placement),
		variation: getVariation(state.placement),
		popper: state.elements.popper,
		popperRect: state.rects.popper,
		gpuAcceleration,
		isFixed: state.options.strategy === "fixed"
	};
	if (state.modifiersData.popperOffsets != null) state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
		offsets: state.modifiersData.popperOffsets,
		position: state.options.strategy,
		adaptive,
		roundOffsets
	})));
	if (state.modifiersData.arrow != null) state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
		offsets: state.modifiersData.arrow,
		position: "absolute",
		adaptive: false,
		roundOffsets
	})));
	state.attributes.popper = Object.assign({}, state.attributes.popper, { "data-popper-placement": state.placement });
}
var unsetSides, computeStyles_default;
var init_computeStyles = __esmMin((() => {
	init_enums();
	init_getOffsetParent();
	init_getWindow();
	init_getDocumentElement();
	init_getComputedStyle();
	init_getBasePlacement();
	init_getVariation();
	init_math();
	unsetSides = {
		top: "auto",
		right: "auto",
		bottom: "auto",
		left: "auto"
	};
	computeStyles_default = {
		name: "computeStyles",
		enabled: true,
		phase: "beforeWrite",
		fn: computeStyles,
		data: {}
	};
}));
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/eventListeners.js
function effect(_ref) {
	var state = _ref.state, instance = _ref.instance, options = _ref.options;
	var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
	var window = getWindow(state.elements.popper);
	var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
	if (scroll) scrollParents.forEach(function(scrollParent) {
		scrollParent.addEventListener("scroll", instance.update, passive);
	});
	if (resize) window.addEventListener("resize", instance.update, passive);
	return function() {
		if (scroll) scrollParents.forEach(function(scrollParent) {
			scrollParent.removeEventListener("scroll", instance.update, passive);
		});
		if (resize) window.removeEventListener("resize", instance.update, passive);
	};
}
var passive, eventListeners_default;
var init_eventListeners = __esmMin((() => {
	init_getWindow();
	passive = { passive: true };
	eventListeners_default = {
		name: "eventListeners",
		enabled: true,
		phase: "write",
		fn: function fn() {},
		effect,
		data: {}
	};
}));
//#endregion
//#region node_modules/@popperjs/core/lib/utils/getOppositePlacement.js
function getOppositePlacement(placement) {
	return placement.replace(/left|right|bottom|top/g, function(matched) {
		return hash$1[matched];
	});
}
var hash$1;
var init_getOppositePlacement = __esmMin((() => {
	hash$1 = {
		left: "right",
		right: "left",
		bottom: "top",
		top: "bottom"
	};
}));
//#endregion
//#region node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js
function getOppositeVariationPlacement(placement) {
	return placement.replace(/start|end/g, function(matched) {
		return hash[matched];
	});
}
var hash;
var init_getOppositeVariationPlacement = __esmMin((() => {
	hash = {
		start: "end",
		end: "start"
	};
}));
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js
function getWindowScroll(node) {
	var win = getWindow(node);
	return {
		scrollLeft: win.pageXOffset,
		scrollTop: win.pageYOffset
	};
}
var init_getWindowScroll = __esmMin((() => {
	init_getWindow();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js
function getWindowScrollBarX(element) {
	return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}
var init_getWindowScrollBarX = __esmMin((() => {
	init_getBoundingClientRect();
	init_getDocumentElement();
	init_getWindowScroll();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js
function getViewportRect(element, strategy) {
	var win = getWindow(element);
	var html = getDocumentElement(element);
	var visualViewport = win.visualViewport;
	var width = html.clientWidth;
	var height = html.clientHeight;
	var x = 0;
	var y = 0;
	if (visualViewport) {
		width = visualViewport.width;
		height = visualViewport.height;
		var layoutViewport = isLayoutViewport();
		if (layoutViewport || !layoutViewport && strategy === "fixed") {
			x = visualViewport.offsetLeft;
			y = visualViewport.offsetTop;
		}
	}
	return {
		width,
		height,
		x: x + getWindowScrollBarX(element),
		y
	};
}
var init_getViewportRect = __esmMin((() => {
	init_getWindow();
	init_getDocumentElement();
	init_getWindowScrollBarX();
	init_isLayoutViewport();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js
function getDocumentRect(element) {
	var _element$ownerDocumen;
	var html = getDocumentElement(element);
	var winScroll = getWindowScroll(element);
	var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
	var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
	var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
	var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
	var y = -winScroll.scrollTop;
	if (getComputedStyle$1(body || html).direction === "rtl") x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
	return {
		width,
		height,
		x,
		y
	};
}
var init_getDocumentRect = __esmMin((() => {
	init_getDocumentElement();
	init_getComputedStyle();
	init_getWindowScrollBarX();
	init_getWindowScroll();
	init_math();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js
function isScrollParent(element) {
	var _getComputedStyle = getComputedStyle$1(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
	return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
var init_isScrollParent = __esmMin((() => {
	init_getComputedStyle();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js
function getScrollParent(node) {
	if ([
		"html",
		"body",
		"#document"
	].indexOf(getNodeName(node)) >= 0) return node.ownerDocument.body;
	if (isHTMLElement(node) && isScrollParent(node)) return node;
	return getScrollParent(getParentNode(node));
}
var init_getScrollParent = __esmMin((() => {
	init_getParentNode();
	init_isScrollParent();
	init_getNodeName();
	init_instanceOf();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js
function listScrollParents(element, list) {
	var _element$ownerDocumen;
	if (list === void 0) list = [];
	var scrollParent = getScrollParent(element);
	var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
	var win = getWindow(scrollParent);
	var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
	var updatedList = list.concat(target);
	return isBody ? updatedList : updatedList.concat(listScrollParents(getParentNode(target)));
}
var init_listScrollParents = __esmMin((() => {
	init_getScrollParent();
	init_getParentNode();
	init_getWindow();
	init_isScrollParent();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/utils/rectToClientRect.js
function rectToClientRect(rect) {
	return Object.assign({}, rect, {
		left: rect.x,
		top: rect.y,
		right: rect.x + rect.width,
		bottom: rect.y + rect.height
	});
}
var init_rectToClientRect = __esmMin((() => {}));
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js
function getInnerBoundingClientRect(element, strategy) {
	var rect = getBoundingClientRect(element, false, strategy === "fixed");
	rect.top = rect.top + element.clientTop;
	rect.left = rect.left + element.clientLeft;
	rect.bottom = rect.top + element.clientHeight;
	rect.right = rect.left + element.clientWidth;
	rect.width = element.clientWidth;
	rect.height = element.clientHeight;
	rect.x = rect.left;
	rect.y = rect.top;
	return rect;
}
function getClientRectFromMixedType(element, clippingParent, strategy) {
	return clippingParent === "viewport" ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
}
function getClippingParents(element) {
	var clippingParents = listScrollParents(getParentNode(element));
	var clipperElement = ["absolute", "fixed"].indexOf(getComputedStyle$1(element).position) >= 0 && isHTMLElement(element) ? getOffsetParent(element) : element;
	if (!isElement(clipperElement)) return [];
	return clippingParents.filter(function(clippingParent) {
		return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
	});
}
function getClippingRect(element, boundary, rootBoundary, strategy) {
	var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
	var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
	var firstClippingParent = clippingParents[0];
	var clippingRect = clippingParents.reduce(function(accRect, clippingParent) {
		var rect = getClientRectFromMixedType(element, clippingParent, strategy);
		accRect.top = max(rect.top, accRect.top);
		accRect.right = min(rect.right, accRect.right);
		accRect.bottom = min(rect.bottom, accRect.bottom);
		accRect.left = max(rect.left, accRect.left);
		return accRect;
	}, getClientRectFromMixedType(element, firstClippingParent, strategy));
	clippingRect.width = clippingRect.right - clippingRect.left;
	clippingRect.height = clippingRect.bottom - clippingRect.top;
	clippingRect.x = clippingRect.left;
	clippingRect.y = clippingRect.top;
	return clippingRect;
}
var init_getClippingRect = __esmMin((() => {
	init_enums();
	init_getViewportRect();
	init_getDocumentRect();
	init_listScrollParents();
	init_getOffsetParent();
	init_getDocumentElement();
	init_getComputedStyle();
	init_instanceOf();
	init_getBoundingClientRect();
	init_getParentNode();
	init_contains();
	init_getNodeName();
	init_rectToClientRect();
	init_math();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/utils/computeOffsets.js
function computeOffsets(_ref) {
	var reference = _ref.reference, element = _ref.element, placement = _ref.placement;
	var basePlacement = placement ? getBasePlacement(placement) : null;
	var variation = placement ? getVariation(placement) : null;
	var commonX = reference.x + reference.width / 2 - element.width / 2;
	var commonY = reference.y + reference.height / 2 - element.height / 2;
	var offsets;
	switch (basePlacement) {
		case "top":
			offsets = {
				x: commonX,
				y: reference.y - element.height
			};
			break;
		case bottom:
			offsets = {
				x: commonX,
				y: reference.y + reference.height
			};
			break;
		case right:
			offsets = {
				x: reference.x + reference.width,
				y: commonY
			};
			break;
		case left:
			offsets = {
				x: reference.x - element.width,
				y: commonY
			};
			break;
		default: offsets = {
			x: reference.x,
			y: reference.y
		};
	}
	var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
	if (mainAxis != null) {
		var len = mainAxis === "y" ? "height" : "width";
		switch (variation) {
			case start:
				offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
				break;
			case "end":
				offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
				break;
			default:
		}
	}
	return offsets;
}
var init_computeOffsets = __esmMin((() => {
	init_getBasePlacement();
	init_getVariation();
	init_getMainAxisFromPlacement();
	init_enums();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/utils/detectOverflow.js
function detectOverflow(state, options) {
	if (options === void 0) options = {};
	var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
	var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
	var altContext = elementContext === "popper" ? reference : popper;
	var popperRect = state.rects.popper;
	var element = state.elements[altBoundary ? altContext : elementContext];
	var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
	var referenceClientRect = getBoundingClientRect(state.elements.reference);
	var popperOffsets = computeOffsets({
		reference: referenceClientRect,
		element: popperRect,
		strategy: "absolute",
		placement
	});
	var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
	var elementClientRect = elementContext === "popper" ? popperClientRect : referenceClientRect;
	var overflowOffsets = {
		top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
		bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
		left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
		right: elementClientRect.right - clippingClientRect.right + paddingObject.right
	};
	var offsetData = state.modifiersData.offset;
	if (elementContext === "popper" && offsetData) {
		var offset = offsetData[placement];
		Object.keys(overflowOffsets).forEach(function(key) {
			var multiply = ["right", "bottom"].indexOf(key) >= 0 ? 1 : -1;
			var axis = ["top", "bottom"].indexOf(key) >= 0 ? "y" : "x";
			overflowOffsets[key] += offset[axis] * multiply;
		});
	}
	return overflowOffsets;
}
var init_detectOverflow = __esmMin((() => {
	init_getClippingRect();
	init_getDocumentElement();
	init_getBoundingClientRect();
	init_computeOffsets();
	init_rectToClientRect();
	init_enums();
	init_instanceOf();
	init_mergePaddingObject();
	init_expandToHashMap();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js
function computeAutoPlacement(state, options) {
	if (options === void 0) options = {};
	var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
	var variation = getVariation(placement);
	var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement) {
		return getVariation(placement) === variation;
	}) : basePlacements;
	var allowedPlacements = placements$1.filter(function(placement) {
		return allowedAutoPlacements.indexOf(placement) >= 0;
	});
	if (allowedPlacements.length === 0) allowedPlacements = placements$1;
	var overflows = allowedPlacements.reduce(function(acc, placement) {
		acc[placement] = detectOverflow(state, {
			placement,
			boundary,
			rootBoundary,
			padding
		})[getBasePlacement(placement)];
		return acc;
	}, {});
	return Object.keys(overflows).sort(function(a, b) {
		return overflows[a] - overflows[b];
	});
}
var init_computeAutoPlacement = __esmMin((() => {
	init_getVariation();
	init_enums();
	init_detectOverflow();
	init_getBasePlacement();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/flip.js
function getExpandedFallbackPlacements(placement) {
	if (getBasePlacement(placement) === "auto") return [];
	var oppositePlacement = getOppositePlacement(placement);
	return [
		getOppositeVariationPlacement(placement),
		oppositePlacement,
		getOppositeVariationPlacement(oppositePlacement)
	];
}
function flip(_ref) {
	var state = _ref.state, options = _ref.options, name = _ref.name;
	if (state.modifiersData[name]._skip) return;
	var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
	var preferredPlacement = state.options.placement;
	var isBasePlacement = getBasePlacement(preferredPlacement) === preferredPlacement;
	var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
	var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement) {
		return acc.concat(getBasePlacement(placement) === "auto" ? computeAutoPlacement(state, {
			placement,
			boundary,
			rootBoundary,
			padding,
			flipVariations,
			allowedAutoPlacements
		}) : placement);
	}, []);
	var referenceRect = state.rects.reference;
	var popperRect = state.rects.popper;
	var checksMap = /* @__PURE__ */ new Map();
	var makeFallbackChecks = true;
	var firstFittingPlacement = placements[0];
	for (var i = 0; i < placements.length; i++) {
		var placement = placements[i];
		var _basePlacement = getBasePlacement(placement);
		var isStartVariation = getVariation(placement) === start;
		var isVertical = ["top", bottom].indexOf(_basePlacement) >= 0;
		var len = isVertical ? "width" : "height";
		var overflow = detectOverflow(state, {
			placement,
			boundary,
			rootBoundary,
			altBoundary,
			padding
		});
		var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : "top";
		if (referenceRect[len] > popperRect[len]) mainVariationSide = getOppositePlacement(mainVariationSide);
		var altVariationSide = getOppositePlacement(mainVariationSide);
		var checks = [];
		if (checkMainAxis) checks.push(overflow[_basePlacement] <= 0);
		if (checkAltAxis) checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
		if (checks.every(function(check) {
			return check;
		})) {
			firstFittingPlacement = placement;
			makeFallbackChecks = false;
			break;
		}
		checksMap.set(placement, checks);
	}
	if (makeFallbackChecks) {
		var numberOfChecks = flipVariations ? 3 : 1;
		var _loop = function _loop(_i) {
			var fittingPlacement = placements.find(function(placement) {
				var checks = checksMap.get(placement);
				if (checks) return checks.slice(0, _i).every(function(check) {
					return check;
				});
			});
			if (fittingPlacement) {
				firstFittingPlacement = fittingPlacement;
				return "break";
			}
		};
		for (var _i = numberOfChecks; _i > 0; _i--) if (_loop(_i) === "break") break;
	}
	if (state.placement !== firstFittingPlacement) {
		state.modifiersData[name]._skip = true;
		state.placement = firstFittingPlacement;
		state.reset = true;
	}
}
var flip_default;
var init_flip = __esmMin((() => {
	init_getOppositePlacement();
	init_getBasePlacement();
	init_getOppositeVariationPlacement();
	init_detectOverflow();
	init_computeAutoPlacement();
	init_enums();
	init_getVariation();
	flip_default = {
		name: "flip",
		enabled: true,
		phase: "main",
		fn: flip,
		requiresIfExists: ["offset"],
		data: { _skip: false }
	};
}));
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/hide.js
function getSideOffsets(overflow, rect, preventedOffsets) {
	if (preventedOffsets === void 0) preventedOffsets = {
		x: 0,
		y: 0
	};
	return {
		top: overflow.top - rect.height - preventedOffsets.y,
		right: overflow.right - rect.width + preventedOffsets.x,
		bottom: overflow.bottom - rect.height + preventedOffsets.y,
		left: overflow.left - rect.width - preventedOffsets.x
	};
}
function isAnySideFullyClipped(overflow) {
	return [
		"top",
		right,
		bottom,
		left
	].some(function(side) {
		return overflow[side] >= 0;
	});
}
function hide(_ref) {
	var state = _ref.state, name = _ref.name;
	var referenceRect = state.rects.reference;
	var popperRect = state.rects.popper;
	var preventedOffsets = state.modifiersData.preventOverflow;
	var referenceOverflow = detectOverflow(state, { elementContext: "reference" });
	var popperAltOverflow = detectOverflow(state, { altBoundary: true });
	var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
	var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
	var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
	var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
	state.modifiersData[name] = {
		referenceClippingOffsets,
		popperEscapeOffsets,
		isReferenceHidden,
		hasPopperEscaped
	};
	state.attributes.popper = Object.assign({}, state.attributes.popper, {
		"data-popper-reference-hidden": isReferenceHidden,
		"data-popper-escaped": hasPopperEscaped
	});
}
var hide_default;
var init_hide = __esmMin((() => {
	init_enums();
	init_detectOverflow();
	hide_default = {
		name: "hide",
		enabled: true,
		phase: "main",
		requiresIfExists: ["preventOverflow"],
		fn: hide
	};
}));
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/offset.js
function distanceAndSkiddingToXY(placement, rects, offset) {
	var basePlacement = getBasePlacement(placement);
	var invertDistance = ["left", "top"].indexOf(basePlacement) >= 0 ? -1 : 1;
	var _ref = typeof offset === "function" ? offset(Object.assign({}, rects, { placement })) : offset, skidding = _ref[0], distance = _ref[1];
	skidding = skidding || 0;
	distance = (distance || 0) * invertDistance;
	return ["left", "right"].indexOf(basePlacement) >= 0 ? {
		x: distance,
		y: skidding
	} : {
		x: skidding,
		y: distance
	};
}
function offset(_ref2) {
	var state = _ref2.state, options = _ref2.options, name = _ref2.name;
	var _options$offset = options.offset, offset = _options$offset === void 0 ? [0, 0] : _options$offset;
	var data = placements.reduce(function(acc, placement) {
		acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
		return acc;
	}, {});
	var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
	if (state.modifiersData.popperOffsets != null) {
		state.modifiersData.popperOffsets.x += x;
		state.modifiersData.popperOffsets.y += y;
	}
	state.modifiersData[name] = data;
}
var offset_default;
var init_offset = __esmMin((() => {
	init_getBasePlacement();
	init_enums();
	offset_default = {
		name: "offset",
		enabled: true,
		phase: "main",
		requires: ["popperOffsets"],
		fn: offset
	};
}));
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/popperOffsets.js
function popperOffsets(_ref) {
	var state = _ref.state, name = _ref.name;
	state.modifiersData[name] = computeOffsets({
		reference: state.rects.reference,
		element: state.rects.popper,
		strategy: "absolute",
		placement: state.placement
	});
}
var popperOffsets_default;
var init_popperOffsets = __esmMin((() => {
	init_computeOffsets();
	popperOffsets_default = {
		name: "popperOffsets",
		enabled: true,
		phase: "read",
		fn: popperOffsets,
		data: {}
	};
}));
//#endregion
//#region node_modules/@popperjs/core/lib/utils/getAltAxis.js
function getAltAxis(axis) {
	return axis === "x" ? "y" : "x";
}
var init_getAltAxis = __esmMin((() => {}));
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/preventOverflow.js
function preventOverflow(_ref) {
	var state = _ref.state, options = _ref.options, name = _ref.name;
	var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
	var overflow = detectOverflow(state, {
		boundary,
		rootBoundary,
		padding,
		altBoundary
	});
	var basePlacement = getBasePlacement(state.placement);
	var variation = getVariation(state.placement);
	var isBasePlacement = !variation;
	var mainAxis = getMainAxisFromPlacement(basePlacement);
	var altAxis = getAltAxis(mainAxis);
	var popperOffsets = state.modifiersData.popperOffsets;
	var referenceRect = state.rects.reference;
	var popperRect = state.rects.popper;
	var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, { placement: state.placement })) : tetherOffset;
	var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
		mainAxis: tetherOffsetValue,
		altAxis: tetherOffsetValue
	} : Object.assign({
		mainAxis: 0,
		altAxis: 0
	}, tetherOffsetValue);
	var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
	var data = {
		x: 0,
		y: 0
	};
	if (!popperOffsets) return;
	if (checkMainAxis) {
		var _offsetModifierState$;
		var mainSide = mainAxis === "y" ? "top" : left;
		var altSide = mainAxis === "y" ? bottom : right;
		var len = mainAxis === "y" ? "height" : "width";
		var offset = popperOffsets[mainAxis];
		var min$1 = offset + overflow[mainSide];
		var max$1 = offset - overflow[altSide];
		var additive = tether ? -popperRect[len] / 2 : 0;
		var minLen = variation === "start" ? referenceRect[len] : popperRect[len];
		var maxLen = variation === "start" ? -popperRect[len] : -referenceRect[len];
		var arrowElement = state.elements.arrow;
		var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
			width: 0,
			height: 0
		};
		var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
		var arrowPaddingMin = arrowPaddingObject[mainSide];
		var arrowPaddingMax = arrowPaddingObject[altSide];
		var arrowLen = within(0, referenceRect[len], arrowRect[len]);
		var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
		var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
		var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
		var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
		var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
		var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
		var tetherMax = offset + maxOffset - offsetModifierValue;
		var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
		popperOffsets[mainAxis] = preventedOffset;
		data[mainAxis] = preventedOffset - offset;
	}
	if (checkAltAxis) {
		var _offsetModifierState$2;
		var _mainSide = mainAxis === "x" ? "top" : left;
		var _altSide = mainAxis === "x" ? bottom : right;
		var _offset = popperOffsets[altAxis];
		var _len = altAxis === "y" ? "height" : "width";
		var _min = _offset + overflow[_mainSide];
		var _max = _offset - overflow[_altSide];
		var isOriginSide = ["top", left].indexOf(basePlacement) !== -1;
		var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
		var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
		var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
		var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
		popperOffsets[altAxis] = _preventedOffset;
		data[altAxis] = _preventedOffset - _offset;
	}
	state.modifiersData[name] = data;
}
var preventOverflow_default;
var init_preventOverflow = __esmMin((() => {
	init_enums();
	init_getBasePlacement();
	init_getMainAxisFromPlacement();
	init_getAltAxis();
	init_within();
	init_getLayoutRect();
	init_getOffsetParent();
	init_detectOverflow();
	init_getVariation();
	init_getFreshSideObject();
	init_math();
	preventOverflow_default = {
		name: "preventOverflow",
		enabled: true,
		phase: "main",
		fn: preventOverflow,
		requiresIfExists: ["offset"]
	};
}));
//#endregion
//#region node_modules/@popperjs/core/lib/modifiers/index.js
var init_modifiers = __esmMin((() => {
	init_applyStyles();
	init_arrow();
	init_computeStyles();
	init_eventListeners();
	init_flip();
	init_hide();
	init_offset();
	init_popperOffsets();
	init_preventOverflow();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js
function getHTMLElementScroll(element) {
	return {
		scrollLeft: element.scrollLeft,
		scrollTop: element.scrollTop
	};
}
var init_getHTMLElementScroll = __esmMin((() => {}));
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js
function getNodeScroll(node) {
	if (node === getWindow(node) || !isHTMLElement(node)) return getWindowScroll(node);
	else return getHTMLElementScroll(node);
}
var init_getNodeScroll = __esmMin((() => {
	init_getWindowScroll();
	init_getWindow();
	init_instanceOf();
	init_getHTMLElementScroll();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js
function isElementScaled(element) {
	var rect = element.getBoundingClientRect();
	var scaleX = round(rect.width) / element.offsetWidth || 1;
	var scaleY = round(rect.height) / element.offsetHeight || 1;
	return scaleX !== 1 || scaleY !== 1;
}
function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
	if (isFixed === void 0) isFixed = false;
	var isOffsetParentAnElement = isHTMLElement(offsetParent);
	var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
	var documentElement = getDocumentElement(offsetParent);
	var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
	var scroll = {
		scrollLeft: 0,
		scrollTop: 0
	};
	var offsets = {
		x: 0,
		y: 0
	};
	if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
		if (getNodeName(offsetParent) !== "body" || isScrollParent(documentElement)) scroll = getNodeScroll(offsetParent);
		if (isHTMLElement(offsetParent)) {
			offsets = getBoundingClientRect(offsetParent, true);
			offsets.x += offsetParent.clientLeft;
			offsets.y += offsetParent.clientTop;
		} else if (documentElement) offsets.x = getWindowScrollBarX(documentElement);
	}
	return {
		x: rect.left + scroll.scrollLeft - offsets.x,
		y: rect.top + scroll.scrollTop - offsets.y,
		width: rect.width,
		height: rect.height
	};
}
var init_getCompositeRect = __esmMin((() => {
	init_getBoundingClientRect();
	init_getNodeScroll();
	init_getNodeName();
	init_instanceOf();
	init_getWindowScrollBarX();
	init_getDocumentElement();
	init_isScrollParent();
	init_math();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/utils/orderModifiers.js
function order(modifiers) {
	var map = /* @__PURE__ */ new Map();
	var visited = /* @__PURE__ */ new Set();
	var result = [];
	modifiers.forEach(function(modifier) {
		map.set(modifier.name, modifier);
	});
	function sort(modifier) {
		visited.add(modifier.name);
		[].concat(modifier.requires || [], modifier.requiresIfExists || []).forEach(function(dep) {
			if (!visited.has(dep)) {
				var depModifier = map.get(dep);
				if (depModifier) sort(depModifier);
			}
		});
		result.push(modifier);
	}
	modifiers.forEach(function(modifier) {
		if (!visited.has(modifier.name)) sort(modifier);
	});
	return result;
}
function orderModifiers(modifiers) {
	var orderedModifiers = order(modifiers);
	return modifierPhases.reduce(function(acc, phase) {
		return acc.concat(orderedModifiers.filter(function(modifier) {
			return modifier.phase === phase;
		}));
	}, []);
}
var init_orderModifiers = __esmMin((() => {
	init_enums();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/utils/debounce.js
function debounce(fn) {
	var pending;
	return function() {
		if (!pending) pending = new Promise(function(resolve) {
			Promise.resolve().then(function() {
				pending = void 0;
				resolve(fn());
			});
		});
		return pending;
	};
}
var init_debounce = __esmMin((() => {}));
//#endregion
//#region node_modules/@popperjs/core/lib/utils/mergeByName.js
function mergeByName(modifiers) {
	var merged = modifiers.reduce(function(merged, current) {
		var existing = merged[current.name];
		merged[current.name] = existing ? Object.assign({}, existing, current, {
			options: Object.assign({}, existing.options, current.options),
			data: Object.assign({}, existing.data, current.data)
		}) : current;
		return merged;
	}, {});
	return Object.keys(merged).map(function(key) {
		return merged[key];
	});
}
var init_mergeByName = __esmMin((() => {}));
//#endregion
//#region node_modules/@popperjs/core/lib/createPopper.js
function areValidElements() {
	for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
	return !args.some(function(element) {
		return !(element && typeof element.getBoundingClientRect === "function");
	});
}
function popperGenerator(generatorOptions) {
	if (generatorOptions === void 0) generatorOptions = {};
	var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
	return function createPopper(reference, popper, options) {
		if (options === void 0) options = defaultOptions;
		var state = {
			placement: "bottom",
			orderedModifiers: [],
			options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
			modifiersData: {},
			elements: {
				reference,
				popper
			},
			attributes: {},
			styles: {}
		};
		var effectCleanupFns = [];
		var isDestroyed = false;
		var instance = {
			state,
			setOptions: function setOptions(setOptionsAction) {
				var options = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
				cleanupModifierEffects();
				state.options = Object.assign({}, defaultOptions, state.options, options);
				state.scrollParents = {
					reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
					popper: listScrollParents(popper)
				};
				var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers)));
				state.orderedModifiers = orderedModifiers.filter(function(m) {
					return m.enabled;
				});
				runModifierEffects();
				return instance.update();
			},
			forceUpdate: function forceUpdate() {
				if (isDestroyed) return;
				var _state$elements = state.elements, reference = _state$elements.reference, popper = _state$elements.popper;
				if (!areValidElements(reference, popper)) return;
				state.rects = {
					reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === "fixed"),
					popper: getLayoutRect(popper)
				};
				state.reset = false;
				state.placement = state.options.placement;
				state.orderedModifiers.forEach(function(modifier) {
					return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
				});
				for (var index = 0; index < state.orderedModifiers.length; index++) {
					if (state.reset === true) {
						state.reset = false;
						index = -1;
						continue;
					}
					var _state$orderedModifie = state.orderedModifiers[index], fn = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
					if (typeof fn === "function") state = fn({
						state,
						options: _options,
						name,
						instance
					}) || state;
				}
			},
			update: debounce(function() {
				return new Promise(function(resolve) {
					instance.forceUpdate();
					resolve(state);
				});
			}),
			destroy: function destroy() {
				cleanupModifierEffects();
				isDestroyed = true;
			}
		};
		if (!areValidElements(reference, popper)) return instance;
		instance.setOptions(options).then(function(state) {
			if (!isDestroyed && options.onFirstUpdate) options.onFirstUpdate(state);
		});
		function runModifierEffects() {
			state.orderedModifiers.forEach(function(_ref) {
				var name = _ref.name, _ref$options = _ref.options, options = _ref$options === void 0 ? {} : _ref$options, effect = _ref.effect;
				if (typeof effect === "function") {
					var cleanupFn = effect({
						state,
						name,
						instance,
						options
					});
					effectCleanupFns.push(cleanupFn || function noopFn() {});
				}
			});
		}
		function cleanupModifierEffects() {
			effectCleanupFns.forEach(function(fn) {
				return fn();
			});
			effectCleanupFns = [];
		}
		return instance;
	};
}
var DEFAULT_OPTIONS, createPopper$2;
var init_createPopper = __esmMin((() => {
	init_getCompositeRect();
	init_getLayoutRect();
	init_listScrollParents();
	init_getOffsetParent();
	init_orderModifiers();
	init_debounce();
	init_mergeByName();
	init_detectOverflow();
	init_instanceOf();
	DEFAULT_OPTIONS = {
		placement: "bottom",
		modifiers: [],
		strategy: "absolute"
	};
	createPopper$2 = /*#__PURE__*/ popperGenerator();
}));
//#endregion
//#region node_modules/@popperjs/core/lib/popper-lite.js
var defaultModifiers$1, createPopper$1;
var init_popper_lite = __esmMin((() => {
	init_createPopper();
	init_eventListeners();
	init_popperOffsets();
	init_computeStyles();
	init_applyStyles();
	defaultModifiers$1 = [
		eventListeners_default,
		popperOffsets_default,
		computeStyles_default,
		applyStyles_default
	];
	createPopper$1 = /*#__PURE__*/ popperGenerator({ defaultModifiers: defaultModifiers$1 });
}));
//#endregion
//#region node_modules/@popperjs/core/lib/popper.js
var defaultModifiers, createPopper;
var init_popper = __esmMin((() => {
	init_createPopper();
	init_eventListeners();
	init_popperOffsets();
	init_computeStyles();
	init_applyStyles();
	init_offset();
	init_flip();
	init_preventOverflow();
	init_arrow();
	init_hide();
	init_popper_lite();
	init_modifiers();
	defaultModifiers = [
		eventListeners_default,
		popperOffsets_default,
		computeStyles_default,
		applyStyles_default,
		offset_default,
		flip_default,
		preventOverflow_default,
		arrow_default,
		hide_default
	];
	createPopper = /*#__PURE__*/ popperGenerator({ defaultModifiers });
}));
//#endregion
//#region node_modules/@popperjs/core/lib/index.js
var lib_exports = /* @__PURE__ */ __exportAll({
	afterMain: () => afterMain,
	afterRead: () => afterRead,
	afterWrite: () => afterWrite,
	applyStyles: () => applyStyles_default,
	arrow: () => arrow_default,
	auto: () => auto,
	basePlacements: () => basePlacements,
	beforeMain: () => beforeMain,
	beforeRead: () => beforeRead,
	beforeWrite: () => beforeWrite,
	bottom: () => bottom,
	clippingParents: () => clippingParents,
	computeStyles: () => computeStyles_default,
	createPopper: () => createPopper,
	createPopperBase: () => createPopper$2,
	createPopperLite: () => createPopper$1,
	detectOverflow: () => detectOverflow,
	end: () => "end",
	eventListeners: () => eventListeners_default,
	flip: () => flip_default,
	hide: () => hide_default,
	left: () => left,
	main: () => main,
	modifierPhases: () => modifierPhases,
	offset: () => offset_default,
	placements: () => placements,
	popper: () => popper,
	popperGenerator: () => popperGenerator,
	popperOffsets: () => popperOffsets_default,
	preventOverflow: () => preventOverflow_default,
	read: () => read,
	reference: () => reference,
	right: () => right,
	start: () => start,
	top: () => "top",
	variationPlacements: () => variationPlacements,
	viewport: () => viewport,
	write: () => write
});
var init_lib = __esmMin((() => {
	init_enums();
	init_modifiers();
	init_createPopper();
	init_popper();
	init_popper_lite();
}));
//#endregion
//#region node_modules/bootstrap/js/dist/dropdown.js
var require_dropdown = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap dropdown.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory((init_lib(), __toCommonJS(lib_exports)), require_base_component(), require_event_handler(), require_manipulator(), require_selector_engine(), require_util()) : typeof define === "function" && define.amd ? define([
			"@popperjs/core",
			"./base-component",
			"./dom/event-handler",
			"./dom/manipulator",
			"./dom/selector-engine",
			"./util/index"
		], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Dropdown = factory(global["@popperjs/core"], global.BaseComponent, global.EventHandler, global.Manipulator, global.SelectorEngine, global.Index));
	})(exports, (function(Popper, BaseComponent, EventHandler, Manipulator, SelectorEngine, index_js) {
		"use strict";
		function _interopNamespaceDefault(e) {
			const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
			if (e) {
				for (const k in e) if (k !== "default") {
					const d = Object.getOwnPropertyDescriptor(e, k);
					Object.defineProperty(n, k, d.get ? d : {
						enumerable: true,
						get: () => e[k]
					});
				}
			}
			n.default = e;
			return Object.freeze(n);
		}
		const Popper__namespace = /*#__PURE__*/ _interopNamespaceDefault(Popper);
		/**
		* --------------------------------------------------------------------------
		* Bootstrap dropdown.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		/**
		* Constants
		*/
		const NAME = "dropdown";
		const EVENT_KEY = `.bs.dropdown`;
		const DATA_API_KEY = ".data-api";
		const ESCAPE_KEY = "Escape";
		const TAB_KEY = "Tab";
		const ARROW_UP_KEY = "ArrowUp";
		const ARROW_DOWN_KEY = "ArrowDown";
		const RIGHT_MOUSE_BUTTON = 2;
		const EVENT_HIDE = `hide${EVENT_KEY}`;
		const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
		const EVENT_SHOW = `show${EVENT_KEY}`;
		const EVENT_SHOWN = `shown${EVENT_KEY}`;
		const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
		const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY}${DATA_API_KEY}`;
		const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY}${DATA_API_KEY}`;
		const CLASS_NAME_SHOW = "show";
		const CLASS_NAME_DROPUP = "dropup";
		const CLASS_NAME_DROPEND = "dropend";
		const CLASS_NAME_DROPSTART = "dropstart";
		const CLASS_NAME_DROPUP_CENTER = "dropup-center";
		const CLASS_NAME_DROPDOWN_CENTER = "dropdown-center";
		const SELECTOR_DATA_TOGGLE = "[data-bs-toggle=\"dropdown\"]:not(.disabled):not(:disabled)";
		const SELECTOR_DATA_TOGGLE_SHOWN = `${SELECTOR_DATA_TOGGLE}.${CLASS_NAME_SHOW}`;
		const SELECTOR_MENU = ".dropdown-menu";
		const SELECTOR_NAVBAR = ".navbar";
		const SELECTOR_NAVBAR_NAV = ".navbar-nav";
		const SELECTOR_VISIBLE_ITEMS = ".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)";
		const PLACEMENT_TOP = index_js.isRTL() ? "top-end" : "top-start";
		const PLACEMENT_TOPEND = index_js.isRTL() ? "top-start" : "top-end";
		const PLACEMENT_BOTTOM = index_js.isRTL() ? "bottom-end" : "bottom-start";
		const PLACEMENT_BOTTOMEND = index_js.isRTL() ? "bottom-start" : "bottom-end";
		const PLACEMENT_RIGHT = index_js.isRTL() ? "left-start" : "right-start";
		const PLACEMENT_LEFT = index_js.isRTL() ? "right-start" : "left-start";
		const PLACEMENT_TOPCENTER = "top";
		const PLACEMENT_BOTTOMCENTER = "bottom";
		const Default = {
			autoClose: true,
			boundary: "clippingParents",
			display: "dynamic",
			offset: [0, 2],
			popperConfig: null,
			reference: "toggle"
		};
		const DefaultType = {
			autoClose: "(boolean|string)",
			boundary: "(string|element)",
			display: "string",
			offset: "(array|string|function)",
			popperConfig: "(null|object|function)",
			reference: "(string|element|object)"
		};
		/**
		* Class definition
		*/
		class Dropdown extends BaseComponent {
			constructor(element, config) {
				super(element, config);
				this._popper = null;
				this._parent = this._element.parentNode;
				this._menu = SelectorEngine.next(this._element, SELECTOR_MENU)[0] || SelectorEngine.prev(this._element, SELECTOR_MENU)[0] || SelectorEngine.findOne(SELECTOR_MENU, this._parent);
				this._inNavbar = this._detectNavbar();
			}
			static get Default() {
				return Default;
			}
			static get DefaultType() {
				return DefaultType;
			}
			static get NAME() {
				return NAME;
			}
			toggle() {
				return this._isShown() ? this.hide() : this.show();
			}
			show() {
				if (index_js.isDisabled(this._element) || this._isShown()) return;
				const relatedTarget = { relatedTarget: this._element };
				if (EventHandler.trigger(this._element, EVENT_SHOW, relatedTarget).defaultPrevented) return;
				this._createPopper();
				if ("ontouchstart" in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV)) for (const element of [].concat(...document.body.children)) EventHandler.on(element, "mouseover", index_js.noop);
				this._element.focus();
				this._element.setAttribute("aria-expanded", true);
				this._menu.classList.add(CLASS_NAME_SHOW);
				this._element.classList.add(CLASS_NAME_SHOW);
				EventHandler.trigger(this._element, EVENT_SHOWN, relatedTarget);
			}
			hide() {
				if (index_js.isDisabled(this._element) || !this._isShown()) return;
				const relatedTarget = { relatedTarget: this._element };
				this._completeHide(relatedTarget);
			}
			dispose() {
				if (this._popper) this._popper.destroy();
				super.dispose();
			}
			update() {
				this._inNavbar = this._detectNavbar();
				if (this._popper) this._popper.update();
			}
			_completeHide(relatedTarget) {
				if (EventHandler.trigger(this._element, EVENT_HIDE, relatedTarget).defaultPrevented) return;
				if ("ontouchstart" in document.documentElement) for (const element of [].concat(...document.body.children)) EventHandler.off(element, "mouseover", index_js.noop);
				if (this._popper) this._popper.destroy();
				this._menu.classList.remove(CLASS_NAME_SHOW);
				this._element.classList.remove(CLASS_NAME_SHOW);
				this._element.setAttribute("aria-expanded", "false");
				Manipulator.removeDataAttribute(this._menu, "popper");
				EventHandler.trigger(this._element, EVENT_HIDDEN, relatedTarget);
			}
			_getConfig(config) {
				config = super._getConfig(config);
				if (typeof config.reference === "object" && !index_js.isElement(config.reference) && typeof config.reference.getBoundingClientRect !== "function") throw new TypeError(`${NAME.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
				return config;
			}
			_createPopper() {
				if (typeof Popper__namespace === "undefined") throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org/docs/v2/)");
				let referenceElement = this._element;
				if (this._config.reference === "parent") referenceElement = this._parent;
				else if (index_js.isElement(this._config.reference)) referenceElement = index_js.getElement(this._config.reference);
				else if (typeof this._config.reference === "object") referenceElement = this._config.reference;
				const popperConfig = this._getPopperConfig();
				this._popper = Popper__namespace.createPopper(referenceElement, this._menu, popperConfig);
			}
			_isShown() {
				return this._menu.classList.contains(CLASS_NAME_SHOW);
			}
			_getPlacement() {
				const parentDropdown = this._parent;
				if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) return PLACEMENT_RIGHT;
				if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) return PLACEMENT_LEFT;
				if (parentDropdown.classList.contains(CLASS_NAME_DROPUP_CENTER)) return PLACEMENT_TOPCENTER;
				if (parentDropdown.classList.contains(CLASS_NAME_DROPDOWN_CENTER)) return PLACEMENT_BOTTOMCENTER;
				const isEnd = getComputedStyle(this._menu).getPropertyValue("--bs-position").trim() === "end";
				if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
				return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
			}
			_detectNavbar() {
				return this._element.closest(SELECTOR_NAVBAR) !== null;
			}
			_getOffset() {
				const { offset } = this._config;
				if (typeof offset === "string") return offset.split(",").map((value) => Number.parseInt(value, 10));
				if (typeof offset === "function") return (popperData) => offset(popperData, this._element);
				return offset;
			}
			_getPopperConfig() {
				const defaultBsPopperConfig = {
					placement: this._getPlacement(),
					modifiers: [{
						name: "preventOverflow",
						options: { boundary: this._config.boundary }
					}, {
						name: "offset",
						options: { offset: this._getOffset() }
					}]
				};
				if (this._inNavbar || this._config.display === "static") {
					Manipulator.setDataAttribute(this._menu, "popper", "static");
					defaultBsPopperConfig.modifiers = [{
						name: "applyStyles",
						enabled: false
					}];
				}
				return {
					...defaultBsPopperConfig,
					...index_js.execute(this._config.popperConfig, [void 0, defaultBsPopperConfig])
				};
			}
			_selectMenuItem({ key, target }) {
				const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter((element) => index_js.isVisible(element));
				if (!items.length) return;
				index_js.getNextActiveElement(items, target, key === ARROW_DOWN_KEY, !items.includes(target)).focus();
			}
			static jQueryInterface(config) {
				return this.each(function() {
					const data = Dropdown.getOrCreateInstance(this, config);
					if (typeof config !== "string") return;
					if (typeof data[config] === "undefined") throw new TypeError(`No method named "${config}"`);
					data[config]();
				});
			}
			static clearMenus(event) {
				if (event.button === RIGHT_MOUSE_BUTTON || event.type === "keyup" && event.key !== TAB_KEY) return;
				const openToggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE_SHOWN);
				for (const toggle of openToggles) {
					const context = Dropdown.getInstance(toggle);
					if (!context || context._config.autoClose === false) continue;
					const composedPath = event.composedPath();
					const isMenuTarget = composedPath.includes(context._menu);
					if (composedPath.includes(context._element) || context._config.autoClose === "inside" && !isMenuTarget || context._config.autoClose === "outside" && isMenuTarget) continue;
					if (context._menu.contains(event.target) && (event.type === "keyup" && event.key === TAB_KEY || /input|select|option|textarea|form/i.test(event.target.tagName))) continue;
					const relatedTarget = { relatedTarget: context._element };
					if (event.type === "click") relatedTarget.clickEvent = event;
					context._completeHide(relatedTarget);
				}
			}
			static dataApiKeydownHandler(event) {
				const isInput = /input|textarea/i.test(event.target.tagName);
				const isEscapeEvent = event.key === ESCAPE_KEY;
				const isUpOrDownEvent = [ARROW_UP_KEY, ARROW_DOWN_KEY].includes(event.key);
				if (!isUpOrDownEvent && !isEscapeEvent) return;
				if (isInput && !isEscapeEvent) return;
				event.preventDefault();
				const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE)[0] || SelectorEngine.next(this, SELECTOR_DATA_TOGGLE)[0] || SelectorEngine.findOne(SELECTOR_DATA_TOGGLE, event.delegateTarget.parentNode);
				const instance = Dropdown.getOrCreateInstance(getToggleButton);
				if (isUpOrDownEvent) {
					event.stopPropagation();
					instance.show();
					instance._selectMenuItem(event);
					return;
				}
				if (instance._isShown()) {
					event.stopPropagation();
					instance.hide();
					getToggleButton.focus();
				}
			}
		}
		/**
		* Data API implementation
		*/
		EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE, Dropdown.dataApiKeydownHandler);
		EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
		EventHandler.on(document, EVENT_CLICK_DATA_API, Dropdown.clearMenus);
		EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
		EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(event) {
			event.preventDefault();
			Dropdown.getOrCreateInstance(this).toggle();
		});
		/**
		* jQuery
		*/
		index_js.defineJQueryPlugin(Dropdown);
		return Dropdown;
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/util/backdrop.js
var require_backdrop = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap backdrop.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_event_handler(), require_config(), require_util()) : typeof define === "function" && define.amd ? define([
			"../dom/event-handler",
			"./config",
			"./index"
		], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Backdrop = factory(global.EventHandler, global.Config, global.Index));
	})(exports, (function(EventHandler, Config, index_js) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap util/backdrop.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		/**
		* Constants
		*/
		const NAME = "backdrop";
		const CLASS_NAME_FADE = "fade";
		const CLASS_NAME_SHOW = "show";
		const EVENT_MOUSEDOWN = `mousedown.bs.${NAME}`;
		const Default = {
			className: "modal-backdrop",
			clickCallback: null,
			isAnimated: false,
			isVisible: true,
			rootElement: "body"
		};
		const DefaultType = {
			className: "string",
			clickCallback: "(function|null)",
			isAnimated: "boolean",
			isVisible: "boolean",
			rootElement: "(element|string)"
		};
		/**
		* Class definition
		*/
		class Backdrop extends Config {
			constructor(config) {
				super();
				this._config = this._getConfig(config);
				this._isAppended = false;
				this._element = null;
			}
			static get Default() {
				return Default;
			}
			static get DefaultType() {
				return DefaultType;
			}
			static get NAME() {
				return NAME;
			}
			show(callback) {
				if (!this._config.isVisible) {
					index_js.execute(callback);
					return;
				}
				this._append();
				const element = this._getElement();
				if (this._config.isAnimated) index_js.reflow(element);
				element.classList.add(CLASS_NAME_SHOW);
				this._emulateAnimation(() => {
					index_js.execute(callback);
				});
			}
			hide(callback) {
				if (!this._config.isVisible) {
					index_js.execute(callback);
					return;
				}
				this._getElement().classList.remove(CLASS_NAME_SHOW);
				this._emulateAnimation(() => {
					this.dispose();
					index_js.execute(callback);
				});
			}
			dispose() {
				if (!this._isAppended) return;
				EventHandler.off(this._element, EVENT_MOUSEDOWN);
				this._element.remove();
				this._isAppended = false;
			}
			_getElement() {
				if (!this._element) {
					const backdrop = document.createElement("div");
					backdrop.className = this._config.className;
					if (this._config.isAnimated) backdrop.classList.add(CLASS_NAME_FADE);
					this._element = backdrop;
				}
				return this._element;
			}
			_configAfterMerge(config) {
				config.rootElement = index_js.getElement(config.rootElement);
				return config;
			}
			_append() {
				if (this._isAppended) return;
				const element = this._getElement();
				this._config.rootElement.append(element);
				EventHandler.on(element, EVENT_MOUSEDOWN, () => {
					index_js.execute(this._config.clickCallback);
				});
				this._isAppended = true;
			}
			_emulateAnimation(callback) {
				index_js.executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
			}
		}
		return Backdrop;
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/util/component-functions.js
var require_component_functions = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap component-functions.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require_event_handler(), require_selector_engine(), require_util()) : typeof define === "function" && define.amd ? define([
			"exports",
			"../dom/event-handler",
			"../dom/selector-engine",
			"./index"
		], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.ComponentFunctions = {}, global.EventHandler, global.SelectorEngine, global.Index));
	})(exports, (function(exports$1, EventHandler, SelectorEngine, index_js) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap util/component-functions.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		const enableDismissTrigger = (component, method = "hide") => {
			const clickEvent = `click.dismiss${component.EVENT_KEY}`;
			const name = component.NAME;
			EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function(event) {
				if (["A", "AREA"].includes(this.tagName)) event.preventDefault();
				if (index_js.isDisabled(this)) return;
				const target = SelectorEngine.getElementFromSelector(this) || this.closest(`.${name}`);
				component.getOrCreateInstance(target)[method]();
			});
		};
		exports$1.enableDismissTrigger = enableDismissTrigger;
		Object.defineProperty(exports$1, Symbol.toStringTag, { value: "Module" });
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/util/focustrap.js
var require_focustrap = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap focustrap.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_event_handler(), require_selector_engine(), require_config()) : typeof define === "function" && define.amd ? define([
			"../dom/event-handler",
			"../dom/selector-engine",
			"./config"
		], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Focustrap = factory(global.EventHandler, global.SelectorEngine, global.Config));
	})(exports, (function(EventHandler, SelectorEngine, Config) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap util/focustrap.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		/**
		* Constants
		*/
		const NAME = "focustrap";
		const EVENT_KEY = `.bs.focustrap`;
		const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
		const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY}`;
		const TAB_KEY = "Tab";
		const TAB_NAV_FORWARD = "forward";
		const TAB_NAV_BACKWARD = "backward";
		const Default = {
			autofocus: true,
			trapElement: null
		};
		const DefaultType = {
			autofocus: "boolean",
			trapElement: "element"
		};
		/**
		* Class definition
		*/
		class FocusTrap extends Config {
			constructor(config) {
				super();
				this._config = this._getConfig(config);
				this._isActive = false;
				this._lastTabNavDirection = null;
			}
			static get Default() {
				return Default;
			}
			static get DefaultType() {
				return DefaultType;
			}
			static get NAME() {
				return NAME;
			}
			activate() {
				if (this._isActive) return;
				if (this._config.autofocus) this._config.trapElement.focus();
				EventHandler.off(document, EVENT_KEY);
				EventHandler.on(document, EVENT_FOCUSIN, (event) => this._handleFocusin(event));
				EventHandler.on(document, EVENT_KEYDOWN_TAB, (event) => this._handleKeydown(event));
				this._isActive = true;
			}
			deactivate() {
				if (!this._isActive) return;
				this._isActive = false;
				EventHandler.off(document, EVENT_KEY);
			}
			_handleFocusin(event) {
				const { trapElement } = this._config;
				if (event.target === document || event.target === trapElement || trapElement.contains(event.target)) return;
				const elements = SelectorEngine.focusableChildren(trapElement);
				if (elements.length === 0) trapElement.focus();
				else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) elements[elements.length - 1].focus();
				else elements[0].focus();
			}
			_handleKeydown(event) {
				if (event.key !== TAB_KEY) return;
				this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
			}
		}
		return FocusTrap;
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/util/scrollbar.js
var require_scrollbar = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap scrollbar.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_manipulator(), require_selector_engine(), require_util()) : typeof define === "function" && define.amd ? define([
			"../dom/manipulator",
			"../dom/selector-engine",
			"./index"
		], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Scrollbar = factory(global.Manipulator, global.SelectorEngine, global.Index));
	})(exports, (function(Manipulator, SelectorEngine, index_js) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap util/scrollBar.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		/**
		* Constants
		*/
		const SELECTOR_FIXED_CONTENT = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top";
		const SELECTOR_STICKY_CONTENT = ".sticky-top";
		const PROPERTY_PADDING = "padding-right";
		const PROPERTY_MARGIN = "margin-right";
		/**
		* Class definition
		*/
		class ScrollBarHelper {
			constructor() {
				this._element = document.body;
			}
			getWidth() {
				const documentWidth = document.documentElement.clientWidth;
				return Math.abs(window.innerWidth - documentWidth);
			}
			hide() {
				const width = this.getWidth();
				this._disableOverFlow();
				this._setElementAttributes(this._element, PROPERTY_PADDING, (calculatedValue) => calculatedValue + width);
				this._setElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING, (calculatedValue) => calculatedValue + width);
				this._setElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN, (calculatedValue) => calculatedValue - width);
			}
			reset() {
				this._resetElementAttributes(this._element, "overflow");
				this._resetElementAttributes(this._element, PROPERTY_PADDING);
				this._resetElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING);
				this._resetElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN);
			}
			isOverflowing() {
				return this.getWidth() > 0;
			}
			_disableOverFlow() {
				this._saveInitialAttribute(this._element, "overflow");
				this._element.style.overflow = "hidden";
			}
			_setElementAttributes(selector, styleProperty, callback) {
				const scrollbarWidth = this.getWidth();
				const manipulationCallBack = (element) => {
					if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) return;
					this._saveInitialAttribute(element, styleProperty);
					const calculatedValue = window.getComputedStyle(element).getPropertyValue(styleProperty);
					element.style.setProperty(styleProperty, `${callback(Number.parseFloat(calculatedValue))}px`);
				};
				this._applyManipulationCallback(selector, manipulationCallBack);
			}
			_saveInitialAttribute(element, styleProperty) {
				const actualValue = element.style.getPropertyValue(styleProperty);
				if (actualValue) Manipulator.setDataAttribute(element, styleProperty, actualValue);
			}
			_resetElementAttributes(selector, styleProperty) {
				const manipulationCallBack = (element) => {
					const value = Manipulator.getDataAttribute(element, styleProperty);
					if (value === null) {
						element.style.removeProperty(styleProperty);
						return;
					}
					Manipulator.removeDataAttribute(element, styleProperty);
					element.style.setProperty(styleProperty, value);
				};
				this._applyManipulationCallback(selector, manipulationCallBack);
			}
			_applyManipulationCallback(selector, callBack) {
				if (index_js.isElement(selector)) {
					callBack(selector);
					return;
				}
				for (const sel of SelectorEngine.find(selector, this._element)) callBack(sel);
			}
		}
		return ScrollBarHelper;
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/modal.js
var require_modal = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap modal.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_base_component(), require_event_handler(), require_selector_engine(), require_backdrop(), require_component_functions(), require_focustrap(), require_util(), require_scrollbar()) : typeof define === "function" && define.amd ? define([
			"./base-component",
			"./dom/event-handler",
			"./dom/selector-engine",
			"./util/backdrop",
			"./util/component-functions",
			"./util/focustrap",
			"./util/index",
			"./util/scrollbar"
		], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Modal = factory(global.BaseComponent, global.EventHandler, global.SelectorEngine, global.Backdrop, global.ComponentFunctions, global.Focustrap, global.Index, global.Scrollbar));
	})(exports, (function(BaseComponent, EventHandler, SelectorEngine, Backdrop, componentFunctions_js, FocusTrap, index_js, ScrollBarHelper) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap modal.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		/**
		* Constants
		*/
		const NAME = "modal";
		const EVENT_KEY = `.bs.modal`;
		const DATA_API_KEY = ".data-api";
		const ESCAPE_KEY = "Escape";
		const EVENT_HIDE = `hide${EVENT_KEY}`;
		const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY}`;
		const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
		const EVENT_SHOW = `show${EVENT_KEY}`;
		const EVENT_SHOWN = `shown${EVENT_KEY}`;
		const EVENT_RESIZE = `resize${EVENT_KEY}`;
		const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`;
		const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY}`;
		const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY}`;
		const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
		const CLASS_NAME_OPEN = "modal-open";
		const CLASS_NAME_FADE = "fade";
		const CLASS_NAME_SHOW = "show";
		const CLASS_NAME_STATIC = "modal-static";
		const OPEN_SELECTOR = ".modal.show";
		const SELECTOR_DIALOG = ".modal-dialog";
		const SELECTOR_MODAL_BODY = ".modal-body";
		const SELECTOR_DATA_TOGGLE = "[data-bs-toggle=\"modal\"]";
		const Default = {
			backdrop: true,
			focus: true,
			keyboard: true
		};
		const DefaultType = {
			backdrop: "(boolean|string)",
			focus: "boolean",
			keyboard: "boolean"
		};
		/**
		* Class definition
		*/
		class Modal extends BaseComponent {
			constructor(element, config) {
				super(element, config);
				this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
				this._backdrop = this._initializeBackDrop();
				this._focustrap = this._initializeFocusTrap();
				this._isShown = false;
				this._isTransitioning = false;
				this._scrollBar = new ScrollBarHelper();
				this._addEventListeners();
			}
			static get Default() {
				return Default;
			}
			static get DefaultType() {
				return DefaultType;
			}
			static get NAME() {
				return NAME;
			}
			toggle(relatedTarget) {
				return this._isShown ? this.hide() : this.show(relatedTarget);
			}
			show(relatedTarget) {
				if (this._isShown || this._isTransitioning) return;
				if (EventHandler.trigger(this._element, EVENT_SHOW, { relatedTarget }).defaultPrevented) return;
				this._isShown = true;
				this._isTransitioning = true;
				this._scrollBar.hide();
				document.body.classList.add(CLASS_NAME_OPEN);
				this._adjustDialog();
				this._backdrop.show(() => this._showElement(relatedTarget));
			}
			hide() {
				if (!this._isShown || this._isTransitioning) return;
				if (EventHandler.trigger(this._element, EVENT_HIDE).defaultPrevented) return;
				this._isShown = false;
				this._isTransitioning = true;
				this._focustrap.deactivate();
				this._element.classList.remove(CLASS_NAME_SHOW);
				this._queueCallback(() => this._hideModal(), this._element, this._isAnimated());
			}
			dispose() {
				EventHandler.off(window, EVENT_KEY);
				EventHandler.off(this._dialog, EVENT_KEY);
				this._backdrop.dispose();
				this._focustrap.deactivate();
				super.dispose();
			}
			handleUpdate() {
				this._adjustDialog();
			}
			_initializeBackDrop() {
				return new Backdrop({
					isVisible: Boolean(this._config.backdrop),
					isAnimated: this._isAnimated()
				});
			}
			_initializeFocusTrap() {
				return new FocusTrap({ trapElement: this._element });
			}
			_showElement(relatedTarget) {
				if (!document.body.contains(this._element)) document.body.append(this._element);
				this._element.style.display = "block";
				this._element.removeAttribute("aria-hidden");
				this._element.setAttribute("aria-modal", true);
				this._element.setAttribute("role", "dialog");
				this._element.scrollTop = 0;
				const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);
				if (modalBody) modalBody.scrollTop = 0;
				index_js.reflow(this._element);
				this._element.classList.add(CLASS_NAME_SHOW);
				const transitionComplete = () => {
					if (this._config.focus) this._focustrap.activate();
					this._isTransitioning = false;
					EventHandler.trigger(this._element, EVENT_SHOWN, { relatedTarget });
				};
				this._queueCallback(transitionComplete, this._dialog, this._isAnimated());
			}
			_addEventListeners() {
				EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, (event) => {
					if (event.key !== ESCAPE_KEY) return;
					if (this._config.keyboard) {
						this.hide();
						return;
					}
					this._triggerBackdropTransition();
				});
				EventHandler.on(window, EVENT_RESIZE, () => {
					if (this._isShown && !this._isTransitioning) this._adjustDialog();
				});
				EventHandler.on(this._element, EVENT_MOUSEDOWN_DISMISS, (event) => {
					EventHandler.one(this._element, EVENT_CLICK_DISMISS, (event2) => {
						if (this._element !== event.target || this._element !== event2.target) return;
						if (this._config.backdrop === "static") {
							this._triggerBackdropTransition();
							return;
						}
						if (this._config.backdrop) this.hide();
					});
				});
			}
			_hideModal() {
				this._element.style.display = "none";
				this._element.setAttribute("aria-hidden", true);
				this._element.removeAttribute("aria-modal");
				this._element.removeAttribute("role");
				this._isTransitioning = false;
				this._backdrop.hide(() => {
					document.body.classList.remove(CLASS_NAME_OPEN);
					this._resetAdjustments();
					this._scrollBar.reset();
					EventHandler.trigger(this._element, EVENT_HIDDEN);
				});
			}
			_isAnimated() {
				return this._element.classList.contains(CLASS_NAME_FADE);
			}
			_triggerBackdropTransition() {
				if (EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED).defaultPrevented) return;
				const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
				const initialOverflowY = this._element.style.overflowY;
				if (initialOverflowY === "hidden" || this._element.classList.contains(CLASS_NAME_STATIC)) return;
				if (!isModalOverflowing) this._element.style.overflowY = "hidden";
				this._element.classList.add(CLASS_NAME_STATIC);
				this._queueCallback(() => {
					this._element.classList.remove(CLASS_NAME_STATIC);
					this._queueCallback(() => {
						this._element.style.overflowY = initialOverflowY;
					}, this._dialog);
				}, this._dialog);
				this._element.focus();
			}
			/**
			* The following methods are used to handle overflowing modals
			*/
			_adjustDialog() {
				const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
				const scrollbarWidth = this._scrollBar.getWidth();
				const isBodyOverflowing = scrollbarWidth > 0;
				if (isBodyOverflowing && !isModalOverflowing) {
					const property = index_js.isRTL() ? "paddingLeft" : "paddingRight";
					this._element.style[property] = `${scrollbarWidth}px`;
				}
				if (!isBodyOverflowing && isModalOverflowing) {
					const property = index_js.isRTL() ? "paddingRight" : "paddingLeft";
					this._element.style[property] = `${scrollbarWidth}px`;
				}
			}
			_resetAdjustments() {
				this._element.style.paddingLeft = "";
				this._element.style.paddingRight = "";
			}
			static jQueryInterface(config, relatedTarget) {
				return this.each(function() {
					const data = Modal.getOrCreateInstance(this, config);
					if (typeof config !== "string") return;
					if (typeof data[config] === "undefined") throw new TypeError(`No method named "${config}"`);
					data[config](relatedTarget);
				});
			}
		}
		/**
		* Data API implementation
		*/
		EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(event) {
			const target = SelectorEngine.getElementFromSelector(this);
			if (["A", "AREA"].includes(this.tagName)) event.preventDefault();
			EventHandler.one(target, EVENT_SHOW, (showEvent) => {
				if (showEvent.defaultPrevented) return;
				EventHandler.one(target, EVENT_HIDDEN, () => {
					if (index_js.isVisible(this)) this.focus();
				});
			});
			const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);
			if (alreadyOpen) Modal.getInstance(alreadyOpen).hide();
			Modal.getOrCreateInstance(target).toggle(this);
		});
		componentFunctions_js.enableDismissTrigger(Modal);
		/**
		* jQuery
		*/
		index_js.defineJQueryPlugin(Modal);
		return Modal;
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/tab.js
var require_tab = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap tab.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_base_component(), require_event_handler(), require_selector_engine(), require_util()) : typeof define === "function" && define.amd ? define([
			"./base-component",
			"./dom/event-handler",
			"./dom/selector-engine",
			"./util/index"
		], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Tab = factory(global.BaseComponent, global.EventHandler, global.SelectorEngine, global.Index));
	})(exports, (function(BaseComponent, EventHandler, SelectorEngine, index_js) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap tab.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		/**
		* Constants
		*/
		const NAME = "tab";
		const EVENT_KEY = `.bs.tab`;
		const EVENT_HIDE = `hide${EVENT_KEY}`;
		const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
		const EVENT_SHOW = `show${EVENT_KEY}`;
		const EVENT_SHOWN = `shown${EVENT_KEY}`;
		const EVENT_CLICK_DATA_API = `click${EVENT_KEY}`;
		const EVENT_KEYDOWN = `keydown${EVENT_KEY}`;
		const EVENT_LOAD_DATA_API = `load${EVENT_KEY}`;
		const ARROW_LEFT_KEY = "ArrowLeft";
		const ARROW_RIGHT_KEY = "ArrowRight";
		const ARROW_UP_KEY = "ArrowUp";
		const ARROW_DOWN_KEY = "ArrowDown";
		const HOME_KEY = "Home";
		const END_KEY = "End";
		const CLASS_NAME_ACTIVE = "active";
		const CLASS_NAME_FADE = "fade";
		const CLASS_NAME_SHOW = "show";
		const CLASS_DROPDOWN = "dropdown";
		const SELECTOR_DROPDOWN_TOGGLE = ".dropdown-toggle";
		const SELECTOR_DROPDOWN_MENU = ".dropdown-menu";
		const NOT_SELECTOR_DROPDOWN_TOGGLE = `:not(${SELECTOR_DROPDOWN_TOGGLE})`;
		const SELECTOR_TAB_PANEL = ".list-group, .nav, [role=\"tablist\"]";
		const SELECTOR_OUTER = ".nav-item, .list-group-item";
		const SELECTOR_INNER = `.nav-link${NOT_SELECTOR_DROPDOWN_TOGGLE}, .list-group-item${NOT_SELECTOR_DROPDOWN_TOGGLE}, [role="tab"]${NOT_SELECTOR_DROPDOWN_TOGGLE}`;
		const SELECTOR_DATA_TOGGLE = "[data-bs-toggle=\"tab\"], [data-bs-toggle=\"pill\"], [data-bs-toggle=\"list\"]";
		const SELECTOR_INNER_ELEM = `${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE}`;
		const SELECTOR_DATA_TOGGLE_ACTIVE = `.${CLASS_NAME_ACTIVE}[data-bs-toggle="tab"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="pill"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="list"]`;
		/**
		* Class definition
		*/
		class Tab extends BaseComponent {
			constructor(element) {
				super(element);
				this._parent = this._element.closest(SELECTOR_TAB_PANEL);
				if (!this._parent) return;
				this._setInitialAttributes(this._parent, this._getChildren());
				EventHandler.on(this._element, EVENT_KEYDOWN, (event) => this._keydown(event));
			}
			static get NAME() {
				return NAME;
			}
			show() {
				const innerElem = this._element;
				if (this._elemIsActive(innerElem)) return;
				const active = this._getActiveElem();
				const hideEvent = active ? EventHandler.trigger(active, EVENT_HIDE, { relatedTarget: innerElem }) : null;
				if (EventHandler.trigger(innerElem, EVENT_SHOW, { relatedTarget: active }).defaultPrevented || hideEvent && hideEvent.defaultPrevented) return;
				this._deactivate(active, innerElem);
				this._activate(innerElem, active);
			}
			_activate(element, relatedElem) {
				if (!element) return;
				element.classList.add(CLASS_NAME_ACTIVE);
				this._activate(SelectorEngine.getElementFromSelector(element));
				const complete = () => {
					if (element.getAttribute("role") !== "tab") {
						element.classList.add(CLASS_NAME_SHOW);
						return;
					}
					element.removeAttribute("tabindex");
					element.setAttribute("aria-selected", true);
					this._toggleDropDown(element, true);
					EventHandler.trigger(element, EVENT_SHOWN, { relatedTarget: relatedElem });
				};
				this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE));
			}
			_deactivate(element, relatedElem) {
				if (!element) return;
				element.classList.remove(CLASS_NAME_ACTIVE);
				element.blur();
				this._deactivate(SelectorEngine.getElementFromSelector(element));
				const complete = () => {
					if (element.getAttribute("role") !== "tab") {
						element.classList.remove(CLASS_NAME_SHOW);
						return;
					}
					element.setAttribute("aria-selected", false);
					element.setAttribute("tabindex", "-1");
					this._toggleDropDown(element, false);
					EventHandler.trigger(element, EVENT_HIDDEN, { relatedTarget: relatedElem });
				};
				this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE));
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
				event.stopPropagation();
				event.preventDefault();
				const children = this._getChildren().filter((element) => !index_js.isDisabled(element));
				let nextActiveElement;
				if ([HOME_KEY, END_KEY].includes(event.key)) nextActiveElement = children[event.key === HOME_KEY ? 0 : children.length - 1];
				else {
					const isNext = [ARROW_RIGHT_KEY, ARROW_DOWN_KEY].includes(event.key);
					nextActiveElement = index_js.getNextActiveElement(children, event.target, isNext, true);
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
				child.setAttribute("aria-selected", isActive);
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
			_toggleDropDown(element, open) {
				const outerElem = this._getOuterElement(element);
				if (!outerElem.classList.contains(CLASS_DROPDOWN)) return;
				const toggle = (selector, className) => {
					const element = SelectorEngine.findOne(selector, outerElem);
					if (element) element.classList.toggle(className, open);
				};
				toggle(SELECTOR_DROPDOWN_TOGGLE, CLASS_NAME_ACTIVE);
				toggle(SELECTOR_DROPDOWN_MENU, CLASS_NAME_SHOW);
				outerElem.setAttribute("aria-expanded", open);
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
			static jQueryInterface(config) {
				return this.each(function() {
					const data = Tab.getOrCreateInstance(this);
					if (typeof config !== "string") return;
					if (data[config] === void 0 || config.startsWith("_") || config === "constructor") throw new TypeError(`No method named "${config}"`);
					data[config]();
				});
			}
		}
		/**
		* Data API implementation
		*/
		EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(event) {
			if (["A", "AREA"].includes(this.tagName)) event.preventDefault();
			if (index_js.isDisabled(this)) return;
			Tab.getOrCreateInstance(this).show();
		});
		/**
		* Initialize on focus
		*/
		EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
			for (const element of SelectorEngine.find(SELECTOR_DATA_TOGGLE_ACTIVE)) Tab.getOrCreateInstance(element);
		});
		/**
		* jQuery
		*/
		index_js.defineJQueryPlugin(Tab);
		return Tab;
	}));
}));
//#endregion
export { require_carousel as a, require_collapse as i, require_modal as n, require_button as o, require_dropdown as r, require_base_component as s, require_tab as t };

//# sourceMappingURL=vendor-bootstrap-D9cFzHbY.js.map
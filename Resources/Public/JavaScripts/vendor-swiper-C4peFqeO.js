//#region node_modules/@vue/shared/dist/shared.esm-bundler.js
/**
* @vue/shared v3.5.39
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function makeMap(str) {
	const map = /* @__PURE__ */ Object.create(null);
	for (const key of str.split(",")) map[key] = 1;
	return (val) => val in map;
}
var EMPTY_OBJ = {};
var EMPTY_ARR = [];
var NOOP = () => {};
var NO = () => false;
var isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
var isModelListener = (key) => key.startsWith("onUpdate:");
var extend$2 = Object.assign;
var remove = (arr, el) => {
	const i = arr.indexOf(el);
	if (i > -1) arr.splice(i, 1);
};
var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
var isArray = Array.isArray;
var isMap = (val) => toTypeString(val) === "[object Map]";
var isSet = (val) => toTypeString(val) === "[object Set]";
var isDate = (val) => toTypeString(val) === "[object Date]";
var isFunction = (val) => typeof val === "function";
var isString = (val) => typeof val === "string";
var isSymbol = (val) => typeof val === "symbol";
var isObject$2 = (val) => val !== null && typeof val === "object";
var isPromise = (val) => {
	return (isObject$2(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
var objectToString = Object.prototype.toString;
var toTypeString = (value) => objectToString.call(value);
var toRawType = (value) => {
	return toTypeString(value).slice(8, -1);
};
var isPlainObject = (val) => toTypeString(val) === "[object Object]";
var isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
var isReservedProp = /* @__PURE__ */ makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
var cacheStringFunction = (fn) => {
	const cache = /* @__PURE__ */ Object.create(null);
	return ((str) => {
		return cache[str] || (cache[str] = fn(str));
	});
};
var camelizeRE = /-\w/g;
var camelize = cacheStringFunction((str) => {
	return str.replace(camelizeRE, (c) => c.slice(1).toUpperCase());
});
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
var capitalize = cacheStringFunction((str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
});
var toHandlerKey = cacheStringFunction((str) => {
	return str ? `on${capitalize(str)}` : ``;
});
var hasChanged = (value, oldValue) => !Object.is(value, oldValue);
var invokeArrayFns = (fns, ...arg) => {
	for (let i = 0; i < fns.length; i++) fns[i](...arg);
};
var def = (obj, key, value, writable = false) => {
	Object.defineProperty(obj, key, {
		configurable: true,
		enumerable: false,
		writable,
		value
	});
};
var looseToNumber = (val) => {
	const n = parseFloat(val);
	return isNaN(n) ? val : n;
};
var _globalThis;
var getGlobalThis = () => {
	return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
	if (isArray(value)) {
		const res = {};
		for (let i = 0; i < value.length; i++) {
			const item = value[i];
			const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
			if (normalized) for (const key in normalized) res[key] = normalized[key];
		}
		return res;
	} else if (isString(value) || isObject$2(value)) return value;
}
var listDelimiterRE = /;(?![^(]*\))/g;
var propertyDelimiterRE = /:([^]+)/;
var styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
	const ret = {};
	cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
		if (item) {
			const tmp = item.split(propertyDelimiterRE);
			tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
		}
	});
	return ret;
}
function normalizeClass(value) {
	let res = "";
	if (isString(value)) res = value;
	else if (isArray(value)) for (let i = 0; i < value.length; i++) {
		const normalized = normalizeClass(value[i]);
		if (normalized) res += normalized + " ";
	}
	else if (isObject$2(value)) {
		for (const name in value) if (value[name]) res += name + " ";
	}
	return res.trim();
}
var specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
var isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
specialBooleanAttrs + "";
function includeBooleanAttr(value) {
	return !!value || value === "";
}
function looseCompareArrays(a, b) {
	if (a.length !== b.length) return false;
	let equal = true;
	for (let i = 0; equal && i < a.length; i++) equal = looseEqual(a[i], b[i]);
	return equal;
}
function looseEqual(a, b) {
	if (a === b) return true;
	let aValidType = isDate(a);
	let bValidType = isDate(b);
	if (aValidType || bValidType) return aValidType && bValidType ? a.getTime() === b.getTime() : false;
	aValidType = isSymbol(a);
	bValidType = isSymbol(b);
	if (aValidType || bValidType) return a === b;
	aValidType = isArray(a);
	bValidType = isArray(b);
	if (aValidType || bValidType) return aValidType && bValidType ? looseCompareArrays(a, b) : false;
	aValidType = isObject$2(a);
	bValidType = isObject$2(b);
	if (aValidType || bValidType) {
		if (!aValidType || !bValidType) return false;
		if (Object.keys(a).length !== Object.keys(b).length) return false;
		for (const key in a) {
			const aHasKey = a.hasOwnProperty(key);
			const bHasKey = b.hasOwnProperty(key);
			if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) return false;
		}
	}
	return String(a) === String(b);
}
var isRef$1 = (val) => {
	return !!(val && val["__v_isRef"] === true);
};
var toDisplayString = (val) => {
	return isString(val) ? val : val == null ? "" : isArray(val) || isObject$2(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
};
var replacer = (_key, val) => {
	if (isRef$1(val)) return replacer(_key, val.value);
	else if (isMap(val)) return { [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2], i) => {
		entries[stringifySymbol(key, i) + " =>"] = val2;
		return entries;
	}, {}) };
	else if (isSet(val)) return { [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v)) };
	else if (isSymbol(val)) return stringifySymbol(val);
	else if (isObject$2(val) && !isArray(val) && !isPlainObject(val)) return String(val);
	return val;
};
var stringifySymbol = (v, i = "") => {
	var _a;
	return isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v;
};
//#endregion
//#region node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
/**
* @vue/reactivity v3.5.39
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
var activeEffectScope;
var EffectScope = class {
	constructor(detached = false) {
		this.detached = detached;
		/**
		* @internal
		*/
		this._active = true;
		/**
		* @internal track `on` calls, allow `on` call multiple times
		*/
		this._on = 0;
		/**
		* @internal
		*/
		this.effects = [];
		/**
		* @internal
		*/
		this.cleanups = [];
		this._isPaused = false;
		this._warnOnRun = true;
		this.__v_skip = true;
		if (!detached && activeEffectScope) if (activeEffectScope.active) {
			this.parent = activeEffectScope;
			this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
		} else {
			this._active = false;
			this._warnOnRun = false;
		}
	}
	get active() {
		return this._active;
	}
	pause() {
		if (this._active) {
			this._isPaused = true;
			let i, l;
			if (this.scopes) for (i = 0, l = this.scopes.length; i < l; i++) this.scopes[i].pause();
			for (i = 0, l = this.effects.length; i < l; i++) this.effects[i].pause();
		}
	}
	/**
	* Resumes the effect scope, including all child scopes and effects.
	*/
	resume() {
		if (this._active) {
			if (this._isPaused) {
				this._isPaused = false;
				let i, l;
				if (this.scopes) for (i = 0, l = this.scopes.length; i < l; i++) this.scopes[i].resume();
				for (i = 0, l = this.effects.length; i < l; i++) this.effects[i].resume();
			}
		}
	}
	run(fn) {
		if (this._active) {
			const currentEffectScope = activeEffectScope;
			try {
				activeEffectScope = this;
				return fn();
			} finally {
				activeEffectScope = currentEffectScope;
			}
		}
	}
	/**
	* This should only be called on non-detached scopes
	* @internal
	*/
	on() {
		if (++this._on === 1) {
			this.prevScope = activeEffectScope;
			activeEffectScope = this;
		}
	}
	/**
	* This should only be called on non-detached scopes
	* @internal
	*/
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (activeEffectScope === this) activeEffectScope = this.prevScope;
			else {
				let current = activeEffectScope;
				while (current) {
					if (current.prevScope === this) {
						current.prevScope = this.prevScope;
						break;
					}
					current = current.prevScope;
				}
			}
			this.prevScope = void 0;
		}
	}
	stop(fromParent) {
		if (this._active) {
			this._active = false;
			let i, l;
			for (i = 0, l = this.effects.length; i < l; i++) this.effects[i].stop();
			this.effects.length = 0;
			for (i = 0, l = this.cleanups.length; i < l; i++) this.cleanups[i]();
			this.cleanups.length = 0;
			if (this.scopes) {
				for (i = 0, l = this.scopes.length; i < l; i++) this.scopes[i].stop(true);
				this.scopes.length = 0;
			}
			if (!this.detached && this.parent && !fromParent) {
				const last = this.parent.scopes.pop();
				if (last && last !== this) {
					this.parent.scopes[this.index] = last;
					last.index = this.index;
				}
			}
			this.parent = void 0;
		}
	}
};
function getCurrentScope() {
	return activeEffectScope;
}
var activeSub;
var pausedQueueEffects = /* @__PURE__ */ new WeakSet();
var ReactiveEffect = class {
	constructor(fn) {
		this.fn = fn;
		/**
		* @internal
		*/
		this.deps = void 0;
		/**
		* @internal
		*/
		this.depsTail = void 0;
		/**
		* @internal
		*/
		this.flags = 5;
		/**
		* @internal
		*/
		this.next = void 0;
		/**
		* @internal
		*/
		this.cleanup = void 0;
		this.scheduler = void 0;
		if (activeEffectScope) if (activeEffectScope.active) activeEffectScope.effects.push(this);
		else this.flags &= -2;
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		if (this.flags & 64) {
			this.flags &= -65;
			if (pausedQueueEffects.has(this)) {
				pausedQueueEffects.delete(this);
				this.trigger();
			}
		}
	}
	/**
	* @internal
	*/
	notify() {
		if (this.flags & 2 && !(this.flags & 32)) return;
		if (!(this.flags & 8)) batch(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2;
		cleanupEffect(this);
		prepareDeps(this);
		const prevEffect = activeSub;
		const prevShouldTrack = shouldTrack;
		activeSub = this;
		shouldTrack = true;
		try {
			return this.fn();
		} finally {
			cleanupDeps(this);
			activeSub = prevEffect;
			shouldTrack = prevShouldTrack;
			this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let link = this.deps; link; link = link.nextDep) removeSub(link);
			this.deps = this.depsTail = void 0;
			cleanupEffect(this);
			this.onStop && this.onStop();
			this.flags &= -2;
		}
	}
	trigger() {
		if (this.flags & 64) pausedQueueEffects.add(this);
		else if (this.scheduler) this.scheduler();
		else this.runIfDirty();
	}
	/**
	* @internal
	*/
	runIfDirty() {
		if (isDirty(this)) this.run();
	}
	get dirty() {
		return isDirty(this);
	}
};
var batchDepth = 0;
var batchedSub;
var batchedComputed;
function batch(sub, isComputed = false) {
	sub.flags |= 8;
	if (isComputed) {
		sub.next = batchedComputed;
		batchedComputed = sub;
		return;
	}
	sub.next = batchedSub;
	batchedSub = sub;
}
function startBatch() {
	batchDepth++;
}
function endBatch() {
	if (--batchDepth > 0) return;
	if (batchedComputed) {
		let e = batchedComputed;
		batchedComputed = void 0;
		while (e) {
			const next = e.next;
			e.next = void 0;
			e.flags &= -9;
			e = next;
		}
	}
	let error;
	while (batchedSub) {
		let e = batchedSub;
		batchedSub = void 0;
		while (e) {
			const next = e.next;
			e.next = void 0;
			e.flags &= -9;
			if (e.flags & 1) try {
				e.trigger();
			} catch (err) {
				if (!error) error = err;
			}
			e = next;
		}
	}
	if (error) throw error;
}
function prepareDeps(sub) {
	for (let link = sub.deps; link; link = link.nextDep) {
		link.version = -1;
		link.prevActiveLink = link.dep.activeLink;
		link.dep.activeLink = link;
	}
}
function cleanupDeps(sub) {
	let head;
	let tail = sub.depsTail;
	let link = tail;
	while (link) {
		const prev = link.prevDep;
		if (link.version === -1) {
			if (link === tail) tail = prev;
			removeSub(link);
			removeDep(link);
		} else head = link;
		link.dep.activeLink = link.prevActiveLink;
		link.prevActiveLink = void 0;
		link = prev;
	}
	sub.deps = head;
	sub.depsTail = tail;
}
function isDirty(sub) {
	for (let link = sub.deps; link; link = link.nextDep) if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) return true;
	if (sub._dirty) return true;
	return false;
}
function refreshComputed(computed) {
	if (computed.flags & 4 && !(computed.flags & 16)) return;
	computed.flags &= -17;
	if (computed.globalVersion === globalVersion) return;
	computed.globalVersion = globalVersion;
	if (!computed.isSSR && computed.flags & 128 && (!computed.deps && !computed._dirty || !isDirty(computed))) return;
	computed.flags |= 2;
	const dep = computed.dep;
	const prevSub = activeSub;
	const prevShouldTrack = shouldTrack;
	activeSub = computed;
	shouldTrack = true;
	try {
		prepareDeps(computed);
		const value = computed.fn(computed._value);
		if (dep.version === 0 || hasChanged(value, computed._value)) {
			computed.flags |= 128;
			computed._value = value;
			dep.version++;
		}
	} catch (err) {
		dep.version++;
		throw err;
	} finally {
		activeSub = prevSub;
		shouldTrack = prevShouldTrack;
		cleanupDeps(computed);
		computed.flags &= -3;
	}
}
function removeSub(link, soft = false) {
	const { dep, prevSub, nextSub } = link;
	if (prevSub) {
		prevSub.nextSub = nextSub;
		link.prevSub = void 0;
	}
	if (nextSub) {
		nextSub.prevSub = prevSub;
		link.nextSub = void 0;
	}
	if (dep.subs === link) {
		dep.subs = prevSub;
		if (!prevSub && dep.computed) {
			dep.computed.flags &= -5;
			for (let l = dep.computed.deps; l; l = l.nextDep) removeSub(l, true);
		}
	}
	if (!soft && !--dep.sc && dep.map) dep.map.delete(dep.key);
}
function removeDep(link) {
	const { prevDep, nextDep } = link;
	if (prevDep) {
		prevDep.nextDep = nextDep;
		link.prevDep = void 0;
	}
	if (nextDep) {
		nextDep.prevDep = prevDep;
		link.nextDep = void 0;
	}
}
var shouldTrack = true;
var trackStack = [];
function pauseTracking() {
	trackStack.push(shouldTrack);
	shouldTrack = false;
}
function resetTracking() {
	const last = trackStack.pop();
	shouldTrack = last === void 0 ? true : last;
}
function cleanupEffect(e) {
	const { cleanup } = e;
	e.cleanup = void 0;
	if (cleanup) {
		const prevSub = activeSub;
		activeSub = void 0;
		try {
			cleanup();
		} finally {
			activeSub = prevSub;
		}
	}
}
var globalVersion = 0;
var Link = class {
	constructor(sub, dep) {
		this.sub = sub;
		this.dep = dep;
		this.version = dep.version;
		this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
};
var Dep = class {
	constructor(computed) {
		this.computed = computed;
		this.version = 0;
		/**
		* Link between this dep and the current active effect
		*/
		this.activeLink = void 0;
		/**
		* Doubly linked list representing the subscribing effects (tail)
		*/
		this.subs = void 0;
		/**
		* For object property deps cleanup
		*/
		this.map = void 0;
		this.key = void 0;
		/**
		* Subscriber counter
		*/
		this.sc = 0;
		/**
		* @internal
		*/
		this.__v_skip = true;
	}
	track(debugInfo) {
		if (!activeSub || !shouldTrack || activeSub === this.computed) return;
		let link = this.activeLink;
		if (link === void 0 || link.sub !== activeSub) {
			link = this.activeLink = new Link(activeSub, this);
			if (!activeSub.deps) activeSub.deps = activeSub.depsTail = link;
			else {
				link.prevDep = activeSub.depsTail;
				activeSub.depsTail.nextDep = link;
				activeSub.depsTail = link;
			}
			addSub(link);
		} else if (link.version === -1) {
			link.version = this.version;
			if (link.nextDep) {
				const next = link.nextDep;
				next.prevDep = link.prevDep;
				if (link.prevDep) link.prevDep.nextDep = next;
				link.prevDep = activeSub.depsTail;
				link.nextDep = void 0;
				activeSub.depsTail.nextDep = link;
				activeSub.depsTail = link;
				if (activeSub.deps === link) activeSub.deps = next;
			}
		}
		return link;
	}
	trigger(debugInfo) {
		this.version++;
		globalVersion++;
		this.notify(debugInfo);
	}
	notify(debugInfo) {
		startBatch();
		try {
			for (let link = this.subs; link; link = link.prevSub) if (link.sub.notify()) link.sub.dep.notify();
		} finally {
			endBatch();
		}
	}
};
function addSub(link) {
	link.dep.sc++;
	if (link.sub.flags & 4) {
		const computed = link.dep.computed;
		if (computed && !link.dep.subs) {
			computed.flags |= 20;
			for (let l = computed.deps; l; l = l.nextDep) addSub(l);
		}
		const currentTail = link.dep.subs;
		if (currentTail !== link) {
			link.prevSub = currentTail;
			if (currentTail) currentTail.nextSub = link;
		}
		link.dep.subs = link;
	}
}
var targetMap = /* @__PURE__ */ new WeakMap();
var ITERATE_KEY = /* @__PURE__ */ Symbol("");
var MAP_KEY_ITERATE_KEY = /* @__PURE__ */ Symbol("");
var ARRAY_ITERATE_KEY = /* @__PURE__ */ Symbol("");
function track(target, type, key) {
	if (shouldTrack && activeSub) {
		let depsMap = targetMap.get(target);
		if (!depsMap) targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
		let dep = depsMap.get(key);
		if (!dep) {
			depsMap.set(key, dep = new Dep());
			dep.map = depsMap;
			dep.key = key;
		}
		dep.track();
	}
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
	const depsMap = targetMap.get(target);
	if (!depsMap) {
		globalVersion++;
		return;
	}
	const run = (dep) => {
		if (dep) dep.trigger();
	};
	startBatch();
	if (type === "clear") depsMap.forEach(run);
	else {
		const targetIsArray = isArray(target);
		const isArrayIndex = targetIsArray && isIntegerKey(key);
		if (targetIsArray && key === "length") {
			const newLength = Number(newValue);
			depsMap.forEach((dep, key2) => {
				if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) run(dep);
			});
		} else {
			if (key !== void 0 || depsMap.has(void 0)) run(depsMap.get(key));
			if (isArrayIndex) run(depsMap.get(ARRAY_ITERATE_KEY));
			switch (type) {
				case "add":
					if (!targetIsArray) {
						run(depsMap.get(ITERATE_KEY));
						if (isMap(target)) run(depsMap.get(MAP_KEY_ITERATE_KEY));
					} else if (isArrayIndex) run(depsMap.get("length"));
					break;
				case "delete":
					if (!targetIsArray) {
						run(depsMap.get(ITERATE_KEY));
						if (isMap(target)) run(depsMap.get(MAP_KEY_ITERATE_KEY));
					}
					break;
				case "set":
					if (isMap(target)) run(depsMap.get(ITERATE_KEY));
					break;
			}
		}
	}
	endBatch();
}
function reactiveReadArray(array) {
	const raw = /* @__PURE__ */ toRaw(array);
	if (raw === array) return raw;
	track(raw, "iterate", ARRAY_ITERATE_KEY);
	return /* @__PURE__ */ isShallow(array) ? raw : raw.map(toReactive);
}
function shallowReadArray(arr) {
	track(arr = /* @__PURE__ */ toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
	return arr;
}
function toWrapped(target, item) {
	if (/* @__PURE__ */ isReadonly(target)) return /* @__PURE__ */ isReactive(target) ? toReadonly(toReactive(item)) : toReadonly(item);
	return toReactive(item);
}
var arrayInstrumentations = {
	__proto__: null,
	[Symbol.iterator]() {
		return iterator(this, Symbol.iterator, (item) => toWrapped(this, item));
	},
	concat(...args) {
		return reactiveReadArray(this).concat(...args.map((x) => isArray(x) ? reactiveReadArray(x) : x));
	},
	entries() {
		return iterator(this, "entries", (value) => {
			value[1] = toWrapped(this, value[1]);
			return value;
		});
	},
	every(fn, thisArg) {
		return apply(this, "every", fn, thisArg, void 0, arguments);
	},
	filter(fn, thisArg) {
		return apply(this, "filter", fn, thisArg, (v) => v.map((item) => toWrapped(this, item)), arguments);
	},
	find(fn, thisArg) {
		return apply(this, "find", fn, thisArg, (item) => toWrapped(this, item), arguments);
	},
	findIndex(fn, thisArg) {
		return apply(this, "findIndex", fn, thisArg, void 0, arguments);
	},
	findLast(fn, thisArg) {
		return apply(this, "findLast", fn, thisArg, (item) => toWrapped(this, item), arguments);
	},
	findLastIndex(fn, thisArg) {
		return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
	},
	forEach(fn, thisArg) {
		return apply(this, "forEach", fn, thisArg, void 0, arguments);
	},
	includes(...args) {
		return searchProxy(this, "includes", args);
	},
	indexOf(...args) {
		return searchProxy(this, "indexOf", args);
	},
	join(separator) {
		return reactiveReadArray(this).join(separator);
	},
	lastIndexOf(...args) {
		return searchProxy(this, "lastIndexOf", args);
	},
	map(fn, thisArg) {
		return apply(this, "map", fn, thisArg, void 0, arguments);
	},
	pop() {
		return noTracking(this, "pop");
	},
	push(...args) {
		return noTracking(this, "push", args);
	},
	reduce(fn, ...args) {
		return reduce(this, "reduce", fn, args);
	},
	reduceRight(fn, ...args) {
		return reduce(this, "reduceRight", fn, args);
	},
	shift() {
		return noTracking(this, "shift");
	},
	some(fn, thisArg) {
		return apply(this, "some", fn, thisArg, void 0, arguments);
	},
	splice(...args) {
		return noTracking(this, "splice", args);
	},
	toReversed() {
		return reactiveReadArray(this).toReversed();
	},
	toSorted(comparer) {
		return reactiveReadArray(this).toSorted(comparer);
	},
	toSpliced(...args) {
		return reactiveReadArray(this).toSpliced(...args);
	},
	unshift(...args) {
		return noTracking(this, "unshift", args);
	},
	values() {
		return iterator(this, "values", (item) => toWrapped(this, item));
	}
};
function iterator(self, method, wrapValue) {
	const arr = shallowReadArray(self);
	const iter = arr[method]();
	if (arr !== self && !/* @__PURE__ */ isShallow(self)) {
		iter._next = iter.next;
		iter.next = () => {
			const result = iter._next();
			if (!result.done) result.value = wrapValue(result.value);
			return result;
		};
	}
	return iter;
}
var arrayProto = Array.prototype;
function apply(self, method, fn, thisArg, wrappedRetFn, args) {
	const arr = shallowReadArray(self);
	const needsWrap = arr !== self && !/* @__PURE__ */ isShallow(self);
	const methodFn = arr[method];
	if (methodFn !== arrayProto[method]) {
		const result2 = methodFn.apply(self, args);
		return needsWrap ? toReactive(result2) : result2;
	}
	let wrappedFn = fn;
	if (arr !== self) {
		if (needsWrap) wrappedFn = function(item, index) {
			return fn.call(this, toWrapped(self, item), index, self);
		};
		else if (fn.length > 2) wrappedFn = function(item, index) {
			return fn.call(this, item, index, self);
		};
	}
	const result = methodFn.call(arr, wrappedFn, thisArg);
	return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
}
function reduce(self, method, fn, args) {
	const arr = shallowReadArray(self);
	const needsWrap = arr !== self && !/* @__PURE__ */ isShallow(self);
	let wrappedFn = fn;
	let wrapInitialAccumulator = false;
	if (arr !== self) {
		if (needsWrap) {
			wrapInitialAccumulator = args.length === 0;
			wrappedFn = function(acc, item, index) {
				if (wrapInitialAccumulator) {
					wrapInitialAccumulator = false;
					acc = toWrapped(self, acc);
				}
				return fn.call(this, acc, toWrapped(self, item), index, self);
			};
		} else if (fn.length > 3) wrappedFn = function(acc, item, index) {
			return fn.call(this, acc, item, index, self);
		};
	}
	const result = arr[method](wrappedFn, ...args);
	return wrapInitialAccumulator ? toWrapped(self, result) : result;
}
function searchProxy(self, method, args) {
	const arr = /* @__PURE__ */ toRaw(self);
	track(arr, "iterate", ARRAY_ITERATE_KEY);
	const res = arr[method](...args);
	if ((res === -1 || res === false) && /* @__PURE__ */ isProxy(args[0])) {
		args[0] = /* @__PURE__ */ toRaw(args[0]);
		return arr[method](...args);
	}
	return res;
}
function noTracking(self, method, args = []) {
	pauseTracking();
	startBatch();
	const res = (/* @__PURE__ */ toRaw(self))[method].apply(self, args);
	endBatch();
	resetTracking();
	return res;
}
var isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
var builtInSymbols = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol));
function hasOwnProperty(key) {
	if (!isSymbol(key)) key = String(key);
	const obj = /* @__PURE__ */ toRaw(this);
	track(obj, "has", key);
	return obj.hasOwnProperty(key);
}
var BaseReactiveHandler = class {
	constructor(_isReadonly = false, _isShallow = false) {
		this._isReadonly = _isReadonly;
		this._isShallow = _isShallow;
	}
	get(target, key, receiver) {
		if (key === "__v_skip") return target["__v_skip"];
		const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
		if (key === "__v_isReactive") return !isReadonly2;
		else if (key === "__v_isReadonly") return isReadonly2;
		else if (key === "__v_isShallow") return isShallow2;
		else if (key === "__v_raw") {
			if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) return target;
			return;
		}
		const targetIsArray = isArray(target);
		if (!isReadonly2) {
			let fn;
			if (targetIsArray && (fn = arrayInstrumentations[key])) return fn;
			if (key === "hasOwnProperty") return hasOwnProperty;
		}
		const res = Reflect.get(target, key, /* @__PURE__ */ isRef(target) ? target : receiver);
		if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) return res;
		if (!isReadonly2) track(target, "get", key);
		if (isShallow2) return res;
		if (/* @__PURE__ */ isRef(res)) {
			const value = targetIsArray && isIntegerKey(key) ? res : res.value;
			return isReadonly2 && isObject$2(value) ? /* @__PURE__ */ readonly(value) : value;
		}
		if (isObject$2(res)) return isReadonly2 ? /* @__PURE__ */ readonly(res) : /* @__PURE__ */ reactive(res);
		return res;
	}
};
var MutableReactiveHandler = class extends BaseReactiveHandler {
	constructor(isShallow2 = false) {
		super(false, isShallow2);
	}
	set(target, key, value, receiver) {
		let oldValue = target[key];
		const isArrayWithIntegerKey = isArray(target) && isIntegerKey(key);
		if (!this._isShallow) {
			const isOldValueReadonly = /* @__PURE__ */ isReadonly(oldValue);
			if (!/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) {
				oldValue = /* @__PURE__ */ toRaw(oldValue);
				value = /* @__PURE__ */ toRaw(value);
			}
			if (!isArrayWithIntegerKey && /* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) if (isOldValueReadonly) return true;
			else {
				oldValue.value = value;
				return true;
			}
		}
		const hadKey = isArrayWithIntegerKey ? Number(key) < target.length : hasOwn(target, key);
		const result = Reflect.set(target, key, value, /* @__PURE__ */ isRef(target) ? target : receiver);
		if (target === /* @__PURE__ */ toRaw(receiver) && result) {
			if (!hadKey) trigger(target, "add", key, value);
			else if (hasChanged(value, oldValue)) trigger(target, "set", key, value, oldValue);
		}
		return result;
	}
	deleteProperty(target, key) {
		const hadKey = hasOwn(target, key);
		const oldValue = target[key];
		const result = Reflect.deleteProperty(target, key);
		if (result && hadKey) trigger(target, "delete", key, void 0, oldValue);
		return result;
	}
	has(target, key) {
		const result = Reflect.has(target, key);
		if (!isSymbol(key) || !builtInSymbols.has(key)) track(target, "has", key);
		return result;
	}
	ownKeys(target) {
		track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
		return Reflect.ownKeys(target);
	}
};
var ReadonlyReactiveHandler = class extends BaseReactiveHandler {
	constructor(isShallow2 = false) {
		super(true, isShallow2);
	}
	set(target, key) {
		return true;
	}
	deleteProperty(target, key) {
		return true;
	}
};
var mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
var readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
var shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
var toShallow = (value) => value;
var getProto = (v) => Reflect.getPrototypeOf(v);
function createIterableMethod(method, isReadonly2, isShallow2) {
	return function(...args) {
		const target = this["__v_raw"];
		const rawTarget = /* @__PURE__ */ toRaw(target);
		const targetIsMap = isMap(rawTarget);
		const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
		const isKeyOnly = method === "keys" && targetIsMap;
		const innerIterator = target[method](...args);
		const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
		!isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
		return extend$2(Object.create(innerIterator), { next() {
			const { value, done } = innerIterator.next();
			return done ? {
				value,
				done
			} : {
				value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
				done
			};
		} });
	};
}
function createReadonlyMethod(type) {
	return function(...args) {
		return type === "delete" ? false : type === "clear" ? void 0 : this;
	};
}
function createInstrumentations(readonly, shallow) {
	const instrumentations = {
		get(key) {
			const target = this["__v_raw"];
			const rawTarget = /* @__PURE__ */ toRaw(target);
			const rawKey = /* @__PURE__ */ toRaw(key);
			if (!readonly) {
				if (hasChanged(key, rawKey)) track(rawTarget, "get", key);
				track(rawTarget, "get", rawKey);
			}
			const { has } = getProto(rawTarget);
			const wrap = shallow ? toShallow : readonly ? toReadonly : toReactive;
			if (has.call(rawTarget, key)) return wrap(target.get(key));
			else if (has.call(rawTarget, rawKey)) return wrap(target.get(rawKey));
			else if (target !== rawTarget) target.get(key);
		},
		get size() {
			const target = this["__v_raw"];
			!readonly && track(/* @__PURE__ */ toRaw(target), "iterate", ITERATE_KEY);
			return target.size;
		},
		has(key) {
			const target = this["__v_raw"];
			const rawTarget = /* @__PURE__ */ toRaw(target);
			const rawKey = /* @__PURE__ */ toRaw(key);
			if (!readonly) {
				if (hasChanged(key, rawKey)) track(rawTarget, "has", key);
				track(rawTarget, "has", rawKey);
			}
			return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
		},
		forEach(callback, thisArg) {
			const observed = this;
			const target = observed["__v_raw"];
			const rawTarget = /* @__PURE__ */ toRaw(target);
			const wrap = shallow ? toShallow : readonly ? toReadonly : toReactive;
			!readonly && track(rawTarget, "iterate", ITERATE_KEY);
			return target.forEach((value, key) => {
				return callback.call(thisArg, wrap(value), wrap(key), observed);
			});
		}
	};
	extend$2(instrumentations, readonly ? {
		add: createReadonlyMethod("add"),
		set: createReadonlyMethod("set"),
		delete: createReadonlyMethod("delete"),
		clear: createReadonlyMethod("clear")
	} : {
		add(value) {
			const target = /* @__PURE__ */ toRaw(this);
			const proto = getProto(target);
			const rawValue = /* @__PURE__ */ toRaw(value);
			const valueToAdd = !shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value) ? rawValue : value;
			if (!(proto.has.call(target, valueToAdd) || hasChanged(value, valueToAdd) && proto.has.call(target, value) || hasChanged(rawValue, valueToAdd) && proto.has.call(target, rawValue))) {
				target.add(valueToAdd);
				trigger(target, "add", valueToAdd, valueToAdd);
			}
			return this;
		},
		set(key, value) {
			if (!shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) value = /* @__PURE__ */ toRaw(value);
			const target = /* @__PURE__ */ toRaw(this);
			const { has, get } = getProto(target);
			let hadKey = has.call(target, key);
			if (!hadKey) {
				key = /* @__PURE__ */ toRaw(key);
				hadKey = has.call(target, key);
			}
			const oldValue = get.call(target, key);
			target.set(key, value);
			if (!hadKey) trigger(target, "add", key, value);
			else if (hasChanged(value, oldValue)) trigger(target, "set", key, value, oldValue);
			return this;
		},
		delete(key) {
			const target = /* @__PURE__ */ toRaw(this);
			const { has, get } = getProto(target);
			let hadKey = has.call(target, key);
			if (!hadKey) {
				key = /* @__PURE__ */ toRaw(key);
				hadKey = has.call(target, key);
			}
			const oldValue = get ? get.call(target, key) : void 0;
			const result = target.delete(key);
			if (hadKey) trigger(target, "delete", key, void 0, oldValue);
			return result;
		},
		clear() {
			const target = /* @__PURE__ */ toRaw(this);
			const hadItems = target.size !== 0;
			const oldTarget = void 0;
			const result = target.clear();
			if (hadItems) trigger(target, "clear", void 0, void 0, oldTarget);
			return result;
		}
	});
	[
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((method) => {
		instrumentations[method] = createIterableMethod(method, readonly, shallow);
	});
	return instrumentations;
}
function createInstrumentationGetter(isReadonly2, shallow) {
	const instrumentations = createInstrumentations(isReadonly2, shallow);
	return (target, key, receiver) => {
		if (key === "__v_isReactive") return !isReadonly2;
		else if (key === "__v_isReadonly") return isReadonly2;
		else if (key === "__v_raw") return target;
		return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
	};
}
var mutableCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(false, false) };
var shallowCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(false, true) };
var readonlyCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(true, false) };
var reactiveMap = /* @__PURE__ */ new WeakMap();
var shallowReactiveMap = /* @__PURE__ */ new WeakMap();
var readonlyMap = /* @__PURE__ */ new WeakMap();
var shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
	switch (rawType) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
// @__NO_SIDE_EFFECTS__
function reactive(target) {
	if (/* @__PURE__ */ isReadonly(target)) return target;
	return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
// @__NO_SIDE_EFFECTS__
function shallowReactive(target) {
	return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
}
// @__NO_SIDE_EFFECTS__
function readonly(target) {
	return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
	if (!isObject$2(target)) return target;
	if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) return target;
	if (target["__v_skip"] || !Object.isExtensible(target)) return target;
	const existingProxy = proxyMap.get(target);
	if (existingProxy) return existingProxy;
	const targetType = targetTypeMap(toRawType(target));
	if (targetType === 0) return target;
	const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
	proxyMap.set(target, proxy);
	return proxy;
}
// @__NO_SIDE_EFFECTS__
function isReactive(value) {
	if (/* @__PURE__ */ isReadonly(value)) return /* @__PURE__ */ isReactive(value["__v_raw"]);
	return !!(value && value["__v_isReactive"]);
}
// @__NO_SIDE_EFFECTS__
function isReadonly(value) {
	return !!(value && value["__v_isReadonly"]);
}
// @__NO_SIDE_EFFECTS__
function isShallow(value) {
	return !!(value && value["__v_isShallow"]);
}
// @__NO_SIDE_EFFECTS__
function isProxy(value) {
	return value ? !!value["__v_raw"] : false;
}
// @__NO_SIDE_EFFECTS__
function toRaw(observed) {
	const raw = observed && observed["__v_raw"];
	return raw ? /* @__PURE__ */ toRaw(raw) : observed;
}
function markRaw(value) {
	if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) def(value, "__v_skip", true);
	return value;
}
var toReactive = (value) => isObject$2(value) ? /* @__PURE__ */ reactive(value) : value;
var toReadonly = (value) => isObject$2(value) ? /* @__PURE__ */ readonly(value) : value;
// @__NO_SIDE_EFFECTS__
function isRef(r) {
	return r ? r["__v_isRef"] === true : false;
}
// @__NO_SIDE_EFFECTS__
function ref(value) {
	return createRef(value, false);
}
// @__NO_SIDE_EFFECTS__
function shallowRef(value) {
	return createRef(value, true);
}
function createRef(rawValue, shallow) {
	if (/* @__PURE__ */ isRef(rawValue)) return rawValue;
	return new RefImpl(rawValue, shallow);
}
var RefImpl = class {
	constructor(value, isShallow2) {
		this.dep = new Dep();
		this["__v_isRef"] = true;
		this["__v_isShallow"] = false;
		this._rawValue = isShallow2 ? value : /* @__PURE__ */ toRaw(value);
		this._value = isShallow2 ? value : toReactive(value);
		this["__v_isShallow"] = isShallow2;
	}
	get value() {
		this.dep.track();
		return this._value;
	}
	set value(newValue) {
		const oldValue = this._rawValue;
		const useDirectValue = this["__v_isShallow"] || /* @__PURE__ */ isShallow(newValue) || /* @__PURE__ */ isReadonly(newValue);
		newValue = useDirectValue ? newValue : /* @__PURE__ */ toRaw(newValue);
		if (hasChanged(newValue, oldValue)) {
			this._rawValue = newValue;
			this._value = useDirectValue ? newValue : toReactive(newValue);
			this.dep.trigger();
		}
	}
};
function unref(ref2) {
	return /* @__PURE__ */ isRef(ref2) ? ref2.value : ref2;
}
var shallowUnwrapHandlers = {
	get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
	set: (target, key, value, receiver) => {
		const oldValue = target[key];
		if (/* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) {
			oldValue.value = value;
			return true;
		} else return Reflect.set(target, key, value, receiver);
	}
};
function proxyRefs(objectWithRefs) {
	return /* @__PURE__ */ isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
var ComputedRefImpl = class {
	constructor(fn, setter, isSSR) {
		this.fn = fn;
		this.setter = setter;
		/**
		* @internal
		*/
		this._value = void 0;
		/**
		* @internal
		*/
		this.dep = new Dep(this);
		/**
		* @internal
		*/
		this.__v_isRef = true;
		/**
		* @internal
		*/
		this.deps = void 0;
		/**
		* @internal
		*/
		this.depsTail = void 0;
		/**
		* @internal
		*/
		this.flags = 16;
		/**
		* @internal
		*/
		this.globalVersion = globalVersion - 1;
		/**
		* @internal
		*/
		this.next = void 0;
		this.effect = this;
		this["__v_isReadonly"] = !setter;
		this.isSSR = isSSR;
	}
	/**
	* @internal
	*/
	notify() {
		this.flags |= 16;
		if (!(this.flags & 8) && activeSub !== this) {
			batch(this, true);
			return true;
		}
	}
	get value() {
		const link = this.dep.track();
		refreshComputed(this);
		if (link) link.version = this.dep.version;
		return this._value;
	}
	set value(newValue) {
		if (this.setter) this.setter(newValue);
	}
};
// @__NO_SIDE_EFFECTS__
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
	let getter;
	let setter;
	if (isFunction(getterOrOptions)) getter = getterOrOptions;
	else {
		getter = getterOrOptions.get;
		setter = getterOrOptions.set;
	}
	return new ComputedRefImpl(getter, setter, isSSR);
}
var INITIAL_WATCHER_VALUE = {};
var cleanupMap = /* @__PURE__ */ new WeakMap();
var activeWatcher = void 0;
function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
	if (owner) {
		let cleanups = cleanupMap.get(owner);
		if (!cleanups) cleanupMap.set(owner, cleanups = []);
		cleanups.push(cleanupFn);
	}
}
function watch$1(source, cb, options = EMPTY_OBJ) {
	const { immediate, deep, once, scheduler, augmentJob, call } = options;
	const reactiveGetter = (source2) => {
		if (deep) return source2;
		if (/* @__PURE__ */ isShallow(source2) || deep === false || deep === 0) return traverse(source2, 1);
		return traverse(source2);
	};
	let effect;
	let getter;
	let cleanup;
	let boundCleanup;
	let forceTrigger = false;
	let isMultiSource = false;
	if (/* @__PURE__ */ isRef(source)) {
		getter = () => source.value;
		forceTrigger = /* @__PURE__ */ isShallow(source);
	} else if (/* @__PURE__ */ isReactive(source)) {
		getter = () => reactiveGetter(source);
		forceTrigger = true;
	} else if (isArray(source)) {
		isMultiSource = true;
		forceTrigger = source.some((s) => /* @__PURE__ */ isReactive(s) || /* @__PURE__ */ isShallow(s));
		getter = () => source.map((s) => {
			if (/* @__PURE__ */ isRef(s)) return s.value;
			else if (/* @__PURE__ */ isReactive(s)) return reactiveGetter(s);
			else if (isFunction(s)) return call ? call(s, 2) : s();
		});
	} else if (isFunction(source)) if (cb) getter = call ? () => call(source, 2) : source;
	else getter = () => {
		if (cleanup) {
			pauseTracking();
			try {
				cleanup();
			} finally {
				resetTracking();
			}
		}
		const currentEffect = activeWatcher;
		activeWatcher = effect;
		try {
			return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
		} finally {
			activeWatcher = currentEffect;
		}
	};
	else getter = NOOP;
	if (cb && deep) {
		const baseGetter = getter;
		const depth = deep === true ? Infinity : deep;
		getter = () => traverse(baseGetter(), depth);
	}
	const scope = getCurrentScope();
	const watchHandle = () => {
		effect.stop();
		if (scope && scope.active) remove(scope.effects, effect);
	};
	if (once && cb) {
		const _cb = cb;
		cb = (...args) => {
			const res = _cb(...args);
			watchHandle();
			return res;
		};
	}
	let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
	const job = (immediateFirstRun) => {
		if (!(effect.flags & 1) || !effect.dirty && !immediateFirstRun) return;
		if (cb) {
			const newValue = effect.run();
			if (immediateFirstRun || deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
				if (cleanup) cleanup();
				const currentWatcher = activeWatcher;
				activeWatcher = effect;
				try {
					const args = [
						newValue,
						oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
						boundCleanup
					];
					oldValue = newValue;
					call ? call(cb, 3, args) : cb(...args);
				} finally {
					activeWatcher = currentWatcher;
				}
			}
		} else effect.run();
	};
	if (augmentJob) augmentJob(job);
	effect = new ReactiveEffect(getter);
	effect.scheduler = scheduler ? () => scheduler(job, false) : job;
	boundCleanup = (fn) => onWatcherCleanup(fn, false, effect);
	cleanup = effect.onStop = () => {
		const cleanups = cleanupMap.get(effect);
		if (cleanups) {
			if (call) call(cleanups, 4);
			else for (const cleanup2 of cleanups) cleanup2();
			cleanupMap.delete(effect);
		}
	};
	if (cb) if (immediate) job(true);
	else oldValue = effect.run();
	else if (scheduler) scheduler(job.bind(null, true), true);
	else effect.run();
	watchHandle.pause = effect.pause.bind(effect);
	watchHandle.resume = effect.resume.bind(effect);
	watchHandle.stop = watchHandle;
	return watchHandle;
}
function traverse(value, depth = Infinity, seen) {
	if (depth <= 0 || !isObject$2(value) || value["__v_skip"]) return value;
	seen = seen || /* @__PURE__ */ new Map();
	if ((seen.get(value) || 0) >= depth) return value;
	seen.set(value, depth);
	depth--;
	if (/* @__PURE__ */ isRef(value)) traverse(value.value, depth, seen);
	else if (isArray(value)) for (let i = 0; i < value.length; i++) traverse(value[i], depth, seen);
	else if (isSet(value) || isMap(value)) value.forEach((v) => {
		traverse(v, depth, seen);
	});
	else if (isPlainObject(value)) {
		for (const key in value) traverse(value[key], depth, seen);
		for (const key of Object.getOwnPropertySymbols(value)) if (Object.prototype.propertyIsEnumerable.call(value, key)) traverse(value[key], depth, seen);
	}
	return value;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
/**
* @vue/runtime-core v3.5.39
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function callWithErrorHandling(fn, instance, type, args) {
	try {
		return args ? fn(...args) : fn();
	} catch (err) {
		handleError(err, instance, type);
	}
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
	if (isFunction(fn)) {
		const res = callWithErrorHandling(fn, instance, type, args);
		if (res && isPromise(res)) res.catch((err) => {
			handleError(err, instance, type);
		});
		return res;
	}
	if (isArray(fn)) {
		const values = [];
		for (let i = 0; i < fn.length; i++) values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
		return values;
	}
}
function handleError(err, instance, type, throwInDev = true) {
	const contextVNode = instance ? instance.vnode : null;
	const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
	if (instance) {
		let cur = instance.parent;
		const exposedInstance = instance.proxy;
		const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
		while (cur) {
			const errorCapturedHooks = cur.ec;
			if (errorCapturedHooks) {
				for (let i = 0; i < errorCapturedHooks.length; i++) if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) return;
			}
			cur = cur.parent;
		}
		if (errorHandler) {
			pauseTracking();
			callWithErrorHandling(errorHandler, null, 10, [
				err,
				exposedInstance,
				errorInfo
			]);
			resetTracking();
			return;
		}
	}
	logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
}
function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
	if (throwInProd) throw err;
	else console.error(err);
}
var queue = [];
var flushIndex = -1;
var pendingPostFlushCbs = [];
var activePostFlushCbs = null;
var postFlushIndex = 0;
var resolvedPromise = /* @__PURE__ */ Promise.resolve();
var currentFlushPromise = null;
function nextTick$1(fn) {
	const p = currentFlushPromise || resolvedPromise;
	return fn ? p.then(this ? fn.bind(this) : fn) : p;
}
function findInsertionIndex(id) {
	let start = flushIndex + 1;
	let end = queue.length;
	while (start < end) {
		const middle = start + end >>> 1;
		const middleJob = queue[middle];
		const middleJobId = getId(middleJob);
		if (middleJobId < id || middleJobId === id && middleJob.flags & 2) start = middle + 1;
		else end = middle;
	}
	return start;
}
function queueJob(job) {
	if (!(job.flags & 1)) {
		const jobId = getId(job);
		const lastJob = queue[queue.length - 1];
		if (!lastJob || !(job.flags & 2) && jobId >= getId(lastJob)) queue.push(job);
		else queue.splice(findInsertionIndex(jobId), 0, job);
		job.flags |= 1;
		queueFlush();
	}
}
function queueFlush() {
	if (!currentFlushPromise) currentFlushPromise = resolvedPromise.then(flushJobs);
}
function queuePostFlushCb(cb) {
	if (!isArray(cb)) {
		if (activePostFlushCbs && cb.id === -1) activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
		else if (!(cb.flags & 1)) {
			pendingPostFlushCbs.push(cb);
			cb.flags |= 1;
		}
	} else pendingPostFlushCbs.push(...cb);
	queueFlush();
}
function flushPreFlushCbs(instance, seen, i = flushIndex + 1) {
	for (; i < queue.length; i++) {
		const cb = queue[i];
		if (cb && cb.flags & 2) {
			if (instance && cb.id !== instance.uid) continue;
			queue.splice(i, 1);
			i--;
			if (cb.flags & 4) cb.flags &= -2;
			cb();
			if (!(cb.flags & 4)) cb.flags &= -2;
		}
	}
}
function flushPostFlushCbs(seen) {
	if (pendingPostFlushCbs.length) {
		const deduped = [...new Set(pendingPostFlushCbs)].sort((a, b) => getId(a) - getId(b));
		pendingPostFlushCbs.length = 0;
		if (activePostFlushCbs) {
			activePostFlushCbs.push(...deduped);
			return;
		}
		activePostFlushCbs = deduped;
		for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
			const cb = activePostFlushCbs[postFlushIndex];
			if (cb.flags & 4) cb.flags &= -2;
			if (!(cb.flags & 8)) cb();
			cb.flags &= -2;
		}
		activePostFlushCbs = null;
		postFlushIndex = 0;
	}
}
var getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
function flushJobs(seen) {
	try {
		for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
			const job = queue[flushIndex];
			if (job && !(job.flags & 8)) {
				if (job.flags & 4) job.flags &= -2;
				callWithErrorHandling(job, job.i, job.i ? 15 : 14);
				if (!(job.flags & 4)) job.flags &= -2;
			}
		}
	} finally {
		for (; flushIndex < queue.length; flushIndex++) {
			const job = queue[flushIndex];
			if (job) job.flags &= -2;
		}
		flushIndex = -1;
		queue.length = 0;
		flushPostFlushCbs(seen);
		currentFlushPromise = null;
		if (queue.length || pendingPostFlushCbs.length) flushJobs(seen);
	}
}
var currentRenderingInstance = null;
var currentScopeId = null;
function setCurrentRenderingInstance(instance) {
	const prev = currentRenderingInstance;
	currentRenderingInstance = instance;
	currentScopeId = instance && instance.type.__scopeId || null;
	return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
	if (!ctx) return fn;
	if (fn._n) return fn;
	const renderFnWithContext = (...args) => {
		if (renderFnWithContext._d) setBlockTracking(-1);
		const prevInstance = setCurrentRenderingInstance(ctx);
		let res;
		try {
			res = fn(...args);
		} finally {
			setCurrentRenderingInstance(prevInstance);
			if (renderFnWithContext._d) setBlockTracking(1);
		}
		return res;
	};
	renderFnWithContext._n = true;
	renderFnWithContext._c = true;
	renderFnWithContext._d = true;
	return renderFnWithContext;
}
function withDirectives(vnode, directives) {
	if (currentRenderingInstance === null) return vnode;
	const instance = getComponentPublicInstance(currentRenderingInstance);
	const bindings = vnode.dirs || (vnode.dirs = []);
	for (let i = 0; i < directives.length; i++) {
		let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
		if (dir) {
			if (isFunction(dir)) dir = {
				mounted: dir,
				updated: dir
			};
			if (dir.deep) traverse(value);
			bindings.push({
				dir,
				instance,
				value,
				oldValue: void 0,
				arg,
				modifiers
			});
		}
	}
	return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
	const bindings = vnode.dirs;
	const oldBindings = prevVNode && prevVNode.dirs;
	for (let i = 0; i < bindings.length; i++) {
		const binding = bindings[i];
		if (oldBindings) binding.oldValue = oldBindings[i].value;
		let hook = binding.dir[name];
		if (hook) {
			pauseTracking();
			callWithAsyncErrorHandling(hook, instance, 8, [
				vnode.el,
				binding,
				vnode,
				prevVNode
			]);
			resetTracking();
		}
	}
}
function provide(key, value) {
	if (currentInstance) {
		let provides = currentInstance.provides;
		const parentProvides = currentInstance.parent && currentInstance.parent.provides;
		if (parentProvides === provides) provides = currentInstance.provides = Object.create(parentProvides);
		provides[key] = value;
	}
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
	const instance = getCurrentInstance();
	if (instance || currentApp) {
		let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
		if (provides && key in provides) return provides[key];
		else if (arguments.length > 1) return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
	}
}
var ssrContextKey = /* @__PURE__ */ Symbol.for("v-scx");
var useSSRContext = () => {
	{
		const ctx = inject(ssrContextKey);
		if (!ctx) {}
		return ctx;
	}
};
function watch(source, cb, options) {
	return doWatch(source, cb, options);
}
function doWatch(source, cb, options = EMPTY_OBJ) {
	const { immediate, deep, flush, once } = options;
	const baseWatchOptions = extend$2({}, options);
	const runsImmediately = cb && immediate || !cb && flush !== "post";
	let ssrCleanup;
	if (isInSSRComponentSetup) {
		if (flush === "sync") {
			const ctx = useSSRContext();
			ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
		} else if (!runsImmediately) {
			const watchStopHandle = () => {};
			watchStopHandle.stop = NOOP;
			watchStopHandle.resume = NOOP;
			watchStopHandle.pause = NOOP;
			return watchStopHandle;
		}
	}
	const instance = currentInstance;
	baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
	let isPre = false;
	if (flush === "post") baseWatchOptions.scheduler = (job) => {
		queuePostRenderEffect(job, instance && instance.suspense);
	};
	else if (flush !== "sync") {
		isPre = true;
		baseWatchOptions.scheduler = (job, isFirstRun) => {
			if (isFirstRun) job();
			else queueJob(job);
		};
	}
	baseWatchOptions.augmentJob = (job) => {
		if (cb) job.flags |= 4;
		if (isPre) {
			job.flags |= 2;
			if (instance) {
				job.id = instance.uid;
				job.i = instance;
			}
		}
	};
	const watchHandle = watch$1(source, cb, baseWatchOptions);
	if (isInSSRComponentSetup) {
		if (ssrCleanup) ssrCleanup.push(watchHandle);
		else if (runsImmediately) watchHandle();
	}
	return watchHandle;
}
function instanceWatch(source, value, options) {
	const publicThis = this.proxy;
	const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
	let cb;
	if (isFunction(value)) cb = value;
	else {
		cb = value.handler;
		options = value;
	}
	const reset = setCurrentInstance(this);
	const res = doWatch(getter, cb.bind(publicThis), options);
	reset();
	return res;
}
function createPathGetter(ctx, path) {
	const segments = path.split(".");
	return () => {
		let cur = ctx;
		for (let i = 0; i < segments.length && cur; i++) cur = cur[segments[i]];
		return cur;
	};
}
var TeleportEndKey = /* @__PURE__ */ Symbol("_vte");
var isTeleport = (type) => type.__isTeleport;
var leaveCbKey = /* @__PURE__ */ Symbol("_leaveCb");
function setTransitionHooks(vnode, hooks) {
	if (vnode.shapeFlag & 6 && vnode.component) {
		vnode.transition = hooks;
		setTransitionHooks(vnode.component.subTree, hooks);
	} else if (vnode.shapeFlag & 128) {
		vnode.ssContent.transition = hooks.clone(vnode.ssContent);
		vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
	} else vnode.transition = hooks;
}
// @__NO_SIDE_EFFECTS__
function defineComponent(options, extraOptions) {
	return isFunction(options) ? /* @__PURE__ */ (() => extend$2({ name: options.name }, extraOptions, { setup: options }))() : options;
}
function markAsyncBoundary(instance) {
	instance.ids = [
		instance.ids[0] + instance.ids[2]++ + "-",
		0,
		0
	];
}
function isTemplateRefKey(refs, key) {
	let desc;
	return !!((desc = Object.getOwnPropertyDescriptor(refs, key)) && !desc.configurable);
}
var pendingSetRefMap = /* @__PURE__ */ new WeakMap();
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
	if (isArray(rawRef)) {
		rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
		return;
	}
	if (isAsyncWrapper(vnode) && !isUnmount) {
		if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
		return;
	}
	const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
	const value = isUnmount ? null : refValue;
	const { i: owner, r: ref } = rawRef;
	const oldRef = oldRawRef && oldRawRef.r;
	const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
	const setupState = owner.setupState;
	const rawSetupState = /* @__PURE__ */ toRaw(setupState);
	const canSetSetupRef = setupState === EMPTY_OBJ ? NO : (key) => {
		if (isTemplateRefKey(refs, key)) return false;
		return hasOwn(rawSetupState, key);
	};
	const canSetRef = (ref2, key) => {
		if (key && isTemplateRefKey(refs, key)) return false;
		return true;
	};
	if (oldRef != null && oldRef !== ref) {
		invalidatePendingSetRef(oldRawRef);
		if (isString(oldRef)) {
			refs[oldRef] = null;
			if (canSetSetupRef(oldRef)) setupState[oldRef] = null;
		} else if (/* @__PURE__ */ isRef(oldRef)) {
			const oldRawRefAtom = oldRawRef;
			if (canSetRef(oldRef, oldRawRefAtom.k)) oldRef.value = null;
			if (oldRawRefAtom.k) refs[oldRawRefAtom.k] = null;
		}
	}
	if (isFunction(ref)) {
		pauseTracking();
		try {
			callWithErrorHandling(ref, owner, 12, [value, refs]);
		} finally {
			resetTracking();
		}
	} else {
		const _isString = isString(ref);
		const _isRef = /* @__PURE__ */ isRef(ref);
		if (_isString || _isRef) {
			const doSet = () => {
				if (rawRef.f) {
					const existing = _isString ? canSetSetupRef(ref) ? setupState[ref] : refs[ref] : canSetRef(ref) || !rawRef.k ? ref.value : refs[rawRef.k];
					if (isUnmount) isArray(existing) && remove(existing, refValue);
					else if (!isArray(existing)) if (_isString) {
						refs[ref] = [refValue];
						if (canSetSetupRef(ref)) setupState[ref] = refs[ref];
					} else {
						const newVal = [refValue];
						if (canSetRef(ref, rawRef.k)) ref.value = newVal;
						if (rawRef.k) refs[rawRef.k] = newVal;
					}
					else if (!existing.includes(refValue)) existing.push(refValue);
				} else if (_isString) {
					refs[ref] = value;
					if (canSetSetupRef(ref)) setupState[ref] = value;
				} else if (_isRef) {
					if (canSetRef(ref, rawRef.k)) ref.value = value;
					if (rawRef.k) refs[rawRef.k] = value;
				}
			};
			if (value) {
				const job = () => {
					doSet();
					pendingSetRefMap.delete(rawRef);
				};
				job.id = -1;
				pendingSetRefMap.set(rawRef, job);
				queuePostRenderEffect(job, parentSuspense);
			} else {
				invalidatePendingSetRef(rawRef);
				doSet();
			}
		}
	}
}
function invalidatePendingSetRef(rawRef) {
	const pendingSetRef = pendingSetRefMap.get(rawRef);
	if (pendingSetRef) {
		pendingSetRef.flags |= 8;
		pendingSetRefMap.delete(rawRef);
	}
}
getGlobalThis().requestIdleCallback;
getGlobalThis().cancelIdleCallback;
var isAsyncWrapper = (i) => !!i.type.__asyncLoader;
var isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
	registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
	registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
	const wrappedHook = hook.__wdc || (hook.__wdc = () => {
		let current = target;
		while (current) {
			if (current.isDeactivated) return;
			current = current.parent;
		}
		return hook();
	});
	injectHook(type, wrappedHook, target);
	if (target) {
		let current = target.parent;
		while (current && current.parent) {
			if (isKeepAlive(current.parent.vnode)) injectToKeepAliveRoot(wrappedHook, type, target, current);
			current = current.parent;
		}
	}
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
	const injected = injectHook(type, hook, keepAliveRoot, true);
	onUnmounted(() => {
		remove(keepAliveRoot[type], injected);
	}, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
	if (target) {
		const hooks = target[type] || (target[type] = []);
		const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
			pauseTracking();
			const reset = setCurrentInstance(target);
			const res = callWithAsyncErrorHandling(hook, target, type, args);
			reset();
			resetTracking();
			return res;
		});
		if (prepend) hooks.unshift(wrappedHook);
		else hooks.push(wrappedHook);
		return wrappedHook;
	}
}
var createHook = (lifecycle) => (hook, target = currentInstance) => {
	if (!isInSSRComponentSetup || lifecycle === "sp") injectHook(lifecycle, (...args) => hook(...args), target);
};
var onBeforeMount = createHook("bm");
var onMounted = createHook("m");
var onBeforeUpdate = createHook("bu");
var onUpdated = createHook("u");
var onBeforeUnmount = createHook("bum");
var onUnmounted = createHook("um");
var onServerPrefetch = createHook("sp");
var onRenderTriggered = createHook("rtg");
var onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target = currentInstance) {
	injectHook("ec", hook, target);
}
var NULL_DYNAMIC_COMPONENT = /* @__PURE__ */ Symbol.for("v-ndc");
function renderList(source, renderItem, cache, index) {
	let ret;
	const cached = cache && cache[index];
	const sourceIsArray = isArray(source);
	if (sourceIsArray || isString(source)) {
		const sourceIsReactiveArray = sourceIsArray && /* @__PURE__ */ isReactive(source);
		let needsWrap = false;
		let isReadonlySource = false;
		if (sourceIsReactiveArray) {
			needsWrap = !/* @__PURE__ */ isShallow(source);
			isReadonlySource = /* @__PURE__ */ isReadonly(source);
			source = shallowReadArray(source);
		}
		ret = new Array(source.length);
		for (let i = 0, l = source.length; i < l; i++) ret[i] = renderItem(needsWrap ? isReadonlySource ? toReadonly(toReactive(source[i])) : toReactive(source[i]) : source[i], i, void 0, cached && cached[i]);
	} else if (typeof source === "number") {
		ret = new Array(source);
		for (let i = 0; i < source; i++) ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
	} else if (isObject$2(source)) if (source[Symbol.iterator]) ret = Array.from(source, (item, i) => renderItem(item, i, void 0, cached && cached[i]));
	else {
		const keys = Object.keys(source);
		ret = new Array(keys.length);
		for (let i = 0, l = keys.length; i < l; i++) {
			const key = keys[i];
			ret[i] = renderItem(source[key], key, i, cached && cached[i]);
		}
	}
	else ret = [];
	if (cache) cache[index] = ret;
	return ret;
}
var getPublicInstance = (i) => {
	if (!i) return null;
	if (isStatefulComponent(i)) return getComponentPublicInstance(i);
	return getPublicInstance(i.parent);
};
var publicPropertiesMap = /* @__PURE__ */ extend$2(/* @__PURE__ */ Object.create(null), {
	$: (i) => i,
	$el: (i) => i.vnode.el,
	$data: (i) => i.data,
	$props: (i) => i.props,
	$attrs: (i) => i.attrs,
	$slots: (i) => i.slots,
	$refs: (i) => i.refs,
	$parent: (i) => getPublicInstance(i.parent),
	$root: (i) => getPublicInstance(i.root),
	$host: (i) => i.ce,
	$emit: (i) => i.emit,
	$options: (i) => resolveMergedOptions(i),
	$forceUpdate: (i) => i.f || (i.f = () => {
		queueJob(i.update);
	}),
	$nextTick: (i) => i.n || (i.n = nextTick$1.bind(i.proxy)),
	$watch: (i) => instanceWatch.bind(i)
});
var hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
var PublicInstanceProxyHandlers = {
	get({ _: instance }, key) {
		if (key === "__v_skip") return true;
		const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
		if (key[0] !== "$") {
			const n = accessCache[key];
			if (n !== void 0) switch (n) {
				case 1: return setupState[key];
				case 2: return data[key];
				case 4: return ctx[key];
				case 3: return props[key];
			}
			else if (hasSetupBinding(setupState, key)) {
				accessCache[key] = 1;
				return setupState[key];
			} else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
				accessCache[key] = 2;
				return data[key];
			} else if (hasOwn(props, key)) {
				accessCache[key] = 3;
				return props[key];
			} else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
				accessCache[key] = 4;
				return ctx[key];
			} else if (shouldCacheAccess) accessCache[key] = 0;
		}
		const publicGetter = publicPropertiesMap[key];
		let cssModule, globalProperties;
		if (publicGetter) {
			if (key === "$attrs") track(instance.attrs, "get", "");
			return publicGetter(instance);
		} else if ((cssModule = type.__cssModules) && (cssModule = cssModule[key])) return cssModule;
		else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
			accessCache[key] = 4;
			return ctx[key];
		} else if (globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) return globalProperties[key];
	},
	set({ _: instance }, key, value) {
		const { data, setupState, ctx } = instance;
		if (hasSetupBinding(setupState, key)) {
			setupState[key] = value;
			return true;
		} else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
			data[key] = value;
			return true;
		} else if (hasOwn(instance.props, key)) return false;
		if (key[0] === "$" && key.slice(1) in instance) return false;
		else ctx[key] = value;
		return true;
	},
	has({ _: { data, setupState, accessCache, ctx, appContext, props, type } }, key) {
		let cssModules;
		return !!(accessCache[key] || data !== EMPTY_OBJ && key[0] !== "$" && hasOwn(data, key) || hasSetupBinding(setupState, key) || hasOwn(props, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key) || (cssModules = type.__cssModules) && cssModules[key]);
	},
	defineProperty(target, key, descriptor) {
		if (descriptor.get != null) target._.accessCache[key] = 0;
		else if (hasOwn(descriptor, "value")) this.set(target, key, descriptor.value, null);
		return Reflect.defineProperty(target, key, descriptor);
	}
};
function normalizePropsOrEmits(props) {
	return isArray(props) ? props.reduce((normalized, p) => (normalized[p] = null, normalized), {}) : props;
}
var shouldCacheAccess = true;
function applyOptions(instance) {
	const options = resolveMergedOptions(instance);
	const publicThis = instance.proxy;
	const ctx = instance.ctx;
	shouldCacheAccess = false;
	if (options.beforeCreate) callHook(options.beforeCreate, instance, "bc");
	const { data: dataOptions, computed: computedOptions, methods, watch: watchOptions, provide: provideOptions, inject: injectOptions, created, beforeMount, mounted, beforeUpdate, updated, activated, deactivated, beforeDestroy, beforeUnmount, destroyed, unmounted, render, renderTracked, renderTriggered, errorCaptured, serverPrefetch, expose, inheritAttrs, components, directives, filters } = options;
	const checkDuplicateProperties = null;
	if (injectOptions) resolveInjections(injectOptions, ctx, checkDuplicateProperties);
	if (methods) for (const key in methods) {
		const methodHandler = methods[key];
		if (isFunction(methodHandler)) ctx[key] = methodHandler.bind(publicThis);
	}
	if (dataOptions) {
		const data = dataOptions.call(publicThis, publicThis);
		if (!isObject$2(data)) {} else instance.data = /* @__PURE__ */ reactive(data);
	}
	shouldCacheAccess = true;
	if (computedOptions) for (const key in computedOptions) {
		const opt = computedOptions[key];
		const c = computed({
			get: isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP,
			set: !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP
		});
		Object.defineProperty(ctx, key, {
			enumerable: true,
			configurable: true,
			get: () => c.value,
			set: (v) => c.value = v
		});
	}
	if (watchOptions) for (const key in watchOptions) createWatcher(watchOptions[key], ctx, publicThis, key);
	if (provideOptions) {
		const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
		Reflect.ownKeys(provides).forEach((key) => {
			provide(key, provides[key]);
		});
	}
	if (created) callHook(created, instance, "c");
	function registerLifecycleHook(register, hook) {
		if (isArray(hook)) hook.forEach((_hook) => register(_hook.bind(publicThis)));
		else if (hook) register(hook.bind(publicThis));
	}
	registerLifecycleHook(onBeforeMount, beforeMount);
	registerLifecycleHook(onMounted, mounted);
	registerLifecycleHook(onBeforeUpdate, beforeUpdate);
	registerLifecycleHook(onUpdated, updated);
	registerLifecycleHook(onActivated, activated);
	registerLifecycleHook(onDeactivated, deactivated);
	registerLifecycleHook(onErrorCaptured, errorCaptured);
	registerLifecycleHook(onRenderTracked, renderTracked);
	registerLifecycleHook(onRenderTriggered, renderTriggered);
	registerLifecycleHook(onBeforeUnmount, beforeUnmount);
	registerLifecycleHook(onUnmounted, unmounted);
	registerLifecycleHook(onServerPrefetch, serverPrefetch);
	if (isArray(expose)) {
		if (expose.length) {
			const exposed = instance.exposed || (instance.exposed = {});
			expose.forEach((key) => {
				Object.defineProperty(exposed, key, {
					get: () => publicThis[key],
					set: (val) => publicThis[key] = val,
					enumerable: true
				});
			});
		} else if (!instance.exposed) instance.exposed = {};
	}
	if (render && instance.render === NOOP) instance.render = render;
	if (inheritAttrs != null) instance.inheritAttrs = inheritAttrs;
	if (components) instance.components = components;
	if (directives) instance.directives = directives;
	if (serverPrefetch) markAsyncBoundary(instance);
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
	if (isArray(injectOptions)) injectOptions = normalizeInject(injectOptions);
	for (const key in injectOptions) {
		const opt = injectOptions[key];
		let injected;
		if (isObject$2(opt)) if ("default" in opt) injected = inject(opt.from || key, opt.default, true);
		else injected = inject(opt.from || key);
		else injected = inject(opt);
		if (/* @__PURE__ */ isRef(injected)) Object.defineProperty(ctx, key, {
			enumerable: true,
			configurable: true,
			get: () => injected.value,
			set: (v) => injected.value = v
		});
		else ctx[key] = injected;
	}
}
function callHook(hook, instance, type) {
	callWithAsyncErrorHandling(isArray(hook) ? hook.map((h) => h.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type);
}
function createWatcher(raw, ctx, publicThis, key) {
	let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
	if (isString(raw)) {
		const handler = ctx[raw];
		if (isFunction(handler)) watch(getter, handler);
	} else if (isFunction(raw)) watch(getter, raw.bind(publicThis));
	else if (isObject$2(raw)) if (isArray(raw)) raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
	else {
		const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
		if (isFunction(handler)) watch(getter, handler, raw);
	}
}
function resolveMergedOptions(instance) {
	const base = instance.type;
	const { mixins, extends: extendsOptions } = base;
	const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance.appContext;
	const cached = cache.get(base);
	let resolved;
	if (cached) resolved = cached;
	else if (!globalMixins.length && !mixins && !extendsOptions) resolved = base;
	else {
		resolved = {};
		if (globalMixins.length) globalMixins.forEach((m) => mergeOptions(resolved, m, optionMergeStrategies, true));
		mergeOptions(resolved, base, optionMergeStrategies);
	}
	if (isObject$2(base)) cache.set(base, resolved);
	return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
	const { mixins, extends: extendsOptions } = from;
	if (extendsOptions) mergeOptions(to, extendsOptions, strats, true);
	if (mixins) mixins.forEach((m) => mergeOptions(to, m, strats, true));
	for (const key in from) if (asMixin && key === "expose") {} else {
		const strat = internalOptionMergeStrats[key] || strats && strats[key];
		to[key] = strat ? strat(to[key], from[key]) : from[key];
	}
	return to;
}
var internalOptionMergeStrats = {
	data: mergeDataFn,
	props: mergeEmitsOrPropsOptions,
	emits: mergeEmitsOrPropsOptions,
	methods: mergeObjectOptions,
	computed: mergeObjectOptions,
	beforeCreate: mergeAsArray,
	created: mergeAsArray,
	beforeMount: mergeAsArray,
	mounted: mergeAsArray,
	beforeUpdate: mergeAsArray,
	updated: mergeAsArray,
	beforeDestroy: mergeAsArray,
	beforeUnmount: mergeAsArray,
	destroyed: mergeAsArray,
	unmounted: mergeAsArray,
	activated: mergeAsArray,
	deactivated: mergeAsArray,
	errorCaptured: mergeAsArray,
	serverPrefetch: mergeAsArray,
	components: mergeObjectOptions,
	directives: mergeObjectOptions,
	watch: mergeWatchOptions,
	provide: mergeDataFn,
	inject: mergeInject
};
function mergeDataFn(to, from) {
	if (!from) return to;
	if (!to) return from;
	return function mergedDataFn() {
		return extend$2(isFunction(to) ? to.call(this, this) : to, isFunction(from) ? from.call(this, this) : from);
	};
}
function mergeInject(to, from) {
	return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
	if (isArray(raw)) {
		const res = {};
		for (let i = 0; i < raw.length; i++) res[raw[i]] = raw[i];
		return res;
	}
	return raw;
}
function mergeAsArray(to, from) {
	return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
	return to ? extend$2(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
	if (to) {
		if (isArray(to) && isArray(from)) return [.../* @__PURE__ */ new Set([...to, ...from])];
		return extend$2(/* @__PURE__ */ Object.create(null), normalizePropsOrEmits(to), normalizePropsOrEmits(from != null ? from : {}));
	} else return from;
}
function mergeWatchOptions(to, from) {
	if (!to) return from;
	if (!from) return to;
	const merged = extend$2(/* @__PURE__ */ Object.create(null), to);
	for (const key in from) merged[key] = mergeAsArray(to[key], from[key]);
	return merged;
}
function createAppContext() {
	return {
		app: null,
		config: {
			isNativeTag: NO,
			performance: false,
			globalProperties: {},
			optionMergeStrategies: {},
			errorHandler: void 0,
			warnHandler: void 0,
			compilerOptions: {}
		},
		mixins: [],
		components: {},
		directives: {},
		provides: /* @__PURE__ */ Object.create(null),
		optionsCache: /* @__PURE__ */ new WeakMap(),
		propsCache: /* @__PURE__ */ new WeakMap(),
		emitsCache: /* @__PURE__ */ new WeakMap()
	};
}
var uid$1 = 0;
function createAppAPI(render, hydrate) {
	return function createApp(rootComponent, rootProps = null) {
		if (!isFunction(rootComponent)) rootComponent = extend$2({}, rootComponent);
		if (rootProps != null && !isObject$2(rootProps)) rootProps = null;
		const context = createAppContext();
		const installedPlugins = /* @__PURE__ */ new WeakSet();
		const pluginCleanupFns = [];
		let isMounted = false;
		const app = context.app = {
			_uid: uid$1++,
			_component: rootComponent,
			_props: rootProps,
			_container: null,
			_context: context,
			_instance: null,
			version,
			get config() {
				return context.config;
			},
			set config(v) {},
			use(plugin, ...options) {
				if (installedPlugins.has(plugin)) {} else if (plugin && isFunction(plugin.install)) {
					installedPlugins.add(plugin);
					plugin.install(app, ...options);
				} else if (isFunction(plugin)) {
					installedPlugins.add(plugin);
					plugin(app, ...options);
				}
				return app;
			},
			mixin(mixin) {
				if (!context.mixins.includes(mixin)) context.mixins.push(mixin);
				return app;
			},
			component(name, component) {
				if (!component) return context.components[name];
				context.components[name] = component;
				return app;
			},
			directive(name, directive) {
				if (!directive) return context.directives[name];
				context.directives[name] = directive;
				return app;
			},
			mount(rootContainer, isHydrate, namespace) {
				if (!isMounted) {
					const vnode = app._ceVNode || createVNode(rootComponent, rootProps);
					vnode.appContext = context;
					if (namespace === true) namespace = "svg";
					else if (namespace === false) namespace = void 0;
					if (isHydrate && hydrate) hydrate(vnode, rootContainer);
					else render(vnode, rootContainer, namespace);
					isMounted = true;
					app._container = rootContainer;
					rootContainer.__vue_app__ = app;
					return getComponentPublicInstance(vnode.component);
				}
			},
			onUnmount(cleanupFn) {
				pluginCleanupFns.push(cleanupFn);
			},
			unmount() {
				if (isMounted) {
					callWithAsyncErrorHandling(pluginCleanupFns, app._instance, 16);
					render(null, app._container);
					delete app._container.__vue_app__;
				}
			},
			provide(key, value) {
				context.provides[key] = value;
				return app;
			},
			runWithContext(fn) {
				const lastApp = currentApp;
				currentApp = app;
				try {
					return fn();
				} finally {
					currentApp = lastApp;
				}
			}
		};
		return app;
	};
}
var currentApp = null;
var getModelModifiers = (props, modelName) => {
	return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
};
function emit(instance, event, ...rawArgs) {
	if (instance.isUnmounted) return;
	const props = instance.vnode.props || EMPTY_OBJ;
	let args = rawArgs;
	const isModelListener = event.startsWith("update:");
	const modifiers = isModelListener && getModelModifiers(props, event.slice(7));
	if (modifiers) {
		if (modifiers.trim) args = rawArgs.map((a) => isString(a) ? a.trim() : a);
		if (modifiers.number) args = rawArgs.map(looseToNumber);
	}
	let handlerName;
	let handler = props[handlerName = toHandlerKey(event)] || props[handlerName = toHandlerKey(camelize(event))];
	if (!handler && isModelListener) handler = props[handlerName = toHandlerKey(hyphenate(event))];
	if (handler) callWithAsyncErrorHandling(handler, instance, 6, args);
	const onceHandler = props[handlerName + `Once`];
	if (onceHandler) {
		if (!instance.emitted) instance.emitted = {};
		else if (instance.emitted[handlerName]) return;
		instance.emitted[handlerName] = true;
		callWithAsyncErrorHandling(onceHandler, instance, 6, args);
	}
}
var mixinEmitsCache = /* @__PURE__ */ new WeakMap();
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
	const cache = asMixin ? mixinEmitsCache : appContext.emitsCache;
	const cached = cache.get(comp);
	if (cached !== void 0) return cached;
	const raw = comp.emits;
	let normalized = {};
	let hasExtends = false;
	if (!isFunction(comp)) {
		const extendEmits = (raw2) => {
			const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
			if (normalizedFromExtend) {
				hasExtends = true;
				extend$2(normalized, normalizedFromExtend);
			}
		};
		if (!asMixin && appContext.mixins.length) appContext.mixins.forEach(extendEmits);
		if (comp.extends) extendEmits(comp.extends);
		if (comp.mixins) comp.mixins.forEach(extendEmits);
	}
	if (!raw && !hasExtends) {
		if (isObject$2(comp)) cache.set(comp, null);
		return null;
	}
	if (isArray(raw)) raw.forEach((key) => normalized[key] = null);
	else extend$2(normalized, raw);
	if (isObject$2(comp)) cache.set(comp, normalized);
	return normalized;
}
function isEmitListener(options, key) {
	if (!options || !isOn(key)) return false;
	key = key.slice(2);
	key = key === "Once" ? key : key.replace(/Once$/, "");
	return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
function renderComponentRoot(instance) {
	const { type: Component, vnode, proxy, withProxy, propsOptions: [propsOptions], slots, attrs, emit, render, renderCache, props, data, setupState, ctx, inheritAttrs } = instance;
	const prev = setCurrentRenderingInstance(instance);
	let result;
	let fallthroughAttrs;
	try {
		if (vnode.shapeFlag & 4) {
			const proxyToUse = withProxy || proxy;
			const thisProxy = proxyToUse;
			result = normalizeVNode(render.call(thisProxy, proxyToUse, renderCache, props, setupState, data, ctx));
			fallthroughAttrs = attrs;
		} else {
			const render2 = Component;
			result = normalizeVNode(render2.length > 1 ? render2(props, {
				attrs,
				slots,
				emit
			}) : render2(props, null));
			fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
		}
	} catch (err) {
		blockStack.length = 0;
		handleError(err, instance, 1);
		result = createVNode(Comment);
	}
	let root = result;
	if (fallthroughAttrs && inheritAttrs !== false) {
		const keys = Object.keys(fallthroughAttrs);
		const { shapeFlag } = root;
		if (keys.length) {
			if (shapeFlag & 7) {
				if (propsOptions && keys.some(isModelListener)) fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
				root = cloneVNode(root, fallthroughAttrs, false, true);
			}
		}
	}
	if (vnode.dirs) {
		root = cloneVNode(root, null, false, true);
		root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
	}
	if (vnode.transition) setTransitionHooks(root, vnode.transition);
	result = root;
	setCurrentRenderingInstance(prev);
	return result;
}
var getFunctionalFallthrough = (attrs) => {
	let res;
	for (const key in attrs) if (key === "class" || key === "style" || isOn(key)) (res || (res = {}))[key] = attrs[key];
	return res;
};
var filterModelListeners = (attrs, props) => {
	const res = {};
	for (const key in attrs) if (!isModelListener(key) || !(key.slice(9) in props)) res[key] = attrs[key];
	return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
	const { props: prevProps, children: prevChildren, component } = prevVNode;
	const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
	const emits = component.emitsOptions;
	if (nextVNode.dirs || nextVNode.transition) return true;
	if (optimized && patchFlag >= 0) {
		if (patchFlag & 1024) return true;
		if (patchFlag & 16) {
			if (!prevProps) return !!nextProps;
			return hasPropsChanged(prevProps, nextProps, emits);
		} else if (patchFlag & 8) {
			const dynamicProps = nextVNode.dynamicProps;
			for (let i = 0; i < dynamicProps.length; i++) {
				const key = dynamicProps[i];
				if (hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emits, key)) return true;
			}
		}
	} else {
		if (prevChildren || nextChildren) {
			if (!nextChildren || !nextChildren.$stable) return true;
		}
		if (prevProps === nextProps) return false;
		if (!prevProps) return !!nextProps;
		if (!nextProps) return true;
		return hasPropsChanged(prevProps, nextProps, emits);
	}
	return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
	const nextKeys = Object.keys(nextProps);
	if (nextKeys.length !== Object.keys(prevProps).length) return true;
	for (let i = 0; i < nextKeys.length; i++) {
		const key = nextKeys[i];
		if (hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emitsOptions, key)) return true;
	}
	return false;
}
function hasPropValueChanged(nextProps, prevProps, key) {
	const nextProp = nextProps[key];
	const prevProp = prevProps[key];
	if (key === "style" && isObject$2(nextProp) && isObject$2(prevProp)) return !looseEqual(nextProp, prevProp);
	return nextProp !== prevProp;
}
function updateHOCHostEl({ vnode, parent, suspense }, el) {
	while (parent) {
		const root = parent.subTree;
		if (root.suspense && root.suspense.activeBranch === vnode) {
			root.suspense.vnode.el = root.el = el;
			vnode = root;
		}
		if (root === vnode) {
			(vnode = parent.vnode).el = el;
			parent = parent.parent;
		} else break;
	}
	if (suspense && suspense.activeBranch === vnode) suspense.vnode.el = el;
}
var internalObjectProto = {};
var createInternalObject = () => Object.create(internalObjectProto);
var isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
function initProps(instance, rawProps, isStateful, isSSR = false) {
	const props = {};
	const attrs = createInternalObject();
	instance.propsDefaults = /* @__PURE__ */ Object.create(null);
	setFullProps(instance, rawProps, props, attrs);
	for (const key in instance.propsOptions[0]) if (!(key in props)) props[key] = void 0;
	if (isStateful) instance.props = isSSR ? props : /* @__PURE__ */ shallowReactive(props);
	else if (!instance.type.props) instance.props = attrs;
	else instance.props = props;
	instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
	const { props, attrs, vnode: { patchFlag } } = instance;
	const rawCurrentProps = /* @__PURE__ */ toRaw(props);
	const [options] = instance.propsOptions;
	let hasAttrsChanged = false;
	if ((optimized || patchFlag > 0) && !(patchFlag & 16)) {
		if (patchFlag & 8) {
			const propsToUpdate = instance.vnode.dynamicProps;
			for (let i = 0; i < propsToUpdate.length; i++) {
				let key = propsToUpdate[i];
				if (isEmitListener(instance.emitsOptions, key)) continue;
				const value = rawProps[key];
				if (options) if (hasOwn(attrs, key)) {
					if (value !== attrs[key]) {
						attrs[key] = value;
						hasAttrsChanged = true;
					}
				} else {
					const camelizedKey = camelize(key);
					props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance, false);
				}
				else if (value !== attrs[key]) {
					attrs[key] = value;
					hasAttrsChanged = true;
				}
			}
		}
	} else {
		if (setFullProps(instance, rawProps, props, attrs)) hasAttrsChanged = true;
		let kebabKey;
		for (const key in rawCurrentProps) if (!rawProps || !hasOwn(rawProps, key) && ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) if (options) {
			if (rawPrevProps && (rawPrevProps[key] !== void 0 || rawPrevProps[kebabKey] !== void 0)) props[key] = resolvePropValue(options, rawCurrentProps, key, void 0, instance, true);
		} else delete props[key];
		if (attrs !== rawCurrentProps) {
			for (const key in attrs) if (!rawProps || !hasOwn(rawProps, key) && true) {
				delete attrs[key];
				hasAttrsChanged = true;
			}
		}
	}
	if (hasAttrsChanged) trigger(instance.attrs, "set", "");
}
function setFullProps(instance, rawProps, props, attrs) {
	const [options, needCastKeys] = instance.propsOptions;
	let hasAttrsChanged = false;
	let rawCastValues;
	if (rawProps) for (let key in rawProps) {
		if (isReservedProp(key)) continue;
		const value = rawProps[key];
		let camelKey;
		if (options && hasOwn(options, camelKey = camelize(key))) if (!needCastKeys || !needCastKeys.includes(camelKey)) props[camelKey] = value;
		else (rawCastValues || (rawCastValues = {}))[camelKey] = value;
		else if (!isEmitListener(instance.emitsOptions, key)) {
			if (!(key in attrs) || value !== attrs[key]) {
				attrs[key] = value;
				hasAttrsChanged = true;
			}
		}
	}
	if (needCastKeys) {
		const rawCurrentProps = /* @__PURE__ */ toRaw(props);
		const castValues = rawCastValues || EMPTY_OBJ;
		for (let i = 0; i < needCastKeys.length; i++) {
			const key = needCastKeys[i];
			props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !hasOwn(castValues, key));
		}
	}
	return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
	const opt = options[key];
	if (opt != null) {
		const hasDefault = hasOwn(opt, "default");
		if (hasDefault && value === void 0) {
			const defaultValue = opt.default;
			if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
				const { propsDefaults } = instance;
				if (key in propsDefaults) value = propsDefaults[key];
				else {
					const reset = setCurrentInstance(instance);
					value = propsDefaults[key] = defaultValue.call(null, props);
					reset();
				}
			} else value = defaultValue;
			if (instance.ce) instance.ce._setProp(key, value);
		}
		if (opt[0]) {
			if (isAbsent && !hasDefault) value = false;
			else if (opt[1] && (value === "" || value === hyphenate(key))) value = true;
		}
	}
	return value;
}
var mixinPropsCache = /* @__PURE__ */ new WeakMap();
function normalizePropsOptions(comp, appContext, asMixin = false) {
	const cache = asMixin ? mixinPropsCache : appContext.propsCache;
	const cached = cache.get(comp);
	if (cached) return cached;
	const raw = comp.props;
	const normalized = {};
	const needCastKeys = [];
	let hasExtends = false;
	if (!isFunction(comp)) {
		const extendProps = (raw2) => {
			hasExtends = true;
			const [props, keys] = normalizePropsOptions(raw2, appContext, true);
			extend$2(normalized, props);
			if (keys) needCastKeys.push(...keys);
		};
		if (!asMixin && appContext.mixins.length) appContext.mixins.forEach(extendProps);
		if (comp.extends) extendProps(comp.extends);
		if (comp.mixins) comp.mixins.forEach(extendProps);
	}
	if (!raw && !hasExtends) {
		if (isObject$2(comp)) cache.set(comp, EMPTY_ARR);
		return EMPTY_ARR;
	}
	if (isArray(raw)) for (let i = 0; i < raw.length; i++) {
		const normalizedKey = camelize(raw[i]);
		if (validatePropName(normalizedKey)) normalized[normalizedKey] = EMPTY_OBJ;
	}
	else if (raw) for (const key in raw) {
		const normalizedKey = camelize(key);
		if (validatePropName(normalizedKey)) {
			const opt = raw[key];
			const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend$2({}, opt);
			const propType = prop.type;
			let shouldCast = false;
			let shouldCastTrue = true;
			if (isArray(propType)) for (let index = 0; index < propType.length; ++index) {
				const type = propType[index];
				const typeName = isFunction(type) && type.name;
				if (typeName === "Boolean") {
					shouldCast = true;
					break;
				} else if (typeName === "String") shouldCastTrue = false;
			}
			else shouldCast = isFunction(propType) && propType.name === "Boolean";
			prop[0] = shouldCast;
			prop[1] = shouldCastTrue;
			if (shouldCast || hasOwn(prop, "default")) needCastKeys.push(normalizedKey);
		}
	}
	const res = [normalized, needCastKeys];
	if (isObject$2(comp)) cache.set(comp, res);
	return res;
}
function validatePropName(key) {
	if (key[0] !== "$" && !isReservedProp(key)) return true;
	return false;
}
var isInternalKey = (key) => key === "_" || key === "_ctx" || key === "$stable";
var normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
var normalizeSlot = (key, rawSlot, ctx) => {
	if (rawSlot._n) return rawSlot;
	const normalized = withCtx((...args) => {
		return normalizeSlotValue(rawSlot(...args));
	}, ctx);
	normalized._c = false;
	return normalized;
};
var normalizeObjectSlots = (rawSlots, slots, instance) => {
	const ctx = rawSlots._ctx;
	for (const key in rawSlots) {
		if (isInternalKey(key)) continue;
		const value = rawSlots[key];
		if (isFunction(value)) slots[key] = normalizeSlot(key, value, ctx);
		else if (value != null) {
			const normalized = normalizeSlotValue(value);
			slots[key] = () => normalized;
		}
	}
};
var normalizeVNodeSlots = (instance, children) => {
	const normalized = normalizeSlotValue(children);
	instance.slots.default = () => normalized;
};
var assignSlots = (slots, children, optimized) => {
	for (const key in children) if (optimized || !isInternalKey(key)) slots[key] = children[key];
};
var initSlots = (instance, children, optimized) => {
	const slots = instance.slots = createInternalObject();
	if (instance.vnode.shapeFlag & 32) {
		const type = children._;
		if (type) {
			assignSlots(slots, children, optimized);
			if (optimized) def(slots, "_", type, true);
		} else normalizeObjectSlots(children, slots);
	} else if (children) normalizeVNodeSlots(instance, children);
};
var updateSlots = (instance, children, optimized) => {
	const { vnode, slots } = instance;
	let needDeletionCheck = true;
	let deletionComparisonTarget = EMPTY_OBJ;
	if (vnode.shapeFlag & 32) {
		const type = children._;
		if (type) if (optimized && type === 1) needDeletionCheck = false;
		else assignSlots(slots, children, optimized);
		else {
			needDeletionCheck = !children.$stable;
			normalizeObjectSlots(children, slots);
		}
		deletionComparisonTarget = children;
	} else if (children) {
		normalizeVNodeSlots(instance, children);
		deletionComparisonTarget = { default: 1 };
	}
	if (needDeletionCheck) {
		for (const key in slots) if (!isInternalKey(key) && deletionComparisonTarget[key] == null) delete slots[key];
	}
};
var queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
	return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
	const target = getGlobalThis();
	target.__VUE__ = true;
	const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, insertStaticContent: hostInsertStaticContent } = options;
	const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
		if (n1 === n2) return;
		if (n1 && !isSameVNodeType(n1, n2)) {
			anchor = getNextHostNode(n1);
			unmount(n1, parentComponent, parentSuspense, true);
			n1 = null;
		}
		if (n2.patchFlag === -2) {
			optimized = false;
			n2.dynamicChildren = null;
		}
		const { type, ref, shapeFlag } = n2;
		switch (type) {
			case Text:
				processText(n1, n2, container, anchor);
				break;
			case Comment:
				processCommentNode(n1, n2, container, anchor);
				break;
			case Static:
				if (n1 == null) mountStaticNode(n2, container, anchor, namespace);
				break;
			case Fragment:
				processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				break;
			default: if (shapeFlag & 1) processElement(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			else if (shapeFlag & 6) processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			else if (shapeFlag & 64) type.process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals);
			else if (shapeFlag & 128) type.process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals);
		}
		if (ref != null && parentComponent) setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
		else if (ref == null && n1 && n1.ref != null) setRef(n1.ref, null, parentSuspense, n1, true);
	};
	const processText = (n1, n2, container, anchor) => {
		if (n1 == null) hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
		else {
			const el = n2.el = n1.el;
			if (n2.children !== n1.children) hostSetText(el, n2.children);
		}
	};
	const processCommentNode = (n1, n2, container, anchor) => {
		if (n1 == null) hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
		else n2.el = n1.el;
	};
	const mountStaticNode = (n2, container, anchor, namespace) => {
		[n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, namespace, n2.el, n2.anchor);
	};
	const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
		let next;
		while (el && el !== anchor) {
			next = hostNextSibling(el);
			hostInsert(el, container, nextSibling);
			el = next;
		}
		hostInsert(anchor, container, nextSibling);
	};
	const removeStaticNode = ({ el, anchor }) => {
		let next;
		while (el && el !== anchor) {
			next = hostNextSibling(el);
			hostRemove(el);
			el = next;
		}
		hostRemove(anchor);
	};
	const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		if (n2.type === "svg") namespace = "svg";
		else if (n2.type === "math") namespace = "mathml";
		if (n1 == null) mountElement(n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		else {
			const customElement = n1.el && n1.el._isVueCE ? n1.el : null;
			try {
				if (customElement) customElement._beginPatch();
				patchElement(n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			} finally {
				if (customElement) customElement._endPatch();
			}
		}
	};
	const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		let el;
		let vnodeHook;
		const { props, shapeFlag, transition, dirs } = vnode;
		el = vnode.el = hostCreateElement(vnode.type, namespace, props && props.is, props);
		if (shapeFlag & 8) hostSetElementText(el, vnode.children);
		else if (shapeFlag & 16) mountChildren(vnode.children, el, null, parentComponent, parentSuspense, resolveChildrenNamespace(vnode, namespace), slotScopeIds, optimized);
		if (dirs) invokeDirectiveHook(vnode, null, parentComponent, "created");
		setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
		if (props) {
			for (const key in props) if (key !== "value" && !isReservedProp(key)) hostPatchProp(el, key, null, props[key], namespace, parentComponent);
			if ("value" in props) hostPatchProp(el, "value", null, props.value, namespace);
			if (vnodeHook = props.onVnodeBeforeMount) invokeVNodeHook(vnodeHook, parentComponent, vnode);
		}
		if (dirs) invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
		const needCallTransitionHooks = needTransition(parentSuspense, transition);
		if (needCallTransitionHooks) transition.beforeEnter(el);
		hostInsert(el, container, anchor);
		if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) queuePostRenderEffect(() => {
			try {
				vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
				needCallTransitionHooks && transition.enter(el);
				dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
			} finally {}
		}, parentSuspense);
	};
	const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
		if (scopeId) hostSetScopeId(el, scopeId);
		if (slotScopeIds) for (let i = 0; i < slotScopeIds.length; i++) hostSetScopeId(el, slotScopeIds[i]);
		if (parentComponent) {
			let subTree = parentComponent.subTree;
			if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
				const parentVNode = parentComponent.vnode;
				setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
			}
		}
	};
	const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
		for (let i = start; i < children.length; i++) {
			const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
			patch(null, child, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		}
	};
	const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		const el = n2.el = n1.el;
		let { patchFlag, dynamicChildren, dirs } = n2;
		patchFlag |= n1.patchFlag & 16;
		const oldProps = n1.props || EMPTY_OBJ;
		const newProps = n2.props || EMPTY_OBJ;
		let vnodeHook;
		parentComponent && toggleRecurse(parentComponent, false);
		if (vnodeHook = newProps.onVnodeBeforeUpdate) invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
		if (dirs) invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
		parentComponent && toggleRecurse(parentComponent, true);
		if (dynamicChildren && (!n1.dynamicChildren || n1.dynamicChildren.length !== dynamicChildren.length)) {
			patchFlag = 0;
			optimized = false;
			dynamicChildren = null;
		}
		if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) hostSetElementText(el, "");
		if (dynamicChildren) patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, resolveChildrenNamespace(n2, namespace), slotScopeIds);
		else if (!optimized) patchChildren(n1, n2, el, null, parentComponent, parentSuspense, resolveChildrenNamespace(n2, namespace), slotScopeIds, false);
		if (patchFlag > 0) {
			if (patchFlag & 16) patchProps(el, oldProps, newProps, parentComponent, namespace);
			else {
				if (patchFlag & 2) {
					if (oldProps.class !== newProps.class) hostPatchProp(el, "class", null, newProps.class, namespace);
				}
				if (patchFlag & 4) hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
				if (patchFlag & 8) {
					const propsToUpdate = n2.dynamicProps;
					for (let i = 0; i < propsToUpdate.length; i++) {
						const key = propsToUpdate[i];
						const prev = oldProps[key];
						const next = newProps[key];
						if (next !== prev || key === "value") hostPatchProp(el, key, prev, next, namespace, parentComponent);
					}
				}
			}
			if (patchFlag & 1) {
				if (n1.children !== n2.children) hostSetElementText(el, n2.children);
			}
		} else if (!optimized && dynamicChildren == null) patchProps(el, oldProps, newProps, parentComponent, namespace);
		if ((vnodeHook = newProps.onVnodeUpdated) || dirs) queuePostRenderEffect(() => {
			vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
			dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
		}, parentSuspense);
	};
	const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
		for (let i = 0; i < newChildren.length; i++) {
			const oldVNode = oldChildren[i];
			const newVNode = newChildren[i];
			const container = oldVNode.el && (oldVNode.type === Fragment || !isSameVNodeType(oldVNode, newVNode) || oldVNode.shapeFlag & 198) ? hostParentNode(oldVNode.el) : fallbackContainer;
			patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, true);
		}
	};
	const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
		if (oldProps !== newProps) {
			if (oldProps !== EMPTY_OBJ) {
				for (const key in oldProps) if (!isReservedProp(key) && !(key in newProps)) hostPatchProp(el, key, oldProps[key], null, namespace, parentComponent);
			}
			for (const key in newProps) {
				if (isReservedProp(key)) continue;
				const next = newProps[key];
				const prev = oldProps[key];
				if (next !== prev && key !== "value") hostPatchProp(el, key, prev, next, namespace, parentComponent);
			}
			if ("value" in newProps) hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
		}
	};
	const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
		const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
		let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
		if (fragmentSlotScopeIds) slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
		if (n1 == null) {
			hostInsert(fragmentStartAnchor, container, anchor);
			hostInsert(fragmentEndAnchor, container, anchor);
			mountChildren(n2.children || [], container, fragmentEndAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		} else if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && n1.dynamicChildren && n1.dynamicChildren.length === dynamicChildren.length) {
			patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, namespace, slotScopeIds);
			if (n2.key != null || parentComponent && n2 === parentComponent.subTree) traverseStaticChildren(n1, n2, true);
		} else patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
	};
	const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		n2.slotScopeIds = slotScopeIds;
		if (n1 == null) if (n2.shapeFlag & 512) parentComponent.ctx.activate(n2, container, anchor, namespace, optimized);
		else mountComponent(n2, container, anchor, parentComponent, parentSuspense, namespace, optimized);
		else updateComponent(n1, n2, optimized);
	};
	const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
		const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
		if (isKeepAlive(initialVNode)) instance.ctx.renderer = internals;
		setupComponent(instance, false, optimized);
		if (instance.asyncDep) {
			parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
			if (!initialVNode.el) {
				const placeholder = instance.subTree = createVNode(Comment);
				processCommentNode(null, placeholder, container, anchor);
				initialVNode.placeholder = placeholder.el;
			}
		} else setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, namespace, optimized);
	};
	const updateComponent = (n1, n2, optimized) => {
		const instance = n2.component = n1.component;
		if (shouldUpdateComponent(n1, n2, optimized)) if (instance.asyncDep && !instance.asyncResolved) {
			updateComponentPreRender(instance, n2, optimized);
			return;
		} else {
			instance.next = n2;
			instance.update();
		}
		else {
			n2.el = n1.el;
			instance.vnode = n2;
		}
	};
	const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
		const componentUpdateFn = () => {
			if (!instance.isMounted) {
				let vnodeHook;
				const { el, props } = initialVNode;
				const { bm, m, parent, root, type } = instance;
				const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
				toggleRecurse(instance, false);
				if (bm) invokeArrayFns(bm);
				if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) invokeVNodeHook(vnodeHook, parent, initialVNode);
				toggleRecurse(instance, true);
				if (el && hydrateNode) {
					const hydrateSubTree = () => {
						instance.subTree = renderComponentRoot(instance);
						hydrateNode(el, instance.subTree, instance, parentSuspense, null);
					};
					if (isAsyncWrapperVNode && type.__asyncHydrate) type.__asyncHydrate(el, instance, hydrateSubTree);
					else hydrateSubTree();
				} else {
					if (root.ce && root.ce._hasShadowRoot()) root.ce._injectChildStyle(type, instance.parent ? instance.parent.type : void 0);
					const subTree = instance.subTree = renderComponentRoot(instance);
					patch(null, subTree, container, anchor, instance, parentSuspense, namespace);
					initialVNode.el = subTree.el;
				}
				if (m) queuePostRenderEffect(m, parentSuspense);
				if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
					const scopedInitialVNode = initialVNode;
					queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
				}
				if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) instance.a && queuePostRenderEffect(instance.a, parentSuspense);
				instance.isMounted = true;
				initialVNode = container = anchor = null;
			} else {
				let { next, bu, u, parent, vnode } = instance;
				{
					const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
					if (nonHydratedAsyncRoot) {
						if (next) {
							next.el = vnode.el;
							updateComponentPreRender(instance, next, optimized);
						}
						nonHydratedAsyncRoot.asyncDep.then(() => {
							queuePostRenderEffect(() => {
								if (!instance.isUnmounted) update();
							}, parentSuspense);
						});
						return;
					}
				}
				let originNext = next;
				let vnodeHook;
				toggleRecurse(instance, false);
				if (next) {
					next.el = vnode.el;
					updateComponentPreRender(instance, next, optimized);
				} else next = vnode;
				if (bu) invokeArrayFns(bu);
				if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) invokeVNodeHook(vnodeHook, parent, next, vnode);
				toggleRecurse(instance, true);
				const nextTree = renderComponentRoot(instance);
				const prevTree = instance.subTree;
				instance.subTree = nextTree;
				patch(prevTree, nextTree, hostParentNode(prevTree.el), getNextHostNode(prevTree), instance, parentSuspense, namespace);
				next.el = nextTree.el;
				if (originNext === null) updateHOCHostEl(instance, nextTree.el);
				if (u) queuePostRenderEffect(u, parentSuspense);
				if (vnodeHook = next.props && next.props.onVnodeUpdated) queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
			}
		};
		instance.scope.on();
		const effect = instance.effect = new ReactiveEffect(componentUpdateFn);
		instance.scope.off();
		const update = instance.update = effect.run.bind(effect);
		const job = instance.job = effect.runIfDirty.bind(effect);
		job.i = instance;
		job.id = instance.uid;
		effect.scheduler = () => queueJob(job);
		toggleRecurse(instance, true);
		update();
	};
	const updateComponentPreRender = (instance, nextVNode, optimized) => {
		nextVNode.component = instance;
		const prevProps = instance.vnode.props;
		instance.vnode = nextVNode;
		instance.next = null;
		updateProps(instance, nextVNode.props, prevProps, optimized);
		updateSlots(instance, nextVNode.children, optimized);
		pauseTracking();
		flushPreFlushCbs(instance);
		resetTracking();
	};
	const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
		const c1 = n1 && n1.children;
		const prevShapeFlag = n1 ? n1.shapeFlag : 0;
		const c2 = n2.children;
		const { patchFlag, shapeFlag } = n2;
		if (patchFlag > 0) {
			if (patchFlag & 128) {
				patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				return;
			} else if (patchFlag & 256) {
				patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				return;
			}
		}
		if (shapeFlag & 8) {
			if (prevShapeFlag & 16) unmountChildren(c1, parentComponent, parentSuspense);
			if (c2 !== c1) hostSetElementText(container, c2);
		} else if (prevShapeFlag & 16) if (shapeFlag & 16) patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		else unmountChildren(c1, parentComponent, parentSuspense, true);
		else {
			if (prevShapeFlag & 8) hostSetElementText(container, "");
			if (shapeFlag & 16) mountChildren(c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		}
	};
	const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		c1 = c1 || EMPTY_ARR;
		c2 = c2 || EMPTY_ARR;
		const oldLength = c1.length;
		const newLength = c2.length;
		const commonLength = Math.min(oldLength, newLength);
		let i;
		for (i = 0; i < commonLength; i++) {
			const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
			patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		}
		if (oldLength > newLength) unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
		else mountChildren(c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, commonLength);
	};
	const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		let i = 0;
		const l2 = c2.length;
		let e1 = c1.length - 1;
		let e2 = l2 - 1;
		while (i <= e1 && i <= e2) {
			const n1 = c1[i];
			const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
			if (isSameVNodeType(n1, n2)) patch(n1, n2, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			else break;
			i++;
		}
		while (i <= e1 && i <= e2) {
			const n1 = c1[e1];
			const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
			if (isSameVNodeType(n1, n2)) patch(n1, n2, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			else break;
			e1--;
			e2--;
		}
		if (i > e1) {
			if (i <= e2) {
				const nextPos = e2 + 1;
				const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
				while (i <= e2) {
					patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
					i++;
				}
			}
		} else if (i > e2) while (i <= e1) {
			unmount(c1[i], parentComponent, parentSuspense, true);
			i++;
		}
		else {
			const s1 = i;
			const s2 = i;
			const keyToNewIndexMap = /* @__PURE__ */ new Map();
			for (i = s2; i <= e2; i++) {
				const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
				if (nextChild.key != null) keyToNewIndexMap.set(nextChild.key, i);
			}
			let j;
			let patched = 0;
			const toBePatched = e2 - s2 + 1;
			let moved = false;
			let maxNewIndexSoFar = 0;
			const newIndexToOldIndexMap = new Array(toBePatched);
			for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
			for (i = s1; i <= e1; i++) {
				const prevChild = c1[i];
				if (patched >= toBePatched) {
					unmount(prevChild, parentComponent, parentSuspense, true);
					continue;
				}
				let newIndex;
				if (prevChild.key != null) newIndex = keyToNewIndexMap.get(prevChild.key);
				else for (j = s2; j <= e2; j++) if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
					newIndex = j;
					break;
				}
				if (newIndex === void 0) unmount(prevChild, parentComponent, parentSuspense, true);
				else {
					newIndexToOldIndexMap[newIndex - s2] = i + 1;
					if (newIndex >= maxNewIndexSoFar) maxNewIndexSoFar = newIndex;
					else moved = true;
					patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
					patched++;
				}
			}
			const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
			j = increasingNewIndexSequence.length - 1;
			for (i = toBePatched - 1; i >= 0; i--) {
				const nextIndex = s2 + i;
				const nextChild = c2[nextIndex];
				const anchorVNode = c2[nextIndex + 1];
				const anchor = nextIndex + 1 < l2 ? anchorVNode.el || resolveAsyncComponentPlaceholder(anchorVNode) : parentAnchor;
				if (newIndexToOldIndexMap[i] === 0) patch(null, nextChild, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				else if (moved) if (j < 0 || i !== increasingNewIndexSequence[j]) move(nextChild, container, anchor, 2);
				else j--;
			}
		}
	};
	const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
		const { el, type, transition, children, shapeFlag } = vnode;
		if (shapeFlag & 6) {
			move(vnode.component.subTree, container, anchor, moveType);
			return;
		}
		if (shapeFlag & 128) {
			vnode.suspense.move(container, anchor, moveType);
			return;
		}
		if (shapeFlag & 64) {
			type.move(vnode, container, anchor, internals);
			return;
		}
		if (type === Fragment) {
			hostInsert(el, container, anchor);
			for (let i = 0; i < children.length; i++) move(children[i], container, anchor, moveType);
			hostInsert(vnode.anchor, container, anchor);
			return;
		}
		if (type === Static) {
			moveStaticNode(vnode, container, anchor);
			return;
		}
		if (moveType !== 2 && shapeFlag & 1 && transition) if (moveType === 0) if (transition.persisted && !el[leaveCbKey]) hostInsert(el, container, anchor);
		else {
			transition.beforeEnter(el);
			hostInsert(el, container, anchor);
			queuePostRenderEffect(() => transition.enter(el), parentSuspense);
		}
		else {
			const { leave, delayLeave, afterLeave } = transition;
			const remove2 = () => {
				if (vnode.ctx.isUnmounted) hostRemove(el);
				else hostInsert(el, container, anchor);
			};
			const performLeave = () => {
				const wasLeaving = el._isLeaving || !!el[leaveCbKey];
				if (el._isLeaving) el[leaveCbKey](true);
				if (transition.persisted && !wasLeaving) remove2();
				else leave(el, () => {
					remove2();
					afterLeave && afterLeave();
				});
			};
			if (delayLeave) delayLeave(el, remove2, performLeave);
			else performLeave();
		}
		else hostInsert(el, container, anchor);
	};
	const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
		const { type, props, ref, children, dynamicChildren, shapeFlag, patchFlag, dirs, cacheIndex, memo } = vnode;
		if (patchFlag === -2) optimized = false;
		if (ref != null) {
			pauseTracking();
			setRef(ref, null, parentSuspense, vnode, true);
			resetTracking();
		}
		if (cacheIndex != null) parentComponent.renderCache[cacheIndex] = void 0;
		if (shapeFlag & 256) {
			parentComponent.ctx.deactivate(vnode);
			return;
		}
		const shouldInvokeDirs = shapeFlag & 1 && dirs;
		const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
		let vnodeHook;
		if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) invokeVNodeHook(vnodeHook, parentComponent, vnode);
		if (shapeFlag & 6) unmountComponent(vnode.component, parentSuspense, doRemove);
		else {
			if (shapeFlag & 128) {
				vnode.suspense.unmount(parentSuspense, doRemove);
				return;
			}
			if (shouldInvokeDirs) invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
			if (shapeFlag & 64) vnode.type.remove(vnode, parentComponent, parentSuspense, internals, doRemove);
			else if (dynamicChildren && !dynamicChildren.hasOnce && (type !== Fragment || patchFlag > 0 && patchFlag & 64)) unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
			else if (type === Fragment && patchFlag & 384 || !optimized && shapeFlag & 16) unmountChildren(children, parentComponent, parentSuspense);
			if (doRemove) remove(vnode);
		}
		const shouldInvalidateMemo = memo != null && cacheIndex == null;
		if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs || shouldInvalidateMemo) queuePostRenderEffect(() => {
			vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
			shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
			if (shouldInvalidateMemo) vnode.el = null;
		}, parentSuspense);
	};
	const remove = (vnode) => {
		const { type, el, anchor, transition } = vnode;
		if (type === Fragment) {
			removeFragment(el, anchor);
			return;
		}
		if (type === Static) {
			removeStaticNode(vnode);
			return;
		}
		const performRemove = () => {
			hostRemove(el);
			if (transition && !transition.persisted && transition.afterLeave) transition.afterLeave();
		};
		if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
			const { leave, delayLeave } = transition;
			const performLeave = () => leave(el, performRemove);
			if (delayLeave) delayLeave(vnode.el, performRemove, performLeave);
			else performLeave();
		} else performRemove();
	};
	const removeFragment = (cur, end) => {
		let next;
		while (cur !== end) {
			next = hostNextSibling(cur);
			hostRemove(cur);
			cur = next;
		}
		hostRemove(end);
	};
	const unmountComponent = (instance, parentSuspense, doRemove) => {
		const { bum, scope, job, subTree, um, m, a } = instance;
		invalidateMount(m);
		invalidateMount(a);
		if (bum) invokeArrayFns(bum);
		scope.stop();
		if (job) {
			job.flags |= 8;
			unmount(subTree, instance, parentSuspense, doRemove);
		}
		if (um) queuePostRenderEffect(um, parentSuspense);
		queuePostRenderEffect(() => {
			instance.isUnmounted = true;
		}, parentSuspense);
	};
	const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
		for (let i = start; i < children.length; i++) unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
	};
	const getNextHostNode = (vnode) => {
		if (vnode.shapeFlag & 6) return getNextHostNode(vnode.component.subTree);
		if (vnode.shapeFlag & 128) return vnode.suspense.next();
		const el = hostNextSibling(vnode.anchor || vnode.el);
		const teleportEnd = el && el[TeleportEndKey];
		return teleportEnd ? hostNextSibling(teleportEnd) : el;
	};
	let isFlushing = false;
	const render = (vnode, container, namespace) => {
		let instance;
		if (vnode == null) {
			if (container._vnode) {
				unmount(container._vnode, null, null, true);
				instance = container._vnode.component;
			}
		} else patch(container._vnode || null, vnode, container, null, null, null, namespace);
		container._vnode = vnode;
		if (!isFlushing) {
			isFlushing = true;
			flushPreFlushCbs(instance);
			flushPostFlushCbs();
			isFlushing = false;
		}
	};
	const internals = {
		p: patch,
		um: unmount,
		m: move,
		r: remove,
		mt: mountComponent,
		mc: mountChildren,
		pc: patchChildren,
		pbc: patchBlockChildren,
		n: getNextHostNode,
		o: options
	};
	let hydrate;
	let hydrateNode;
	if (createHydrationFns) [hydrate, hydrateNode] = createHydrationFns(internals);
	return {
		render,
		hydrate,
		createApp: createAppAPI(render, hydrate)
	};
}
function resolveChildrenNamespace({ type, props }, currentNamespace) {
	return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
}
function toggleRecurse({ effect, job }, allowed) {
	if (allowed) {
		effect.flags |= 32;
		job.flags |= 4;
	} else {
		effect.flags &= -33;
		job.flags &= -5;
	}
}
function needTransition(parentSuspense, transition) {
	return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
}
function traverseStaticChildren(n1, n2, shallow = false) {
	const ch1 = n1.children;
	const ch2 = n2.children;
	if (isArray(ch1) && isArray(ch2)) for (let i = 0; i < ch1.length; i++) {
		const c1 = ch1[i];
		let c2 = ch2[i];
		if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
			if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
				c2 = ch2[i] = cloneIfMounted(ch2[i]);
				c2.el = c1.el;
			}
			if (!shallow && c2.patchFlag !== -2) traverseStaticChildren(c1, c2);
		}
		if (c2.type === Text) {
			if (c2.patchFlag === -1) c2 = ch2[i] = cloneIfMounted(c2);
			c2.el = c1.el;
		}
		if (c2.type === Comment && !c2.el) c2.el = c1.el;
	}
}
function getSequence(arr) {
	const p = arr.slice();
	const result = [0];
	let i, j, u, v, c;
	const len = arr.length;
	for (i = 0; i < len; i++) {
		const arrI = arr[i];
		if (arrI !== 0) {
			j = result[result.length - 1];
			if (arr[j] < arrI) {
				p[i] = j;
				result.push(i);
				continue;
			}
			u = 0;
			v = result.length - 1;
			while (u < v) {
				c = u + v >> 1;
				if (arr[result[c]] < arrI) u = c + 1;
				else v = c;
			}
			if (arrI < arr[result[u]]) {
				if (u > 0) p[i] = result[u - 1];
				result[u] = i;
			}
		}
	}
	u = result.length;
	v = result[u - 1];
	while (u-- > 0) {
		result[u] = v;
		v = p[v];
	}
	return result;
}
function locateNonHydratedAsyncRoot(instance) {
	const subComponent = instance.subTree.component;
	if (subComponent) if (subComponent.asyncDep && !subComponent.asyncResolved) return subComponent;
	else return locateNonHydratedAsyncRoot(subComponent);
}
function invalidateMount(hooks) {
	if (hooks) for (let i = 0; i < hooks.length; i++) hooks[i].flags |= 8;
}
function resolveAsyncComponentPlaceholder(anchorVnode) {
	if (anchorVnode.placeholder) return anchorVnode.placeholder;
	const instance = anchorVnode.component;
	if (instance) return resolveAsyncComponentPlaceholder(instance.subTree);
	return null;
}
var isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
	if (suspense && suspense.pendingBranch) if (isArray(fn)) suspense.effects.push(...fn);
	else suspense.effects.push(fn);
	else queuePostFlushCb(fn);
}
var Fragment = /* @__PURE__ */ Symbol.for("v-fgt");
var Text = /* @__PURE__ */ Symbol.for("v-txt");
var Comment = /* @__PURE__ */ Symbol.for("v-cmt");
var Static = /* @__PURE__ */ Symbol.for("v-stc");
var blockStack = [];
var currentBlock = null;
function openBlock(disableTracking = false) {
	blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
	blockStack.pop();
	currentBlock = blockStack[blockStack.length - 1] || null;
}
var isBlockTreeEnabled = 1;
function setBlockTracking(value, inVOnce = false) {
	isBlockTreeEnabled += value;
	if (value < 0 && currentBlock && inVOnce) currentBlock.hasOnce = true;
}
function setupBlock(vnode) {
	vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
	closeBlock();
	if (isBlockTreeEnabled > 0 && currentBlock) currentBlock.push(vnode);
	return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
	return setupBlock(createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, true));
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
	return setupBlock(createVNode(type, props, children, patchFlag, dynamicProps, true));
}
function isVNode(value) {
	return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
	return n1.type === n2.type && n1.key === n2.key;
}
var normalizeKey = ({ key }) => key != null ? key : null;
var normalizeRef = ({ ref, ref_key, ref_for }) => {
	if (typeof ref === "number") ref = "" + ref;
	return ref != null ? isString(ref) || /* @__PURE__ */ isRef(ref) || isFunction(ref) ? {
		i: currentRenderingInstance,
		r: ref,
		k: ref_key,
		f: !!ref_for
	} : ref : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
	const vnode = {
		__v_isVNode: true,
		__v_skip: true,
		type,
		props,
		key: props && normalizeKey(props),
		ref: props && normalizeRef(props),
		scopeId: currentScopeId,
		slotScopeIds: null,
		children,
		component: null,
		suspense: null,
		ssContent: null,
		ssFallback: null,
		dirs: null,
		transition: null,
		el: null,
		anchor: null,
		target: null,
		targetStart: null,
		targetAnchor: null,
		staticCount: 0,
		shapeFlag,
		patchFlag,
		dynamicProps,
		dynamicChildren: null,
		appContext: null,
		ctx: currentRenderingInstance
	};
	if (needFullChildrenNormalization) {
		normalizeChildren(vnode, children);
		if (shapeFlag & 128) type.normalize(vnode);
	} else if (children) vnode.shapeFlag |= isString(children) ? 8 : 16;
	if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock && (vnode.patchFlag > 0 || shapeFlag & 6) && vnode.patchFlag !== 32) currentBlock.push(vnode);
	return vnode;
}
var createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
	if (!type || type === NULL_DYNAMIC_COMPONENT) type = Comment;
	if (isVNode(type)) {
		const cloned = cloneVNode(type, props, true);
		if (children) normalizeChildren(cloned, children);
		if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) if (cloned.shapeFlag & 6) currentBlock[currentBlock.indexOf(type)] = cloned;
		else currentBlock.push(cloned);
		cloned.patchFlag = -2;
		return cloned;
	}
	if (isClassComponent(type)) type = type.__vccOpts;
	if (props) {
		props = guardReactiveProps(props);
		let { class: klass, style } = props;
		if (klass && !isString(klass)) props.class = normalizeClass(klass);
		if (isObject$2(style)) {
			if (/* @__PURE__ */ isProxy(style) && !isArray(style)) style = extend$2({}, style);
			props.style = normalizeStyle(style);
		}
	}
	const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$2(type) ? 4 : isFunction(type) ? 2 : 0;
	return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
}
function guardReactiveProps(props) {
	if (!props) return null;
	return /* @__PURE__ */ isProxy(props) || isInternalObject(props) ? extend$2({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
	const { props, ref, patchFlag, children, transition } = vnode;
	const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
	const cloned = {
		__v_isVNode: true,
		__v_skip: true,
		type: vnode.type,
		props: mergedProps,
		key: mergedProps && normalizeKey(mergedProps),
		ref: extraProps && extraProps.ref ? mergeRef && ref ? isArray(ref) ? ref.concat(normalizeRef(extraProps)) : [ref, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref,
		scopeId: vnode.scopeId,
		slotScopeIds: vnode.slotScopeIds,
		children,
		target: vnode.target,
		targetStart: vnode.targetStart,
		targetAnchor: vnode.targetAnchor,
		staticCount: vnode.staticCount,
		shapeFlag: vnode.shapeFlag,
		patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
		dynamicProps: vnode.dynamicProps,
		dynamicChildren: vnode.dynamicChildren,
		appContext: vnode.appContext,
		dirs: vnode.dirs,
		transition,
		component: vnode.component,
		suspense: vnode.suspense,
		ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
		ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
		placeholder: vnode.placeholder,
		el: vnode.el,
		anchor: vnode.anchor,
		ctx: vnode.ctx,
		ce: vnode.ce
	};
	if (transition && cloneTransition) setTransitionHooks(cloned, transition.clone(cloned));
	return cloned;
}
function createTextVNode(text = " ", flag = 0) {
	return createVNode(Text, null, text, flag);
}
function createCommentVNode(text = "", asBlock = false) {
	return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
	if (child == null || typeof child === "boolean") return createVNode(Comment);
	else if (isArray(child)) return createVNode(Fragment, null, child.slice());
	else if (isVNode(child)) return cloneIfMounted(child);
	else return createVNode(Text, null, String(child));
}
function cloneIfMounted(child) {
	return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
	let type = 0;
	const { shapeFlag } = vnode;
	if (children == null) children = null;
	else if (isArray(children)) type = 16;
	else if (typeof children === "object") if (shapeFlag & 65) {
		const slot = children.default;
		if (slot) {
			slot._c && (slot._d = false);
			normalizeChildren(vnode, slot());
			slot._c && (slot._d = true);
		}
		return;
	} else {
		type = 32;
		const slotFlag = children._;
		if (!slotFlag && !isInternalObject(children)) children._ctx = currentRenderingInstance;
		else if (slotFlag === 3 && currentRenderingInstance) if (currentRenderingInstance.slots._ === 1) children._ = 1;
		else {
			children._ = 2;
			vnode.patchFlag |= 1024;
		}
	}
	else if (isFunction(children)) {
		if (shapeFlag & 65) {
			normalizeChildren(vnode, { default: children });
			return;
		}
		children = {
			default: children,
			_ctx: currentRenderingInstance
		};
		type = 32;
	} else {
		children = String(children);
		if (shapeFlag & 64) {
			type = 16;
			children = [createTextVNode(children)];
		} else type = 8;
	}
	vnode.children = children;
	vnode.shapeFlag |= type;
}
function mergeProps(...args) {
	const ret = {};
	for (let i = 0; i < args.length; i++) {
		const toMerge = args[i];
		for (const key in toMerge) if (key === "class") {
			if (ret.class !== toMerge.class) ret.class = normalizeClass([ret.class, toMerge.class]);
		} else if (key === "style") ret.style = normalizeStyle([ret.style, toMerge.style]);
		else if (isOn(key)) {
			const existing = ret[key];
			const incoming = toMerge[key];
			if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) ret[key] = existing ? [].concat(existing, incoming) : incoming;
			else if (incoming == null && existing == null && !isModelListener(key)) ret[key] = incoming;
		} else if (key !== "") ret[key] = toMerge[key];
	}
	return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
	callWithAsyncErrorHandling(hook, instance, 7, [vnode, prevVNode]);
}
var emptyAppContext = createAppContext();
var uid = 0;
function createComponentInstance(vnode, parent, suspense) {
	const type = vnode.type;
	const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
	const instance = {
		uid: uid++,
		vnode,
		type,
		parent,
		appContext,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new EffectScope(true),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: parent ? parent.provides : Object.create(appContext.provides),
		ids: parent ? parent.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: normalizePropsOptions(type, appContext),
		emitsOptions: normalizeEmitsOptions(type, appContext),
		emit: null,
		emitted: null,
		propsDefaults: EMPTY_OBJ,
		inheritAttrs: type.inheritAttrs,
		ctx: EMPTY_OBJ,
		data: EMPTY_OBJ,
		props: EMPTY_OBJ,
		attrs: EMPTY_OBJ,
		slots: EMPTY_OBJ,
		refs: EMPTY_OBJ,
		setupState: EMPTY_OBJ,
		setupContext: null,
		suspense,
		suspenseId: suspense ? suspense.pendingId : 0,
		asyncDep: null,
		asyncResolved: false,
		isMounted: false,
		isUnmounted: false,
		isDeactivated: false,
		bc: null,
		c: null,
		bm: null,
		m: null,
		bu: null,
		u: null,
		um: null,
		bum: null,
		da: null,
		a: null,
		rtg: null,
		rtc: null,
		ec: null,
		sp: null
	};
	instance.ctx = { _: instance };
	instance.root = parent ? parent.root : instance;
	instance.emit = emit.bind(null, instance);
	if (vnode.ce) vnode.ce(instance);
	return instance;
}
var currentInstance = null;
var getCurrentInstance = () => currentInstance || currentRenderingInstance;
var internalSetCurrentInstance;
var setInSSRSetupState;
{
	const g = getGlobalThis();
	const registerGlobalSetter = (key, setter) => {
		let setters;
		if (!(setters = g[key])) setters = g[key] = [];
		setters.push(setter);
		return (v) => {
			if (setters.length > 1) setters.forEach((set) => set(v));
			else setters[0](v);
		};
	};
	internalSetCurrentInstance = registerGlobalSetter(`__VUE_INSTANCE_SETTERS__`, (v) => currentInstance = v);
	setInSSRSetupState = registerGlobalSetter(`__VUE_SSR_SETTERS__`, (v) => isInSSRComponentSetup = v);
}
var setCurrentInstance = (instance) => {
	const prev = currentInstance;
	internalSetCurrentInstance(instance);
	instance.scope.on();
	return () => {
		instance.scope.off();
		internalSetCurrentInstance(prev);
	};
};
var unsetCurrentInstance = () => {
	currentInstance && currentInstance.scope.off();
	internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
	return instance.vnode.shapeFlag & 4;
}
var isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false, optimized = false) {
	isSSR && setInSSRSetupState(isSSR);
	const { props, children } = instance.vnode;
	const isStateful = isStatefulComponent(instance);
	initProps(instance, props, isStateful, isSSR);
	initSlots(instance, children, optimized || isSSR);
	const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
	isSSR && setInSSRSetupState(false);
	return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
	const Component = instance.type;
	instance.accessCache = /* @__PURE__ */ Object.create(null);
	instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
	const { setup } = Component;
	if (setup) {
		pauseTracking();
		const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
		const reset = setCurrentInstance(instance);
		const setupResult = callWithErrorHandling(setup, instance, 0, [instance.props, setupContext]);
		const isAsyncSetup = isPromise(setupResult);
		resetTracking();
		reset();
		if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) markAsyncBoundary(instance);
		if (isAsyncSetup) {
			setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
			if (isSSR) return setupResult.then((resolvedResult) => {
				handleSetupResult(instance, resolvedResult, isSSR);
			}).catch((e) => {
				handleError(e, instance, 0);
			});
			else instance.asyncDep = setupResult;
		} else handleSetupResult(instance, setupResult, isSSR);
	} else finishComponentSetup(instance, isSSR);
}
function handleSetupResult(instance, setupResult, isSSR) {
	if (isFunction(setupResult)) if (instance.type.__ssrInlineRender) instance.ssrRender = setupResult;
	else instance.render = setupResult;
	else if (isObject$2(setupResult)) instance.setupState = proxyRefs(setupResult);
	finishComponentSetup(instance, isSSR);
}
var compile;
var installWithProxy;
function finishComponentSetup(instance, isSSR, skipOptions) {
	const Component = instance.type;
	if (!instance.render) {
		if (!isSSR && compile && !Component.render) {
			const template = Component.template || resolveMergedOptions(instance).template;
			if (template) {
				const { isCustomElement, compilerOptions } = instance.appContext.config;
				const { delimiters, compilerOptions: componentCompilerOptions } = Component;
				Component.render = compile(template, extend$2(extend$2({
					isCustomElement,
					delimiters
				}, compilerOptions), componentCompilerOptions));
			}
		}
		instance.render = Component.render || NOOP;
		if (installWithProxy) installWithProxy(instance);
	}
	{
		const reset = setCurrentInstance(instance);
		pauseTracking();
		try {
			applyOptions(instance);
		} finally {
			resetTracking();
			reset();
		}
	}
}
var attrsProxyHandlers = { get(target, key) {
	track(target, "get", "");
	return target[key];
} };
function createSetupContext(instance) {
	const expose = (exposed) => {
		instance.exposed = exposed || {};
	};
	return {
		attrs: new Proxy(instance.attrs, attrsProxyHandlers),
		slots: instance.slots,
		emit: instance.emit,
		expose
	};
}
function getComponentPublicInstance(instance) {
	if (instance.exposed) return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
		get(target, key) {
			if (key in target) return target[key];
			else if (key in publicPropertiesMap) return publicPropertiesMap[key](instance);
		},
		has(target, key) {
			return key in target || key in publicPropertiesMap;
		}
	}));
	else return instance.proxy;
}
function isClassComponent(value) {
	return isFunction(value) && "__vccOpts" in value;
}
var computed = (getterOrOptions, debugOptions) => {
	return /* @__PURE__ */ computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
};
function h(type, propsOrChildren, children) {
	try {
		setBlockTracking(-1);
		const l = arguments.length;
		if (l === 2) if (isObject$2(propsOrChildren) && !isArray(propsOrChildren)) {
			if (isVNode(propsOrChildren)) return createVNode(type, null, [propsOrChildren]);
			return createVNode(type, propsOrChildren);
		} else return createVNode(type, null, propsOrChildren);
		else {
			if (l > 3) children = Array.prototype.slice.call(arguments, 2);
			else if (l === 3 && isVNode(children)) children = [children];
			return createVNode(type, propsOrChildren, children);
		}
	} finally {
		setBlockTracking(1);
	}
}
var version = "3.5.39";
//#endregion
//#region node_modules/swiper/shared/utils.mjs
function classesToTokens(classes = "") {
	return classes.trim().split(" ").filter((c) => !!c.trim());
}
function deleteProps(obj) {
	Object.keys(obj).forEach((key) => {
		try {
			obj[key] = null;
		} catch {}
		try {
			delete obj[key];
		} catch {}
	});
}
function nextTick(callback, delay = 0) {
	return setTimeout(callback, delay);
}
function now() {
	return Date.now();
}
function getComputedStyle$1(el) {
	return window.getComputedStyle(el, null);
}
function getTranslate(el, axis = "x") {
	const style = getComputedStyle$1(el);
	const transform = style.transform || style.webkitTransform;
	if (!transform || transform === "none") return 0;
	const matrix = new DOMMatrixReadOnly(transform);
	return axis === "x" ? matrix.m41 : matrix.m42;
}
function isObject$1(o) {
	return typeof o === "object" && o !== null && o.constructor === Object && Object.prototype.toString.call(o).slice(8, -1) === "Object";
}
function isNode(node) {
	if (typeof HTMLElement !== "undefined" && node instanceof HTMLElement) return true;
	return !!node && typeof node === "object" && (node.nodeType === 1 || node.nodeType === 11);
}
function extend$1(target, ...sources) {
	const to = Object(target);
	for (let i = 0; i < sources.length; i += 1) {
		const nextSource = sources[i];
		if (nextSource === void 0 || nextSource === null || isNode(nextSource)) continue;
		const sourceObj = nextSource;
		const keysArray = Object.keys(Object(sourceObj)).filter((key) => key !== "__proto__" && key !== "constructor" && key !== "prototype");
		for (const nextKey of keysArray) {
			const desc = Object.getOwnPropertyDescriptor(sourceObj, nextKey);
			if (!desc || !desc.enumerable) continue;
			const sourceVal = sourceObj[nextKey];
			if (isObject$1(to[nextKey]) && isObject$1(sourceVal)) if (sourceVal.__swiper__) to[nextKey] = sourceVal;
			else extend$1(to[nextKey], sourceVal);
			else if (!isObject$1(to[nextKey]) && isObject$1(sourceVal)) {
				to[nextKey] = {};
				if (sourceVal.__swiper__) to[nextKey] = sourceVal;
				else extend$1(to[nextKey], sourceVal);
			} else to[nextKey] = sourceVal;
		}
	}
	return to;
}
function setCSSProperty(el, varName, varValue) {
	el.style.setProperty(varName, varValue);
}
function getSlideTransformEl(slideEl) {
	const direct = slideEl.querySelector(".swiper-slide-transform");
	if (direct) return direct;
	if (slideEl.shadowRoot) {
		const shadowed = slideEl.shadowRoot.querySelector(".swiper-slide-transform");
		if (shadowed) return shadowed;
	}
	return slideEl;
}
function elementChildren(element, selector = "") {
	const children = [...element.children];
	if (element instanceof HTMLSlotElement) children.push(...element.assignedElements());
	return selector ? children.filter((el) => el.matches(selector)) : children;
}
function elementIsChildOfSlot(el, slot) {
	const queue = [slot];
	while (queue.length > 0) {
		const cur = queue.shift();
		if (el === cur) return true;
		queue.push(...cur.children, ...cur.shadowRoot ? cur.shadowRoot.children : [], ...cur.assignedElements ? cur.assignedElements() : []);
	}
	return false;
}
function elementIsChildOf(el, parent) {
	let isChild = parent.contains(el);
	if (!isChild && parent instanceof HTMLSlotElement) {
		isChild = [...parent.assignedElements()].includes(el);
		if (!isChild) isChild = elementIsChildOfSlot(el, parent);
	}
	return isChild;
}
function showWarning(text) {
	try {
		console.warn(text);
	} catch {}
}
function createElement(tag, classes = []) {
	const el = document.createElement(tag);
	el.classList.add(...Array.isArray(classes) ? classes : classesToTokens(classes));
	return el;
}
function elementOffset(el) {
	const box = el.getBoundingClientRect();
	return {
		top: box.top + window.scrollY - (el.clientTop || 0),
		left: box.left + window.scrollX - (el.clientLeft || 0)
	};
}
function elementPrevAll(el, selector) {
	const prevEls = [];
	let prev = el.previousElementSibling;
	while (prev) {
		if (!selector || prev.matches(selector)) prevEls.push(prev);
		prev = prev.previousElementSibling;
	}
	return prevEls;
}
function elementNextAll(el, selector) {
	const nextEls = [];
	let next = el.nextElementSibling;
	while (next) {
		if (!selector || next.matches(selector)) nextEls.push(next);
		next = next.nextElementSibling;
	}
	return nextEls;
}
function elementStyle(el, prop) {
	return window.getComputedStyle(el, null).getPropertyValue(prop);
}
function elementIndex(el) {
	if (!el || !el.parentNode) return void 0;
	return [...el.parentNode.children].indexOf(el);
}
function elementParents(el, selector) {
	const parents = [];
	let parent = el.parentElement;
	while (parent) {
		if (!selector || parent.matches(selector)) parents.push(parent);
		parent = parent.parentElement;
	}
	return parents;
}
function elementTransitionEnd(el, callback) {
	if (!callback) return;
	el.addEventListener("transitionend", function fireCallBack(e) {
		if (e.target !== el) return;
		callback.call(el, e);
	}, { once: true });
}
function elementOuterSize(el, size, includeMargins) {
	{
		const style = window.getComputedStyle(el, null);
		return el[size === "width" ? "offsetWidth" : "offsetHeight"] + parseFloat(style.getPropertyValue(size === "width" ? "margin-right" : "margin-top")) + parseFloat(style.getPropertyValue(size === "width" ? "margin-left" : "margin-bottom"));
	}
}
function makeElementsArray(el) {
	return (Array.isArray(el) ? el : [el]).filter((e) => !!e);
}
function getRotateFix(swiper) {
	return (v) => {
		if (Math.abs(v) > 0 && swiper.browser && swiper.browser.need3dFix && Math.abs(v) % 90 === 0) return v + .001;
		return v;
	};
}
function setInnerHTML(el, html = "") {
	const tt = globalThis.trustedTypes;
	if (typeof tt !== "undefined") el.innerHTML = tt.createPolicy("html", { createHTML: (s) => s }).createHTML(html);
	else el.innerHTML = html;
}
//#endregion
//#region node_modules/swiper/shared/update-swiper.mjs
var paramsList = [
	"eventsPrefix",
	"injectStyles",
	"injectStylesUrls",
	"modules",
	"init",
	"_direction",
	"oneWayMovement",
	"swiperElementNodeName",
	"touchEventsTarget",
	"initialSlide",
	"_speed",
	"cssMode",
	"updateOnWindowResize",
	"resizeObserver",
	"nested",
	"focusableElements",
	"_enabled",
	"_width",
	"_height",
	"preventInteractionOnTransition",
	"userAgent",
	"url",
	"_edgeSwipeDetection",
	"_edgeSwipeThreshold",
	"_freeMode",
	"_autoHeight",
	"setWrapperSize",
	"virtualTranslate",
	"_effect",
	"breakpoints",
	"breakpointsBase",
	"_spaceBetween",
	"_slidesPerView",
	"maxBackfaceHiddenSlides",
	"_grid",
	"_slidesPerGroup",
	"_slidesPerGroupSkip",
	"_slidesPerGroupAuto",
	"_centeredSlides",
	"_centeredSlidesBounds",
	"_slidesOffsetBefore",
	"_slidesOffsetAfter",
	"normalizeSlideIndex",
	"_centerInsufficientSlides",
	"_snapToSlideEdge",
	"_watchOverflow",
	"roundLengths",
	"touchRatio",
	"touchAngle",
	"simulateTouch",
	"_shortSwipes",
	"_longSwipes",
	"longSwipesRatio",
	"longSwipesMs",
	"_followFinger",
	"allowTouchMove",
	"_threshold",
	"touchMoveStopPropagation",
	"touchStartPreventDefault",
	"touchStartForcePreventDefault",
	"touchReleaseOnEdges",
	"uniqueNavElements",
	"_resistance",
	"_resistanceRatio",
	"_watchSlidesProgress",
	"_grabCursor",
	"preventClicks",
	"preventClicksPropagation",
	"_slideToClickedSlide",
	"_loop",
	"loopAdditionalSlides",
	"loopAddBlankSlides",
	"loopPreventsSliding",
	"_rewind",
	"_allowSlidePrev",
	"_allowSlideNext",
	"_swipeHandler",
	"_noSwiping",
	"noSwipingClass",
	"noSwipingSelector",
	"passiveListeners",
	"containerModifierClass",
	"slideClass",
	"slideActiveClass",
	"slideVisibleClass",
	"slideFullyVisibleClass",
	"slideNextClass",
	"slidePrevClass",
	"slideBlankClass",
	"wrapperClass",
	"lazyPreloaderClass",
	"lazyPreloadPrevNext",
	"runCallbacksOnInit",
	"observer",
	"observeParents",
	"observeSlideChildren",
	"a11y",
	"_autoplay",
	"_controller",
	"coverflowEffect",
	"cubeEffect",
	"fadeEffect",
	"flipEffect",
	"creativeEffect",
	"cardsEffect",
	"hashNavigation",
	"history",
	"keyboard",
	"mousewheel",
	"_navigation",
	"_pagination",
	"parallax",
	"_scrollbar",
	"_thumbs",
	"virtual",
	"zoom",
	"control"
];
function isObject(o) {
	if (typeof o !== "object" || o === null) return false;
	const obj = o;
	return !!obj.constructor && Object.prototype.toString.call(obj).slice(8, -1) === "Object" && !obj.__swiper__;
}
function extend(target, src) {
	const noExtend = [
		"__proto__",
		"constructor",
		"prototype"
	];
	const t = target;
	const s = src;
	Object.keys(s).filter((key) => noExtend.indexOf(key) < 0).forEach((key) => {
		const srcVal = s[key];
		const targetVal = t[key];
		if (typeof targetVal === "undefined") t[key] = srcVal;
		else if (isObject(srcVal) && isObject(targetVal) && Object.keys(srcVal).length > 0) if (srcVal.__swiper__) t[key] = srcVal;
		else extend(targetVal, srcVal);
		else t[key] = srcVal;
	});
	return target;
}
function needsNavigation(params = {}) {
	const nav = params.navigation;
	if (!nav) return false;
	if (nav === true) return true;
	return typeof nav.nextEl === "undefined" && typeof nav.prevEl === "undefined";
}
function needsPagination(params = {}) {
	const pag = params.pagination;
	if (!pag) return false;
	if (pag === true) return true;
	return typeof pag.el === "undefined";
}
function needsScrollbar(params = {}) {
	const sb = params.scrollbar;
	if (!sb) return false;
	if (sb === true) return true;
	return typeof sb.el === "undefined";
}
function uniqueClasses(classNames = "") {
	const classes = classNames.split(" ").map((c) => c.trim()).filter((c) => !!c);
	const unique = [];
	classes.forEach((c) => {
		if (unique.indexOf(c) < 0) unique.push(c);
	});
	return unique.join(" ");
}
function wrapperClass(className = "") {
	if (!className) return "swiper-wrapper";
	if (!className.includes("swiper-wrapper")) return `swiper-wrapper ${className}`;
	return className;
}
function updateSwiper(args) {
	let { nextEl, prevEl, scrollbarEl, paginationEl } = args;
	const { swiper, slides, passedParams, changedParams } = args;
	const updateParams = changedParams.filter((key) => key !== "children" && key !== "direction" && key !== "wrapperClass");
	const { params: currentParams, pagination, navigation, scrollbar, virtual, thumbs } = swiper;
	const passed = passedParams;
	const current = currentParams;
	let needThumbsInit;
	let needControllerInit;
	let needPaginationInit;
	let needScrollbarInit;
	let needNavigationInit;
	let loopNeedDestroy;
	let loopNeedEnable;
	let loopNeedReloop;
	const passedThumbs = passed.thumbs;
	const currentThumbs = current.thumbs;
	if (changedParams.includes("thumbs") && isObject(passedThumbs) && passedThumbs.swiper && !passedThumbs.swiper.destroyed && isObject(currentThumbs) && (!currentThumbs.swiper || currentThumbs.swiper.destroyed)) needThumbsInit = true;
	const passedController = passed.controller;
	const currentController = current.controller;
	if (changedParams.includes("controller") && isObject(passedController) && passedController.control && isObject(currentController) && !currentController.control) needControllerInit = true;
	const passedPagination = passed.pagination;
	if (changedParams.includes("pagination") && isObject(passedPagination) && (passedPagination.el || paginationEl) && (current.pagination || current.pagination === false) && pagination && !pagination.el) needPaginationInit = true;
	const passedScrollbar = passed.scrollbar;
	if (changedParams.includes("scrollbar") && isObject(passedScrollbar) && (passedScrollbar.el || scrollbarEl) && (current.scrollbar || current.scrollbar === false) && scrollbar && !scrollbar.el) needScrollbarInit = true;
	const passedNavigation = passed.navigation;
	if (changedParams.includes("navigation") && isObject(passedNavigation) && (passedNavigation.prevEl || prevEl) && (passedNavigation.nextEl || nextEl) && (current.navigation || current.navigation === false) && navigation && !navigation.prevEl && !navigation.nextEl) needNavigationInit = true;
	const destroyModule = (mod) => {
		const moduleInstance = swiper[mod];
		if (!moduleInstance) return;
		moduleInstance.destroy();
		const currentModule = current[mod];
		const currentObj = isObject(currentModule) ? currentModule : void 0;
		if (mod === "navigation") {
			if (swiper.isElement) {
				moduleInstance.prevEl?.remove();
				moduleInstance.nextEl?.remove();
			}
			if (currentObj) {
				currentObj.prevEl = void 0;
				currentObj.nextEl = void 0;
			}
			moduleInstance.prevEl = void 0;
			moduleInstance.nextEl = void 0;
		} else {
			if (swiper.isElement) moduleInstance.el?.remove();
			if (currentObj) currentObj.el = void 0;
			moduleInstance.el = void 0;
		}
	};
	if (changedParams.includes("loop") && swiper.isElement) if (currentParams.loop && !passedParams.loop) loopNeedDestroy = true;
	else if (!currentParams.loop && passedParams.loop) loopNeedEnable = true;
	else loopNeedReloop = true;
	updateParams.forEach((key) => {
		const currentValue = current[key];
		const passedValue = passed[key];
		if (isObject(currentValue) && isObject(passedValue)) {
			Object.assign(currentValue, passedValue);
			if ((key === "navigation" || key === "pagination" || key === "scrollbar") && "enabled" in passedValue && !passedValue.enabled) destroyModule(key);
		} else if ((passedValue === true || passedValue === false) && (key === "navigation" || key === "pagination" || key === "scrollbar")) {
			if (passedValue === false) destroyModule(key);
		} else current[key] = passedValue;
	});
	if (updateParams.includes("controller") && !needControllerInit && swiper.controller && swiper.controller.control && isObject(currentController) && currentController.control) swiper.controller.control = currentController.control;
	if (changedParams.includes("children") && slides && virtual && currentParams.virtual?.enabled) {
		virtual.slides = slides;
		virtual.update(true);
	} else if (changedParams.includes("virtual") && virtual && currentParams.virtual?.enabled) {
		if (slides) virtual.slides = slides;
		virtual.update(true);
	}
	if (changedParams.includes("children") && slides && currentParams.loop) loopNeedReloop = true;
	if (needThumbsInit && thumbs) {
		if (thumbs.init()) thumbs.update(true);
	}
	if (needControllerInit && swiper.controller && isObject(currentController)) swiper.controller.control = currentController.control;
	if (needPaginationInit && pagination) {
		if (swiper.isElement && (!paginationEl || typeof paginationEl === "string")) {
			const el = document.createElement("div");
			el.classList.add("swiper-pagination");
			el.part.add("pagination");
			swiper.el.appendChild(el);
			paginationEl = el;
		}
		const paginationParams = current.pagination;
		if (paginationEl && isObject(paginationParams)) paginationParams.el = paginationEl;
		pagination.init();
		pagination.render();
		pagination.update();
	}
	if (needScrollbarInit && scrollbar) {
		if (swiper.isElement && (!scrollbarEl || typeof scrollbarEl === "string")) {
			const el = document.createElement("div");
			el.classList.add("swiper-scrollbar");
			el.part.add("scrollbar");
			swiper.el.appendChild(el);
			scrollbarEl = el;
		}
		const scrollbarParams = current.scrollbar;
		if (scrollbarEl && isObject(scrollbarParams)) scrollbarParams.el = scrollbarEl;
		scrollbar.init();
		scrollbar.updateSize();
		scrollbar.setTranslate();
	}
	if (needNavigationInit && navigation) {
		if (swiper.isElement) {
			if (!nextEl || typeof nextEl === "string") {
				const el = document.createElement("div");
				el.classList.add("swiper-button-next");
				setInnerHTML(el, navigation.arrowSvg);
				el.part.add("button-next");
				swiper.el.appendChild(el);
				nextEl = el;
			}
			if (!prevEl || typeof prevEl === "string") {
				const el = document.createElement("div");
				el.classList.add("swiper-button-prev");
				setInnerHTML(el, navigation.arrowSvg);
				el.part.add("button-prev");
				swiper.el.appendChild(el);
				prevEl = el;
			}
		}
		const navigationParams = current.navigation;
		if (nextEl && isObject(navigationParams)) navigationParams.nextEl = nextEl;
		if (prevEl && isObject(navigationParams)) navigationParams.prevEl = prevEl;
		navigation.init();
		navigation.update();
	}
	if (changedParams.includes("allowSlideNext")) swiper.allowSlideNext = passed.allowSlideNext;
	if (changedParams.includes("allowSlidePrev")) swiper.allowSlidePrev = passed.allowSlidePrev;
	if (changedParams.includes("direction")) swiper.changeDirection(passed.direction, false);
	if (loopNeedDestroy || loopNeedReloop) swiper.loopDestroy();
	if (loopNeedEnable || loopNeedReloop) swiper.loopCreate();
	swiper.update();
}
//#endregion
//#region node_modules/swiper/shared/swiper-core.mjs
var supportCached;
function calcSupport() {
	if (typeof window === "undefined") return { touch: false };
	return { touch: "ontouchstart" in window || navigator.maxTouchPoints > 0 };
}
function getSupport() {
	if (!supportCached) supportCached = calcSupport();
	return supportCached;
}
var deviceCached;
function calcDevice({ userAgent } = {}) {
	if (typeof window === "undefined") return {
		ios: false,
		android: false
	};
	const support = getSupport();
	const platform = navigator.platform;
	const ua = userAgent || navigator.userAgent;
	const device = {
		ios: false,
		android: false
	};
	const isAndroid = /(Android);?[\s/]+([\d.]+)?/.test(ua);
	const isIPhoneOrIPod = /(iPhone\sOS|iOS|iPod)/.test(ua);
	const isIPadDirect = /iPad/.test(ua);
	const isIPadMasquerade = platform === "MacIntel" && support.touch && navigator.maxTouchPoints > 1;
	const isIPad = isIPadDirect || isIPadMasquerade;
	if (isAndroid && !(platform === "Win32")) {
		device.os = "android";
		device.android = true;
	}
	if (isIPad || isIPhoneOrIPod) {
		device.os = "ios";
		device.ios = true;
	}
	return device;
}
function getDevice(overrides = {}) {
	if (!deviceCached) deviceCached = calcDevice(overrides);
	return deviceCached;
}
var browserCached;
function calcBrowser() {
	if (typeof window === "undefined") return {
		isSafari: false,
		isWebView: false,
		need3dFix: false
	};
	const device = getDevice();
	const ua = navigator.userAgent;
	const uaLower = ua.toLowerCase();
	const isSafari = uaLower.includes("safari") && !uaLower.includes("chrome") && !uaLower.includes("android");
	const isWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(ua);
	return {
		isSafari,
		isWebView,
		need3dFix: isSafari || isWebView && device.ios
	};
}
function getBrowser() {
	if (!browserCached) browserCached = calcBrowser();
	return browserCached;
}
var processLazyPreloader = (swiper, imageEl) => {
	if (!swiper || swiper.destroyed || !swiper.params) return;
	const slideSelector = () => swiper.isElement ? "swiper-slide" : `.${swiper.params.slideClass}`;
	const slideEl = imageEl.closest(slideSelector());
	if (slideEl) {
		let lazyEl = slideEl.querySelector(`.${swiper.params.lazyPreloaderClass}`);
		if (!lazyEl && swiper.isElement) if (slideEl.shadowRoot) lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
		else requestAnimationFrame(() => {
			if (slideEl.shadowRoot) {
				const innerLazy = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
				if (innerLazy && !innerLazy.lazyPreloaderManaged) innerLazy.remove();
			}
		});
		if (lazyEl && !lazyEl.lazyPreloaderManaged) lazyEl.remove();
	}
};
var unlazy = (swiper, index) => {
	if (!swiper.slides[index]) return;
	const imageEl = swiper.slides[index].querySelector("[loading=\"lazy\"]");
	if (imageEl) imageEl.removeAttribute("loading");
};
var preload = (swiper) => {
	if (!swiper || swiper.destroyed || !swiper.params) return;
	let amount = swiper.params.lazyPreloadPrevNext;
	const len = swiper.slides.length;
	if (!len || !amount || amount < 0) return;
	amount = Math.min(amount, len);
	const slidesPerView = swiper.params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(swiper.params.slidesPerView);
	const activeIndex = swiper.activeIndex;
	if (swiper.params.grid && (swiper.params.grid.rows ?? 1) > 1) {
		const activeColumn = activeIndex;
		const preloadColumns = [activeColumn - amount];
		preloadColumns.push(...Array.from({ length: amount }).map((_, i) => activeColumn + slidesPerView + i));
		swiper.slides.forEach((slideEl, i) => {
			if (slideEl.column !== void 0 && preloadColumns.includes(slideEl.column)) unlazy(swiper, i);
		});
		return;
	}
	const slideIndexLastInView = activeIndex + slidesPerView - 1;
	if (swiper.params.rewind || swiper.params.loop) for (let i = activeIndex - amount; i <= slideIndexLastInView + amount; i += 1) {
		const realIndex = (i % len + len) % len;
		if (realIndex < activeIndex || realIndex > slideIndexLastInView) unlazy(swiper, realIndex);
	}
	else for (let i = Math.max(activeIndex - amount, 0); i <= Math.min(slideIndexLastInView + amount, len - 1); i += 1) if (i !== activeIndex && (i > slideIndexLastInView || i < activeIndex)) unlazy(swiper, i);
};
function getBreakpoint(breakpoints, base = "window", containerEl) {
	if (!breakpoints || base === "container" && !containerEl) return void 0;
	let breakpoint = false;
	const currentHeight = base === "window" ? window.innerHeight : containerEl.clientHeight;
	const points = Object.keys(breakpoints).map((point) => {
		if (typeof point === "string" && point.indexOf("@") === 0) {
			const minRatio = parseFloat(point.substr(1));
			return {
				value: currentHeight * minRatio,
				point
			};
		}
		return {
			value: point,
			point
		};
	});
	points.sort((a, b) => parseInt(String(a.value), 10) - parseInt(String(b.value), 10));
	for (let i = 0; i < points.length; i += 1) {
		const { point, value } = points[i];
		if (base === "window") {
			if (window.matchMedia(`(min-width: ${value}px)`).matches) breakpoint = point;
		} else if (value <= containerEl.clientWidth) breakpoint = point;
	}
	return breakpoint || "max";
}
var isGridEnabled = (swiper, params) => {
	return !!(swiper.grid && params.grid && params.grid.rows > 1);
};
function setBreakpoint() {
	const swiper = this;
	const { realIndex, initialized, params, el } = swiper;
	const breakpoints = params.breakpoints;
	if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0) return;
	const breakpointsBase = params.breakpointsBase === "window" || !params.breakpointsBase ? params.breakpointsBase : "container";
	const breakpointContainer = ["window", "container"].includes(params.breakpointsBase) || !params.breakpointsBase ? swiper.el : document.querySelector(params.breakpointsBase);
	const breakpoint = swiper.getBreakpoint(breakpoints, breakpointsBase, breakpointContainer);
	if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
	const breakpointsRecord = breakpoints;
	const breakpointParams = (breakpoint in breakpointsRecord ? breakpointsRecord[breakpoint] : void 0) || swiper.originalParams;
	const wasMultiRow = isGridEnabled(swiper, params);
	const isMultiRow = isGridEnabled(swiper, breakpointParams);
	const wasGrabCursor = swiper.params.grabCursor;
	const isGrabCursor = breakpointParams.grabCursor;
	const wasEnabled = params.enabled;
	if (wasMultiRow && !isMultiRow) {
		el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
		swiper.emitContainerClasses();
	} else if (!wasMultiRow && isMultiRow) {
		el.classList.add(`${params.containerModifierClass}grid`);
		if (breakpointParams.grid.fill && breakpointParams.grid.fill === "column" || !breakpointParams.grid.fill && params.grid.fill === "column") el.classList.add(`${params.containerModifierClass}grid-column`);
		swiper.emitContainerClasses();
	}
	if (wasGrabCursor && !isGrabCursor) swiper.unsetGrabCursor();
	else if (!wasGrabCursor && isGrabCursor) swiper.setGrabCursor();
	const moduleOpt = (opts, prop) => opts[prop];
	[
		"navigation",
		"pagination",
		"scrollbar"
	].forEach((prop) => {
		const bpOpts = moduleOpt(breakpointParams, prop);
		if (typeof bpOpts === "undefined") return;
		const paramsOpts = moduleOpt(params, prop);
		const wasModuleEnabled = typeof paramsOpts === "object" && paramsOpts !== null && paramsOpts.enabled;
		const isModuleEnabled = typeof bpOpts === "object" && bpOpts !== null && bpOpts.enabled;
		const moduleApi = swiper[prop];
		if (wasModuleEnabled && !isModuleEnabled) moduleApi?.disable?.();
		if (!wasModuleEnabled && isModuleEnabled) moduleApi?.enable?.();
	});
	const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
	const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
	const wasLoop = params.loop;
	if (directionChanged && initialized) swiper.changeDirection();
	extend$1(swiper.params, breakpointParams);
	const isEnabled = swiper.params.enabled;
	const hasLoop = swiper.params.loop;
	Object.assign(swiper, {
		allowTouchMove: swiper.params.allowTouchMove,
		allowSlideNext: swiper.params.allowSlideNext,
		allowSlidePrev: swiper.params.allowSlidePrev
	});
	if (wasEnabled && !isEnabled) swiper.disable();
	else if (!wasEnabled && isEnabled) swiper.enable();
	swiper.currentBreakpoint = breakpoint;
	swiper.emit("_beforeBreakpoint", breakpointParams);
	if (initialized) {
		if (needsReLoop) {
			swiper.loopDestroy();
			swiper.loopCreate(realIndex);
			swiper.updateSlides();
		} else if (!wasLoop && hasLoop) {
			swiper.loopCreate(realIndex);
			swiper.updateSlides();
		} else if (wasLoop && !hasLoop) swiper.loopDestroy();
	}
	swiper.emit("breakpoint", breakpointParams);
}
var breakpoints = {
	setBreakpoint,
	getBreakpoint
};
function checkOverflow() {
	const swiper = this;
	const { isLocked: wasLocked, params } = swiper;
	const { slidesOffsetBefore } = params;
	if (slidesOffsetBefore) {
		const lastSlideIndex = swiper.slides.length - 1;
		const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
		swiper.isLocked = swiper.size > lastSlideRightEdge;
	} else swiper.isLocked = swiper.snapGrid.length === 1;
	if (params.allowSlideNext === true) swiper.allowSlideNext = !swiper.isLocked;
	if (params.allowSlidePrev === true) swiper.allowSlidePrev = !swiper.isLocked;
	if (wasLocked && wasLocked !== swiper.isLocked) swiper.isEnd = false;
	if (wasLocked !== swiper.isLocked) swiper.emit(swiper.isLocked ? "lock" : "unlock");
}
var checkOverflow$1 = { checkOverflow };
function prepareClasses(entries, prefix) {
	const resultClasses = [];
	entries.forEach((item) => {
		if (typeof item === "object") Object.keys(item).forEach((classNames) => {
			if (item[classNames]) resultClasses.push(prefix + classNames);
		});
		else if (typeof item === "string") resultClasses.push(prefix + item);
	});
	return resultClasses;
}
function addClasses() {
	const swiper = this;
	const { classNames, params, rtl, el, device } = swiper;
	const suffixes = prepareClasses([
		"initialized",
		params.direction,
		{ "free-mode": swiper.params.freeMode && params.freeMode.enabled },
		{ "autoheight": params.autoHeight },
		{ "rtl": rtl },
		{ "grid": params.grid && params.grid.rows > 1 },
		{ "grid-column": params.grid && params.grid.rows > 1 && params.grid.fill === "column" },
		{ "android": device.android },
		{ "ios": device.ios },
		{ "css-mode": params.cssMode },
		{ "centered": params.cssMode && params.centeredSlides },
		{ "watch-progress": params.watchSlidesProgress }
	], params.containerModifierClass);
	classNames.push(...suffixes);
	el.classList.add(...classNames);
	swiper.emitContainerClasses();
}
function removeClasses() {
	const swiper = this;
	const { el, classNames } = swiper;
	if (!el || typeof el === "string") return;
	el.classList.remove(...classNames);
	swiper.emitContainerClasses();
}
var classes = {
	addClasses,
	removeClasses
};
var defaults = {
	init: true,
	direction: "horizontal",
	oneWayMovement: false,
	swiperElementNodeName: "SWIPER-CONTAINER",
	touchEventsTarget: "wrapper",
	initialSlide: 0,
	speed: 300,
	cssMode: false,
	updateOnWindowResize: true,
	resizeObserver: true,
	nested: false,
	createElements: false,
	eventsPrefix: "swiper",
	enabled: true,
	focusableElements: "input, select, option, textarea, button, video, label",
	width: null,
	height: null,
	preventInteractionOnTransition: false,
	userAgent: null,
	url: null,
	edgeSwipeDetection: false,
	edgeSwipeThreshold: 20,
	autoHeight: false,
	setWrapperSize: false,
	virtualTranslate: false,
	effect: "slide",
	breakpoints: void 0,
	breakpointsBase: "window",
	spaceBetween: 0,
	slidesPerView: 1,
	slidesPerGroup: 1,
	slidesPerGroupSkip: 0,
	slidesPerGroupAuto: false,
	centeredSlides: false,
	centeredSlidesBounds: false,
	slidesOffsetBefore: 0,
	slidesOffsetAfter: 0,
	normalizeSlideIndex: true,
	centerInsufficientSlides: false,
	snapToSlideEdge: false,
	watchOverflow: true,
	roundLengths: false,
	touchRatio: 1,
	touchAngle: 45,
	simulateTouch: true,
	shortSwipes: true,
	longSwipes: true,
	longSwipesRatio: .5,
	longSwipesMs: 300,
	followFinger: true,
	allowTouchMove: true,
	threshold: 5,
	touchMoveStopPropagation: false,
	touchStartPreventDefault: true,
	touchStartForcePreventDefault: false,
	touchReleaseOnEdges: false,
	uniqueNavElements: true,
	resistance: true,
	resistanceRatio: .85,
	watchSlidesProgress: false,
	grabCursor: false,
	preventClicks: true,
	preventClicksPropagation: true,
	slideToClickedSlide: false,
	loop: false,
	loopAddBlankSlides: true,
	loopAdditionalSlides: 0,
	loopPreventsSliding: true,
	rewind: false,
	allowSlidePrev: true,
	allowSlideNext: true,
	swipeHandler: null,
	noSwiping: true,
	noSwipingClass: "swiper-no-swiping",
	noSwipingSelector: null,
	passiveListeners: true,
	maxBackfaceHiddenSlides: 10,
	containerModifierClass: "swiper-",
	slideClass: "swiper-slide",
	slideBlankClass: "swiper-slide-blank",
	slideActiveClass: "swiper-slide-active",
	slideVisibleClass: "swiper-slide-visible",
	slideFullyVisibleClass: "swiper-slide-fully-visible",
	slideNextClass: "swiper-slide-next",
	slidePrevClass: "swiper-slide-prev",
	wrapperClass: "swiper-wrapper",
	lazyPreloaderClass: "swiper-lazy-preloader",
	lazyPreloadPrevNext: 0,
	runCallbacksOnInit: true,
	_emitClasses: false
};
var eventsEmitter = {
	on(events, handler, priority) {
		const self = this;
		if (!self.eventsListeners || self.destroyed) return self;
		if (typeof handler !== "function") return self;
		const method = priority ? "unshift" : "push";
		events.split(" ").forEach((event) => {
			if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
			self.eventsListeners[event][method](handler);
		});
		return self;
	},
	once(events, handler, priority) {
		const self = this;
		if (!self.eventsListeners || self.destroyed) return self;
		if (typeof handler !== "function") return self;
		const onceHandler = function onceHandlerFn(...args) {
			self.off(events, onceHandler);
			if (onceHandler.__emitterProxy) delete onceHandler.__emitterProxy;
			handler.apply(self, args);
		};
		onceHandler.__emitterProxy = handler;
		return self.on(events, onceHandler, priority);
	},
	onAny(handler, priority) {
		const self = this;
		if (!self.eventsListeners || self.destroyed) return self;
		if (typeof handler !== "function") return self;
		const method = priority ? "unshift" : "push";
		if (self.eventsAnyListeners.indexOf(handler) < 0) self.eventsAnyListeners[method](handler);
		return self;
	},
	offAny(handler) {
		const self = this;
		if (!self.eventsListeners || self.destroyed) return self;
		if (!self.eventsAnyListeners) return self;
		const index = self.eventsAnyListeners.indexOf(handler);
		if (index >= 0) self.eventsAnyListeners.splice(index, 1);
		return self;
	},
	off(events, handler) {
		const self = this;
		if (!self.eventsListeners || self.destroyed) return self;
		if (!self.eventsListeners) return self;
		events.split(" ").forEach((event) => {
			if (typeof handler === "undefined") self.eventsListeners[event] = [];
			else if (self.eventsListeners[event]) self.eventsListeners[event].forEach((eventHandler, index) => {
				if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) self.eventsListeners[event].splice(index, 1);
			});
		});
		return self;
	},
	emit(...args) {
		const self = this;
		if (!self.eventsListeners || self.destroyed) return self;
		if (!self.eventsListeners) return self;
		let events;
		let data;
		let context;
		if (typeof args[0] === "string" || Array.isArray(args[0])) {
			events = args[0];
			data = args.slice(1, args.length);
			context = self;
		} else {
			const opts = args[0];
			events = opts.events;
			data = opts.data ?? [];
			context = opts.context || self;
		}
		data.unshift(context);
		(Array.isArray(events) ? events : events.split(" ")).forEach((event) => {
			if (self.eventsAnyListeners && self.eventsAnyListeners.length) self.eventsAnyListeners.forEach((eventHandler) => {
				eventHandler.apply(context, [event, ...data]);
			});
			if (self.eventsListeners && self.eventsListeners[event]) self.eventsListeners[event].forEach((eventHandler) => {
				eventHandler.apply(context, data);
			});
		});
		return self;
	}
};
function onClick(e) {
	const swiper = this;
	if (swiper.destroyed) return;
	if (!swiper.enabled) return;
	if (!swiper.allowClick) {
		if (swiper.params.preventClicks) e.preventDefault();
		if (swiper.params.preventClicksPropagation && swiper.animating) {
			e.stopPropagation();
			e.stopImmediatePropagation();
		}
	}
}
function onDocumentTouchStart() {
	const swiper = this;
	if (swiper.destroyed) return;
	if (swiper.documentTouchHandlerProceeded) return;
	swiper.documentTouchHandlerProceeded = true;
	if (swiper.params.touchReleaseOnEdges) swiper.el.style.touchAction = "auto";
}
function onLoad(e) {
	const swiper = this;
	if (swiper.destroyed) return;
	processLazyPreloader(swiper, e.target);
	if (swiper.params.cssMode || swiper.params.slidesPerView !== "auto" && !swiper.params.autoHeight) return;
	swiper.update();
}
function onResize() {
	const swiper = this;
	const { params, el } = swiper;
	if (el && el.offsetWidth === 0) return;
	if (params.breakpoints) swiper.setBreakpoint();
	const { allowSlideNext, allowSlidePrev, snapGrid } = swiper;
	const isVirtual = swiper.virtual && swiper.params.virtual?.enabled;
	swiper.allowSlideNext = true;
	swiper.allowSlidePrev = true;
	swiper.updateSize();
	swiper.updateSlides();
	swiper.updateSlidesClasses();
	const isVirtualLoop = isVirtual && params.loop;
	if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides && !isVirtualLoop) {
		const slidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
		swiper.slideTo(slidesLength - 1, 0, false, true);
	} else if (swiper.params.loop && !isVirtual) swiper.slideToLoop(swiper.realIndex, 0, false, true);
	else swiper.slideTo(swiper.activeIndex, 0, false, true);
	if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
		const autoplay = swiper.autoplay;
		clearTimeout(autoplay.resizeTimeout);
		autoplay.resizeTimeout = setTimeout(() => {
			if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) swiper.autoplay.resume();
		}, 500);
	}
	swiper.allowSlidePrev = allowSlidePrev;
	swiper.allowSlideNext = allowSlideNext;
	if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
}
function onScroll() {
	const swiper = this;
	if (swiper.destroyed) return;
	const { wrapperEl, rtlTranslate, enabled } = swiper;
	if (!enabled) return;
	swiper.previousTranslate = swiper.translate;
	if (swiper.isHorizontal()) swiper.translate = -wrapperEl.scrollLeft;
	else swiper.translate = -wrapperEl.scrollTop;
	if (swiper.translate === 0) swiper.translate = 0;
	swiper.updateActiveIndex();
	swiper.updateSlidesClasses();
	let newProgress;
	const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
	if (translatesDiff === 0) newProgress = 0;
	else newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
	if (newProgress !== swiper.progress) swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
	swiper.emit("setTranslate", swiper.translate, false);
}
function onTouchEnd(event) {
	const swiper = this;
	if (swiper.destroyed) return;
	const data = swiper.touchEventsData;
	let e = event.originalEvent ?? event;
	if (!(e.type === "touchend" || e.type === "touchcancel")) {
		if (data.touchId !== null) return;
		if (e.pointerId !== data.pointerId) return;
	} else {
		const found = [...e.changedTouches].find((t) => t.identifier === data.touchId);
		if (!found || found.identifier !== data.touchId) return;
	}
	if ([
		"pointercancel",
		"pointerout",
		"pointerleave",
		"contextmenu"
	].includes(e.type)) {
		if (!(["pointercancel", "contextmenu"].includes(e.type) && (swiper.browser.isSafari || swiper.browser.isWebView))) return;
	}
	data.pointerId = null;
	data.touchId = null;
	const { params, touches, rtlTranslate: rtl, slidesGrid, enabled } = swiper;
	if (!enabled) return;
	if (!params.simulateTouch && e.pointerType === "mouse") return;
	if (data.allowTouchCallbacks) swiper.emit("touchEnd", e);
	data.allowTouchCallbacks = false;
	if (!data.isTouched) {
		if (data.isMoved && params.grabCursor) swiper.setGrabCursor(false);
		data.isMoved = false;
		data.startMoving = false;
		return;
	}
	if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) swiper.setGrabCursor(false);
	const touchEndTime = now();
	const timeDiff = touchEndTime - data.touchStartTime;
	if (swiper.allowClick) {
		const pathTree = e.path ?? (e.composedPath && e.composedPath());
		swiper.updateClickedSlide(pathTree && pathTree[0], pathTree);
		swiper.emit("tap click", e);
		if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) swiper.emit("doubleTap doubleClick", e);
	}
	data.lastClickTime = now();
	nextTick(() => {
		if (!swiper.destroyed) swiper.allowClick = true;
	});
	if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 && !data.loopSwapReset || data.currentTranslate === data.startTranslate && !data.loopSwapReset) {
		data.isTouched = false;
		data.isMoved = false;
		data.startMoving = false;
		return;
	}
	data.isTouched = false;
	data.isMoved = false;
	data.startMoving = false;
	let currentPos;
	if (params.followFinger) currentPos = rtl ? swiper.translate : -swiper.translate;
	else currentPos = -(data.currentTranslate ?? 0);
	if (params.cssMode) return;
	if (params.freeMode && params.freeMode.enabled) {
		swiper.freeMode.onTouchEnd({ currentPos });
		return;
	}
	const swipeToLast = currentPos >= -swiper.maxTranslate() && !swiper.params.loop;
	let stopIndex = 0;
	let groupSize = swiper.slidesSizesGrid[0];
	for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
		const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
		if (typeof slidesGrid[i + increment] !== "undefined") {
			if (swipeToLast || currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
				stopIndex = i;
				groupSize = slidesGrid[i + increment] - slidesGrid[i];
			}
		} else if (swipeToLast || currentPos >= slidesGrid[i]) {
			stopIndex = i;
			groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
		}
	}
	let rewindFirstIndex = null;
	let rewindLastIndex = null;
	if (params.rewind) {
		if (swiper.isBeginning) rewindLastIndex = params.virtual?.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
		else if (swiper.isEnd) rewindFirstIndex = 0;
	}
	const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
	const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
	if (timeDiff > params.longSwipesMs) {
		if (!params.longSwipes) {
			swiper.slideTo(swiper.activeIndex);
			return;
		}
		if (swiper.swipeDirection === "next") if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment);
		else swiper.slideTo(stopIndex);
		if (swiper.swipeDirection === "prev") if (ratio > 1 - params.longSwipesRatio) swiper.slideTo(stopIndex + increment);
		else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) swiper.slideTo(rewindLastIndex);
		else swiper.slideTo(stopIndex);
	} else {
		if (!params.shortSwipes) {
			swiper.slideTo(swiper.activeIndex);
			return;
		}
		if (!(swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl))) {
			if (swiper.swipeDirection === "next") swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
			if (swiper.swipeDirection === "prev") swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
		} else if (e.target === swiper.navigation.nextEl) swiper.slideTo(stopIndex + increment);
		else swiper.slideTo(stopIndex);
	}
}
function onTouchMove(event) {
	const swiper = this;
	if (swiper.destroyed) return;
	const data = swiper.touchEventsData;
	const { params, touches, rtlTranslate: rtl, enabled } = swiper;
	if (!enabled) return;
	if (!params.simulateTouch && event.pointerType === "mouse") return;
	const wrapped = event;
	const e = wrapped.originalEvent ?? wrapped;
	if (e.type === "pointermove") {
		if (data.touchId !== null) return;
		if (e.pointerId !== data.pointerId) return;
	}
	let targetTouch;
	if (e.type === "touchmove") {
		const found = [...e.changedTouches].find((t) => t.identifier === data.touchId);
		if (!found || found.identifier !== data.touchId) return;
		targetTouch = found;
	} else targetTouch = e;
	if (!data.isTouched) {
		if (data.startMoving && data.isScrolling) swiper.emit("touchMoveOpposite", e);
		return;
	}
	const pageX = targetTouch.pageX;
	const pageY = targetTouch.pageY;
	if (e.preventedByNestedSwiper) {
		touches.startX = pageX;
		touches.startY = pageY;
		return;
	}
	if (!swiper.allowTouchMove) {
		if (!e.target.matches(data.focusableElements)) swiper.allowClick = false;
		if (data.isTouched) {
			Object.assign(touches, {
				startX: pageX,
				startY: pageY,
				currentX: pageX,
				currentY: pageY
			});
			data.touchStartTime = now();
		}
		return;
	}
	if (params.touchReleaseOnEdges && !params.loop) {
		if (swiper.isVertical()) {
			if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
				data.isTouched = false;
				data.isMoved = false;
				return;
			}
		} else if (rtl && (pageX > touches.startX && -swiper.translate <= swiper.maxTranslate() || pageX < touches.startX && -swiper.translate >= swiper.minTranslate())) return;
		else if (!rtl && (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate())) return;
	}
	if (document.activeElement && document.activeElement.matches(data.focusableElements) && document.activeElement !== e.target && e.pointerType !== "mouse") document.activeElement.blur();
	if (document.activeElement) {
		if (e.target === document.activeElement && e.target.matches(data.focusableElements)) {
			data.isMoved = true;
			swiper.allowClick = false;
			return;
		}
	}
	if (data.allowTouchCallbacks) swiper.emit("touchMove", e);
	touches.previousX = touches.currentX;
	touches.previousY = touches.currentY;
	touches.currentX = pageX;
	touches.currentY = pageY;
	const diffX = touches.currentX - touches.startX;
	const diffY = touches.currentY - touches.startY;
	if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
	if (typeof data.isScrolling === "undefined") {
		let touchAngle;
		if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) data.isScrolling = false;
		else if (diffX * diffX + diffY * diffY >= 25) {
			touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
			data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
		}
	}
	if (data.isScrolling) swiper.emit("touchMoveOpposite", e);
	if (typeof data.startMoving === "undefined") {
		if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) data.startMoving = true;
	}
	if (data.isScrolling || e.type === "touchmove" && data.preventTouchMoveFromPointerMove) {
		data.isTouched = false;
		return;
	}
	if (!data.startMoving) return;
	swiper.allowClick = false;
	if (!params.cssMode && e.cancelable) e.preventDefault();
	if (params.touchMoveStopPropagation && !params.nested) e.stopPropagation();
	let diff = swiper.isHorizontal() ? diffX : diffY;
	let touchesDiff = swiper.isHorizontal() ? touches.currentX - touches.previousX : touches.currentY - touches.previousY;
	if (params.oneWayMovement) {
		diff = Math.abs(diff) * (rtl ? 1 : -1);
		touchesDiff = Math.abs(touchesDiff) * (rtl ? 1 : -1);
	}
	touches.diff = diff;
	diff *= params.touchRatio;
	if (rtl) {
		diff = -diff;
		touchesDiff = -touchesDiff;
	}
	const prevTouchesDirection = swiper.touchesDirection;
	swiper.swipeDirection = diff > 0 ? "prev" : "next";
	swiper.touchesDirection = touchesDiff > 0 ? "prev" : "next";
	const isLoop = swiper.params.loop && !params.cssMode;
	const allowLoopFix = swiper.touchesDirection === "next" && swiper.allowSlideNext || swiper.touchesDirection === "prev" && swiper.allowSlidePrev;
	if (!data.isMoved) {
		if (isLoop && allowLoopFix) swiper.loopFix({ direction: swiper.swipeDirection });
		data.startTranslate = swiper.getTranslate();
		swiper.setTransition(0);
		if (swiper.animating) {
			const evt = new window.CustomEvent("transitionend", {
				bubbles: true,
				cancelable: true,
				detail: { bySwiperTouchMove: true }
			});
			swiper.wrapperEl.dispatchEvent(evt);
		}
		data.allowMomentumBounce = false;
		if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) swiper.setGrabCursor(true);
		swiper.emit("sliderFirstMove", e);
	}
	(/* @__PURE__ */ new Date()).getTime();
	if (params._loopSwapReset !== false && data.isMoved && data.allowThresholdMove && prevTouchesDirection !== swiper.touchesDirection && isLoop && allowLoopFix && Math.abs(diff) >= 1) {
		Object.assign(touches, {
			startX: pageX,
			startY: pageY,
			currentX: pageX,
			currentY: pageY,
			startTranslate: data.currentTranslate
		});
		data.loopSwapReset = true;
		data.startTranslate = data.currentTranslate;
		return;
	}
	swiper.emit("sliderMove", e);
	data.isMoved = true;
	const startTranslate = data.startTranslate ?? 0;
	data.currentTranslate = diff + startTranslate;
	let disableParentSwiper = true;
	let resistanceRatio = params.resistanceRatio;
	if (params.touchReleaseOnEdges) resistanceRatio = 0;
	if (diff > 0) {
		if (isLoop && allowLoopFix && data.allowThresholdMove && data.currentTranslate > (params.centeredSlides ? swiper.minTranslate() - swiper.slidesSizesGrid[swiper.activeIndex + 1] - (params.slidesPerView !== "auto" && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.activeIndex + 1] + swiper.params.spaceBetween : 0) - swiper.params.spaceBetween : swiper.minTranslate())) swiper.loopFix({
			direction: "prev",
			setTranslate: true,
			activeSlideIndex: 0
		});
		if (data.currentTranslate > swiper.minTranslate()) {
			disableParentSwiper = false;
			if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + startTranslate + diff) ** resistanceRatio;
		}
	} else if (diff < 0) {
		if (isLoop && allowLoopFix && data.allowThresholdMove && data.currentTranslate < (params.centeredSlides ? swiper.maxTranslate() + swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween + (params.slidesPerView !== "auto" && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween : 0) : swiper.maxTranslate())) swiper.loopFix({
			direction: "next",
			setTranslate: true,
			activeSlideIndex: swiper.slides.length - (params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(parseFloat(String(params.slidesPerView))))
		});
		if (data.currentTranslate < swiper.maxTranslate()) {
			disableParentSwiper = false;
			if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - startTranslate - diff) ** resistanceRatio;
		}
	}
	if (disableParentSwiper) e.preventedByNestedSwiper = true;
	if (!swiper.allowSlideNext && swiper.swipeDirection === "next" && (data.currentTranslate ?? 0) < startTranslate) data.currentTranslate = startTranslate;
	if (!swiper.allowSlidePrev && swiper.swipeDirection === "prev" && (data.currentTranslate ?? 0) > startTranslate) data.currentTranslate = startTranslate;
	if (!swiper.allowSlidePrev && !swiper.allowSlideNext) data.currentTranslate = startTranslate;
	if (params.threshold > 0) if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
		if (!data.allowThresholdMove) {
			data.allowThresholdMove = true;
			touches.startX = touches.currentX;
			touches.startY = touches.currentY;
			data.currentTranslate = data.startTranslate;
			touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
			return;
		}
	} else {
		data.currentTranslate = data.startTranslate;
		return;
	}
	if (!params.followFinger || params.cssMode) return;
	if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
		swiper.updateActiveIndex();
		swiper.updateSlidesClasses();
	}
	if (params.freeMode && params.freeMode.enabled && swiper.freeMode) swiper.freeMode.onTouchMove();
	swiper.updateProgress(data.currentTranslate);
	swiper.setTranslate(data.currentTranslate ?? 0);
}
function closestElement(selector, base) {
	function __closestFrom(el) {
		if (!el || el === document || el === window) return null;
		let cur = el;
		if (cur.assignedSlot) cur = cur.assignedSlot;
		const found = cur.closest(selector);
		if (!found && !cur.getRootNode) return null;
		const root = cur.getRootNode();
		return found || __closestFrom(root.host);
	}
	return __closestFrom(base);
}
function preventEdgeSwipe(swiper, event, startX) {
	const { params } = swiper;
	const edgeSwipeDetection = params.edgeSwipeDetection;
	const edgeSwipeThreshold = params.edgeSwipeThreshold;
	if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) {
		if (edgeSwipeDetection === "prevent") {
			event.preventDefault();
			return true;
		}
		return false;
	}
	return true;
}
function onTouchStart(event) {
	const swiper = this;
	if (swiper.destroyed) return;
	const e = event.originalEvent ?? event;
	const data = swiper.touchEventsData;
	if (e.type === "pointerdown") {
		const pe = e;
		if (data.pointerId !== null && data.pointerId !== pe.pointerId) return;
		data.pointerId = pe.pointerId;
	} else if (e.type === "touchstart" && e.targetTouches.length === 1) data.touchId = e.targetTouches[0].identifier;
	if (e.type === "touchstart") {
		preventEdgeSwipe(swiper, e, e.targetTouches[0].pageX);
		return;
	}
	const { params, touches, enabled } = swiper;
	if (!enabled) return;
	if (!params.simulateTouch && e.pointerType === "mouse") return;
	if (swiper.animating && params.preventInteractionOnTransition) return;
	if (!swiper.animating && params.cssMode && params.loop) swiper.loopFix();
	let targetEl = e.target;
	if (params.touchEventsTarget === "wrapper") {
		if (!elementIsChildOf(targetEl, swiper.wrapperEl)) return;
	}
	const mouseLike = e;
	if (typeof mouseLike.which === "number" && mouseLike.which === 3) return;
	if (typeof mouseLike.button === "number" && mouseLike.button > 0) return;
	if (data.isTouched && data.isMoved) return;
	const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== "";
	const eventPath = e.composedPath ? e.composedPath() : e.path;
	if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) targetEl = eventPath[0];
	const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
	const isTargetShadow = !!(e.target && e.target.shadowRoot);
	if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, targetEl) : targetEl.closest(noSwipingSelector))) {
		swiper.allowClick = true;
		return;
	}
	if (params.swipeHandler) {
		if (typeof params.swipeHandler === "string" && !targetEl.closest(params.swipeHandler)) return;
	}
	const pe = e;
	touches.currentX = pe.pageX;
	touches.currentY = pe.pageY;
	const startX = touches.currentX;
	const startY = touches.currentY;
	if (!preventEdgeSwipe(swiper, e, startX)) return;
	Object.assign(data, {
		isTouched: true,
		isMoved: false,
		allowTouchCallbacks: true,
		isScrolling: void 0,
		startMoving: void 0
	});
	touches.startX = startX;
	touches.startY = startY;
	data.touchStartTime = now();
	swiper.allowClick = true;
	swiper.updateSize();
	swiper.swipeDirection = void 0;
	if (params.threshold > 0) data.allowThresholdMove = false;
	let preventDefault = true;
	if (targetEl.matches(data.focusableElements)) {
		preventDefault = false;
		if (targetEl.nodeName === "SELECT") data.isTouched = false;
	}
	if (document.activeElement && document.activeElement.matches(data.focusableElements) && document.activeElement !== targetEl && (pe.pointerType === "mouse" || pe.pointerType !== "mouse" && !targetEl.matches(data.focusableElements))) document.activeElement.blur();
	const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
	if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !targetEl.isContentEditable) e.preventDefault();
	if (params.freeMode && params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) swiper.freeMode.onTouchStart();
	swiper.emit("touchStart", e);
}
var events = (swiper, method) => {
	const { params, el, wrapperEl, device } = swiper;
	const capture = !!params.nested;
	const domMethod = method === "on" ? "addEventListener" : "removeEventListener";
	const swiperMethod = method;
	if (!el || typeof el === "string") return;
	document[domMethod]("touchstart", swiper.onDocumentTouchStart, {
		passive: false,
		capture
	});
	el[domMethod]("touchstart", swiper.onTouchStart, { passive: false });
	el[domMethod]("pointerdown", swiper.onTouchStart, { passive: false });
	document[domMethod]("touchmove", swiper.onTouchMove, {
		passive: false,
		capture
	});
	document[domMethod]("pointermove", swiper.onTouchMove, {
		passive: false,
		capture
	});
	document[domMethod]("touchend", swiper.onTouchEnd, { passive: true });
	document[domMethod]("pointerup", swiper.onTouchEnd, { passive: true });
	document[domMethod]("pointercancel", swiper.onTouchEnd, { passive: true });
	document[domMethod]("touchcancel", swiper.onTouchEnd, { passive: true });
	document[domMethod]("pointerout", swiper.onTouchEnd, { passive: true });
	document[domMethod]("pointerleave", swiper.onTouchEnd, { passive: true });
	document[domMethod]("contextmenu", swiper.onTouchEnd, { passive: true });
	if (params.preventClicks || params.preventClicksPropagation) el[domMethod]("click", swiper.onClick, true);
	if (params.cssMode) wrapperEl[domMethod]("scroll", swiper.onScroll);
	const subscribe = (events) => {
		swiper[swiperMethod](events, onResize, true);
	};
	if (params.updateOnWindowResize) subscribe(device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate");
	else subscribe("observerUpdate");
	el[domMethod]("load", swiper.onLoad, { capture: true });
};
function attachEvents() {
	const swiper = this;
	const { params } = swiper;
	swiper.onTouchStart = onTouchStart.bind(swiper);
	swiper.onTouchMove = onTouchMove.bind(swiper);
	swiper.onTouchEnd = onTouchEnd.bind(swiper);
	swiper.onDocumentTouchStart = onDocumentTouchStart.bind(swiper);
	if (params.cssMode) swiper.onScroll = onScroll.bind(swiper);
	swiper.onClick = onClick.bind(swiper);
	swiper.onLoad = onLoad.bind(swiper);
	events(swiper, "on");
}
function detachEvents() {
	events(this, "off");
}
var events$1 = {
	attachEvents,
	detachEvents
};
function setGrabCursor(moving) {
	const swiper = this;
	if (!swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
	const el = swiper.params.touchEventsTarget === "container" ? swiper.el : swiper.wrapperEl;
	if (swiper.isElement) swiper.__preventObserver__ = true;
	el.style.cursor = "move";
	el.style.cursor = moving ? "grabbing" : "grab";
	if (swiper.isElement) requestAnimationFrame(() => {
		swiper.__preventObserver__ = false;
	});
}
function unsetGrabCursor() {
	const swiper = this;
	if (swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
	if (swiper.isElement) swiper.__preventObserver__ = true;
	swiper[swiper.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "";
	if (swiper.isElement) requestAnimationFrame(() => {
		swiper.__preventObserver__ = false;
	});
}
var grabCursor = {
	setGrabCursor,
	unsetGrabCursor
};
function loopCreate(slideRealIndex, initial) {
	const swiper = this;
	const { params, slidesEl } = swiper;
	if (!params.loop || swiper.virtual && swiper.params.virtual?.enabled) return;
	const initSlides = () => {
		elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`).forEach((el, index) => {
			el.setAttribute("data-swiper-slide-index", String(index));
		});
	};
	const clearBlankSlides = () => {
		const slides = elementChildren(slidesEl, `.${params.slideBlankClass}`);
		slides.forEach((el) => {
			el.remove();
		});
		if (slides.length > 0) {
			swiper.recalcSlides();
			swiper.updateSlides();
		}
	};
	const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
	if (params.loopAddBlankSlides && (params.slidesPerGroup > 1 || gridEnabled)) clearBlankSlides();
	const slidesPerGroup = params.slidesPerGroup * (gridEnabled ? params.grid.rows : 1);
	const shouldFillGroup = swiper.slides.length % slidesPerGroup !== 0;
	const shouldFillGrid = gridEnabled && swiper.slides.length % params.grid.rows !== 0;
	const addBlankSlides = (amountOfSlides) => {
		for (let i = 0; i < amountOfSlides; i += 1) {
			const slideEl = swiper.isElement ? createElement("swiper-slide", [params.slideBlankClass]) : createElement("div", [params.slideClass, params.slideBlankClass]);
			swiper.slidesEl.append(slideEl);
		}
	};
	if (shouldFillGroup) {
		if (params.loopAddBlankSlides) {
			addBlankSlides(slidesPerGroup - swiper.slides.length % slidesPerGroup);
			swiper.recalcSlides();
			swiper.updateSlides();
		} else showWarning("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
		initSlides();
	} else if (shouldFillGrid) {
		if (params.loopAddBlankSlides) {
			addBlankSlides(params.grid.rows - swiper.slides.length % params.grid.rows);
			swiper.recalcSlides();
			swiper.updateSlides();
		} else showWarning("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
		initSlides();
	} else initSlides();
	const bothDirections = params.centeredSlides || !!params.slidesOffsetBefore || !!params.slidesOffsetAfter;
	swiper.loopFix({
		slideRealIndex,
		direction: bothDirections ? void 0 : "next",
		initial
	});
}
function loopDestroy() {
	const swiper = this;
	const { params, slidesEl } = swiper;
	if (!params.loop || !slidesEl || swiper.virtual && swiper.params.virtual?.enabled) return;
	swiper.recalcSlides();
	const newSlidesOrder = [];
	swiper.slides.forEach((slideEl) => {
		const loopSlideEl = slideEl;
		const index = typeof loopSlideEl.swiperSlideIndex === "undefined" ? Number(slideEl.getAttribute("data-swiper-slide-index")) : loopSlideEl.swiperSlideIndex;
		newSlidesOrder[index] = slideEl;
	});
	swiper.slides.forEach((slideEl) => {
		slideEl.removeAttribute("data-swiper-slide-index");
	});
	newSlidesOrder.forEach((slideEl) => {
		slidesEl.append(slideEl);
	});
	swiper.recalcSlides();
	swiper.slideTo(swiper.realIndex, 0);
}
function loopFix(options = {}) {
	const { slideRealIndex, slideTo = true, direction, setTranslate, activeSlideIndex: activeSlideIndexParam, initial, byController, byMousewheel } = options;
	let activeSlideIndex = activeSlideIndexParam;
	const swiper = this;
	if (!swiper.params.loop) return;
	swiper.emit("beforeLoopFix");
	const { slides, allowSlidePrev, allowSlideNext, slidesEl, params } = swiper;
	const { centeredSlides, slidesOffsetBefore, slidesOffsetAfter, initialSlide } = params;
	const bothDirections = centeredSlides || !!slidesOffsetBefore || !!slidesOffsetAfter;
	swiper.allowSlidePrev = true;
	swiper.allowSlideNext = true;
	if (swiper.virtual && params.virtual?.enabled) {
		if (slideTo) {
			const virtualSlidesLength = swiper.virtual.slides.length;
			const virtualSlidesBefore = swiper.virtual.slidesBefore ?? 0;
			if (!bothDirections && swiper.snapIndex === 0) swiper.slideTo(virtualSlidesLength, 0, false, true);
			else if (bothDirections && swiper.snapIndex < params.slidesPerView) swiper.slideTo(virtualSlidesLength + swiper.snapIndex, 0, false, true);
			else if (swiper.snapIndex === swiper.snapGrid.length - 1) swiper.slideTo(virtualSlidesBefore, 0, false, true);
		}
		swiper.allowSlidePrev = allowSlidePrev;
		swiper.allowSlideNext = allowSlideNext;
		swiper.emit("loopFix");
		return;
	}
	let slidesPerView = params.slidesPerView;
	if (slidesPerView === "auto") slidesPerView = swiper.slidesPerViewDynamic();
	else {
		slidesPerView = Math.ceil(parseFloat(String(params.slidesPerView)));
		if (bothDirections && slidesPerView % 2 === 0) slidesPerView = slidesPerView + 1;
	}
	const slidesPerGroup = params.slidesPerGroupAuto ? slidesPerView : params.slidesPerGroup;
	let loopedSlides = bothDirections ? Math.max(slidesPerGroup, Math.ceil(slidesPerView / 2)) : slidesPerGroup;
	if (loopedSlides % slidesPerGroup !== 0) loopedSlides += slidesPerGroup - loopedSlides % slidesPerGroup;
	loopedSlides += params.loopAdditionalSlides;
	swiper.loopedSlides = loopedSlides;
	const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
	if (slides.length < slidesPerView + loopedSlides || swiper.params.effect === "cards" && slides.length < slidesPerView + loopedSlides * 2) showWarning("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled or not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters");
	else if (gridEnabled && params.grid.fill === "row") showWarning("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");
	const prependSlidesIndexes = [];
	const appendSlidesIndexes = [];
	const cols = gridEnabled ? Math.ceil(slides.length / params.grid.rows) : slides.length;
	const isInitialOverflow = initial && cols - initialSlide < slidesPerView && !bothDirections;
	let activeIndex = isInitialOverflow ? initialSlide : swiper.activeIndex;
	if (typeof activeSlideIndex === "undefined") activeSlideIndex = swiper.getSlideIndex(slides.find((el) => el.classList.contains(params.slideActiveClass)));
	else activeIndex = activeSlideIndex;
	const isNext = direction === "next" || !direction;
	const isPrev = direction === "prev" || !direction;
	let slidesPrepended = 0;
	let slidesAppended = 0;
	const activeColIndexWithShift = (gridEnabled ? slides[activeSlideIndex].column ?? 0 : activeSlideIndex) + (bothDirections && typeof setTranslate === "undefined" ? -slidesPerView / 2 + .5 : 0);
	if (activeColIndexWithShift < loopedSlides) {
		slidesPrepended = Math.max(loopedSlides - activeColIndexWithShift, slidesPerGroup);
		for (let i = 0; i < loopedSlides - activeColIndexWithShift; i += 1) {
			const index = i - Math.floor(i / cols) * cols;
			if (gridEnabled) {
				const colIndexToPrepend = cols - index - 1;
				for (let j = slides.length - 1; j >= 0; j -= 1) if (slides[j].column === colIndexToPrepend) prependSlidesIndexes.push(j);
			} else prependSlidesIndexes.push(cols - index - 1);
		}
	} else if (activeColIndexWithShift + slidesPerView > cols - loopedSlides) {
		slidesAppended = Math.max(activeColIndexWithShift - (cols - loopedSlides * 2), slidesPerGroup);
		if (isInitialOverflow) slidesAppended = Math.max(slidesAppended, slidesPerView - cols + initialSlide + 1);
		for (let i = 0; i < slidesAppended; i += 1) {
			const index = i - Math.floor(i / cols) * cols;
			if (gridEnabled) slides.forEach((slide, slideIndex) => {
				if (slide.column === index) appendSlidesIndexes.push(slideIndex);
			});
			else appendSlidesIndexes.push(index);
		}
	}
	swiper.__preventObserver__ = true;
	requestAnimationFrame(() => {
		swiper.__preventObserver__ = false;
	});
	if (swiper.params.effect === "cards" && slides.length < slidesPerView + loopedSlides * 2) {
		if (appendSlidesIndexes.includes(activeSlideIndex)) appendSlidesIndexes.splice(appendSlidesIndexes.indexOf(activeSlideIndex), 1);
		if (prependSlidesIndexes.includes(activeSlideIndex)) prependSlidesIndexes.splice(prependSlidesIndexes.indexOf(activeSlideIndex), 1);
	}
	if (isPrev) prependSlidesIndexes.forEach((index) => {
		const slideEl = slides[index];
		slideEl.swiperLoopMoveDOM = true;
		slidesEl.prepend(slideEl);
		slideEl.swiperLoopMoveDOM = false;
	});
	if (isNext) appendSlidesIndexes.forEach((index) => {
		const slideEl = slides[index];
		slideEl.swiperLoopMoveDOM = true;
		slidesEl.append(slideEl);
		slideEl.swiperLoopMoveDOM = false;
	});
	swiper.recalcSlides();
	if (params.slidesPerView === "auto") swiper.updateSlides();
	else if (gridEnabled && (prependSlidesIndexes.length > 0 && isPrev || appendSlidesIndexes.length > 0 && isNext)) swiper.slides.forEach((slide, slideIndex) => {
		swiper.grid.updateSlide(slideIndex, slide, swiper.slides);
	});
	if (params.watchSlidesProgress) swiper.updateSlidesOffset();
	if (slideTo) {
		if (prependSlidesIndexes.length > 0 && isPrev) {
			if (typeof slideRealIndex === "undefined") {
				const currentSlideTranslate = swiper.slidesGrid[activeIndex];
				const diff = swiper.slidesGrid[activeIndex + slidesPrepended] - currentSlideTranslate;
				if (byMousewheel) swiper.setTranslate(swiper.translate - diff);
				else {
					swiper.slideTo(activeIndex + Math.ceil(slidesPrepended), 0, false, true);
					if (setTranslate) {
						swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
						swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
					}
				}
			} else if (setTranslate) {
				const shift = gridEnabled ? prependSlidesIndexes.length / params.grid.rows : prependSlidesIndexes.length;
				swiper.slideTo(swiper.activeIndex + shift, 0, false, true);
				swiper.touchEventsData.currentTranslate = swiper.translate;
			}
		} else if (appendSlidesIndexes.length > 0 && isNext) if (typeof slideRealIndex === "undefined") {
			const currentSlideTranslate = swiper.slidesGrid[activeIndex];
			const diff = swiper.slidesGrid[activeIndex - slidesAppended] - currentSlideTranslate;
			if (byMousewheel) swiper.setTranslate(swiper.translate - diff);
			else {
				swiper.slideTo(activeIndex - slidesAppended, 0, false, true);
				if (setTranslate) {
					swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
					swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
				}
			}
		} else {
			const shift = gridEnabled ? appendSlidesIndexes.length / params.grid.rows : appendSlidesIndexes.length;
			swiper.slideTo(swiper.activeIndex - shift, 0, false, true);
		}
	}
	swiper.allowSlidePrev = allowSlidePrev;
	swiper.allowSlideNext = allowSlideNext;
	const controlled = swiper.controller?.control;
	if (controlled && !byController) {
		const loopParams = {
			slideRealIndex,
			direction,
			setTranslate,
			activeSlideIndex,
			byController: true
		};
		if (Array.isArray(controlled)) controlled.forEach((c) => {
			if (!c.destroyed && c.params.loop) c.loopFix({
				...loopParams,
				slideTo: c.params.slidesPerView === params.slidesPerView ? slideTo : false
			});
		});
		else if (controlled instanceof swiper.constructor && controlled.params.loop) controlled.loopFix({
			...loopParams,
			slideTo: controlled.params.slidesPerView === params.slidesPerView ? slideTo : false
		});
	}
	swiper.emit("loopFix");
}
var loop = {
	loopCreate,
	loopFix,
	loopDestroy
};
function moduleExtendParams(params, allModulesParams) {
	return function extendParams(obj = {}) {
		const moduleParamName = Object.keys(obj)[0];
		const moduleParams = obj[moduleParamName];
		if (typeof moduleParams !== "object" || moduleParams === null) {
			extend$1(allModulesParams, obj);
			return;
		}
		if (params[moduleParamName] === true) params[moduleParamName] = { enabled: true };
		if (moduleParamName === "navigation" && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].prevEl && !params[moduleParamName].nextEl) params[moduleParamName].auto = true;
		if (["pagination", "scrollbar"].indexOf(moduleParamName) >= 0 && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].el) params[moduleParamName].auto = true;
		if (!(moduleParamName in params && "enabled" in moduleParams)) {
			extend$1(allModulesParams, obj);
			return;
		}
		if (typeof params[moduleParamName] === "object" && !("enabled" in params[moduleParamName])) params[moduleParamName].enabled = true;
		if (!params[moduleParamName]) params[moduleParamName] = { enabled: false };
		extend$1(allModulesParams, obj);
	};
}
var Observer = ({ swiper, extendParams, on }) => {
	const observers = [];
	const attach = (target, options = {}) => {
		const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
		if (!ObserverFunc) return;
		const observer = new ObserverFunc((mutations) => {
			if (swiper.__preventObserver__) return;
			if (mutations.length === 1) {
				swiper.emit("observerUpdate", mutations[0]);
				return;
			}
			const observerUpdate = function observerUpdate() {
				swiper.emit("observerUpdate", mutations[0]);
			};
			if (window.requestAnimationFrame) window.requestAnimationFrame(observerUpdate);
			else window.setTimeout(observerUpdate, 0);
		});
		observer.observe(target, {
			attributes: typeof options.attributes === "undefined" ? true : options.attributes,
			childList: swiper.isElement || (typeof options.childList === "undefined" ? true : options.childList),
			characterData: typeof options.characterData === "undefined" ? true : options.characterData
		});
		observers.push(observer);
	};
	const init = () => {
		if (!swiper.params.observer) return;
		if (swiper.params.observeParents) {
			const containerParents = elementParents(swiper.hostEl);
			for (let i = 0; i < containerParents.length; i += 1) attach(containerParents[i]);
		}
		attach(swiper.hostEl, { childList: swiper.params.observeSlideChildren });
		attach(swiper.wrapperEl, { attributes: false });
	};
	const destroy = () => {
		observers.forEach((observer) => {
			observer.disconnect();
		});
		observers.splice(0, observers.length);
	};
	extendParams({
		observer: false,
		observeParents: false,
		observeSlideChildren: false
	});
	on("init", init);
	on("destroy", destroy);
};
var Resize = ({ swiper, on, emit }) => {
	let observer = null;
	let animationFrame = null;
	const resizeHandler = () => {
		if (!swiper || swiper.destroyed || !swiper.initialized) return;
		emit("beforeResize");
		emit("resize");
	};
	const createObserver = () => {
		if (!swiper || swiper.destroyed || !swiper.initialized) return;
		observer = new ResizeObserver((entries) => {
			animationFrame = window.requestAnimationFrame(() => {
				const { width, height } = swiper;
				let newWidth = width;
				let newHeight = height;
				entries.forEach(({ contentBoxSize, contentRect, target }) => {
					if (target && target !== swiper.el) return;
					const box = Array.isArray(contentBoxSize) ? contentBoxSize[0] : contentBoxSize;
					newWidth = contentRect ? contentRect.width : box.inlineSize;
					newHeight = contentRect ? contentRect.height : box.blockSize;
				});
				if (newWidth !== width || newHeight !== height) resizeHandler();
			});
		});
		observer.observe(swiper.el);
	};
	const removeObserver = () => {
		if (animationFrame) window.cancelAnimationFrame(animationFrame);
		if (observer && observer.unobserve && swiper.el) {
			observer.unobserve(swiper.el);
			observer = null;
		}
	};
	const orientationChangeHandler = () => {
		if (!swiper || swiper.destroyed || !swiper.initialized) return;
		emit("orientationchange");
	};
	on("init", () => {
		if (swiper.params.resizeObserver && typeof window.ResizeObserver !== "undefined") {
			createObserver();
			return;
		}
		window.addEventListener("resize", resizeHandler);
		window.addEventListener("orientationchange", orientationChangeHandler);
	});
	on("destroy", () => {
		removeObserver();
		window.removeEventListener("resize", resizeHandler);
		window.removeEventListener("orientationchange", orientationChangeHandler);
	});
};
function slideNext(speed, runCallbacks = true, internal) {
	const swiper = this;
	const { enabled, params, animating } = swiper;
	if (!enabled || swiper.destroyed) return swiper;
	if (typeof speed === "undefined") speed = swiper.params.speed;
	let perGroup = params.slidesPerGroup;
	if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
	const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
	const isVirtual = swiper.virtual && params.virtual?.enabled;
	if (params.loop) {
		if (animating && !isVirtual && params.loopPreventsSliding) return false;
		swiper.loopFix({ direction: "next" });
		swiper._clientLeft = swiper.wrapperEl.clientLeft;
		if (swiper.activeIndex === swiper.slides.length - 1 && params.cssMode) {
			requestAnimationFrame(() => {
				swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
			});
			return true;
		}
	}
	if (params.rewind && swiper.isEnd) return swiper.slideTo(0, speed, runCallbacks, internal);
	return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
}
function slidePrev(speed, runCallbacks = true, internal) {
	const swiper = this;
	const { params, snapGrid, slidesGrid, rtlTranslate, enabled, animating } = swiper;
	if (!enabled || swiper.destroyed) return swiper;
	if (typeof speed === "undefined") speed = swiper.params.speed;
	const isVirtual = swiper.virtual && params.virtual?.enabled;
	if (params.loop) {
		if (animating && !isVirtual && params.loopPreventsSliding) return false;
		swiper.loopFix({ direction: "prev" });
		swiper._clientLeft = swiper.wrapperEl.clientLeft;
	}
	const translate = rtlTranslate ? swiper.translate : -swiper.translate;
	function normalize(val) {
		if (val < 0) return -Math.floor(Math.abs(val));
		return Math.floor(val);
	}
	const normalizedTranslate = normalize(translate);
	const normalizedSnapGrid = snapGrid.map((val) => normalize(val));
	const isFreeMode = params.freeMode && params.freeMode.enabled;
	let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
	if (typeof prevSnap === "undefined" && (params.cssMode || isFreeMode)) {
		let prevSnapIndex;
		snapGrid.forEach((snap, snapIndex) => {
			if (normalizedTranslate >= snap) prevSnapIndex = snapIndex;
		});
		if (typeof prevSnapIndex !== "undefined") prevSnap = isFreeMode ? snapGrid[prevSnapIndex] : snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
	}
	let prevIndex = 0;
	if (typeof prevSnap !== "undefined") {
		prevIndex = slidesGrid.indexOf(prevSnap);
		if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
		if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
			prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
			prevIndex = Math.max(prevIndex, 0);
		}
	}
	if (params.rewind && swiper.isBeginning) {
		const lastIndex = swiper.params.virtual?.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
		return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
	} else if (params.loop && swiper.activeIndex === 0 && params.cssMode) {
		requestAnimationFrame(() => {
			swiper.slideTo(prevIndex, speed, runCallbacks, internal);
		});
		return true;
	}
	return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
}
function slideReset(speed, runCallbacks = true, internal) {
	const swiper = this;
	if (swiper.destroyed) return;
	if (typeof speed === "undefined") speed = swiper.params.speed;
	return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
}
function slideTo(index = 0, speed, runCallbacks = true, internal, initial) {
	if (typeof index === "string") index = parseInt(index, 10);
	const swiper = this;
	let slideIndex = index;
	if (slideIndex < 0) slideIndex = 0;
	const { params, snapGrid, slidesGrid, previousIndex, activeIndex, rtlTranslate: rtl, wrapperEl, enabled } = swiper;
	if (!enabled && !internal && !initial || swiper.destroyed || swiper.animating && params.preventInteractionOnTransition) return false;
	if (typeof speed === "undefined") speed = swiper.params.speed;
	const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
	let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
	if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
	const translate = -snapGrid[snapIndex];
	if (params.normalizeSlideIndex) for (let i = 0; i < slidesGrid.length; i += 1) {
		const normalizedTranslate = -Math.floor(translate * 100);
		const normalizedGrid = Math.floor(slidesGrid[i] * 100);
		const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);
		if (typeof slidesGrid[i + 1] !== "undefined") {
			if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) slideIndex = i;
			else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) slideIndex = i + 1;
		} else if (normalizedTranslate >= normalizedGrid) slideIndex = i;
	}
	if (swiper.initialized && slideIndex !== activeIndex) {
		if (!swiper.allowSlideNext && (rtl ? translate > swiper.translate && translate > swiper.minTranslate() : translate < swiper.translate && translate < swiper.minTranslate())) return false;
		if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) {
			if ((activeIndex || 0) !== slideIndex) return false;
		}
	}
	if (slideIndex !== (previousIndex || 0) && runCallbacks) swiper.emit("beforeSlideChangeStart");
	swiper.updateProgress(translate);
	let direction;
	if (slideIndex > activeIndex) direction = "next";
	else if (slideIndex < activeIndex) direction = "prev";
	else direction = "reset";
	const isVirtual = swiper.virtual && swiper.params.virtual?.enabled;
	if (!(isVirtual && initial) && (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate)) {
		swiper.updateActiveIndex(slideIndex);
		if (params.autoHeight) swiper.updateAutoHeight();
		swiper.updateSlidesClasses();
		if (params.effect !== "slide") swiper.setTranslate(translate);
		if (direction !== "reset") {
			swiper.transitionStart(runCallbacks, direction);
			swiper.transitionEnd(runCallbacks, direction);
		}
		return false;
	}
	if (params.cssMode) {
		const isH = swiper.isHorizontal();
		const t = rtl ? translate : -translate;
		if (speed === 0) {
			if (isVirtual) {
				swiper.wrapperEl.style.scrollSnapType = "none";
				swiper._immediateVirtual = true;
			}
			if (isVirtual && !swiper._cssModeVirtualInitialSet && (swiper.params.initialSlide ?? 0) > 0) {
				swiper._cssModeVirtualInitialSet = true;
				requestAnimationFrame(() => {
					wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
				});
			} else wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
			if (isVirtual) requestAnimationFrame(() => {
				swiper.wrapperEl.style.scrollSnapType = "";
				swiper._immediateVirtual = false;
			});
		} else wrapperEl.scrollTo({
			[isH ? "left" : "top"]: t,
			behavior: "smooth"
		});
		return true;
	}
	const isSafari = getBrowser().isSafari;
	if (isVirtual && !initial && isSafari && swiper.isElement) swiper.virtual.update(false, false, slideIndex);
	swiper.setTransition(speed);
	swiper.setTranslate(translate);
	swiper.updateActiveIndex(slideIndex);
	swiper.updateSlidesClasses();
	swiper.emit("beforeTransitionStart", speed, internal);
	swiper.transitionStart(runCallbacks, direction);
	if (speed === 0) swiper.transitionEnd(runCallbacks, direction);
	else if (!swiper.animating) {
		swiper.animating = true;
		if (!swiper.onSlideToWrapperTransitionEnd) swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
			if (!swiper || swiper.destroyed) return;
			if (e.target !== this) return;
			swiper.wrapperEl.removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
			swiper.onSlideToWrapperTransitionEnd = null;
			delete swiper.onSlideToWrapperTransitionEnd;
			swiper.transitionEnd(runCallbacks, direction);
		};
		swiper.wrapperEl.addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
	}
	return true;
}
function slideToClickedSlide() {
	const swiper = this;
	if (swiper.destroyed) return;
	const { params, slidesEl, clickedSlide, clickedIndex } = swiper;
	if (clickedSlide === void 0 || clickedIndex === void 0) return;
	const slidesPerView = params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : params.slidesPerView;
	let slideToIndex = swiper.getSlideIndexWhenGrid(clickedIndex);
	let realIndex;
	const slideSelector = swiper.isElement ? `swiper-slide` : `.${params.slideClass}`;
	const isGrid = swiper.grid && swiper.params.grid && swiper.params.grid.rows > 1;
	if (params.loop) {
		if (swiper.animating) return;
		realIndex = parseInt(clickedSlide.getAttribute("data-swiper-slide-index"), 10);
		if (params.centeredSlides) swiper.slideToLoop(realIndex);
		else if (slideToIndex > (isGrid ? (swiper.slides.length - slidesPerView) / 2 - (swiper.params.grid.rows - 1) : swiper.slides.length - slidesPerView)) {
			swiper.loopFix();
			slideToIndex = swiper.getSlideIndex(elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
			nextTick(() => {
				swiper.slideTo(slideToIndex);
			});
		} else swiper.slideTo(slideToIndex);
	} else swiper.slideTo(slideToIndex);
}
function slideToClosest(speed, runCallbacks = true, internal, threshold = .5) {
	const swiper = this;
	if (swiper.destroyed) return;
	if (typeof speed === "undefined") speed = swiper.params.speed;
	let index = swiper.activeIndex;
	const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
	const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
	const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
	if (translate >= swiper.snapGrid[snapIndex]) {
		const currentSnap = swiper.snapGrid[snapIndex];
		const nextSnap = swiper.snapGrid[snapIndex + 1];
		if (translate - currentSnap > (nextSnap - currentSnap) * threshold) index += swiper.params.slidesPerGroup;
	} else {
		const prevSnap = swiper.snapGrid[snapIndex - 1];
		const currentSnap = swiper.snapGrid[snapIndex];
		if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) index -= swiper.params.slidesPerGroup;
	}
	index = Math.max(index, 0);
	index = Math.min(index, swiper.slidesGrid.length - 1);
	return swiper.slideTo(index, speed, runCallbacks, internal);
}
function slideToLoop(index = 0, speed, runCallbacks = true, internal) {
	if (typeof index === "string") index = parseInt(index, 10);
	const swiper = this;
	if (swiper.destroyed) return;
	if (typeof speed === "undefined") speed = swiper.params.speed;
	const gridEnabled = swiper.grid && swiper.params.grid && swiper.params.grid.rows > 1;
	let newIndex = index;
	if (swiper.params.loop) if (swiper.virtual && swiper.params.virtual?.enabled) newIndex = newIndex + (swiper.virtual.slidesBefore ?? 0);
	else {
		let targetSlideIndex;
		if (gridEnabled) {
			const slideIndex = newIndex * swiper.params.grid.rows;
			targetSlideIndex = swiper.slides.find((slideEl) => Number(slideEl.getAttribute("data-swiper-slide-index")) === slideIndex)?.column ?? 0;
		} else targetSlideIndex = swiper.getSlideIndexByData(newIndex);
		const cols = gridEnabled ? Math.ceil(swiper.slides.length / swiper.params.grid.rows) : swiper.slides.length;
		const { centeredSlides, slidesOffsetBefore, slidesOffsetAfter } = swiper.params;
		const bothDirections = centeredSlides || !!slidesOffsetBefore || !!slidesOffsetAfter;
		let slidesPerView;
		if (swiper.params.slidesPerView === "auto") slidesPerView = swiper.slidesPerViewDynamic();
		else {
			slidesPerView = Math.ceil(parseFloat(String(swiper.params.slidesPerView)));
			if (bothDirections && slidesPerView % 2 === 0) slidesPerView = slidesPerView + 1;
		}
		let needLoopFix = cols - targetSlideIndex < slidesPerView;
		if (bothDirections) needLoopFix = needLoopFix || targetSlideIndex < Math.ceil(slidesPerView / 2);
		if (internal && bothDirections && swiper.params.slidesPerView !== "auto" && !gridEnabled) needLoopFix = false;
		if (needLoopFix) {
			const direction = bothDirections ? targetSlideIndex < swiper.activeIndex ? "prev" : "next" : targetSlideIndex - swiper.activeIndex - 1 < swiper.params.slidesPerView ? "next" : "prev";
			swiper.loopFix({
				direction,
				slideTo: true,
				activeSlideIndex: direction === "next" ? targetSlideIndex + 1 : targetSlideIndex - cols + 1,
				slideRealIndex: direction === "next" ? swiper.realIndex : void 0
			});
		}
		if (gridEnabled) {
			const slideIndex = newIndex * swiper.params.grid.rows;
			newIndex = swiper.slides.find((slideEl) => Number(slideEl.getAttribute("data-swiper-slide-index")) === slideIndex)?.column ?? 0;
		} else newIndex = swiper.getSlideIndexByData(newIndex);
	}
	requestAnimationFrame(() => {
		swiper.slideTo(newIndex, speed, runCallbacks, internal);
	});
	return swiper;
}
var slide = {
	slideTo,
	slideToLoop,
	slideNext,
	slidePrev,
	slideReset,
	slideToClosest,
	slideToClickedSlide
};
function setTransition(duration, byController) {
	const swiper = this;
	if (!swiper.params.cssMode) {
		swiper.wrapperEl.style.transitionDuration = `${duration}ms`;
		swiper.wrapperEl.style.transitionDelay = duration === 0 ? `0ms` : "";
	}
	swiper.emit("setTransition", duration, byController);
}
function transitionEmit({ swiper, runCallbacks, direction, step }) {
	const { activeIndex, previousIndex } = swiper;
	let dir = direction;
	if (!dir) if (activeIndex > previousIndex) dir = "next";
	else if (activeIndex < previousIndex) dir = "prev";
	else dir = "reset";
	swiper.emit(`transition${step}`);
	if (runCallbacks && dir === "reset") swiper.emit(`slideResetTransition${step}`);
	else if (runCallbacks && activeIndex !== previousIndex) {
		swiper.emit(`slideChangeTransition${step}`);
		if (dir === "next") swiper.emit(`slideNextTransition${step}`);
		else swiper.emit(`slidePrevTransition${step}`);
	}
}
function transitionEnd(runCallbacks = true, direction) {
	const swiper = this;
	const { params } = swiper;
	swiper.animating = false;
	if (params.cssMode) return;
	swiper.setTransition(0);
	transitionEmit({
		swiper,
		runCallbacks,
		direction,
		step: "End"
	});
}
function transitionStart(runCallbacks = true, direction) {
	const swiper = this;
	const { params } = swiper;
	if (params.cssMode) return;
	if (params.autoHeight) swiper.updateAutoHeight();
	transitionEmit({
		swiper,
		runCallbacks,
		direction,
		step: "Start"
	});
}
var transition = {
	setTransition,
	transitionStart,
	transitionEnd
};
function getSwiperTranslate(axis = this.isHorizontal() ? "x" : "y") {
	const swiper = this;
	const { params, rtlTranslate: rtl, translate, wrapperEl } = swiper;
	if (params.virtualTranslate) return rtl ? -translate : translate;
	if (params.cssMode) return translate;
	let currentTranslate = getTranslate(wrapperEl, axis);
	currentTranslate += swiper.cssOverflowAdjustment();
	if (rtl) currentTranslate = -currentTranslate;
	return currentTranslate || 0;
}
function maxTranslate() {
	return -this.snapGrid[this.snapGrid.length - 1];
}
function minTranslate() {
	return -this.snapGrid[0];
}
function setTranslate(translate, byController) {
	const swiper = this;
	const { rtlTranslate: rtl, params, wrapperEl, progress } = swiper;
	let x = 0;
	let y = 0;
	const z = 0;
	if (swiper.isHorizontal()) x = rtl ? -translate : translate;
	else y = translate;
	if (params.roundLengths) {
		x = Math.floor(x);
		y = Math.floor(y);
	}
	swiper.previousTranslate = swiper.translate;
	swiper.translate = swiper.isHorizontal() ? x : y;
	if (params.cssMode) wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y;
	else if (!params.virtualTranslate) {
		if (swiper.isHorizontal()) x -= swiper.cssOverflowAdjustment();
		else y -= swiper.cssOverflowAdjustment();
		wrapperEl.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
	}
	let newProgress;
	const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
	if (translatesDiff === 0) newProgress = 0;
	else newProgress = (translate - swiper.minTranslate()) / translatesDiff;
	if (newProgress !== progress) swiper.updateProgress(translate);
	swiper.emit("setTranslate", swiper.translate, byController);
}
function translateTo(translate = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
	const swiper = this;
	const { params, wrapperEl } = swiper;
	if (swiper.animating && params.preventInteractionOnTransition) return false;
	const minTranslate = swiper.minTranslate();
	const maxTranslate = swiper.maxTranslate();
	let newTranslate;
	if (translateBounds && translate > minTranslate) newTranslate = minTranslate;
	else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate;
	else newTranslate = translate;
	swiper.updateProgress(newTranslate);
	if (params.cssMode) {
		const isH = swiper.isHorizontal();
		if (speed === 0) wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate;
		else wrapperEl.scrollTo({
			[isH ? "left" : "top"]: -newTranslate,
			behavior: "smooth"
		});
		return true;
	}
	if (speed === 0) {
		swiper.setTransition(0);
		swiper.setTranslate(newTranslate);
		if (runCallbacks) {
			swiper.emit("beforeTransitionStart", speed, internal);
			swiper.emit("transitionEnd");
		}
	} else {
		swiper.setTransition(speed);
		swiper.setTranslate(newTranslate);
		if (runCallbacks) {
			swiper.emit("beforeTransitionStart", speed, internal);
			swiper.emit("transitionStart");
		}
		if (!swiper.animating) {
			swiper.animating = true;
			if (!swiper.onTranslateToWrapperTransitionEnd) swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
				if (!swiper || swiper.destroyed) return;
				if (e.target !== this) return;
				swiper.wrapperEl.removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
				swiper.onTranslateToWrapperTransitionEnd = null;
				delete swiper.onTranslateToWrapperTransitionEnd;
				swiper.animating = false;
				if (runCallbacks) swiper.emit("transitionEnd");
			};
			swiper.wrapperEl.addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
		}
	}
	return true;
}
var translate = {
	getTranslate: getSwiperTranslate,
	setTranslate,
	minTranslate,
	maxTranslate,
	translateTo
};
function getActiveIndexByTranslate(swiper) {
	const { slidesGrid, params } = swiper;
	const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
	let activeIndex;
	for (let i = 0; i < slidesGrid.length; i += 1) if (typeof slidesGrid[i + 1] !== "undefined") {
		if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) activeIndex = i;
		else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) activeIndex = i + 1;
	} else if (translate >= slidesGrid[i]) activeIndex = i;
	if (params.normalizeSlideIndex) {
		if (activeIndex < 0 || typeof activeIndex === "undefined") activeIndex = 0;
	}
	return activeIndex;
}
function updateActiveIndex(newActiveIndex) {
	const swiper = this;
	const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
	const { snapGrid, params, activeIndex: previousIndex, realIndex: previousRealIndex, snapIndex: previousSnapIndex } = swiper;
	let activeIndex = newActiveIndex;
	let snapIndex;
	const getVirtualRealIndex = (aIndex) => {
		const virtualSlides = swiper.virtual.slides;
		let realIndex = aIndex - (swiper.virtual.slidesBefore ?? 0);
		if (realIndex < 0) realIndex = virtualSlides.length + realIndex;
		if (realIndex >= virtualSlides.length) realIndex -= virtualSlides.length;
		return realIndex;
	};
	if (typeof activeIndex === "undefined") activeIndex = getActiveIndexByTranslate(swiper);
	if (snapGrid.indexOf(translate) >= 0) snapIndex = snapGrid.indexOf(translate);
	else {
		const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
		snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
	}
	if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
	if (activeIndex === previousIndex && !swiper.params.loop) {
		if (snapIndex !== previousSnapIndex) {
			swiper.snapIndex = snapIndex;
			swiper.emit("snapIndexChange");
		}
		return;
	}
	if (activeIndex === previousIndex && swiper.params.loop && swiper.virtual && swiper.params.virtual?.enabled) {
		swiper.realIndex = getVirtualRealIndex(activeIndex);
		return;
	}
	const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
	let realIndex;
	if (swiper.virtual && params.virtual?.enabled) if (params.loop) realIndex = getVirtualRealIndex(activeIndex);
	else realIndex = activeIndex;
	else if (gridEnabled) {
		const firstSlideInColumn = swiper.slides.find((slideEl) => slideEl.column === activeIndex);
		let activeSlideIndex = parseInt(firstSlideInColumn.getAttribute("data-swiper-slide-index"), 10);
		if (Number.isNaN(activeSlideIndex)) activeSlideIndex = Math.max(swiper.slides.indexOf(firstSlideInColumn), 0);
		realIndex = Math.floor(activeSlideIndex / params.grid.rows);
	} else if (swiper.slides[activeIndex]) {
		const slideIndex = swiper.slides[activeIndex].getAttribute("data-swiper-slide-index");
		if (slideIndex) realIndex = parseInt(slideIndex, 10);
		else realIndex = activeIndex;
	} else realIndex = activeIndex;
	Object.assign(swiper, {
		previousSnapIndex,
		snapIndex,
		previousRealIndex,
		realIndex,
		previousIndex,
		activeIndex
	});
	if (swiper.initialized) preload(swiper);
	swiper.emit("activeIndexChange");
	swiper.emit("snapIndexChange");
	if (swiper.initialized || swiper.params.runCallbacksOnInit) {
		if (previousRealIndex !== realIndex) swiper.emit("realIndexChange");
		swiper.emit("slideChange");
	}
}
function updateAutoHeight(speed) {
	const swiper = this;
	const activeSlides = [];
	const isVirtual = swiper.virtual && swiper.params.virtual?.enabled;
	let newHeight = 0;
	let i;
	if (typeof speed === "number") swiper.setTransition(speed);
	else if (speed === true) swiper.setTransition(swiper.params.speed);
	const getSlideByIndex = (index) => {
		if (isVirtual) return swiper.slides[swiper.getSlideIndexByData(index)];
		return swiper.slides[index];
	};
	if (swiper.params.slidesPerView !== "auto" && swiper.params.slidesPerView > 1) if (swiper.params.centeredSlides) (swiper.visibleSlides || []).forEach((slide) => {
		activeSlides.push(slide);
	});
	else for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
		const index = swiper.activeIndex + i;
		if (index > swiper.slides.length && !isVirtual) break;
		const slide = getSlideByIndex(index);
		if (slide) activeSlides.push(slide);
	}
	else {
		const slide = getSlideByIndex(swiper.activeIndex);
		if (slide) activeSlides.push(slide);
	}
	for (i = 0; i < activeSlides.length; i += 1) if (typeof activeSlides[i] !== "undefined") {
		const height = activeSlides[i].offsetHeight;
		newHeight = height > newHeight ? height : newHeight;
	}
	if (newHeight || newHeight === 0) swiper.wrapperEl.style.height = `${newHeight}px`;
}
function updateClickedSlide(el, path) {
	const swiper = this;
	const params = swiper.params;
	let slide = el.closest(`.${params.slideClass}, swiper-slide`);
	if (!slide && swiper.isElement && path && path.length > 1 && path.includes(el)) [...path.slice(path.indexOf(el) + 1, path.length)].forEach((pathEl) => {
		if (!slide && pathEl.matches && pathEl.matches(`.${params.slideClass}, swiper-slide`)) slide = pathEl;
	});
	let slideFound = false;
	let slideIndex;
	if (slide) {
		for (let i = 0; i < swiper.slides.length; i += 1) if (swiper.slides[i] === slide) {
			slideFound = true;
			slideIndex = i;
			break;
		}
	}
	if (slide && slideFound) {
		swiper.clickedSlide = slide;
		if (swiper.virtual && swiper.params.virtual?.enabled) swiper.clickedIndex = parseInt(slide.getAttribute("data-swiper-slide-index"), 10);
		else swiper.clickedIndex = slideIndex;
	} else {
		swiper.clickedSlide = void 0;
		swiper.clickedIndex = void 0;
		return;
	}
	if (params.slideToClickedSlide && swiper.clickedIndex !== void 0 && swiper.clickedIndex !== swiper.activeIndex) swiper.slideToClickedSlide();
}
function updateProgress(translate) {
	const swiper = this;
	if (typeof translate === "undefined") {
		const multiplier = swiper.rtlTranslate ? -1 : 1;
		translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
	}
	const params = swiper.params;
	const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
	let { progress, isBeginning, isEnd } = swiper;
	let progressLoop = swiper.progressLoop;
	const wasBeginning = isBeginning;
	const wasEnd = isEnd;
	if (translatesDiff === 0) {
		progress = 0;
		isBeginning = true;
		isEnd = true;
	} else {
		progress = (translate - swiper.minTranslate()) / translatesDiff;
		const isBeginningRounded = Math.abs(translate - swiper.minTranslate()) < 1;
		const isEndRounded = Math.abs(translate - swiper.maxTranslate()) < 1;
		isBeginning = isBeginningRounded || progress <= 0;
		isEnd = isEndRounded || progress >= 1;
		if (isBeginningRounded) progress = 0;
		if (isEndRounded) progress = 1;
	}
	if (params.loop) {
		const firstSlideIndex = swiper.getSlideIndexByData(0);
		const lastSlideIndex = swiper.getSlideIndexByData(swiper.slides.length - 1);
		const firstSlideTranslate = swiper.slidesGrid[firstSlideIndex];
		const lastSlideTranslate = swiper.slidesGrid[lastSlideIndex];
		const translateMax = swiper.slidesGrid[swiper.slidesGrid.length - 1];
		const translateAbs = Math.abs(translate);
		if (translateAbs >= firstSlideTranslate) progressLoop = (translateAbs - firstSlideTranslate) / translateMax;
		else progressLoop = (translateAbs + translateMax - lastSlideTranslate) / translateMax;
		if (progressLoop > 1) progressLoop -= 1;
	}
	Object.assign(swiper, {
		progress,
		progressLoop,
		isBeginning,
		isEnd
	});
	if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);
	if (isBeginning && !wasBeginning) swiper.emit("reachBeginning toEdge");
	if (isEnd && !wasEnd) swiper.emit("reachEnd toEdge");
	if (wasBeginning && !isBeginning || wasEnd && !isEnd) swiper.emit("fromEdge");
	swiper.emit("progress", progress);
}
function updateSize() {
	const swiper = this;
	let width;
	let height;
	const el = swiper.el;
	if (typeof swiper.params.width !== "undefined" && swiper.params.width !== null) width = swiper.params.width;
	else width = el.clientWidth;
	if (typeof swiper.params.height !== "undefined" && swiper.params.height !== null) height = swiper.params.height;
	else height = el.clientHeight;
	if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) return;
	width = width - parseInt(elementStyle(el, "padding-left") || "0", 10) - parseInt(elementStyle(el, "padding-right") || "0", 10);
	height = height - parseInt(elementStyle(el, "padding-top") || "0", 10) - parseInt(elementStyle(el, "padding-bottom") || "0", 10);
	if (Number.isNaN(width)) width = 0;
	if (Number.isNaN(height)) height = 0;
	Object.assign(swiper, {
		width,
		height,
		size: swiper.isHorizontal() ? width : height
	});
}
function updateSlides() {
	const swiper = this;
	function getDirectionPropertyValue(node, label) {
		return parseFloat(node.getPropertyValue(swiper.getDirectionLabel(label)) || "0");
	}
	const params = swiper.params;
	const { wrapperEl, slidesEl, rtlTranslate: rtl, wrongRTL } = swiper;
	const isVirtual = !!(swiper.virtual && params.virtual?.enabled);
	const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
	const slides = elementChildren(slidesEl, `.${swiper.params.slideClass}, swiper-slide`);
	const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
	let snapGrid = [];
	const slidesGrid = [];
	const slidesSizesGrid = [];
	const resolveOffset = (value) => typeof value === "function" ? value.call(swiper) : value;
	const offsetBefore = resolveOffset(params.slidesOffsetBefore);
	const offsetAfter = resolveOffset(params.slidesOffsetAfter);
	const previousSnapGridLength = swiper.snapGrid.length;
	const previousSlidesGridLength = swiper.slidesGrid.length;
	const swiperSize = swiper.size - offsetBefore - offsetAfter;
	let spaceBetween = params.spaceBetween;
	let slidePosition = -offsetBefore;
	let prevSlideSize = 0;
	let index = 0;
	if (typeof swiperSize === "undefined") return;
	if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
	else if (typeof spaceBetween === "string") spaceBetween = parseFloat(spaceBetween);
	swiper.virtualSize = -spaceBetween - offsetBefore - offsetAfter;
	slides.forEach((slideEl) => {
		if (rtl) slideEl.style.marginLeft = "";
		else slideEl.style.marginRight = "";
		slideEl.style.marginBottom = "";
		slideEl.style.marginTop = "";
	});
	if (params.centeredSlides && params.cssMode) {
		setCSSProperty(wrapperEl, "--swiper-centered-offset-before", "");
		setCSSProperty(wrapperEl, "--swiper-centered-offset-after", "");
	}
	if (params.cssMode) {
		setCSSProperty(wrapperEl, "--swiper-slides-offset-before", `${offsetBefore}px`);
		setCSSProperty(wrapperEl, "--swiper-slides-offset-after", `${offsetAfter}px`);
	}
	const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
	if (gridEnabled) swiper.grid.initSlides(slides);
	else if (swiper.grid) swiper.grid.unsetSlides();
	let slideSize = 0;
	const shouldResetSlideSize = params.slidesPerView === "auto" && params.breakpoints && Object.keys(params.breakpoints).filter((key) => {
		return typeof params.breakpoints[key]?.slidesPerView !== "undefined";
	}).length > 0;
	for (let i = 0; i < slidesLength; i += 1) {
		slideSize = 0;
		const slide = slides[i];
		if (slide) {
			if (gridEnabled) swiper.grid.updateSlide(i, slide, slides);
			if (elementStyle(slide, "display") === "none") continue;
		}
		if (isVirtual && params.slidesPerView === "auto") {
			if (params.virtual?.slidesPerViewAutoSlideSize) slideSize = params.virtual.slidesPerViewAutoSlideSize;
			if (slideSize && slide) {
				if (params.roundLengths) slideSize = Math.floor(slideSize);
				slide.style[swiper.getDirectionLabel("width")] = `${slideSize}px`;
			}
		} else if (params.slidesPerView === "auto") {
			if (shouldResetSlideSize) slide.style[swiper.getDirectionLabel("width")] = ``;
			const slideStyles = getComputedStyle(slide);
			const currentTransform = slide.style.transform;
			const currentWebKitTransform = slide.style.webkitTransform;
			if (currentTransform) slide.style.transform = "none";
			if (currentWebKitTransform) slide.style.webkitTransform = "none";
			if (params.roundLengths) slideSize = swiper.isHorizontal() ? elementOuterSize(slide, "width") : elementOuterSize(slide, "height");
			else {
				const width = getDirectionPropertyValue(slideStyles, "width");
				const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
				const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
				const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
				const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
				const boxSizing = slideStyles.getPropertyValue("box-sizing");
				if (boxSizing && boxSizing === "border-box") slideSize = width + marginLeft + marginRight;
				else {
					const { clientWidth, offsetWidth } = slide;
					slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
				}
			}
			if (currentTransform) slide.style.transform = currentTransform;
			if (currentWebKitTransform) slide.style.webkitTransform = currentWebKitTransform;
			if (params.roundLengths) slideSize = Math.floor(slideSize);
		} else {
			slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
			if (params.roundLengths) slideSize = Math.floor(slideSize);
			if (slide) slide.style[swiper.getDirectionLabel("width")] = `${slideSize}px`;
		}
		if (slide) slide.swiperSlideSize = slideSize;
		slidesSizesGrid.push(slideSize);
		if (params.centeredSlides) {
			slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
			if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
			if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
			if (Math.abs(slidePosition) < 1 / 1e3) slidePosition = 0;
			if (params.roundLengths) slidePosition = Math.floor(slidePosition);
			if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
			slidesGrid.push(slidePosition);
		} else {
			if (params.roundLengths) slidePosition = Math.floor(slidePosition);
			if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
			slidesGrid.push(slidePosition);
			slidePosition = slidePosition + slideSize + spaceBetween;
		}
		swiper.virtualSize += slideSize + spaceBetween;
		prevSlideSize = slideSize;
		index += 1;
	}
	swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
	if (rtl && wrongRTL && (params.effect === "slide" || params.effect === "coverflow")) wrapperEl.style.width = `${swiper.virtualSize + spaceBetween}px`;
	if (params.setWrapperSize) wrapperEl.style[swiper.getDirectionLabel("width")] = `${swiper.virtualSize + spaceBetween}px`;
	if (gridEnabled) swiper.grid.updateWrapperSize(slideSize, snapGrid);
	if (!params.centeredSlides) {
		const isFractionalSlidesPerView = params.slidesPerView !== "auto" && params.slidesPerView % 1 !== 0;
		const shouldSnapToSlideEdge = params.snapToSlideEdge && !params.loop && (params.slidesPerView === "auto" || isFractionalSlidesPerView);
		let lastAllowedSnapIndex = snapGrid.length;
		if (shouldSnapToSlideEdge) {
			let minVisibleSlides;
			if (params.slidesPerView === "auto") {
				minVisibleSlides = 1;
				let accumulatedSize = 0;
				for (let i = slidesSizesGrid.length - 1; i >= 0; i -= 1) {
					accumulatedSize += slidesSizesGrid[i] + (i < slidesSizesGrid.length - 1 ? spaceBetween : 0);
					if (accumulatedSize <= swiperSize) minVisibleSlides = slidesSizesGrid.length - i;
					else break;
				}
			} else minVisibleSlides = Math.floor(params.slidesPerView);
			lastAllowedSnapIndex = Math.max(slidesLength - minVisibleSlides, 0);
		}
		const newSlidesGrid = [];
		for (let i = 0; i < snapGrid.length; i += 1) {
			let slidesGridItem = snapGrid[i];
			if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
			if (shouldSnapToSlideEdge) {
				if (i <= lastAllowedSnapIndex) newSlidesGrid.push(slidesGridItem);
			} else if (snapGrid[i] <= swiper.virtualSize - swiperSize) newSlidesGrid.push(slidesGridItem);
		}
		snapGrid = newSlidesGrid;
		if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
			if (!shouldSnapToSlideEdge) snapGrid.push(swiper.virtualSize - swiperSize);
		}
	}
	if (isVirtual && params.loop) {
		const size = slidesSizesGrid[0] + spaceBetween;
		const virtualLoopCount = (swiper.virtual.slidesBefore ?? 0) + (swiper.virtual.slidesAfter ?? 0);
		if (params.slidesPerGroup > 1) {
			const groups = Math.ceil(virtualLoopCount / params.slidesPerGroup);
			const groupSize = size * params.slidesPerGroup;
			for (let i = 0; i < groups; i += 1) snapGrid.push(snapGrid[snapGrid.length - 1] + groupSize);
		}
		for (let i = 0; i < virtualLoopCount; i += 1) {
			if (params.slidesPerGroup === 1) snapGrid.push(snapGrid[snapGrid.length - 1] + size);
			slidesGrid.push(slidesGrid[slidesGrid.length - 1] + size);
			swiper.virtualSize += size;
		}
	}
	if (snapGrid.length === 0) snapGrid = [0];
	if (spaceBetween !== 0) {
		const key = swiper.isHorizontal() && rtl ? "marginLeft" : swiper.getDirectionLabel("marginRight");
		slides.filter((_, slideIndex) => {
			if (!params.cssMode || params.loop) return true;
			if (slideIndex === slides.length - 1) return false;
			return true;
		}).forEach((slideEl) => {
			slideEl.style[key] = `${spaceBetween}px`;
		});
	}
	if (params.centeredSlides && params.centeredSlidesBounds) {
		let allSlidesSize = 0;
		slidesSizesGrid.forEach((slideSizeValue) => {
			allSlidesSize += slideSizeValue + (spaceBetween || 0);
		});
		allSlidesSize -= spaceBetween;
		const maxSnap = allSlidesSize > swiperSize ? allSlidesSize - swiperSize : 0;
		snapGrid = snapGrid.map((snap) => {
			if (snap <= 0) return -offsetBefore;
			if (snap > maxSnap) return maxSnap + offsetAfter;
			return snap;
		});
	}
	if (params.centerInsufficientSlides) {
		let allSlidesSize = 0;
		slidesSizesGrid.forEach((slideSizeValue) => {
			allSlidesSize += slideSizeValue + (spaceBetween || 0);
		});
		allSlidesSize -= spaceBetween;
		if (allSlidesSize < swiperSize) {
			const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
			snapGrid.forEach((snap, snapIndex) => {
				snapGrid[snapIndex] = snap - allSlidesOffset;
			});
			slidesGrid.forEach((snap, snapIndex) => {
				slidesGrid[snapIndex] = snap + allSlidesOffset;
			});
		}
	}
	Object.assign(swiper, {
		slides,
		snapGrid,
		slidesGrid,
		slidesSizesGrid
	});
	if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
		setCSSProperty(wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
		setCSSProperty(wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
		const addToSnapGrid = -swiper.snapGrid[0];
		const addToSlidesGrid = -swiper.slidesGrid[0];
		swiper.snapGrid = swiper.snapGrid.map((v) => v + addToSnapGrid);
		swiper.slidesGrid = swiper.slidesGrid.map((v) => v + addToSlidesGrid);
	}
	if (slidesLength !== previousSlidesLength) swiper.emit("slidesLengthChange");
	if (snapGrid.length !== previousSnapGridLength) {
		if (swiper.params.watchOverflow) swiper.checkOverflow();
		swiper.emit("snapGridLengthChange");
	}
	if (slidesGrid.length !== previousSlidesGridLength) swiper.emit("slidesGridLengthChange");
	if (params.watchSlidesProgress) swiper.updateSlidesOffset();
	swiper.emit("slidesUpdated");
	if (!isVirtual && !params.cssMode && (params.effect === "slide" || params.effect === "fade")) {
		const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
		const hasClassBackfaceClassAdded = swiper.el.classList.contains(backFaceHiddenClass);
		if (slidesLength <= params.maxBackfaceHiddenSlides) {
			if (!hasClassBackfaceClassAdded) swiper.el.classList.add(backFaceHiddenClass);
		} else if (hasClassBackfaceClassAdded) swiper.el.classList.remove(backFaceHiddenClass);
	}
}
var toggleSlideClasses$1 = (slideEl, condition, className) => {
	if (condition && !slideEl.classList.contains(className)) slideEl.classList.add(className);
	else if (!condition && slideEl.classList.contains(className)) slideEl.classList.remove(className);
};
function updateSlidesClasses() {
	const swiper = this;
	const { slides, params, slidesEl, activeIndex } = swiper;
	const isVirtual = !!(swiper.virtual && params.virtual?.enabled);
	const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
	const getFilteredSlide = (selector) => {
		return elementChildren(slidesEl, `.${params.slideClass}${selector}, swiper-slide${selector}`)[0];
	};
	let activeSlide;
	let prevSlide;
	let nextSlide;
	if (isVirtual) if (params.loop) {
		const virtualSlides = swiper.virtual.slides;
		let slideIndex = activeIndex - (swiper.virtual.slidesBefore ?? 0);
		if (slideIndex < 0) slideIndex = virtualSlides.length + slideIndex;
		if (slideIndex >= virtualSlides.length) slideIndex -= virtualSlides.length;
		activeSlide = getFilteredSlide(`[data-swiper-slide-index="${slideIndex}"]`);
	} else activeSlide = getFilteredSlide(`[data-swiper-slide-index="${activeIndex}"]`);
	else if (gridEnabled) {
		activeSlide = slides.find((slideEl) => slideEl.column === activeIndex);
		nextSlide = slides.find((slideEl) => slideEl.column === activeIndex + 1);
		prevSlide = slides.find((slideEl) => slideEl.column === activeIndex - 1);
	} else activeSlide = slides[activeIndex];
	if (activeSlide) {
		if (!gridEnabled) {
			nextSlide = elementNextAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
			if (params.loop && !nextSlide) nextSlide = slides[0];
			prevSlide = elementPrevAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
			if (params.loop && false);
		}
	}
	slides.forEach((slideEl) => {
		toggleSlideClasses$1(slideEl, slideEl === activeSlide, params.slideActiveClass);
		toggleSlideClasses$1(slideEl, slideEl === nextSlide, params.slideNextClass);
		toggleSlideClasses$1(slideEl, slideEl === prevSlide, params.slidePrevClass);
	});
	swiper.emitSlidesClasses();
}
function updateSlidesOffset() {
	const swiper = this;
	const slides = swiper.slides;
	const minusOffset = swiper.isElement ? swiper.isHorizontal() ? swiper.wrapperEl.offsetLeft : swiper.wrapperEl.offsetTop : 0;
	for (let i = 0; i < slides.length; i += 1) slides[i].swiperSlideOffset = (swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop) - minusOffset - swiper.cssOverflowAdjustment();
}
var toggleSlideClasses = (slideEl, condition, className) => {
	if (condition && !slideEl.classList.contains(className)) slideEl.classList.add(className);
	else if (!condition && slideEl.classList.contains(className)) slideEl.classList.remove(className);
};
function updateSlidesProgress(translate = this && this.translate || 0) {
	const swiper = this;
	const params = swiper.params;
	const { slides, rtlTranslate: rtl, snapGrid } = swiper;
	if (slides.length === 0) return;
	if (typeof slides[0].swiperSlideOffset === "undefined") swiper.updateSlidesOffset();
	let offsetCenter = -translate;
	if (rtl) offsetCenter = translate;
	swiper.visibleSlidesIndexes = [];
	swiper.visibleSlides = [];
	let spaceBetween = params.spaceBetween;
	if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiper.size;
	else if (typeof spaceBetween === "string") spaceBetween = parseFloat(spaceBetween);
	for (let i = 0; i < slides.length; i += 1) {
		const slide = slides[i];
		let slideOffset = slide.swiperSlideOffset ?? 0;
		if (params.cssMode && params.centeredSlides) slideOffset -= slides[0].swiperSlideOffset ?? 0;
		const slideSize = slide.swiperSlideSize ?? 0;
		const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slideSize + spaceBetween);
		const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slideSize + spaceBetween);
		const slideBefore = -(offsetCenter - slideOffset);
		const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
		const isFullyVisible = slideBefore >= 0 && slideBefore <= swiper.size - swiper.slidesSizesGrid[i];
		const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
		if (isVisible) {
			swiper.visibleSlides.push(slide);
			swiper.visibleSlidesIndexes.push(i);
		}
		toggleSlideClasses(slide, isVisible, params.slideVisibleClass);
		toggleSlideClasses(slide, isFullyVisible, params.slideFullyVisibleClass);
		slide.progress = rtl ? -slideProgress : slideProgress;
		slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
	}
}
var prototypes = {
	eventsEmitter,
	update: {
		updateSize,
		updateSlides,
		updateAutoHeight,
		updateSlidesOffset,
		updateSlidesProgress,
		updateProgress,
		updateSlidesClasses,
		updateActiveIndex,
		updateClickedSlide
	},
	translate,
	transition,
	slide,
	loop,
	grabCursor,
	events: events$1,
	breakpoints,
	checkOverflow: checkOverflow$1,
	classes
};
var extendedDefaults = {};
var Swiper$1 = class Swiper$1 {
	static extendedDefaults;
	static defaults;
	constructor(...args) {
		let el;
		let params;
		if (args.length === 1 && args[0] !== null && typeof args[0] === "object" && Object.prototype.toString.call(args[0]).slice(8, -1) === "Object") params = args[0];
		else [el, params] = args;
		if (!params) params = {};
		params = extend$1({}, params);
		if (el && !params.el) params.el = el;
		if (params.el && typeof params.el === "string" && typeof document !== "undefined" && document.querySelectorAll(params.el).length > 1) {
			const swipers = [];
			document.querySelectorAll(params.el).forEach((containerEl) => {
				const newParams = extend$1({}, params, { el: containerEl });
				swipers.push(new Swiper$1(newParams));
			});
			return swipers;
		}
		const swiper = this;
		swiper.__swiper__ = true;
		swiper.support = getSupport();
		swiper.device = getDevice({ userAgent: params.userAgent ?? void 0 });
		swiper.browser = getBrowser();
		swiper.eventsListeners = {};
		swiper.eventsAnyListeners = [];
		swiper.modules = [...swiper.__modules__ || []];
		if (params.modules && Array.isArray(params.modules)) params.modules.forEach((mod) => {
			const fn = mod;
			if (typeof fn === "function" && swiper.modules.indexOf(fn) < 0) swiper.modules.push(fn);
		});
		const allModulesParams = {};
		swiper.modules.forEach((mod) => {
			mod({
				params,
				swiper,
				extendParams: moduleExtendParams(params, allModulesParams),
				on: swiper.on.bind(swiper),
				once: swiper.once.bind(swiper),
				off: swiper.off.bind(swiper),
				emit: swiper.emit.bind(swiper)
			});
		});
		swiper.params = extend$1({}, extend$1({}, defaults, allModulesParams), extendedDefaults, params);
		swiper.originalParams = extend$1({}, swiper.params);
		swiper.passedParams = extend$1({}, params);
		if (swiper.params && swiper.params.on) {
			const onHandlers = swiper.params.on;
			Object.keys(onHandlers).forEach((eventName) => {
				const handler = onHandlers[eventName];
				if (handler) swiper.on(eventName, handler);
			});
		}
		if (swiper.params && swiper.params.onAny) swiper.onAny(swiper.params.onAny);
		Object.assign(swiper, {
			enabled: swiper.params.enabled,
			el,
			classNames: [],
			slides: [],
			slidesGrid: [],
			snapGrid: [],
			slidesSizesGrid: [],
			isHorizontal() {
				return swiper.params.direction === "horizontal";
			},
			isVertical() {
				return swiper.params.direction === "vertical";
			},
			activeIndex: 0,
			realIndex: 0,
			isBeginning: true,
			isEnd: false,
			translate: 0,
			previousTranslate: 0,
			progress: 0,
			velocity: 0,
			animating: false,
			cssOverflowAdjustment() {
				return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
			},
			allowSlideNext: swiper.params.allowSlideNext,
			allowSlidePrev: swiper.params.allowSlidePrev,
			touchEventsData: {
				isTouched: void 0,
				isMoved: void 0,
				allowTouchCallbacks: void 0,
				touchStartTime: void 0,
				isScrolling: void 0,
				currentTranslate: void 0,
				startTranslate: void 0,
				allowThresholdMove: void 0,
				focusableElements: swiper.params.focusableElements,
				lastClickTime: 0,
				clickTimeout: void 0,
				velocities: [],
				allowMomentumBounce: void 0,
				startMoving: void 0,
				pointerId: null,
				touchId: null
			},
			allowClick: true,
			allowTouchMove: swiper.params.allowTouchMove,
			touches: {
				startX: 0,
				startY: 0,
				currentX: 0,
				currentY: 0,
				diff: 0
			},
			imagesToLoad: [],
			imagesLoaded: 0
		});
		swiper.emit("_swiper");
		if (swiper.params.init) swiper.init();
		return swiper;
	}
	getDirectionLabel(property) {
		if (this.isHorizontal()) return property;
		return {
			"width": "height",
			"margin-top": "margin-left",
			"margin-bottom ": "margin-right",
			"margin-left": "margin-top",
			"margin-right": "margin-bottom",
			"padding-left": "padding-top",
			"padding-right": "padding-bottom",
			"marginRight": "marginBottom"
		}[property];
	}
	/**
	* !INTERNAL
	*/
	isHorizontal() {
		return this.params.direction === "horizontal";
	}
	isVertical() {
		return this.params.direction === "vertical";
	}
	cssOverflowAdjustment() {
		return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
	}
	getSlideIndex(slideEl) {
		const { slidesEl, params } = this;
		const firstSlideIndex = elementIndex(elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`)[0]);
		return elementIndex(slideEl) - (firstSlideIndex ?? 0);
	}
	getSlideIndexByData(index) {
		return this.getSlideIndex(this.slides.find((slideEl) => Number(slideEl.getAttribute("data-swiper-slide-index")) === index));
	}
	getSlideIndexWhenGrid(index) {
		if (this.grid && this.params.grid && this.params.grid.rows > 1) {
			if (this.params.grid.fill === "column") index = Math.floor(index / this.params.grid.rows);
			else if (this.params.grid.fill === "row") index = index % Math.ceil(this.slides.length / this.params.grid.rows);
		}
		return index;
	}
	recalcSlides() {
		const { slidesEl, params } = this;
		this.slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
	}
	/**
	* Enable Swiper (if it was disabled)
	*/
	enable() {
		if (this.enabled) return;
		this.enabled = true;
		if (this.params.grabCursor) this.setGrabCursor();
		this.emit("enable");
	}
	/**
	* Disable Swiper (if it was enabled). When Swiper is disabled, it will hide all navigation elements and won't respond to any events and interactions
	*/
	disable() {
		if (!this.enabled) return;
		this.enabled = false;
		if (this.params.grabCursor) this.unsetGrabCursor();
		this.emit("disable");
	}
	/**
	* Set Swiper translate progress (from 0 to 1). Where 0 - its initial position (offset) on first slide, and 1 - its maximum position (offset) on last slide
	*
	* @param progress Swiper translate progress (from 0 to 1).
	* @param speed Transition duration (in ms).
	*/
	setProgress(progress, speed) {
		progress = Math.min(Math.max(progress, 0), 1);
		const min = this.minTranslate();
		const current = (this.maxTranslate() - min) * progress + min;
		this.translateTo(current, typeof speed === "undefined" ? 0 : speed);
		this.updateActiveIndex();
		this.updateSlidesClasses();
	}
	emitContainerClasses() {
		if (!this.params._emitClasses || !this.el) return;
		const cls = this.el.className.split(" ").filter((className) => {
			return className.indexOf("swiper") === 0 || className.indexOf(this.params.containerModifierClass) === 0;
		});
		this.emit("_containerClasses", cls.join(" "));
	}
	getSlideClasses(slideEl) {
		if (this.destroyed) return "";
		return slideEl.className.split(" ").filter((className) => {
			return className.indexOf("swiper-slide") === 0 || className.indexOf(this.params.slideClass) === 0;
		}).join(" ");
	}
	emitSlidesClasses() {
		if (!this.params._emitClasses || !this.el) return;
		const updates = [];
		this.slides.forEach((slideEl) => {
			const classNames = this.getSlideClasses(slideEl);
			updates.push({
				slideEl,
				classNames
			});
			this.emit("_slideClass", slideEl, classNames);
		});
		this.emit("_slideClasses", updates);
	}
	/**
	* Get dynamically calculated amount of slides per view, useful only when slidesPerView set to `auto`
	*/
	slidesPerViewDynamic(view = "current", exact = false) {
		const { params, slides, slidesGrid, slidesSizesGrid, size: swiperSize, activeIndex } = this;
		let spv = 1;
		if (typeof params.slidesPerView === "number") return params.slidesPerView;
		if (params.centeredSlides) {
			let slideSize = slides[activeIndex] ? Math.ceil(slides[activeIndex].swiperSlideSize ?? 0) : 0;
			let breakLoop = false;
			for (let i = activeIndex + 1; i < slides.length; i += 1) if (slides[i] && !breakLoop) {
				slideSize += Math.ceil(slides[i].swiperSlideSize ?? 0);
				spv += 1;
				if (slideSize > swiperSize) breakLoop = true;
			}
			for (let i = activeIndex - 1; i >= 0; i -= 1) if (slides[i] && !breakLoop) {
				slideSize += slides[i].swiperSlideSize ?? 0;
				spv += 1;
				if (slideSize > swiperSize) breakLoop = true;
			}
		} else if (view === "current") {
			for (let i = activeIndex + 1; i < slides.length; i += 1) if (exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize) spv += 1;
		} else for (let i = activeIndex - 1; i >= 0; i -= 1) if (slidesGrid[activeIndex] - slidesGrid[i] < swiperSize) spv += 1;
		return spv;
	}
	/**
	* You should call it after you add/remove slides
	* manually, or after you hide/show it, or do any
	* custom DOM modifications with Swiper
	* This method also includes subcall of the following
	* methods which you can use separately:
	*/
	update() {
		const swiper = this;
		if (!swiper || swiper.destroyed) return;
		const { snapGrid, params } = swiper;
		if (params.breakpoints) swiper.setBreakpoint();
		[...swiper.el.querySelectorAll("[loading=\"lazy\"]")].forEach((imageEl) => {
			if (imageEl.complete) processLazyPreloader(swiper, imageEl);
		});
		swiper.updateSize();
		swiper.updateSlides();
		swiper.updateProgress();
		swiper.updateSlidesClasses();
		function setTranslate() {
			const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
			const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
			swiper.setTranslate(newTranslate);
			swiper.updateActiveIndex();
			swiper.updateSlidesClasses();
		}
		let translated;
		if (params.freeMode?.enabled && !params.cssMode) {
			setTranslate();
			if (params.autoHeight) swiper.updateAutoHeight();
		} else {
			if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !params.centeredSlides) {
				const slidesLength = swiper.virtual && params.virtual?.enabled ? swiper.virtual.slides.length : swiper.slides.length;
				translated = swiper.slideTo(slidesLength - 1, 0, false, true);
			} else translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
			if (!translated) setTranslate();
		}
		if (params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
		swiper.emit("update");
	}
	/**
	* Changes slider direction from horizontal to vertical and back.
	*
	* @param direction New direction. If not specified, then will automatically changed to opposite direction
	* @param needUpdate Will call swiper.update(). Default true
	*/
	changeDirection(newDirection, needUpdate = true) {
		const swiper = this;
		const currentDirection = swiper.params.direction;
		if (!newDirection) newDirection = currentDirection === "horizontal" ? "vertical" : "horizontal";
		if (newDirection === currentDirection || newDirection !== "horizontal" && newDirection !== "vertical") return swiper;
		swiper.el.classList.remove(`${swiper.params.containerModifierClass}${currentDirection}`);
		swiper.el.classList.add(`${swiper.params.containerModifierClass}${newDirection}`);
		swiper.emitContainerClasses();
		swiper.params.direction = newDirection;
		swiper.slides.forEach((slideEl) => {
			if (newDirection === "vertical") slideEl.style.width = "";
			else slideEl.style.height = "";
		});
		swiper.emit("changeDirection");
		if (needUpdate) swiper.update();
		return swiper;
	}
	/**
	* Changes slider language
	*
	* @param direction New direction. Should be `rtl` or `ltr`
	*/
	changeLanguageDirection(direction) {
		const swiper = this;
		if (swiper.rtl && direction === "rtl" || !swiper.rtl && direction === "ltr") return;
		swiper.rtl = direction === "rtl";
		swiper.rtlTranslate = swiper.params.direction === "horizontal" && swiper.rtl;
		if (swiper.rtl) {
			swiper.el.classList.add(`${swiper.params.containerModifierClass}rtl`);
			swiper.el.dir = "rtl";
		} else {
			swiper.el.classList.remove(`${swiper.params.containerModifierClass}rtl`);
			swiper.el.dir = "ltr";
		}
		swiper.update();
	}
	mount(element) {
		const swiper = this;
		if (swiper.mounted) return true;
		if (typeof document === "undefined") return false;
		const initialEl = element ?? swiper.params.el;
		let el = null;
		if (typeof initialEl === "string") el = document.querySelector(initialEl);
		else if (initialEl instanceof HTMLElement) el = initialEl;
		if (!el) return false;
		el.swiper = swiper;
		const parent = el.parentNode;
		if (parent && parent.host && parent.host.nodeName === swiper.params.swiperElementNodeName.toUpperCase()) swiper.isElement = true;
		const getWrapperSelector = () => {
			return `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
		};
		const getWrapper = () => {
			if (el && el.shadowRoot) return el.shadowRoot.querySelector(getWrapperSelector());
			return elementChildren(el, getWrapperSelector())[0];
		};
		let wrapperEl = getWrapper();
		if (!wrapperEl && swiper.params.createElements) {
			wrapperEl = createElement("div", swiper.params.wrapperClass);
			el.append(wrapperEl);
			elementChildren(el, `.${swiper.params.slideClass}`).forEach((slideEl) => {
				wrapperEl.append(slideEl);
			});
		}
		const host = swiper.isElement ? el.parentNode.host : null;
		Object.assign(swiper, {
			el,
			wrapperEl,
			slidesEl: swiper.isElement && !host.slideSlots ? host : wrapperEl,
			hostEl: swiper.isElement ? host : el,
			mounted: true,
			rtl: el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl",
			rtlTranslate: swiper.params.direction === "horizontal" && (el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl"),
			wrongRTL: elementStyle(wrapperEl, "display") === "-webkit-box"
		});
		return true;
	}
	/**
	* Initialize slider
	*/
	init(el) {
		const swiper = this;
		if (swiper.initialized) return swiper;
		if (swiper.mount(el) === false) return swiper;
		swiper.emit("beforeInit");
		if (swiper.params.breakpoints) swiper.setBreakpoint();
		swiper.addClasses();
		swiper.updateSize();
		swiper.updateSlides();
		if (swiper.params.watchOverflow) swiper.checkOverflow();
		if (swiper.params.grabCursor && swiper.enabled) swiper.setGrabCursor();
		if (swiper.params.loop && swiper.virtual && swiper.params.virtual?.enabled) swiper.slideTo((swiper.params.initialSlide ?? 0) + (swiper.virtual.slidesBefore ?? 0), 0, swiper.params.runCallbacksOnInit, false, true);
		else swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
		if (swiper.params.loop) swiper.loopCreate(void 0, true);
		swiper.attachEvents();
		const lazyElements = [...swiper.el.querySelectorAll("[loading=\"lazy\"]")];
		if (swiper.isElement) lazyElements.push(...swiper.hostEl.querySelectorAll("[loading=\"lazy\"]"));
		lazyElements.forEach((imageEl) => {
			if (imageEl.complete) processLazyPreloader(swiper, imageEl);
			else imageEl.addEventListener("load", (e) => {
				processLazyPreloader(swiper, e.target);
			});
		});
		preload(swiper);
		swiper.initialized = true;
		preload(swiper);
		swiper.emit("init");
		swiper.emit("afterInit");
		return swiper;
	}
	/**
	* Destroy slider instance and detach all events listeners
	*
	* @param deleteInstance Set it to false (by default it is true) to not to delete Swiper instance
	* @param cleanStyles Set it to true (by default it is true) and all custom styles will be removed from slides, wrapper and container.
	* Useful if you need to destroy Swiper and to init again with new options or in different direction
	*/
	destroy(deleteInstance = true, cleanStyles = true) {
		const swiper = this;
		const { params, el, wrapperEl, slides } = swiper;
		if (typeof swiper.params === "undefined" || swiper.destroyed) return null;
		swiper.emit("beforeDestroy");
		swiper.initialized = false;
		swiper.detachEvents();
		if (params.loop) swiper.loopDestroy();
		if (cleanStyles) {
			swiper.removeClasses();
			if (el && typeof el !== "string") el.removeAttribute("style");
			if (wrapperEl) wrapperEl.removeAttribute("style");
			if (slides && slides.length) slides.forEach((slideEl) => {
				slideEl.classList.remove(params.slideVisibleClass, params.slideFullyVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
				slideEl.removeAttribute("style");
				slideEl.removeAttribute("data-swiper-slide-index");
			});
		}
		swiper.emit("destroy");
		Object.keys(swiper.eventsListeners).forEach((eventName) => {
			swiper.off(eventName);
		});
		if (deleteInstance !== false) {
			if (swiper.el && typeof swiper.el !== "string") swiper.el.swiper = null;
			deleteProps(swiper);
		}
		swiper.destroyed = true;
		return null;
	}
	static extendDefaults(newDefaults) {
		extend$1(extendedDefaults, newDefaults);
	}
	static installModule(mod) {
		if (!Swiper$1.prototype.__modules__) Swiper$1.prototype.__modules__ = [];
		const modules = Swiper$1.prototype.__modules__;
		if (typeof mod === "function" && modules.indexOf(mod) < 0) modules.push(mod);
	}
	static use(module) {
		if (Array.isArray(module)) {
			module.forEach((m) => Swiper$1.installModule(m));
			return Swiper$1;
		}
		Swiper$1.installModule(module);
		return Swiper$1;
	}
};
Object.defineProperty(Swiper$1, "extendedDefaults", { get() {
	return extendedDefaults;
} });
Object.defineProperty(Swiper$1, "defaults", { get() {
	return defaults;
} });
var prototypeRecord = prototypes;
var swiperProto = Swiper$1.prototype;
Object.keys(prototypeRecord).forEach((prototypeGroup) => {
	const group = prototypeRecord[prototypeGroup];
	Object.keys(group).forEach((protoMethod) => {
		swiperProto[protoMethod] = group[protoMethod];
	});
});
Swiper$1.use([Resize, Observer]);
//#endregion
//#region node_modules/swiper/shared/update-on-virtual-data.mjs
function getChangedParams(swiperParams, oldParams, children, oldChildren, getKey) {
	const keys = [];
	if (!oldParams) return keys;
	const addKey = (key) => {
		if (keys.indexOf(key) < 0) keys.push(key);
	};
	if (children && oldChildren) {
		const oldChildrenKeys = oldChildren.map(getKey);
		const childrenKeys = children.map(getKey);
		if (oldChildrenKeys.join("") !== childrenKeys.join("")) addKey("children");
		if (oldChildren.length !== children.length) addKey("children");
	}
	paramsList.filter((key) => key[0] === "_").map((key) => key.replace(/_/, "")).forEach((key) => {
		if (key in swiperParams && key in oldParams) {
			const newVal = swiperParams[key];
			const oldVal = oldParams[key];
			if (isObject(newVal) && isObject(oldVal)) {
				const newKeys = Object.keys(newVal);
				const oldKeys = Object.keys(oldVal);
				if (newKeys.length !== oldKeys.length) addKey(key);
				else {
					newKeys.forEach((newKey) => {
						if (newVal[newKey] !== oldVal[newKey]) addKey(key);
					});
					oldKeys.forEach((oldKey) => {
						if (newVal[oldKey] !== oldVal[oldKey]) addKey(key);
					});
				}
			} else if (newVal !== oldVal) addKey(key);
		}
	});
	return keys;
}
function getParams(obj = {}, splitEvents = true) {
	const params = { on: {} };
	const events = {};
	const passedParams = {};
	extend(params, defaults);
	params._emitClasses = true;
	params.init = false;
	const rest = {};
	const allowedParams = paramsList.map((key) => key.replace(/_/, ""));
	const plainObj = { ...obj };
	Object.keys(plainObj).forEach((key) => {
		const value = obj[key];
		if (typeof value === "undefined") return;
		if (allowedParams.indexOf(key) >= 0) if (isObject(value)) {
			params[key] = {};
			passedParams[key] = {};
			extend(params[key], value);
			extend(passedParams[key], value);
		} else {
			params[key] = value;
			passedParams[key] = value;
		}
		else if (key.search(/on[A-Z]/) === 0 && typeof value === "function") {
			const eventName = `${key[2].toLowerCase()}${key.substring(3)}`;
			const handler = value;
			if (splitEvents) events[eventName] = handler;
			else params.on[eventName] = handler;
		} else rest[key] = value;
	});
	[
		"navigation",
		"pagination",
		"scrollbar"
	].forEach((key) => {
		if (params[key] === true) params[key] = {};
		if (params[key] === false) delete params[key];
	});
	return {
		params,
		passedParams,
		rest,
		events
	};
}
function mountSwiper(refs, swiperParams) {
	const { el, nextEl, prevEl, paginationEl, scrollbarEl, swiper } = refs;
	if (needsNavigation(swiperParams) && nextEl && prevEl) {
		const params = swiper.params.navigation;
		const original = swiper.originalParams.navigation;
		params.nextEl = nextEl;
		original.nextEl = nextEl;
		params.prevEl = prevEl;
		original.prevEl = prevEl;
	}
	if (needsPagination(swiperParams) && paginationEl) {
		swiper.params.pagination.el = paginationEl;
		swiper.originalParams.pagination.el = paginationEl;
	}
	if (needsScrollbar(swiperParams) && scrollbarEl) {
		swiper.params.scrollbar.el = scrollbarEl;
		swiper.originalParams.scrollbar.el = scrollbarEl;
	}
	swiper.init(el);
}
var updateOnVirtualData = (swiper) => {
	if (!swiper || swiper.destroyed || !swiper.params.virtual || swiper.params.virtual && !swiper.params.virtual.enabled) return;
	swiper.updateSlides();
	swiper.updateProgress();
	swiper.updateSlidesClasses();
	swiper.emit("_virtualUpdated");
	if (swiper.parallax && swiper.params.parallax && swiper.params.parallax.enabled) swiper.parallax.setTranslate?.();
};
//#endregion
//#region node_modules/swiper/swiper-vue.mjs
/**
* Swiper Vue 14.0.5
* Most modern mobile touch slider and framework with hardware accelerated transitions
* https://swiperjs.com
*
* Copyright 2014-2026 Vladimir Kharlampidi
*
* Released under the MIT License
*
* Released on: July 9, 2026
*/
function getChildren(originalSlots = {}, slidesRef, oldSlidesRef) {
	const slides = [];
	const slots = {
		"container-start": [],
		"container-end": [],
		"wrapper-start": [],
		"wrapper-end": []
	};
	const getSlidesFromElements = (els, slotName) => {
		if (!Array.isArray(els)) return;
		let effectiveSlot = slotName === "default" ? "container-end" : slotName;
		els.forEach((vnode) => {
			if (typeof vnode.type === "symbol" && vnode.children) {
				getSlidesFromElements(vnode.children, effectiveSlot);
				return;
			}
			const typeObj = vnode.type;
			const legacyTag = vnode.componentOptions?.tag;
			if (typeObj && (typeObj.name === "SwiperSlide" || typeObj.name === "AsyncComponentWrapper") || legacyTag === "SwiperSlide") slides.push(vnode);
			else if (slots[effectiveSlot]) slots[effectiveSlot].push(vnode);
		});
	};
	Object.keys(originalSlots).forEach((slotName) => {
		const slotFn = originalSlots[slotName];
		if (typeof slotFn !== "function") return;
		const els = slotFn();
		getSlidesFromElements(els, slotName);
	});
	oldSlidesRef.value = slidesRef.value;
	slidesRef.value = slides;
	return {
		slides,
		slots
	};
}
function renderVirtual(swiperRef, slides, virtualData) {
	if (!virtualData) return null;
	const swiper = swiperRef.value;
	if (!swiper) return null;
	const getSlideIndex = (index) => {
		let slideIndex = index;
		if (index < 0) slideIndex = slides.length + index;
		else if (slideIndex >= slides.length) slideIndex -= slides.length;
		return slideIndex;
	};
	const style = swiper.isHorizontal() ? { [swiper.rtlTranslate ? "right" : "left"]: `${virtualData.offset}px` } : { top: `${virtualData.offset}px` };
	const { from, to } = virtualData;
	const loopFrom = swiper.params.loop ? -slides.length : 0;
	const loopTo = swiper.params.loop ? slides.length * 2 : slides.length;
	const slidesToRender = [];
	for (let i = loopFrom; i < loopTo; i += 1) if (i >= from && i <= to && slidesToRender.length < slides.length) {
		const slide = slides[getSlideIndex(i)];
		if (slide) slidesToRender.push(slide);
	}
	return slidesToRender.map((slide) => {
		const props = slide.props ?? {};
		props.style = props.style ?? {};
		props.swiperRef = swiperRef;
		props.style = style;
		slide.props = props;
		if (slide.type) return h(slide.type, { ...props }, slide.children);
		if (slide.componentOptions) return h(slide.componentOptions.Ctor, { ...props }, slide.componentOptions.children);
	});
}
var Swiper = /* @__PURE__ */ defineComponent({
	name: "Swiper",
	props: {
		tag: {
			type: String,
			default: "div"
		},
		wrapperTag: {
			type: String,
			default: "div"
		},
		modules: {
			type: Array,
			default: void 0
		},
		init: {
			type: Boolean,
			default: void 0
		},
		direction: {
			type: String,
			default: void 0
		},
		oneWayMovement: {
			type: Boolean,
			default: void 0
		},
		swiperElementNodeName: {
			type: String,
			default: "SWIPER-CONTAINER"
		},
		touchEventsTarget: {
			type: String,
			default: void 0
		},
		initialSlide: {
			type: Number,
			default: void 0
		},
		speed: {
			type: Number,
			default: void 0
		},
		cssMode: {
			type: Boolean,
			default: void 0
		},
		updateOnWindowResize: {
			type: Boolean,
			default: void 0
		},
		resizeObserver: {
			type: Boolean,
			default: void 0
		},
		nested: {
			type: Boolean,
			default: void 0
		},
		focusableElements: {
			type: String,
			default: void 0
		},
		width: {
			type: Number,
			default: void 0
		},
		height: {
			type: Number,
			default: void 0
		},
		preventInteractionOnTransition: {
			type: Boolean,
			default: void 0
		},
		userAgent: {
			type: String,
			default: void 0
		},
		url: {
			type: String,
			default: void 0
		},
		edgeSwipeDetection: {
			type: [Boolean, String],
			default: void 0
		},
		edgeSwipeThreshold: {
			type: Number,
			default: void 0
		},
		autoHeight: {
			type: Boolean,
			default: void 0
		},
		setWrapperSize: {
			type: Boolean,
			default: void 0
		},
		virtualTranslate: {
			type: Boolean,
			default: void 0
		},
		effect: {
			type: String,
			default: void 0
		},
		breakpoints: {
			type: Object,
			default: void 0
		},
		breakpointsBase: {
			type: String,
			default: void 0
		},
		spaceBetween: {
			type: [Number, String],
			default: void 0
		},
		slidesPerView: {
			type: [Number, String],
			default: void 0
		},
		maxBackfaceHiddenSlides: {
			type: Number,
			default: void 0
		},
		slidesPerGroup: {
			type: Number,
			default: void 0
		},
		slidesPerGroupSkip: {
			type: Number,
			default: void 0
		},
		slidesPerGroupAuto: {
			type: Boolean,
			default: void 0
		},
		centeredSlides: {
			type: Boolean,
			default: void 0
		},
		centeredSlidesBounds: {
			type: Boolean,
			default: void 0
		},
		slidesOffsetBefore: {
			type: Number,
			default: void 0
		},
		slidesOffsetAfter: {
			type: Number,
			default: void 0
		},
		normalizeSlideIndex: {
			type: Boolean,
			default: void 0
		},
		centerInsufficientSlides: {
			type: Boolean,
			default: void 0
		},
		watchOverflow: {
			type: Boolean,
			default: void 0
		},
		roundLengths: {
			type: Boolean,
			default: void 0
		},
		touchRatio: {
			type: Number,
			default: void 0
		},
		touchAngle: {
			type: Number,
			default: void 0
		},
		simulateTouch: {
			type: Boolean,
			default: void 0
		},
		shortSwipes: {
			type: Boolean,
			default: void 0
		},
		longSwipes: {
			type: Boolean,
			default: void 0
		},
		longSwipesRatio: {
			type: Number,
			default: void 0
		},
		longSwipesMs: {
			type: Number,
			default: void 0
		},
		followFinger: {
			type: Boolean,
			default: void 0
		},
		allowTouchMove: {
			type: Boolean,
			default: void 0
		},
		threshold: {
			type: Number,
			default: void 0
		},
		touchMoveStopPropagation: {
			type: Boolean,
			default: void 0
		},
		touchStartPreventDefault: {
			type: Boolean,
			default: void 0
		},
		touchStartForcePreventDefault: {
			type: Boolean,
			default: void 0
		},
		touchReleaseOnEdges: {
			type: Boolean,
			default: void 0
		},
		uniqueNavElements: {
			type: Boolean,
			default: void 0
		},
		resistance: {
			type: Boolean,
			default: void 0
		},
		resistanceRatio: {
			type: Number,
			default: void 0
		},
		watchSlidesProgress: {
			type: Boolean,
			default: void 0
		},
		grabCursor: {
			type: Boolean,
			default: void 0
		},
		preventClicks: {
			type: Boolean,
			default: void 0
		},
		preventClicksPropagation: {
			type: Boolean,
			default: void 0
		},
		slideToClickedSlide: {
			type: Boolean,
			default: void 0
		},
		loop: {
			type: Boolean,
			default: void 0
		},
		loopedSlides: {
			type: Number,
			default: void 0
		},
		loopPreventsSliding: {
			type: Boolean,
			default: void 0
		},
		loopAdditionalSlides: {
			type: Number,
			default: void 0
		},
		loopAddBlankSlides: {
			type: Boolean,
			default: void 0
		},
		rewind: {
			type: Boolean,
			default: void 0
		},
		allowSlidePrev: {
			type: Boolean,
			default: void 0
		},
		allowSlideNext: {
			type: Boolean,
			default: void 0
		},
		swipeHandler: {
			type: Boolean,
			default: void 0
		},
		noSwiping: {
			type: Boolean,
			default: void 0
		},
		noSwipingClass: {
			type: String,
			default: void 0
		},
		noSwipingSelector: {
			type: String,
			default: void 0
		},
		passiveListeners: {
			type: Boolean,
			default: void 0
		},
		containerModifierClass: {
			type: String,
			default: void 0
		},
		slideClass: {
			type: String,
			default: void 0
		},
		slideActiveClass: {
			type: String,
			default: void 0
		},
		slideVisibleClass: {
			type: String,
			default: void 0
		},
		slideFullyVisibleClass: {
			type: String,
			default: void 0
		},
		slideBlankClass: {
			type: String,
			default: void 0
		},
		slideNextClass: {
			type: String,
			default: void 0
		},
		slidePrevClass: {
			type: String,
			default: void 0
		},
		wrapperClass: {
			type: String,
			default: void 0
		},
		lazyPreloaderClass: {
			type: String,
			default: void 0
		},
		lazyPreloadPrevNext: {
			type: Number,
			default: void 0
		},
		runCallbacksOnInit: {
			type: Boolean,
			default: void 0
		},
		observer: {
			type: Boolean,
			default: void 0
		},
		observeParents: {
			type: Boolean,
			default: void 0
		},
		observeSlideChildren: {
			type: Boolean,
			default: void 0
		},
		a11y: {
			type: [Boolean, Object],
			default: void 0
		},
		autoplay: {
			type: [Boolean, Object],
			default: void 0
		},
		controller: {
			type: Object,
			default: void 0
		},
		coverflowEffect: {
			type: Object,
			default: void 0
		},
		cubeEffect: {
			type: Object,
			default: void 0
		},
		fadeEffect: {
			type: Object,
			default: void 0
		},
		flipEffect: {
			type: Object,
			default: void 0
		},
		creativeEffect: {
			type: Object,
			default: void 0
		},
		cardsEffect: {
			type: Object,
			default: void 0
		},
		hashNavigation: {
			type: [Boolean, Object],
			default: void 0
		},
		history: {
			type: [Boolean, Object],
			default: void 0
		},
		keyboard: {
			type: [Boolean, Object],
			default: void 0
		},
		mousewheel: {
			type: [Boolean, Object],
			default: void 0
		},
		navigation: {
			type: [Boolean, Object],
			default: void 0
		},
		pagination: {
			type: [Boolean, Object],
			default: void 0
		},
		parallax: {
			type: [Boolean, Object],
			default: void 0
		},
		scrollbar: {
			type: [Boolean, Object],
			default: void 0
		},
		thumbs: {
			type: Object,
			default: void 0
		},
		virtual: {
			type: [Boolean, Object],
			default: void 0
		},
		zoom: {
			type: [Boolean, Object],
			default: void 0
		},
		grid: {
			type: Object,
			default: void 0
		},
		freeMode: {
			type: [Boolean, Object],
			default: void 0
		},
		enabled: {
			type: Boolean,
			default: void 0
		}
	},
	emits: [
		"_beforeBreakpoint",
		"_containerClasses",
		"_slideClass",
		"_slideClasses",
		"_swiper",
		"_freeModeNoMomentumRelease",
		"_virtualUpdated",
		"activeIndexChange",
		"afterInit",
		"autoplay",
		"autoplayStart",
		"autoplayStop",
		"autoplayPause",
		"autoplayResume",
		"autoplayTimeLeft",
		"beforeDestroy",
		"beforeInit",
		"beforeLoopFix",
		"beforeResize",
		"beforeSlideChangeStart",
		"beforeTransitionStart",
		"breakpoint",
		"changeDirection",
		"click",
		"disable",
		"doubleTap",
		"doubleClick",
		"destroy",
		"enable",
		"fromEdge",
		"hashChange",
		"hashSet",
		"init",
		"keyPress",
		"lock",
		"loopFix",
		"momentumBounce",
		"navigationHide",
		"navigationShow",
		"navigationPrev",
		"navigationNext",
		"observerUpdate",
		"orientationchange",
		"paginationHide",
		"paginationRender",
		"paginationShow",
		"paginationUpdate",
		"progress",
		"reachBeginning",
		"reachEnd",
		"realIndexChange",
		"resize",
		"scroll",
		"scrollbarDragEnd",
		"scrollbarDragMove",
		"scrollbarDragStart",
		"setTransition",
		"setTranslate",
		"slidesUpdated",
		"slideChange",
		"slideChangeTransitionEnd",
		"slideChangeTransitionStart",
		"slideNextTransitionEnd",
		"slideNextTransitionStart",
		"slidePrevTransitionEnd",
		"slidePrevTransitionStart",
		"slideResetTransitionStart",
		"slideResetTransitionEnd",
		"sliderMove",
		"sliderFirstMove",
		"slidesLengthChange",
		"slidesGridLengthChange",
		"snapGridLengthChange",
		"snapIndexChange",
		"swiper",
		"tap",
		"toEdge",
		"touchEnd",
		"touchMove",
		"touchMoveOpposite",
		"touchStart",
		"transitionEnd",
		"transitionStart",
		"unlock",
		"update",
		"virtualUpdate",
		"zoomChange"
	],
	setup(props, { slots: originalSlots, emit }) {
		const { tag: Tag, wrapperTag: WrapperTag } = props;
		const containerClasses = /* @__PURE__ */ ref("swiper");
		const virtualData = /* @__PURE__ */ ref(null);
		const breakpointChanged = /* @__PURE__ */ ref(false);
		const initializedRef = /* @__PURE__ */ ref(false);
		const swiperElRef = /* @__PURE__ */ ref(null);
		const swiperRef = /* @__PURE__ */ shallowRef(null);
		const oldPassedParamsRef = /* @__PURE__ */ ref(null);
		const slidesRef = { value: [] };
		const oldSlidesRef = { value: [] };
		const nextElRef = /* @__PURE__ */ ref(null);
		const prevElRef = /* @__PURE__ */ ref(null);
		const paginationElRef = /* @__PURE__ */ ref(null);
		const scrollbarElRef = /* @__PURE__ */ ref(null);
		const { params: swiperParams, passedParams } = getParams(props, false);
		getChildren(originalSlots, slidesRef, oldSlidesRef);
		oldPassedParamsRef.value = passedParams;
		oldSlidesRef.value = slidesRef.value;
		const onBeforeBreakpoint = () => {
			getChildren(originalSlots, slidesRef, oldSlidesRef);
			breakpointChanged.value = true;
		};
		swiperParams.onAny = (event, ...args) => {
			emit(event, ...args);
		};
		Object.assign(swiperParams.on, {
			_beforeBreakpoint: onBeforeBreakpoint,
			_containerClasses(_swiper, classes) {
				containerClasses.value = classes;
			}
		});
		const passParams = { ...swiperParams };
		delete passParams.wrapperClass;
		swiperRef.value = new Swiper$1(passParams);
		const instance = swiperRef.value;
		if (instance && instance.virtual && instance.params.virtual?.enabled) {
			instance.virtual.slides = slidesRef.value;
			const extendWith = {
				cache: false,
				slides: slidesRef.value,
				renderExternal: (data) => {
					virtualData.value = data;
				},
				renderExternalUpdate: false
			};
			extend(instance.params.virtual, extendWith);
			if (instance.originalParams.virtual) extend(instance.originalParams.virtual, extendWith);
		}
		onUpdated(() => {
			if (!initializedRef.value && swiperRef.value) {
				swiperRef.value.emitSlidesClasses();
				initializedRef.value = true;
			}
			const { passedParams: newPassedParams } = getParams(props, false);
			const changedParams = getChangedParams(newPassedParams, oldPassedParamsRef.value, slidesRef.value, oldSlidesRef.value, (c) => c.props ? c.props.key : void 0);
			oldPassedParamsRef.value = newPassedParams;
			if ((changedParams.length || breakpointChanged.value) && swiperRef.value && !swiperRef.value.destroyed) updateSwiper({
				swiper: swiperRef.value,
				slides: slidesRef.value,
				passedParams: newPassedParams,
				changedParams,
				nextEl: nextElRef.value,
				prevEl: prevElRef.value,
				scrollbarEl: scrollbarElRef.value,
				paginationEl: paginationElRef.value
			});
			breakpointChanged.value = false;
		});
		provide("swiper", swiperRef);
		watch(virtualData, () => {
			nextTick$1(() => {
				updateOnVirtualData(swiperRef.value);
			});
		});
		onMounted(() => {
			if (!swiperElRef.value || !swiperRef.value) return;
			mountSwiper({
				el: swiperElRef.value,
				nextEl: nextElRef.value,
				prevEl: prevElRef.value,
				paginationEl: paginationElRef.value,
				scrollbarEl: scrollbarElRef.value,
				swiper: swiperRef.value
			}, swiperParams);
			emit("swiper", swiperRef.value);
		});
		onBeforeUnmount(() => {
			if (swiperRef.value && !swiperRef.value.destroyed) swiperRef.value.destroy(true, false);
		});
		function renderSlides(slides) {
			if (swiperParams.virtual) return renderVirtual(swiperRef, slides, virtualData.value);
			slides.forEach((slide, index) => {
				const slideProps = slide.props ?? {};
				slideProps.swiperRef = swiperRef;
				slideProps.swiperSlideIndex = index;
				slide.props = slideProps;
			});
			return slides;
		}
		return () => {
			const { slides, slots } = getChildren(originalSlots, slidesRef, oldSlidesRef);
			return h(Tag, {
				ref: swiperElRef,
				class: uniqueClasses(containerClasses.value)
			}, [
				slots["container-start"],
				h(WrapperTag, { class: wrapperClass(swiperParams.wrapperClass) }, [
					slots["wrapper-start"],
					renderSlides(slides),
					slots["wrapper-end"]
				]),
				needsNavigation(props) && [h("div", {
					ref: prevElRef,
					class: "swiper-button-prev"
				}), h("div", {
					ref: nextElRef,
					class: "swiper-button-next"
				})],
				needsScrollbar(props) && h("div", {
					ref: scrollbarElRef,
					class: "swiper-scrollbar"
				}),
				needsPagination(props) && h("div", {
					ref: paginationElRef,
					class: "swiper-pagination"
				}),
				slots["container-end"]
			]);
		};
	}
});
var SwiperSlide = /* @__PURE__ */ defineComponent({
	name: "SwiperSlide",
	props: {
		tag: {
			type: String,
			default: "div"
		},
		swiperRef: {
			type: Object,
			required: false
		},
		swiperSlideIndex: {
			type: Number,
			default: void 0,
			required: false
		},
		zoom: {
			type: [Boolean, Number],
			default: void 0,
			required: false
		},
		lazy: {
			type: Boolean,
			default: false,
			required: false
		},
		virtualIndex: {
			type: [String, Number],
			default: void 0
		}
	},
	setup(props, { slots }) {
		let eventAttached = false;
		const { swiperRef } = props;
		const slideElRef = /* @__PURE__ */ ref(null);
		const slideClasses = /* @__PURE__ */ ref("swiper-slide");
		const lazyLoaded = /* @__PURE__ */ ref(false);
		function updateClasses(_swiper, el, classNames) {
			if (el === slideElRef.value) slideClasses.value = classNames;
		}
		onMounted(() => {
			if (!swiperRef || !swiperRef.value) return;
			swiperRef.value.on("_slideClass", updateClasses);
			eventAttached = true;
		});
		onBeforeUpdate(() => {
			if (eventAttached || !swiperRef || !swiperRef.value) return;
			swiperRef.value.on("_slideClass", updateClasses);
			eventAttached = true;
		});
		onUpdated(() => {
			if (!slideElRef.value || !swiperRef || !swiperRef.value) return;
			if (typeof props.swiperSlideIndex !== "undefined") slideElRef.value.swiperSlideIndex = props.swiperSlideIndex;
			if (swiperRef.value.destroyed) {
				if (slideClasses.value !== "swiper-slide") slideClasses.value = "swiper-slide";
			}
		});
		onBeforeUnmount(() => {
			if (!swiperRef || !swiperRef.value) return;
			swiperRef.value.off("_slideClass", updateClasses);
		});
		const slideData = computed(() => ({
			isActive: slideClasses.value.indexOf("swiper-slide-active") >= 0,
			isVisible: slideClasses.value.indexOf("swiper-slide-visible") >= 0,
			isPrev: slideClasses.value.indexOf("swiper-slide-prev") >= 0,
			isNext: slideClasses.value.indexOf("swiper-slide-next") >= 0
		}));
		provide("swiperSlide", slideData);
		const onLoad = () => {
			lazyLoaded.value = true;
		};
		const lazyPreloaderHook = (vnode) => {
			const el = vnode.el;
			if (el) el.lazyPreloaderManaged = true;
		};
		return () => h(props.tag, {
			class: uniqueClasses(`${slideClasses.value}`),
			ref: slideElRef,
			"data-swiper-slide-index": typeof props.virtualIndex === "undefined" && swiperRef && swiperRef.value && swiperRef.value.params.loop ? props.swiperSlideIndex : props.virtualIndex,
			onLoadCapture: onLoad
		}, props.zoom ? h("div", {
			class: "swiper-zoom-container",
			"data-swiper-zoom": typeof props.zoom === "number" ? props.zoom : void 0
		}, [slots.default && slots.default(slideData.value), props.lazy && !lazyLoaded.value && h("div", {
			class: "swiper-lazy-preloader",
			onVnodeMounted: lazyPreloaderHook
		})]) : [slots.default && slots.default(slideData.value), props.lazy && !lazyLoaded.value && h("div", {
			class: "swiper-lazy-preloader",
			onVnodeMounted: lazyPreloaderHook
		})]);
	}
});
//#endregion
//#region node_modules/swiper/modules/keyboard.mjs
var Keyboard = ({ swiper, extendParams, on, emit }) => {
	extendParams({ keyboard: {
		enabled: false,
		onlyInViewport: true,
		pageUpDown: true,
		speed: void 0
	} });
	function getParams() {
		return swiper.params.keyboard;
	}
	function handle(event) {
		if (!swiper.enabled) return;
		const { rtlTranslate: rtl } = swiper;
		const e = "originalEvent" in event && event.originalEvent ? event.originalEvent : event;
		const kc = e.keyCode || e.charCode;
		const params = getParams();
		const pageUpDown = !!params.pageUpDown;
		const isPageUp = pageUpDown && kc === 33;
		const isPageDown = pageUpDown && kc === 34;
		const isArrowLeft = kc === 37;
		const isArrowRight = kc === 39;
		const isArrowUp = kc === 38;
		const isArrowDown = kc === 40;
		if (!swiper.allowSlideNext && (swiper.isHorizontal() && isArrowRight || swiper.isVertical() && isArrowDown || isPageDown)) return false;
		if (!swiper.allowSlidePrev && (swiper.isHorizontal() && isArrowLeft || swiper.isVertical() && isArrowUp || isPageUp)) return false;
		if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return;
		const activeElement = document.activeElement;
		if (activeElement && (activeElement.isContentEditable || activeElement.nodeName && (activeElement.nodeName.toLowerCase() === "input" || activeElement.nodeName.toLowerCase() === "textarea"))) return;
		if (params.onlyInViewport && (isPageUp || isPageDown || isArrowLeft || isArrowRight || isArrowUp || isArrowDown)) {
			let inView = false;
			if (elementParents(swiper.el, `.${swiper.params.slideClass}, swiper-slide`).length > 0 && elementParents(swiper.el, `.${swiper.params.slideActiveClass}`).length === 0) return;
			const el = swiper.el;
			const swiperWidth = el.clientWidth;
			const swiperHeight = el.clientHeight;
			const windowWidth = window.innerWidth;
			const windowHeight = window.innerHeight;
			const swiperOffset = elementOffset(el);
			if (rtl) swiperOffset.left -= el.scrollLeft;
			const swiperCoord = [
				[swiperOffset.left, swiperOffset.top],
				[swiperOffset.left + swiperWidth, swiperOffset.top],
				[swiperOffset.left, swiperOffset.top + swiperHeight],
				[swiperOffset.left + swiperWidth, swiperOffset.top + swiperHeight]
			];
			for (let i = 0; i < swiperCoord.length; i += 1) {
				const point = swiperCoord[i];
				if (point[0] >= 0 && point[0] <= windowWidth && point[1] >= 0 && point[1] <= windowHeight) {
					if (point[0] === 0 && point[1] === 0) continue;
					inView = true;
				}
			}
			if (!inView) return void 0;
		}
		const speed = params.speed;
		if (swiper.isHorizontal()) {
			if (isPageUp || isPageDown || isArrowLeft || isArrowRight) {
				if (e.cancelable) e.preventDefault();
			}
			if ((isPageDown || isArrowRight) && !rtl || (isPageUp || isArrowLeft) && rtl) swiper.slideNext(speed);
			if ((isPageUp || isArrowLeft) && !rtl || (isPageDown || isArrowRight) && rtl) swiper.slidePrev(speed);
		} else {
			if (isPageUp || isPageDown || isArrowUp || isArrowDown) {
				if (e.cancelable) e.preventDefault();
			}
			if (isPageDown || isArrowDown) swiper.slideNext(speed);
			if (isPageUp || isArrowUp) swiper.slidePrev(speed);
		}
		emit("keyPress", kc);
	}
	function enable() {
		if (swiper.keyboard.enabled) return;
		document.addEventListener("keydown", handle);
		swiper.keyboard.enabled = true;
	}
	function disable() {
		if (!swiper.keyboard.enabled) return;
		document.removeEventListener("keydown", handle);
		swiper.keyboard.enabled = false;
	}
	swiper.keyboard = {
		enabled: false,
		enable,
		disable
	};
	on("init", () => {
		if (getParams().enabled) enable();
	});
	on("destroy", () => {
		if (swiper.keyboard.enabled) disable();
	});
};
//#endregion
//#region node_modules/swiper/modules/mousewheel.mjs
var Mousewheel = ({ swiper, extendParams, on, emit }) => {
	extendParams({ mousewheel: {
		enabled: false,
		releaseOnEdges: false,
		invert: false,
		forceToAxis: false,
		sensitivity: 1,
		eventsTarget: "container",
		thresholdDelta: null,
		thresholdTime: null,
		noMousewheelClass: "swiper-no-mousewheel"
	} });
	let timeout;
	let lastScrollTime = now();
	let lastEventBeforeSnap;
	let mouseEntered = false;
	const recentWheelEvents = [];
	function getParams() {
		return swiper.params.mousewheel;
	}
	function normalize(e) {
		const PIXEL_STEP = 10;
		const LINE_HEIGHT = 40;
		const PAGE_HEIGHT = 800;
		const ev = e;
		let sX = 0;
		let sY = 0;
		let pX = 0;
		let pY = 0;
		if (ev.detail !== void 0) sY = ev.detail;
		if (ev.wheelDelta !== void 0) sY = -ev.wheelDelta / 120;
		if (ev.wheelDeltaY !== void 0) sY = -ev.wheelDeltaY / 120;
		if (ev.wheelDeltaX !== void 0) sX = -ev.wheelDeltaX / 120;
		if (ev.axis !== void 0 && ev.HORIZONTAL_AXIS !== void 0 && ev.axis === ev.HORIZONTAL_AXIS) {
			sX = sY;
			sY = 0;
		}
		pX = sX * PIXEL_STEP;
		pY = sY * PIXEL_STEP;
		if (ev.deltaY !== void 0) pY = ev.deltaY;
		if (ev.deltaX !== void 0) pX = ev.deltaX;
		if (ev.shiftKey && !pX) {
			pX = pY;
			pY = 0;
		}
		if ((pX || pY) && ev.deltaMode) if (ev.deltaMode === 1) {
			pX *= LINE_HEIGHT;
			pY *= LINE_HEIGHT;
		} else {
			pX *= PAGE_HEIGHT;
			pY *= PAGE_HEIGHT;
		}
		if (pX && !sX) sX = pX < 1 ? -1 : 1;
		if (pY && !sY) sY = pY < 1 ? -1 : 1;
		return {
			spinX: sX,
			spinY: sY,
			pixelX: pX,
			pixelY: pY
		};
	}
	function handleMouseEnter() {
		if (!swiper.enabled) return;
		mouseEntered = true;
	}
	function handleMouseLeave() {
		if (!swiper.enabled) return;
		mouseEntered = false;
	}
	function animateSlider(newEvent) {
		const params = getParams();
		if (params.thresholdDelta && newEvent.delta < params.thresholdDelta) return false;
		if (params.thresholdTime && now() - lastScrollTime < params.thresholdTime) return false;
		if (newEvent.delta >= 6 && now() - lastScrollTime < 60) return true;
		if (newEvent.direction < 0) {
			if ((!swiper.isEnd || swiper.params.loop) && !swiper.animating) {
				swiper.slideNext();
				emit("scroll", newEvent.raw);
			}
		} else if ((!swiper.isBeginning || swiper.params.loop) && !swiper.animating) {
			swiper.slidePrev();
			emit("scroll", newEvent.raw);
		}
		lastScrollTime = new window.Date().getTime();
		return false;
	}
	function releaseScroll(newEvent) {
		const params = getParams();
		if (newEvent.direction < 0) {
			if (swiper.isEnd && !swiper.params.loop && params.releaseOnEdges) return true;
		} else if (swiper.isBeginning && !swiper.params.loop && params.releaseOnEdges) return true;
		return false;
	}
	function handle(event) {
		let e = "originalEvent" in event && event.originalEvent ? event.originalEvent : event;
		let disableParentSwiper = true;
		if (!swiper.enabled) return false;
		const params = getParams();
		if (event.target.closest(`.${params.noMousewheelClass}`)) return false;
		if (swiper.params.cssMode) e.preventDefault();
		let targetEl = swiper.el;
		if (params.eventsTarget !== "container") targetEl = document.querySelector(params.eventsTarget);
		const targetElContainsTarget = targetEl && targetEl.contains(e.target);
		if (!mouseEntered && !targetElContainsTarget && !params.releaseOnEdges) return true;
		let delta = 0;
		const rtlFactor = swiper.rtlTranslate ? -1 : 1;
		const data = normalize(e);
		if (params.forceToAxis) if (swiper.isHorizontal()) if (Math.abs(data.pixelX) > Math.abs(data.pixelY)) delta = -data.pixelX * rtlFactor;
		else return true;
		else if (Math.abs(data.pixelY) > Math.abs(data.pixelX)) delta = -data.pixelY;
		else return true;
		else delta = Math.abs(data.pixelX) > Math.abs(data.pixelY) ? -data.pixelX * rtlFactor : -data.pixelY;
		if (delta === 0) return true;
		if (params.invert) delta = -delta;
		let positions = swiper.getTranslate() + delta * (params.sensitivity ?? 1);
		if (positions >= swiper.minTranslate()) positions = swiper.minTranslate();
		if (positions <= swiper.maxTranslate()) positions = swiper.maxTranslate();
		disableParentSwiper = swiper.params.loop ? true : !(positions === swiper.minTranslate() || positions === swiper.maxTranslate());
		if (disableParentSwiper && swiper.params.nested) e.stopPropagation();
		const freeModeParams = swiper.params.freeMode;
		if (!swiper.params.freeMode || !freeModeParams?.enabled) {
			const newEvent = {
				time: now(),
				delta: Math.abs(delta),
				direction: Math.sign(delta),
				raw: event
			};
			if (recentWheelEvents.length >= 2) recentWheelEvents.shift();
			const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : void 0;
			recentWheelEvents.push(newEvent);
			if (prevEvent) {
				if (newEvent.direction !== prevEvent.direction || newEvent.delta > prevEvent.delta || newEvent.time > prevEvent.time + 150) animateSlider(newEvent);
			} else animateSlider(newEvent);
			if (releaseScroll(newEvent)) return true;
		} else {
			const newEvent = {
				time: now(),
				delta: Math.abs(delta),
				direction: Math.sign(delta)
			};
			const ignoreWheelEvents = lastEventBeforeSnap && newEvent.time < lastEventBeforeSnap.time + 500 && newEvent.delta <= lastEventBeforeSnap.delta && newEvent.direction === lastEventBeforeSnap.direction;
			if (!ignoreWheelEvents) {
				lastEventBeforeSnap = void 0;
				let position = swiper.getTranslate() + delta * (params.sensitivity ?? 1);
				const wasBeginning = swiper.isBeginning;
				const wasEnd = swiper.isEnd;
				if (position >= swiper.minTranslate()) position = swiper.minTranslate();
				if (position <= swiper.maxTranslate()) position = swiper.maxTranslate();
				swiper.setTransition(0);
				swiper.setTranslate(position);
				swiper.updateProgress();
				swiper.updateActiveIndex();
				swiper.updateSlidesClasses();
				if (!wasBeginning && swiper.isBeginning || !wasEnd && swiper.isEnd) swiper.updateSlidesClasses();
				if (swiper.params.loop) swiper.loopFix({
					direction: newEvent.direction < 0 ? "next" : "prev",
					byMousewheel: true
				});
				if (freeModeParams?.sticky) {
					clearTimeout(timeout);
					timeout = void 0;
					if (recentWheelEvents.length >= 15) recentWheelEvents.shift();
					const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : void 0;
					const firstEvent = recentWheelEvents[0];
					recentWheelEvents.push(newEvent);
					if (prevEvent && (newEvent.delta > prevEvent.delta || newEvent.direction !== prevEvent.direction)) recentWheelEvents.splice(0);
					else if (recentWheelEvents.length >= 15 && firstEvent && newEvent.time - firstEvent.time < 500 && firstEvent.delta - newEvent.delta >= 1 && newEvent.delta <= 6) {
						const snapToThreshold = delta > 0 ? .8 : .2;
						lastEventBeforeSnap = newEvent;
						recentWheelEvents.splice(0);
						timeout = nextTick(() => {
							if (swiper.destroyed || !swiper.params) return;
							swiper.slideToClosest(swiper.params.speed, true, void 0, snapToThreshold);
						}, 0);
					}
					if (!timeout) timeout = nextTick(() => {
						if (swiper.destroyed || !swiper.params) return;
						const snapToThreshold = .5;
						lastEventBeforeSnap = newEvent;
						recentWheelEvents.splice(0);
						swiper.slideToClosest(swiper.params.speed, true, void 0, snapToThreshold);
					}, 500);
				}
				if (!ignoreWheelEvents) emit("scroll", e);
				const autoplayParams = swiper.params.autoplay;
				if (swiper.params.autoplay && autoplayParams?.disableOnInteraction) swiper.autoplay.stop();
				if (params.releaseOnEdges && (position === swiper.minTranslate() || position === swiper.maxTranslate())) return true;
			}
		}
		if (e.cancelable) e.preventDefault();
		return false;
	}
	function events(method) {
		const params = getParams();
		let targetEl = swiper.el;
		if (params.eventsTarget !== "container") targetEl = document.querySelector(params.eventsTarget);
		targetEl[method]("mouseenter", handleMouseEnter);
		targetEl[method]("mouseleave", handleMouseLeave);
		targetEl[method]("wheel", handle);
	}
	function enable() {
		if (swiper.params.cssMode) {
			swiper.wrapperEl.removeEventListener("wheel", handle);
			return true;
		}
		if (swiper.mousewheel.enabled) return false;
		events("addEventListener");
		swiper.mousewheel.enabled = true;
		return true;
	}
	function disable() {
		if (swiper.params.cssMode) {
			swiper.wrapperEl.addEventListener("wheel", handle);
			return true;
		}
		if (!swiper.mousewheel.enabled) return false;
		events("removeEventListener");
		swiper.mousewheel.enabled = false;
		return true;
	}
	on("init", () => {
		const params = getParams();
		if (!params.enabled && swiper.params.cssMode) disable();
		if (params.enabled) enable();
	});
	swiper.mousewheel = {
		enabled: false,
		enable,
		disable
	};
	on("destroy", () => {
		if (swiper.params.cssMode) enable();
		if (swiper.mousewheel.enabled) disable();
	});
};
//#endregion
//#region node_modules/swiper/shared/create-element-if-not-defined.mjs
function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
	const target = params ?? {};
	const original = originalParams ?? {};
	if (swiper.params.createElements) Object.keys(checkProps).forEach((key) => {
		if (!target[key] && target.auto === true) {
			let element = elementChildren(swiper.el, `.${checkProps[key]}`)[0];
			if (!element) {
				element = createElement("div", checkProps[key]);
				element.className = checkProps[key];
				swiper.el.append(element);
			}
			target[key] = element;
			original[key] = element;
		}
	});
	return target;
}
//#endregion
//#region node_modules/swiper/modules/navigation.mjs
var arrowSvg = `<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"/></svg>`;
var Navigation = ({ swiper, extendParams, on, emit }) => {
	extendParams({ navigation: {
		nextEl: null,
		prevEl: null,
		addIcons: true,
		hideOnClick: false,
		disabledClass: "swiper-button-disabled",
		hiddenClass: "swiper-button-hidden",
		lockClass: "swiper-button-lock",
		navigationDisabledClass: "swiper-navigation-disabled"
	} });
	swiper.navigation = {
		nextEl: null,
		prevEl: null,
		arrowSvg
	};
	function getParams() {
		return swiper.params.navigation;
	}
	function getEl(el) {
		let res;
		if (el && typeof el === "string" && swiper.isElement) {
			res = swiper.el.querySelector(el) || swiper.hostEl.querySelector(el);
			if (res) return res;
		}
		if (el) {
			if (typeof el === "string") res = [...document.querySelectorAll(el)];
			if (swiper.params.uniqueNavElements && typeof el === "string" && res && res.length > 1 && swiper.el.querySelectorAll(el).length === 1) res = swiper.el.querySelector(el);
			else if (res && res.length === 1) res = res[0];
		}
		if (el && !res) return el;
		return res;
	}
	function toggleEl(el, disabled) {
		const params = getParams();
		makeElementsArray(el).forEach((subEl) => {
			if (subEl) {
				subEl.classList[disabled ? "add" : "remove"](...params.disabledClass.split(" "));
				if (subEl.tagName === "BUTTON") subEl.disabled = disabled;
				if (swiper.params.watchOverflow && swiper.enabled) subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
			}
		});
	}
	function update() {
		const { nextEl, prevEl } = swiper.navigation;
		if (swiper.params.loop) {
			toggleEl(prevEl, false);
			toggleEl(nextEl, false);
			return;
		}
		toggleEl(prevEl, swiper.isBeginning && !swiper.params.rewind);
		toggleEl(nextEl, swiper.isEnd && !swiper.params.rewind);
	}
	function onPrevClick(e) {
		e.preventDefault();
		if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
		swiper.slidePrev();
		emit("navigationPrev");
	}
	function onNextClick(e) {
		e.preventDefault();
		if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
		swiper.slideNext();
		emit("navigationNext");
	}
	function init() {
		swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
			nextEl: "swiper-button-next",
			prevEl: "swiper-button-prev"
		});
		const params = getParams();
		if (!(params.nextEl || params.prevEl)) return;
		const nextEl = getEl(params.nextEl);
		const prevEl = getEl(params.prevEl);
		Object.assign(swiper.navigation, {
			nextEl,
			prevEl
		});
		const nextEls = makeElementsArray(nextEl);
		const prevEls = makeElementsArray(prevEl);
		const initButton = (el, dir) => {
			if (el) {
				if (params.addIcons && el.matches(".swiper-button-next,.swiper-button-prev") && !el.querySelector("svg")) {
					const tempEl = document.createElement("div");
					setInnerHTML(tempEl, arrowSvg);
					const svgEl = tempEl.querySelector("svg");
					if (svgEl) el.appendChild(svgEl);
					tempEl.remove();
				}
				el.addEventListener("click", dir === "next" ? onNextClick : onPrevClick);
			}
			if (!swiper.enabled && el) el.classList.add(...params.lockClass.split(" "));
		};
		nextEls.forEach((el) => initButton(el, "next"));
		prevEls.forEach((el) => initButton(el, "prev"));
	}
	function destroy() {
		const params = getParams();
		const { nextEl, prevEl } = swiper.navigation;
		const nextEls = makeElementsArray(nextEl);
		const prevEls = makeElementsArray(prevEl);
		const destroyButton = (el, dir) => {
			el.removeEventListener("click", dir === "next" ? onNextClick : onPrevClick);
			el.classList.remove(...params.disabledClass.split(" "));
		};
		nextEls.forEach((el) => destroyButton(el, "next"));
		prevEls.forEach((el) => destroyButton(el, "prev"));
	}
	on("init", () => {
		if (getParams().enabled === false) disable();
		else {
			init();
			update();
		}
	});
	on("toEdge fromEdge lock unlock", () => {
		update();
	});
	on("destroy", () => {
		destroy();
	});
	on("enable disable", () => {
		const params = getParams();
		const { nextEl, prevEl } = swiper.navigation;
		const nextEls = makeElementsArray(nextEl);
		const prevEls = makeElementsArray(prevEl);
		if (swiper.enabled) {
			update();
			return;
		}
		[...nextEls, ...prevEls].filter((el) => !!el).forEach((el) => el.classList.add(params.lockClass));
	});
	on("click", (_s, e) => {
		const params = getParams();
		const { nextEl, prevEl } = swiper.navigation;
		const nextEls = makeElementsArray(nextEl);
		const prevEls = makeElementsArray(prevEl);
		const targetEl = e.target;
		let targetIsButton = prevEls.includes(targetEl) || nextEls.includes(targetEl);
		if (swiper.isElement && !targetIsButton) {
			const path = e.composedPath ? e.composedPath() : [];
			if (path.length) targetIsButton = path.find((pathEl) => nextEls.includes(pathEl) || prevEls.includes(pathEl));
		}
		if (params.hideOnClick && !targetIsButton) {
			if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
			let isHidden;
			if (nextEls.length) isHidden = nextEls[0].classList.contains(params.hiddenClass);
			else if (prevEls.length) isHidden = prevEls[0].classList.contains(params.hiddenClass);
			if (isHidden === true) emit("navigationShow");
			else emit("navigationHide");
			[...nextEls, ...prevEls].filter((el) => !!el).forEach((el) => el.classList.toggle(params.hiddenClass));
		}
	});
	const enable = () => {
		const params = getParams();
		swiper.el.classList.remove(...params.navigationDisabledClass.split(" "));
		init();
		update();
	};
	const disable = () => {
		const params = getParams();
		swiper.el.classList.add(...params.navigationDisabledClass.split(" "));
		destroy();
	};
	Object.assign(swiper.navigation, {
		enable,
		disable,
		update,
		init,
		destroy
	});
};
//#endregion
//#region node_modules/swiper/shared/classes-to-selector.mjs
function classesToSelector(classes = "") {
	return `.${classes.trim().replace(/([.:!+/()[\]#>~*^$|=,'"@{}\\])/g, "\\$1").replace(/ /g, ".")}`;
}
//#endregion
//#region node_modules/swiper/modules/pagination.mjs
var isVirtualEnabled$1 = (swiper) => !!swiper.virtual && !!swiper.params.virtual?.enabled;
var isFreeModeEnabled = (swiper) => !!swiper.params.freeMode?.enabled;
var getSlidesLength = (swiper) => {
	if (isVirtualEnabled$1(swiper)) return swiper.virtual.slides.length;
	const gridRows = swiper.params.grid?.rows;
	if (swiper.grid && gridRows && gridRows > 1) return swiper.slides.length / Math.ceil(gridRows);
	return swiper.slides.length;
};
var Pagination = ({ swiper, extendParams, on, emit }) => {
	const pfx = "swiper-pagination";
	extendParams({ pagination: {
		el: null,
		bulletElement: "span",
		clickable: false,
		hideOnClick: false,
		renderBullet: null,
		renderProgressbar: null,
		renderFraction: null,
		renderCustom: null,
		progressbarOpposite: false,
		type: "bullets",
		dynamicBullets: false,
		dynamicMainBullets: 1,
		formatFractionCurrent: (number) => number,
		formatFractionTotal: (number) => number,
		bulletClass: `${pfx}-bullet`,
		bulletActiveClass: `${pfx}-bullet-active`,
		modifierClass: `${pfx}-`,
		currentClass: `${pfx}-current`,
		totalClass: `${pfx}-total`,
		hiddenClass: `${pfx}-hidden`,
		progressbarFillClass: `${pfx}-progressbar-fill`,
		progressbarOppositeClass: `${pfx}-progressbar-opposite`,
		clickableClass: `${pfx}-clickable`,
		lockClass: `${pfx}-lock`,
		horizontalClass: `${pfx}-horizontal`,
		verticalClass: `${pfx}-vertical`,
		paginationDisabledClass: `${pfx}-disabled`
	} });
	swiper.pagination = {
		el: null,
		bullets: []
	};
	let bulletSize;
	let dynamicBulletIndex = 0;
	function getParams() {
		return swiper.params.pagination;
	}
	function isPaginationDisabled() {
		return !getParams().el || !swiper.pagination.el || Array.isArray(swiper.pagination.el) && swiper.pagination.el.length === 0;
	}
	function setSideBullets(bulletEl, position) {
		const { bulletActiveClass } = getParams();
		if (!bulletEl) return;
		let current = bulletEl[`${position === "prev" ? "previous" : "next"}ElementSibling`];
		if (current) {
			current.classList.add(`${bulletActiveClass}-${position}`);
			current = current[`${position === "prev" ? "previous" : "next"}ElementSibling`];
			if (current) current.classList.add(`${bulletActiveClass}-${position}-${position}`);
		}
	}
	function getMoveDirection(prevIndex, nextIndex, length) {
		prevIndex = prevIndex % length;
		nextIndex = nextIndex % length;
		if (nextIndex === prevIndex + 1) return "next";
		else if (nextIndex === prevIndex - 1) return "previous";
	}
	function onBulletClick(e) {
		const bulletEl = e.target.closest(classesToSelector(getParams().bulletClass));
		if (!bulletEl) return;
		e.preventDefault();
		const index = (elementIndex(bulletEl) ?? 0) * (swiper.params.slidesPerGroup ?? 1);
		if (swiper.params.loop) {
			if (swiper.realIndex === index) return;
			const moveDirection = getMoveDirection(swiper.realIndex, index, swiper.slides.length);
			if (moveDirection === "next") swiper.slideNext();
			else if (moveDirection === "previous") swiper.slidePrev();
			else swiper.slideToLoop(index);
		} else swiper.slideTo(index);
	}
	function update() {
		const rtl = swiper.rtl;
		const params = getParams();
		if (isPaginationDisabled()) return;
		const els = makeElementsArray(swiper.pagination.el);
		let current;
		let previousIndex;
		const slidesLength = getSlidesLength(swiper);
		const total = swiper.params.loop ? Math.ceil(slidesLength / (swiper.params.slidesPerGroup ?? 1)) : swiper.snapGrid.length;
		if (swiper.params.loop) {
			previousIndex = swiper.previousRealIndex || 0;
			current = (swiper.params.slidesPerGroup ?? 1) > 1 ? Math.floor(swiper.realIndex / (swiper.params.slidesPerGroup ?? 1)) : swiper.realIndex;
		} else if (typeof swiper.snapIndex !== "undefined") {
			current = swiper.snapIndex;
			previousIndex = swiper.previousSnapIndex;
		} else {
			previousIndex = swiper.previousIndex || 0;
			current = swiper.activeIndex || 0;
		}
		if (params.type === "bullets" && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
			const bullets = swiper.pagination.bullets;
			let firstIndex = 0;
			let lastIndex = 0;
			let midIndex = 0;
			if (params.dynamicBullets) {
				bulletSize = elementOuterSize(bullets[0], swiper.isHorizontal() ? "width" : "height");
				const dim = swiper.isHorizontal() ? "width" : "height";
				els.forEach((subEl) => {
					subEl.style[dim] = `${(bulletSize ?? 0) * (params.dynamicMainBullets + 4)}px`;
				});
				if (params.dynamicMainBullets > 1 && previousIndex !== void 0) {
					dynamicBulletIndex += current - (previousIndex || 0);
					if (dynamicBulletIndex > params.dynamicMainBullets - 1) dynamicBulletIndex = params.dynamicMainBullets - 1;
					else if (dynamicBulletIndex < 0) dynamicBulletIndex = 0;
				}
				firstIndex = Math.max(current - dynamicBulletIndex, 0);
				lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
				midIndex = (lastIndex + firstIndex) / 2;
			}
			bullets.forEach((bulletEl) => {
				const classesToRemove = [
					"",
					"-next",
					"-next-next",
					"-prev",
					"-prev-prev",
					"-main"
				].map((suffix) => `${params.bulletActiveClass}${suffix}`).flatMap((s) => typeof s === "string" && s.includes(" ") ? s.split(" ") : [s]);
				bulletEl.classList.remove(...classesToRemove);
			});
			if (els.length > 1) bullets.forEach((bullet) => {
				const bulletIndex = elementIndex(bullet);
				if (bulletIndex === current) bullet.classList.add(...params.bulletActiveClass.split(" "));
				else if (swiper.isElement) bullet.setAttribute("part", "bullet");
				if (params.dynamicBullets && bulletIndex !== void 0) {
					if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) bullet.classList.add(...`${params.bulletActiveClass}-main`.split(" "));
					if (bulletIndex === firstIndex) setSideBullets(bullet, "prev");
					if (bulletIndex === lastIndex) setSideBullets(bullet, "next");
				}
			});
			else {
				const bullet = bullets[current];
				if (bullet) bullet.classList.add(...params.bulletActiveClass.split(" "));
				if (swiper.isElement) bullets.forEach((bulletEl, bulletIndex) => {
					bulletEl.setAttribute("part", bulletIndex === current ? "bullet-active" : "bullet");
				});
				if (params.dynamicBullets) {
					const firstDisplayedBullet = bullets[firstIndex];
					const lastDisplayedBullet = bullets[lastIndex];
					for (let i = firstIndex; i <= lastIndex; i += 1) if (bullets[i]) bullets[i].classList.add(...`${params.bulletActiveClass}-main`.split(" "));
					setSideBullets(firstDisplayedBullet, "prev");
					setSideBullets(lastDisplayedBullet, "next");
				}
			}
			if (params.dynamicBullets) {
				const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
				const bulletsOffset = ((bulletSize ?? 0) * dynamicBulletsLength - (bulletSize ?? 0)) / 2 - midIndex * (bulletSize ?? 0);
				const offsetProp = rtl ? "right" : "left";
				const positionDim = swiper.isHorizontal() ? offsetProp : "top";
				bullets.forEach((bullet) => {
					bullet.style[positionDim] = `${bulletsOffset}px`;
				});
			}
		}
		els.forEach((subEl, subElIndex) => {
			if (params.type === "fraction") {
				subEl.querySelectorAll(classesToSelector(params.currentClass)).forEach((fractionEl) => {
					fractionEl.textContent = String(params.formatFractionCurrent(current + 1));
				});
				subEl.querySelectorAll(classesToSelector(params.totalClass)).forEach((totalEl) => {
					totalEl.textContent = String(params.formatFractionTotal(total));
				});
			}
			if (params.type === "progressbar") {
				let progressbarDirection;
				if (params.progressbarOpposite) progressbarDirection = swiper.isHorizontal() ? "vertical" : "horizontal";
				else progressbarDirection = swiper.isHorizontal() ? "horizontal" : "vertical";
				const scale = (current + 1) / total;
				let scaleX = 1;
				let scaleY = 1;
				if (progressbarDirection === "horizontal") scaleX = scale;
				else scaleY = scale;
				subEl.querySelectorAll(classesToSelector(params.progressbarFillClass)).forEach((progressEl) => {
					progressEl.style.transform = `translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`;
					progressEl.style.transitionDuration = `${swiper.params.speed}ms`;
				});
			}
			if (params.type === "custom" && params.renderCustom) {
				setInnerHTML(subEl, params.renderCustom(swiper, current + 1, total));
				if (subElIndex === 0) emit("paginationRender", subEl);
			} else {
				if (subElIndex === 0) emit("paginationRender", subEl);
				emit("paginationUpdate", subEl);
			}
			if (swiper.params.watchOverflow && swiper.enabled) subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
		});
	}
	function render() {
		const params = getParams();
		if (isPaginationDisabled()) return;
		const slidesLength = getSlidesLength(swiper);
		const els = makeElementsArray(swiper.pagination.el);
		let paginationHTML = "";
		if (params.type === "bullets") {
			let numberOfBullets = swiper.params.loop ? Math.ceil(slidesLength / (swiper.params.slidesPerGroup ?? 1)) : swiper.snapGrid.length;
			if (swiper.params.freeMode && isFreeModeEnabled(swiper) && numberOfBullets > slidesLength) numberOfBullets = slidesLength;
			for (let i = 0; i < numberOfBullets; i += 1) if (params.renderBullet) paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass);
			else paginationHTML += `<${params.bulletElement} ${swiper.isElement ? "part=\"bullet\"" : ""} class="${params.bulletClass}"></${params.bulletElement}>`;
		}
		if (params.type === "fraction") if (params.renderFraction) paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass);
		else paginationHTML = `<span class="${params.currentClass}"></span> / <span class="${params.totalClass}"></span>`;
		if (params.type === "progressbar") if (params.renderProgressbar) paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass);
		else paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
		swiper.pagination.bullets = [];
		els.forEach((subEl) => {
			if (params.type !== "custom") setInnerHTML(subEl, paginationHTML || "");
			if (params.type === "bullets") swiper.pagination.bullets.push(...Array.from(subEl.querySelectorAll(classesToSelector(params.bulletClass))));
		});
		if (params.type !== "custom") emit("paginationRender", els[0]);
	}
	function init() {
		swiper.params.pagination = createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, { el: "swiper-pagination" });
		const params = getParams();
		if (!params.el) return;
		let el;
		if (typeof params.el === "string" && swiper.isElement) el = swiper.el.querySelector(params.el);
		if (!el && typeof params.el === "string") el = [...document.querySelectorAll(params.el)];
		if (!el) el = params.el;
		if (!el || Array.isArray(el) && el.length === 0) return;
		if (swiper.params.uniqueNavElements && typeof params.el === "string" && Array.isArray(el) && el.length > 1) {
			el = [...swiper.el.querySelectorAll(params.el)];
			if (el.length > 1) {
				const found = el.find((subEl) => {
					if (elementParents(subEl, ".swiper")[0] !== swiper.el) return false;
					return true;
				});
				if (found) el = found;
			}
		}
		if (Array.isArray(el) && el.length === 1) el = el[0];
		Object.assign(swiper.pagination, { el });
		makeElementsArray(el).forEach((subEl) => {
			if (params.type === "bullets" && params.clickable) subEl.classList.add(...(params.clickableClass || "").split(" "));
			subEl.classList.add(params.modifierClass + params.type);
			subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
			if (params.type === "bullets" && params.dynamicBullets) {
				subEl.classList.add(`${params.modifierClass}${params.type}-dynamic`);
				dynamicBulletIndex = 0;
				if (params.dynamicMainBullets < 1) params.dynamicMainBullets = 1;
			}
			if (params.type === "progressbar" && params.progressbarOpposite) subEl.classList.add(params.progressbarOppositeClass);
			if (params.clickable) subEl.addEventListener("click", onBulletClick);
			if (!swiper.enabled) subEl.classList.add(params.lockClass);
		});
	}
	function destroy() {
		const params = getParams();
		if (isPaginationDisabled()) return;
		const el = swiper.pagination.el;
		if (el) makeElementsArray(el).forEach((subEl) => {
			subEl.classList.remove(params.hiddenClass);
			subEl.classList.remove(params.modifierClass + params.type);
			subEl.classList.remove(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
			if (params.clickable) {
				subEl.classList.remove(...(params.clickableClass || "").split(" "));
				subEl.removeEventListener("click", onBulletClick);
			}
		});
		if (swiper.pagination.bullets) swiper.pagination.bullets.forEach((subEl) => subEl.classList.remove(...params.bulletActiveClass.split(" ")));
	}
	on("changeDirection", () => {
		if (!swiper.pagination || !swiper.pagination.el) return;
		const params = getParams();
		makeElementsArray(swiper.pagination.el).forEach((subEl) => {
			subEl.classList.remove(params.horizontalClass, params.verticalClass);
			subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
		});
	});
	on("init", () => {
		if (getParams().enabled === false) disable();
		else {
			init();
			render();
			update();
		}
	});
	on("activeIndexChange", () => {
		if (typeof swiper.snapIndex === "undefined") update();
	});
	on("snapIndexChange", () => {
		update();
	});
	on("snapGridLengthChange", () => {
		render();
		update();
	});
	on("destroy", () => {
		destroy();
	});
	on("enable disable", () => {
		const { el } = swiper.pagination;
		if (el) {
			const params = getParams();
			makeElementsArray(el).forEach((subEl) => subEl.classList[swiper.enabled ? "remove" : "add"](params.lockClass));
		}
	});
	on("lock unlock", () => {
		update();
	});
	on("click", (_s, e) => {
		const targetEl = e.target;
		const els = makeElementsArray(swiper.pagination.el);
		const params = getParams();
		if (params.el && params.hideOnClick && els && els.length > 0 && !targetEl.classList.contains(params.bulletClass)) {
			if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
			if (els[0].classList.contains(params.hiddenClass) === true) emit("paginationShow");
			else emit("paginationHide");
			els.forEach((subEl) => subEl.classList.toggle(params.hiddenClass));
		}
	});
	const enable = () => {
		const params = getParams();
		swiper.el.classList.remove(params.paginationDisabledClass);
		const { el } = swiper.pagination;
		if (el) makeElementsArray(el).forEach((subEl) => subEl.classList.remove(params.paginationDisabledClass));
		init();
		render();
		update();
	};
	const disable = () => {
		const params = getParams();
		swiper.el.classList.add(params.paginationDisabledClass);
		const { el } = swiper.pagination;
		if (el) makeElementsArray(el).forEach((subEl) => subEl.classList.add(params.paginationDisabledClass));
		destroy();
	};
	Object.assign(swiper.pagination, {
		enable,
		disable,
		render,
		update,
		init,
		destroy
	});
};
//#endregion
//#region node_modules/swiper/modules/scrollbar.mjs
var Scrollbar = ({ swiper, extendParams, on, emit }) => {
	let isTouched = false;
	let timeout = null;
	let dragTimeout = null;
	let dragStartPos = 0;
	let dragSize = 0;
	let trackSize = 0;
	let divider = 0;
	extendParams({ scrollbar: {
		el: null,
		dragSize: "auto",
		hide: false,
		draggable: false,
		snapOnRelease: true,
		lockClass: "swiper-scrollbar-lock",
		dragClass: "swiper-scrollbar-drag",
		scrollbarDisabledClass: "swiper-scrollbar-disabled",
		horizontalClass: `swiper-scrollbar-horizontal`,
		verticalClass: `swiper-scrollbar-vertical`
	} });
	swiper.scrollbar = {
		el: null,
		dragEl: null
	};
	function getParams() {
		return swiper.params.scrollbar;
	}
	function setTranslate() {
		const params = getParams();
		if (!params.el || !swiper.scrollbar.el) return;
		const { scrollbar, rtlTranslate: rtl } = swiper;
		const { dragEl, el } = scrollbar;
		const progress = swiper.params.loop ? swiper.progressLoop ?? 0 : swiper.progress;
		let newSize = dragSize;
		let newPos = (trackSize - dragSize) * progress;
		if (rtl) {
			newPos = -newPos;
			if (newPos > 0) {
				newSize = dragSize - newPos;
				newPos = 0;
			} else if (-newPos + dragSize > trackSize) newSize = trackSize + newPos;
		} else if (newPos < 0) {
			newSize = dragSize + newPos;
			newPos = 0;
		} else if (newPos + dragSize > trackSize) newSize = trackSize - newPos;
		if (swiper.isHorizontal()) {
			dragEl.style.transform = `translate3d(${newPos}px, 0, 0)`;
			dragEl.style.width = `${newSize}px`;
		} else {
			dragEl.style.transform = `translate3d(0px, ${newPos}px, 0)`;
			dragEl.style.height = `${newSize}px`;
		}
		if (params.hide) {
			if (timeout) clearTimeout(timeout);
			el.style.opacity = "1";
			timeout = setTimeout(() => {
				el.style.opacity = "0";
				el.style.transitionDuration = "400ms";
			}, 1e3);
		}
	}
	function setTransition(duration) {
		if (!getParams().el || !swiper.scrollbar.el) return;
		swiper.scrollbar.dragEl.style.transitionDuration = `${duration}ms`;
	}
	function updateSize() {
		const params = getParams();
		if (!params.el || !swiper.scrollbar.el) return;
		const { scrollbar } = swiper;
		const { dragEl, el } = scrollbar;
		dragEl.style.width = "";
		dragEl.style.height = "";
		trackSize = swiper.isHorizontal() ? el.offsetWidth : el.offsetHeight;
		divider = swiper.size / (swiper.virtualSize + (swiper.params.slidesOffsetBefore ?? 0) - (swiper.params.centeredSlides ? swiper.snapGrid[0] : 0));
		if (params.dragSize === "auto") dragSize = trackSize * divider;
		else dragSize = parseInt(String(params.dragSize), 10);
		if (swiper.isHorizontal()) dragEl.style.width = `${dragSize}px`;
		else dragEl.style.height = `${dragSize}px`;
		if (divider >= 1) el.style.display = "none";
		else el.style.display = "";
		if (params.hide) el.style.opacity = "0";
		if (swiper.params.watchOverflow && swiper.enabled) scrollbar.el.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
	}
	function getPointerPosition(e) {
		if (swiper.isHorizontal()) return e.clientX ?? e.touches?.[0]?.clientX ?? 0;
		return e.clientY ?? e.touches?.[0]?.clientY ?? 0;
	}
	function setDragPosition(e) {
		const { scrollbar, rtlTranslate: rtl } = swiper;
		const { el } = scrollbar;
		let positionRatio;
		positionRatio = (getPointerPosition(e) - elementOffset(el)[swiper.isHorizontal() ? "left" : "top"] - (dragStartPos !== null ? dragStartPos : dragSize / 2)) / (trackSize - dragSize);
		positionRatio = Math.max(Math.min(positionRatio, 1), 0);
		if (rtl) positionRatio = 1 - positionRatio;
		const position = swiper.minTranslate() + (swiper.maxTranslate() - swiper.minTranslate()) * positionRatio;
		swiper.updateProgress(position);
		swiper.setTranslate(position);
		swiper.updateActiveIndex();
		swiper.updateSlidesClasses();
	}
	function onDragStart(e) {
		const params = getParams();
		const { scrollbar, wrapperEl } = swiper;
		const { el, dragEl } = scrollbar;
		isTouched = true;
		dragStartPos = e.target === dragEl ? getPointerPosition(e) - e.target.getBoundingClientRect()[swiper.isHorizontal() ? "left" : "top"] : null;
		e.preventDefault();
		e.stopPropagation();
		wrapperEl.style.transitionDuration = "100ms";
		dragEl.style.transitionDuration = "100ms";
		setDragPosition(e);
		if (dragTimeout) clearTimeout(dragTimeout);
		el.style.transitionDuration = "0ms";
		if (params.hide) el.style.opacity = "1";
		if (swiper.params.cssMode) swiper.wrapperEl.style.scrollSnapType = "none";
		emit("scrollbarDragStart", e);
	}
	function onDragMove(e) {
		const { scrollbar, wrapperEl } = swiper;
		const { el, dragEl } = scrollbar;
		if (!isTouched) return;
		if (e.cancelable) e.preventDefault();
		setDragPosition(e);
		wrapperEl.style.transitionDuration = "0ms";
		el.style.transitionDuration = "0ms";
		dragEl.style.transitionDuration = "0ms";
		emit("scrollbarDragMove", e);
	}
	function onDragEnd(e) {
		const params = getParams();
		const { scrollbar, wrapperEl } = swiper;
		const { el } = scrollbar;
		if (!isTouched) return;
		isTouched = false;
		if (swiper.params.cssMode) {
			swiper.wrapperEl.style.scrollSnapType = "";
			wrapperEl.style.transitionDuration = "";
		}
		if (params.hide) {
			if (dragTimeout) clearTimeout(dragTimeout);
			dragTimeout = nextTick(() => {
				el.style.opacity = "0";
				el.style.transitionDuration = "400ms";
			}, 1e3);
		}
		emit("scrollbarDragEnd", e);
		if (params.snapOnRelease) swiper.slideToClosest();
	}
	function events(method) {
		const { scrollbar, params } = swiper;
		const el = scrollbar.el;
		if (!el) return;
		const activeListener = params.passiveListeners ? {
			passive: false,
			capture: false
		} : false;
		const passiveListener = params.passiveListeners ? {
			passive: true,
			capture: false
		} : false;
		const eventMethod = method === "on" ? "addEventListener" : "removeEventListener";
		el[eventMethod]("pointerdown", onDragStart, activeListener);
		document[eventMethod]("pointermove", onDragMove, activeListener);
		document[eventMethod]("pointerup", onDragEnd, passiveListener);
	}
	function enableDraggable() {
		if (!getParams().el || !swiper.scrollbar.el) return;
		events("on");
	}
	function disableDraggable() {
		if (!getParams().el || !swiper.scrollbar.el) return;
		events("off");
	}
	function init() {
		const { scrollbar, el: swiperEl } = swiper;
		swiper.params.scrollbar = createElementIfNotDefined(swiper, swiper.originalParams.scrollbar, swiper.params.scrollbar, { el: "swiper-scrollbar" });
		const params = getParams();
		if (!params.el) return;
		let el;
		if (typeof params.el === "string" && swiper.isElement) el = swiper.el.querySelector(params.el);
		else el = params.el;
		if (!el && typeof params.el === "string") {
			el = document.querySelectorAll(params.el);
			if (!el.length) return;
		} else if (!el) el = params.el;
		if (swiper.params.uniqueNavElements && typeof params.el === "string" && el.length > 1 && swiperEl.querySelectorAll(params.el).length === 1) el = swiperEl.querySelector(params.el);
		if (el.length > 0) el = el[0];
		const elTyped = el;
		elTyped.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
		let dragEl = null;
		if (elTyped) {
			dragEl = elTyped.querySelector(classesToSelector(params.dragClass));
			if (!dragEl) {
				dragEl = createElement("div", params.dragClass);
				elTyped.append(dragEl);
			}
		}
		Object.assign(scrollbar, {
			el: elTyped,
			dragEl
		});
		if (params.draggable) enableDraggable();
		if (elTyped) elTyped.classList[swiper.enabled ? "remove" : "add"](...classesToTokens(params.lockClass));
	}
	function destroy() {
		const params = getParams();
		const el = swiper.scrollbar.el;
		if (el) el.classList.remove(...classesToTokens(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass));
		disableDraggable();
	}
	on("changeDirection", () => {
		if (!swiper.scrollbar || !swiper.scrollbar.el) return;
		const params = getParams();
		makeElementsArray(swiper.scrollbar.el).forEach((subEl) => {
			subEl.classList.remove(params.horizontalClass, params.verticalClass);
			subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
		});
	});
	on("init", () => {
		if (getParams().enabled === false) disable();
		else {
			init();
			updateSize();
			setTranslate();
		}
	});
	on("update resize observerUpdate lock unlock changeDirection", () => {
		updateSize();
	});
	on("setTranslate", () => {
		setTranslate();
	});
	on("setTransition", (_s, duration) => {
		setTransition(duration);
	});
	on("enable disable", () => {
		const { el } = swiper.scrollbar;
		if (el) el.classList[swiper.enabled ? "remove" : "add"](...classesToTokens(getParams().lockClass));
	});
	on("destroy", () => {
		destroy();
	});
	const enable = () => {
		const params = getParams();
		swiper.el.classList.remove(...classesToTokens(params.scrollbarDisabledClass));
		if (swiper.scrollbar.el) swiper.scrollbar.el.classList.remove(...classesToTokens(params.scrollbarDisabledClass));
		init();
		updateSize();
		setTranslate();
	};
	const disable = () => {
		const params = getParams();
		swiper.el.classList.add(...classesToTokens(params.scrollbarDisabledClass));
		if (swiper.scrollbar.el) swiper.scrollbar.el.classList.add(...classesToTokens(params.scrollbarDisabledClass));
		destroy();
	};
	Object.assign(swiper.scrollbar, {
		enable,
		disable,
		updateSize,
		setTranslate,
		init,
		destroy
	});
};
//#endregion
//#region node_modules/swiper/modules/zoom.mjs
var Zoom = ({ swiper, extendParams, on, emit }) => {
	extendParams({ zoom: {
		enabled: false,
		limitToOriginalSize: false,
		maxRatio: 3,
		minRatio: 1,
		panOnMouseMove: false,
		toggle: true,
		containerClass: "swiper-zoom-container",
		zoomedSlideClass: "swiper-slide-zoomed"
	} });
	swiper.zoom = { enabled: false };
	function getParams() {
		return swiper.params.zoom;
	}
	let currentScale = 1;
	let isScaling = false;
	let isPanningWithMouse = false;
	let mousePanStart = {
		x: 0,
		y: 0
	};
	const mousePanSensitivity = -3;
	let fakeGestureTouched = false;
	let fakeGestureMoved = false;
	const evCache = [];
	const gesture = {
		originX: 0,
		originY: 0,
		slideEl: void 0,
		slideWidth: void 0,
		slideHeight: void 0,
		imageEl: void 0,
		imageWrapEl: void 0,
		maxRatio: 3
	};
	const image = {
		isTouched: void 0,
		isMoved: void 0,
		currentX: void 0,
		currentY: void 0,
		minX: void 0,
		minY: void 0,
		maxX: void 0,
		maxY: void 0,
		width: void 0,
		height: void 0,
		startX: void 0,
		startY: void 0,
		touchesStart: {},
		touchesCurrent: {}
	};
	const velocity = {
		x: void 0,
		y: void 0,
		prevPositionX: void 0,
		prevPositionY: void 0,
		prevTime: void 0
	};
	let scale = 1;
	Object.defineProperty(swiper.zoom, "scale", {
		get() {
			return scale;
		},
		set(value) {
			if (scale !== value) {
				const imageEl = gesture.imageEl;
				const slideEl = gesture.slideEl;
				emit("zoomChange", value, imageEl, slideEl);
			}
			scale = value;
		}
	});
	function getDistanceBetweenTouches() {
		if (evCache.length < 2) return 1;
		const x1 = evCache[0].pageX;
		const y1 = evCache[0].pageY;
		const x2 = evCache[1].pageX;
		const y2 = evCache[1].pageY;
		return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
	}
	function getMaxRatio() {
		const params = getParams();
		const attr = gesture.imageWrapEl?.getAttribute("data-swiper-zoom");
		const maxRatio = attr != null ? Number(attr) : params.maxRatio;
		const imageEl = gesture.imageEl;
		if (params.limitToOriginalSize && imageEl && imageEl.naturalWidth) {
			const imageMaxRatio = imageEl.naturalWidth / imageEl.offsetWidth;
			return Math.min(imageMaxRatio, maxRatio);
		}
		return maxRatio;
	}
	function getScaleOrigin() {
		if (evCache.length < 2 || !gesture.imageEl) return [null, null];
		const box = gesture.imageEl.getBoundingClientRect();
		return [(evCache[0].pageX + (evCache[1].pageX - evCache[0].pageX) / 2 - box.x - window.scrollX) / currentScale, (evCache[0].pageY + (evCache[1].pageY - evCache[0].pageY) / 2 - box.y - window.scrollY) / currentScale];
	}
	function getSlideSelector() {
		return swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
	}
	function eventWithinSlide(e) {
		const slideSelector = getSlideSelector();
		const target = e.target;
		if (!target) return false;
		if (target.matches(slideSelector)) return true;
		if (swiper.slides.filter((slideEl) => slideEl.contains(target)).length > 0) return true;
		return false;
	}
	function eventWithinZoomContainer(e) {
		const selector = `.${getParams().containerClass}`;
		const target = e.target;
		if (!target) return false;
		if (target.matches(selector)) return true;
		if ([...swiper.hostEl.querySelectorAll(selector)].filter((containerEl) => containerEl.contains(target)).length > 0) return true;
		return false;
	}
	function onGestureStart(e) {
		if (e.pointerType === "mouse") evCache.splice(0, evCache.length);
		if (!eventWithinSlide(e)) return;
		const params = getParams();
		fakeGestureTouched = false;
		fakeGestureMoved = false;
		evCache.push(e);
		if (evCache.length < 2) return;
		fakeGestureTouched = true;
		gesture.scaleStart = getDistanceBetweenTouches();
		if (!gesture.slideEl) {
			const target = e.target;
			gesture.slideEl = target?.closest(`.${swiper.params.slideClass}, swiper-slide`) ?? void 0;
			if (!gesture.slideEl) gesture.slideEl = swiper.slides[swiper.activeIndex];
			let imageEl = gesture.slideEl?.querySelector(`.${params.containerClass}`) ?? null;
			if (imageEl) imageEl = imageEl.querySelectorAll("picture, img, svg, canvas, .swiper-zoom-target")[0] ?? null;
			gesture.imageEl = imageEl ?? void 0;
			if (imageEl) gesture.imageWrapEl = elementParents(imageEl, `.${params.containerClass}`)[0] ?? void 0;
			else gesture.imageWrapEl = void 0;
			if (!gesture.imageWrapEl) {
				gesture.imageEl = void 0;
				return;
			}
			gesture.maxRatio = getMaxRatio();
		}
		if (gesture.imageEl) {
			const [originX, originY] = getScaleOrigin();
			gesture.originX = originX ?? 0;
			gesture.originY = originY ?? 0;
			gesture.imageEl.style.transitionDuration = "0ms";
		}
		isScaling = true;
	}
	function onGestureChange(e) {
		if (!eventWithinSlide(e)) return;
		const params = getParams();
		const zoom = swiper.zoom;
		const pointerIndex = evCache.findIndex((cachedEv) => cachedEv.pointerId === e.pointerId);
		if (pointerIndex >= 0) evCache[pointerIndex] = e;
		if (evCache.length < 2) return;
		fakeGestureMoved = true;
		gesture.scaleMove = getDistanceBetweenTouches();
		if (!gesture.imageEl) return;
		zoom.scale = gesture.scaleMove / (gesture.scaleStart ?? 1) * currentScale;
		if (zoom.scale > gesture.maxRatio) zoom.scale = gesture.maxRatio - 1 + (zoom.scale - gesture.maxRatio + 1) ** .5;
		if (zoom.scale < params.minRatio) zoom.scale = params.minRatio + 1 - (params.minRatio - zoom.scale + 1) ** .5;
		gesture.imageEl.style.transform = `translate3d(0,0,0) scale(${zoom.scale})`;
	}
	function onGestureEnd(e) {
		if (!eventWithinSlide(e)) return;
		if (e.pointerType === "mouse" && e.type === "pointerout") return;
		const params = getParams();
		const zoom = swiper.zoom;
		const pointerIndex = evCache.findIndex((cachedEv) => cachedEv.pointerId === e.pointerId);
		if (pointerIndex >= 0) evCache.splice(pointerIndex, 1);
		if (!fakeGestureTouched || !fakeGestureMoved) return;
		fakeGestureTouched = false;
		fakeGestureMoved = false;
		if (!gesture.imageEl) return;
		zoom.scale = Math.max(Math.min(zoom.scale, gesture.maxRatio), params.minRatio);
		gesture.imageEl.style.transitionDuration = `${swiper.params.speed}ms`;
		gesture.imageEl.style.transform = `translate3d(0,0,0) scale(${zoom.scale})`;
		currentScale = zoom.scale;
		isScaling = false;
		if (zoom.scale > 1 && gesture.slideEl) gesture.slideEl.classList.add(`${params.zoomedSlideClass}`);
		else if (zoom.scale <= 1 && gesture.slideEl) gesture.slideEl.classList.remove(`${params.zoomedSlideClass}`);
		if (zoom.scale === 1) {
			gesture.originX = 0;
			gesture.originY = 0;
			gesture.slideEl = void 0;
		}
	}
	let allowTouchMoveTimeout;
	function allowTouchMove() {
		swiper.touchEventsData.preventTouchMoveFromPointerMove = false;
	}
	function preventTouchMove() {
		if (allowTouchMoveTimeout !== void 0) clearTimeout(allowTouchMoveTimeout);
		swiper.touchEventsData.preventTouchMoveFromPointerMove = true;
		allowTouchMoveTimeout = setTimeout(() => {
			if (swiper.destroyed) return;
			allowTouchMove();
		});
	}
	function onTouchStart(e) {
		const device = swiper.device;
		if (!gesture.imageEl) return;
		if (image.isTouched) return;
		if (device.android && e.cancelable) e.preventDefault();
		image.isTouched = true;
		const event = evCache.length > 0 ? evCache[0] : e;
		image.touchesStart.x = event.pageX;
		image.touchesStart.y = event.pageY;
	}
	function onTouchMove(e) {
		const isMousePan = e.pointerType === "mouse" && getParams().panOnMouseMove;
		if (!eventWithinSlide(e) || !eventWithinZoomContainer(e)) return;
		const zoom = swiper.zoom;
		if (!gesture.imageEl) return;
		if (!image.isTouched || !gesture.slideEl) {
			if (isMousePan) onMouseMove(e);
			return;
		}
		if (isMousePan) {
			onMouseMove(e);
			return;
		}
		if (!image.isMoved) {
			image.width = gesture.imageEl.offsetWidth || gesture.imageEl.clientWidth;
			image.height = gesture.imageEl.offsetHeight || gesture.imageEl.clientHeight;
			image.startX = getTranslate(gesture.imageWrapEl, "x") || 0;
			image.startY = getTranslate(gesture.imageWrapEl, "y") || 0;
			gesture.slideWidth = gesture.slideEl.offsetWidth;
			gesture.slideHeight = gesture.slideEl.offsetHeight;
			gesture.imageWrapEl.style.transitionDuration = "0ms";
		}
		const scaledWidth = image.width * zoom.scale;
		const scaledHeight = image.height * zoom.scale;
		image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
		image.maxX = -image.minX;
		image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
		image.maxY = -image.minY;
		image.touchesCurrent.x = evCache.length > 0 ? evCache[0].pageX : e.pageX;
		image.touchesCurrent.y = evCache.length > 0 ? evCache[0].pageY : e.pageY;
		if (Math.max(Math.abs(image.touchesCurrent.x - (image.touchesStart.x ?? 0)), Math.abs(image.touchesCurrent.y - (image.touchesStart.y ?? 0))) > 5) swiper.allowClick = false;
		const startX = image.startX ?? 0;
		const startY = image.startY ?? 0;
		if (!image.isMoved && !isScaling) {
			if (swiper.isHorizontal() && (Math.floor(image.minX) === Math.floor(startX) && image.touchesCurrent.x < (image.touchesStart.x ?? 0) || Math.floor(image.maxX) === Math.floor(startX) && image.touchesCurrent.x > (image.touchesStart.x ?? 0))) {
				image.isTouched = false;
				allowTouchMove();
				return;
			}
			if (!swiper.isHorizontal() && (Math.floor(image.minY) === Math.floor(startY) && image.touchesCurrent.y < (image.touchesStart.y ?? 0) || Math.floor(image.maxY) === Math.floor(startY) && image.touchesCurrent.y > (image.touchesStart.y ?? 0))) {
				image.isTouched = false;
				allowTouchMove();
				return;
			}
		}
		if (e.cancelable) e.preventDefault();
		e.stopPropagation();
		preventTouchMove();
		image.isMoved = true;
		const scaleRatio = (zoom.scale - currentScale) / (gesture.maxRatio - getParams().minRatio);
		const { originX, originY } = gesture;
		image.currentX = image.touchesCurrent.x - (image.touchesStart.x ?? 0) + startX + scaleRatio * (image.width - originX * 2);
		image.currentY = image.touchesCurrent.y - (image.touchesStart.y ?? 0) + startY + scaleRatio * (image.height - originY * 2);
		if (image.currentX < image.minX) image.currentX = image.minX + 1 - (image.minX - image.currentX + 1) ** .8;
		if (image.currentX > image.maxX) image.currentX = image.maxX - 1 + (image.currentX - image.maxX + 1) ** .8;
		if (image.currentY < image.minY) image.currentY = image.minY + 1 - (image.minY - image.currentY + 1) ** .8;
		if (image.currentY > image.maxY) image.currentY = image.maxY - 1 + (image.currentY - image.maxY + 1) ** .8;
		if (!velocity.prevPositionX) velocity.prevPositionX = image.touchesCurrent.x;
		if (!velocity.prevPositionY) velocity.prevPositionY = image.touchesCurrent.y;
		if (!velocity.prevTime) velocity.prevTime = Date.now();
		velocity.x = (image.touchesCurrent.x - velocity.prevPositionX) / (Date.now() - velocity.prevTime) / 2;
		velocity.y = (image.touchesCurrent.y - velocity.prevPositionY) / (Date.now() - velocity.prevTime) / 2;
		if (Math.abs(image.touchesCurrent.x - velocity.prevPositionX) < 2) velocity.x = 0;
		if (Math.abs(image.touchesCurrent.y - velocity.prevPositionY) < 2) velocity.y = 0;
		velocity.prevPositionX = image.touchesCurrent.x;
		velocity.prevPositionY = image.touchesCurrent.y;
		velocity.prevTime = Date.now();
		gesture.imageWrapEl.style.transform = `translate3d(${image.currentX}px, ${image.currentY}px,0)`;
	}
	function onTouchEnd() {
		const zoom = swiper.zoom;
		evCache.length = 0;
		if (!gesture.imageEl) return;
		if (!image.isTouched || !image.isMoved) {
			image.isTouched = false;
			image.isMoved = false;
			return;
		}
		image.isTouched = false;
		image.isMoved = false;
		let momentumDurationX = 300;
		let momentumDurationY = 300;
		const velocityX = velocity.x ?? 0;
		const velocityY = velocity.y ?? 0;
		const momentumDistanceX = velocityX * momentumDurationX;
		const newPositionX = image.currentX + momentumDistanceX;
		const momentumDistanceY = velocityY * momentumDurationY;
		const newPositionY = image.currentY + momentumDistanceY;
		if (velocityX !== 0) momentumDurationX = Math.abs((newPositionX - image.currentX) / velocityX);
		if (velocityY !== 0) momentumDurationY = Math.abs((newPositionY - image.currentY) / velocityY);
		const momentumDuration = Math.max(momentumDurationX, momentumDurationY);
		image.currentX = newPositionX;
		image.currentY = newPositionY;
		const scaledWidth = image.width * zoom.scale;
		const scaledHeight = image.height * zoom.scale;
		image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
		image.maxX = -image.minX;
		image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
		image.maxY = -image.minY;
		image.currentX = Math.max(Math.min(image.currentX, image.maxX), image.minX);
		image.currentY = Math.max(Math.min(image.currentY, image.maxY), image.minY);
		gesture.imageWrapEl.style.transitionDuration = `${momentumDuration}ms`;
		gesture.imageWrapEl.style.transform = `translate3d(${image.currentX}px, ${image.currentY}px,0)`;
	}
	function onTransitionEnd() {
		const zoom = swiper.zoom;
		if (gesture.slideEl && swiper.activeIndex !== swiper.slides.indexOf(gesture.slideEl)) {
			if (gesture.imageEl) gesture.imageEl.style.transform = "translate3d(0,0,0) scale(1)";
			if (gesture.imageWrapEl) gesture.imageWrapEl.style.transform = "translate3d(0,0,0)";
			gesture.slideEl.classList.remove(`${getParams().zoomedSlideClass}`);
			zoom.scale = 1;
			currentScale = 1;
			gesture.slideEl = void 0;
			gesture.imageEl = void 0;
			gesture.imageWrapEl = void 0;
			gesture.originX = 0;
			gesture.originY = 0;
		}
	}
	function onMouseMove(e) {
		if (currentScale <= 1 || !gesture.imageWrapEl) return;
		if (!eventWithinSlide(e) || !eventWithinZoomContainer(e)) return;
		const currentTransform = window.getComputedStyle(gesture.imageWrapEl).transform;
		const matrix = new window.DOMMatrix(currentTransform);
		if (!isPanningWithMouse) {
			isPanningWithMouse = true;
			mousePanStart.x = e.clientX;
			mousePanStart.y = e.clientY;
			image.startX = matrix.e;
			image.startY = matrix.f;
			image.width = gesture.imageEl.offsetWidth || gesture.imageEl.clientWidth;
			image.height = gesture.imageEl.offsetHeight || gesture.imageEl.clientHeight;
			gesture.slideWidth = gesture.slideEl.offsetWidth;
			gesture.slideHeight = gesture.slideEl.offsetHeight;
			return;
		}
		const deltaX = (e.clientX - mousePanStart.x) * mousePanSensitivity;
		const deltaY = (e.clientY - mousePanStart.y) * mousePanSensitivity;
		const scaledWidth = image.width * currentScale;
		const scaledHeight = image.height * currentScale;
		const slideWidth = gesture.slideWidth;
		const slideHeight = gesture.slideHeight;
		const minX = Math.min(slideWidth / 2 - scaledWidth / 2, 0);
		const maxX = -minX;
		const minY = Math.min(slideHeight / 2 - scaledHeight / 2, 0);
		const maxY = -minY;
		const newX = Math.max(Math.min(image.startX + deltaX, maxX), minX);
		const newY = Math.max(Math.min(image.startY + deltaY, maxY), minY);
		gesture.imageWrapEl.style.transitionDuration = "0ms";
		gesture.imageWrapEl.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
		mousePanStart.x = e.clientX;
		mousePanStart.y = e.clientY;
		image.startX = newX;
		image.startY = newY;
		image.currentX = newX;
		image.currentY = newY;
	}
	function zoomIn(e) {
		const zoom = swiper.zoom;
		const params = getParams();
		if (!gesture.slideEl) {
			if (e && typeof e !== "number" && "target" in e && e.target) gesture.slideEl = e.target.closest(`.${swiper.params.slideClass}, swiper-slide`) ?? void 0;
			if (!gesture.slideEl) {
				const virtual = swiper.params.virtual;
				if (virtual && virtual.enabled && swiper.virtual) gesture.slideEl = elementChildren(swiper.slidesEl, `.${swiper.params.slideActiveClass}`)[0] ?? void 0;
				else gesture.slideEl = swiper.slides[swiper.activeIndex];
			}
			let imageEl = gesture.slideEl?.querySelector(`.${params.containerClass}`) ?? null;
			if (imageEl) imageEl = imageEl.querySelectorAll("picture, img, svg, canvas, .swiper-zoom-target")[0] ?? null;
			gesture.imageEl = imageEl ?? void 0;
			if (imageEl) gesture.imageWrapEl = elementParents(imageEl, `.${params.containerClass}`)[0] ?? void 0;
			else gesture.imageWrapEl = void 0;
		}
		if (!gesture.imageEl || !gesture.imageWrapEl || !gesture.slideEl) return;
		gesture.maxRatio = getMaxRatio();
		if (swiper.params.cssMode) {
			swiper.wrapperEl.style.overflow = "hidden";
			swiper.wrapperEl.style.touchAction = "none";
		}
		gesture.slideEl.classList.add(`${params.zoomedSlideClass}`);
		let touchX;
		let touchY;
		let offsetX;
		let offsetY;
		let diffX;
		let diffY;
		let translateX;
		let translateY;
		let imageWidth;
		let imageHeight;
		let scaledWidth;
		let scaledHeight;
		let translateMinX;
		let translateMinY;
		let translateMaxX;
		let translateMaxY;
		let slideWidth;
		let slideHeight;
		const eventIsPointer = e && typeof e !== "number";
		if (typeof image.touchesStart.x === "undefined" && eventIsPointer) {
			touchX = e.pageX;
			touchY = e.pageY;
		} else {
			touchX = image.touchesStart.x;
			touchY = image.touchesStart.y;
		}
		const prevScale = currentScale;
		const forceZoomRatio = typeof e === "number" ? e : null;
		if (currentScale === 1 && forceZoomRatio) {
			touchX = void 0;
			touchY = void 0;
			image.touchesStart.x = void 0;
			image.touchesStart.y = void 0;
		}
		const maxRatio = getMaxRatio();
		zoom.scale = forceZoomRatio || maxRatio;
		currentScale = forceZoomRatio || maxRatio;
		if (e && !(currentScale === 1 && forceZoomRatio)) {
			slideWidth = gesture.slideEl.offsetWidth;
			slideHeight = gesture.slideEl.offsetHeight;
			offsetX = elementOffset(gesture.slideEl).left + window.scrollX;
			offsetY = elementOffset(gesture.slideEl).top + window.scrollY;
			diffX = offsetX + slideWidth / 2 - (touchX ?? 0);
			diffY = offsetY + slideHeight / 2 - (touchY ?? 0);
			imageWidth = gesture.imageEl.offsetWidth || gesture.imageEl.clientWidth;
			imageHeight = gesture.imageEl.offsetHeight || gesture.imageEl.clientHeight;
			scaledWidth = imageWidth * zoom.scale;
			scaledHeight = imageHeight * zoom.scale;
			translateMinX = Math.min(slideWidth / 2 - scaledWidth / 2, 0);
			translateMinY = Math.min(slideHeight / 2 - scaledHeight / 2, 0);
			translateMaxX = -translateMinX;
			translateMaxY = -translateMinY;
			if (prevScale > 0 && forceZoomRatio && typeof image.currentX === "number" && typeof image.currentY === "number") {
				translateX = image.currentX * zoom.scale / prevScale;
				translateY = image.currentY * zoom.scale / prevScale;
			} else {
				translateX = diffX * zoom.scale;
				translateY = diffY * zoom.scale;
			}
			if (translateX < translateMinX) translateX = translateMinX;
			if (translateX > translateMaxX) translateX = translateMaxX;
			if (translateY < translateMinY) translateY = translateMinY;
			if (translateY > translateMaxY) translateY = translateMaxY;
		} else {
			translateX = 0;
			translateY = 0;
		}
		if (forceZoomRatio && zoom.scale === 1) {
			gesture.originX = 0;
			gesture.originY = 0;
		}
		image.currentX = translateX;
		image.currentY = translateY;
		gesture.imageWrapEl.style.transitionDuration = "300ms";
		gesture.imageWrapEl.style.transform = `translate3d(${translateX}px, ${translateY}px,0)`;
		gesture.imageEl.style.transitionDuration = "300ms";
		gesture.imageEl.style.transform = `translate3d(0,0,0) scale(${zoom.scale})`;
	}
	function zoomOut() {
		const zoom = swiper.zoom;
		const params = getParams();
		if (!gesture.slideEl) {
			const virtual = swiper.params.virtual;
			if (virtual && virtual.enabled && swiper.virtual) gesture.slideEl = elementChildren(swiper.slidesEl, `.${swiper.params.slideActiveClass}`)[0] ?? void 0;
			else gesture.slideEl = swiper.slides[swiper.activeIndex];
			let imageEl = gesture.slideEl?.querySelector(`.${params.containerClass}`) ?? null;
			if (imageEl) imageEl = imageEl.querySelectorAll("picture, img, svg, canvas, .swiper-zoom-target")[0] ?? null;
			gesture.imageEl = imageEl ?? void 0;
			if (imageEl) gesture.imageWrapEl = elementParents(imageEl, `.${params.containerClass}`)[0] ?? void 0;
			else gesture.imageWrapEl = void 0;
		}
		if (!gesture.imageEl || !gesture.imageWrapEl || !gesture.slideEl) return;
		gesture.maxRatio = getMaxRatio();
		if (swiper.params.cssMode) {
			swiper.wrapperEl.style.overflow = "";
			swiper.wrapperEl.style.touchAction = "";
		}
		zoom.scale = 1;
		currentScale = 1;
		image.currentX = void 0;
		image.currentY = void 0;
		image.touchesStart.x = void 0;
		image.touchesStart.y = void 0;
		gesture.imageWrapEl.style.transitionDuration = "300ms";
		gesture.imageWrapEl.style.transform = "translate3d(0,0,0)";
		gesture.imageEl.style.transitionDuration = "300ms";
		gesture.imageEl.style.transform = "translate3d(0,0,0) scale(1)";
		gesture.slideEl.classList.remove(`${params.zoomedSlideClass}`);
		gesture.slideEl = void 0;
		gesture.originX = 0;
		gesture.originY = 0;
		if (params.panOnMouseMove) {
			mousePanStart = {
				x: 0,
				y: 0
			};
			if (isPanningWithMouse) {
				isPanningWithMouse = false;
				image.startX = 0;
				image.startY = 0;
			}
		}
	}
	function zoomToggle(e) {
		const zoom = swiper.zoom;
		if (zoom.scale && zoom.scale !== 1) zoomOut();
		else zoomIn(e);
	}
	function getListeners() {
		return {
			passiveListener: swiper.params.passiveListeners ? {
				passive: true,
				capture: false
			} : false,
			activeListenerWithCapture: swiper.params.passiveListeners ? {
				passive: false,
				capture: true
			} : true
		};
	}
	function enable() {
		const zoom = swiper.zoom;
		if (zoom.enabled) return;
		zoom.enabled = true;
		const { passiveListener, activeListenerWithCapture } = getListeners();
		swiper.wrapperEl.addEventListener("pointerdown", onGestureStart, passiveListener);
		swiper.wrapperEl.addEventListener("pointermove", onGestureChange, activeListenerWithCapture);
		[
			"pointerup",
			"pointercancel",
			"pointerout"
		].forEach((eventName) => {
			swiper.wrapperEl.addEventListener(eventName, onGestureEnd, passiveListener);
		});
		swiper.wrapperEl.addEventListener("pointermove", onTouchMove, activeListenerWithCapture);
	}
	function disable() {
		const zoom = swiper.zoom;
		if (!zoom.enabled) return;
		zoom.enabled = false;
		const { passiveListener, activeListenerWithCapture } = getListeners();
		swiper.wrapperEl.removeEventListener("pointerdown", onGestureStart, passiveListener);
		swiper.wrapperEl.removeEventListener("pointermove", onGestureChange, activeListenerWithCapture);
		[
			"pointerup",
			"pointercancel",
			"pointerout"
		].forEach((eventName) => {
			swiper.wrapperEl.removeEventListener(eventName, onGestureEnd, passiveListener);
		});
		swiper.wrapperEl.removeEventListener("pointermove", onTouchMove, activeListenerWithCapture);
	}
	on("init", () => {
		if (getParams().enabled) enable();
	});
	on("destroy", () => {
		disable();
	});
	on("touchStart", (_s, e) => {
		if (!swiper.zoom.enabled) return;
		onTouchStart(e);
	});
	on("touchEnd", () => {
		if (!swiper.zoom.enabled) return;
		onTouchEnd();
	});
	on("doubleTap", (_s, e) => {
		if (!swiper.animating && getParams().enabled && swiper.zoom.enabled && getParams().toggle) zoomToggle(e);
	});
	on("transitionEnd", () => {
		if (swiper.zoom.enabled && getParams().enabled) onTransitionEnd();
	});
	on("slideChange", () => {
		if (swiper.zoom.enabled && getParams().enabled && swiper.params.cssMode) onTransitionEnd();
	});
	Object.assign(swiper.zoom, {
		enable,
		disable,
		in: zoomIn,
		out: zoomOut,
		toggle: zoomToggle
	});
};
//#endregion
//#region node_modules/swiper/modules/a11y.mjs
var isVirtualEnabled = (swiper) => !!swiper.virtual && !!swiper.params.virtual?.enabled;
var A11y = ({ swiper, extendParams, on }) => {
	extendParams({ a11y: {
		enabled: true,
		notificationClass: "swiper-notification",
		prevSlideMessage: "Previous slide",
		nextSlideMessage: "Next slide",
		firstSlideMessage: "This is the first slide",
		lastSlideMessage: "This is the last slide",
		paginationBulletMessage: "Go to slide {{index}}",
		slideLabelMessage: "{{index}} / {{slidesLength}}",
		containerMessage: null,
		containerRoleDescriptionMessage: null,
		containerRole: null,
		itemRoleDescriptionMessage: null,
		slideRole: "group",
		id: null,
		scrollOnFocus: true,
		wrapperLiveRegion: true
	} });
	swiper.a11y = { clicked: false };
	let liveRegion = null;
	let preventFocusHandler = false;
	let focusTargetSlideEl;
	let visibilityChangedTimestamp = (/* @__PURE__ */ new Date()).getTime();
	function getParams() {
		return swiper.params.a11y;
	}
	function notify(message) {
		const notification = liveRegion;
		if (!notification || !message) return;
		setInnerHTML(notification, message);
	}
	function getRandomNumber(size = 16) {
		const randomChar = () => Math.round(16 * Math.random()).toString(16);
		return "x".repeat(size).replace(/x/g, randomChar);
	}
	function makeElFocusable(el) {
		makeElementsArray(el).forEach((subEl) => {
			subEl.setAttribute("tabIndex", "0");
		});
	}
	function makeElNotFocusable(el) {
		makeElementsArray(el).forEach((subEl) => {
			subEl.setAttribute("tabIndex", "-1");
		});
	}
	function addElRole(el, role) {
		makeElementsArray(el).forEach((subEl) => {
			subEl.setAttribute("role", role);
		});
	}
	function addElRoleDescription(el, description) {
		makeElementsArray(el).forEach((subEl) => {
			subEl.setAttribute("aria-roledescription", description);
		});
	}
	function addElLabel(el, label) {
		makeElementsArray(el).forEach((subEl) => {
			subEl.setAttribute("aria-label", label);
		});
	}
	function addElId(el, id) {
		makeElementsArray(el).forEach((subEl) => {
			subEl.setAttribute("id", id);
		});
	}
	function addElLive(el, live) {
		makeElementsArray(el).forEach((subEl) => {
			subEl.setAttribute("aria-live", live);
		});
	}
	function disableEl(el) {
		makeElementsArray(el).forEach((subEl) => {
			subEl.setAttribute("aria-disabled", "true");
		});
	}
	function enableEl(el) {
		makeElementsArray(el).forEach((subEl) => {
			subEl.removeAttribute("aria-disabled");
		});
	}
	function onEnterOrSpaceKey(e) {
		if (e.keyCode !== 13 && e.keyCode !== 32) return;
		const params = getParams();
		const paginationParams = swiper.params.pagination;
		const targetEl = e.target;
		if (swiper.pagination && swiper.pagination.el && (targetEl === swiper.pagination.el || swiper.pagination.el.contains(targetEl))) {
			if (!targetEl.matches(classesToSelector(paginationParams?.bulletClass))) return;
		}
		if (swiper.navigation && swiper.navigation.prevEl && swiper.navigation.nextEl) {
			const prevEls = makeElementsArray(swiper.navigation.prevEl);
			if (makeElementsArray(swiper.navigation.nextEl).includes(targetEl)) {
				if (!(swiper.isEnd && !swiper.params.loop)) swiper.slideNext();
				if (swiper.isEnd) notify(params.lastSlideMessage);
				else notify(params.nextSlideMessage);
			}
			if (prevEls.includes(targetEl)) {
				if (!(swiper.isBeginning && !swiper.params.loop)) swiper.slidePrev();
				if (swiper.isBeginning) notify(params.firstSlideMessage);
				else notify(params.prevSlideMessage);
			}
		}
		if (swiper.pagination && targetEl.matches(classesToSelector(paginationParams?.bulletClass))) targetEl.click();
	}
	function updateNavigation() {
		if (swiper.params.loop || swiper.params.rewind || !swiper.navigation) return;
		const { nextEl, prevEl } = swiper.navigation;
		if (prevEl) if (swiper.isBeginning) {
			disableEl(prevEl);
			makeElNotFocusable(prevEl);
		} else {
			enableEl(prevEl);
			makeElFocusable(prevEl);
		}
		if (nextEl) if (swiper.isEnd) {
			disableEl(nextEl);
			makeElNotFocusable(nextEl);
		} else {
			enableEl(nextEl);
			makeElFocusable(nextEl);
		}
	}
	function hasPagination() {
		return !!(swiper.pagination && swiper.pagination.bullets && swiper.pagination.bullets.length);
	}
	function hasClickablePagination() {
		const paginationParams = swiper.params.pagination;
		return hasPagination() && !!paginationParams?.clickable;
	}
	function updatePagination() {
		const params = getParams();
		if (!hasPagination()) return;
		const paginationParams = swiper.params.pagination;
		swiper.pagination.bullets.forEach((bulletEl) => {
			if (paginationParams.clickable) {
				makeElFocusable(bulletEl);
				if (!paginationParams.renderBullet) {
					addElRole(bulletEl, "button");
					addElLabel(bulletEl, params.paginationBulletMessage.replace(/\{\{index\}\}/, String((elementIndex(bulletEl) ?? 0) + 1)));
				}
			}
			if (bulletEl.matches(classesToSelector(paginationParams.bulletActiveClass))) bulletEl.setAttribute("aria-current", "true");
			else bulletEl.removeAttribute("aria-current");
		});
	}
	const initNavEl = (el, _wrapperId, message) => {
		makeElFocusable(el);
		if (el.tagName !== "BUTTON") {
			addElRole(el, "button");
			el.addEventListener("keydown", onEnterOrSpaceKey);
		}
		addElLabel(el, message);
	};
	const handlePointerDown = (e) => {
		if (focusTargetSlideEl && focusTargetSlideEl !== e.target && !focusTargetSlideEl.contains(e.target)) preventFocusHandler = true;
		swiper.a11y.clicked = true;
	};
	const handlePointerUp = () => {
		preventFocusHandler = false;
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				if (!swiper.destroyed) swiper.a11y.clicked = false;
			});
		});
	};
	const onVisibilityChange = (_e) => {
		visibilityChangedTimestamp = (/* @__PURE__ */ new Date()).getTime();
	};
	const handleFocus = (e) => {
		const params = getParams();
		if (swiper.a11y.clicked || !params.scrollOnFocus) return;
		if ((/* @__PURE__ */ new Date()).getTime() - visibilityChangedTimestamp < 100) return;
		const slideEl = e.target.closest(`.${swiper.params.slideClass}, swiper-slide`);
		if (!slideEl || !swiper.slides.includes(slideEl)) return;
		focusTargetSlideEl = slideEl;
		const isVirtual = isVirtualEnabled(swiper);
		const isActive = (isVirtual ? parseInt(slideEl.getAttribute("data-swiper-slide-index") || "0", 10) : swiper.slides.indexOf(slideEl)) === swiper.activeIndex;
		const isVisible = swiper.params.watchSlidesProgress && swiper.visibleSlides && swiper.visibleSlides.includes(slideEl);
		if (isActive || isVisible) return;
		const sourceCapabilities = e.sourceCapabilities;
		if (sourceCapabilities && sourceCapabilities.firesTouchEvents) return;
		if (swiper.isHorizontal()) swiper.el.scrollLeft = 0;
		else swiper.el.scrollTop = 0;
		requestAnimationFrame(() => {
			if (preventFocusHandler) return;
			if (swiper.params.loop) swiper.slideToLoop(swiper.getSlideIndexWhenGrid(parseInt(slideEl.getAttribute("data-swiper-slide-index") || "0", 10)), 0);
			else if (isVirtual) swiper.slideTo(swiper.getSlideIndexWhenGrid(parseInt(slideEl.getAttribute("data-swiper-slide-index") || "0", 10)), 0);
			else swiper.slideTo(swiper.getSlideIndexWhenGrid(swiper.slides.indexOf(slideEl)), 0);
			preventFocusHandler = false;
		});
	};
	const initSlides = () => {
		const params = getParams();
		if (params.itemRoleDescriptionMessage) addElRoleDescription(swiper.slides, params.itemRoleDescriptionMessage);
		if (params.slideRole) addElRole(swiper.slides, params.slideRole);
		const slidesLength = swiper.slides.length;
		const slideLabelMessage = params.slideLabelMessage;
		if (slideLabelMessage) swiper.slides.forEach((slideEl, index) => {
			const slideIndex = swiper.params.loop ? parseInt(slideEl.getAttribute("data-swiper-slide-index") || "0", 10) : index;
			addElLabel(slideEl, slideLabelMessage.replace(/\{\{index\}\}/, String(slideIndex + 1)).replace(/\{\{slidesLength\}\}/, String(slidesLength)));
		});
	};
	const init = () => {
		const params = getParams();
		if (liveRegion) swiper.el.append(liveRegion);
		const containerEl = swiper.el;
		if (params.containerRoleDescriptionMessage) addElRoleDescription(containerEl, params.containerRoleDescriptionMessage);
		if (params.containerMessage) addElLabel(containerEl, params.containerMessage);
		if (params.containerRole) addElRole(containerEl, params.containerRole);
		const wrapperEl = swiper.wrapperEl;
		const wrapperId = String(params.id || wrapperEl.getAttribute("id") || `swiper-wrapper-${getRandomNumber(16)}`);
		addElId(wrapperEl, wrapperId);
		if (params.wrapperLiveRegion) {
			const autoplayParams = swiper.params.autoplay;
			addElLive(wrapperEl, swiper.params.autoplay && autoplayParams?.enabled ? "off" : "polite");
		}
		initSlides();
		const nav = swiper.navigation ? swiper.navigation : {
			nextEl: void 0,
			prevEl: void 0
		};
		const nextEls = makeElementsArray(nav.nextEl);
		const prevEls = makeElementsArray(nav.prevEl);
		if (nextEls) nextEls.forEach((el) => initNavEl(el, wrapperId, params.nextSlideMessage));
		if (prevEls) prevEls.forEach((el) => initNavEl(el, wrapperId, params.prevSlideMessage));
		if (hasClickablePagination()) makeElementsArray(swiper.pagination.el).forEach((el) => {
			el.addEventListener("keydown", onEnterOrSpaceKey);
		});
		document.addEventListener("visibilitychange", onVisibilityChange);
		swiper.el.addEventListener("focus", handleFocus, true);
		swiper.el.addEventListener("pointerdown", handlePointerDown, true);
		swiper.el.addEventListener("pointerup", handlePointerUp, true);
	};
	function destroy() {
		if (liveRegion) liveRegion.remove();
		const nav = swiper.navigation ? swiper.navigation : {
			nextEl: void 0,
			prevEl: void 0
		};
		const nextEls = makeElementsArray(nav.nextEl);
		const prevEls = makeElementsArray(nav.prevEl);
		if (nextEls) nextEls.forEach((el) => el.removeEventListener("keydown", onEnterOrSpaceKey));
		if (prevEls) prevEls.forEach((el) => el.removeEventListener("keydown", onEnterOrSpaceKey));
		if (hasClickablePagination()) makeElementsArray(swiper.pagination.el).forEach((el) => {
			el.removeEventListener("keydown", onEnterOrSpaceKey);
		});
		document.removeEventListener("visibilitychange", onVisibilityChange);
		if (swiper.el && typeof swiper.el !== "string") {
			swiper.el.removeEventListener("focus", handleFocus, true);
			swiper.el.removeEventListener("pointerdown", handlePointerDown, true);
			swiper.el.removeEventListener("pointerup", handlePointerUp, true);
		}
	}
	on("beforeInit", () => {
		liveRegion = createElement("span", getParams().notificationClass);
		liveRegion.setAttribute("aria-live", "assertive");
		liveRegion.setAttribute("aria-atomic", "true");
	});
	on("afterInit", () => {
		if (!getParams().enabled) return;
		init();
	});
	on("slidesLengthChange snapGridLengthChange slidesGridLengthChange", () => {
		if (!getParams().enabled) return;
		initSlides();
	});
	on("fromEdge toEdge afterInit lock unlock", () => {
		if (!getParams().enabled) return;
		updateNavigation();
	});
	on("paginationUpdate", () => {
		if (!getParams().enabled) return;
		updatePagination();
	});
	on("destroy", () => {
		if (!getParams().enabled) return;
		destroy();
	});
};
//#endregion
//#region node_modules/swiper/modules/autoplay.mjs
var Autoplay = ({ swiper, extendParams, on, emit, params }) => {
	swiper.autoplay = {
		running: false,
		paused: false,
		timeLeft: 0
	};
	extendParams({ autoplay: {
		enabled: false,
		delay: 3e3,
		waitForTransition: true,
		disableOnInteraction: false,
		stopOnLastSlide: false,
		reverseDirection: false,
		pauseOnMouseEnter: false
	} });
	function getParams() {
		return swiper.params.autoplay;
	}
	const initialAutoplayDelay = typeof params.autoplay === "object" && params.autoplay && typeof params.autoplay.delay === "number" ? params.autoplay.delay : 3e3;
	let timeout;
	let raf;
	let autoplayDelayTotal = initialAutoplayDelay;
	let autoplayDelayCurrent = initialAutoplayDelay;
	let autoplayTimeLeft = 0;
	let autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
	let wasPaused = false;
	let isTouched = false;
	let pausedByTouch = false;
	let touchStartTimeout;
	let pausedByInteraction = false;
	let pausedByPointerEnter = false;
	function onTransitionEnd(e) {
		if (!swiper || swiper.destroyed || !swiper.wrapperEl) return;
		if (e.target !== swiper.wrapperEl) return;
		swiper.wrapperEl.removeEventListener("transitionend", onTransitionEnd);
		const detail = e.detail;
		if (pausedByPointerEnter || detail && detail.bySwiperTouchMove) return;
		resume();
	}
	const calcTimeLeft = () => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		if (swiper.autoplay.paused) wasPaused = true;
		else if (wasPaused) {
			autoplayDelayCurrent = autoplayTimeLeft;
			wasPaused = false;
		}
		const timeLeft = swiper.autoplay.paused ? autoplayTimeLeft : autoplayStartTime + autoplayDelayCurrent - (/* @__PURE__ */ new Date()).getTime();
		swiper.autoplay.timeLeft = timeLeft;
		emit("autoplayTimeLeft", timeLeft, timeLeft / autoplayDelayTotal);
		raf = requestAnimationFrame(() => {
			calcTimeLeft();
		});
	};
	const getSlideDelay = () => {
		let activeSlideEl;
		const virtualEnabled = !!swiper.params.virtual?.enabled;
		if (swiper.virtual && virtualEnabled) activeSlideEl = swiper.slides.find((slideEl) => slideEl.classList.contains("swiper-slide-active"));
		else activeSlideEl = swiper.slides[swiper.activeIndex];
		if (!activeSlideEl) return void 0;
		const attr = activeSlideEl.getAttribute("data-swiper-autoplay");
		if (attr == null) return void 0;
		return parseInt(attr, 10);
	};
	const getTotalDelay = () => {
		let totalDelay = getParams().delay;
		const currentSlideDelay = getSlideDelay();
		if (typeof currentSlideDelay === "number" && !Number.isNaN(currentSlideDelay) && currentSlideDelay > 0) totalDelay = currentSlideDelay;
		return totalDelay;
	};
	const run = (delayForce) => {
		if (swiper.destroyed || !swiper.autoplay.running) return 0;
		if (raf !== void 0) cancelAnimationFrame(raf);
		calcTimeLeft();
		let delay = delayForce;
		if (typeof delay === "undefined") {
			delay = getTotalDelay();
			autoplayDelayTotal = delay;
			autoplayDelayCurrent = delay;
		}
		autoplayTimeLeft = delay;
		const speed = swiper.params.speed;
		const proceed = () => {
			if (!swiper || swiper.destroyed) return;
			const autoplayParams = getParams();
			if (autoplayParams.reverseDirection) {
				if (!swiper.isBeginning || swiper.params.loop || swiper.params.rewind) {
					swiper.slidePrev(speed, true, true);
					emit("autoplay");
				} else if (!autoplayParams.stopOnLastSlide) {
					swiper.slideTo(swiper.slides.length - 1, speed, true, true);
					emit("autoplay");
				}
			} else if (!swiper.isEnd || swiper.params.loop || swiper.params.rewind) {
				swiper.slideNext(speed, true, true);
				emit("autoplay");
			} else if (!autoplayParams.stopOnLastSlide) {
				swiper.slideTo(0, speed, true, true);
				emit("autoplay");
			}
			if (swiper.params.cssMode) {
				autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
				requestAnimationFrame(() => {
					run();
				});
			}
		};
		if (delay > 0) {
			if (timeout !== void 0) clearTimeout(timeout);
			timeout = setTimeout(() => {
				proceed();
			}, delay);
		} else requestAnimationFrame(() => {
			proceed();
		});
		return delay;
	};
	const start = () => {
		autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
		swiper.autoplay.running = true;
		run();
		emit("autoplayStart");
		return true;
	};
	const stop = () => {
		swiper.autoplay.running = false;
		if (timeout !== void 0) clearTimeout(timeout);
		if (raf !== void 0) cancelAnimationFrame(raf);
		emit("autoplayStop");
		return true;
	};
	const pause = (internal, reset) => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		if (timeout !== void 0) clearTimeout(timeout);
		if (!internal) pausedByInteraction = true;
		const proceed = () => {
			emit("autoplayPause");
			if (getParams().waitForTransition) swiper.wrapperEl.addEventListener("transitionend", onTransitionEnd);
			else resume();
		};
		swiper.autoplay.paused = true;
		if (reset) {
			proceed();
			return;
		}
		autoplayTimeLeft = (autoplayTimeLeft || getParams().delay) - ((/* @__PURE__ */ new Date()).getTime() - autoplayStartTime);
		if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop) return;
		if (autoplayTimeLeft < 0) autoplayTimeLeft = 0;
		proceed();
	};
	const resume = () => {
		if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop || swiper.destroyed || !swiper.autoplay.running) return;
		autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
		if (pausedByInteraction) {
			pausedByInteraction = false;
			run(autoplayTimeLeft);
		} else run();
		swiper.autoplay.paused = false;
		emit("autoplayResume");
	};
	const onVisibilityChange = () => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		if (document.visibilityState === "hidden") {
			pausedByInteraction = true;
			pause(true);
		}
		if (document.visibilityState === "visible") resume();
	};
	const onPointerEnter = (e) => {
		if (e.pointerType !== "mouse") return;
		pausedByInteraction = true;
		pausedByPointerEnter = true;
		if (swiper.animating || swiper.autoplay.paused) return;
		pause(true);
	};
	const onPointerLeave = (e) => {
		if (e.pointerType !== "mouse") return;
		pausedByPointerEnter = false;
		if (swiper.autoplay.paused) resume();
	};
	const attachMouseEvents = () => {
		if (getParams().pauseOnMouseEnter) {
			swiper.el.addEventListener("pointerenter", onPointerEnter);
			swiper.el.addEventListener("pointerleave", onPointerLeave);
		}
	};
	const detachMouseEvents = () => {
		if (swiper.el && typeof swiper.el !== "string") {
			swiper.el.removeEventListener("pointerenter", onPointerEnter);
			swiper.el.removeEventListener("pointerleave", onPointerLeave);
		}
	};
	const attachDocumentEvents = () => {
		document.addEventListener("visibilitychange", onVisibilityChange);
	};
	const detachDocumentEvents = () => {
		document.removeEventListener("visibilitychange", onVisibilityChange);
	};
	on("init", () => {
		if (getParams().enabled) {
			attachMouseEvents();
			attachDocumentEvents();
			start();
		}
	});
	on("destroy", () => {
		detachMouseEvents();
		detachDocumentEvents();
		if (swiper.autoplay.running) stop();
	});
	on("_freeModeStaticRelease", () => {
		if (pausedByTouch || pausedByInteraction) resume();
	});
	on("_freeModeNoMomentumRelease", () => {
		if (!getParams().disableOnInteraction) pause(true, true);
		else stop();
	});
	on("beforeTransitionStart", (_s, _speed, internal) => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		if (internal || !getParams().disableOnInteraction) pause(true, true);
		else stop();
	});
	on("sliderFirstMove", () => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		if (getParams().disableOnInteraction) {
			stop();
			return;
		}
		isTouched = true;
		pausedByTouch = false;
		pausedByInteraction = false;
		touchStartTimeout = setTimeout(() => {
			pausedByInteraction = true;
			pausedByTouch = true;
			pause(true);
		}, 200);
	});
	on("touchEnd", () => {
		if (swiper.destroyed || !swiper.autoplay.running || !isTouched) return;
		if (touchStartTimeout !== void 0) clearTimeout(touchStartTimeout);
		if (timeout !== void 0) clearTimeout(timeout);
		if (getParams().disableOnInteraction) {
			pausedByTouch = false;
			isTouched = false;
			return;
		}
		if (pausedByTouch && swiper.params.cssMode) resume();
		pausedByTouch = false;
		isTouched = false;
	});
	on("slideChange", () => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		if (swiper.autoplay.paused) {
			autoplayTimeLeft = getTotalDelay();
			autoplayDelayTotal = getTotalDelay();
		}
	});
	Object.assign(swiper.autoplay, {
		start,
		stop,
		pause,
		resume
	});
};
//#endregion
//#region node_modules/swiper/modules/thumbs.mjs
var Thumb = ({ swiper, extendParams, on }) => {
	extendParams({ thumbs: {
		swiper: null,
		multipleActiveThumbs: true,
		autoScrollOffset: 0,
		slideThumbActiveClass: "swiper-slide-thumb-active",
		thumbsContainerClass: "swiper-thumbs"
	} });
	let initialized = false;
	let swiperCreated = false;
	swiper.thumbs = { swiper: null };
	function getParams() {
		return swiper.params.thumbs;
	}
	function isVirtualEnabled() {
		const thumbsSwiper = swiper.thumbs.swiper;
		if (!thumbsSwiper || thumbsSwiper.destroyed) return false;
		const virtual = thumbsSwiper.params.virtual;
		return !!virtual && !!virtual.enabled;
	}
	function onThumbClick() {
		const thumbsSwiper = swiper.thumbs.swiper;
		if (!thumbsSwiper || thumbsSwiper.destroyed) return;
		const clickedIndex = thumbsSwiper.clickedIndex;
		const clickedSlide = thumbsSwiper.clickedSlide;
		const thumbsParams = getParams();
		if (clickedSlide && clickedSlide.classList.contains(thumbsParams.slideThumbActiveClass)) return;
		if (typeof clickedIndex === "undefined" || clickedIndex === null) return;
		let slideToIndex;
		if (thumbsSwiper.params.loop) {
			const attr = thumbsSwiper.clickedSlide?.getAttribute("data-swiper-slide-index");
			slideToIndex = attr == null ? clickedIndex : parseInt(attr, 10);
		} else slideToIndex = clickedIndex;
		if (swiper.params.loop) swiper.slideToLoop(slideToIndex);
		else swiper.slideTo(slideToIndex);
	}
	function init() {
		const thumbsParams = getParams();
		if (initialized) return false;
		initialized = true;
		const SwiperClass = swiper.constructor;
		if (thumbsParams.swiper instanceof SwiperClass) {
			if (thumbsParams.swiper.destroyed) {
				initialized = false;
				return false;
			}
			const thumbsSwiper = thumbsParams.swiper;
			swiper.thumbs.swiper = thumbsSwiper;
			Object.assign(thumbsSwiper.originalParams, {
				watchSlidesProgress: true,
				slideToClickedSlide: false
			});
			Object.assign(thumbsSwiper.params, {
				watchSlidesProgress: true,
				slideToClickedSlide: false
			});
			thumbsSwiper.update();
		} else if (isObject$1(thumbsParams.swiper)) {
			const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
			Object.assign(thumbsSwiperParams, {
				watchSlidesProgress: true,
				slideToClickedSlide: false
			});
			swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams);
			swiperCreated = true;
		}
		const thumbsSwiper = swiper.thumbs.swiper;
		if (!thumbsSwiper) return false;
		thumbsSwiper.el.classList.add(thumbsParams.thumbsContainerClass);
		thumbsSwiper.on("tap", onThumbClick);
		if (isVirtualEnabled()) thumbsSwiper.on("virtualUpdate", () => {
			update(false, { autoScroll: false });
		});
		return true;
	}
	function update(initial, p) {
		const thumbsSwiper = swiper.thumbs.swiper;
		if (!thumbsSwiper || thumbsSwiper.destroyed) return;
		let thumbsToActivate = 1;
		const thumbsParams = getParams();
		const thumbActiveClass = thumbsParams.slideThumbActiveClass;
		const slidesPerView = swiper.params.slidesPerView;
		if (typeof slidesPerView === "number" && slidesPerView > 1 && !swiper.params.centeredSlides) thumbsToActivate = slidesPerView;
		if (!thumbsParams.multipleActiveThumbs) thumbsToActivate = 1;
		thumbsToActivate = Math.floor(thumbsToActivate);
		thumbsSwiper.slides.forEach((slideEl) => slideEl.classList.remove(thumbActiveClass));
		if (thumbsSwiper.params.loop || isVirtualEnabled()) for (let i = 0; i < thumbsToActivate; i += 1) elementChildren(thumbsSwiper.slidesEl, `[data-swiper-slide-index="${swiper.realIndex + i}"]`).forEach((slideEl) => {
			slideEl.classList.add(thumbActiveClass);
		});
		else for (let i = 0; i < thumbsToActivate; i += 1) {
			const slide = thumbsSwiper.slides[swiper.realIndex + i];
			if (slide) slide.classList.add(thumbActiveClass);
		}
		if (p?.autoScroll ?? true) autoScroll(initial ? 0 : void 0);
	}
	function autoScroll(slideSpeed) {
		const thumbsSwiper = swiper.thumbs.swiper;
		if (!thumbsSwiper || thumbsSwiper.destroyed) return;
		const thumbsSlidesPerView = thumbsSwiper.params.slidesPerView;
		const slidesPerView = thumbsSlidesPerView === "auto" ? thumbsSwiper.slidesPerViewDynamic() : thumbsSlidesPerView ?? 1;
		const autoScrollOffset = getParams().autoScrollOffset;
		const useOffset = autoScrollOffset && !thumbsSwiper.params.loop;
		if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
			const currentThumbsIndex = thumbsSwiper.activeIndex;
			let newThumbsIndex;
			let direction;
			if (thumbsSwiper.params.loop) {
				const newThumbsSlide = thumbsSwiper.slides.find((slideEl) => slideEl.getAttribute("data-swiper-slide-index") === `${swiper.realIndex}`);
				newThumbsIndex = newThumbsSlide ? thumbsSwiper.slides.indexOf(newThumbsSlide) : -1;
				direction = swiper.activeIndex > swiper.previousIndex ? "next" : "prev";
			} else {
				newThumbsIndex = swiper.realIndex;
				direction = newThumbsIndex > swiper.previousIndex ? "next" : "prev";
			}
			if (useOffset) newThumbsIndex += direction === "next" ? autoScrollOffset : -1 * autoScrollOffset;
			if (thumbsSwiper.visibleSlidesIndexes && thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0) {
				if (thumbsSwiper.params.centeredSlides) if (newThumbsIndex > currentThumbsIndex) newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1;
				else newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1;
				else if (newThumbsIndex > currentThumbsIndex && thumbsSwiper.params.slidesPerGroup === 1);
				thumbsSwiper.slideTo(newThumbsIndex, slideSpeed);
			}
		}
	}
	on("beforeInit", () => {
		const thumbs = swiper.params.thumbs;
		if (!thumbs || !thumbs.swiper) return;
		if (typeof thumbs.swiper === "string" || thumbs.swiper instanceof HTMLElement) {
			const getThumbsElementAndInit = () => {
				const thumbsElement = typeof thumbs.swiper === "string" ? document.querySelector(thumbs.swiper) : thumbs.swiper;
				if (thumbsElement && thumbsElement.swiper) {
					thumbs.swiper = thumbsElement.swiper;
					init();
					update(true);
				} else if (thumbsElement) {
					const eventName = `${swiper.params.eventsPrefix}init`;
					const onThumbsSwiper = (e) => {
						const detail = e.detail;
						thumbs.swiper = detail[0];
						thumbsElement.removeEventListener(eventName, onThumbsSwiper);
						init();
						update(true);
						thumbs.swiper.update();
						swiper.update();
					};
					thumbsElement.addEventListener(eventName, onThumbsSwiper);
				}
				return thumbsElement;
			};
			const watchForThumbsToAppear = () => {
				if (swiper.destroyed) return;
				if (!getThumbsElementAndInit()) requestAnimationFrame(watchForThumbsToAppear);
			};
			requestAnimationFrame(watchForThumbsToAppear);
		} else {
			init();
			update(true);
		}
	});
	on("slideChange update resize observerUpdate", () => {
		update();
	});
	on("setTransition", (_s, duration) => {
		const thumbsSwiper = swiper.thumbs.swiper;
		if (!thumbsSwiper || thumbsSwiper.destroyed) return;
		thumbsSwiper.setTransition(duration);
	});
	on("beforeDestroy", () => {
		const thumbsSwiper = swiper.thumbs.swiper;
		if (!thumbsSwiper || thumbsSwiper.destroyed) return;
		if (swiperCreated) thumbsSwiper.destroy();
	});
	Object.assign(swiper.thumbs, {
		init,
		update
	});
};
//#endregion
//#region node_modules/swiper/modules/free-mode.mjs
var FreeMode = ({ swiper, extendParams, emit, once }) => {
	extendParams({ freeMode: {
		enabled: false,
		momentum: true,
		momentumRatio: 1,
		momentumBounce: true,
		momentumBounceRatio: 1,
		momentumVelocityRatio: 1,
		sticky: false,
		minimumVelocity: .02
	} });
	function getParams() {
		return swiper.params.freeMode;
	}
	function onTouchStart() {
		if (swiper.params.cssMode) return;
		const translate = swiper.getTranslate();
		swiper.setTranslate(translate);
		swiper.setTransition(0);
		swiper.touchEventsData.velocities.length = 0;
		swiper.freeMode.onTouchEnd({ currentPos: swiper.rtl ? swiper.translate : -swiper.translate });
	}
	function onTouchMove() {
		if (swiper.params.cssMode) return;
		const { touchEventsData: data, touches } = swiper;
		if (data.velocities.length === 0) data.velocities.push({
			position: touches[swiper.isHorizontal() ? "startX" : "startY"],
			time: data.touchStartTime ?? now()
		});
		data.velocities.push({
			position: touches[swiper.isHorizontal() ? "currentX" : "currentY"],
			time: now()
		});
	}
	function onTouchEnd({ currentPos }) {
		if (swiper.params.cssMode) return;
		const { wrapperEl, rtlTranslate: rtl, snapGrid, touchEventsData: data } = swiper;
		const params = swiper.params;
		const freeModeParams = getParams();
		const touchEndTime = now();
		const timeDiff = touchEndTime - (data.touchStartTime ?? touchEndTime);
		if (currentPos < -swiper.minTranslate()) {
			swiper.slideTo(swiper.activeIndex);
			return;
		}
		if (currentPos > -swiper.maxTranslate()) {
			if (swiper.slides.length < snapGrid.length) swiper.slideTo(snapGrid.length - 1);
			else swiper.slideTo(swiper.slides.length - 1);
			return;
		}
		if (freeModeParams.momentum) {
			if (data.velocities.length > 1) {
				const lastMoveEvent = data.velocities.pop();
				const velocityEvent = data.velocities.pop();
				const distance = lastMoveEvent.position - velocityEvent.position;
				const time = lastMoveEvent.time - velocityEvent.time;
				swiper.velocity = distance / time;
				swiper.velocity /= 2;
				if (Math.abs(swiper.velocity) < freeModeParams.minimumVelocity) swiper.velocity = 0;
				if (time > 150 || now() - lastMoveEvent.time > 300) swiper.velocity = 0;
			} else swiper.velocity = 0;
			swiper.velocity *= freeModeParams.momentumVelocityRatio;
			data.velocities.length = 0;
			let momentumDuration = 1e3 * freeModeParams.momentumRatio;
			const momentumDistance = swiper.velocity * momentumDuration;
			let newPosition = swiper.translate + momentumDistance;
			if (rtl) newPosition = -newPosition;
			let doBounce = false;
			let afterBouncePosition;
			const bounceAmount = Math.abs(swiper.velocity) * 20 * freeModeParams.momentumBounceRatio;
			let needsLoopFix = false;
			if (newPosition < swiper.maxTranslate()) {
				if (freeModeParams.momentumBounce) {
					if (newPosition + swiper.maxTranslate() < -bounceAmount) newPosition = swiper.maxTranslate() - bounceAmount;
					afterBouncePosition = swiper.maxTranslate();
					doBounce = true;
					data.allowMomentumBounce = true;
				} else newPosition = swiper.maxTranslate();
				if (params.loop && params.centeredSlides) needsLoopFix = true;
			} else if (newPosition > swiper.minTranslate()) {
				if (freeModeParams.momentumBounce) {
					if (newPosition - swiper.minTranslate() > bounceAmount) newPosition = swiper.minTranslate() + bounceAmount;
					afterBouncePosition = swiper.minTranslate();
					doBounce = true;
					data.allowMomentumBounce = true;
				} else newPosition = swiper.minTranslate();
				if (params.loop && params.centeredSlides) needsLoopFix = true;
			} else if (freeModeParams.sticky) {
				let nextSlide = 0;
				for (let j = 0; j < snapGrid.length; j += 1) if (snapGrid[j] > -newPosition) {
					nextSlide = j;
					break;
				}
				if (Math.abs(snapGrid[nextSlide] - newPosition) < Math.abs((snapGrid[nextSlide - 1] ?? snapGrid[nextSlide]) - newPosition) || swiper.swipeDirection === "next") newPosition = snapGrid[nextSlide];
				else newPosition = snapGrid[nextSlide - 1];
				newPosition = -newPosition;
			}
			if (needsLoopFix) once("transitionEnd", () => {
				swiper.loopFix();
			});
			if (swiper.velocity !== 0) {
				if (rtl) momentumDuration = Math.abs((-newPosition - swiper.translate) / swiper.velocity);
				else momentumDuration = Math.abs((newPosition - swiper.translate) / swiper.velocity);
				if (freeModeParams.sticky) {
					const moveDistance = Math.abs((rtl ? -newPosition : newPosition) - swiper.translate);
					const currentSlideSize = swiper.slidesSizesGrid[swiper.activeIndex];
					const speed = params.speed;
					if (moveDistance < currentSlideSize) momentumDuration = speed;
					else if (moveDistance < 2 * currentSlideSize) momentumDuration = speed * 1.5;
					else momentumDuration = speed * 2.5;
				}
			} else if (freeModeParams.sticky) {
				swiper.slideToClosest();
				return;
			}
			if (freeModeParams.momentumBounce && doBounce && afterBouncePosition !== void 0) {
				swiper.updateProgress(afterBouncePosition);
				swiper.setTransition(momentumDuration);
				swiper.setTranslate(newPosition);
				swiper.transitionStart(true, swiper.swipeDirection);
				swiper.animating = true;
				elementTransitionEnd(wrapperEl, () => {
					if (!swiper || swiper.destroyed || !data.allowMomentumBounce) return;
					emit("momentumBounce");
					swiper.setTransition(params.speed);
					setTimeout(() => {
						swiper.setTranslate(afterBouncePosition);
						elementTransitionEnd(wrapperEl, () => {
							if (!swiper || swiper.destroyed) return;
							swiper.transitionEnd();
						});
					}, 0);
				});
			} else if (swiper.velocity) {
				emit("_freeModeNoMomentumRelease");
				swiper.updateProgress(newPosition);
				swiper.setTransition(momentumDuration);
				swiper.setTranslate(newPosition);
				swiper.transitionStart(true, swiper.swipeDirection);
				if (!swiper.animating) {
					swiper.animating = true;
					elementTransitionEnd(wrapperEl, () => {
						if (!swiper || swiper.destroyed) return;
						swiper.transitionEnd();
					});
				}
			} else swiper.updateProgress(newPosition);
			swiper.updateActiveIndex();
			swiper.updateSlidesClasses();
		} else if (freeModeParams.sticky) {
			swiper.slideToClosest();
			return;
		} else emit("_freeModeNoMomentumRelease");
		if (!freeModeParams.momentum || timeDiff >= params.longSwipesMs) {
			emit("_freeModeStaticRelease");
			swiper.updateProgress();
			swiper.updateActiveIndex();
			swiper.updateSlidesClasses();
		}
	}
	swiper.freeMode = {
		onTouchStart,
		onTouchMove,
		onTouchEnd
	};
};
//#endregion
//#region node_modules/swiper/modules/grid.mjs
var Grid = ({ swiper, extendParams, on }) => {
	extendParams({ grid: {
		rows: 1,
		fill: "column"
	} });
	function getParams() {
		return swiper.params.grid;
	}
	let slidesNumberEvenToRows;
	let slidesPerRow;
	let numFullColumns;
	let wasMultiRow;
	const getSpaceBetween = () => {
		let spaceBetween = swiper.params.spaceBetween ?? 0;
		if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiper.size;
		else if (typeof spaceBetween === "string") spaceBetween = parseFloat(spaceBetween);
		return spaceBetween;
	};
	const isVirtualEnabled = () => {
		const virtualParams = swiper.params.virtual;
		return !!swiper.virtual && typeof virtualParams === "object" && virtualParams !== null && !!virtualParams.enabled;
	};
	const initSlides = (slides) => {
		const { slidesPerView } = swiper.params;
		const { rows, fill } = getParams();
		const slidesLength = isVirtualEnabled() ? swiper.virtual.slides.length : slides.length;
		numFullColumns = Math.floor(slidesLength / rows);
		if (Math.floor(slidesLength / rows) === slidesLength / rows) slidesNumberEvenToRows = slidesLength;
		else slidesNumberEvenToRows = Math.ceil(slidesLength / rows) * rows;
		if (slidesPerView !== "auto" && fill === "row") slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, Math.floor(slidesPerView ?? 1) * rows);
		slidesPerRow = slidesNumberEvenToRows / rows;
	};
	const unsetSlides = () => {
		if (swiper.slides) swiper.slides.forEach((slide) => {
			if (slide.swiperSlideGridSet) {
				slide.style.height = "";
				slide.style.setProperty(swiper.getDirectionLabel("margin-top"), "");
			}
		});
	};
	const updateSlide = (i, slide, slides) => {
		const { slidesPerGroup } = swiper.params;
		const spaceBetween = getSpaceBetween();
		const { rows, fill } = getParams();
		const slidesLength = isVirtualEnabled() ? swiper.virtual.slides.length : slides.length;
		let newSlideOrderIndex;
		let column;
		let row;
		if (fill === "row" && (slidesPerGroup ?? 1) > 1) {
			const groupsPer = slidesPerGroup ?? 1;
			const groupIndex = Math.floor(i / (groupsPer * rows));
			const slideIndexInGroup = i - rows * groupsPer * groupIndex;
			const columnsInGroup = groupIndex === 0 ? groupsPer : Math.min(Math.ceil((slidesLength - groupIndex * rows * groupsPer) / rows), groupsPer);
			row = Math.floor(slideIndexInGroup / columnsInGroup);
			column = slideIndexInGroup - row * columnsInGroup + groupIndex * groupsPer;
			newSlideOrderIndex = column + row * slidesNumberEvenToRows / rows;
			slide.style.order = String(newSlideOrderIndex);
		} else if (fill === "column") {
			column = Math.floor(i / rows);
			row = i - column * rows;
			if (column > numFullColumns || column === numFullColumns && row === rows - 1) {
				row += 1;
				if (row >= rows) {
					row = 0;
					column += 1;
				}
			}
		} else {
			row = Math.floor(i / slidesPerRow);
			column = i - row * slidesPerRow;
		}
		const gridSlide = slide;
		gridSlide.row = row;
		gridSlide.column = column;
		slide.style.height = `calc((100% - ${(rows - 1) * spaceBetween}px) / ${rows})`;
		slide.style.setProperty(swiper.getDirectionLabel("margin-top"), row !== 0 && spaceBetween ? `${spaceBetween}px` : "");
		gridSlide.swiperSlideGridSet = true;
	};
	const updateWrapperSize = (slideSize, snapGrid) => {
		const { centeredSlides, roundLengths } = swiper.params;
		const spaceBetween = getSpaceBetween();
		const { rows } = getParams();
		swiper.virtualSize = (slideSize + spaceBetween) * slidesNumberEvenToRows;
		swiper.virtualSize = Math.ceil(swiper.virtualSize / rows) - spaceBetween;
		if (!swiper.params.cssMode) swiper.wrapperEl.style.setProperty(swiper.getDirectionLabel("width"), `${swiper.virtualSize + spaceBetween}px`);
		if (centeredSlides) {
			const newSlidesGrid = [];
			for (let i = 0; i < snapGrid.length; i += 1) {
				let slidesGridItem = snapGrid[i];
				if (roundLengths) slidesGridItem = Math.floor(slidesGridItem);
				if (snapGrid[i] < swiper.virtualSize + snapGrid[0]) newSlidesGrid.push(slidesGridItem);
			}
			snapGrid.splice(0, snapGrid.length);
			snapGrid.push(...newSlidesGrid);
		}
	};
	const onInit = () => {
		const gridParams = swiper.params.grid;
		wasMultiRow = !!(gridParams && (gridParams.rows ?? 1) > 1);
	};
	const onUpdate = () => {
		const { params, el } = swiper;
		const gridParams = params.grid;
		const isMultiRow = !!(gridParams && (gridParams.rows ?? 1) > 1);
		if (wasMultiRow && !isMultiRow) {
			el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
			numFullColumns = 1;
			swiper.emitContainerClasses();
		} else if (!wasMultiRow && isMultiRow) {
			el.classList.add(`${params.containerModifierClass}grid`);
			if (gridParams.fill === "column") el.classList.add(`${params.containerModifierClass}grid-column`);
			swiper.emitContainerClasses();
		}
		wasMultiRow = isMultiRow;
	};
	on("init", onInit);
	on("update", onUpdate);
	swiper.grid = {
		initSlides,
		unsetSlides,
		updateSlide,
		updateWrapperSize
	};
};
//#endregion
//#region node_modules/swiper/shared/effect-init.mjs
function effectInit(params) {
	const { effect, swiper, on, setTranslate, setTransition, overwriteParams, perspective, recreateShadows, getEffectParams } = params;
	on("beforeInit", () => {
		if (swiper.params.effect !== effect) return;
		swiper.classNames.push(`${swiper.params.containerModifierClass}${effect}`);
		if (perspective && perspective()) swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
		const overwriteParamsResult = overwriteParams ? overwriteParams() : {};
		Object.assign(swiper.params, overwriteParamsResult);
		Object.assign(swiper.originalParams, overwriteParamsResult);
	});
	on("setTranslate _virtualUpdated", () => {
		if (swiper.params.effect !== effect) return;
		setTranslate();
	});
	on("setTransition", (_s, duration) => {
		if (swiper.params.effect !== effect) return;
		setTransition(duration);
	});
	on("transitionEnd", () => {
		if (swiper.params.effect !== effect) return;
		if (recreateShadows) {
			const effectParams = getEffectParams ? getEffectParams() : void 0;
			if (!effectParams || !effectParams.slideShadows) return;
			swiper.slides.forEach((slideEl) => {
				slideEl.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((shadowEl) => shadowEl.remove());
			});
			recreateShadows();
		}
	});
	let requireUpdateOnVirtual = false;
	on("virtualUpdate", () => {
		if (swiper.params.effect !== effect) return;
		if (!swiper.slides.length) requireUpdateOnVirtual = true;
		requestAnimationFrame(() => {
			if (requireUpdateOnVirtual && swiper.slides && swiper.slides.length) {
				setTranslate();
				requireUpdateOnVirtual = false;
			}
		});
	});
}
//#endregion
//#region node_modules/swiper/shared/effect-target.mjs
function effectTarget(_effectParams, slideEl) {
	const transformEl = getSlideTransformEl(slideEl);
	if (transformEl !== slideEl) {
		transformEl.style.backfaceVisibility = "hidden";
		transformEl.style.setProperty("-webkit-backface-visibility", "hidden");
	}
	return transformEl;
}
//#endregion
//#region node_modules/swiper/shared/effect-virtual-transition-end.mjs
function effectVirtualTransitionEnd({ swiper, duration, transformElements, allSlides }) {
	const { activeIndex } = swiper;
	const getSlide = (el) => {
		if (!el.parentElement) return swiper.slides.find((slideEl) => slideEl.shadowRoot && slideEl.shadowRoot === el.parentNode);
		if (el.parentElement instanceof HTMLElement) return el.parentElement;
	};
	if (swiper.params.virtualTranslate && duration !== 0) {
		let eventTriggered = false;
		let transitionEndTarget;
		if (allSlides) transitionEndTarget = transformElements;
		else transitionEndTarget = transformElements.filter((transformEl) => {
			const el = transformEl.classList.contains("swiper-slide-transform") ? getSlide(transformEl) : transformEl;
			return !!el && swiper.getSlideIndex(el) === activeIndex;
		});
		transitionEndTarget.forEach((el) => {
			elementTransitionEnd(el, () => {
				if (eventTriggered) return;
				if (!swiper || swiper.destroyed) return;
				eventTriggered = true;
				swiper.animating = false;
				const evt = new CustomEvent("transitionend", {
					bubbles: true,
					cancelable: true
				});
				swiper.wrapperEl.dispatchEvent(evt);
			});
		});
	}
}
//#endregion
//#region node_modules/swiper/modules/effect-fade.mjs
var EffectFade = ({ swiper, extendParams, on }) => {
	extendParams({ fadeEffect: { crossFade: false } });
	function getParams() {
		return swiper.params.fadeEffect;
	}
	const setTranslate = () => {
		const { slides } = swiper;
		const params = getParams();
		for (let i = 0; i < slides.length; i += 1) {
			const slideEl = slides[i];
			let tx = -(slideEl.swiperSlideOffset ?? 0);
			if (!swiper.params.virtualTranslate) tx -= swiper.translate;
			let ty = 0;
			if (!swiper.isHorizontal()) {
				ty = tx;
				tx = 0;
			}
			const slideProgress = slideEl.progress ?? 0;
			const slideOpacity = params.crossFade ? Math.max(1 - Math.abs(slideProgress), 0) : 1 + Math.min(Math.max(slideProgress, -1), 0);
			const targetEl = effectTarget(params, slideEl);
			targetEl.style.opacity = String(slideOpacity);
			targetEl.style.transform = `translate3d(${tx}px, ${ty}px, 0px)`;
		}
	};
	const setTransition = (duration) => {
		const transformElements = swiper.slides.map((slideEl) => getSlideTransformEl(slideEl));
		transformElements.forEach((el) => {
			el.style.transitionDuration = `${duration}ms`;
		});
		effectVirtualTransitionEnd({
			swiper,
			duration,
			transformElements,
			allSlides: true
		});
	};
	effectInit({
		effect: "fade",
		swiper,
		on,
		setTranslate,
		setTransition,
		overwriteParams: () => ({
			slidesPerView: 1,
			slidesPerGroup: 1,
			watchSlidesProgress: true,
			spaceBetween: 0,
			virtualTranslate: !swiper.params.cssMode
		})
	});
};
//#endregion
//#region node_modules/swiper/modules/effect-cube.mjs
var EffectCube = ({ swiper, extendParams, on }) => {
	extendParams({ cubeEffect: {
		slideShadows: true,
		shadow: true,
		shadowOffset: 20,
		shadowScale: .94
	} });
	function getParams() {
		return swiper.params.cubeEffect;
	}
	const createSlideShadows = (slideEl, progress, isHorizontal) => {
		let shadowBefore = isHorizontal ? slideEl.querySelector(".swiper-slide-shadow-left") : slideEl.querySelector(".swiper-slide-shadow-top");
		let shadowAfter = isHorizontal ? slideEl.querySelector(".swiper-slide-shadow-right") : slideEl.querySelector(".swiper-slide-shadow-bottom");
		if (!shadowBefore) {
			shadowBefore = createElement("div", `swiper-slide-shadow-cube swiper-slide-shadow-${isHorizontal ? "left" : "top"}`.split(" "));
			slideEl.append(shadowBefore);
		}
		if (!shadowAfter) {
			shadowAfter = createElement("div", `swiper-slide-shadow-cube swiper-slide-shadow-${isHorizontal ? "right" : "bottom"}`.split(" "));
			slideEl.append(shadowAfter);
		}
		if (shadowBefore) shadowBefore.style.opacity = String(Math.max(-progress, 0));
		if (shadowAfter) shadowAfter.style.opacity = String(Math.max(progress, 0));
	};
	const recreateShadows = () => {
		const isHorizontal = swiper.isHorizontal();
		swiper.slides.forEach((slideEl) => {
			const progress = Math.max(Math.min(slideEl.progress ?? 0, 1), -1);
			createSlideShadows(slideEl, progress, isHorizontal);
		});
	};
	const setTranslate = () => {
		const { el, wrapperEl, slides, width: swiperWidth, height: swiperHeight, rtlTranslate: rtl, size: swiperSize } = swiper;
		const r = getRotateFix(swiper);
		const params = getParams();
		const isHorizontal = swiper.isHorizontal();
		const isVirtual = !!(swiper.virtual && swiper.params.virtual?.enabled);
		let wrapperRotate = 0;
		let cubeShadowEl = null;
		if (params.shadow) if (isHorizontal) {
			cubeShadowEl = swiper.wrapperEl.querySelector(".swiper-cube-shadow");
			if (!cubeShadowEl) {
				cubeShadowEl = createElement("div", "swiper-cube-shadow");
				swiper.wrapperEl.append(cubeShadowEl);
			}
			cubeShadowEl.style.height = `${swiperWidth}px`;
		} else {
			cubeShadowEl = el.querySelector(".swiper-cube-shadow");
			if (!cubeShadowEl) {
				cubeShadowEl = createElement("div", "swiper-cube-shadow");
				el.append(cubeShadowEl);
			}
		}
		for (let i = 0; i < slides.length; i += 1) {
			const slideEl = slides[i];
			let slideIndex = i;
			if (isVirtual) slideIndex = parseInt(slideEl.getAttribute("data-swiper-slide-index") ?? "0", 10);
			let slideAngle = slideIndex * 90;
			let round = Math.floor(slideAngle / 360);
			if (rtl) {
				slideAngle = -slideAngle;
				round = Math.floor(-slideAngle / 360);
			}
			const progress = Math.max(Math.min(slideEl.progress ?? 0, 1), -1);
			let tx = 0;
			let ty = 0;
			let tz = 0;
			if (slideIndex % 4 === 0) {
				tx = -round * 4 * swiperSize;
				tz = 0;
			} else if ((slideIndex - 1) % 4 === 0) {
				tx = 0;
				tz = -round * 4 * swiperSize;
			} else if ((slideIndex - 2) % 4 === 0) {
				tx = swiperSize + round * 4 * swiperSize;
				tz = swiperSize;
			} else if ((slideIndex - 3) % 4 === 0) {
				tx = -swiperSize;
				tz = 3 * swiperSize + swiperSize * 4 * round;
			}
			if (rtl) tx = -tx;
			if (!isHorizontal) {
				ty = tx;
				tx = 0;
			}
			const transform = `rotateX(${r(isHorizontal ? 0 : -slideAngle)}deg) rotateY(${r(isHorizontal ? slideAngle : 0)}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;
			if (progress <= 1 && progress > -1) {
				wrapperRotate = slideIndex * 90 + progress * 90;
				if (rtl) wrapperRotate = -slideIndex * 90 - progress * 90;
			}
			slideEl.style.transform = transform;
			if (params.slideShadows) createSlideShadows(slideEl, progress, isHorizontal);
		}
		wrapperEl.style.transformOrigin = `50% 50% -${swiperSize / 2}px`;
		wrapperEl.style.setProperty("-webkit-transform-origin", `50% 50% -${swiperSize / 2}px`);
		if (params.shadow && cubeShadowEl) if (isHorizontal) cubeShadowEl.style.transform = `translate3d(0px, ${swiperWidth / 2 + params.shadowOffset}px, ${-swiperWidth / 2}px) rotateX(89.99deg) rotateZ(0deg) scale(${params.shadowScale})`;
		else {
			const shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
			const multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
			const scale1 = params.shadowScale;
			const scale2 = params.shadowScale / multiplier;
			const offset = params.shadowOffset;
			cubeShadowEl.style.transform = `scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${swiperHeight / 2 + offset}px, ${-swiperHeight / 2 / scale2}px) rotateX(-89.99deg)`;
		}
		wrapperEl.style.transform = `translate3d(0px,0,0px) rotateX(${r(swiper.isHorizontal() ? 0 : wrapperRotate)}deg) rotateY(${r(swiper.isHorizontal() ? -wrapperRotate : 0)}deg)`;
		wrapperEl.style.setProperty("--swiper-cube-translate-z", "0px");
	};
	const setTransition = (duration) => {
		const { el, slides } = swiper;
		slides.forEach((slideEl) => {
			slideEl.style.transitionDuration = `${duration}ms`;
			slideEl.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((subEl) => {
				subEl.style.transitionDuration = `${duration}ms`;
			});
		});
		if (swiper.params.cubeEffect?.shadow && !swiper.isHorizontal()) {
			const shadowEl = el.querySelector(".swiper-cube-shadow");
			if (shadowEl) shadowEl.style.transitionDuration = `${duration}ms`;
		}
	};
	effectInit({
		effect: "cube",
		swiper,
		on,
		setTranslate,
		setTransition,
		recreateShadows,
		getEffectParams: () => swiper.params.cubeEffect,
		perspective: () => true,
		overwriteParams: () => ({
			slidesPerView: 1,
			slidesPerGroup: 1,
			watchSlidesProgress: true,
			resistanceRatio: 0,
			spaceBetween: 0,
			centeredSlides: false,
			virtualTranslate: true
		})
	});
};
//#endregion
//#region node_modules/swiper/shared/create-shadow.mjs
function createShadow(suffix, slideEl, side) {
	const shadowClass = `swiper-slide-shadow${side ? `-${side}` : ""}${suffix ? ` swiper-slide-shadow-${suffix}` : ""}`;
	const shadowContainer = getSlideTransformEl(slideEl);
	const selector = `.${shadowClass.split(" ").join(".")}`;
	const existing = shadowContainer.querySelector(selector);
	if (existing) return existing;
	const created = createElement("div", shadowClass.split(" "));
	shadowContainer.append(created);
	return created;
}
//#endregion
//#region node_modules/swiper/modules/effect-flip.mjs
var EffectFlip = ({ swiper, extendParams, on }) => {
	extendParams({ flipEffect: {
		slideShadows: true,
		limitRotation: true
	} });
	function getParams() {
		return swiper.params.flipEffect;
	}
	const createSlideShadows = (slideEl, progress) => {
		let shadowBefore = swiper.isHorizontal() ? slideEl.querySelector(".swiper-slide-shadow-left") : slideEl.querySelector(".swiper-slide-shadow-top");
		let shadowAfter = swiper.isHorizontal() ? slideEl.querySelector(".swiper-slide-shadow-right") : slideEl.querySelector(".swiper-slide-shadow-bottom");
		if (!shadowBefore) shadowBefore = createShadow("flip", slideEl, swiper.isHorizontal() ? "left" : "top");
		if (!shadowAfter) shadowAfter = createShadow("flip", slideEl, swiper.isHorizontal() ? "right" : "bottom");
		if (shadowBefore) shadowBefore.style.opacity = String(Math.max(-progress, 0));
		if (shadowAfter) shadowAfter.style.opacity = String(Math.max(progress, 0));
	};
	const recreateShadows = () => {
		const params = getParams();
		swiper.slides.forEach((slideEl) => {
			let progress = slideEl.progress ?? 0;
			if (params.limitRotation) progress = Math.max(Math.min(progress, 1), -1);
			createSlideShadows(slideEl, progress);
		});
	};
	const setTranslate = () => {
		const { slides, rtlTranslate: rtl } = swiper;
		const params = getParams();
		const rotateFix = getRotateFix(swiper);
		for (let i = 0; i < slides.length; i += 1) {
			const slideEl = slides[i];
			let progress = slideEl.progress ?? 0;
			if (params.limitRotation) progress = Math.max(Math.min(progress, 1), -1);
			const offset = slideEl.swiperSlideOffset ?? 0;
			let rotateY = -180 * progress;
			let rotateX = 0;
			let tx = swiper.params.cssMode ? -offset - swiper.translate : -offset;
			let ty = 0;
			if (!swiper.isHorizontal()) {
				ty = tx;
				tx = 0;
				rotateX = -rotateY;
				rotateY = 0;
			} else if (rtl) rotateY = -rotateY;
			slideEl.style.zIndex = String(-Math.abs(Math.round(progress)) + slides.length);
			if (params.slideShadows) createSlideShadows(slideEl, progress);
			const transform = `translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateFix(rotateX)}deg) rotateY(${rotateFix(rotateY)}deg)`;
			const targetEl = effectTarget(params, slideEl);
			targetEl.style.transform = transform;
		}
	};
	const setTransition = (duration) => {
		const transformElements = swiper.slides.map((slideEl) => getSlideTransformEl(slideEl));
		transformElements.forEach((el) => {
			el.style.transitionDuration = `${duration}ms`;
			el.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((shadowEl) => {
				shadowEl.style.transitionDuration = `${duration}ms`;
			});
		});
		effectVirtualTransitionEnd({
			swiper,
			duration,
			transformElements
		});
	};
	effectInit({
		effect: "flip",
		swiper,
		on,
		setTranslate,
		setTransition,
		recreateShadows,
		getEffectParams: () => swiper.params.flipEffect,
		perspective: () => true,
		overwriteParams: () => ({
			slidesPerView: 1,
			slidesPerGroup: 1,
			watchSlidesProgress: true,
			spaceBetween: 0,
			virtualTranslate: !swiper.params.cssMode
		})
	});
};
//#endregion
//#region node_modules/swiper/modules/effect-coverflow.mjs
var EffectCoverflow = ({ swiper, extendParams, on }) => {
	extendParams({ coverflowEffect: {
		rotate: 50,
		stretch: 0,
		depth: 100,
		scale: 1,
		modifier: 1,
		slideShadows: true
	} });
	function getParams() {
		return swiper.params.coverflowEffect;
	}
	const setTranslate = () => {
		const { width: swiperWidth, height: swiperHeight, slides, slidesSizesGrid } = swiper;
		const params = getParams();
		const isHorizontal = swiper.isHorizontal();
		const transform = swiper.translate;
		const center = isHorizontal ? -transform + swiperWidth / 2 : -transform + swiperHeight / 2;
		const rotate = isHorizontal ? params.rotate : -params.rotate;
		const translate = params.depth;
		const r = getRotateFix(swiper);
		for (let i = 0, length = slides.length; i < length; i += 1) {
			const slideEl = slides[i];
			const slideSize = slidesSizesGrid[i];
			const centerOffset = (center - (slideEl.swiperSlideOffset ?? 0) - slideSize / 2) / slideSize;
			const offsetMultiplier = typeof params.modifier === "function" ? params.modifier(centerOffset) : centerOffset * params.modifier;
			let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
			let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
			let translateZ = -translate * Math.abs(offsetMultiplier);
			let stretch = typeof params.stretch === "string" && params.stretch.indexOf("%") !== -1 ? parseFloat(params.stretch) / 100 * slideSize : params.stretch;
			let translateY = isHorizontal ? 0 : stretch * offsetMultiplier;
			let translateX = isHorizontal ? stretch * offsetMultiplier : 0;
			let scale = 1 - (1 - params.scale) * Math.abs(offsetMultiplier);
			if (Math.abs(translateX) < .001) translateX = 0;
			if (Math.abs(translateY) < .001) translateY = 0;
			if (Math.abs(translateZ) < .001) translateZ = 0;
			if (Math.abs(rotateY) < .001) rotateY = 0;
			if (Math.abs(rotateX) < .001) rotateX = 0;
			if (Math.abs(scale) < .001) scale = 0;
			const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${r(rotateX)}deg) rotateY(${r(rotateY)}deg) scale(${scale})`;
			const targetEl = effectTarget(params, slideEl);
			targetEl.style.transform = slideTransform;
			slideEl.style.zIndex = String(-Math.abs(Math.round(offsetMultiplier)) + 1);
			if (params.slideShadows) {
				let shadowBeforeEl = isHorizontal ? slideEl.querySelector(".swiper-slide-shadow-left") : slideEl.querySelector(".swiper-slide-shadow-top");
				let shadowAfterEl = isHorizontal ? slideEl.querySelector(".swiper-slide-shadow-right") : slideEl.querySelector(".swiper-slide-shadow-bottom");
				if (!shadowBeforeEl) shadowBeforeEl = createShadow("coverflow", slideEl, isHorizontal ? "left" : "top");
				if (!shadowAfterEl) shadowAfterEl = createShadow("coverflow", slideEl, isHorizontal ? "right" : "bottom");
				if (shadowBeforeEl) shadowBeforeEl.style.opacity = String(offsetMultiplier > 0 ? offsetMultiplier : 0);
				if (shadowAfterEl) shadowAfterEl.style.opacity = String(-offsetMultiplier > 0 ? -offsetMultiplier : 0);
			}
		}
	};
	const setTransition = (duration) => {
		swiper.slides.map((slideEl) => getSlideTransformEl(slideEl)).forEach((el) => {
			el.style.transitionDuration = `${duration}ms`;
			el.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((shadowEl) => {
				shadowEl.style.transitionDuration = `${duration}ms`;
			});
		});
	};
	effectInit({
		effect: "coverflow",
		swiper,
		on,
		setTranslate,
		setTransition,
		perspective: () => true,
		overwriteParams: () => ({ watchSlidesProgress: true })
	});
};
//#endregion
//#region node_modules/swiper/modules/effect-creative.mjs
var EffectCreative = ({ swiper, extendParams, on }) => {
	extendParams({ creativeEffect: {
		limitProgress: 1,
		shadowPerProgress: false,
		progressMultiplier: 1,
		perspective: true,
		prev: {
			translate: [
				0,
				0,
				0
			],
			rotate: [
				0,
				0,
				0
			],
			opacity: 1,
			scale: 1
		},
		next: {
			translate: [
				0,
				0,
				0
			],
			rotate: [
				0,
				0,
				0
			],
			opacity: 1,
			scale: 1
		}
	} });
	function getParams() {
		return swiper.params.creativeEffect;
	}
	const getTranslateValue = (value) => {
		if (typeof value === "string") return value;
		return `${value}px`;
	};
	const setTranslate = () => {
		const { slides, wrapperEl, slidesSizesGrid } = swiper;
		const params = getParams();
		const { progressMultiplier: multiplier } = params;
		const isCenteredSlides = swiper.params.centeredSlides;
		const rotateFix = getRotateFix(swiper);
		if (isCenteredSlides) {
			const margin = slidesSizesGrid[0] / 2 - (swiper.params.slidesOffsetBefore ?? 0);
			wrapperEl.style.transform = `translateX(calc(50% - ${margin}px))`;
		}
		for (let i = 0; i < slides.length; i += 1) {
			const slideEl = slides[i];
			const slideProgress = slideEl.progress ?? 0;
			const progress = Math.min(Math.max(slideProgress, -params.limitProgress), params.limitProgress);
			let originalProgress = progress;
			if (!isCenteredSlides) originalProgress = Math.min(Math.max(slideEl.originalProgress ?? 0, -params.limitProgress), params.limitProgress);
			const offset = slideEl.swiperSlideOffset ?? 0;
			const t = [
				swiper.params.cssMode ? -offset - swiper.translate : -offset,
				0,
				0
			];
			const r = [
				0,
				0,
				0
			];
			let custom = false;
			if (!swiper.isHorizontal()) {
				t[1] = t[0];
				t[0] = 0;
			}
			let data = {
				translate: [
					0,
					0,
					0
				],
				rotate: [
					0,
					0,
					0
				],
				scale: 1,
				opacity: 1
			};
			if (progress < 0) {
				data = params.next;
				custom = true;
			} else if (progress > 0) {
				data = params.prev;
				custom = true;
			}
			t.forEach((value, index) => {
				t[index] = `calc(${value}px + (${getTranslateValue(data.translate[index])} * ${Math.abs(progress * multiplier)}))`;
			});
			r.forEach((_value, index) => {
				r[index] = data.rotate[index] * Math.abs(progress * multiplier);
			});
			slideEl.style.zIndex = String(-Math.abs(Math.round(slideProgress)) + slides.length);
			const translateString = t.join(", ");
			const rotateString = `rotateX(${rotateFix(r[0])}deg) rotateY(${rotateFix(r[1])}deg) rotateZ(${rotateFix(r[2])}deg)`;
			const scaleString = originalProgress < 0 ? `scale(${1 + (1 - data.scale) * originalProgress * multiplier})` : `scale(${1 - (1 - data.scale) * originalProgress * multiplier})`;
			const opacityString = originalProgress < 0 ? 1 + (1 - data.opacity) * originalProgress * multiplier : 1 - (1 - data.opacity) * originalProgress * multiplier;
			const transform = `translate3d(${translateString}) ${rotateString} ${scaleString}`;
			if (custom && data.shadow || !custom) {
				let shadowEl = slideEl.querySelector(".swiper-slide-shadow");
				if (!shadowEl && data.shadow) shadowEl = createShadow("creative", slideEl);
				if (shadowEl) {
					const shadowOpacity = params.shadowPerProgress ? progress * (1 / params.limitProgress) : progress;
					shadowEl.style.opacity = String(Math.min(Math.max(Math.abs(shadowOpacity), 0), 1));
				}
			}
			const targetEl = effectTarget(params, slideEl);
			targetEl.style.transform = transform;
			targetEl.style.opacity = String(opacityString);
			if (data.origin) targetEl.style.transformOrigin = data.origin;
		}
	};
	const setTransition = (duration) => {
		const transformElements = swiper.slides.map((slideEl) => getSlideTransformEl(slideEl));
		transformElements.forEach((el) => {
			el.style.transitionDuration = `${duration}ms`;
			el.querySelectorAll(".swiper-slide-shadow").forEach((shadowEl) => {
				shadowEl.style.transitionDuration = `${duration}ms`;
			});
		});
		effectVirtualTransitionEnd({
			swiper,
			duration,
			transformElements,
			allSlides: true
		});
	};
	effectInit({
		effect: "creative",
		swiper,
		on,
		setTranslate,
		setTransition,
		perspective: () => getParams().perspective,
		overwriteParams: () => ({
			watchSlidesProgress: true,
			virtualTranslate: !swiper.params.cssMode
		})
	});
};
//#endregion
//#region node_modules/swiper/modules/effect-cards.mjs
var EffectCards = ({ swiper, extendParams, on }) => {
	extendParams({ cardsEffect: {
		slideShadows: true,
		rotate: true,
		perSlideRotate: 2,
		perSlideOffset: 8
	} });
	function getParams() {
		return swiper.params.cardsEffect;
	}
	const setTranslate = () => {
		const { slides, activeIndex, rtlTranslate: rtl } = swiper;
		const params = getParams();
		const { startTranslate, isTouched } = swiper.touchEventsData;
		const currentTranslate = rtl ? -swiper.translate : swiper.translate;
		for (let i = 0; i < slides.length; i += 1) {
			const slideEl = slides[i];
			const slideProgress = slideEl.progress ?? 0;
			const progress = Math.min(Math.max(slideProgress, -4), 4);
			let offset = slideEl.swiperSlideOffset ?? 0;
			if (swiper.params.centeredSlides && !swiper.params.cssMode) swiper.wrapperEl.style.transform = `translateX(${swiper.minTranslate()}px)`;
			if (swiper.params.centeredSlides && swiper.params.cssMode) offset -= slides[0].swiperSlideOffset ?? 0;
			let tX = swiper.params.cssMode ? -offset - swiper.translate : -offset;
			let tY = 0;
			const tZ = -100 * Math.abs(progress);
			let scale = 1;
			let rotate = -params.perSlideRotate * progress;
			let tXAdd = params.perSlideOffset - Math.abs(progress) * .75;
			const slideIndex = swiper.virtual && swiper.params.virtual?.enabled ? swiper.virtual.from + i : i;
			const isSwipeToNext = (slideIndex === activeIndex || slideIndex === activeIndex - 1) && progress > 0 && progress < 1 && (isTouched || swiper.params.cssMode) && (currentTranslate ?? 0) < (startTranslate ?? 0);
			const isSwipeToPrev = (slideIndex === activeIndex || slideIndex === activeIndex + 1) && progress < 0 && progress > -1 && (isTouched || swiper.params.cssMode) && (currentTranslate ?? 0) > (startTranslate ?? 0);
			if (isSwipeToNext || isSwipeToPrev) {
				const subProgress = (1 - Math.abs((Math.abs(progress) - .5) / .5)) ** .5;
				rotate += -28 * progress * subProgress;
				scale += -.5 * subProgress;
				tXAdd += 96 * subProgress;
				tY = `${(params.rotate || swiper.isHorizontal() ? -25 : 0) * subProgress * Math.abs(progress)}%`;
			}
			if (progress < 0) tX = `calc(${tX}px ${rtl ? "-" : "+"} (${tXAdd * Math.abs(progress)}%))`;
			else if (progress > 0) tX = `calc(${tX}px ${rtl ? "-" : "+"} (-${tXAdd * Math.abs(progress)}%))`;
			else tX = `${tX}px`;
			if (!swiper.isHorizontal()) {
				const prevY = tY;
				tY = tX;
				tX = prevY;
			}
			const scaleString = progress < 0 ? `${1 + (1 - scale) * progress}` : `${1 - (1 - scale) * progress}`;
			const transform = `
        translate3d(${tX}, ${tY}, ${tZ}px)
        rotateZ(${params.rotate ? rtl ? -rotate : rotate : 0}deg)
        scale(${scaleString})
      `;
			if (params.slideShadows) {
				let shadowEl = slideEl.querySelector(".swiper-slide-shadow");
				if (!shadowEl) shadowEl = createShadow("cards", slideEl);
				if (shadowEl) shadowEl.style.opacity = String(Math.min(Math.max((Math.abs(progress) - .5) / .5, 0), 1));
			}
			slideEl.style.zIndex = String(-Math.abs(Math.round(slideProgress)) + slides.length);
			const targetEl = effectTarget(params, slideEl);
			targetEl.style.transform = transform;
		}
	};
	const setTransition = (duration) => {
		const transformElements = swiper.slides.map((slideEl) => getSlideTransformEl(slideEl));
		transformElements.forEach((el) => {
			el.style.transitionDuration = `${duration}ms`;
			el.querySelectorAll(".swiper-slide-shadow").forEach((shadowEl) => {
				shadowEl.style.transitionDuration = `${duration}ms`;
			});
		});
		effectVirtualTransitionEnd({
			swiper,
			duration,
			transformElements
		});
	};
	effectInit({
		effect: "cards",
		swiper,
		on,
		setTranslate,
		setTransition,
		perspective: () => true,
		overwriteParams: () => ({
			_loopSwapReset: false,
			watchSlidesProgress: true,
			loopAdditionalSlides: getParams().rotate ? 3 : 2,
			centeredSlides: true,
			virtualTranslate: !swiper.params.cssMode
		})
	});
};
//#endregion
export { isSymbol as $, inject as A, unref as B, createBaseVNode as C, createRenderer as D, createElementBlock as E, renderList as F, includeBooleanAttr as G, capitalize as H, watch as I, isFunction as J, invokeArrayFns as K, withCtx as L, onBeforeMount as M, onMounted as N, createTextVNode as O, openBlock as P, isString as Q, withDirectives as R, computed as S, createCommentVNode as T, extend$2 as U, camelize as V, hyphenate as W, isOn as X, isModelListener as Y, isSpecialBooleanAttr as Z, Keyboard as _, EffectCube as a, Fragment as b, FreeMode as c, A11y as d, looseToNumber as et, Zoom as f, Mousewheel as g, Navigation as h, EffectFlip as i, nextTick$1 as j, createVNode as k, Thumb as l, Pagination as m, EffectCreative as n, toDisplayString as nt, EffectFade as o, Scrollbar as p, isArray as q, EffectCoverflow as r, Grid as s, EffectCards as t, normalizeClass as tt, Autoplay as u, Swiper as v, createBlock as w, callWithAsyncErrorHandling as x, SwiperSlide as y, ref as z };

//# sourceMappingURL=vendor-swiper-C4peFqeO.js.map
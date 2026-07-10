import { n as notifyDynamicContentReady, t as bindVidplySwiperLifecycle } from "./vidply-dynamic-content-DiJx1yiX.js";
import { c as nextSlideMessage, f as paginationBulletMessage, g as slideLabelMessage, h as prevSlideMessage, i as firstSlideMessage, m as playAutoplayMessage, o as itemRoleDescriptionMessage, p as pauseAutoplayMessage, s as lastSlideMessage } from "./i18n-CTgK0wgO.js";
import { A as inject, B as unref, C as createBaseVNode, E as createElementBlock, F as renderList, L as withCtx, M as onBeforeMount, N as onMounted, P as openBlock, S as computed, T as createCommentVNode, _ as Keyboard, a as EffectCube, b as Fragment, c as FreeMode, d as A11y, f as Zoom, g as Mousewheel, h as Navigation, i as EffectFlip, j as nextTick, m as Pagination, n as EffectCreative, o as EffectFade, p as Scrollbar, r as EffectCoverflow, s as Grid, t as EffectCards, tt as normalizeClass, u as Autoplay, v as Swiper, w as createBlock, y as SwiperSlide, z as ref } from "./vendor-swiper-C4peFqeO.js";
import { n as bindEqualSwiperSlideHeights, t as bindSwiperEffectParams } from "./swiper-effect-params-CDiahhwm.js";
//#region Assets/Scripts/components/SwiperSlider.vue
var _hoisted_1 = ["innerHTML"];
var _hoisted_2 = {
	key: 1,
	class: "swiper-navigation"
};
var _hoisted_3 = ["data-slider-id", "aria-label"];
var _hoisted_4 = ["data-slider-id"];
var _hoisted_5 = ["data-slider-id", "aria-label"];
var _hoisted_6 = [
	"data-slider-id",
	"aria-label",
	"aria-pressed"
];
var _hoisted_7 = {
	key: 0,
	class: "swiper-navigation-icon",
	width: "11",
	height: "20",
	viewBox: "0 0 11 20",
	fill: "none",
	xmlns: "http://www.w3.org/2000/svg",
	"aria-hidden": "true"
};
var _hoisted_8 = {
	key: 1,
	class: "swiper-navigation-icon",
	width: "11",
	height: "20",
	viewBox: "0 0 11 20",
	fill: "none",
	xmlns: "http://www.w3.org/2000/svg",
	"aria-hidden": "true"
};
var _hoisted_9 = ["data-slider-id"];
var _sfc_main = {
	__name: "SwiperSlider",
	props: {},
	setup(__props) {
		/** TYPO3 mount target injected by vue-initialisation.js (avoids DOM query races). */
		const mountElement = inject("mpcMountElement", null);
		const swiperRef = ref(null);
		const containerRef = ref(null);
		const navigationNextRef = ref(null);
		const navigationPrevRef = ref(null);
		const paginationRef = ref(null);
		const scrollbarRef = ref(null);
		const autoplayPausedByUser = ref(false);
		const slides = ref([]);
		const config = ref({
			effect: "slide",
			slidesPerView: 1,
			spaceBetween: 0,
			slidesPerGroup: 1,
			loop: false,
			speed: 300,
			autoplayEnabled: false,
			autoplayDelay: 3e3,
			autoplayDisableOnInteraction: true,
			navigationEnabled: true,
			paginationEnabled: true,
			paginationType: "bullets",
			paginationClickable: false,
			paginationDynamicBullets: false,
			scrollbarEnabled: false,
			scrollbarDraggable: true,
			keyboardEnabled: true,
			mousewheelEnabled: false,
			freeModeEnabled: false,
			zoomEnabled: false,
			fadeCrossFade: true,
			cubeShadow: true,
			cubeSlideShadows: true,
			coverflowRotate: 50,
			coverflowStretch: 0,
			coverflowDepth: 100,
			coverflowModifier: 1,
			containerClass: "",
			breakpoints: "",
			sliderId: "default"
		});
		/**
		* Parse boolean from string or return boolean
		*/
		function parseBool(value) {
			if (typeof value === "boolean") return value;
			if (typeof value === "string") return value === "1" || value === "true" || value === "yes";
			return false;
		}
		/**
		* Parse number from string or return number
		* Also handles special 'auto' value for slidesPerView
		*/
		function parseNumber(value, defaultValue = 0) {
			if (typeof value === "number") return value;
			if (typeof value === "string") {
				if (value.toLowerCase() === "auto") return "auto";
				const parsed = parseInt(value, 10);
				return isNaN(parsed) ? defaultValue : parsed;
			}
			return defaultValue;
		}
		/**
		* Parse slidesPerView which can be a number or 'auto'
		*/
		function parseSlidesPerView(value, defaultValue = 1) {
			if (typeof value === "number") return value;
			if (typeof value === "string") {
				if (value.toLowerCase() === "auto") return "auto";
				const parsed = parseFloat(value);
				return isNaN(parsed) ? defaultValue : parsed;
			}
			return defaultValue;
		}
		/**
		* Load configuration from data attributes
		* @param {HTMLElement} container - The container element (Vue root)
		*/
		function loadConfig(container) {
			if (!container) return;
			const dataAttrs = container.dataset;
			const slidesPerView = parseSlidesPerView(dataAttrs.slidesPerView, 1);
			const slidesPerGroup = dataAttrs.slidesPerGroup ? parseNumber(dataAttrs.slidesPerGroup, 1) : 1;
			config.value = {
				effect: dataAttrs.effect || "slide",
				slidesPerView,
				spaceBetween: parseNumber(dataAttrs.spaceBetween, 0),
				slidesPerGroup,
				loop: parseBool(dataAttrs.loop),
				speed: parseNumber(dataAttrs.speed, 300),
				autoplayEnabled: parseBool(dataAttrs.autoplayEnabled),
				autoplayDelay: parseNumber(dataAttrs.autoplayDelay, 3e3),
				autoplayDisableOnInteraction: parseBool(dataAttrs.autoplayDisableOnInteraction ?? "1"),
				autoplayPauseOnMouseEnter: parseBool(dataAttrs.autoplayPauseOnMouseEnter),
				navigationEnabled: parseBool(dataAttrs.navigationEnabled ?? "1"),
				paginationEnabled: parseBool(dataAttrs.paginationEnabled ?? "1"),
				paginationType: dataAttrs.paginationType || "bullets",
				paginationClickable: parseBool(dataAttrs.paginationClickable),
				paginationDynamicBullets: parseBool(dataAttrs.paginationDynamicBullets),
				scrollbarEnabled: parseBool(dataAttrs.scrollbarEnabled),
				scrollbarDraggable: parseBool(dataAttrs.scrollbarDraggable ?? "1"),
				keyboardEnabled: parseBool(dataAttrs.keyboardEnabled ?? "1"),
				mousewheelEnabled: parseBool(dataAttrs.mousewheelEnabled),
				mousewheelForceToAxis: parseBool(dataAttrs.mousewheelForceToAxis),
				gridEnabled: parseBool(dataAttrs.gridEnabled),
				gridRows: parseNumber(dataAttrs.gridRows, 1),
				freeModeEnabled: parseBool(dataAttrs.freeModeEnabled),
				freeModeSticky: parseBool(dataAttrs.freeModeSticky),
				zoomEnabled: parseBool(dataAttrs.zoomEnabled),
				zoomMaxRatio: parseNumber(dataAttrs.zoomMaxRatio, 3),
				fadeCrossFade: parseBool(dataAttrs.fadeCrossFade ?? "1"),
				cubeShadow: parseBool(dataAttrs.cubeShadow ?? "1"),
				cubeSlideShadows: parseBool(dataAttrs.cubeSlideShadows ?? "1"),
				coverflowRotate: parseNumber(dataAttrs.coverflowRotate, 50),
				coverflowStretch: parseNumber(dataAttrs.coverflowStretch, 0),
				coverflowDepth: parseNumber(dataAttrs.coverflowDepth, 100),
				coverflowModifier: parseNumber(dataAttrs.coverflowModifier, 1),
				containerClass: dataAttrs.containerClass || "",
				breakpoints: dataAttrs.breakpoints || "",
				sliderId: dataAttrs.sliderId || "default"
			};
		}
		const modules = computed(() => {
			const activeModules = [A11y];
			if (config.value.autoplayEnabled) activeModules.push(Autoplay);
			if (config.value.navigationEnabled) activeModules.push(Navigation);
			if (config.value.paginationEnabled) activeModules.push(Pagination);
			if (config.value.scrollbarEnabled) activeModules.push(Scrollbar);
			if (config.value.keyboardEnabled) activeModules.push(Keyboard);
			if (config.value.mousewheelEnabled) activeModules.push(Mousewheel);
			if (config.value.gridEnabled) activeModules.push(Grid);
			if (config.value.freeModeEnabled) activeModules.push(FreeMode);
			if (config.value.zoomEnabled) activeModules.push(Zoom);
			activeModules.push(EffectFade);
			if (config.value.effect === "cube") activeModules.push(EffectCube);
			if (config.value.effect === "coverflow") activeModules.push(EffectCoverflow);
			if (config.value.effect === "flip") activeModules.push(EffectFlip);
			if (config.value.effect === "cards") activeModules.push(EffectCards);
			if (config.value.effect === "creative") activeModules.push(EffectCreative);
			return activeModules;
		});
		const breakpoints = computed(() => {
			if (!config.value.breakpoints) return void 0;
			try {
				const parsed = JSON.parse(config.value.breakpoints);
				Object.keys(parsed).forEach((key) => {
					const bp = parsed[key];
					if (bp.slidesPerView !== void 0 && bp.slidesPerGroup === void 0) bp.slidesPerGroup = 1;
				});
				return parsed;
			} catch {
				return;
			}
		});
		const navigationConfig = computed(() => {
			if (!config.value.navigationEnabled) return false;
			const sliderId = config.value.sliderId || "default";
			return {
				nextEl: `.swiper-button-next[data-slider-id="${sliderId}"]`,
				prevEl: `.swiper-button-prev[data-slider-id="${sliderId}"]`
			};
		});
		const paginationSelectorConfig = computed(() => {
			if (!config.value.paginationEnabled) return false;
			return {
				el: `.swiper-pagination[data-slider-id="${config.value.sliderId || "default"}"]`,
				type: config.value.paginationType || "bullets",
				clickable: config.value.paginationClickable,
				dynamicBullets: config.value.paginationDynamicBullets
			};
		});
		const scrollbarConfig = computed(() => {
			if (!config.value.scrollbarEnabled) return false;
			return {
				el: `.swiper-scrollbar[data-slider-id="${config.value.sliderId || "default"}"]`,
				draggable: config.value.scrollbarDraggable
			};
		});
		const a11yConfig = computed(() => ({
			enabled: true,
			prevSlideMessage,
			nextSlideMessage,
			firstSlideMessage,
			lastSlideMessage,
			paginationBulletMessage,
			slideLabelMessage,
			itemRoleDescriptionMessage
		}));
		onBeforeMount(() => {
			const element = mountElement;
			if (!element) return;
			const slidesDataAttr = element.getAttribute("data-slides-data");
			if (slidesDataAttr) try {
				const parsedSlides = JSON.parse(slidesDataAttr);
				slides.value = parsedSlides.map((slide) => ({
					id: slide.id,
					content: slide.content.trim()
				}));
			} catch {}
			if (slides.value.length === 0) {
				const slideElements = element.querySelectorAll(".swiper-slide-content");
				if (slideElements.length > 0) slides.value = Array.from(slideElements).map((el, index) => {
					return {
						id: index,
						content: el.innerHTML.trim()
					};
				});
			}
			loadConfig(element);
			if (element.hasAttribute("data-slides-data")) element.removeAttribute("data-slides-data");
		});
		onMounted(() => {
			nextTick(() => {
				notifyDynamicContentReady(mountElement);
			});
		});
		function observeRedundantAria(swiper) {
			const wrapper = swiper.el?.closest(".swiper-vue-wrapper") || swiper.el?.parentElement;
			if (!wrapper) return;
			new MutationObserver((mutations) => {
				for (const m of mutations) if (m.type === "attributes" && m.attributeName === "aria-disabled" && m.target.hasAttribute("disabled")) m.target.removeAttribute("aria-disabled");
			}).observe(wrapper, {
				attributes: true,
				attributeFilter: ["aria-disabled"],
				subtree: true
			});
			wrapper.querySelectorAll("button[disabled][aria-disabled]").forEach((btn) => btn.removeAttribute("aria-disabled"));
		}
		function toggleAutoplay() {
			const swiper = swiperRef.value;
			if (!swiper?.autoplay) return;
			if (!autoplayPausedByUser.value) {
				swiper.autoplay.stop();
				autoplayPausedByUser.value = true;
			} else {
				swiper.autoplay.start();
				autoplayPausedByUser.value = false;
			}
		}
		function bindAutoplayState(swiperInstance) {
			if (!config.value.autoplayEnabled || !swiperInstance.autoplay) return;
			swiperInstance.on("autoplayStop", () => {
				autoplayPausedByUser.value = true;
			});
			swiperInstance.on("autoplayStart", () => {
				autoplayPausedByUser.value = false;
			});
		}
		const onSwiper = (swiperInstance) => {
			swiperRef.value = swiperInstance;
			observeRedundantAria(swiperInstance);
			bindAutoplayState(swiperInstance);
			bindSwiperEffectParams(swiperInstance, config.value);
			bindEqualSwiperSlideHeights(swiperInstance);
			bindVidplySwiperLifecycle(swiperInstance);
			notifyDynamicContentReady(mountElement);
		};
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "containerRef",
				ref: containerRef,
				class: normalizeClass([
					"swiper-vue-wrapper",
					config.value.containerClass,
					{ "is-swiper-effect-coverflow": config.value.effect === "coverflow" }
				])
			}, [
				slides.value.length ? (openBlock(), createBlock(unref(Swiper), {
					key: 0,
					modules: modules.value,
					a11y: a11yConfig.value,
					effect: config.value.effect,
					"slides-per-view": config.value.slidesPerView,
					"space-between": config.value.spaceBetween,
					"slides-per-group": config.value.slidesPerGroup,
					loop: config.value.loop,
					speed: config.value.speed,
					autoplay: config.value.autoplayEnabled ? {
						delay: config.value.autoplayDelay,
						disableOnInteraction: config.value.autoplayDisableOnInteraction,
						pauseOnMouseEnter: config.value.autoplayPauseOnMouseEnter
					} : false,
					navigation: navigationConfig.value,
					pagination: paginationSelectorConfig.value,
					scrollbar: scrollbarConfig.value,
					keyboard: config.value.keyboardEnabled ? { enabled: true } : false,
					mousewheel: config.value.mousewheelEnabled ? { forceToAxis: config.value.mousewheelForceToAxis } : false,
					grid: config.value.gridEnabled ? { rows: config.value.gridRows } : void 0,
					"free-mode": config.value.freeModeEnabled ? {
						enabled: true,
						sticky: config.value.freeModeSticky
					} : false,
					zoom: config.value.zoomEnabled ? {
						enabled: true,
						maxRatio: config.value.zoomMaxRatio
					} : false,
					"fade-effect": config.value.effect === "fade" ? { crossFade: config.value.fadeCrossFade } : void 0,
					"cube-effect": config.value.effect === "cube" ? {
						shadow: config.value.cubeShadow,
						slideShadows: config.value.cubeSlideShadows
					} : void 0,
					"coverflow-effect": config.value.effect === "coverflow" ? {
						rotate: config.value.coverflowRotate,
						stretch: config.value.coverflowStretch,
						depth: config.value.coverflowDepth,
						modifier: config.value.coverflowModifier,
						slideShadows: false
					} : void 0,
					breakpoints: breakpoints.value,
					onSwiper,
					class: "swiper"
				}, {
					default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(slides.value, (slide) => {
						return openBlock(), createBlock(unref(SwiperSlide), {
							key: slide.id,
							class: "swiper-slide"
						}, {
							default: withCtx(() => [createBaseVNode("div", { innerHTML: slide.content }, null, 8, _hoisted_1)]),
							_: 2
						}, 1024);
					}), 128))]),
					_: 1
				}, 8, [
					"modules",
					"a11y",
					"effect",
					"slides-per-view",
					"space-between",
					"slides-per-group",
					"loop",
					"speed",
					"autoplay",
					"navigation",
					"pagination",
					"scrollbar",
					"keyboard",
					"mousewheel",
					"grid",
					"free-mode",
					"zoom",
					"fade-effect",
					"cube-effect",
					"coverflow-effect",
					"breakpoints"
				])) : createCommentVNode("", true),
				config.value.navigationEnabled || config.value.paginationEnabled ? (openBlock(), createElementBlock("div", _hoisted_2, [
					config.value.navigationEnabled ? (openBlock(), createElementBlock("button", {
						key: 0,
						ref_key: "navigationPrevRef",
						ref: navigationPrevRef,
						type: "button",
						class: "swiper-button swiper-button-prev",
						"data-slider-id": config.value.sliderId || "default",
						"aria-label": unref(prevSlideMessage)
					}, [..._cache[0] || (_cache[0] = [createBaseVNode("svg", {
						class: "swiper-navigation-icon",
						width: "11",
						height: "20",
						viewBox: "0 0 11 20",
						fill: "none",
						xmlns: "http://www.w3.org/2000/svg"
					}, [createBaseVNode("path", {
						d: "M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z",
						fill: "currentColor"
					})], -1)])], 8, _hoisted_3)) : createCommentVNode("", true),
					config.value.paginationEnabled ? (openBlock(), createElementBlock("div", {
						key: 1,
						ref_key: "paginationRef",
						ref: paginationRef,
						class: "swiper-pagination",
						"data-slider-id": config.value.sliderId || "default"
					}, null, 8, _hoisted_4)) : createCommentVNode("", true),
					config.value.navigationEnabled ? (openBlock(), createElementBlock("button", {
						key: 2,
						ref_key: "navigationNextRef",
						ref: navigationNextRef,
						type: "button",
						class: "swiper-button swiper-button-next",
						"data-slider-id": config.value.sliderId || "default",
						"aria-label": unref(nextSlideMessage)
					}, [..._cache[1] || (_cache[1] = [createBaseVNode("svg", {
						class: "swiper-navigation-icon",
						width: "11",
						height: "20",
						viewBox: "0 0 11 20",
						fill: "none",
						xmlns: "http://www.w3.org/2000/svg",
						"aria-hidden": "true"
					}, [createBaseVNode("path", {
						d: "M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z",
						fill: "currentColor"
					})], -1)])], 8, _hoisted_5)) : createCommentVNode("", true),
					config.value.autoplayEnabled && config.value.navigationEnabled ? (openBlock(), createElementBlock("button", {
						key: 3,
						type: "button",
						class: "swiper-button swiper-button-autoplay",
						"data-slider-id": config.value.sliderId || "default",
						"aria-label": autoplayPausedByUser.value ? unref(playAutoplayMessage) : unref(pauseAutoplayMessage),
						"aria-pressed": !autoplayPausedByUser.value,
						onClick: toggleAutoplay
					}, [!autoplayPausedByUser.value ? (openBlock(), createElementBlock("svg", _hoisted_7, [..._cache[2] || (_cache[2] = [createBaseVNode("rect", {
						x: "1.5",
						y: "3",
						width: "3",
						height: "14",
						fill: "currentColor"
					}, null, -1), createBaseVNode("rect", {
						x: "6.5",
						y: "3",
						width: "3",
						height: "14",
						fill: "currentColor"
					}, null, -1)])])) : (openBlock(), createElementBlock("svg", _hoisted_8, [..._cache[3] || (_cache[3] = [createBaseVNode("path", {
						d: "M2 3.5L9.5 10L2 16.5V3.5Z",
						fill: "currentColor"
					}, null, -1)])]))], 8, _hoisted_6)) : createCommentVNode("", true)
				])) : createCommentVNode("", true),
				config.value.scrollbarEnabled ? (openBlock(), createElementBlock("div", {
					key: 2,
					ref_key: "scrollbarRef",
					ref: scrollbarRef,
					class: "swiper-scrollbar",
					"data-slider-id": config.value.sliderId || "default"
				}, null, 8, _hoisted_9)) : createCommentVNode("", true)
			], 2);
		};
	}
};
//#endregion
export { _sfc_main as default };

//# sourceMappingURL=SwiperSlider-Bg4tkst2.js.map
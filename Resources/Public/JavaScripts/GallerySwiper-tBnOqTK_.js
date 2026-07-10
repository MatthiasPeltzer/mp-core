import { n as notifyDynamicContentReady, t as bindVidplySwiperLifecycle } from "./vidply-dynamic-content-DiJx1yiX.js";
import { c as nextSlideMessage, f as paginationBulletMessage, g as slideLabelMessage, h as prevSlideMessage, i as firstSlideMessage, m as playAutoplayMessage, o as itemRoleDescriptionMessage, p as pauseAutoplayMessage, s as lastSlideMessage } from "./i18n-CTgK0wgO.js";
import { A as inject, B as unref, C as createBaseVNode, E as createElementBlock, F as renderList, L as withCtx, M as onBeforeMount, N as onMounted, P as openBlock, S as computed, T as createCommentVNode, _ as Keyboard, a as EffectCube, b as Fragment, c as FreeMode, d as A11y, h as Navigation, i as EffectFlip, j as nextTick, k as createVNode, l as Thumb, m as Pagination, n as EffectCreative, o as EffectFade, r as EffectCoverflow, t as EffectCards, tt as normalizeClass, u as Autoplay, v as Swiper, w as createBlock, y as SwiperSlide, z as ref } from "./vendor-swiper-C4peFqeO.js";
import { n as bindEqualSwiperSlideHeights, t as bindSwiperEffectParams } from "./swiper-effect-params-CDiahhwm.js";
//#region Assets/Scripts/components/GallerySwiper.vue
var _hoisted_1 = {
	class: "gallery-thumbs-strip",
	style: { "order": "2" }
};
var _hoisted_2 = ["innerHTML"];
var _hoisted_3 = ["innerHTML"];
var _hoisted_4 = ["innerHTML"];
var _hoisted_5 = {
	key: 2,
	class: "swiper-navigation",
	style: { "order": "3" }
};
var _hoisted_6 = ["data-gallery-id", "aria-label"];
var _hoisted_7 = ["data-gallery-id"];
var _hoisted_8 = ["data-gallery-id", "aria-label"];
var _hoisted_9 = [
	"data-gallery-id",
	"aria-label",
	"aria-pressed"
];
var _hoisted_10 = {
	key: 0,
	class: "swiper-navigation-icon",
	width: "11",
	height: "20",
	viewBox: "0 0 11 20",
	fill: "none",
	xmlns: "http://www.w3.org/2000/svg",
	"aria-hidden": "true"
};
var _hoisted_11 = {
	key: 1,
	class: "swiper-navigation-icon",
	width: "11",
	height: "20",
	viewBox: "0 0 11 20",
	fill: "none",
	xmlns: "http://www.w3.org/2000/svg",
	"aria-hidden": "true"
};
/** TYPO3 mount target injected by vue-initialisation.js (avoids DOM query races). */
var _sfc_main = {
	__name: "GallerySwiper",
	setup(__props) {
		const mountElement = inject("mpcMountElement", null);
		const mainSwiperRef = ref(null);
		const thumbsSwiperRef = ref(null);
		const autoplayPausedByUser = ref(false);
		const slides = ref([]);
		const config = ref({
			galleryId: "default",
			layout: "slider",
			effect: "slide",
			columns: 1,
			spaceBetween: 10,
			loop: false,
			speed: 300,
			navigationEnabled: true,
			paginationEnabled: true,
			paginationType: "bullets",
			paginationClickable: true,
			paginationDynamicBullets: false,
			autoplayEnabled: false,
			autoplayDelay: 3e3,
			autoplayDisableOnInteraction: true,
			keyboardEnabled: true,
			fadeCrossFade: true,
			cubeShadow: true,
			cubeSlideShadows: true,
			coverflowRotate: 50,
			coverflowStretch: 0,
			coverflowDepth: 100,
			coverflowModifier: 1,
			thumbsPerView: 4,
			thumbsSpaceBetween: 10
		});
		function parseNumber(value, defaultValue = 0) {
			if (typeof value === "number") return value;
			if (typeof value === "string") {
				const parsed = parseInt(value, 10);
				return isNaN(parsed) ? defaultValue : parsed;
			}
			return defaultValue;
		}
		function parseBool(value) {
			if (typeof value === "boolean") return value;
			if (typeof value === "string") return value === "1" || value === "true" || value === "yes";
			return false;
		}
		function loadConfig(container) {
			if (!container) return;
			const dataAttrs = container.dataset;
			config.value = {
				galleryId: dataAttrs.galleryId || "default",
				layout: dataAttrs.layout || "slider",
				effect: dataAttrs.effect || "slide",
				columns: parseNumber(dataAttrs.columns, 1),
				spaceBetween: parseNumber(dataAttrs.spaceBetween, 10),
				loop: parseBool(dataAttrs.loop),
				speed: parseNumber(dataAttrs.speed, 300),
				navigationEnabled: parseBool(dataAttrs.navigationEnabled ?? "1"),
				paginationEnabled: parseBool(dataAttrs.paginationEnabled ?? "1"),
				paginationType: dataAttrs.paginationType || "bullets",
				paginationClickable: parseBool(dataAttrs.paginationClickable ?? "1"),
				paginationDynamicBullets: parseBool(dataAttrs.paginationDynamicBullets ?? "1"),
				autoplayEnabled: parseBool(dataAttrs.autoplayEnabled),
				autoplayDelay: parseNumber(dataAttrs.autoplayDelay, 3e3),
				autoplayDisableOnInteraction: parseBool(dataAttrs.autoplayDisableOnInteraction ?? "1"),
				keyboardEnabled: parseBool(dataAttrs.keyboardEnabled ?? "1"),
				fadeCrossFade: parseBool(dataAttrs.fadeCrossFade ?? "1"),
				cubeShadow: parseBool(dataAttrs.cubeShadow ?? "1"),
				cubeSlideShadows: parseBool(dataAttrs.cubeSlideShadows ?? "1"),
				coverflowRotate: parseNumber(dataAttrs.coverflowRotate, 50),
				coverflowStretch: parseNumber(dataAttrs.coverflowStretch, 0),
				coverflowDepth: parseNumber(dataAttrs.coverflowDepth, 100),
				coverflowModifier: parseNumber(dataAttrs.coverflowModifier, 1),
				thumbsPerView: parseNumber(dataAttrs.thumbsPerView, 4),
				thumbsSpaceBetween: parseNumber(dataAttrs.thumbsSpaceBetween, 10)
			};
		}
		const modules = computed(() => {
			const mods = [
				A11y,
				EffectFade,
				Keyboard,
				Pagination
			];
			if (config.value.layout === "thumbs") mods.push(Thumb, FreeMode);
			if (config.value.autoplayEnabled) mods.push(Autoplay);
			if (config.value.navigationEnabled) mods.push(Navigation);
			if (config.value.effect === "cube") mods.push(EffectCube);
			if (config.value.effect === "coverflow") mods.push(EffectCoverflow);
			if (config.value.effect === "flip") mods.push(EffectFlip);
			if (config.value.effect === "cards") mods.push(EffectCards);
			if (config.value.effect === "creative") mods.push(EffectCreative);
			return mods;
		});
		const thumbsModules = [A11y, FreeMode];
		const navigationConfig = computed(() => {
			if (!config.value.navigationEnabled) return false;
			return {
				nextEl: `.swiper-button-next[data-gallery-id="${config.value.galleryId}"]`,
				prevEl: `.swiper-button-prev[data-gallery-id="${config.value.galleryId}"]`
			};
		});
		const paginationConfig = computed(() => {
			if (!config.value.paginationEnabled) return false;
			return {
				el: `.swiper-pagination[data-gallery-id="${config.value.galleryId}"]`,
				type: config.value.paginationType,
				clickable: config.value.paginationClickable,
				dynamicBullets: config.value.paginationType === "bullets" && config.value.paginationDynamicBullets
			};
		});
		const autoplayConfig = computed(() => {
			if (!config.value.autoplayEnabled) return false;
			return {
				delay: config.value.autoplayDelay,
				disableOnInteraction: config.value.autoplayDisableOnInteraction,
				pauseOnMouseEnter: true
			};
		});
		const keyboardConfig = computed(() => config.value.keyboardEnabled ? { enabled: true } : false);
		const mainSlidesPerView = computed(() => config.value.effect === "coverflow" ? "auto" : 1);
		const mainBreakpoints = computed(() => {
			if (config.value.effect !== "slide") return void 0;
			const cols = config.value.columns;
			if (cols === 1) return void 0;
			if (cols === 2) return { 576: {
				slidesPerView: 2,
				slidesPerGroup: 2
			} };
			if (cols === 3) return {
				576: {
					slidesPerView: 2,
					slidesPerGroup: 2
				},
				992: {
					slidesPerView: 3,
					slidesPerGroup: 3
				}
			};
			if (cols >= 4) return {
				576: {
					slidesPerView: 2,
					slidesPerGroup: 2
				},
				992: {
					slidesPerView: 3,
					slidesPerGroup: 3
				},
				1200: {
					slidesPerView: 4,
					slidesPerGroup: 4
				}
			};
		});
		const thumbsBreakpoints = computed(() => ({
			576: { slidesPerView: Math.min(config.value.thumbsPerView, 3) },
			992: { slidesPerView: config.value.thumbsPerView }
		}));
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
				slides.value = JSON.parse(slidesDataAttr);
			} catch {}
			if (slides.value.length === 0) {
				const slideElements = element.querySelectorAll(".gallery-slide-content");
				if (slideElements.length > 0) slides.value = Array.from(slideElements).map((el, index) => ({
					id: index,
					content: el.innerHTML.trim(),
					thumbnail: el.dataset.thumbnail || ""
				}));
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
			const wrapper = swiper.el?.closest(".gallery-swiper-wrapper") || swiper.el?.parentElement;
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
			const swiper = mainSwiperRef.value;
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
		const onMainSwiper = (swiper) => {
			mainSwiperRef.value = swiper;
			observeRedundantAria(swiper);
			bindAutoplayState(swiper);
			bindSwiperEffectParams(swiper, config.value);
			if (config.value.effect !== "coverflow") bindEqualSwiperSlideHeights(swiper);
			bindVidplySwiperLifecycle(swiper);
			notifyDynamicContentReady(mountElement);
		};
		const onThumbsSwiper = (swiper) => {
			thumbsSwiperRef.value = swiper;
		};
		const thumbsSwiper = computed(() => thumbsSwiperRef.value);
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", { class: normalizeClass(["gallery-swiper-wrapper", { "is-swiper-effect-coverflow": config.value.layout === "slider" && config.value.effect === "coverflow" }]) }, [config.value.layout === "thumbs" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [createBaseVNode("div", _hoisted_1, [createVNode(unref(Swiper), {
				modules: thumbsModules,
				a11y: a11yConfig.value,
				"slides-per-view": 3,
				"space-between": config.value.thumbsSpaceBetween,
				"free-mode": true,
				"watch-slides-progress": true,
				breakpoints: thumbsBreakpoints.value,
				onSwiper: onThumbsSwiper,
				class: "swiper gallery-thumbs-swiper"
			}, {
				default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(slides.value, (slide) => {
					return openBlock(), createBlock(unref(SwiperSlide), {
						key: `thumb-${slide.id}`,
						class: "swiper-slide gallery-thumb-slide"
					}, {
						default: withCtx(() => [createBaseVNode("div", {
							innerHTML: slide.thumbnail || slide.content,
							class: "gallery-thumb-content"
						}, null, 8, _hoisted_2)]),
						_: 2
					}, 1024);
				}), 128))]),
				_: 1
			}, 8, [
				"a11y",
				"space-between",
				"breakpoints"
			])]), thumbsSwiper.value ? (openBlock(), createBlock(unref(Swiper), {
				key: 0,
				modules: modules.value,
				a11y: a11yConfig.value,
				"slides-per-view": 1,
				"space-between": config.value.spaceBetween,
				speed: config.value.speed,
				loop: config.value.loop,
				keyboard: keyboardConfig.value,
				navigation: navigationConfig.value,
				pagination: paginationConfig.value,
				autoplay: autoplayConfig.value,
				thumbs: { swiper: thumbsSwiper.value },
				onSwiper: onMainSwiper,
				class: "swiper gallery-main-swiper",
				style: { "order": "1" }
			}, {
				default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(slides.value, (slide) => {
					return openBlock(), createBlock(unref(SwiperSlide), {
						key: `main-${slide.id}`,
						class: "swiper-slide"
					}, {
						default: withCtx(() => [createBaseVNode("div", { innerHTML: slide.content }, null, 8, _hoisted_3)]),
						_: 2
					}, 1024);
				}), 128))]),
				_: 1
			}, 8, [
				"modules",
				"a11y",
				"space-between",
				"speed",
				"loop",
				"keyboard",
				"navigation",
				"pagination",
				"autoplay",
				"thumbs"
			])) : createCommentVNode("", true)], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [slides.value.length ? (openBlock(), createBlock(unref(Swiper), {
				key: 0,
				modules: modules.value,
				a11y: a11yConfig.value,
				effect: config.value.effect,
				"slides-per-view": mainSlidesPerView.value,
				"space-between": config.value.spaceBetween,
				speed: config.value.speed,
				loop: config.value.loop,
				"centered-slides": config.value.effect === "coverflow",
				keyboard: keyboardConfig.value,
				navigation: navigationConfig.value,
				pagination: paginationConfig.value,
				autoplay: autoplayConfig.value,
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
					scale: .86,
					slideShadows: false
				} : void 0,
				breakpoints: mainBreakpoints.value,
				"grab-cursor": config.value.effect === "slide" || config.value.effect === "coverflow",
				onSwiper: onMainSwiper,
				class: "swiper gallery-swiper"
			}, {
				default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(slides.value, (slide) => {
					return openBlock(), createBlock(unref(SwiperSlide), {
						key: slide.id,
						class: "swiper-slide"
					}, {
						default: withCtx(() => [createBaseVNode("div", { innerHTML: slide.content }, null, 8, _hoisted_4)]),
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
				"speed",
				"loop",
				"centered-slides",
				"keyboard",
				"navigation",
				"pagination",
				"autoplay",
				"fade-effect",
				"cube-effect",
				"coverflow-effect",
				"breakpoints",
				"grab-cursor"
			])) : createCommentVNode("", true)], 64)), config.value.navigationEnabled || config.value.paginationEnabled ? (openBlock(), createElementBlock("div", _hoisted_5, [
				config.value.navigationEnabled ? (openBlock(), createElementBlock("button", {
					key: 0,
					type: "button",
					class: "swiper-button swiper-button-prev",
					"data-gallery-id": config.value.galleryId,
					"aria-label": unref(prevSlideMessage)
				}, [..._cache[0] || (_cache[0] = [createBaseVNode("svg", {
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
				})], -1)])], 8, _hoisted_6)) : createCommentVNode("", true),
				config.value.paginationEnabled ? (openBlock(), createElementBlock("div", {
					key: 1,
					class: "swiper-pagination",
					"data-gallery-id": config.value.galleryId
				}, null, 8, _hoisted_7)) : createCommentVNode("", true),
				config.value.navigationEnabled ? (openBlock(), createElementBlock("button", {
					key: 2,
					type: "button",
					class: "swiper-button swiper-button-next",
					"data-gallery-id": config.value.galleryId,
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
				})], -1)])], 8, _hoisted_8)) : createCommentVNode("", true),
				config.value.autoplayEnabled && config.value.navigationEnabled ? (openBlock(), createElementBlock("button", {
					key: 3,
					type: "button",
					class: "swiper-button swiper-button-autoplay",
					"data-gallery-id": config.value.galleryId,
					"aria-label": autoplayPausedByUser.value ? unref(playAutoplayMessage) : unref(pauseAutoplayMessage),
					"aria-pressed": !autoplayPausedByUser.value,
					onClick: toggleAutoplay
				}, [!autoplayPausedByUser.value ? (openBlock(), createElementBlock("svg", _hoisted_10, [..._cache[2] || (_cache[2] = [createBaseVNode("rect", {
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
				}, null, -1)])])) : (openBlock(), createElementBlock("svg", _hoisted_11, [..._cache[3] || (_cache[3] = [createBaseVNode("path", {
					d: "M2 3.5L9.5 10L2 16.5V3.5Z",
					fill: "currentColor"
				}, null, -1)])]))], 8, _hoisted_9)) : createCommentVNode("", true)
			])) : createCommentVNode("", true)], 2);
		};
	}
};
//#endregion
export { _sfc_main as default };

//# sourceMappingURL=GallerySwiper-tBnOqTK_.js.map
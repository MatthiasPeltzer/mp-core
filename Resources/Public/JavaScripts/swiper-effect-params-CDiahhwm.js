//#region Assets/Scripts/code/swiper-equal-heights.js
/**
* Equalize Swiper slide heights: lock the container to the tallest slide, slides stay at 100%.
* Percentage heights only resolve once the swiper root has an explicit pixel height.
*/
function equalizeSwiperSlideHeights(swiper) {
	if (!swiper?.el || !swiper.slides?.length) return;
	if (swiper.el.classList.contains("gallery-thumbs-swiper")) return;
	if (swiper.el.classList.contains("gallery-swiper") && swiper.el.classList.contains("swiper-coverflow")) return;
	const { el, wrapperEl } = swiper;
	const slideEls = Array.from(swiper.slides);
	el.style.height = "auto";
	if (wrapperEl) wrapperEl.style.height = "auto";
	slideEls.forEach((slide) => {
		slide.style.height = "auto";
	});
	const maxHeight = Math.max(0, ...slideEls.map((slide) => slide.offsetHeight));
	if (maxHeight <= 0) return;
	el.style.height = `${maxHeight}px`;
	el.classList.add("swiper-equal-heights");
	if (wrapperEl) wrapperEl.style.height = "100%";
	slideEls.forEach((slide) => {
		slide.style.height = "100%";
	});
}
/**
* Measure after layout/images and re-run on resize or swiper updates.
*/
function bindEqualSwiperSlideHeights(swiper) {
	if (!swiper?.el || swiper.el.classList.contains("gallery-thumbs-swiper")) return;
	if (swiper.el.classList.contains("gallery-swiper") && swiper.el.classList.contains("swiper-coverflow")) return;
	const schedule = () => {
		requestAnimationFrame(() => equalizeSwiperSlideHeights(swiper));
	};
	schedule();
	setTimeout(schedule, 100);
	setTimeout(schedule, 500);
	swiper.on("resize", schedule);
	swiper.on("update", schedule);
	swiper.on("slideChange", schedule);
	swiper.on("transitionEnd", schedule);
	swiper.el.querySelectorAll("img").forEach((img) => {
		if (!img.complete) {
			img.addEventListener("load", schedule, { once: true });
			img.addEventListener("error", schedule, { once: true });
		}
	});
	const resizeObserver = new ResizeObserver(schedule);
	resizeObserver.observe(swiper.el);
	swiper.on("destroy", () => resizeObserver.disconnect());
}
//#endregion
//#region Assets/Scripts/code/swiper-effect-params.js
/**
* Swiper Vue passes partial effect option objects; module defaults win for missing keys.
* Apply full effect params after init so coverflow/cube/fade behave as configured.
*/
function applySwiperEffectParams(swiper, config) {
	if (!swiper?.params || !config?.effect) return;
	const { effect } = config;
	let needsTranslate = false;
	if (effect === "coverflow") {
		if (!swiper.params.coverflowEffect) swiper.params.coverflowEffect = {};
		Object.assign(swiper.params.coverflowEffect, {
			rotate: config.coverflowRotate ?? 50,
			stretch: config.coverflowStretch ?? 0,
			depth: config.coverflowDepth ?? 100,
			modifier: config.coverflowModifier ?? 1,
			scale: config.coverflowScale ?? .86,
			slideShadows: false
		});
		swiper.slides?.forEach((slideEl) => {
			slideEl.querySelectorAll(".swiper-slide-shadow-left, .swiper-slide-shadow-right, .swiper-slide-shadow-top, .swiper-slide-shadow-bottom").forEach((shadowEl) => shadowEl.remove());
		});
		needsTranslate = true;
	}
	if (effect === "cube") {
		if (!swiper.params.cubeEffect) swiper.params.cubeEffect = {};
		Object.assign(swiper.params.cubeEffect, {
			shadow: config.cubeShadow !== false,
			slideShadows: config.cubeSlideShadows !== false
		});
		needsTranslate = true;
	}
	if (effect === "fade") {
		if (!swiper.params.fadeEffect) swiper.params.fadeEffect = {};
		Object.assign(swiper.params.fadeEffect, { crossFade: config.fadeCrossFade !== false });
		needsTranslate = true;
	}
	if (needsTranslate) {
		swiper.updateSize();
		swiper.updateSlides();
		swiper.emit("setTranslate");
	} else swiper.update();
}
function bindSwiperEffectParams(swiper, config) {
	if (!swiper?.params) return;
	const apply = () => applySwiperEffectParams(swiper, config);
	apply();
	swiper.on("afterInit", apply);
	swiper.on("resize", apply);
}
//#endregion
export { bindEqualSwiperSlideHeights as n, bindSwiperEffectParams as t };

//# sourceMappingURL=swiper-effect-params-CDiahhwm.js.map
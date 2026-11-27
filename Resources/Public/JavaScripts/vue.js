const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./TodoList-DKp11FrE.js","./vendor-swiper-ByHJRb5b.js","../StyleSheets/vendor-swiper.css","./vendor-vue-C1vUEvj_.js","../StyleSheets/TodoList.css","./SwiperSlider-YnR_Za9d.js","./i18n-D9tefVeF.js","./swiper-effect-params-B0Y127cc.js","./vidply-dynamic-content-V9hx8L_p.js","./GallerySwiper-D6SbmLKL.js"])))=>i.map(i=>d[i]);
import "./vendor-swiper-ByHJRb5b.js";
import { t as createApp } from "./vendor-vue-C1vUEvj_.js";
import { t as asHTMLElement } from "./domTypes-DZ0kIKBi.js";
import { t as __vitePreload } from "./preload-helper-CALLvQDj.js";
// Assets/Scripts/code/Vue/vue-initialisation.ts
/**
* Usage in TYPO3 templates:
*   <div data-container="vue" data-component="TodoList"></div>
*
* Optional configuration via data attributes:
*   <div data-container="vue" data-component="TodoList"
*        data-card-title="My Tasks"
*        data-color-scheme="primary"></div>
*
* SECURITY — trust boundary for slide HTML:
*   For the SwiperSlider / GallerySwiper code paths below, this script reads
*   `innerHTML` from server-rendered `.swiper-slide-content` / `.gallery-*`
*   elements (TYPO3 Fluid output for content elements — RTE bodytext, images,
*   etc.) and serialises it into a `data-slides-data` attribute. The Vue
*   components then re-render that HTML via `v-html`. The content is therefore
*   only as safe as the upstream Fluid pipeline (backend editors are trusted).
*   NEVER use these components on user-submitted markup without server-side
*   sanitisation first. The components carry matching SECURITY comments.
*/
var componentLoaders = {
	TodoList: () => __vitePreload(() => import("./TodoList-DKp11FrE.js"), __vite__mapDeps([0,1,2,3,4]), import.meta.url),
	SwiperSlider: () => __vitePreload(() => import("./SwiperSlider-YnR_Za9d.js"), __vite__mapDeps([5,1,2,6,7,8]), import.meta.url),
	GallerySwiper: () => __vitePreload(() => import("./GallerySwiper-D6SbmLKL.js"), __vite__mapDeps([9,1,2,6,7,8]), import.meta.url)
};
function captureSlides(element, slideSelector, extract) {
	const slideElements = element.querySelectorAll(slideSelector);
	if (slideElements.length === 0) return;
	const slidesData = [...slideElements].map((el, index) => extract(el, index));
	element.setAttribute("data-slides-data", JSON.stringify(slidesData));
}
function preserveSlideContent(element, componentName) {
	if (componentName === "SwiperSlider") {
		captureSlides(element, ".swiper-slide-content", (el, index) => ({
			id: index,
			content: el.innerHTML
		}));
		return;
	}
	if (componentName === "GallerySwiper") captureSlides(element, ".gallery-slide-content", (el, index) => {
		const mainContentEl = el.querySelector(".gallery-main-content");
		const content = mainContentEl ? mainContentEl.innerHTML : el.innerHTML;
		const thumbnailTemplate = el.querySelector(".gallery-thumbnail-template");
		const thumbnail = thumbnailTemplate ? thumbnailTemplate.innerHTML : content;
		return {
			id: index,
			content: content.trim(),
			thumbnail: thumbnail.trim()
		};
	});
}
function isVueComponentName(name) {
	return name in componentLoaders;
}
async function mountComponent(element, componentName) {
	const loader = componentLoaders[componentName];
	preserveSlideContent(element, componentName);
	try {
		const component = (await loader()).default;
		if (!component) return;
		const app = createApp(component);
		app.provide("mpcMountElement", element);
		app.mount(element);
		element.classList.add("swiper-vue-ready");
	} catch (err) {
		if (typeof console !== "undefined") console.error(`[mp-core/vue] failed to mount "${componentName}"`, err);
	}
}
function initializeVueComponents() {
	const containers = document.querySelectorAll("[data-container=\"vue\"]");
	if (!containers.length) return;
	containers.forEach((node) => {
		const element = asHTMLElement(node);
		const componentName = element?.getAttribute("data-component");
		if (element && componentName && isVueComponentName(componentName)) mountComponent(element, componentName);
	});
}
if (typeof window !== "undefined") {
	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initializeVueComponents);
	else initializeVueComponents();
}

//# sourceMappingURL=vue.js.map
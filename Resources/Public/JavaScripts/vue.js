const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./TodoList-CYMAZxKQ.js","./vendor-swiper-C4peFqeO.js","../StyleSheets/vendor-swiper.css","./vendor-vue-BzJnYTXS.js","../StyleSheets/TodoList.css","./SwiperSlider-Bg4tkst2.js","./vidply-dynamic-content-DiJx1yiX.js","./i18n-CTgK0wgO.js","./swiper-effect-params-CDiahhwm.js","./GallerySwiper-tBnOqTK_.js"])))=>i.map(i=>d[i]);
import { t as __vitePreload } from "./preload-helper-DHlaQ_oz.js";
import "./vendor-swiper-C4peFqeO.js";
import { t as createApp } from "./vendor-vue-BzJnYTXS.js";
//#region Assets/Scripts/code/Vue/vue-initialisation.js
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
/**
* Lazy component loaders. Each entry returns the dynamic import promise for
* the matching SFC. Vite/Rollup code-splits these into separate chunks, so a
* page that only uses `SwiperSlider` never downloads `TodoList` or
* `GallerySwiper`. Add new components here following the same pattern.
*/
var componentLoaders = {
	TodoList: () => __vitePreload(() => import("./TodoList-CYMAZxKQ.js"), __vite__mapDeps([0,1,2,3,4]), import.meta.url),
	SwiperSlider: () => __vitePreload(() => import("./SwiperSlider-Bg4tkst2.js"), __vite__mapDeps([5,6,7,1,2,8]), import.meta.url),
	GallerySwiper: () => __vitePreload(() => import("./GallerySwiper-tBnOqTK_.js"), __vite__mapDeps([9,6,7,1,2,8]), import.meta.url)
};
function captureSlides(element, slideSelector, extract) {
	const slideElements = element.querySelectorAll(slideSelector);
	if (slideElements.length === 0) return;
	const slidesData = Array.from(slideElements).map((el, index) => extract(el, index));
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
async function mountComponent(element, componentName) {
	const loader = componentLoaders[componentName];
	if (!loader) return;
	preserveSlideContent(element, componentName);
	try {
		const module = await loader();
		const component = module.default ?? module;
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
	containers.forEach((element) => {
		const componentName = element.getAttribute("data-component");
		if (componentName) mountComponent(element, componentName);
	});
}
if (typeof window !== "undefined") if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initializeVueComponents);
else initializeVueComponents();
//#endregion

//# sourceMappingURL=vue.js.map
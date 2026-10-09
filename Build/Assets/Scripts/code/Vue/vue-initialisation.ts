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

import { createApp, type Component } from 'vue'
import { asHTMLElement } from '../Utils/domTypes.js'

type VueComponentName = 'TodoList' | 'SwiperSlider' | 'GallerySwiper'

const componentLoaders: Record<VueComponentName, () => Promise<{ default?: Component }>> = {
  TodoList: () => import('../../components/TodoList.vue'),
  SwiperSlider: () => import('../../components/SwiperSlider.vue'),
  GallerySwiper: () => import('../../components/GallerySwiper.vue'),
}

type SlideExtractResult = Record<string, string | number>

function captureSlides(
  element: HTMLElement,
  slideSelector: string,
  extract: (el: Element, index: number) => SlideExtractResult,
): void {
  const slideElements = element.querySelectorAll(slideSelector)
  if (slideElements.length === 0) {
    return
  }
  const slidesData = [...slideElements].map((el, index) => extract(el, index))
  element.setAttribute('data-slides-data', JSON.stringify(slidesData))
}

function preserveSlideContent(element: HTMLElement, componentName: VueComponentName): void {
  if (componentName === 'SwiperSlider') {
    captureSlides(element, '.swiper-slide-content', (el, index) => ({
      id: index,
      content: el.innerHTML,
    }))
    return
  }

  if (componentName === 'GallerySwiper') {
    captureSlides(element, '.gallery-slide-content', (el, index) => {
      const mainContentEl = el.querySelector('.gallery-main-content')
      const content = mainContentEl ? mainContentEl.innerHTML : el.innerHTML

      const thumbnailTemplate = el.querySelector('.gallery-thumbnail-template')
      const thumbnail = thumbnailTemplate ? thumbnailTemplate.innerHTML : content

      return {
        id: index,
        content: content.trim(),
        thumbnail: thumbnail.trim(),
      }
    })
  }
}

function isVueComponentName(name: string): name is VueComponentName {
  return name in componentLoaders
}

async function mountComponent(element: HTMLElement, componentName: VueComponentName): Promise<void> {
  const loader = componentLoaders[componentName]

  preserveSlideContent(element, componentName)

  try {
    const module = await loader()
    const component = module.default
    if (!component) {
      return
    }
    const app = createApp(component)
    app.provide('mpcMountElement', element)
    app.mount(element)
    element.classList.add('swiper-vue-ready')
  } catch (err) {
    if (typeof console !== 'undefined') {
      // eslint-disable-next-line no-console -- intentional, mount errors must reach DevTools
      console.error(`[mp-core/vue] failed to mount "${componentName}"`, err)
    }
  }
}

function initializeVueComponents(): void {
  const containers = document.querySelectorAll('[data-container="vue"]')
  if (!containers.length) {
    return
  }

  containers.forEach((node) => {
    const element = asHTMLElement(node)
    const componentName = element?.getAttribute('data-component')
    if (element && componentName && isVueComponentName(componentName)) {
      void mountComponent(element, componentName)
    }
  })
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeVueComponents)
  } else {
    initializeVueComponents()
  }
}

export { createApp, componentLoaders }

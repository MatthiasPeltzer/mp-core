import Swiper from 'swiper';
import {A11y, EffectFade, Keyboard, Navigation, Pagination, Thumbs} from 'swiper/modules';
import {
    firstSlideMessage,
    itemRoleDescriptionMessage,
    lastSlideMessage,
    nextSlideMessage,
    paginationBulletMessage,
    prevSlideMessage,
    slideLabelMessage
} from '../i18n.js';

const MODULES = [A11y, EffectFade, Keyboard, Navigation, Pagination, Thumbs];

const BASE_OPTIONS = {
    modules: MODULES,
    keyboard: {enabled: true},
    init: false,
    watchSlidesProgress: true,
    a11y: {
        prevSlideMessage,
        nextSlideMessage,
        firstSlideMessage,
        lastSlideMessage,
        paginationBulletMessage,
        slideLabelMessage,
        itemRoleDescriptionMessage,
    },
    on: {

        init(swiper) {
            updateSlidesA11y(swiper);
        },
        afterInit(swiper) {
            updateSlidesA11y(swiper);
        },
        slideChange(swiper) {
            updateSlidesA11y(swiper);
        },
        resize(swiper) {
            updateSlidesA11y(swiper);
        },
        breakpoint(swiper) {
            updateSlidesA11y(swiper);
        },
    },
};

function updateSlidesA11y(swiper) {
    if (!swiper || !swiper.slides) return;
    swiper.slides.forEach((slide) => {
        const isVisible = slide.classList.contains('swiper-slide-visible');
        if (isVisible) {
            slide.removeAttribute('aria-hidden');
            slide.setAttribute('role', 'group');
        } else {
            slide.setAttribute('aria-hidden', 'true');
            slide.removeAttribute('role');
        }
    });
}

function initSwipers(selector, buildSpecificOptions) {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    elements.forEach((el) => {
        const specific = typeof buildSpecificOptions === 'function' ? buildSpecificOptions(el) : (buildSpecificOptions || {});
        const options = {...BASE_OPTIONS, ...specific};

        const next = el.querySelector('.swiper-button-next');
        const prev = el.querySelector('.swiper-button-prev');
        if (next && prev) options.navigation = {nextEl: next, prevEl: prev};

        const pag = el.querySelector('.swiper-pagination');
        if (pag) options.pagination = {el: pag, clickable: false, dynamicBullets: true};

        const swiperInstance = new Swiper(el, options);
        swiperInstance.init();
        updateSlidesA11y(swiperInstance);
    });
}

// Fade variant
initSwipers('.swiper-fade-col-1, .swiper-fade-col-2, .swiper-fade-col-3, .swiper-fade-col-4', () => ({
    spaceBetween: 30,
    effect: 'fade',
    fadeEffect: {crossFade: true},
    grabCursor: true,
}));

// 1 column
initSwipers('.swiper-slide-col-1', () => ({
    slidesPerView: 1,
}));

// 2 columns
initSwipers('.swiper-slide-col-2', () => ({
    slidesPerView: 1,
    spaceBetween: 16,
    slidesPerGroupSkip: 1,
    grabCursor: true,
    breakpoints: {
        576: {
            slidesPerView: 2,
            slidesPerGroup: 2,
        },
    },
}));

// 3 columns
initSwipers('.swiper-slide-col-3', () => ({
    slidesPerView: 1,
    spaceBetween: 16,
    slidesPerGroupSkip: 1,
    grabCursor: true,
    breakpoints: {
        576: {
            slidesPerView: 2,
            slidesPerGroup: 2,
        },
        992: {
            slidesPerView: 3,
            slidesPerGroup: 3,
        },
    },
}));

// 4 columns
initSwipers('.swiper-slide-col-4', () => ({
    slidesPerView: 1,
    spaceBetween: 16,
    slidesPerGroupSkip: 1,
    grabCursor: true,
    breakpoints: {
        576: {
            slidesPerView: 2,
            slidesPerGroup: 2,
        },
        992: {
            slidesPerView: 3,
            slidesPerGroup: 3,
        },
        1200: {
            slidesPerView: 4,
            slidesPerGroup: 4,
        },
    },
}));

// Thumbnail variant — link a top slider to its closest bottom thumbs slider
function createThumbsInstance(bottomEl) {
    const options = {
        ...BASE_OPTIONS,
        spaceBetween: 10,
        slidesPerView: 3,
        freeMode: true,
        watchSlidesProgress: true,
        breakpoints: {
            992: {
                slidesPerView: 4,
            },
        },
    };
    const instance = new Swiper(bottomEl, options);
    instance.init();
    updateSlidesA11y(instance);
    return instance;
}

initSwipers('.topSwiper', (el) => {
    let thumbsInstance;
    const container = el.closest('.swiper-thumbs') || el.parentElement;
    const bottomEl = container ? container.querySelector('.bottomSwiper') : document.querySelector('.bottomSwiper');
    if (bottomEl) {
        thumbsInstance = createThumbsInstance(bottomEl);
    }

    return {
        spaceBetween: 10,
        thumbs: thumbsInstance ? {swiper: thumbsInstance} : undefined,
    };
});
// Assets/Scripts/code/vidply-dynamic-content.ts
function getVidPlyInit() {
	return window.VidPlyInit;
}
function getVidPlyPrivacy() {
	return window.VidPlyPrivacy;
}
function getVidPlyTheme() {
	return window.VidPlyTheme;
}
function notifyDynamicContentReady(root) {
	if (!(root instanceof Element)) return;
	getVidPlyInit()?.scan?.(root);
	getVidPlyPrivacy()?.scanLayers?.(root);
	document.dispatchEvent(new CustomEvent("mpc:dynamic-content:ready", { detail: { root } }));
}
/**
* Pause VidPly players and native media inside the given container.
*/
function pausePlayersInside(container) {
	if (!(container instanceof Element)) return;
	getVidPlyTheme()?.getPlayers?.().forEach((player) => {
		const host = player?.element;
		if (!host || !container.contains(host)) return;
		try {
			player.pause?.();
		} catch {}
	});
	container.querySelectorAll("video, audio").forEach((media) => {
		if (media instanceof HTMLMediaElement) media.pause();
	});
}
/**
* Pause VidPly players outside the active slide and init any player on it.
*/
function bindVidplySwiperLifecycle(swiper) {
	if (!swiper?.slides?.length) return;
	const syncActiveSlide = () => {
		const activeSlide = swiper.slides[swiper.activeIndex];
		if (!(activeSlide instanceof Element)) return;
		getVidPlyInit()?.pauseOutside?.(activeSlide);
		getVidPlyInit()?.scan?.(activeSlide, { includeDuplicateSlides: true });
	};
	swiper.on("slideChangeTransitionEnd", syncActiveSlide);
	syncActiveSlide();
}
export { notifyDynamicContentReady as n, pausePlayersInside as r, bindVidplySwiperLifecycle as t };

//# sourceMappingURL=vidply-dynamic-content-V9hx8L_p.js.map
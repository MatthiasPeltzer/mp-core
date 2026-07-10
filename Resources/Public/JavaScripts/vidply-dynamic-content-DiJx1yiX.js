//#region Assets/Scripts/code/vidply-dynamic-content.js
/**
* Notify mpc-vidply that Vue/Swiper has injected slide HTML at runtime.
* PlaylistInit and PrivacyLayer listen for this event and scan the subtree.
*
* @param {Element | null | undefined} root
*/
function notifyDynamicContentReady(root) {
	if (!(root instanceof Element)) return;
	window.VidPlyInit?.scan?.(root);
	window.VidPlyPrivacy?.scanLayers?.(root);
	document.dispatchEvent(new CustomEvent("mpc:dynamic-content:ready", { detail: { root } }));
}
/**
* Pause VidPly players and native media inside the given container.
*
* @param {Element | null | undefined} container
*/
function pausePlayersInside(container) {
	if (!(container instanceof Element)) return;
	window.VidPlyTheme?.getPlayers?.().forEach((player) => {
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
*
* @param {import('swiper').Swiper | null | undefined} swiper
*/
function bindVidplySwiperLifecycle(swiper) {
	if (!swiper?.slides?.length) return;
	const syncActiveSlide = () => {
		const activeSlide = swiper.slides[swiper.activeIndex];
		if (!(activeSlide instanceof Element)) return;
		window.VidPlyInit?.pauseOutside?.(activeSlide);
		window.VidPlyInit?.scan?.(activeSlide, { includeDuplicateSlides: true });
	};
	swiper.on("slideChangeTransitionEnd", syncActiveSlide);
	syncActiveSlide();
}
//#endregion
export { notifyDynamicContentReady as n, pausePlayersInside as r, bindVidplySwiperLifecycle as t };

//# sourceMappingURL=vidply-dynamic-content-DiJx1yiX.js.map
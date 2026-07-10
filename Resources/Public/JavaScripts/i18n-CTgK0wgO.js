//#region Assets/Scripts/code/i18n.js
var lang = document.querySelector("html")?.getAttribute("lang") || "en";
var messages = {
	de: {
		prevSlide: "Zum vorherigen Eintrag",
		nextSlide: "Zum nächsten Eintrag",
		pauseAutoplay: "Autoplay pausieren",
		playAutoplay: "Autoplay fortsetzen",
		firstSlide: "Das ist der erste Inhalt",
		lastSlide: "Das ist der letzte Inhalt",
		paginationBullet: "Gehe zu Inhalt {{index}}",
		slideLabel: "{{index}} von {{slidesLength}}",
		itemRoleDescription: "Galerieeintrag",
		openNav: "öffnen",
		closeNav: "schließen",
		openTitle: "Menü öffnen",
		closeTitle: "Menü schließen",
		openButton: "Untermenü öffnen",
		closeButton: "Untermenü schließen",
		audio: "Audio. ",
		chart: "Chart. ",
		download: "Herunterladen. ",
		email: "Öffnet E-Mail-Programm. ",
		externalLink: "Extern. ",
		externalLinkNew: "Extern (Neues Fenster). ",
		gallery: "Galerie. ",
		glossary: "Glossar. ",
		iconLink: "Intern. ",
		internalLink: "Intern. ",
		internalLinkNew: "Intern (Neues Fenster). ",
		legal: "Rechtliche Information. ",
		listScroll: "Springt zum Element. ",
		phone: "Öffnet Telefonanwendung. ",
		press: "Pressebereich. ",
		public: "Öffentlicher Bereich. ",
		video: "Video. ",
		newWindow: "Neues Fenster"
	},
	en: {
		prevSlide: "To the previous entry",
		nextSlide: "To the next entry",
		pauseAutoplay: "Pause autoplay",
		playAutoplay: "Resume autoplay",
		firstSlide: "This is the first slide",
		lastSlide: "This is the last slide",
		paginationBullet: "Go to slide {{index}}",
		slideLabel: "{{index}} of {{slidesLength}}",
		itemRoleDescription: "Gallery entry",
		openNav: "Open",
		closeNav: "Close",
		openTitle: "Open menu",
		closeTitle: "Close menu",
		openButton: "Open Submenu",
		closeButton: "Close Submenu",
		audio: "Audio. ",
		chart: "Chart. ",
		download: "Download. ",
		email: "Opens email program. ",
		externalLink: "External. ",
		externalLinkNew: "External (new window). ",
		gallery: "Gallery. ",
		glossary: "Glossary. ",
		iconLink: "Internal. ",
		internalLink: "Internal. ",
		internalLinkNew: "Internal (new window). ",
		legal: "Legal information. ",
		listScroll: "Jumps to item. ",
		phone: "Opens the phone app. ",
		press: "Press area. ",
		public: "Public area. ",
		video: "Video. ",
		newWindow: "New window"
	}
};
var currentMessages = messages[lang] || messages.en;
var { prevSlide: prevSlideMessage, nextSlide: nextSlideMessage, pauseAutoplay: pauseAutoplayMessage, playAutoplay: playAutoplayMessage, firstSlide: firstSlideMessage, lastSlide: lastSlideMessage, paginationBullet: paginationBulletMessage, slideLabel: slideLabelMessage, itemRoleDescription: itemRoleDescriptionMessage, openNav: openNavMessage, closeNav: closeNavMessage, openTitle: openTitleMessage, closeTitle: closeTitleMessage, openButton: openButtonMessage, closeButton: closeButtonMessage } = {
	...messages.en,
	...currentMessages
};
var i18n = {
	...messages.en,
	...currentMessages
};
i18n.newWindow;
//#endregion
export { i18n as a, nextSlideMessage as c, openTitleMessage as d, paginationBulletMessage as f, slideLabelMessage as g, prevSlideMessage as h, firstSlideMessage as i, openButtonMessage as l, playAutoplayMessage as m, closeNavMessage as n, itemRoleDescriptionMessage as o, pauseAutoplayMessage as p, closeTitleMessage as r, lastSlideMessage as s, closeButtonMessage as t, openNavMessage as u };

//# sourceMappingURL=i18n-CTgK0wgO.js.map
// Get the language attribute from the <html> tag
const lang = document.querySelector('html')?.getAttribute('lang') || 'en';

// Define messages for different languages
const messages = {
    de: {
        prevSlide: 'Zum vorherigen Eintrag',
        nextSlide: 'Zum nächsten Eintrag',
        firstSlide: 'Das ist der erste Inhalt',
        lastSlide: 'Das ist der letzte Inhalt',
        paginationBullet: 'Gehe zu Inhalt {{index}}',
        slideLabel: '{{index}} von {{slidesLength}}',
        itemRoleDescription: 'Galerieeintrag',
        openNav: 'öffnen',
        closeNav: 'schließen',
        openTitle: 'Menü öffnen',
        closeTitle: 'Menü schließen',
        openButton: 'Untermenü öffnen',
        closeButton: 'Untermenü schließen',
        audio: 'Audio. ',
        chart: 'Chart. ',
        download: 'Herunterladen. ',
        email: 'Öffnet E-Mail-Programm. ',
        externalLink: 'Extern. ',
        externalLinkNew: 'Extern (Neues Fenster). ',
        gallery: 'Galerie. ',
        glossary: 'Glossar. ',
        iconLink: 'Intern. ',
        internalLink: 'Intern. ',
        internalLinkNew: 'Intern (Neues Fenster). ',
        legal: 'Rechtliche Information. ',
        listScroll: 'Springt zum Element. ',
        phone: 'Öffnet Telefonanwendung. ',
        press: 'Pressebereich. ',
        public: 'Öffentlicher Bereich. ',
        video: 'Video. ',
        newWindow: 'Neues Fenster'
    },
    en: {
        prevSlide: 'To the previous entry',
        nextSlide: 'To the next entry',
        firstSlide: 'This is the first slide',
        lastSlide: 'This is the last slide',
        paginationBullet: 'Go to slide {{index}}',
        slideLabel: '{{index}} of {{slidesLength}}',
        itemRoleDescription: 'Gallery entry',
        openNav: 'Open',
        closeNav: 'Close',
        openTitle: 'Open menu',
        closeTitle: 'Close menu',
        openButton: 'Open Submenu',
        closeButton: 'Close Submenu',
        audio: 'Audio. ',
        chart: 'Chart. ',
        download: 'Download. ',
        email: 'Opens email program. ',
        externalLink: 'External. ',
        externalLinkNew: 'External (new window). ',
        gallery: 'Gallery. ',
        glossary: 'Glossary. ',
        iconLink: 'Internal. ',
        internalLink: 'Internal. ',
        internalLinkNew: 'Internal (new window). ',
        legal: 'Legal information. ',
        listScroll: 'Jumps to item. ',
        phone: 'Opens the phone app. ',
        press: 'Press area. ',
        public: 'Public area. ',
        video: 'Video. ',
        newWindow: 'New window'
    }
};

// Get the messages for the current language, falling back to English
const currentMessages = messages[lang] || messages.en;

// Create and export all messages dynamically
export const {
    prevSlide: prevSlideMessage,
    nextSlide: nextSlideMessage,
    firstSlide: firstSlideMessage,
    lastSlide: lastSlideMessage,
    paginationBullet: paginationBulletMessage,
    slideLabel: slideLabelMessage,
    itemRoleDescription: itemRoleDescriptionMessage,
    openNav: openNavMessage,
    closeNav: closeNavMessage,
    openTitle: openTitleMessage,
    closeTitle: closeTitleMessage,
    openButton: openButtonMessage,
    closeButton: closeButtonMessage
} = {
    ...messages.en, // Default English messages
    ...currentMessages // Override with current language
};

// Export merged messages for general i18n lookups
export const i18n = {
    ...messages.en,
    ...currentMessages
};

// Convenience export for new-window text
export const newWindowMessage = i18n.newWindow;

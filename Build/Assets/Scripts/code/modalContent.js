import { notifyDynamicContentReady, pausePlayersInside } from './vidply-dynamic-content.js';

/**
 * Initialise VidPly inside modals on open and pause players when closed.
 */
export function initModalContent() {
  document.querySelectorAll('.dialog[data-bs-backdrop]').forEach((dialog) => {
    if (!(dialog instanceof HTMLElement) || dialog.dataset.mpcModalBound === '1') {
      return;
    }

    dialog.dataset.mpcModalBound = '1';

    dialog.addEventListener('shown.bs.dialog', () => {
      const root = dialog.querySelector('[data-modal-content-root]');
      notifyDynamicContentReady(root);
    });

    dialog.addEventListener('hide.bs.dialog', () => {
      const root = dialog.querySelector('[data-modal-content-root]') ?? dialog.querySelector('.dialog-body');
      pausePlayersInside(root);
    });
  });
}

if (document.querySelector('[data-modal-content-root]')) {
  initModalContent();
}

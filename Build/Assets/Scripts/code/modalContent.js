import { notifyDynamicContentReady, pausePlayersInside } from './vidply-dynamic-content.js';

/**
 * Initialise VidPly inside modals on open and pause players when closed.
 */
export function initModalContent() {
  document.querySelectorAll('.modal[data-bs-backdrop]').forEach((modal) => {
    if (!(modal instanceof HTMLElement) || modal.dataset.mpcModalBound === '1') {
      return;
    }

    modal.dataset.mpcModalBound = '1';

    modal.addEventListener('shown.bs.modal', () => {
      const root = modal.querySelector('[data-modal-content-root]');
      notifyDynamicContentReady(root);
    });

    modal.addEventListener('hide.bs.modal', () => {
      const root = modal.querySelector('[data-modal-content-root]') ?? modal.querySelector('.modal-body');
      pausePlayersInside(root);
    });
  });
}

if (document.querySelector('[data-modal-content-root]')) {
  initModalContent();
}

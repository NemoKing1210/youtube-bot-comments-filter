import { SAFETY_RESCAN_MS } from '../constants.js';
import { processNewComments } from './comments.js';
import { ensureAccountMenuInserted } from './settings-menu.js';

let scheduled = false;

function scheduleTick() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    ensureAccountMenuInserted();
    processNewComments();
  });
}

export function startObserver() {
  const observer = new MutationObserver(() => scheduleTick());
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Initial pass + safety-net interval in case a mutation is missed.
  scheduleTick();
  setInterval(scheduleTick, SAFETY_RESCAN_MS);

  return observer;
}

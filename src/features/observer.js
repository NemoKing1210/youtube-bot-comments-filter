import { ACCOUNT_MENU_SELECTOR, SAFETY_RESCAN_MS } from '../constants.js';
import { createShadowObserverRegistry } from './account-menu/shadow-observer.js';
import { processCommentNode, processNewComments } from './comments.js';
import { createPendingQueue } from './pending-queue.js';
import { ensureAccountMenuInserted } from './settings-menu.js';

const MENU_TAG = 'ytd-multi-page-menu-renderer';
const MAX_PENDING_NODES = 1000;

let scheduled = false;
let fullScanRequested = false;
let menuScanRequested = false;
/** Element nodes added since the last animation frame (bounded). */
const pendingNodes = createPendingQueue(MAX_PENDING_NODES);

function scheduleTick() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(flush);
}

/** A cheap full pass: used on load, SPA navigation and as a safety net. */
function requestFullScan() {
  fullScanRequested = true;
  menuScanRequested = true;
  scheduleTick();
}

function requestMenuScan() {
  menuScanRequested = true;
  scheduleTick();
}

/** Shadow roots need their own observers: document records never include them. */
const menuShadowObservers = createShadowObserverRegistry({
  observe: (shadow) => {
    new MutationObserver(requestMenuScan).observe(shadow, {
      childList: true,
      subtree: true,
    });
  },
});

function ensureMenuObservers() {
  document.querySelectorAll(MENU_TAG).forEach((menu) => menuShadowObservers.attach(menu));
}

function touchesAccountMenu(node, target) {
  return (
    node.matches?.(ACCOUNT_MENU_SELECTOR) ||
    !!node.closest?.(MENU_TAG) ||
    !!target?.closest?.(MENU_TAG)
  );
}

/** Scan comments inside the comments view when it exists, else the document. */
function getCommentsRoot() {
  return document.querySelector('ytd-comments') || document;
}

function flush() {
  scheduled = false;

  if (menuScanRequested) {
    menuScanRequested = false;
    ensureMenuObservers();
    ensureAccountMenuInserted();
  }

  if (fullScanRequested) {
    fullScanRequested = false;
    pendingNodes.clear();
    processNewComments(getCommentsRoot());
    return;
  }

  const nodes = pendingNodes.take();
  if (nodes === null) {
    // Queue overflowed while the tab was hidden: one full pass instead.
    processNewComments(getCommentsRoot());
    return;
  }
  for (const node of nodes) processCommentNode(node);
}

function onMutations(records) {
  // rAF is paused in a hidden tab; queueing there would pin detached nodes
  // for the whole session, so ask for a single full pass on return instead.
  if (document.hidden) {
    requestFullScan();
    return;
  }

  for (const record of records) {
    for (const node of record.addedNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue;
      pendingNodes.push(node);
      if (!menuScanRequested && touchesAccountMenu(node, record.target)) {
        requestMenuScan();
      }
    }
  }
  if (pendingNodes.size || pendingNodes.overflowed || menuScanRequested) scheduleTick();
}

export function startObserver() {
  const observer = new MutationObserver(onMutations);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // YouTube swaps page content without a reload; do a full pass on navigation.
  document.addEventListener('yt-navigate-finish', requestFullScan);

  // Initial pass + safety net for updates the observer cannot see
  // (e.g. #author-text filled in without a childList mutation).
  requestFullScan();
  setInterval(requestFullScan, SAFETY_RESCAN_MS);

  return observer;
}

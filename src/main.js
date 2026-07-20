import './styles/main.css';
import { ROOT_ATTR } from './constants.js';
import { bindAccountMenuEscape } from './features/settings-menu.js';
import { startObserver } from './features/observer.js';

function init() {
  if (document.documentElement.hasAttribute(ROOT_ATTR)) return;
  document.documentElement.setAttribute(ROOT_ATTR, '1');

  bindAccountMenuEscape();
  startObserver();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

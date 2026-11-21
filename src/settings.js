import { GM_getValue, GM_setValue } from '$';
import { createSettingsStore } from './settings-store.js';

const store = createSettingsStore({
  getValue: (key, fallback) => GM_getValue(key, fallback),
  setValue: (key, value) => GM_setValue(key, value),
});

export function getMode() {
  return store.getMode();
}

export function setMode(mode) {
  store.setMode(mode);
}

export function getShowScoreBadge() {
  return store.getShowScoreBadge();
}

export function setShowScoreBadge(show) {
  store.setShowScoreBadge(show);
}

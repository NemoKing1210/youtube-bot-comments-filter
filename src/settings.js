import { GM_getValue, GM_setValue } from '$';
import {
  DEFAULT_MODE,
  DEFAULT_SHOW_SCORE,
  STORAGE_KEY_MODE,
  STORAGE_KEY_SHOW_SCORE,
} from './constants.js';

export function getMode() {
  return GM_getValue(STORAGE_KEY_MODE, DEFAULT_MODE);
}

export function setMode(mode) {
  GM_setValue(STORAGE_KEY_MODE, mode);
}

export function getShowScoreBadge() {
  return GM_getValue(STORAGE_KEY_SHOW_SCORE, DEFAULT_SHOW_SCORE) !== false;
}

export function setShowScoreBadge(show) {
  GM_setValue(STORAGE_KEY_SHOW_SCORE, !!show);
}

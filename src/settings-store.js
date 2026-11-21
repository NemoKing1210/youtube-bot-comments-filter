import {
  DEFAULT_MODE,
  DEFAULT_SHOW_SCORE,
  STORAGE_KEY_MODE,
  STORAGE_KEY_SHOW_SCORE,
} from './constants.js';

const VALID_MODES = new Set(['hide', 'blur']);

/**
 * Preference store with a read-through cache.
 *
 * GM_getValue is synchronous and comparatively expensive, and comments are
 * scored in bulk, so storage is read at most once per key per session.
 * Cross-tab changes are not observed — an acceptable trade-off for two
 * preferences; the setters keep the cache in sync in this tab.
 */
export function createSettingsStore({ getValue, setValue }) {
  let cache = null;

  function read() {
    if (cache) return cache;
    const storedMode = getValue(STORAGE_KEY_MODE, DEFAULT_MODE);
    cache = {
      mode: VALID_MODES.has(storedMode) ? storedMode : DEFAULT_MODE,
      // Strict comparison: an older version or manager may have stored "false".
      showScore: getValue(STORAGE_KEY_SHOW_SCORE, DEFAULT_SHOW_SCORE) === true,
    };
    return cache;
  }

  return {
    getMode: () => read().mode,
    setMode(mode) {
      if (!VALID_MODES.has(mode)) return;
      read().mode = mode;
      setValue(STORAGE_KEY_MODE, mode);
    },
    getShowScoreBadge: () => read().showScore,
    setShowScoreBadge(show) {
      const value = !!show;
      read().showScore = value;
      setValue(STORAGE_KEY_SHOW_SCORE, value);
    },
  };
}

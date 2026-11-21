import { LOCALES } from './locales.js';

/** Map a BCP-47 tag (e.g. `pt-BR`) to a supported base locale, else `en`. */
export function resolveLang(htmlLang, browserLang) {
  for (const value of [htmlLang, browserLang]) {
    const code = (value || '').split('-')[0].toLowerCase();
    if (LOCALES[code]) return code;
  }
  return 'en';
}

export function detectLang() {
  // Prefer YouTube's own UI language so our labels match the surrounding menu.
  const htmlLang = typeof document !== 'undefined' ? document.documentElement.lang : '';
  const browserLang = typeof navigator !== 'undefined' ? navigator.language : '';
  return resolveLang(htmlLang, browserLang);
}

const LANG = detectLang();

export function t(key) {
  return (LOCALES[LANG] && LOCALES[LANG][key]) || LOCALES.en[key] || key;
}

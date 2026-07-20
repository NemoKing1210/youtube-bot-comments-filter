import { LOCALES } from './locales.js';

export { LOCALES };

export function detectLang() {
  const browserLang = (navigator.language || 'en').split('-')[0].toLowerCase();
  return LOCALES[browserLang] ? browserLang : 'en';
}

const LANG = detectLang();

export function t(key) {
  return (LOCALES[LANG] && LOCALES[LANG][key]) || LOCALES.en[key] || key;
}

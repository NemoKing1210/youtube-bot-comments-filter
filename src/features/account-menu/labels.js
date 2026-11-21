import { t } from '../../i18n/index.js';

/** Subtitle for the account-menu entry: the current mode, localized. */
export function labelForMode(mode) {
  return mode === 'hide' ? t('hide') : t('blur');
}

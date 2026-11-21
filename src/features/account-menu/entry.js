import { ICON_PATHS } from '../../constants.js';
import { t } from '../../i18n/index.js';
import { getMode } from '../../settings.js';
import { createSvgIcon } from '../../ui/icons.js';
import { labelForMode } from './labels.js';

/** Localized "Settings" / "Настройки" / … labels used to place our entry. */
const SETTINGS_LABELS = new Set([
  'settings',
  'настройки',
  'einstellungen',
  'paramètres',
  'ajustes',
  'configurações',
  '設定',
  '设置',
  'الإعدادات',
  'सेटिंग',
]);

export function updateAccountEntryLabels(root = document) {
  // Resolve once per pass instead of once per entry.
  const title = t('menuTitle');
  const modeLabel = labelForMode(getMode());
  root.querySelectorAll('#ytbf-account-entry').forEach((entry) => {
    const label = entry.querySelector('.ytbf-account-link-label');
    const subtitle = entry.querySelector('.ytbf-account-link-subtitle');
    if (label) label.textContent = title;
    if (subtitle) subtitle.textContent = modeLabel;
    entry.setAttribute('aria-label', `${title}: ${modeLabel}`);
  });
}

export function buildAccountEntry({ onOpen }) {
  const section = document.createElement('div');
  section.id = 'ytbf-account-section';
  section.className = 'ytbf-account-section style-scope ytd-multi-page-menu-renderer';

  const link = document.createElement('button');
  link.type = 'button';
  link.id = 'ytbf-account-entry';
  link.className = 'ytbf-account-link';
  link.setAttribute('role', 'menuitem');
  link.setAttribute('aria-haspopup', 'menu');
  link.setAttribute('aria-expanded', 'false');

  const textWrap = document.createElement('div');
  textWrap.className = 'ytbf-account-link-text';

  const label = document.createElement('div');
  label.className = 'ytbf-account-link-label';
  label.textContent = t('menuTitle');

  const subtitle = document.createElement('div');
  subtitle.className = 'ytbf-account-link-subtitle';
  subtitle.textContent = labelForMode(getMode());

  textWrap.appendChild(label);
  textWrap.appendChild(subtitle);

  link.appendChild(createSvgIcon(ICON_PATHS.filter, 'ytbf-account-link-icon'));
  link.appendChild(textWrap);
  link.appendChild(createSvgIcon(ICON_PATHS.caret, 'ytbf-account-link-caret'));
  link.setAttribute('aria-label', `${t('menuTitle')}: ${labelForMode(getMode())}`);

  link.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    onOpen();
  });

  section.appendChild(link);
  return section;
}

export function findSettingsSection(sections) {
  const sectionRenderers = sections.querySelectorAll('yt-multi-page-menu-section-renderer');
  for (const section of sectionRenderers) {
    const labels = section.querySelectorAll('#label, yt-formatted-string');
    for (const el of labels) {
      const text = (el.textContent || '').trim().toLowerCase();
      if (SETTINGS_LABELS.has(text)) return section;
    }
  }
  return null;
}

export function isAccountMenuRenderer(el) {
  if (!el || el.tagName !== 'YTD-MULTI-PAGE-MENU-RENDERER') return false;
  if (el.getAttribute('menu-style') === 'multi-page-menu-style-type-system') return true;
  // Fallback: system account menu always has the active-account header
  return !!el.shadowRoot?.querySelector?.('ytd-active-account-header-renderer')
    || !!el.querySelector?.('ytd-active-account-header-renderer');
}

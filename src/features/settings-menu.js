import {
  ACCOUNT_MENU_SELECTOR,
  ICON_PATHS,
} from '../constants.js';
import { t } from '../i18n/index.js';
import { getMode, getShowScoreBadge, setMode, setShowScoreBadge } from '../settings.js';
import { reapplyModeToFlaggedComments, reapplyScoreBadges } from './comments.js';

let activeAccountMenu = null;
let submenuOpen = false;

function createSvgIcon(pathD, className) {
  const icon = document.createElement('span');
  icon.className = className;
  icon.setAttribute('aria-hidden', 'true');

  const shell = document.createElement('div');
  shell.style.width = '100%';
  shell.style.height = '100%';
  shell.style.display = 'block';
  shell.style.fill = 'currentcolor';

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('height', '24');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '24');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.pointerEvents = 'none';
  svg.style.display = 'inherit';
  svg.style.width = '100%';
  svg.style.height = '100%';

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathD);

  svg.appendChild(path);
  shell.appendChild(svg);
  icon.appendChild(shell);
  return icon;
}

function labelForMode(mode) {
  return mode === 'hide' ? t('hide') : t('blur');
}

function removeLegacyCommentsPanelUi() {
  document.querySelectorAll('#ytbf-menu-wrap, #ytbf-toggle-wrap, #ytbf-dropdown').forEach((el) => {
    el.remove();
  });
}

function updateAccountEntryLabels(root = document) {
  root.querySelectorAll('#ytbf-account-entry').forEach((entry) => {
    const label = entry.querySelector('.ytbf-account-link-label');
    const subtitle = entry.querySelector('.ytbf-account-link-subtitle');
    if (label) label.textContent = t('menuTitle');
    if (subtitle) subtitle.textContent = labelForMode(getMode());
    entry.setAttribute('aria-label', `${t('menuTitle')}: ${labelForMode(getMode())}`);
  });
}

function updateSubmenuSelection(submenu) {
  if (!submenu) return;
  const mode = getMode();
  const title = submenu.querySelector('.ytbf-submenu-title');
  if (title) title.textContent = t('menuTitle');

  submenu.querySelectorAll('.ytbf-submenu-item[data-mode]').forEach((item) => {
    const selected = item.dataset.mode === mode;
    item.setAttribute('aria-checked', selected ? 'true' : 'false');
    const label = item.querySelector('.ytbf-submenu-item-label');
    if (label) {
      label.textContent = item.dataset.mode === 'hide' ? t('hideOption') : t('blurOption');
    }
  });

  const scoreItem = submenu.querySelector('.ytbf-submenu-item[data-setting="show-score"]');
  if (scoreItem) {
    scoreItem.setAttribute('aria-checked', getShowScoreBadge() ? 'true' : 'false');
    const label = scoreItem.querySelector('.ytbf-submenu-item-label');
    if (label) label.textContent = t('showScoreOption');
  }
}

function getMenuRoot(menuRenderer) {
  return menuRenderer.shadowRoot || menuRenderer;
}

function getMenuParts(menuRenderer) {
  const candidates = [];
  if (menuRenderer.shadowRoot) candidates.push(menuRenderer.shadowRoot);
  candidates.push(menuRenderer);

  for (const root of candidates) {
    const sections = root.querySelector('#sections');
    if (!sections) continue;
    return {
      root,
      container: root.querySelector('#container'),
      submenuHost: root.querySelector('#submenu'),
      sections,
    };
  }

  const root = getMenuRoot(menuRenderer);
  return {
    root,
    container: root.querySelector('#container'),
    submenuHost: root.querySelector('#submenu'),
    sections: null,
  };
}

function closeYtbfSubmenu(menuRenderer) {
  if (!menuRenderer) return;
  const { root, container, submenuHost } = getMenuParts(menuRenderer);
  const submenu = root.querySelector('#ytbf-submenu');

  if (submenu) submenu.remove();
  if (submenuHost) {
    submenuHost.hidden = true;
    submenuHost.replaceChildren();
  }
  if (container) container.hidden = false;

  if (activeAccountMenu === menuRenderer) {
    submenuOpen = false;
  }
}

function selectMode(mode, menuRenderer) {
  if (mode !== 'hide' && mode !== 'blur') return;
  if (getMode() !== mode) {
    setMode(mode);
    reapplyModeToFlaggedComments();
  }
  updateAccountEntryLabels(getMenuRoot(menuRenderer) || document);
  const submenu = menuRenderer && getMenuRoot(menuRenderer).querySelector('#ytbf-submenu');
  updateSubmenuSelection(submenu);
  closeYtbfSubmenu(menuRenderer);
}

function toggleShowScore(menuRenderer) {
  setShowScoreBadge(!getShowScoreBadge());
  reapplyScoreBadges();
  const submenu = menuRenderer && getMenuRoot(menuRenderer).querySelector('#ytbf-submenu');
  updateSubmenuSelection(submenu);
}

function buildSubmenuItem(mode, iconPath, menuRenderer) {
  const item = document.createElement('button');
  item.type = 'button';
  item.className = 'ytbf-submenu-item';
  item.dataset.mode = mode;
  item.setAttribute('role', 'menuitemradio');
  item.setAttribute('aria-checked', 'false');

  const label = document.createElement('span');
  label.className = 'ytbf-submenu-item-label';
  label.textContent = mode === 'hide' ? t('hideOption') : t('blurOption');

  item.appendChild(createSvgIcon(iconPath, 'ytbf-submenu-item-icon'));
  item.appendChild(label);
  item.appendChild(createSvgIcon(ICON_PATHS.check, 'ytbf-submenu-item-check'));

  item.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    selectMode(mode, menuRenderer);
  });

  return item;
}

function buildShowScoreItem(menuRenderer) {
  const item = document.createElement('button');
  item.type = 'button';
  item.className = 'ytbf-submenu-item';
  item.dataset.setting = 'show-score';
  item.setAttribute('role', 'menuitemcheckbox');
  item.setAttribute('aria-checked', getShowScoreBadge() ? 'true' : 'false');

  const label = document.createElement('span');
  label.className = 'ytbf-submenu-item-label';
  label.textContent = t('showScoreOption');

  item.appendChild(createSvgIcon(ICON_PATHS.score, 'ytbf-submenu-item-icon'));
  item.appendChild(label);
  item.appendChild(createSvgIcon(ICON_PATHS.check, 'ytbf-submenu-item-check'));

  item.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleShowScore(menuRenderer);
  });

  return item;
}

function buildSubmenu(menuRenderer) {
  const submenu = document.createElement('div');
  submenu.id = 'ytbf-submenu';
  submenu.className = 'ytbf-submenu';
  submenu.setAttribute('role', 'menu');
  submenu.setAttribute('aria-label', t('menuTitle'));

  const header = document.createElement('div');
  header.className = 'ytbf-submenu-header';

  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'ytbf-submenu-back';
  back.title = t('back');
  back.setAttribute('aria-label', t('back'));
  back.appendChild(createSvgIcon(ICON_PATHS.back, 'ytbf-submenu-back-icon'));
  back.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeYtbfSubmenu(menuRenderer);
  });

  const title = document.createElement('div');
  title.className = 'ytbf-submenu-title';
  title.textContent = t('menuTitle');

  header.appendChild(back);
  header.appendChild(title);

  const items = document.createElement('div');
  items.className = 'ytbf-submenu-items';
  items.appendChild(buildSubmenuItem('hide', ICON_PATHS.hide, menuRenderer));
  items.appendChild(buildSubmenuItem('blur', ICON_PATHS.blur, menuRenderer));

  const extras = document.createElement('div');
  extras.className = 'ytbf-submenu-extras';
  extras.appendChild(buildShowScoreItem(menuRenderer));

  submenu.appendChild(header);
  submenu.appendChild(items);
  submenu.appendChild(extras);
  updateSubmenuSelection(submenu);
  return submenu;
}

function openYtbfSubmenu(menuRenderer) {
  const { container, submenuHost } = getMenuParts(menuRenderer);
  if (!container || !submenuHost) return;

  closeYtbfSubmenu(menuRenderer);

  const submenu = buildSubmenu(menuRenderer);
  submenuHost.replaceChildren(submenu);
  container.hidden = true;
  submenuHost.hidden = false;

  activeAccountMenu = menuRenderer;
  submenuOpen = true;

  const selected = submenu.querySelector('.ytbf-submenu-item[aria-checked="true"]');
  if (selected) selected.focus();
  else {
    const back = submenu.querySelector('.ytbf-submenu-back');
    if (back) back.focus();
  }
}

function buildAccountEntry(menuRenderer) {
  const section = document.createElement('div');
  section.id = 'ytbf-account-section';
  section.className = 'ytbf-account-section style-scope ytd-multi-page-menu-renderer';

  const link = document.createElement('button');
  link.type = 'button';
  link.id = 'ytbf-account-entry';
  link.className = 'ytbf-account-link';
  link.setAttribute('role', 'link');
  link.setAttribute('aria-haspopup', 'menu');

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
    openYtbfSubmenu(menuRenderer);
  });

  section.appendChild(link);
  return section;
}

function findSettingsSection(sections) {
  const sectionRenderers = sections.querySelectorAll('yt-multi-page-menu-section-renderer');
  for (const section of sectionRenderers) {
    const labels = section.querySelectorAll('#label, yt-formatted-string');
    for (const el of labels) {
      const text = (el.textContent || '').trim().toLowerCase();
      // "Settings" / "Настройки" / etc. — place our entry just before this section
      if (
        text === 'settings' ||
        text === 'настройки' ||
        text === 'einstellungen' ||
        text === 'paramètres' ||
        text === 'ajustes' ||
        text === 'configurações' ||
        text === '設定' ||
        text === '设置' ||
        text === 'الإعدادات' ||
        text === 'सेटिंग'
      ) {
        return section;
      }
    }
  }
  return null;
}

function isAccountMenuRenderer(el) {
  if (!el || el.tagName !== 'YTD-MULTI-PAGE-MENU-RENDERER') return false;
  if (el.getAttribute('menu-style') === 'multi-page-menu-style-type-system') return true;
  // Fallback: system account menu always has the active-account header
  return !!getMenuRoot(el).querySelector('ytd-active-account-header-renderer');
}

function ensureAccountMenuEntry(menuRenderer) {
  if (!isAccountMenuRenderer(menuRenderer)) return;

  const { root, sections, container, submenuHost } = getMenuParts(menuRenderer);
  if (!sections) return;

  // If YouTube rebuilt the menu, drop a stale submenu view.
  if (submenuOpen && activeAccountMenu === menuRenderer) {
    const stillThere = root.querySelector('#ytbf-submenu');
    if (!stillThere && submenuHost && !submenuHost.hidden) {
      submenuOpen = false;
    }
  }
  if (!menuRenderer.isConnected) {
    closeYtbfSubmenu(menuRenderer);
    return;
  }

  let section = root.querySelector('#ytbf-account-section');
  if (section) {
    updateAccountEntryLabels(section);
    return;
  }

  section = buildAccountEntry(menuRenderer);
  const settingsSection = findSettingsSection(sections);
  if (settingsSection) {
    sections.insertBefore(section, settingsSection);
  } else {
    sections.appendChild(section);
  }

  // Keep container visible if we are not in our submenu
  if (!root.querySelector('#ytbf-submenu') && container) {
    container.hidden = false;
    if (submenuHost) submenuHost.hidden = true;
  }
}

function isDropdownClosed(dropdown) {
  if (!dropdown || !dropdown.isConnected) return true;
  if (dropdown.hasAttribute('hidden')) return true;
  if (dropdown.getAttribute('aria-hidden') === 'true') return true;
  if (dropdown.style.display === 'none') return true;
  // Polymer iron-dropdown exposes `.opened` when upgraded
  if (typeof dropdown.opened === 'boolean' && !dropdown.opened) return true;
  return false;
}

function resetSubmenuIfNeeded() {
  if (!submenuOpen || !activeAccountMenu) return;
  const dropdown = activeAccountMenu.closest('tp-yt-iron-dropdown');
  if (!activeAccountMenu.isConnected || isDropdownClosed(dropdown)) {
    closeYtbfSubmenu(activeAccountMenu);
    activeAccountMenu = null;
  }
}

export function ensureAccountMenuInserted() {
  removeLegacyCommentsPanelUi();
  resetSubmenuIfNeeded();
  document.querySelectorAll(ACCOUNT_MENU_SELECTOR).forEach(ensureAccountMenuEntry);
  // Fallback for builds without menu-style attr
  document.querySelectorAll('ytd-multi-page-menu-renderer').forEach((el) => {
    if (getMenuRoot(el).querySelector('ytd-active-account-header-renderer')) {
      ensureAccountMenuEntry(el);
    }
  });
}

export function bindAccountMenuEscape() {
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key !== 'Escape' || !submenuOpen || !activeAccountMenu) return;
      e.stopPropagation();
      e.preventDefault();
      closeYtbfSubmenu(activeAccountMenu);
    },
    true,
  );
}

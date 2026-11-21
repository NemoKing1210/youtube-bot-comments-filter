import { ACCOUNT_MENU_SELECTOR } from '../constants.js';
import { getMode, getShowScoreBadge, setMode, setShowScoreBadge } from '../settings.js';
import { getMenuParts, getMenuRoot, isDropdownClosed } from './account-menu/dom.js';
import {
  buildAccountEntry,
  findSettingsSection,
  isAccountMenuRenderer,
  updateAccountEntryLabels,
} from './account-menu/entry.js';
import { buildSubmenu, updateSubmenuSelection } from './account-menu/submenu.js';
import { reapplyModeToFlaggedComments, reapplyScoreBadges } from './comments.js';

let activeAccountMenu = null;
let submenuOpen = false;
let legacyUiCleaned = false;

function updateEntryExpanded(menuRenderer, expanded) {
  if (!menuRenderer) return;
  const entry = getMenuRoot(menuRenderer).querySelector('#ytbf-account-entry');
  if (entry) entry.setAttribute('aria-expanded', expanded ? 'true' : 'false');
}

/** Remove UI injected by pre-1.2 versions — once per page. */
function removeLegacyCommentsPanelUi() {
  if (legacyUiCleaned) return;
  legacyUiCleaned = true;
  document.querySelectorAll('#ytbf-menu-wrap, #ytbf-toggle-wrap, #ytbf-dropdown').forEach((el) => {
    el.remove();
  });
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
  updateEntryExpanded(menuRenderer, false);
}

/** Apply a mode choice and keep the submenu open so other settings stay reachable. */
function selectMode(mode, menuRenderer) {
  if (!menuRenderer) return;
  if (mode !== 'hide' && mode !== 'blur') return;
  if (getMode() !== mode) {
    setMode(mode);
    reapplyModeToFlaggedComments();
  }
  const root = getMenuRoot(menuRenderer);
  updateAccountEntryLabels(root);
  updateSubmenuSelection(root.querySelector('#ytbf-submenu'));
}

function toggleShowScore(menuRenderer) {
  setShowScoreBadge(!getShowScoreBadge());
  reapplyScoreBadges();
  if (!menuRenderer) return;
  const submenu = getMenuRoot(menuRenderer).querySelector('#ytbf-submenu');
  updateSubmenuSelection(submenu);
}

function openYtbfSubmenu(menuRenderer) {
  const { container, submenuHost } = getMenuParts(menuRenderer);
  if (!container || !submenuHost) return;

  closeYtbfSubmenu(menuRenderer);

  const submenu = buildSubmenu({
    onClose: () => closeYtbfSubmenu(menuRenderer),
    onModeChange: (mode) => selectMode(mode, menuRenderer),
    onToggleScore: () => toggleShowScore(menuRenderer),
  });
  submenuHost.replaceChildren(submenu);
  container.hidden = true;
  submenuHost.hidden = false;

  activeAccountMenu = menuRenderer;
  submenuOpen = true;
  updateEntryExpanded(menuRenderer, true);

  const selected = submenu.querySelector('.ytbf-submenu-item[aria-checked="true"]');
  if (selected) selected.focus();
  else {
    const back = submenu.querySelector('.ytbf-submenu-back');
    if (back) back.focus();
  }
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
    updateEntryExpanded(menuRenderer, submenuOpen && activeAccountMenu === menuRenderer);
    return;
  }

  section = buildAccountEntry({ onOpen: () => openYtbfSubmenu(menuRenderer) });
  const settingsSection = findSettingsSection(sections);
  if (settingsSection) {
    sections.insertBefore(section, settingsSection);
  } else if (sections.lastElementChild) {
    // Unknown UI language: stay above the last item (usually "Sign out").
    sections.insertBefore(section, sections.lastElementChild);
  } else {
    sections.appendChild(section);
  }

  // Keep container visible if we are not in our submenu
  if (!root.querySelector('#ytbf-submenu') && container) {
    container.hidden = false;
    if (submenuHost) submenuHost.hidden = true;
  }
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

  const seen = new Set();
  document.querySelectorAll(ACCOUNT_MENU_SELECTOR).forEach((el) => {
    seen.add(el);
    ensureAccountMenuEntry(el);
  });
  // Fallback for builds without menu-style attr — skip elements already checked.
  document.querySelectorAll('ytd-multi-page-menu-renderer').forEach((el) => {
    if (seen.has(el)) return;
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

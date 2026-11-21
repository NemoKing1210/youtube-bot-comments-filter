import { ICON_PATHS } from '../../constants.js';
import { t } from '../../i18n/index.js';
import { getMode, getShowScoreBadge } from '../../settings.js';
import { createSvgIcon } from '../../ui/icons.js';

export function updateSubmenuSelection(submenu) {
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

function buildModeItem(mode, iconPath, onModeChange) {
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
    onModeChange(mode);
  });

  return item;
}

function buildShowScoreItem(onToggleScore) {
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
    onToggleScore();
  });

  return item;
}

export function buildSubmenu({ onClose, onModeChange, onToggleScore }) {
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
    onClose();
  });

  const title = document.createElement('div');
  title.className = 'ytbf-submenu-title';
  title.textContent = t('menuTitle');

  header.appendChild(back);
  header.appendChild(title);

  const items = document.createElement('div');
  items.className = 'ytbf-submenu-items';
  items.appendChild(buildModeItem('hide', ICON_PATHS.hide, onModeChange));
  items.appendChild(buildModeItem('blur', ICON_PATHS.blur, onModeChange));

  const extras = document.createElement('div');
  extras.className = 'ytbf-submenu-extras';
  extras.appendChild(buildShowScoreItem(onToggleScore));

  submenu.appendChild(header);
  submenu.appendChild(items);
  submenu.appendChild(extras);
  updateSubmenuSelection(submenu);
  return submenu;
}

import {
  COMMENT_SELECTOR,
  HIDDEN_NOTICE_CLASS,
  PROCESSED_ATTR,
  SCORE_BADGE_MIN_PERCENT,
} from '../constants.js';
import { BotDetector, scoreLevel } from '../detection/bot-detector.js';
import { t } from '../i18n/index.js';
import { getMode, getShowScoreBadge } from '../settings.js';

function shouldShowScoreBadge(percent) {
  return getShowScoreBadge() && percent > SCORE_BADGE_MIN_PERCENT;
}

function getAuthorName(commentEl) {
  const authorLink = commentEl.querySelector('#author-text');
  if (!authorLink) return '';
  return authorLink.textContent.trim();
}

function getCommentHost(commentEl) {
  return commentEl.querySelector('#main') || commentEl;
}

function ensureHiddenNotice(commentEl) {
  const host = getCommentHost(commentEl);
  let notice = host.querySelector(`.${HIDDEN_NOTICE_CLASS}`);
  if (!notice) {
    notice = document.createElement('div');
    notice.className = HIDDEN_NOTICE_CLASS;
    host.appendChild(notice);
  }

  let text = notice.querySelector('.ytbf-hidden-notice-text');
  if (!text) {
    text = document.createElement('span');
    text.className = 'ytbf-hidden-notice-text';
    notice.appendChild(text);
  }
  text.textContent = t('hiddenNotice');
  return notice;
}

function removeHiddenNotice(commentEl) {
  commentEl.querySelectorAll(`.${HIDDEN_NOTICE_CLASS}`).forEach((el) => el.remove());
}

function getScoreBadgeAnchor(commentEl) {
  if (commentEl.classList.contains('ytbf-hide-mode')) {
    const notice = ensureHiddenNotice(commentEl);
    const text = notice.querySelector('.ytbf-hidden-notice-text');
    return { parent: notice, before: text };
  }

  const authorText = commentEl.querySelector('#author-text');
  if (authorText && authorText.parentElement) {
    return { parent: authorText.parentElement, before: authorText };
  }
  const headerAuthor = commentEl.querySelector('#header-author');
  if (headerAuthor) {
    return { parent: headerAuthor, before: headerAuthor.firstChild };
  }
  return { parent: commentEl, before: commentEl.firstChild };
}

function formatBotScore(percent) {
  return t('botScore').replace('{n}', String(percent));
}

function ensureScoreBadge(commentEl, percent) {
  const { parent, before } = getScoreBadgeAnchor(commentEl);

  let badge = commentEl.querySelector('.ytbf-bot-score');
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'ytbf-bot-score';
    badge.setAttribute('role', 'status');

    const dot = document.createElement('span');
    dot.className = 'ytbf-bot-score-dot';
    dot.setAttribute('aria-hidden', 'true');

    const label = document.createElement('span');
    label.className = 'ytbf-bot-score-label';

    badge.append(dot, label);
  }

  if (badge.parentElement !== parent || badge.nextSibling !== before) {
    parent.insertBefore(badge, before);
  }

  badge.dataset.level = scoreLevel(percent);
  badge.title = t('botScoreTooltip');
  badge.setAttribute('aria-label', formatBotScore(percent));

  const label = badge.querySelector('.ytbf-bot-score-label');
  if (label) label.textContent = formatBotScore(percent);
}

function removeScoreBadge(commentEl) {
  commentEl.querySelectorAll('.ytbf-bot-score').forEach((el) => el.remove());
}

function applyHideMode(commentEl) {
  commentEl.classList.remove('ytbf-blur');
  commentEl.classList.add('ytbf-hide-mode');
  ensureHiddenNotice(commentEl);
}

function applyBlurMode(commentEl) {
  commentEl.classList.remove('ytbf-hide-mode');
  removeHiddenNotice(commentEl);
  commentEl.classList.add('ytbf-blur');
}

function applyModeClass(commentEl) {
  commentEl.classList.remove('ytbf-blur', 'ytbf-hide-mode');
  removeHiddenNotice(commentEl);
  if (getMode() === 'hide') {
    applyHideMode(commentEl);
  } else {
    applyBlurMode(commentEl);
  }
}

function clearModeClass(commentEl) {
  commentEl.classList.remove('ytbf-blur', 'ytbf-hide-mode');
  removeHiddenNotice(commentEl);
}

function processComment(commentEl) {
  const author = getAuthorName(commentEl);
  const { total } = BotDetector.score(author);
  const bot = total >= BotDetector.threshold;
  const percent = BotDetector.confidencePercent(total);

  commentEl.setAttribute(PROCESSED_ATTR, '1');
  commentEl.dataset.ytbfBot = bot ? '1' : '0';
  commentEl.dataset.ytbfPercent = String(percent);

  if (bot) {
    applyModeClass(commentEl);
  } else {
    clearModeClass(commentEl);
  }

  if (shouldShowScoreBadge(percent)) {
    ensureScoreBadge(commentEl, percent);
  } else {
    removeScoreBadge(commentEl);
  }
}

/** Process only newly-added (unprocessed) comments — used on every mutation. */
export function processNewComments(root = document) {
  root.querySelectorAll(`${COMMENT_SELECTOR}:not([${PROCESSED_ATTR}])`).forEach(processComment);
}

/**
 * Re-apply the current display mode to already-flagged bot comments —
 * used when the user toggles the mode, no re-detection needed.
 */
export function reapplyModeToFlaggedComments() {
  document.querySelectorAll(`${COMMENT_SELECTOR}[data-ytbf-bot="1"]`).forEach((commentEl) => {
    applyModeClass(commentEl);
    const percent = Number(commentEl.dataset.ytbfPercent) || 0;
    if (shouldShowScoreBadge(percent)) {
      ensureScoreBadge(commentEl, percent);
    } else {
      removeScoreBadge(commentEl);
    }
  });
}

/** Show or remove score badges after the user toggles the setting. */
export function reapplyScoreBadges() {
  document.querySelectorAll(`${COMMENT_SELECTOR}[${PROCESSED_ATTR}]`).forEach((commentEl) => {
    const percent = Number(commentEl.dataset.ytbfPercent) || 0;
    if (shouldShowScoreBadge(percent)) {
      ensureScoreBadge(commentEl, percent);
    } else {
      removeScoreBadge(commentEl);
    }
  });
}

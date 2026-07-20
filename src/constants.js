import pkg from '../package.json' with { type: 'json' };

export const SCRIPT_VERSION = pkg.version;
export const ROOT_ATTR = 'data-ytbf-root';

export const STORAGE_KEY_MODE = 'ytbf_mode'; // 'hide' | 'blur'
export const DEFAULT_MODE = 'hide';

export const STORAGE_KEY_SHOW_SCORE = 'ytbf_show_score';
export const DEFAULT_SHOW_SCORE = false;

export const HIDDEN_NOTICE_CLASS = 'ytbf-hidden-notice';
export const PROCESSED_ATTR = 'data-ytbf-processed';
export const COMMENT_SELECTOR = 'ytd-comment-view-model, ytd-comment-renderer';

export const THRESHOLD = 4;
/** Soft score that maps to 100% confidence (threshold itself lands ~67%). */
export const PERCENT_SCORE_CAP = THRESHOLD + 2;
export const SCORE_BADGE_MIN_PERCENT = 50;

export const SAFETY_RESCAN_MS = 2000;

export const ACCOUNT_MENU_SELECTOR =
  'ytd-multi-page-menu-renderer[menu-style="multi-page-menu-style-type-system"]';

export const EXACT_MATCHES = [
  'SAWS.PW',
  'TLES.TOP',
  'FK59.TOP',
];

/** Common junk TLDs that spam bots stuff into nicknames like a domain. */
export const SPAM_TLDS = [
  'PW', 'TOP', 'XYZ', 'ONLINE', 'SITE', 'CLUB', 'WIN', 'CC', 'ICU',
  'VIP', 'CFD', 'SBS', 'SPACE', 'FUN', 'LIVE', 'MOM', 'CASA', 'MONSTER',
  'CYOU', 'BUZZ', 'WORK', 'RUN', 'STREAM', 'CAM',
];

export const ICON_PATHS = {
  filter:
    'M4.25 5.61C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39C20.25 4.95 19.08 4 18 4H6c-1.08 0-2.25.95-1.75 1.61z',
  caret:
    'M8.793 5.293a1 1 0 000 1.414L14.086 12l-5.293 5.293a1 1 0 101.414 1.414L16.914 12l-6.707-6.707a1 1 0 00-1.414 0Z',
  back:
    'M20.41 11H7.83l4.88-4.88L11.29 4.71 4 12l7.29 7.29 1.42-1.41L7.83 13h12.58v-2z',
  hide:
    'M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z',
  blur:
    'M6 13c0-1.65.67-3.15 1.76-4.24L6.34 7.34A7.95 7.95 0 004 13c0 4.42 3.58 8 8 8a7.95 7.95 0 005.66-2.34l-1.42-1.42A5.98 5.98 0 0112 19c-3.31 0-6-2.69-6-6zm12.66-5.66L17.24 8.76A5.98 5.98 0 0118 13c0 3.31-2.69 6-6 6-.79 0-1.54-.16-2.24-.43l-1.55 1.55c1.15.56 2.43.88 3.79.88 4.42 0 8-3.58 8-8 0-1.36-.32-2.64-.88-3.79zM12 5c.79 0 1.54.16 2.24.43l1.55-1.55A7.95 7.95 0 0012 3C7.58 3 4 6.58 4 11c0 1.36.32 2.64.88 3.79l1.42-1.42A5.98 5.98 0 016 11c0-3.31 2.69-6 6-6zm0 2c-2.21 0-4 1.79-4 4 0 .74.21 1.42.56 2.02L14.02 7.56A3.96 3.96 0 0012 7zm0 8c2.21 0 4-1.79 4-4 0-.74-.21-1.42-.56-2.02L9.98 16.44c.6.35 1.28.56 2.02.56z',
  check:
    'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z',
  score:
    'M7.5 11C9.43 11 11 9.43 11 7.5S9.43 4 7.5 4 4 5.57 4 7.5 5.57 11 7.5 11zm0-5C8.33 6 9 6.67 9 7.5S8.33 9 7.5 9 6 8.33 6 7.5 6.67 6 7.5 6zM16.5 13c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zm0 5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM19.41 5.41 5.41 19.41 6.83 20.83 20.83 6.83z',
};

# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.1] - 2026-11-22

### Added

- Unit tests for the detection engine, settings cache and language resolution (`npm test`, `node:test`), run in CI
- Repository-owned userscript icon (`assets/icon.svg`)

### Changed

- Detection regexes are compiled once instead of per rule call; scoring no longer allocates a match list on the hot path
- New comments are processed from added DOM subtrees; a full pass runs on `yt-navigate-finish` and a 5-second safety interval (was 2 s)
- Settings are cached in memory instead of reading `GM_getValue` for every comment
- Account menu split into focused modules; the entry uses `role="menuitem"` with `aria-expanded`; the submenu stays open after choosing a mode
- UI language is taken from YouTube's `<html lang>` first, then the browser locale
- `@updateURL` now points to the lightweight `.meta.js`
- Blur styles respect `prefers-reduced-motion`

### Fixed

- Comments whose `#author-text` was not rendered yet are retried instead of being permanently skipped
- Reused comment elements are re-scored when their author changes
- Non-boolean stored badge values no longer enable the badge
- Unknown stored modes fall back to `hide`
- The menu entry is placed above the last section when YouTube's UI language is not in the built-in list
- Artifact freshness check now compares against `HEAD`

### Removed

- Dead `SCRIPT_VERSION`, `BotDetector.isBot`, unused `tooltip` locale strings and the `data-ytbf-processed` attribute

## [1.3.0] - 2026-07-20

### Added

- Setting in the account-menu submenu to show or hide the bot confidence % badge (default: off)

## [1.2.0] - 2026-07-20

### Changed

- Settings moved into the YouTube account (avatar) menu as a native-looking entry with submenu
- Choose hide / blur from the submenu (checkmark on the active option); current mode shown as subtitle
- Project restructured for Vite + vite-plugin-monkey builds (`src/`, `npm run build`); version lives in `package.json`

## [1.1.0] - 2026-07-13

### Added

- Bot confidence badge on comments when estimated probability is above 50% (colored indicator: amber / orange / red)
- Localized badge labels and tooltips for all supported UI languages

### Changed

- Blur mode keeps the score badge readable while nickname and comment body stay blurred until hover

## [1.0.3] - 2026-07-10

### Changed

- Toggle button restyled to match YouTube comments header controls (native button + filter funnel icon)
- Toggle labels no longer include emoji prefixes

### Fixed

- Toggle icon creation compatible with YouTube Trusted Types (no `innerHTML`)
- Toggle text and icon colors in dark theme

## [1.0.2] - 2026-07-10

### Changed

- Hide mode no longer removes bot comments entirely — shows a localized placeholder notice instead of the comment body

## [1.0.1] - 2026-07-10

### Fixed

- Bot nicknames like `@FK59.TOP_Haxodui_caut_73` were not detected: `\b` after spam TLD failed when `_` followed the TLD

### Added

- Detection rules: `alnum-digit-before-tld`, `tld-then-translit-suffix`, `trailing-numeric-suffix`
- Transliterated keywords: `_caut_`, `haxodui`, `hodui_caut`
- Exact match entry: `FK59.TOP`

## [1.0.0] - 2026-07-10

### Added

- Bot comment detection by display-name pattern (weighted rule engine with configurable threshold)
- Two display modes: **hide** (remove from view) and **blur** (reveal on hover)
- Toggle chip in the YouTube comments sort panel (`#additional-section`)
- Persistent mode preference via `GM_getValue` / `GM_setValue`
- UI localization for 10 languages based on browser locale (fallback: English)
- Dynamic comment processing for YouTube SPA via `MutationObserver` and periodic rescan
- Tampermonkey / Violentmonkey / Greasemonkey-compatible metadata and auto-update URLs

[1.3.1]: https://github.com/NemoKing1210/youtube-bot-comments-filter/releases/tag/v1.3.1
[1.3.0]: https://github.com/NemoKing1210/youtube-bot-comments-filter/releases/tag/v1.3.0
[1.2.0]: https://github.com/NemoKing1210/youtube-bot-comments-filter/releases/tag/v1.2.0
[1.1.0]: https://github.com/NemoKing1210/youtube-bot-comments-filter/releases/tag/v1.1.0
[1.0.3]: https://github.com/NemoKing1210/youtube-bot-comments-filter/releases/tag/v1.0.3
[1.0.2]: https://github.com/NemoKing1210/youtube-bot-comments-filter/releases/tag/v1.0.2
[1.0.1]: https://github.com/NemoKing1210/youtube-bot-comments-filter/releases/tag/v1.0.1
[1.0.0]: https://github.com/NemoKing1210/youtube-bot-comments-filter/releases/tag/v1.0.0

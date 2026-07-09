# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-10

### Added

- Bot comment detection by display-name pattern (weighted rule engine with configurable threshold)
- Two display modes: **hide** (remove from view) and **blur** (reveal on hover)
- Toggle chip in the YouTube comments sort panel (`#additional-section`)
- Persistent mode preference via `GM_getValue` / `GM_setValue`
- UI localization for 10 languages based on browser locale (fallback: English)
- Dynamic comment processing for YouTube SPA via `MutationObserver` and periodic rescan
- Tampermonkey / Violentmonkey / Greasemonkey-compatible metadata and auto-update URLs

[1.0.0]: https://github.com/NemoKing1210/youtube-bot-comments-filter/releases/tag/v1.0.0

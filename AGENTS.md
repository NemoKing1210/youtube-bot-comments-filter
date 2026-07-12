# AGENTS.md — YouTube Bot Comments Filter

Instructions for AI coding agents working in this repository.

## Project overview

Userscript that hides or blurs spam bot comments on YouTube by scoring commenter **display names** (not comment text). Toggle chip in the comments sort panel switches between `hide` and `blur`. Preference persists via `GM_getValue` / `GM_setValue`.

Compatible with Tampermonkey, Violentmonkey, Greasemonkey, ScriptCat, and similar managers.

## Repository layout

| File | Role |
|------|------|
| `youtube-bot-comments-filter.user.js` | Canonical installable script (`@downloadURL` / `@updateURL`) |
| `youtube-bot-comments-filter.meta.js` | Metadata-only mirror for faster update checks |
| `README.md` | User-facing docs and install instructions |
| `CHANGELOG.md` | Version history |
| `LICENSE` | MIT |

Keep the project a single-file userscript. Do not introduce a build step, bundler, TypeScript, or multi-file app structure unless explicitly requested.

## Architecture (sections in the userscript)

1. **Settings / storage** — `STORAGE_KEY_MODE`, `getMode` / `setMode`
2. **i18n** — `LOCALES`, `detectLang`, `t()`
3. **Bot detection** — `EXACT_MATCHES`, `SPAM_TLDS`, `RULES`, `THRESHOLD`, `BotDetector`
4. **CSS** — injected `<style>` for `.ytbf-hidden` / `.ytbf-blur` / toggle chip
5. **DOM helpers** — find author names, apply/remove filter classes
6. **Toggle UI** — chip in comments header (`#additional-section`)
7. **Observer** — `MutationObserver` + debounced `requestAnimationFrame` passes + safety interval

Preserve this section order and the existing IIFE + `'use strict'` wrapper.

## Coding conventions

- Plain ES5/ES6 JavaScript suitable for userscript managers (no modules, no JSX, no TypeScript).
- Prefer small, named functions; keep detection rules as `{ name, weight, test(name) }` objects.
- Prefix CSS classes and storage keys with `ytbf-` / `ytbf_`.
- Match existing indentation (2 spaces) and comment style (section banners with `====`).
- Do not add network requests, analytics, or extra `@grant` permissions unless required and documented.
- Do not hardcode local `http://localhost` URLs into committed `@updateURL` / `@downloadURL`.

## Extending bot detection

- Add exact spam substrings to `EXACT_MATCHES`.
- Add TLDs to `SPAM_TLDS` when bots abuse new domains.
- Push new rule objects into `RULES`; default flag threshold is `THRESHOLD = 4`.
- Detection must stay nickname-based unless the user asks to change that model.
- Prefer weighted heuristics over brittle single-regex “catch-all” patterns; avoid false positives on normal usernames.

## i18n

- UI strings live in `LOCALES` (ISO 639-1 keys). Metadata `@name` / `@description` are separate and must stay in sync when adding languages.
- When adding a language: add `LOCALES` entry **and** corresponding `// @name:xx` / `// @description:xx` header tags.
- Fallback language is English.

## Releases

When shipping a version bump:

1. Bump `@version` in **both** `youtube-bot-comments-filter.user.js` and `youtube-bot-comments-filter.meta.js` (keep metadata fields aligned).
2. Add an entry to `CHANGELOG.md`.
3. Do not invent a release process beyond what README documents.

## Local testing

- Prefer Violentmonkey with **Track local file** against `youtube-bot-comments-filter.user.js`.
- Verify on a YouTube watch page with comments: toggle chip appears, hide/blur modes work, SPA navigation still filters new comments.
- Check light and dark YouTube themes for toggle styling (`var(--yt-spec-*)`).

## Do not

- Rewrite the script into a browser extension unless asked.
- Remove multilingual metadata or UI locales casually.
- Commit secrets, personal manager configs, or temporary localhost update URLs.
- Change `@namespace`, `@homepageURL`, or raw GitHub update URLs without an explicit request.

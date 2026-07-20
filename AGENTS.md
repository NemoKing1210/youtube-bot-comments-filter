# AGENTS.md — YouTube Bot Comments Filter

Instructions for AI coding agents working in this repository.

## Project

Userscript that hides or blurs spam bot comments on YouTube by scoring commenter **display names** (not comment text). A settings entry in the YouTube account (avatar) menu opens a submenu to switch between `hide` and `blur`. Preference persists via `GM_getValue` / `GM_setValue`.

Compatible with Tampermonkey, Violentmonkey, Greasemonkey, [ScriptCat](https://scriptcat.org/), and similar managers.

Built with [Vite](https://vitejs.dev/) + [vite-plugin-monkey](https://github.com/lisonge/vite-plugin-monkey).

- **Source:** `src/main.js`
- **Canonical install artifacts (committed):** `youtube-bot-comments-filter.user.js`, `youtube-bot-comments-filter.meta.js` (also `@downloadURL` / `@updateURL`)
- **Version source of truth:** `package.json` `version` (userscript header + `SCRIPT_VERSION`)
- **Docs:** `README.md`, `CHANGELOG.md` (Keep a Changelog + SemVer)
- **License:** MIT

Edit source under `src/`, then run `npm run build` to refresh the root install files. Do not hand-edit the built `.user.js` / `.meta.js`.

## Repository layout

```text
youtube-bot-comments-filter/
├── src/
│   ├── main.js                 # Bootstrap / init
│   ├── constants.js            # Keys, thresholds, icon paths
│   ├── settings.js             # getMode / setMode (GM storage)
│   ├── i18n/                   # LOCALES + t()
│   ├── detection/              # RULES + BotDetector
│   ├── styles/                 # CSS (injected via vite-plugin-monkey)
│   └── features/               # Comments, account-menu settings, observer
├── scripts/
│   ├── copy-dist.mjs           # Copies dist → root after build
│   ├── verify-artifacts.mjs    # CI: dist ↔ root + git freshness
│   └── lib/artifacts.mjs       # Shared artifact filenames
├── .github/
│   ├── workflows/ci.yml        # Build + verify committed artifacts
│   └── dependabot.yml
├── dist/                       # Vite output (gitignored)
├── youtube-bot-comments-filter.user.js   # Built installable userscript
├── youtube-bot-comments-filter.meta.js   # Built metadata-only mirror
├── package.json
├── vite.config.js
├── README.md
├── CHANGELOG.md
├── LICENSE
├── AGENTS.md                   # This file (cross-tool agent instructions)
└── CLAUDE.md                   # Claude Code entry → imports AGENTS.md
```

## Architecture (high level)

1. Match YouTube at `document-idle`.
2. Inject styles; observe DOM via `MutationObserver` + debounced `requestAnimationFrame` + safety interval.
3. Score each comment author's display name with weighted `RULES`; apply hide notice or blur when score ≥ `THRESHOLD`.
4. Optional confidence badge when estimated probability > 50%.
5. Account avatar menu (`ytd-multi-page-menu-renderer`): native-looking entry → hide/blur submenu + optional bot % badge toggle.

## Conventions

- Vanilla JS ESM modules under `src/`; no frameworks. Import GM APIs from `$` (`vite-plugin-monkey/dist/client`).
- Prefer existing patterns: constants in `constants.js`, locale strings in `i18n/`, UI hooks in `features/`, detection in `detection/`.
- Prefix CSS classes and storage keys with `ytbf-` / `ytbf_`.
- Do not expand `@grant` beyond what is needed (declare in `vite.config.js` `userscript`; grants also auto-detected from `$` imports).
- Userscript metadata lives in `vite.config.js` — not hand-written in built files.
- Do not commit localhost `@updateURL` / `@downloadURL` values.
- After changing source or metadata, run `npm run build` so root `.user.js` / `.meta.js` stay in sync.
- Production builds minify JS/CSS (`vite.config.js` → terser); edit `src/` for readable code, not the committed bundle.

## Extending bot detection

- Add exact spam substrings to `EXACT_MATCHES` in `constants.js`.
- Add TLDs to `SPAM_TLDS` when bots abuse new domains.
- Push new rule objects into `RULES` in `detection/bot-detector.js`; default flag threshold is `THRESHOLD = 4`.
- Detection must stay nickname-based unless the user asks to change that model.
- Prefer weighted heuristics over brittle single-regex “catch-all” patterns; avoid false positives on normal usernames.

## Releases

When shipping a user-visible change:

1. Bump `version` in `package.json` (single source of truth for `@version` and `SCRIPT_VERSION`).
2. Run `npm run build` to regenerate `youtube-bot-comments-filter.user.js` and `.meta.js`.
3. Add a Keep a Changelog entry in `CHANGELOG.md`.
4. Update README version badge / docs if they mention the version or new behavior.

## Localization

UI locales: `en`, `ru`, `es`, `fr`, `de`, `pt`, `zh`, `ja`, `ar`, `hi` (browser locale; fallback English).

- Add every new user-facing string to **all** `LOCALES` entries in `i18n/locales.js`.
- Keep localized `@name` / `@description` in `vite.config.js` aligned when changing the product description.

## Do not

- Hand-edit committed `youtube-bot-comments-filter.user.js` / `.meta.js` (always rebuild).
- Add TypeScript or a frontend framework unless explicitly requested.
- Rewrite the script into a browser extension unless asked.
- Remove multilingual metadata or UI locales casually.
- Change `@namespace`, `@homepageURL`, or raw GitHub update URLs without an explicit request.
- Imply affiliation with Google / YouTube in docs or UI copy.

## Local testing

```bash
npm install
npm run dev      # Vite serve — install the generated server userscript (prefix "dev:")
npm run build    # Production bundle → dist/ + copy to repo root
npm run ci       # build + verify committed artifacts match (same as GitHub Actions)
```

- **Violentmonkey / Tampermonkey / ScriptCat:** install from the Vite open URL during `npm run dev`, or from the built root `youtube-bot-comments-filter.user.js` after `npm run build`.
- Verify on a YouTube watch page with comments: account-menu settings work, hide/blur modes work, SPA navigation still filters new comments.
- Check light and dark YouTube themes (`var(--yt-spec-*)`).
- Do not commit temporary localhost `@updateURL` / `@downloadURL` values.
- CI (`.github/workflows/ci.yml`) runs `npm ci` → `npm run ci` on pushes/PRs to `main` (`CI=true` enables the git freshness check). If it fails, rebuild and commit the root `.user.js` / `.meta.js`. Locally, `npm run ci` checks `dist` ↔ root; pass `--git` to `verify:artifacts` (or set `CI=true`) to also require a clean working tree vs HEAD.

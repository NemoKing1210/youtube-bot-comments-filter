# YouTube Bot Comments Filter

[![CI](https://github.com/NemoKing1210/youtube-bot-comments-filter/actions/workflows/ci.yml/badge.svg)](https://github.com/NemoKing1210/youtube-bot-comments-filter/actions/workflows/ci.yml)
[![Install userscript](https://img.shields.io/badge/Install-userscript-ff0000?style=for-the-badge)](https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.3.0-green?style=for-the-badge)](CHANGELOG.md)

A userscript for YouTube that detects spam bot comments by nickname pattern and hides or blurs them. Settings live in the YouTube account (avatar) menu — open **Bot filter** and choose **hide** or **blur**.

Compatible with [Tampermonkey](https://www.tampermonkey.net/), [Violentmonkey](https://violentmonkey.github.io/), [Greasemonkey](https://www.greasespot.net/), [ScriptCat](https://scriptcat.org/), and other managers that support the `// ==UserScript==` metadata block.

## Quick install

1. Install a userscript manager (Tampermonkey or Violentmonkey recommended).
2. Click the install link below — your manager should open an installation prompt.

**Install URL:**

```
https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js
```

[![Install](https://img.shields.io/badge/⬇_Install-YouTube_Bot_Comments_Filter-0f0f0f?style=for-the-badge&labelColor=ff0000)](https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js)

### Install from URL (dashboard)

| Manager | Path |
|---------|------|
| Tampermonkey | Dashboard → **Utilities** → **Install from URL** |
| Violentmonkey | Dashboard → **+** → **Install from URL** |
| Greasemonkey | Add-on menu → **New User Script** → paste the raw URL |
| ScriptCat | Install the [extension](https://scriptcat.org/) and use the GitHub raw URL |

Paste the [install URL](#quick-install) above.

### Manual install

1. Open the built [`youtube-bot-comments-filter.user.js`](youtube-bot-comments-filter.user.js) in this repository (or run `npm run build` after cloning).
2. Copy the entire file contents.
3. In your userscript manager, create a new script and paste the code.
4. Save and enable the script.

## Updates

The script includes `@updateURL` and `@downloadURL` metadata pointing to the raw GitHub file. Supported managers check for updates automatically.

**To release a new version:**

1. Bump `version` in [`package.json`](package.json).
2. Run `npm run build` (regenerates root `youtube-bot-comments-filter.user.js` / `.meta.js`).
3. Add an entry to [`CHANGELOG.md`](CHANGELOG.md).
4. Push to `main` (or create a GitHub Release).

## Features

- **Bot detection by nickname** — weighted rule engine scores commenter display names (e.g. `@SAWS.PW__TyT_Ha_CauT_05`)
- **Hide mode** — bot comment body is replaced by a localized placeholder notice
- **Blur mode** — bot comments stay in place but are blurred and dimmed; hover to reveal
- **Account-menu settings** — entry in the avatar menu with hide/blur options and a toggle for the bot % badge
- **Confidence badge** — estimated bot probability when above 50% (amber / orange / red); can be turned off in settings
- **Persistent preference** — selected mode is saved between sessions
- **YouTube-like styling** — uses YouTube CSS variables for light/dark theme compatibility
- **10 UI languages** — English, Russian, Spanish, French, German, Portuguese, Chinese, Japanese, Arabic, Hindi (detected from browser locale)

## Supported pages

| Site | URL pattern |
|------|-------------|
| YouTube | `https://www.youtube.com/*` |

Works on watch pages, Shorts with comments, and any YouTube view that renders the standard comments section (`ytd-comment-view-model` / `ytd-comment-renderer`).

## Display modes

| Mode | Behavior |
|------|----------|
| **Hide** (default) | Comment body is replaced by a short notice; layout stays stable |
| **Blur** | Bot comments appear blurred, grayscale, and semi-transparent; full content shows on hover |

Open your avatar menu → **Bot filter** → choose a mode. The subtitle under the menu entry shows the current mode.

## How it works

```
YouTube page loads
       │
       ▼
MutationObserver + periodic rescan (SPA-safe)
       │
       ▼
Ensure account-menu settings entry when the avatar menu opens
       │
       ▼
For each new comment (ytd-comment-view-model / ytd-comment-renderer)
       │
       ▼
Read author display name (#author-text)
       │
       ▼
Run BotDetector rules → sum weights
       │
       ├── score < threshold ──► leave comment unchanged
       │
       └── score ≥ threshold ──► apply hide notice or blur
```

### Bot detection

Detection is based on the commenter's **display name**, not comment text. Each rule has a name, weight, and `test(name)` function. The total score is the sum of matched rule weights. If the total is **≥ 4** (default threshold), the comment is flagged as a bot.

Built-in signals include:

| Signal | Weight | Example |
|--------|--------|---------|
| Domain-like prefix with spam TLD | 3 | `@SAWS.PW__...`, `@TLES.TOP-...` |
| Separator right after TLD | 2 | `.PW__`, `.TOP-` |
| Transliterated spam keywords | 3 | `tyt_ha`, `na_caut`, `smotri`, `4ki_na` |
| Many underscores | 1 | three or more `_` in the name |
| Leetspeak digit in word | 1 | `Sy4ki`, `CauT0` |
| ALLCAPS prefix with dot | 1 | `@SAWS.PW` |
| Exact match list | 100 | `SAWS.PW`, `TLES.TOP` |

Spam TLDs checked: `PW`, `TOP`, `XYZ`, `ONLINE`, `SITE`, `CLUB`, `WIN`, `CC`, `ICU`, `VIP`, and others commonly abused in bot nicknames.

To extend detection, edit `EXACT_MATCHES` / `SPAM_TLDS` in [`src/constants.js`](src/constants.js) or push new objects into `RULES` in [`src/detection/bot-detector.js`](src/detection/bot-detector.js).

### Dynamic content

YouTube loads comments asynchronously (infinite scroll, replies, navigation without full reload). A `MutationObserver` on `document.documentElement` schedules debounced passes via `requestAnimationFrame`. A 2-second safety interval catches any missed mutations.

## Repository layout

```text
youtube-bot-comments-filter/
├── src/                                      # Source (edit here)
│   ├── main.js
│   ├── constants.js
│   ├── settings.js
│   ├── i18n/
│   ├── detection/
│   ├── styles/
│   └── features/
├── scripts/                                  # Build helpers
├── youtube-bot-comments-filter.user.js       # Built installable userscript
├── youtube-bot-comments-filter.meta.js       # Built metadata-only mirror
├── package.json
├── vite.config.js
├── README.md
├── CHANGELOG.md
└── LICENSE
```

| File | Purpose |
|------|---------|
| `src/` | Editable source modules |
| `youtube-bot-comments-filter.user.js` | Built script served at `@downloadURL` / `@updateURL` |
| `youtube-bot-comments-filter.meta.js` | Lightweight metadata mirror for update checks |
| `vite.config.js` | Userscript metadata + Vite / monkey config |

## Script metadata

Key `// ==UserScript==` fields (generated from `vite.config.js` + `package.json`):

| Field | Value |
|-------|-------|
| `@namespace` | `https://github.com/NemoKing1210/youtube-bot-comments-filter` |
| `@version` | From `package.json` |
| `@updateURL` / `@downloadURL` | Raw GitHub URL of `youtube-bot-comments-filter.user.js` |
| `@homepageURL` | This repository |
| `@supportURL` | GitHub Issues |
| `@license` | MIT |
| `@grant` | `GM_getValue`, `GM_setValue` |
| `@match` | `https://www.youtube.com/*` |

Localized `@name` and `@description` tags are provided for en, ru, es, fr, de, pt-BR, zh-CN, ja, ar, and hi.

## Required permissions

| Grant | Purpose |
|-------|---------|
| `GM_getValue` / `GM_setValue` | Persist hide/blur mode preference between sessions |
| `GM_addStyle` | Inject filter / menu CSS (auto-granted by the Vite build) |

No network requests are made. The script only reads the DOM and applies CSS classes.

## Development

Requires [Node.js](https://nodejs.org/) 20+ (npm).

```bash
npm install
npm run dev      # Vite serve — open/install the generated "dev:" userscript
npm run build    # Production → dist/ + copy to repo root
npm run ci       # Same checks as GitHub Actions (build + verify artifacts)
```

Edit files under [`src/`](src/) (entry: [`src/main.js`](src/main.js)). Userscript metadata (`@match`, localized names, …) lives in [`vite.config.js`](vite.config.js). Version is `package.json` → header `@version` and in-script `SCRIPT_VERSION`.

After changes that should ship, run `npm run build` and commit the regenerated root `.user.js` / `.meta.js`. Pull requests run [CI](.github/workflows/ci.yml), which fails if those files are out of date.

### Local workflow notes

- **`npm run dev`:** vite-plugin-monkey serves an installable userscript (name prefixed with `dev:`). Install it once in Tampermonkey, Violentmonkey, or ScriptCat; HMR applies while the server runs.
- **Built file:** after `npm run build`, you can also install the root `youtube-bot-comments-filter.user.js` (Violentmonkey **Track local file** still works on that artifact).
- Do not commit localhost `@updateURL` / `@downloadURL` values.

### Configuration

| Constant | Default | Location | Description |
|----------|---------|----------|-------------|
| `STORAGE_KEY_MODE` | `ytbf_mode` | `src/constants.js` | Storage key for display mode |
| `DEFAULT_MODE` | `hide` | `src/constants.js` | Initial mode when no preference is saved |
| `STORAGE_KEY_SHOW_SCORE` | `ytbf_show_score` | `src/constants.js` | Storage key for bot % badge visibility |
| `DEFAULT_SHOW_SCORE` | `false` | `src/constants.js` | Show confidence badges by default |
| `THRESHOLD` | 4 | `src/constants.js` | Minimum bot score to flag a comment |
| `EXACT_MATCHES` | `SAWS.PW`, … | `src/constants.js` | Substrings that instantly flag a nickname |
| `SAFETY_RESCAN_MS` | 2000 | `src/constants.js` | Fallback timer if a mutation is missed |

## Disclaimer

This project is **not affiliated** with Google or YouTube. Bot detection is heuristic — some legitimate usernames may be flagged, and some bots may slip through. Use it as a convenience filter, not a guarantee of comment quality.

## License

[MIT](LICENSE) — Copyright (c) 2026 NemoKing

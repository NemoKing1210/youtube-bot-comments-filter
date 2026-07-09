# YouTube Bot Comments Filter

[![Install userscript](https://img.shields.io/badge/Install-userscript-ff0000?style=for-the-badge)](https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.2-green?style=for-the-badge)](CHANGELOG.md)

A userscript for YouTube that detects spam bot comments by nickname pattern and hides or blurs them. A compact toggle in the comments sort panel lets you switch between **hide** and **blur** modes without opening any settings page.

Compatible with [Tampermonkey](https://www.tampermonkey.net/), [Violentmonkey](https://violentmonkey.github.io/), [Greasemonkey](https://www.greasespot.net/), ScriptCat, and other managers that support the `// ==UserScript==` metadata block.

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

Paste the [install URL](#quick-install) above.

### Manual install

1. Open [`youtube-bot-comments-filter.user.js`](youtube-bot-comments-filter.user.js) in this repository.
2. Copy the entire file contents.
3. In your userscript manager, create a new script and paste the code.
4. Save and enable the script.

## Updates

The script includes `@updateURL` and `@downloadURL` metadata pointing to the raw GitHub file. Supported managers check for updates automatically (Tampermonkey: Dashboard → check interval; Violentmonkey: similar).

**To release a new version:**

1. Bump `@version` in `youtube-bot-comments-filter.user.js` and `youtube-bot-comments-filter.meta.js`.
2. Add an entry to [`CHANGELOG.md`](CHANGELOG.md).
3. Push to `main` (or create a GitHub Release).

Managers compare the installed `@version` with the remote metadata to decide whether to offer an update.

## Features

- **Bot detection by nickname** — weighted rule engine scores commenter display names (e.g. `@SAWS.PW__TyT_Ha_CauT_05`)
- **Hide mode** — bot comments are fully removed from the layout (`display: none`)
- **Blur mode** — bot comments stay in place but are blurred and dimmed; hover to reveal
- **In-panel toggle** — chip next to the sort controls (`Top comments` / `Newest first`) switches modes with one click
- **Persistent preference** — selected mode is saved between sessions
- **YouTube-like styling** — toggle uses YouTube CSS variables for light/dark theme compatibility
- **10 UI languages** — English, Russian, Spanish, French, German, Portuguese, Chinese, Japanese, Arabic, Hindi (detected from browser locale)

## Supported pages

| Site | URL pattern |
|------|-------------|
| YouTube | `https://www.youtube.com/*` |

Works on watch pages, Shorts with comments, and any YouTube view that renders the standard comments section (`ytd-comment-view-model` / `ytd-comment-renderer`).

## Display modes

| Mode | Behavior |
|------|----------|
| **Hide** (default) | Bot comments are not visible; layout collapses as if they were removed |
| **Blur** | Bot comments appear blurred, grayscale, and semi-transparent; full content shows on hover |

Click the toggle chip in the comments header to switch modes. The label updates immediately (`🤖 Bots: hidden` ↔ `🤖 Bots: blurred`).

## How it works

```
YouTube page loads
       │
       ▼
MutationObserver + periodic rescan (SPA-safe)
       │
       ▼
Insert toggle chip into comments header (#additional-section)
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
       └── score ≥ threshold ──► apply .ytbf-hidden or .ytbf-blur
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

To extend detection, edit `EXACT_MATCHES` or push new objects into the `RULES` array near the top of `youtube-bot-comments-filter.user.js`.

### Dynamic content

YouTube loads comments asynchronously (infinite scroll, replies, navigation without full reload). A `MutationObserver` on `document.documentElement` schedules debounced passes via `requestAnimationFrame`. A 2-second safety interval catches any missed mutations.

## Repository layout

```text
youtube-bot-comments-filter/
├── youtube-bot-comments-filter.user.js   # Installable userscript (canonical distribution file)
├── youtube-bot-comments-filter.meta.js   # Metadata-only companion for faster update checks
├── README.md                               # Documentation and install instructions
├── CHANGELOG.md                            # Version history
├── LICENSE                                 # MIT license
└── .gitattributes                          # GitHub linguist overrides
```

| File | Purpose |
|------|---------|
| `youtube-bot-comments-filter.user.js` | Full script served at `@downloadURL` / `@updateURL` |
| `youtube-bot-comments-filter.meta.js` | Lightweight metadata mirror; managers may fetch it instead of the full script when checking for updates |

## Script metadata

Key `// ==UserScript==` fields used by managers:

| Field | Value |
|-------|-------|
| `@namespace` | `https://github.com/NemoKing1210/youtube-bot-comments-filter` |
| `@version` | Semantic version (must be bumped on every release) |
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

No network requests are made. The script only reads the DOM and applies CSS classes.

## Development

### Local workflow (Violentmonkey)

1. Clone this repository.
2. In Violentmonkey, install from the local `youtube-bot-comments-filter.user.js` file.
3. Enable **Track local file** before closing the install dialog.
4. Edit the file in your IDE — changes apply after a page reload.

### Local workflow (Tampermonkey)

Tampermonkey does not track local files natively. Options:

- Reinstall from URL after each change, or
- Use a local HTTP server and temporarily point `@updateURL` / `@downloadURL` to `http://localhost:...` during development (do not commit local URLs).

### Configuration

Constants near the top of `youtube-bot-comments-filter.user.js` can be adjusted:

| Constant | Default | Description |
|----------|---------|-------------|
| `STORAGE_KEY_MODE` | `ytbf_mode` | Storage key for display mode |
| `DEFAULT_MODE` | `hide` | Initial mode when no preference is saved |
| `THRESHOLD` | 4 | Minimum bot score to flag a comment |
| `EXACT_MATCHES` | `SAWS.PW`, `TLES.TOP` | Substrings that instantly flag a nickname |
| Safety rescan interval | 2000 ms | Fallback timer if a mutation is missed |

## Disclaimer

This project is **not affiliated** with Google or YouTube. Bot detection is heuristic — some legitimate usernames may be flagged, and some bots may slip through. Use it as a convenience filter, not a guarantee of comment quality.

## License

[MIT](LICENSE) — Copyright (c) 2026 NemoKing

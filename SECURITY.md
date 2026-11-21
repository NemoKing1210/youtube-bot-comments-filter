# Security Policy

## Supported versions

Only the latest released version of the userscript is supported. Fixes land on
`main` and in the next release; userscript managers pick them up automatically
through `@updateURL` / `@downloadURL`.

| Version | Supported |
| ------- | --------- |
| Latest release / `main` | ✅ |
| Older releases | ❌ |

## Reporting a vulnerability

**Please do not open a public issue for a security problem.**

Report privately through GitHub's private vulnerability reporting:

- [Report a vulnerability](https://github.com/NemoKing1210/youtube-bot-comments-filter/security/advisories/new)
  (repository **Security** tab → **Advisories** → **Report a vulnerability**)

If private reporting is not available, contact the maintainer
([@NemoKing1210](https://github.com/NemoKing1210)) through GitHub and ask for a
private channel. Do not post exploit details publicly.

Please include:

- affected script version (`@version` in the installed header, also shown in
  your userscript manager)
- browser and OS
- userscript manager and version (Tampermonkey, Violentmonkey, Greasemonkey,
  ScriptCat, …)
- clear reproduction steps or a proof of concept
- the impact you believe the issue has

### What to expect

This is a volunteer project, so no formal SLA is offered. Reports are
acknowledged on a best-effort basis, usually within a week. You will be told
whether the report is accepted, and credited in the advisory / `CHANGELOG.md`
unless you prefer to stay anonymous. Please allow a reasonable amount of time
for a fix before any public disclosure.

## Scope

### In scope

- script behavior outside the intended YouTube page context
- unexpected network requests, telemetry, or data exfiltration (the script is
  designed to make none)
- injection / XSS through DOM handling — for example, inserting an untrusted
  commenter nickname as HTML rather than text
- abuse of granted permissions beyond
  `GM_getValue` / `GM_setValue` / `GM_addStyle`
- tampering with build artifacts, userscript metadata, or update URLs
- supply-chain issues in the build that affect the published
  `youtube-bot-comments-filter.user.js` / `.meta.js`

### Out of scope

- vulnerabilities in YouTube itself or in a userscript manager — report those
  upstream
- detection accuracy: false positives and missed bots are regular bugs, not
  security issues (open a normal issue)
- issues that require an already-compromised browser, userscript manager, or
  operating system
- social engineering of the maintainer or contributors

## Security model

The script is intentionally small in surface area:

| Property | Value |
| -------- | ----- |
| Runs on | `https://www.youtube.com/*` |
| Permissions | `GM_getValue`, `GM_setValue` (preferences), `GM_addStyle` (CSS injection) |
| Network | None from the script itself |
| Storage | Two preference keys: `ytbf_mode`, `ytbf_show_score` |
| Scope | Reads comment author display names from the DOM and applies CSS classes |

The userscript manager may contact `raw.githubusercontent.com` to check for
updates; that is manager behavior, not part of the script.

If you find behavior that contradicts this model — extra grants, injected
remote content, or any outbound request — treat it as a security issue and
report it privately.

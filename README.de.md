# YouTube Bot Comments Filter

[English](README.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Français](README.fr.md) · **Deutsch** · [Português (Brasil)](README.pt.md) · [中文（简体）](README.zh.md) · [日本語](README.ja.md) · [العربية](README.ar.md) · [हिन्दी](README.hi.md)

> Dies ist eine Übersetzung. Maßgeblich ist das [englische README](README.md); bei Abweichungen gilt die englische Fassung.

[![CI](https://github.com/NemoKing1210/youtube-bot-comments-filter/actions/workflows/ci.yml/badge.svg)](https://github.com/NemoKing1210/youtube-bot-comments-filter/actions/workflows/ci.yml)
[![Userscript installieren](https://img.shields.io/badge/Install-userscript-ff0000?style=for-the-badge)](https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js)
[![Lizenz: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.3.1-green?style=for-the-badge)](CHANGELOG.md)

Ein Userscript für YouTube, das Spam-Bot-Kommentare anhand des Nickname-Musters erkennt und sie ausblendet oder unscharf macht. Die Einstellungen liegen im YouTube-Konto- (Avatar-)Menü: Öffne **Bot-Filter** und wähle **Ausblenden** oder **Unscharf**.

Kompatibel mit [Tampermonkey](https://www.tampermonkey.net/), [Violentmonkey](https://violentmonkey.github.io/), [Greasemonkey](https://www.greasespot.net/), [ScriptCat](https://scriptcat.org/) und anderen Managern, die den Metadatenblock `// ==UserScript==` unterstützen.

## Schnellinstallation

1. Installiere einen Userscript-Manager (Tampermonkey oder Violentmonkey empfohlen).
2. Klicke auf den Installationslink unten – der Manager sollte einen Installationsdialog öffnen.

**Installations-URL:**

```
https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js
```

[![Installieren](https://img.shields.io/badge/⬇_Install-YouTube_Bot_Comments_Filter-0f0f0f?style=for-the-badge&labelColor=ff0000)](https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js)

### Installation per URL (Dashboard)

| Manager | Pfad |
|---------|------|
| Tampermonkey | Dashboard → **Utilities** → **Install from URL** |
| Violentmonkey | Dashboard → **+** → **Install from URL** |
| Greasemonkey | Add-on-Menü → **New User Script** → Raw-URL einfügen |
| ScriptCat | [Erweiterung](https://scriptcat.org/) installieren und die GitHub-Raw-URL verwenden |

Füge die [Installations-URL](#schnellinstallation) von oben ein.

### Manuelle Installation

1. Öffne die gebaute Datei [`youtube-bot-comments-filter.user.js`](youtube-bot-comments-filter.user.js) in diesem Repository (oder führe nach dem Klonen `npm run build` aus).
2. Kopiere den gesamten Dateiinhalt.
3. Erstelle in deinem Userscript-Manager ein neues Skript und füge den Code ein.
4. Speichere und aktiviere das Skript.

## Updates

Das Skript enthält `@updateURL`- (die leichte `.meta.js`) und `@downloadURL`-Metadaten (die vollständige `.user.js`). Unterstützte Manager prüfen automatisch auf Updates.

**So veröffentlichst du eine neue Version:**

1. Ändere `version` in [`package.json`](package.json).
2. Führe `npm run build` aus (erzeugt die Root-Dateien `youtube-bot-comments-filter.user.js` / `.meta.js` neu).
3. Ergänze einen Eintrag in [`CHANGELOG.md`](CHANGELOG.md).
4. Pushe nach `main` (oder erstelle ein GitHub-Release).

## Funktionen

- **Bot-Erkennung per Nickname** – eine Engine mit gewichteten Regeln bewertet die Anzeigenamen der Kommentierenden (z. B. `@SAWS.PW__TyT_Ha_CauT_05`)
- **Ausblenden-Modus** – der Kommentartext wird durch einen lokalisierten Hinweis ersetzt
- **Unscharf-Modus** – Bot-Kommentare bleiben an Ort und Stelle, sind aber unscharf und gedimmt; zum Anzeigen darüberfahren
- **Einstellungen im Kontomenü** – Eintrag im Avatar-Menü mit Ausblenden/Unscharf-Optionen und einem Schalter für das „Bot-%“-Badge
- **Konfidenz-Badge** – geschätzte Bot-Wahrscheinlichkeit über 50 % (bernstein/orange/rot); in den Einstellungen abschaltbar
- **Persistente Auswahl** – der gewählte Modus bleibt zwischen Sitzungen erhalten
- **YouTube-Optik** – nutzt YouTube-CSS-Variablen für Kompatibilität mit hellem und dunklem Theme
- **10 UI-Sprachen** – Englisch, Russisch, Spanisch, Französisch, Deutsch, Portugiesisch, Chinesisch, Japanisch, Arabisch, Hindi (anhand der Browsersprache)

## Unterstützte Seiten

| Seite | URL-Muster |
|-------|------------|
| YouTube | `https://www.youtube.com/*` |

Funktioniert auf Watch-Seiten, in Shorts mit Kommentaren und in jeder YouTube-Ansicht, die den Standard-Kommentarbereich rendert (`ytd-comment-view-model` / `ytd-comment-renderer`).

## Anzeigemodi

| Modus | Verhalten |
|-------|-----------|
| **Ausblenden** (Standard) | Der Kommentartext wird durch einen kurzen Hinweis ersetzt; das Layout bleibt stabil |
| **Unscharf** | Bot-Kommentare erscheinen unscharf, in Graustufen und halbtransparent; der volle Inhalt erscheint beim Darüberfahren |

Öffne das Avatar-Menü → **Bot-Filter** → wähle einen Modus. Der Untertitel unter dem Menüeintrag zeigt den aktuellen Modus.

## So funktioniert es

```
YouTube-Seite lädt
       │
       ▼
MutationObserver + regelmäßiges Neuscannen (SPA-sicher)
       │
       ▼
Einstellungseintrag im Kontomenü anlegen, wenn es geöffnet wird
       │
       ▼
Für jeden neuen Kommentar (ytd-comment-view-model / ytd-comment-renderer)
       │
       ▼
Anzeigenamen des Autors lesen (#author-text)
       │
       ▼
BotDetector-Regeln ausführen → Gewichte summieren
       │
       ├── score < Schwellenwert ──► Kommentar bleibt unverändert
       │
       └── score ≥ Schwellenwert ──► Ausblendhinweis oder Unschärfe anwenden
```

### Bot-Erkennung

Die Erkennung basiert auf dem **Anzeigenamen** des Kommentierenden, nicht auf dem Kommentartext. Jede Regel hat einen Namen, ein Gewicht und eine Funktion `test(name)`. Die Gesamtpunktzahl ist die Summe der Gewichte aller passenden Regeln. Liegt sie **≥ 4** (Standard-Schwellenwert), wird der Kommentar als Bot markiert.

Eingebaute Signale:

| Signal | Gewicht | Beispiel |
|--------|---------|----------|
| Domänenartiges Präfix mit Spam-TLD | 3 | `@SAWS.PW__...`, `@TLES.TOP-...` |
| Trennzeichen direkt nach der TLD | 2 | `.PW__`, `.TOP-` |
| Transliterierte Spam-Schlüsselwörter | 3 | `tyt_ha`, `na_caut`, `smotri`, `4ki_na` |
| Buchstaben und Ziffern vor einer Spam-TLD | 2 | `FK59.TOP` |
| TLD mit transliteriertem Spam-Anhang | 3 | `.TOP_Haxodui_caut_73` |
| Abschließendes numerisches Suffix | 1 | `_73`, `_05` |
| Viele Unterstriche | 1 | drei oder mehr `_` im Namen |
| Leetspeak-Ziffer im Wort | 1 | `Sy4ki`, `CauT0` |
| Großbuchstaben-Präfix mit Punkt | 1 | `@SAWS.PW` |
| Liste exakter Übereinstimmungen | 100 | `SAWS.PW`, `TLES.TOP` |

Geprüfte Spam-TLDs: `PW`, `TOP`, `XYZ`, `ONLINE`, `SITE`, `CLUB`, `WIN`, `CC`, `ICU`, `VIP` und weitere, die häufig in Bot-Nicknames missbraucht werden.

Um die Erkennung zu erweitern, bearbeite `EXACT_MATCHES` / `SPAM_TLDS` in [`src/constants.js`](src/constants.js) oder füge neue Objekte zu `RULES` in [`src/detection/bot-detector.js`](src/detection/bot-detector.js) hinzu.

### Dynamische Inhalte

YouTube lädt Kommentare asynchron (Endlos-Scrollen, Antworten, Navigation ohne vollständiges Neuladen). Ein `MutationObserver` auf `document.documentElement` verarbeitet nur neu hinzugefügte Kommentar-Teilbäume, und ein `yt-navigate-finish`-Listener löst nach SPA-Navigation einen vollständigen Durchlauf aus. Ein Sicherheitsintervall von 5 Sekunden fängt ab, was der Observer nicht sieht.

## Repository-Struktur

```text
youtube-bot-comments-filter/
├── src/                                      # Quellcode (hier bearbeiten)
│   ├── main.js
│   ├── constants.js
│   ├── settings.js
│   ├── i18n/
│   ├── detection/
│   ├── styles/
│   └── features/
├── test/                                     # Unit-Tests (node:test)
├── assets/
│   └── icon.svg                              # Userscript-Icon
├── scripts/                                  # Build-Hilfsskripte
├── youtube-bot-comments-filter.user.js       # Gebautes installierbares Userscript
├── youtube-bot-comments-filter.meta.js       # Gebauter Metadaten-Spiegel
├── package.json
├── vite.config.js
├── README.md
├── README.<lang>.md                          # Übersetzungen (ru, es, fr, de, pt, zh, ja, ar, hi)
├── CHANGELOG.md
├── CONTRIBUTING.md                           # Setup, Konventionen, PR-Checkliste
├── SECURITY.md                               # Richtlinie für Sicherheitsmeldungen
└── LICENSE
```

| Datei | Zweck |
|-------|-------|
| `src/` | Bearbeitbare Quellmodule |
| `youtube-bot-comments-filter.user.js` | Gebautes installierbares Skript, ausgeliefert unter `@downloadURL` |
| `youtube-bot-comments-filter.meta.js` | Leichter Metadaten-Spiegel für Update-Prüfungen |
| `vite.config.js` | Userscript-Metadaten + Vite-/Monkey-Konfiguration |

## Skript-Metadaten

Wichtige Felder von `// ==UserScript==` (generiert aus `vite.config.js` + `package.json`):

| Feld | Wert |
|------|------|
| `@namespace` | `https://github.com/NemoKing1210/youtube-bot-comments-filter` |
| `@version` | Aus `package.json` |
| `@updateURL` / `@downloadURL` | `@updateURL` → `.meta.js`; `@downloadURL` → `.user.js` |
| `@homepageURL` | Dieses Repository |
| `@supportURL` | GitHub Issues |
| `@license` | MIT |
| `@grant` | `GM_getValue`, `GM_setValue` |
| `@match` | `https://www.youtube.com/*` |

Lokalisierte `@name`- und `@description`-Tags sind für en, ru, es, fr, de, pt-BR, zh-CN, ja, ar und hi vorhanden.

## Erforderliche Berechtigungen

| Berechtigung | Zweck |
|--------------|-------|
| `GM_getValue` / `GM_setValue` | Ausblenden/Unscharf-Modus zwischen Sitzungen speichern |
| `GM_addStyle` | CSS für Filter und Menü injizieren (wird vom Vite-Build automatisch gewährt) |

Es werden keine Netzwerkanfragen gestellt. Das Skript liest nur das DOM und setzt CSS-Klassen.

## Entwicklung

Erfordert [Node.js](https://nodejs.org/) 20+ (npm).

```bash
npm install
npm test         # Unit-Tests (node:test)
npm run dev      # Vite serve – das generierte „dev:“-Userscript öffnen/installieren
npm run build    # Produktion → dist/ + Kopie ins Repository-Root
npm run ci       # Dieselben Prüfungen wie GitHub Actions (Build + Artefakt-Verifikation)
```

Bearbeite Dateien unter [`src/`](src/) (Einstiegspunkt: [`src/main.js`](src/main.js)). Userscript-Metadaten (`@match`, lokalisierte Namen, …) liegen in [`vite.config.js`](vite.config.js). Die Version stammt aus `package.json` → `@version` im Header.

Nach Änderungen, die ausgeliefert werden sollen, führe `npm run build` aus und committe die neu erzeugten Root-Dateien `.user.js` / `.meta.js`. In Pull Requests läuft [CI](.github/workflows/ci.yml), das fehlschlägt, wenn diese Dateien veraltet sind.

### Hinweise zum lokalen Workflow

- **`npm run dev`:** vite-plugin-monkey liefert ein installierbares Userscript (Name mit Präfix `dev:`). Installiere es einmal in Tampermonkey, Violentmonkey oder ScriptCat; HMR wendet Änderungen an, solange der Server läuft.
- **Gebaute Datei:** Nach `npm run build` kannst du auch die Root-Datei `youtube-bot-comments-filter.user.js` installieren (in Violentmonkey funktioniert **Track local file** weiterhin).
- Committe keine localhost-Werte in `@updateURL` / `@downloadURL`.

### Konfiguration

| Konstante | Standard | Ort | Beschreibung |
|-----------|----------|-----|--------------|
| `STORAGE_KEY_MODE` | `ytbf_mode` | `src/constants.js` | Speicherschlüssel für den Anzeigemodus |
| `DEFAULT_MODE` | `hide` | `src/constants.js` | Anfangsmodus, wenn keine Einstellung gespeichert ist |
| `STORAGE_KEY_SHOW_SCORE` | `ytbf_show_score` | `src/constants.js` | Speicherschlüssel für die Sichtbarkeit des „Bot-%“-Badges |
| `DEFAULT_SHOW_SCORE` | `false` | `src/constants.js` | Konfidenz-Badges standardmäßig anzeigen |
| `THRESHOLD` | 4 | `src/constants.js` | Mindest-Bot-Score zum Markieren eines Kommentars |
| `EXACT_MATCHES` | `SAWS.PW`, … | `src/constants.js` | Teilstrings, die einen Nickname sofort markieren |
| `SAFETY_RESCAN_MS` | 5000 | `src/constants.js` | Ersatz-Timer für verpasste Mutationen |

## Mitwirken

Beiträge sind willkommen. Siehe [CONTRIBUTING.md](CONTRIBUTING.md) für lokale Einrichtung, Code-Konventionen und die Pull-Request-Checkliste.

Sicherheitsprobleme bitte gemäß [SECURITY.md](SECURITY.md) melden – öffne dafür kein öffentliches Issue.

## Haftungsausschluss

Dieses Projekt ist **nicht mit Google oder YouTube verbunden**. Die Bot-Erkennung ist heuristisch – manche legitimen Nicknames können markiert werden, und manche Bots können durchrutschen. Verstehe den Filter als Komfortfunktion, nicht als Garantie für Kommentarqualität.

## Lizenz

[MIT](LICENSE) – Copyright (c) 2026 NemoKing

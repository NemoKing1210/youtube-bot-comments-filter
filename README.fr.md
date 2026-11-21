# YouTube Bot Comments Filter

[English](README.md) · [Русский](README.ru.md) · [Español](README.es.md) · **Français** · [Deutsch](README.de.md) · [Português (Brasil)](README.pt.md) · [中文（简体）](README.zh.md) · [日本語](README.ja.md) · [العربية](README.ar.md) · [हिन्दी](README.hi.md)

> Ceci est une traduction. La version de référence est le [README anglais](README.md) ; en cas de divergence, c'est elle qui fait foi.

[![CI](https://github.com/NemoKing1210/youtube-bot-comments-filter/actions/workflows/ci.yml/badge.svg)](https://github.com/NemoKing1210/youtube-bot-comments-filter/actions/workflows/ci.yml)
[![Installer le userscript](https://img.shields.io/badge/Install-userscript-ff0000?style=for-the-badge)](https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js)
[![Licence : MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.3.0-green?style=for-the-badge)](CHANGELOG.md)

Un userscript pour YouTube qui détecte les commentaires de bots spam d'après le motif du pseudo et les masque ou les floute. Les réglages se trouvent dans le menu du compte (avatar) YouTube : ouvrez **Filtre anti-bots** et choisissez **Masquer les commentaires de bots** ou **Flouter les commentaires de bots**.

Compatible avec [Tampermonkey](https://www.tampermonkey.net/), [Violentmonkey](https://violentmonkey.github.io/), [Greasemonkey](https://www.greasespot.net/), [ScriptCat](https://scriptcat.org/) et les autres gestionnaires qui prennent en charge le bloc de métadonnées `// ==UserScript==`.

## Installation rapide

1. Installez un gestionnaire de userscripts (Tampermonkey ou Violentmonkey recommandés).
2. Cliquez sur le lien d'installation ci-dessous — le gestionnaire devrait afficher une invite d'installation.

**URL d'installation :**

```
https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js
```

[![Installer](https://img.shields.io/badge/⬇_Install-YouTube_Bot_Comments_Filter-0f0f0f?style=for-the-badge&labelColor=ff0000)](https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js)

### Installation depuis une URL (tableau de bord)

| Gestionnaire | Chemin |
|--------------|--------|
| Tampermonkey | Tableau de bord → **Utilities** → **Install from URL** |
| Violentmonkey | Tableau de bord → **+** → **Install from URL** |
| Greasemonkey | Menu de l'extension → **New User Script** → collez l'URL brute |
| ScriptCat | Installez l'[extension](https://scriptcat.org/) et utilisez l'URL brute GitHub |

Collez l'[URL d'installation](#installation-rapide) ci-dessus.

### Installation manuelle

1. Ouvrez le fichier compilé [`youtube-bot-comments-filter.user.js`](youtube-bot-comments-filter.user.js) dans ce dépôt (ou exécutez `npm run build` après clonage).
2. Copiez tout le contenu du fichier.
3. Dans votre gestionnaire de userscripts, créez un nouveau script et collez le code.
4. Enregistrez et activez le script.

## Mises à jour

Le script contient les métadonnées `@updateURL` et `@downloadURL` pointant vers le fichier brut GitHub. Les gestionnaires compatibles vérifient les mises à jour automatiquement.

**Pour publier une nouvelle version :**

1. Modifiez `version` dans [`package.json`](package.json).
2. Exécutez `npm run build` (régénère les fichiers racine `youtube-bot-comments-filter.user.js` / `.meta.js`).
3. Ajoutez une entrée dans [`CHANGELOG.md`](CHANGELOG.md).
4. Poussez sur `main` (ou créez une GitHub Release).

## Fonctionnalités

- **Détection des bots par pseudo** — un moteur de règles pondérées note les noms affichés des commentateurs (par ex. `@SAWS.PW__TyT_Ha_CauT_05`)
- **Mode masquer** — le corps du commentaire bot est remplacé par un avis localisé
- **Mode flouter** — les commentaires de bots restent en place mais sont floutés et atténués ; survolez pour révéler
- **Réglages dans le menu du compte** — entrée dans le menu de l'avatar avec les options masquer/flouter et un interrupteur pour le badge « % bot »
- **Badge de confiance** — probabilité estimée de bot au-delà de 50 % (ambre / orange / rouge) ; désactivable dans les réglages
- **Préférence persistante** — le mode choisi est conservé entre les sessions
- **Style YouTube** — utilise les variables CSS de YouTube pour la compatibilité thèmes clair et sombre
- **10 langues d'interface** — anglais, russe, espagnol, français, allemand, portugais, chinois, japonais, arabe et hindi (selon la locale du navigateur)

## Pages prises en charge

| Site | Motif d'URL |
|------|-------------|
| YouTube | `https://www.youtube.com/*` |

Fonctionne sur les pages de visionnage, les Shorts avec commentaires et toute vue YouTube qui affiche la section de commentaires standard (`ytd-comment-view-model` / `ytd-comment-renderer`).

## Modes d'affichage

| Mode | Comportement |
|------|--------------|
| **Masquer** (par défaut) | Le corps du commentaire est remplacé par un court avis ; la mise en page reste stable |
| **Flouter** | Les commentaires de bots apparaissent floutés, en niveaux de gris et semi-transparents ; le contenu complet s'affiche au survol |

Ouvrez le menu de l'avatar → **Filtre anti-bots** → choisissez un mode. Le sous-titre sous l'entrée du menu indique le mode actuel.

## Fonctionnement

```
Chargement de la page YouTube
       │
       ▼
MutationObserver + réanalyse périodique (compatible SPA)
       │
       ▼
Ajout de l'entrée de réglages dans le menu du compte à son ouverture
       │
       ▼
Pour chaque nouveau commentaire (ytd-comment-view-model / ytd-comment-renderer)
       │
       ▼
Lecture du nom affiché de l'auteur (#author-text)
       │
       ▼
Exécution des règles BotDetector → somme des poids
       │
       ├── score < seuil ──► le commentaire reste inchangé
       │
       └── score ≥ seuil ──► application de l'avis de masquage ou du flou
```

### Détection des bots

La détection repose sur le **nom affiché** du commentateur, pas sur le texte du commentaire. Chaque règle possède un nom, un poids et une fonction `test(name)`. Le score total est la somme des poids des règles correspondantes. Si le total est **≥ 4** (seuil par défaut), le commentaire est signalé comme bot.

Signaux intégrés :

| Signal | Poids | Exemple |
|--------|-------|---------|
| Préfixe de type domaine avec TLD de spam | 3 | `@SAWS.PW__...`, `@TLES.TOP-...` |
| Séparateur juste après le TLD | 2 | `.PW__`, `.TOP-` |
| Mots-clés de spam translittérés | 3 | `tyt_ha`, `na_caut`, `smotri`, `4ki_na` |
| Nombreux tirets bas | 1 | trois `_` ou plus dans le nom |
| Chiffre leetspeak dans un mot | 1 | `Sy4ki`, `CauT0` |
| Préfixe en majuscules avec point | 1 | `@SAWS.PW` |
| Liste de correspondances exactes | 100 | `SAWS.PW`, `TLES.TOP` |

TLD de spam vérifiés : `PW`, `TOP`, `XYZ`, `ONLINE`, `SITE`, `CLUB`, `WIN`, `CC`, `ICU`, `VIP` et d'autres souvent utilisés dans les pseudos de bots.

Pour étendre la détection, modifiez `EXACT_MATCHES` / `SPAM_TLDS` dans [`src/constants.js`](src/constants.js) ou ajoutez de nouveaux objets à `RULES` dans [`src/detection/bot-detector.js`](src/detection/bot-detector.js).

### Contenu dynamique

YouTube charge les commentaires de façon asynchrone (défilement infini, réponses, navigation sans rechargement complet). Un `MutationObserver` sur `document.documentElement` planifie des passes différées via `requestAnimationFrame`. Un intervalle de sécurité de 2 secondes rattrape les mutations manquées.

## Structure du dépôt

```text
youtube-bot-comments-filter/
├── src/                                      # Code source (modifiez ici)
│   ├── main.js
│   ├── constants.js
│   ├── settings.js
│   ├── i18n/
│   ├── detection/
│   ├── styles/
│   └── features/
├── scripts/                                  # Utilitaires de build
├── youtube-bot-comments-filter.user.js       # Userscript compilé et installable
├── youtube-bot-comments-filter.meta.js       # Miroir compilé des métadonnées
├── package.json
├── vite.config.js
├── README.md
├── README.<lang>.md                          # Traductions (ru, es, fr, de, pt, zh, ja, ar, hi)
├── CHANGELOG.md
├── CONTRIBUTING.md                           # Configuration, conventions, checklist PR
├── SECURITY.md                               # Politique de signalement des vulnérabilités
└── LICENSE
```

| Fichier | Rôle |
|---------|------|
| `src/` | Modules source modifiables |
| `youtube-bot-comments-filter.user.js` | Script compilé servi à `@downloadURL` / `@updateURL` |
| `youtube-bot-comments-filter.meta.js` | Miroir léger des métadonnées pour les vérifications de mise à jour |
| `vite.config.js` | Métadonnées du userscript + configuration Vite / monkey |

## Métadonnées du script

Champs clés de `// ==UserScript==` (générés depuis `vite.config.js` + `package.json`) :

| Champ | Valeur |
|-------|--------|
| `@namespace` | `https://github.com/NemoKing1210/youtube-bot-comments-filter` |
| `@version` | Depuis `package.json` |
| `@updateURL` / `@downloadURL` | URL brute GitHub du fichier `youtube-bot-comments-filter.user.js` |
| `@homepageURL` | Ce dépôt |
| `@supportURL` | GitHub Issues |
| `@license` | MIT |
| `@grant` | `GM_getValue`, `GM_setValue` |
| `@match` | `https://www.youtube.com/*` |

Des balises `@name` et `@description` localisées sont fournies pour en, ru, es, fr, de, pt-BR, zh-CN, ja, ar et hi.

## Autorisations requises

| Autorisation | Rôle |
|--------------|------|
| `GM_getValue` / `GM_setValue` | Conserver le mode masquer/flouter entre les sessions |
| `GM_addStyle` | Injecter le CSS du filtre et du menu (accordée automatiquement par le build Vite) |

Aucune requête réseau n'est effectuée. Le script ne fait que lire le DOM et appliquer des classes CSS.

## Développement

Nécessite [Node.js](https://nodejs.org/) 20+ (npm).

```bash
npm install
npm run dev      # Vite serve — ouvrez/installez le userscript généré « dev: »
npm run build    # Production → dist/ + copie à la racine du dépôt
npm run ci       # Mêmes vérifications que GitHub Actions (build + vérification des artefacts)
```

Modifiez les fichiers de [`src/`](src/) (point d'entrée : [`src/main.js`](src/main.js)). Les métadonnées du userscript (`@match`, noms localisés, …) se trouvent dans [`vite.config.js`](vite.config.js). La version vient de `package.json` → `@version` dans l'en-tête et `SCRIPT_VERSION` dans le script.

Après des modifications destinées à être publiées, exécutez `npm run build` et validez les fichiers racine `.user.js` / `.meta.js` régénérés. Les pull requests exécutent [CI](.github/workflows/ci.yml), qui échoue si ces fichiers sont obsolètes.

### Remarques sur le workflow local

- **`npm run dev` :** vite-plugin-monkey sert un userscript installable (nom préfixé par `dev:`). Installez-le une fois dans Tampermonkey, Violentmonkey ou ScriptCat ; HMR applique les modifications tant que le serveur tourne.
- **Fichier compilé :** après `npm run build`, vous pouvez aussi installer le `youtube-bot-comments-filter.user.js` à la racine (dans Violentmonkey, **Track local file** fonctionne toujours).
- Ne validez pas de valeurs localhost dans `@updateURL` / `@downloadURL`.

### Configuration

| Constante | Valeur par défaut | Emplacement | Description |
|-----------|-------------------|-------------|-------------|
| `STORAGE_KEY_MODE` | `ytbf_mode` | `src/constants.js` | Clé de stockage du mode d'affichage |
| `DEFAULT_MODE` | `hide` | `src/constants.js` | Mode initial si aucune préférence n'est enregistrée |
| `STORAGE_KEY_SHOW_SCORE` | `ytbf_show_score` | `src/constants.js` | Clé de stockage de la visibilité du badge « % bot » |
| `DEFAULT_SHOW_SCORE` | `false` | `src/constants.js` | Afficher les badges de confiance par défaut |
| `THRESHOLD` | 4 | `src/constants.js` | Score minimum de bot pour signaler un commentaire |
| `EXACT_MATCHES` | `SAWS.PW`, … | `src/constants.js` | Sous-chaînes qui signalent immédiatement un pseudo |
| `SAFETY_RESCAN_MS` | 2000 | `src/constants.js` | Minuteur de secours en cas de mutation manquée |

## Contribuer

Les contributions sont bienvenues. Consultez [CONTRIBUTING.md](CONTRIBUTING.md) pour la configuration locale, les conventions de code et la checklist de pull request.

Pour signaler un problème de sécurité, suivez [SECURITY.md](SECURITY.md) — n'ouvrez pas d'issue publique.

## Avertissement

Ce projet **n'est pas affilié** à Google ni à YouTube. La détection des bots est heuristique : certains pseudos légitimes peuvent être signalés et certains bots peuvent passer. Utilisez-le comme un filtre de confort, pas comme une garantie de qualité des commentaires.

## Licence

[MIT](LICENSE) — Copyright (c) 2026 NemoKing

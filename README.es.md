# YouTube Bot Comments Filter

[English](README.md) · [Русский](README.ru.md) · **Español** · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português (Brasil)](README.pt.md) · [中文（简体）](README.zh.md) · [日本語](README.ja.md) · [العربية](README.ar.md) · [हिन्दी](README.hi.md)

> Esta es una traducción. La versión canónica es el [README en inglés](README.md); si hay diferencias, prevalece esa.

[![CI](https://github.com/NemoKing1210/youtube-bot-comments-filter/actions/workflows/ci.yml/badge.svg)](https://github.com/NemoKing1210/youtube-bot-comments-filter/actions/workflows/ci.yml)
[![Instalar userscript](https://img.shields.io/badge/Install-userscript-ff0000?style=for-the-badge)](https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js)
[![Licencia: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Versión](https://img.shields.io/badge/version-1.3.0-green?style=for-the-badge)](CHANGELOG.md)

Un userscript para YouTube que detecta comentarios de bots de spam por el patrón del apodo y los oculta o difumina. Los ajustes están en el menú de la cuenta (avatar) de YouTube: abre **Filtro de bots** y elige **Ocultar comentarios de bots** o **Difuminar comentarios de bots**.

Compatible con [Tampermonkey](https://www.tampermonkey.net/), [Violentmonkey](https://violentmonkey.github.io/), [Greasemonkey](https://www.greasespot.net/), [ScriptCat](https://scriptcat.org/) y otros gestores que admitan el bloque de metadatos `// ==UserScript==`.

## Instalación rápida

1. Instala un gestor de userscripts (se recomiendan Tampermonkey o Violentmonkey).
2. Haz clic en el enlace de instalación de abajo; el gestor debería abrir un aviso de instalación.

**URL de instalación:**

```
https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js
```

[![Instalar](https://img.shields.io/badge/⬇_Install-YouTube_Bot_Comments_Filter-0f0f0f?style=for-the-badge&labelColor=ff0000)](https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js)

### Instalación desde URL (panel)

| Gestor | Ruta |
|--------|------|
| Tampermonkey | Panel → **Utilities** → **Install from URL** |
| Violentmonkey | Panel → **+** → **Install from URL** |
| Greasemonkey | Menú del complemento → **New User Script** → pega la URL raw |
| ScriptCat | Instala la [extensión](https://scriptcat.org/) y usa la URL raw de GitHub |

Pega la [URL de instalación](#instalación-rápida) de arriba.

### Instalación manual

1. Abre el archivo compilado [`youtube-bot-comments-filter.user.js`](youtube-bot-comments-filter.user.js) en este repositorio (o ejecuta `npm run build` tras clonarlo).
2. Copia todo el contenido del archivo.
3. En tu gestor de userscripts, crea un script nuevo y pega el código.
4. Guarda y activa el script.

## Actualizaciones

El script incluye metadatos `@updateURL` y `@downloadURL` que apuntan al archivo raw de GitHub. Los gestores compatibles buscan actualizaciones automáticamente.

**Para publicar una nueva versión:**

1. Cambia `version` en [`package.json`](package.json).
2. Ejecuta `npm run build` (regenera los archivos raíz `youtube-bot-comments-filter.user.js` / `.meta.js`).
3. Añade una entrada en [`CHANGELOG.md`](CHANGELOG.md).
4. Sube los cambios a `main` (o crea un GitHub Release).

## Características

- **Detección de bots por apodo** — un motor de reglas ponderadas puntúa los nombres visibles de los comentaristas (p. ej. `@SAWS.PW__TyT_Ha_CauT_05`)
- **Modo ocultar** — el cuerpo del comentario del bot se sustituye por un aviso localizado
- **Modo difuminar** — los comentarios de bots siguen en su sitio, pero difuminados y atenuados; pasa el cursor para revelarlos
- **Ajustes en el menú de la cuenta** — entrada en el menú del avatar con opciones ocultar/difuminar y un interruptor para la insignia «% de bot»
- **Insignia de confianza** — probabilidad estimada de bot cuando supera el 50% (ámbar / naranja / rojo); se puede desactivar en los ajustes
- **Preferencia persistente** — el modo elegido se guarda entre sesiones
- **Estilo de YouTube** — usa variables CSS de YouTube para ser compatible con temas claro y oscuro
- **10 idiomas de interfaz** — inglés, ruso, español, francés, alemán, portugués, chino, japonés, árabe e hindi (según la configuración regional del navegador)

## Páginas compatibles

| Sitio | Patrón de URL |
|-------|---------------|
| YouTube | `https://www.youtube.com/*` |

Funciona en páginas de reproducción, en Shorts con comentarios y en cualquier vista de YouTube que muestre la sección de comentarios estándar (`ytd-comment-view-model` / `ytd-comment-renderer`).

## Modos de visualización

| Modo | Comportamiento |
|------|----------------|
| **Ocultar** (predeterminado) | El cuerpo del comentario se sustituye por un aviso breve; el diseño no se desplaza |
| **Difuminar** | Los comentarios de bots aparecen difuminados, en escala de grises y semitransparentes; el contenido completo se muestra al pasar el cursor |

Abre el menú del avatar → **Filtro de bots** → elige un modo. El subtítulo bajo la entrada del menú muestra el modo actual.

## Cómo funciona

```
Se carga la página de YouTube
       │
       ▼
MutationObserver + reanálisis periódico (seguro para SPA)
       │
       ▼
Añadir la entrada de ajustes al menú de la cuenta cuando se abre
       │
       ▼
Para cada comentario nuevo (ytd-comment-view-model / ytd-comment-renderer)
       │
       ▼
Leer el nombre visible del autor (#author-text)
       │
       ▼
Ejecutar las reglas de BotDetector → sumar pesos
       │
       ├── score < umbral ──► el comentario no cambia
       │
       └── score ≥ umbral ──► aplicar aviso de ocultación o difuminado
```

### Detección de bots

La detección se basa en el **nombre visible** del comentarista, no en el texto del comentario. Cada regla tiene un nombre, un peso y una función `test(name)`. La puntuación total es la suma de los pesos de las reglas que coinciden. Si el total es **≥ 4** (umbral predeterminado), el comentario se marca como bot.

Señales integradas:

| Señal | Peso | Ejemplo |
|-------|------|---------|
| Prefijo tipo dominio con TLD de spam | 3 | `@SAWS.PW__...`, `@TLES.TOP-...` |
| Separador justo después del TLD | 2 | `.PW__`, `.TOP-` |
| Palabras clave de spam transliteradas | 3 | `tyt_ha`, `na_caut`, `smotri`, `4ki_na` |
| Muchos guiones bajos | 1 | tres o más `_` en el nombre |
| Dígito leetspeak en una palabra | 1 | `Sy4ki`, `CauT0` |
| Prefijo en mayúsculas con punto | 1 | `@SAWS.PW` |
| Lista de coincidencias exactas | 100 | `SAWS.PW`, `TLES.TOP` |

TLD de spam comprobados: `PW`, `TOP`, `XYZ`, `ONLINE`, `SITE`, `CLUB`, `WIN`, `CC`, `ICU`, `VIP` y otros usados habitualmente en apodos de bots.

Para ampliar la detección, edita `EXACT_MATCHES` / `SPAM_TLDS` en [`src/constants.js`](src/constants.js) o añade nuevos objetos a `RULES` en [`src/detection/bot-detector.js`](src/detection/bot-detector.js).

### Contenido dinámico

YouTube carga los comentarios de forma asíncrona (desplazamiento infinito, respuestas, navegación sin recarga completa). Un `MutationObserver` en `document.documentElement` programa pasadas con retardo mediante `requestAnimationFrame`. Un intervalo de seguridad de 2 segundos captura las mutaciones que se hayan podido perder.

## Estructura del repositorio

```text
youtube-bot-comments-filter/
├── src/                                      # Código fuente (edita aquí)
│   ├── main.js
│   ├── constants.js
│   ├── settings.js
│   ├── i18n/
│   ├── detection/
│   ├── styles/
│   └── features/
├── scripts/                                  # Utilidades de compilación
├── youtube-bot-comments-filter.user.js       # Userscript compilado e instalable
├── youtube-bot-comments-filter.meta.js       # Espejo compilado solo con metadatos
├── package.json
├── vite.config.js
├── README.md
├── README.<lang>.md                          # Traducciones (ru, es, fr, de, pt, zh, ja, ar, hi)
├── CHANGELOG.md
├── CONTRIBUTING.md                           # Configuración, convenciones, checklist de PR
├── SECURITY.md                               # Política de notificación de vulnerabilidades
└── LICENSE
```

| Archivo | Propósito |
|---------|-----------|
| `src/` | Módulos fuente editables |
| `youtube-bot-comments-filter.user.js` | Script compilado servido en `@downloadURL` / `@updateURL` |
| `youtube-bot-comments-filter.meta.js` | Espejo ligero de metadatos para comprobar actualizaciones |
| `vite.config.js` | Metadatos del userscript + configuración de Vite / monkey |

## Metadatos del script

Campos clave de `// ==UserScript==` (generados desde `vite.config.js` + `package.json`):

| Campo | Valor |
|-------|-------|
| `@namespace` | `https://github.com/NemoKing1210/youtube-bot-comments-filter` |
| `@version` | Desde `package.json` |
| `@updateURL` / `@downloadURL` | URL raw de GitHub del archivo `youtube-bot-comments-filter.user.js` |
| `@homepageURL` | Este repositorio |
| `@supportURL` | GitHub Issues |
| `@license` | MIT |
| `@grant` | `GM_getValue`, `GM_setValue` |
| `@match` | `https://www.youtube.com/*` |

Se incluyen etiquetas localizadas `@name` y `@description` para en, ru, es, fr, de, pt-BR, zh-CN, ja, ar e hi.

## Permisos necesarios

| Permiso | Propósito |
|---------|-----------|
| `GM_getValue` / `GM_setValue` | Guardar el modo ocultar/difuminar entre sesiones |
| `GM_addStyle` | Inyectar el CSS del filtro y del menú (concedido automáticamente por la compilación de Vite) |

No se realizan solicitudes de red. El script solo lee el DOM y aplica clases CSS.

## Desarrollo

Requiere [Node.js](https://nodejs.org/) 20+ (npm).

```bash
npm install
npm run dev      # Vite serve — abre/instala el userscript generado "dev:"
npm run build    # Producción → dist/ + copia a la raíz del repositorio
npm run ci       # Las mismas comprobaciones que GitHub Actions (compilar + verificar artefactos)
```

Edita los archivos de [`src/`](src/) (punto de entrada: [`src/main.js`](src/main.js)). Los metadatos del userscript (`@match`, nombres localizados, …) están en [`vite.config.js`](vite.config.js). La versión viene de `package.json` → `@version` en la cabecera y `SCRIPT_VERSION` en el script.

Tras cambios que deban publicarse, ejecuta `npm run build` y haz commit de los archivos raíz `.user.js` / `.meta.js` regenerados. En las pull requests se ejecuta [CI](.github/workflows/ci.yml), que falla si esos archivos están desactualizados.

### Notas del flujo de trabajo local

- **`npm run dev`:** vite-plugin-monkey sirve un userscript instalable (nombre con prefijo `dev:`). Instálalo una vez en Tampermonkey, Violentmonkey o ScriptCat; HMR aplica los cambios mientras el servidor está en marcha.
- **Archivo compilado:** tras `npm run build`, también puedes instalar el `youtube-bot-comments-filter.user.js` de la raíz (en Violentmonkey sigue funcionando **Track local file**).
- No hagas commit de valores localhost en `@updateURL` / `@downloadURL`.

### Configuración

| Constante | Valor predeterminado | Ubicación | Descripción |
|-----------|----------------------|-----------|-------------|
| `STORAGE_KEY_MODE` | `ytbf_mode` | `src/constants.js` | Clave de almacenamiento del modo de visualización |
| `DEFAULT_MODE` | `hide` | `src/constants.js` | Modo inicial si no hay preferencia guardada |
| `STORAGE_KEY_SHOW_SCORE` | `ytbf_show_score` | `src/constants.js` | Clave de almacenamiento para la visibilidad de la insignia «% de bot» |
| `DEFAULT_SHOW_SCORE` | `false` | `src/constants.js` | Mostrar insignias de confianza por defecto |
| `THRESHOLD` | 4 | `src/constants.js` | Puntuación mínima de bot para marcar un comentario |
| `EXACT_MATCHES` | `SAWS.PW`, … | `src/constants.js` | Subcadenas que marcan un apodo al instante |
| `SAFETY_RESCAN_MS` | 2000 | `src/constants.js` | Temporizador de reserva por si se pierde una mutación |

## Contribuir

Las contribuciones son bienvenidas. Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para la configuración local, las convenciones de código y la checklist de pull request.

Para informar de un problema de seguridad, sigue [SECURITY.md](SECURITY.md); no abras un issue público.

## Aviso legal

Este proyecto **no está afiliado** con Google ni YouTube. La detección de bots es heurística: algunos apodos legítimos pueden marcarse y algunos bots pueden pasar desapercibidos. Úsalo como un filtro de comodidad, no como garantía de calidad de los comentarios.

## Licencia

[MIT](LICENSE) — Copyright (c) 2026 NemoKing

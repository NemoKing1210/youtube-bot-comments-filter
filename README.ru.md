# YouTube Bot Comments Filter

[English](README.md) · **Русский** · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português (Brasil)](README.pt.md) · [中文（简体）](README.zh.md) · [日本語](README.ja.md) · [العربية](README.ar.md) · [हिन्दी](README.hi.md)

> Это перевод. Канонической версией является [английский README](README.md); при расхождениях ориентируйтесь на него.

[![CI](https://github.com/NemoKing1210/youtube-bot-comments-filter/actions/workflows/ci.yml/badge.svg)](https://github.com/NemoKing1210/youtube-bot-comments-filter/actions/workflows/ci.yml)
[![Установить userscript](https://img.shields.io/badge/Install-userscript-ff0000?style=for-the-badge)](https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js)
[![Лицензия: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Версия](https://img.shields.io/badge/version-1.3.0-green?style=for-the-badge)](CHANGELOG.md)

Пользовательский скрипт для YouTube, который находит спам-комментарии ботов по шаблону ника и скрывает или размывает их. Настройки находятся в меню аккаунта (аватара) YouTube — откройте **Фильтр ботов** и выберите **Скрывать бот-комментарии** или **Размывать бот-комментарии**.

Совместим с [Tampermonkey](https://www.tampermonkey.net/), [Violentmonkey](https://violentmonkey.github.io/), [Greasemonkey](https://www.greasespot.net/), [ScriptCat](https://scriptcat.org/) и другими менеджерами, поддерживающими блок метаданных `// ==UserScript==`.

## Быстрая установка

1. Установите менеджер userscript-ов (рекомендуются Tampermonkey или Violentmonkey).
2. Нажмите ссылку установки ниже — менеджер должен показать запрос на установку.

**URL установки:**

```
https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js
```

[![Установить](https://img.shields.io/badge/⬇_Install-YouTube_Bot_Comments_Filter-0f0f0f?style=for-the-badge&labelColor=ff0000)](https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js)

### Установка по URL (из панели)

| Менеджер | Путь |
|----------|------|
| Tampermonkey | Панель → **Utilities** → **Install from URL** |
| Violentmonkey | Панель → **+** → **Install from URL** |
| Greasemonkey | Меню дополнения → **New User Script** → вставьте raw-URL |
| ScriptCat | Установите [расширение](https://scriptcat.org/) и используйте raw-URL GitHub |

Вставьте [URL установки](#быстрая-установка) выше.

### Ручная установка

1. Откройте собранный [`youtube-bot-comments-filter.user.js`](youtube-bot-comments-filter.user.js) в этом репозитории (или выполните `npm run build` после клонирования).
2. Скопируйте всё содержимое файла.
3. В менеджере userscript-ов создайте новый скрипт и вставьте код.
4. Сохраните и включите скрипт.

## Обновления

Скрипт содержит метаданные `@updateURL` и `@downloadURL`, указывающие на raw-файл в GitHub. Поддерживаемые менеджеры проверяют обновления автоматически.

**Чтобы выпустить новую версию:**

1. Измените `version` в [`package.json`](package.json).
2. Выполните `npm run build` (перегенерирует корневые `youtube-bot-comments-filter.user.js` / `.meta.js`).
3. Добавьте запись в [`CHANGELOG.md`](CHANGELOG.md).
4. Отправьте изменения в `main` (или создайте GitHub Release).

## Возможности

- **Детекция ботов по нику** — движок взвешенных правил оценивает отображаемые имена комментаторов (например, `@SAWS.PW__TyT_Ha_CauT_05`)
- **Режим скрытия** — тело бот-комментария заменяется локализованным уведомлением-заглушкой
- **Режим размытия** — бот-комментарии остаются на месте, но размыты и затемнены; наведите курсор, чтобы показать
- **Настройки в меню аккаунта** — пункт в меню аватара с выбором «скрыть/размыть» и переключателем бейджа «% бота»
- **Бейдж уверенности** — оценка вероятности бота выше 50% (янтарный / оранжевый / красный); отключается в настройках
- **Сохранение выбора** — выбранный режим запоминается между сессиями
- **Стиль YouTube** — используются CSS-переменные YouTube для совместимости со светлой и тёмной темами
- **10 языков интерфейса** — английский, русский, испанский, французский, немецкий, португальский, китайский, японский, арабский, хинди (определяется по локали браузера)

## Поддерживаемые страницы

| Сайт | Шаблон URL |
|------|------------|
| YouTube | `https://www.youtube.com/*` |

Работает на страницах просмотра, в Shorts с комментариями и в любом представлении YouTube, где отображается стандартный блок комментариев (`ytd-comment-view-model` / `ytd-comment-renderer`).

## Режимы отображения

| Режим | Поведение |
|-------|-----------|
| **Скрыть** (по умолчанию) | Тело комментария заменяется коротким уведомлением; вёрстка не смещается |
| **Размыть** | Бот-комментарии выглядят размытыми, обесцвеченными и полупрозрачными; полный текст виден при наведении |

Откройте меню аватара → **Фильтр ботов** → выберите режим. Подпись под пунктом меню показывает текущий режим.

## Как это работает

```
Загрузка страницы YouTube
       │
       ▼
MutationObserver + периодическая перепроверка (безопасно для SPA)
       │
       ▼
Добавление пункта настроек в меню аккаунта при его открытии
       │
       ▼
Для каждого нового комментария (ytd-comment-view-model / ytd-comment-renderer)
       │
       ▼
Чтение отображаемого имени автора (#author-text)
       │
       ▼
Запуск правил BotDetector → суммирование весов
       │
       ├── score < порога ──► комментарий не меняется
       │
       └── score ≥ порога ──► применяется заглушка или размытие
```

### Детекция ботов

Детекция основана на **отображаемом имени** комментатора, а не на тексте комментария. У каждого правила есть имя, вес и функция `test(name)`. Итоговый балл — сумма весов совпавших правил. Если итог **≥ 4** (порог по умолчанию), комментарий помечается как бот.

Встроенные сигналы:

| Сигнал | Вес | Пример |
|--------|-----|--------|
| Доменный префикс со спам-TLD | 3 | `@SAWS.PW__...`, `@TLES.TOP-...` |
| Разделитель сразу после TLD | 2 | `.PW__`, `.TOP-` |
| Транслитерированные спам-ключевые слова | 3 | `tyt_ha`, `na_caut`, `smotri`, `4ki_na` |
| Много подчёркиваний | 1 | три или более `_` в имени |
| Литспик-цифра в слове | 1 | `Sy4ki`, `CauT0` |
| Префикс в верхнем регистре с точкой | 1 | `@SAWS.PW` |
| Список точных совпадений | 100 | `SAWS.PW`, `TLES.TOP` |

Проверяемые спам-TLD: `PW`, `TOP`, `XYZ`, `ONLINE`, `SITE`, `CLUB`, `WIN`, `CC`, `ICU`, `VIP` и другие, часто используемые в никах ботов.

Чтобы расширить детекцию, отредактируйте `EXACT_MATCHES` / `SPAM_TLDS` в [`src/constants.js`](src/constants.js) или добавьте новые объекты в `RULES` в [`src/detection/bot-detector.js`](src/detection/bot-detector.js).

### Динамический контент

YouTube загружает комментарии асинхронно (бесконечная прокрутка, ответы, навигация без полной перезагрузки). `MutationObserver` на `document.documentElement` планирует отложенные проходы через `requestAnimationFrame`. Страховочный интервал в 2 секунды ловит пропущенные мутации.

## Структура репозитория

```text
youtube-bot-comments-filter/
├── src/                                      # Исходный код (редактируйте здесь)
│   ├── main.js
│   ├── constants.js
│   ├── settings.js
│   ├── i18n/
│   ├── detection/
│   ├── styles/
│   └── features/
├── scripts/                                  # Вспомогательные скрипты сборки
├── youtube-bot-comments-filter.user.js       # Собранный устанавливаемый userscript
├── youtube-bot-comments-filter.meta.js       # Собранное зеркало только с метаданными
├── package.json
├── vite.config.js
├── README.md
├── README.<lang>.md                          # Переводы (ru, es, fr, de, pt, zh, ja, ar, hi)
├── CHANGELOG.md
├── CONTRIBUTING.md                           # Настройка, соглашения, чеклист PR
├── SECURITY.md                               # Политика сообщений об уязвимостях
└── LICENSE
```

| Файл | Назначение |
|------|------------|
| `src/` | Редактируемые исходные модули |
| `youtube-bot-comments-filter.user.js` | Собранный скрипт, отдаваемый по `@downloadURL` / `@updateURL` |
| `youtube-bot-comments-filter.meta.js` | Лёгкое зеркало метаданных для проверки обновлений |
| `vite.config.js` | Метаданные userscript-а + конфигурация Vite / monkey |

## Метаданные скрипта

Ключевые поля `// ==UserScript==` (генерируются из `vite.config.js` + `package.json`):

| Поле | Значение |
|------|----------|
| `@namespace` | `https://github.com/NemoKing1210/youtube-bot-comments-filter` |
| `@version` | Из `package.json` |
| `@updateURL` / `@downloadURL` | Raw-URL GitHub файла `youtube-bot-comments-filter.user.js` |
| `@homepageURL` | Этот репозиторий |
| `@supportURL` | GitHub Issues |
| `@license` | MIT |
| `@grant` | `GM_getValue`, `GM_setValue` |
| `@match` | `https://www.youtube.com/*` |

Локализованные теги `@name` и `@description` предусмотрены для en, ru, es, fr, de, pt-BR, zh-CN, ja, ar и hi.

## Необходимые разрешения

| Разрешение | Назначение |
|------------|------------|
| `GM_getValue` / `GM_setValue` | Сохранение выбранного режима (скрыть/размыть) между сессиями |
| `GM_addStyle` | Внедрение CSS для фильтра и меню (выдаётся автоматически при сборке Vite) |

Сетевые запросы не выполняются. Скрипт только читает DOM и применяет CSS-классы.

## Разработка

Требуется [Node.js](https://nodejs.org/) 20+ (npm).

```bash
npm install
npm run dev      # Vite serve — откройте/установите сгенерированный userscript "dev:"
npm run build    # Production → dist/ + копирование в корень репозитория
npm run ci       # Те же проверки, что и в GitHub Actions (сборка + проверка артефактов)
```

Редактируйте файлы в [`src/`](src/) (точка входа: [`src/main.js`](src/main.js)). Метаданные userscript-а (`@match`, локализованные имена, …) находятся в [`vite.config.js`](vite.config.js). Версия берётся из `package.json` → `@version` в заголовке и `SCRIPT_VERSION` в скрипте.

После изменений, которые должны попасть в релиз, выполните `npm run build` и закоммитьте перегенерированные корневые `.user.js` / `.meta.js`. В pull request запускается [CI](.github/workflows/ci.yml), который падает, если эти файлы устарели.

### Замечания по локальной работе

- **`npm run dev`:** vite-plugin-monkey отдаёт устанавливаемый userscript (имя с префиксом `dev:`). Установите его один раз в Tampermonkey, Violentmonkey или ScriptCat; HMR применяет изменения, пока сервер запущен.
- **Собранный файл:** после `npm run build` можно также установить корневой `youtube-bot-comments-filter.user.js` (в Violentmonkey работает **Track local file**).
- Не коммитьте локальные `@updateURL` / `@downloadURL` со значениями localhost.

### Конфигурация

| Константа | По умолчанию | Расположение | Описание |
|-----------|--------------|--------------|----------|
| `STORAGE_KEY_MODE` | `ytbf_mode` | `src/constants.js` | Ключ хранилища для режима отображения |
| `DEFAULT_MODE` | `hide` | `src/constants.js` | Начальный режим, если предпочтение не сохранено |
| `STORAGE_KEY_SHOW_SCORE` | `ytbf_show_score` | `src/constants.js` | Ключ хранилища для видимости бейджа «% бота» |
| `DEFAULT_SHOW_SCORE` | `false` | `src/constants.js` | Показывать бейджи уверенности по умолчанию |
| `THRESHOLD` | 4 | `src/constants.js` | Минимальный балл бота для пометки комментария |
| `EXACT_MATCHES` | `SAWS.PW`, … | `src/constants.js` | Подстроки, мгновенно помечающие ник |
| `SAFETY_RESCAN_MS` | 2000 | `src/constants.js` | Резервный таймер на случай пропущенной мутации |

## Участие в проекте

Мы рады вкладу. См. [CONTRIBUTING.md](CONTRIBUTING.md): локальная настройка, соглашения по коду и чеклист pull request.

О проблемах безопасности сообщайте по инструкции из [SECURITY.md](SECURITY.md) — не открывайте публичный issue.

## Отказ от ответственности

Проект **не связан** с Google или YouTube. Детекция ботов эвристическая — некоторые обычные ники могут быть помечены, а некоторые боты могут проскочить. Используйте фильтр как удобство, а не как гарантию качества комментариев.

## Лицензия

[MIT](LICENSE) — Copyright (c) 2026 NemoKing

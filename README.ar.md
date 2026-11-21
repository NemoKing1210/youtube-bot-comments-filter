# YouTube Bot Comments Filter

[English](README.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português (Brasil)](README.pt.md) · [中文（简体）](README.zh.md) · [日本語](README.ja.md) · **العربية** · [हिन्दी](README.hi.md)

> هذه ترجمة. النسخة المعتمدة هي [README بالإنجليزية](README.md)؛ وعند الاختلاف تكون الأولوية لها.

[![CI](https://github.com/NemoKing1210/youtube-bot-comments-filter/actions/workflows/ci.yml/badge.svg)](https://github.com/NemoKing1210/youtube-bot-comments-filter/actions/workflows/ci.yml)
[![تثبيت سكربت المستخدم](https://img.shields.io/badge/Install-userscript-ff0000?style=for-the-badge)](https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js)
[![الترخيص: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![الإصدار](https://img.shields.io/badge/version-1.3.1-green?style=for-the-badge)](CHANGELOG.md)

سكربت مستخدم لـ YouTube يكتشف تعليقات روبوتات السبام بناءً على نمط الاسم المعروض ويخفيها أو يموّهها. توجد الإعدادات في قائمة حساب YouTube (الصورة الرمزية): افتح **فلتر الروبوتات** واختر **إخفاء** أو **تمويه**.

متوافق مع [Tampermonkey](https://www.tampermonkey.net/) و[Violentmonkey](https://violentmonkey.github.io/) و[Greasemonkey](https://www.greasespot.net/) و[ScriptCat](https://scriptcat.org/) وغيرها من المديرين الذين يدعمون كتلة البيانات الوصفية `// ==UserScript==`.

## تثبيت سريع

1. ثبّت مدير سكربتات المستخدم (يُنصح بـ Tampermonkey أو Violentmonkey).
2. انقر على رابط التثبيت أدناه — من المفترض أن يفتح المدير نافذة تثبيت.

**رابط التثبيت:**

```
https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js
```

[![تثبيت](https://img.shields.io/badge/⬇_Install-YouTube_Bot_Comments_Filter-0f0f0f?style=for-the-badge&labelColor=ff0000)](https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js)

### التثبيت من URL (لوحة التحكم)

| المدير | المسار |
|--------|--------|
| Tampermonkey | لوحة التحكم → **Utilities** → **Install from URL** |
| Violentmonkey | لوحة التحكم → **+** → **Install from URL** |
| Greasemonkey | قائمة الإضافة → **New User Script** → الصق رابط raw |
| ScriptCat | ثبّت [الإضافة](https://scriptcat.org/) واستخدم رابط raw من GitHub |

الصق [رابط التثبيت](#تثبيت-سريع) أعلاه.

### التثبيت اليدوي

1. افتح الملف المبني [`youtube-bot-comments-filter.user.js`](youtube-bot-comments-filter.user.js) في هذا المستودع (أو نفّذ `npm run build` بعد الاستنساخ).
2. انسخ محتوى الملف بالكامل.
3. في مدير سكربتات المستخدم، أنشئ سكربتًا جديدًا والصق الكود.
4. احفظ السكربت وفعّله.

## التحديثات

يتضمن السكربت بيانات `@updateURL` (ملف `.meta.js` الخفيف) و`@downloadURL` (ملف `.user.js` الكامل). تتحقق المديرون المدعومون من التحديثات تلقائيًا.

**لإصدار نسخة جديدة:**

1. غيّر `version` في [`package.json`](package.json).
2. نفّذ `npm run build` (يعيد إنشاء ملفات الجذر `youtube-bot-comments-filter.user.js` / `.meta.js`).
3. أضف مدخلًا في [`CHANGELOG.md`](CHANGELOG.md).
4. ادفع إلى `main` (أو أنشئ GitHub Release).

## الميزات

- **كشف الروبوتات بالاسم** — محرك قواعد مرجّح يقيّم الأسماء المعروضة للمعلّقين (مثل `@SAWS.PW__TyT_Ha_CauT_05`)
- **وضع الإخفاء** — يُستبدل نص تعليق الروبوت بإشعار مترجم
- **وضع التمويه** — تبقى تعليقات الروبوتات في مكانها لكنها مموّهة ومُعتّمة؛ مرّر المؤشر للكشف عنها
- **إعدادات في قائمة الحساب** — مدخل في قائمة الصورة الرمزية مع خيارات الإخفاء/التمويه ومفتاح لشارة «% الروبوت»
- **شارة الثقة** — الاحتمال التقديري للروبوت عندما يتجاوز 50% (كهرماني / برتقالي / أحمر)؛ يمكن إيقافها من الإعدادات
- **حفظ التفضيلات** — يُحفظ الوضع المختار بين الجلسات
- **مظهر YouTube** — يستخدم متغيرات CSS الخاصة بـ YouTube للتوافق مع السمتين الفاتحة والداكنة
- **10 لغات للواجهة** — الإنجليزية والروسية والإسبانية والفرنسية والألمانية والبرتغالية والصينية واليابانية والعربية والهندية (حسب لغة المتصفح)

## الصفحات المدعومة

| الموقع | نمط URL |
|--------|---------|
| YouTube | `https://www.youtube.com/*` |

يعمل في صفحات المشاهدة وShorts التي تحتوي على تعليقات وأي عرض في YouTube يعرض قسم التعليقات القياسي (`ytd-comment-view-model` / `ytd-comment-renderer`).

## أوضاع العرض

| الوضع | السلوك |
|-------|--------|
| **إخفاء** (الافتراضي) | يُستبدل نص التعليق بإشعار قصير؛ يبقى التخطيط مستقرًا |
| **تمويه** | تظهر تعليقات الروبوتات مموّهة ورمادية وشبه شفافة؛ يظهر المحتوى الكامل عند تمرير المؤشر |

افتح قائمة الصورة الرمزية → **فلتر الروبوتات** → اختر وضعًا. يوضح النص الفرعي أسفل مدخل القائمة الوضع الحالي.

## كيف يعمل

```
تحميل صفحة YouTube
       │
       ▼
MutationObserver + إعادة فحص دورية (آمنة مع SPA)
       │
       ▼
إضافة مدخل الإعدادات إلى قائمة الحساب عند فتحها
       │
       ▼
لكل تعليق جديد (ytd-comment-view-model / ytd-comment-renderer)
       │
       ▼
قراءة الاسم المعروض للمؤلف (#author-text)
       │
       ▼
تشغيل قواعد BotDetector → جمع الأوزان
       │
       ├── score < الحد ──► يبقى التعليق دون تغيير
       │
       └── score ≥ الحد ──► تطبيق إشعار الإخفاء أو التمويه
```

### كشف الروبوتات

يعتمد الكشف على **الاسم المعروض** للمعلّق، وليس على نص التعليق. لكل قاعدة اسم ووزن ودالة `test(name)`. مجموع النقاط هو مجموع أوزان القواعد المطابقة. إذا كان المجموع **≥ 4** (الحد الافتراضي)، يُعلَّم التعليق كروبوت.

الإشارات المدمجة:

| الإشارة | الوزن | مثال |
|---------|-------|------|
| بادئة شبيهة بالنطاق مع TLD سبام | 3 | `@SAWS.PW__...`، `@TLES.TOP-...` |
| فاصل مباشرة بعد TLD | 2 | `.PW__`، `.TOP-` |
| كلمات سبام منقحرة | 3 | `tyt_ha`، `na_caut`، `smotri`، `4ki_na` |
| حروف وأرقام قبل TLD سبام | 2 | `FK59.TOP` |
| TLD يتبعه ذيل سبام منقحر | 3 | `.TOP_Haxodui_caut_73` |
| لاحقة رقمية في النهاية | 1 | `_73`، `_05` |
| شرطات سفلية كثيرة | 1 | ثلاث `_` أو أكثر في الاسم |
| رقم leetspeak داخل كلمة | 1 | `Sy4ki`، `CauT0` |
| بادئة بأحرف كبيرة مع نقطة | 1 | `@SAWS.PW` |
| قائمة تطابقات دقيقة | 100 | `SAWS.PW`، `TLES.TOP` |

TLDs السبام التي يتم فحصها: `PW` و`TOP` و`XYZ` و`ONLINE` و`SITE` و`CLUB` و`WIN` و`CC` و`ICU` و`VIP` وغيرها مما يُساء استخدامه في أسماء الروبوتات.

لتوسيع الكشف، حرّر `EXACT_MATCHES` / `SPAM_TLDS` في [`src/constants.js`](src/constants.js) أو أضف كائنات جديدة إلى `RULES` في [`src/detection/bot-detector.js`](src/detection/bot-detector.js).

### المحتوى الديناميكي

يحمّل YouTube التعليقات بشكل غير متزامن (تمرير لا نهائي، ردود، تنقل دون إعادة تحميل كاملة). يعالج `MutationObserver` على `document.documentElement` أشجار التعليقات المضافة حديثًا فقط، ويطلق مستمع `yt-navigate-finish` مرورًا كاملًا بعد تنقل SPA. يلتقط مؤقت أمان كل 5 ثوانٍ ما لا يراه المراقب.

## هيكل المستودع

```text
youtube-bot-comments-filter/
├── src/                                      # الشيفرة المصدرية (حرّر هنا)
│   ├── main.js
│   ├── constants.js
│   ├── settings.js
│   ├── i18n/
│   ├── detection/
│   ├── styles/
│   └── features/
├── test/                                     # اختبارات الوحدة (node:test)
├── assets/
│   └── icon.svg                              # أيقونة سكربت المستخدم
├── scripts/                                  # سكربتات مساعدة للبناء
├── youtube-bot-comments-filter.user.js       # سكربت المستخدم المبني والقابل للتثبيت
├── youtube-bot-comments-filter.meta.js       # مرآة البيانات الوصفية المبنية
├── package.json
├── vite.config.js
├── README.md
├── README.<lang>.md                          # الترجمات (ru, es, fr, de, pt, zh, ja, ar, hi)
├── CHANGELOG.md
├── CONTRIBUTING.md                           # الإعداد والاصطلاحات وقائمة تحقق طلب السحب
├── SECURITY.md                               # سياسة الإبلاغ عن الثغرات
└── LICENSE
```

| الملف | الغرض |
|-------|-------|
| `src/` | وحدات المصدر القابلة للتحرير |
| `youtube-bot-comments-filter.user.js` | السكربت المبني القابل للتثبيت الذي يُقدَّم عبر `@downloadURL` |
| `youtube-bot-comments-filter.meta.js` | مرآة خفيفة للبيانات الوصفية لفحص التحديثات |
| `vite.config.js` | بيانات السكربت الوصفية + إعداد Vite / monkey |

## بيانات السكربت الوصفية

الحقول الرئيسية في `// ==UserScript==` (تُنشأ من `vite.config.js` + `package.json`):

| الحقل | القيمة |
|-------|--------|
| `@namespace` | `https://github.com/NemoKing1210/youtube-bot-comments-filter` |
| `@version` | من `package.json` |
| `@updateURL` / `@downloadURL` | `@updateURL` → `.meta.js`; `@downloadURL` → `.user.js` |
| `@homepageURL` | هذا المستودع |
| `@supportURL` | GitHub Issues |
| `@license` | MIT |
| `@grant` | `GM_getValue`، `GM_setValue` |
| `@match` | `https://www.youtube.com/*` |

تتوفر وسوم `@name` و`@description` مترجمة لـ en وru وes وfr وde وpt-BR وzh-CN وja وar وhi.

## الأذونات المطلوبة

| الإذن | الغرض |
|-------|-------|
| `GM_getValue` / `GM_setValue` | حفظ وضع الإخفاء/التمويه بين الجلسات |
| `GM_addStyle` | حقن CSS الخاص بالفلتر والقائمة (يُمنح تلقائيًا عند البناء بواسطة Vite) |

لا تُجرى أي طلبات شبكة. يقرأ السكربت DOM فقط ويطبّق فئات CSS.

## التطوير

يتطلب [Node.js](https://nodejs.org/) 20+ (npm).

```bash
npm install
npm test         # اختبارات الوحدة (node:test)
npm run dev      # خادم Vite — افتح/ثبّت سكربت المستخدم المُنشأ "dev:"
npm run build    # إنتاج → dist/ + نسخ إلى جذر المستودع
npm run ci       # نفس فحوص GitHub Actions (البناء + التحقق من المخرجات)
```

حرّر الملفات ضمن [`src/`](src/) (نقطة الدخول: [`src/main.js`](src/main.js)). توجد بيانات السكربت الوصفية (`@match` والأسماء المترجمة …) في [`vite.config.js`](vite.config.js). يأتي الإصدار من `package.json` → `@version` في الترويسة.

بعد التغييرات التي يجب نشرها، نفّذ `npm run build` وأضف ملفات الجذر `.user.js` / `.meta.js` المُعاد إنشاؤها إلى الالتزام. تشغّل طلبات السحب [CI](.github/workflows/ci.yml)، وتفشل إذا كانت هذه الملفات قديمة.

### ملاحظات سير العمل المحلي

- **`npm run dev`:** يقدّم vite-plugin-monkey سكربت مستخدم قابلًا للتثبيت (الاسم مسبوق بـ `dev:`). ثبّته مرة واحدة في Tampermonkey أو Violentmonkey أو ScriptCat؛ ويطبّق HMR التغييرات أثناء تشغيل الخادم.
- **الملف المبني:** بعد `npm run build` يمكنك أيضًا تثبيت `youtube-bot-comments-filter.user.js` من الجذر (لا يزال **Track local file** يعمل في Violentmonkey).
- لا تُدرج قيم localhost في `@updateURL` / `@downloadURL`.

### الإعدادات

| الثابت | الافتراضي | الموقع | الوصف |
|--------|-----------|--------|-------|
| `STORAGE_KEY_MODE` | `ytbf_mode` | `src/constants.js` | مفتاح التخزين لوضع العرض |
| `DEFAULT_MODE` | `hide` | `src/constants.js` | الوضع الأولي عند عدم حفظ تفضيل |
| `STORAGE_KEY_SHOW_SCORE` | `ytbf_show_score` | `src/constants.js` | مفتاح تخزين ظهور شارة «% الروبوت» |
| `DEFAULT_SHOW_SCORE` | `false` | `src/constants.js` | إظهار شارات الثقة افتراضيًا |
| `THRESHOLD` | 4 | `src/constants.js` | الحد الأدنى لنقاط الروبوت لتعليم التعليق |
| `EXACT_MATCHES` | `SAWS.PW`، … | `src/constants.js` | سلاسل فرعية تعلّم الاسم فورًا |
| `SAFETY_RESCAN_MS` | 5000 | `src/constants.js` | مؤقت احتياطي عند فقدان تغيير |

## المساهمة

نرحّب بالمساهمات. راجع [CONTRIBUTING.md](CONTRIBUTING.md) للإعداد المحلي واصطلاحات الشيفرة وقائمة تحقق طلب السحب.

للإبلاغ عن مشكلة أمنية، اتبع [SECURITY.md](SECURITY.md) — لا تفتح issue عامًا.

## إخلاء المسؤولية

هذا المشروع **غير تابع** لـ Google أو YouTube. كشف الروبوتات يعتمد على الاستدلال — قد تُعلَّم بعض الأسماء الشرعية وقد تمر بعض الروبوتات. استخدمه كفلتر للراحة، وليس ضمانًا لجودة التعليقات.

## الترخيص

[MIT](LICENSE) — Copyright (c) 2026 NemoKing

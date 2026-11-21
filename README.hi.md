# YouTube Bot Comments Filter

[English](README.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português (Brasil)](README.pt.md) · [中文（简体）](README.zh.md) · [日本語](README.ja.md) · [العربية](README.ar.md) · **हिन्दी**

> यह एक अनुवाद है। आधिकारिक संस्करण [अंग्रेज़ी README](README.md) है; किसी भी अंतर की स्थिति में अंग्रेज़ी संस्करण मान्य होगा।

[![CI](https://github.com/NemoKing1210/youtube-bot-comments-filter/actions/workflows/ci.yml/badge.svg)](https://github.com/NemoKing1210/youtube-bot-comments-filter/actions/workflows/ci.yml)
[![यूज़रस्क्रिप्ट इंस्टॉल करें](https://img.shields.io/badge/Install-userscript-ff0000?style=for-the-badge)](https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js)
[![लाइसेंस: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![संस्करण](https://img.shields.io/badge/version-1.3.1-green?style=for-the-badge)](CHANGELOG.md)

YouTube के लिए एक यूज़रस्क्रिप्ट जो निकनेम पैटर्न के आधार पर स्पैम बॉट टिप्पणियों को पहचानती है और उन्हें छिपाती या धुंधली करती है। सेटिंग्स YouTube के खाता (अवतार) मेनू में हैं — **बॉट फ़िल्टर** खोलें और **छिपाएँ** या **धुंधला करें** चुनें।

[Tampermonkey](https://www.tampermonkey.net/), [Violentmonkey](https://violentmonkey.github.io/), [Greasemonkey](https://www.greasespot.net/), [ScriptCat](https://scriptcat.org/) और `// ==UserScript==` मेटाडेटा ब्लॉक का समर्थन करने वाले अन्य मैनेजर के साथ संगत।

## त्वरित इंस्टॉल

1. यूज़रस्क्रिप्ट मैनेजर इंस्टॉल करें (Tampermonkey या Violentmonkey की सिफ़ारिश की जाती है)।
2. नीचे दिए इंस्टॉल लिंक पर क्लिक करें — मैनेजर को इंस्टॉल प्रॉम्प्ट दिखाना चाहिए।

**इंस्टॉल URL:**

```
https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js
```

[![इंस्टॉल करें](https://img.shields.io/badge/⬇_Install-YouTube_Bot_Comments_Filter-0f0f0f?style=for-the-badge&labelColor=ff0000)](https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js)

### URL से इंस्टॉल (डैशबोर्ड)

| मैनेजर | पथ |
|--------|-----|
| Tampermonkey | डैशबोर्ड → **Utilities** → **Install from URL** |
| Violentmonkey | डैशबोर्ड → **+** → **Install from URL** |
| Greasemonkey | ऐड-ऑन मेनू → **New User Script** → raw URL पेस्ट करें |
| ScriptCat | [एक्सटेंशन](https://scriptcat.org/) इंस्टॉल करें और GitHub raw URL इस्तेमाल करें |

ऊपर दिया [इंस्टॉल URL](#त्वरित-इंस्टॉल) पेस्ट करें।

### मैन्युअल इंस्टॉल

1. इस रिपॉज़िटरी में बना हुआ [`youtube-bot-comments-filter.user.js`](youtube-bot-comments-filter.user.js) खोलें (या क्लोन के बाद `npm run build` चलाएँ)।
2. फ़ाइल की सारी सामग्री कॉपी करें।
3. अपने यूज़रस्क्रिप्ट मैनेजर में नई स्क्रिप्ट बनाएँ और कोड पेस्ट करें।
4. सेव करें और स्क्रिप्ट सक्षम करें।

## अपडेट

स्क्रिप्ट में `@updateURL` (हल्का `.meta.js`) और `@downloadURL` (पूरा `.user.js`) मेटाडेटा शामिल है। समर्थित मैनेजर अपडेट अपने आप जाँचते हैं।

**नया संस्करण जारी करने के लिए:**

1. [`package.json`](package.json) में `version` बदलें।
2. `npm run build` चलाएँ (रूट की `youtube-bot-comments-filter.user.js` / `.meta.js` फिर से बनती हैं)।
3. [`CHANGELOG.md`](CHANGELOG.md) में प्रविष्टि जोड़ें।
4. `main` पर पुश करें (या GitHub Release बनाएँ)।

## विशेषताएँ

- **निकनेम से बॉट पहचान** — भारित नियम इंजन टिप्पणीकर्ताओं के प्रदर्शित नामों को स्कोर करता है (जैसे `@SAWS.PW__TyT_Ha_CauT_05`)
- **छिपाने का मोड** — बॉट टिप्पणी का मुख्य भाग स्थानीयकृत सूचना से बदल दिया जाता है
- **धुंधला करने का मोड** — बॉट टिप्पणियाँ अपनी जगह रहती हैं, लेकिन धुंधली और हल्की हो जाती हैं; देखने के लिए होवर करें
- **खाता मेनू में सेटिंग्स** — अवतार मेनू में प्रविष्टि, छिपाएँ/धुंधला करें विकल्प और "बॉट %" बैज का टॉगल
- **विश्वास बैज** — 50% से अधिक अनुमानित बॉट संभावना पर दिखता है (एम्बर / नारंगी / लाल); सेटिंग्स में बंद किया जा सकता है
- **स्थायी प्राथमिकता** — चुना गया मोड सत्रों के बीच सहेजा जाता है
- **YouTube जैसी स्टाइलिंग** — लाइट और डार्क थीम के लिए YouTube CSS वेरिएबल का उपयोग
- **10 UI भाषाएँ** — अंग्रेज़ी, रूसी, स्पेनिश, फ़्रेंच, जर्मन, पुर्तगाली, चीनी, जापानी, अरबी, हिन्दी (ब्राउज़र लोकेल से पहचान)

## समर्थित पेज

| साइट | URL पैटर्न |
|------|------------|
| YouTube | `https://www.youtube.com/*` |

वॉच पेज, टिप्पणियों वाले Shorts और YouTube के किसी भी ऐसे व्यू पर काम करता है जो मानक टिप्पणी अनुभाग (`ytd-comment-view-model` / `ytd-comment-renderer`) रेंडर करता है।

## डिस्प्ले मोड

| मोड | व्यवहार |
|-----|---------|
| **छिपाएँ** (डिफ़ॉल्ट) | टिप्पणी का मुख्य भाग छोटी सूचना से बदल जाता है; लेआउट स्थिर रहता है |
| **धुंधला करें** | बॉट टिप्पणियाँ धुंधली, ग्रेस्केल और अर्ध-पारदर्शी दिखती हैं; होवर करने पर पूरी सामग्री दिखती है |

अवतार मेनू → **बॉट फ़िल्टर** → मोड चुनें। मेनू प्रविष्टि के नीचे सबटाइटल वर्तमान मोड दिखाता है।

## यह कैसे काम करता है

```
YouTube पेज लोड होता है
       │
       ▼
MutationObserver + आवधिक पुनःस्कैन (SPA-सुरक्षित)
       │
       ▼
खाता मेनू खुलने पर सेटिंग्स प्रविष्टि जोड़ें
       │
       ▼
हर नई टिप्पणी के लिए (ytd-comment-view-model / ytd-comment-renderer)
       │
       ▼
लेखक का प्रदर्शित नाम पढ़ें (#author-text)
       │
       ▼
BotDetector नियम चलाएँ → भार जोड़ें
       │
       ├── score < सीमा ──► टिप्पणी अपरिवर्तित रहती है
       │
       └── score ≥ सीमा ──► छिपाने की सूचना या धुंधलापन लागू करें
```

### बॉट पहचान

पहचान टिप्पणी के टेक्स्ट पर नहीं, बल्कि टिप्पणीकर्ता के **प्रदर्शित नाम** पर आधारित है। प्रत्येक नियम में एक नाम, भार और `test(name)` फ़ंक्शन होता है। कुल स्कोर मेल खाने वाले नियमों के भार का योग है। यदि कुल **≥ 4** (डिफ़ॉल्ट सीमा) है, तो टिप्पणी को बॉट के रूप में चिह्नित किया जाता है।

अंतर्निहित संकेत:

| संकेत | भार | उदाहरण |
|-------|-----|---------|
| स्पैम TLD वाला डोमेन-जैसा प्रीफ़िक्स | 3 | `@SAWS.PW__...`, `@TLES.TOP-...` |
| TLD के तुरंत बाद विभाजक | 2 | `.PW__`, `.TOP-` |
| ट्रांसलिटरेटेड स्पैम कीवर्ड | 3 | `tyt_ha`, `na_caut`, `smotri`, `4ki_na` |
| स्पैम TLD से पहले अक्षर और अंक | 2 | `FK59.TOP` |
| TLD के बाद ट्रांसलिटरेटेड स्पैम टेल | 3 | `.TOP_Haxodui_caut_73` |
| अंत में संख्यात्मक सफ़िक्स | 1 | `_73`, `_05` |
| बहुत सारे अंडरस्कोर | 1 | नाम में तीन या अधिक `_` |
| शब्द में leetspeak अंक | 1 | `Sy4ki`, `CauT0` |
| बिंदु के साथ अपरकेस प्रीफ़िक्स | 1 | `@SAWS.PW` |
| सटीक मिलान सूची | 100 | `SAWS.PW`, `TLES.TOP` |

जाँचे जाने वाले स्पैम TLD: `PW`, `TOP`, `XYZ`, `ONLINE`, `SITE`, `CLUB`, `WIN`, `CC`, `ICU`, `VIP` और अन्य जो बॉट निकनेम में अक्सर दुरुपयोग होते हैं।

पहचान बढ़ाने के लिए [`src/constants.js`](src/constants.js) में `EXACT_MATCHES` / `SPAM_TLDS` संपादित करें या [`src/detection/bot-detector.js`](src/detection/bot-detector.js) में `RULES` में नए ऑब्जेक्ट जोड़ें।

### गतिशील सामग्री

YouTube टिप्पणियाँ अतुल्यकालिक रूप से लोड करता है (अनंत स्क्रॉल, उत्तर, बिना पूर्ण रीलोड के नेविगेशन)। `document.documentElement` पर `MutationObserver` केवल नए जोड़े गए टिप्पणी सबट्री को संसाधित करता है, और `yt-navigate-finish` लिसनर SPA नेविगेशन के बाद पूरा पास चलाता है। 5 सेकंड का सुरक्षा अंतराल वह पकड़ता है जो ऑब्ज़र्वर नहीं देख सकता।

## रिपॉज़िटरी संरचना

```text
youtube-bot-comments-filter/
├── src/                                      # स्रोत कोड (यहाँ संपादित करें)
│   ├── main.js
│   ├── constants.js
│   ├── settings.js
│   ├── i18n/
│   ├── detection/
│   ├── styles/
│   └── features/
├── test/                                     # यूनिट टेस्ट (node:test)
├── assets/
│   └── icon.svg                              # यूज़रस्क्रिप्ट आइकन
├── scripts/                                  # बिल्ड सहायक स्क्रिप्ट
├── youtube-bot-comments-filter.user.js       # बना हुआ इंस्टॉल-योग्य यूज़रस्क्रिप्ट
├── youtube-bot-comments-filter.meta.js       # बना हुआ केवल-मेटाडेटा मिरर
├── package.json
├── vite.config.js
├── README.md
├── README.<lang>.md                          # अनुवाद (ru, es, fr, de, pt, zh, ja, ar, hi)
├── CHANGELOG.md
├── CONTRIBUTING.md                           # सेटअप, कन्वेंशन, PR चेकलिस्ट
├── SECURITY.md                               # कमज़ोरी रिपोर्टिंग नीति
└── LICENSE
```

| फ़ाइल | उद्देश्य |
|-------|----------|
| `src/` | संपादन-योग्य स्रोत मॉड्यूल |
| `youtube-bot-comments-filter.user.js` | `@downloadURL` पर परोसी जाने वाली बनी हुई इंस्टॉल-योग्य स्क्रिप्ट |
| `youtube-bot-comments-filter.meta.js` | अपडेट जाँच के लिए हल्का मेटाडेटा मिरर |
| `vite.config.js` | यूज़रस्क्रिप्ट मेटाडेटा + Vite / monkey कॉन्फ़िगरेशन |

## स्क्रिप्ट मेटाडेटा

`// ==UserScript==` के मुख्य फ़ील्ड (`vite.config.js` + `package.json` से बनते हैं):

| फ़ील्ड | मान |
|--------|-----|
| `@namespace` | `https://github.com/NemoKing1210/youtube-bot-comments-filter` |
| `@version` | `package.json` से |
| `@updateURL` / `@downloadURL` | `@updateURL` → `.meta.js`; `@downloadURL` → `.user.js` |
| `@homepageURL` | यह रिपॉज़िटरी |
| `@supportURL` | GitHub Issues |
| `@license` | MIT |
| `@grant` | `GM_getValue`, `GM_setValue` |
| `@match` | `https://www.youtube.com/*` |

en, ru, es, fr, de, pt-BR, zh-CN, ja, ar और hi के लिए स्थानीयकृत `@name` और `@description` टैग उपलब्ध हैं।

## आवश्यक अनुमतियाँ

| अनुमति | उद्देश्य |
|--------|----------|
| `GM_getValue` / `GM_setValue` | सत्रों के बीच छिपाएँ/धुंधला करें मोड सहेजें |
| `GM_addStyle` | फ़िल्टर और मेनू CSS इंजेक्ट करें (Vite बिल्ड द्वारा स्वतः दी जाती है) |

कोई नेटवर्क अनुरोध नहीं किया जाता। स्क्रिप्ट केवल DOM पढ़ती है और CSS क्लास लागू करती है।

## विकास

[Node.js](https://nodejs.org/) 20+ (npm) आवश्यक है।

```bash
npm install
npm test         # यूनिट टेस्ट (node:test)
npm run dev      # Vite सर्वर — बनी हुई "dev:" यूज़रस्क्रिप्ट खोलें/इंस्टॉल करें
npm run build    # प्रोडक्शन → dist/ + रिपॉज़िटरी रूट में कॉपी
npm run ci       # GitHub Actions जैसी ही जाँच (बिल्ड + आर्टिफ़ैक्ट सत्यापन)
```

[`src/`](src/) के अंतर्गत फ़ाइलें संपादित करें (प्रवेश बिंदु: [`src/main.js`](src/main.js))। यूज़रस्क्रिप्ट मेटाडेटा (`@match`, स्थानीयकृत नाम, …) [`vite.config.js`](vite.config.js) में है। संस्करण `package.json` → हेडर में `@version` से आता है।

जारी होने वाले बदलावों के बाद `npm run build` चलाएँ और फिर से बनी रूट `.user.js` / `.meta.js` फ़ाइलें कमिट करें। Pull Request पर [CI](.github/workflows/ci.yml) चलता है, जो इन फ़ाइलों के पुराने होने पर विफल हो जाता है।

### स्थानीय वर्कफ़्लो नोट्स

- **`npm run dev`:** vite-plugin-monkey एक इंस्टॉल-योग्य यूज़रस्क्रिप्ट परोसता है (नाम में `dev:` उपसर्ग)। इसे Tampermonkey, Violentmonkey या ScriptCat में एक बार इंस्टॉल करें; सर्वर चलते समय HMR बदलाव लागू करता है।
- **बनी हुई फ़ाइल:** `npm run build` के बाद आप रूट की `youtube-bot-comments-filter.user.js` भी इंस्टॉल कर सकते हैं (Violentmonkey में **Track local file** अभी भी काम करता है)।
- localhost वाले `@updateURL` / `@downloadURL` मान कमिट न करें।

### कॉन्फ़िगरेशन

| कॉन्स्टेंट | डिफ़ॉल्ट | स्थान | विवरण |
|-----------|----------|-------|-------|
| `STORAGE_KEY_MODE` | `ytbf_mode` | `src/constants.js` | डिस्प्ले मोड के लिए स्टोरेज कुंजी |
| `DEFAULT_MODE` | `hide` | `src/constants.js` | प्राथमिकता सहेजी न होने पर प्रारंभिक मोड |
| `STORAGE_KEY_SHOW_SCORE` | `ytbf_show_score` | `src/constants.js` | "बॉट %" बैज दिखने की स्टोरेज कुंजी |
| `DEFAULT_SHOW_SCORE` | `false` | `src/constants.js` | डिफ़ॉल्ट रूप से विश्वास बैज दिखाएँ |
| `THRESHOLD` | 4 | `src/constants.js` | टिप्पणी को बॉट चिह्नित करने का न्यूनतम स्कोर |
| `EXACT_MATCHES` | `SAWS.PW`, … | `src/constants.js` | ऐसे सबस्ट्रिंग जो निकनेम को तुरंत चिह्नित करते हैं |
| `SAFETY_RESCAN_MS` | 5000 | `src/constants.js` | छूटे बदलाव के लिए बैकअप टाइमर |

## योगदान

योगदान का स्वागत है। स्थानीय सेटअप, कोड कन्वेंशन और Pull Request चेकलिस्ट के लिए [CONTRIBUTING.md](CONTRIBUTING.md) देखें।

सुरक्षा समस्या की रिपोर्ट करने के लिए [SECURITY.md](SECURITY.md) का पालन करें — सार्वजनिक issue न खोलें।

## अस्वीकरण

यह प्रोजेक्ट Google या YouTube से **संबद्ध नहीं** है। बॉट पहचान अनुमान-आधारित है — कुछ वैध निकनेम चिह्नित हो सकते हैं और कुछ बॉट छूट सकते हैं। इसे सुविधा के लिए फ़िल्टर मानें, टिप्पणी गुणवत्ता की गारंटी नहीं।

## लाइसेंस

[MIT](LICENSE) — Copyright (c) 2026 NemoKing

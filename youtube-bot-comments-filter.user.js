// ==UserScript==
// @name              YouTube Bot Comments Filter
// @name:ru           YouTube Bot Comments Filter — фильтр бот-комментариев
// @name:es           YouTube Bot Comments Filter — filtro de bots
// @name:fr           YouTube Bot Comments Filter — filtre de bots
// @name:de           YouTube Bot Comments Filter — Bot-Kommentarfilter
// @name:pt-BR        YouTube Bot Comments Filter — filtro de bots
// @name:zh-CN        YouTube Bot Comments Filter — 机器人评论过滤
// @name:ja           YouTube Bot Comments Filter — ボットコメントフィルター
// @name:ar           YouTube Bot Comments Filter — فلتر تعليقات الروبوت
// @name:hi           YouTube Bot Comments Filter — बॉट टिप्पणी फ़िल्टर
// @namespace         https://github.com/NemoKing1210/youtube-bot-comments-filter
// @version           1.0.3
// @description       Hides or blurs bot comments on YouTube (nickname pattern detection) with a toggle in the comments sort panel. Multilingual UI.
// @description:ru    Скрывает или размывает бот-комментарии на YouTube (детекция по нику) с переключателем в панели сортировки. Мультиязычный UI.
// @description:es    Oculta o difumina comentarios de bots en YouTube (detección por apodo) con un interruptor en el panel de ordenación. UI multilingüe.
// @description:fr    Masque ou floute les commentaires de bots sur YouTube (détection par pseudo) avec un bouton dans le panneau de tri. UI multilingue.
// @description:de     Blendet Bot-Kommentare auf YouTube aus oder macht sie unscharf (Erkennung per Nickname) mit Umschalter im Sortierpanel. Mehrsprachige UI.
// @description:pt-BR  Oculta ou desfoca comentários de bots no YouTube (detecção por apelido) com alternância no painel de ordenação. UI multilíngue.
// @description:zh-CN  在 YouTube 上隐藏或模糊机器人评论（昵称模式检测），评论排序面板内可切换显示模式。多语言界面。
// @description:ja     YouTubeのボットコメントを非表示またはぼかし（ニックネーム検出）、コメント並べ替えパネルに切り替え。多言語UI。
// @description:ar     يخفي أو يموّه تعليقات الروبوت على YouTube (كشف بالاسم) مع زر تبديل في لوحة ترتيب التعليقات. واجهة متعددة اللغات.
// @description:hi     YouTube पर बॉट टिप्पणियों को छिपाता या धुंधला करता है (उपनाम पैटर्न), सॉर्ट पैनल में टॉगल। बहुभाषी UI।
// @author             NemoKing1210
// @tag                youtube
// @tag                comments
// @tag                filter
// @homepageURL        https://github.com/NemoKing1210/youtube-bot-comments-filter
// @supportURL         https://github.com/NemoKing1210/youtube-bot-comments-filter/issues
// @updateURL          https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js
// @downloadURL        https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js
// @license            MIT
// @icon               https://www.youtube.com/s/desktop/favicon_48x48.png
// @match              https://www.youtube.com/*
// @grant              GM_getValue
// @grant              GM_setValue
// @run-at             document-idle
// @noframes
// ==/UserScript==

(function () {
    'use strict';
  
    /* =========================================================================
     *  1. SETTINGS / STORAGE
     * ========================================================================= */
  
    const STORAGE_KEY_MODE = 'ytbf_mode'; // 'hide' | 'blur'
    const DEFAULT_MODE = 'hide';
  
    function getMode() {
      return GM_getValue(STORAGE_KEY_MODE, DEFAULT_MODE);
    }
    function setMode(mode) {
      GM_setValue(STORAGE_KEY_MODE, mode);
    }
  
    /* =========================================================================
     *  2. I18N — auto-detected from browser language, falls back to English
     *
     *  To add a new language: add a new key (ISO 639-1 code) to LOCALES
     *  with the same three fields as the others.
     * ========================================================================= */
  
    const LOCALES = {
      en: {
        hide: 'Bots: hidden',
        blur: 'Bots: blurred',
        tooltip: 'Toggle bot-comment display mode (hide / blur)',
        hiddenNotice: 'This comment was hidden by the bot filter.',
      },
      ru: {
        hide: 'Боты: скрыты',
        blur: 'Боты: размыты',
        tooltip: 'Переключить режим отображения бот-комментариев (скрыть / размыть)',
        hiddenNotice: 'Этот комментарий скрыт фильтром ботов.',
      },
      es: {
        hide: 'Bots: ocultos',
        blur: 'Bots: difuminados',
        tooltip: 'Alternar el modo de visualización de comentarios de bots (ocultar / difuminar)',
        hiddenNotice: 'Este comentario fue ocultado por el filtro de bots.',
      },
      fr: {
        hide: 'Bots : masqués',
        blur: 'Bots : flous',
        tooltip: "Basculer le mode d'affichage des commentaires de bots (masquer / flouter)",
        hiddenNotice: 'Ce commentaire a été masqué par le filtre anti-bots.',
      },
      de: {
        hide: 'Bots: ausgeblendet',
        blur: 'Bots: unscharf',
        tooltip: 'Anzeigemodus für Bot-Kommentare umschalten (ausblenden / unscharf)',
        hiddenNotice: 'Dieser Kommentar wurde vom Bot-Filter ausgeblendet.',
      },
      pt: {
        hide: 'Bots: ocultos',
        blur: 'Bots: desfocados',
        tooltip: 'Alternar o modo de exibição de comentários de bots (ocultar / desfocar)',
        hiddenNotice: 'Este comentário foi ocultado pelo filtro de bots.',
      },
      zh: {
        hide: '机器人：已隐藏',
        blur: '机器人：已模糊',
        tooltip: '切换机器人评论的显示模式（隐藏 / 模糊）',
        hiddenNotice: '此评论已被机器人过滤器隐藏。',
      },
      ja: {
        hide: 'ボット：非表示',
        blur: 'ボット：ぼかし',
        tooltip: 'ボットコメントの表示モードを切り替え（非表示 / ぼかし）',
        hiddenNotice: 'このコメントはボットフィルターにより非表示にされました。',
      },
      ar: {
        hide: 'الروبوتات: مخفية',
        blur: 'الروبوتات: ضبابية',
        tooltip: 'تبديل طريقة عرض تعليقات الروبوتات (إخفاء / تمويه)',
        hiddenNotice: 'تم إخفاء هذا التعليق بواسطة فلتر الروبوتات.',
      },
      hi: {
        hide: 'बॉट: छिपे हुए',
        blur: 'बॉट: धुंधले',
        tooltip: 'बॉट टिप्पणियों का प्रदर्शन मोड बदलें (छिपाएं / धुंधला करें)',
        hiddenNotice: 'यह टिप्पणी बॉट फ़िल्टर द्वारा छिपाई गई थी।',
      },
    };
  
    function detectLang() {
      const browserLang = (navigator.language || 'en').split('-')[0].toLowerCase();
      return LOCALES[browserLang] ? browserLang : 'en';
    }
  
    const LANG = detectLang();
    function t(key) {
      return (LOCALES[LANG] && LOCALES[LANG][key]) || LOCALES.en[key] || key;
    }
  
    /* =========================================================================
     *  3. BOT DETECTION ENGINE (easily extensible)
     *
     *  Each rule is an object { name, weight, test(name) }.
     *  test() receives the commenter's display name (e.g. "@SAWS.PW__TyT...")
     *  and returns true/false. The total score is the sum of weights of all
     *  rules that matched. If total >= THRESHOLD, the comment is flagged as bot.
     *
     *  To add a new rule — just push a new object into RULES.
     *  To ban an exact nickname/substring — add it to EXACT_MATCHES.
     * ========================================================================= */
  
    // Exact substrings — if the nickname contains one of these, it's almost
    // certainly a bot. Extend this list as new spam accounts are discovered.
    const EXACT_MATCHES = [
      'SAWS.PW',
      'TLES.TOP',
      'FK59.TOP',
    ];
  
    // Common "junk" TLDs that spam bots stuff into their nickname like a domain.
    const SPAM_TLDS = [
      'PW', 'TOP', 'XYZ', 'ONLINE', 'SITE', 'CLUB', 'WIN', 'CC', 'ICU',
      'VIP', 'CFD', 'SBS', 'SPACE', 'FUN', 'LIVE', 'MOM', 'CASA', 'MONSTER',
      'CYOU', 'BUZZ', 'WORK', 'RUN', 'STREAM', 'CAM',
    ];
    const TLD_ALT = SPAM_TLDS.join('|');
  
    const RULES = [
      {
        name: 'domain-like-prefix',
        // e.g. SAWS.PW__ or FK59.TOP_  (\b fails before _ — TLD must allow _/- suffix)
        weight: 3,
        test: (name) => new RegExp(`^@?[A-Z0-9]{2,}\\.(${TLD_ALT})(?:[_-]|$|[^A-Za-z0-9])`, 'i').test(name),
      },
      {
        name: 'separator-right-after-tld',
        // .PW__  or  .TOP-
        weight: 2,
        test: (name) => new RegExp(`\\.(${TLD_ALT})[_-]{1,3}`, 'i').test(name),
      },
      {
        name: 'translit-spam-keywords',
        // transliterated spam phrases like "here on the site", "go to", "watch"
        weight: 3,
        test: (name) => /(tyt[_-]?ha|[_-]caut[_-]|^caut|na[_-]?caut|na[_-]?sait|saite|sayte|perehod|smotri|4ki[_-]?na|shtuki|haxodui|hodui[_-]?caut)/i.test(name),
      },
      {
        name: 'alnum-digit-before-tld',
        // e.g. FK59.TOP — letters+digits stuffed before a spam TLD
        weight: 2,
        test: (name) => new RegExp(`^@?[A-Z0-9]*\\d[A-Z0-9]*\\.(${TLD_ALT})`, 'i').test(name),
      },
      {
        name: 'tld-then-translit-suffix',
        // e.g. .TOP_Haxodui_caut_73 — domain TLD followed by translit spam tail
        weight: 3,
        test: (name) => new RegExp(`\\.(${TLD_ALT})_[A-Za-z0-9]*caut`, 'i').test(name),
      },
      {
        name: 'trailing-numeric-suffix',
        // e.g. _73, _05 at end of bot handles
        weight: 1,
        test: (name) => /[_-]\d{2,3}$/.test(name.trim()),
      },
      {
        name: 'many-underscores',
        weight: 1,
        test: (name) => (name.match(/_/g) || []).length >= 3,
      },
      {
        name: 'leetspeak-digit-in-word',
        // letter-digit-letter inside a word (Sy4ki, CauT0)
        weight: 1,
        test: (name) => /[a-z]\d[a-z]/i.test(name),
      },
      {
        name: 'caps-prefix-with-dot',
        weight: 1,
        test: (name) => /^@?[A-Z]{3,}\.[A-Z]{2,5}/.test(name),
      },
      {
        name: 'exact-match-list',
        weight: 100, // a single match is enough to flag it for certain
        test: (name) => EXACT_MATCHES.some((s) => name.toUpperCase().includes(s.toUpperCase())),
      },
    ];
  
    const THRESHOLD = 4;
  
    const BotDetector = {
      rules: RULES,
      threshold: THRESHOLD,
      score(name) {
        let total = 0;
        const matched = [];
        for (const rule of this.rules) {
          try {
            if (rule.test(name)) {
              total += rule.weight;
              matched.push(rule.name);
            }
          } catch (e) {
            console.warn('[ytbf] rule error:', rule.name, e);
          }
        }
        return { total, matched };
      },
      isBot(name) {
        if (!name) return false;
        return this.score(name).total >= this.threshold;
      },
    };
  
    /* =========================================================================
     *  4. CSS
     *
     *  "hide" mode: original comment body is replaced by a short notice.
     *  "blur" mode: the comment content is hidden/blurred by default and
     *  smoothly revealed only while hovering over the comment.
     * ========================================================================= */

    const HIDDEN_NOTICE_CLASS = 'ytbf-hidden-notice';

    const style = document.createElement('style');
    style.textContent = `
      .ytbf-hide-mode #main > :not(.${HIDDEN_NOTICE_CLASS}) {
        display: none !important;
      }
      .ytbf-hide-mode:not(:has(#main)) > :not(.${HIDDEN_NOTICE_CLASS}) {
        display: none !important;
      }

      .${HIDDEN_NOTICE_CLASS} {
        display: block;
        padding: 10px 0 6px;
        font-size: 13px;
        line-height: 1.4;
        color: var(--yt-spec-text-secondary, #909090);
        font-style: italic;
      }

      .ytbf-blur {
        filter: blur(7px) grayscale(1);
        opacity: 0.35;
        transition: filter 0.25s ease, opacity 0.25s ease;
      }
      .ytbf-blur:hover {
        filter: blur(0) grayscale(0);
        opacity: 1;
      }

      #ytbf-toggle-wrap {
        display: inline-flex;
        align-items: center;
        margin-inline-start: 8px;
        vertical-align: middle;
      }

      ytd-comments-header-renderer #additional-section {
        display: inline-flex;
        align-items: center;
        flex-wrap: nowrap;
      }

      #ytbf-toggle-wrap button.ytbf-toggle-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-height: 36px;
        padding: 0 12px;
        margin: 0;
        border: none;
        outline: none;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        font-family: "Roboto", "Arial", sans-serif;
        font-size: 14px;
        font-weight: 500;
        letter-spacing: normal;
        text-transform: none;
        color: var(--yt-spec-text-primary, #0f0f0f);
        background: transparent;
        border-radius: 18px;
        -webkit-tap-highlight-color: transparent;
      }

      html[dark] #ytbf-toggle-wrap button.ytbf-toggle-btn,
      html[darker-dark-theme] #ytbf-toggle-wrap button.ytbf-toggle-btn {
        color: var(--yt-spec-text-primary, #f1f1f1);
      }

      #ytbf-toggle-wrap button.ytbf-toggle-btn:hover {
        background: var(--yt-spec-badge-chip-background, rgba(0, 0, 0, 0.05));
      }

      html[dark] #ytbf-toggle-wrap button.ytbf-toggle-btn:hover,
      html[darker-dark-theme] #ytbf-toggle-wrap button.ytbf-toggle-btn:hover {
        background: var(--yt-spec-badge-chip-background, rgba(255, 255, 255, 0.1));
      }

      #ytbf-toggle-wrap button.ytbf-toggle-btn:focus-visible {
        box-shadow: 0 0 0 2px var(--yt-spec-call-to-action-inverse, #065fd4);
      }

      #ytbf-toggle-wrap .ytbf-toggle-icon {
        display: inline-flex;
        width: 24px;
        height: 24px;
        flex: 0 0 auto;
        color: inherit;
      }

      #ytbf-toggle-wrap .ytbf-toggle-icon svg {
        fill: currentColor;
      }

      #ytbf-toggle-wrap .ytbf-label {
        white-space: nowrap;
        line-height: 1.2;
        color: inherit;
      }
    `;
    document.documentElement.appendChild(style);
  
    /* =========================================================================
     *  5. COMMENT PROCESSING
     * ========================================================================= */
  
    const PROCESSED_ATTR = 'data-ytbf-processed';
  
    // Selectors covering both current YouTube comment markup variants.
    const COMMENT_SELECTOR = 'ytd-comment-view-model, ytd-comment-renderer';
  
    function getAuthorName(commentEl) {
      const authorLink = commentEl.querySelector('#author-text');
      if (!authorLink) return '';
      // text like "@SAWS.PW__TyT_Ha_CauT_05"
      return authorLink.textContent.trim();
    }
  
    function getCommentHost(commentEl) {
      return commentEl.querySelector('#main') || commentEl;
    }

    function ensureHiddenNotice(commentEl) {
      const host = getCommentHost(commentEl);
      let notice = host.querySelector(`.${HIDDEN_NOTICE_CLASS}`);
      if (!notice) {
        notice = document.createElement('div');
        notice.className = HIDDEN_NOTICE_CLASS;
        host.appendChild(notice);
      }
      notice.textContent = t('hiddenNotice');
      return notice;
    }

    function removeHiddenNotice(commentEl) {
      commentEl.querySelectorAll(`.${HIDDEN_NOTICE_CLASS}`).forEach((el) => el.remove());
    }

    function applyHideMode(commentEl) {
      commentEl.classList.remove('ytbf-blur');
      commentEl.classList.add('ytbf-hide-mode');
      ensureHiddenNotice(commentEl);
    }

    function applyBlurMode(commentEl) {
      commentEl.classList.remove('ytbf-hide-mode');
      removeHiddenNotice(commentEl);
      commentEl.classList.add('ytbf-blur');
    }

    function applyModeClass(commentEl) {
      commentEl.classList.remove('ytbf-blur', 'ytbf-hide-mode');
      removeHiddenNotice(commentEl);
      if (getMode() === 'hide') {
        applyHideMode(commentEl);
      } else {
        applyBlurMode(commentEl);
      }
    }

    function clearModeClass(commentEl) {
      commentEl.classList.remove('ytbf-blur', 'ytbf-hide-mode');
      removeHiddenNotice(commentEl);
    }
  
    function processComment(commentEl) {
      const author = getAuthorName(commentEl);
      const bot = BotDetector.isBot(author);
  
      commentEl.setAttribute(PROCESSED_ATTR, '1');
      commentEl.dataset.ytbfBot = bot ? '1' : '0';
  
      if (bot) {
        applyModeClass(commentEl);
      } else {
        clearModeClass(commentEl);
      }
    }
  
    // Process only newly-added (unprocessed) comments — used on every mutation.
    function processNewComments(root = document) {
      root.querySelectorAll(`${COMMENT_SELECTOR}:not([${PROCESSED_ATTR}])`).forEach(processComment);
    }
  
    // Re-apply the current display mode to already-flagged bot comments —
    // used when the user toggles the mode, no re-detection needed.
    function reapplyModeToFlaggedComments() {
      document.querySelectorAll(`${COMMENT_SELECTOR}[data-ytbf-bot="1"]`).forEach(applyModeClass);
    }
  
    /* =========================================================================
     *  6. TOGGLE CONTROL INSIDE THE COMMENTS PANEL
     * ========================================================================= */
  
    function createToggleIcon() {
      const icon = document.createElement('span');
      icon.className = 'yt-icon-shape style-scope yt-icon ytSpecIconShapeHost ytbf-toggle-icon';
      icon.setAttribute('aria-hidden', 'true');

      const shell = document.createElement('div');
      shell.style.width = '100%';
      shell.style.height = '100%';
      shell.style.display = 'block';
      shell.style.fill = 'currentcolor';

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('height', '24');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('width', '24');
      svg.setAttribute('focusable', 'false');
      svg.setAttribute('aria-hidden', 'true');
      svg.style.pointerEvents = 'none';
      svg.style.display = 'inherit';
      svg.style.width = '100%';
      svg.style.height = '100%';

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute(
        'd',
        'M4.25 5.61C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39C20.25 4.95 19.08 4 18 4H6c-1.08 0-2.25.95-1.75 1.61z',
      );

      svg.appendChild(path);
      shell.appendChild(svg);
      icon.appendChild(shell);
      return icon;
    }

    function labelForMode(mode) {
      return mode === 'hide' ? t('hide') : t('blur');
    }

    function updateToggleLabel() {
      const text = labelForMode(getMode());
      document.querySelectorAll('#ytbf-toggle-wrap').forEach((wrap) => {
        const label = wrap.querySelector('.ytbf-label');
        const button = wrap.querySelector('button.ytbf-toggle-btn');
        if (label) label.textContent = text;
        if (button) {
          button.title = t('tooltip');
          button.setAttribute('aria-label', text);
        }
      });
    }

    function toggleMode() {
      const next = getMode() === 'hide' ? 'blur' : 'hide';
      setMode(next);
      updateToggleLabel();
      reapplyModeToFlaggedComments();
    }

    function buildToggle() {
      const wrap = document.createElement('span');
      wrap.id = 'ytbf-toggle-wrap';
      wrap.className = 'style-scope ytd-comments-header-renderer';

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'dropdown-trigger style-scope yt-dropdown-menu ytbf-toggle-btn';

      const label = document.createElement('div');
      label.className = 'style-scope yt-dropdown-menu ytbf-label';

      button.appendChild(createToggleIcon());
      button.appendChild(label);
      wrap.appendChild(button);

      button.addEventListener('click', toggleMode);

      return wrap;
    }

    function ensureToggleInserted() {
      const additionalSection = document.querySelector('ytd-comments-header-renderer #additional-section');
      if (!additionalSection) return;

      if (additionalSection.querySelector('#ytbf-toggle-wrap')) {
        updateToggleLabel();
        return;
      }

      const sortMenu = additionalSection.querySelector('#sort-menu');
      const toggle = buildToggle();

      if (sortMenu) {
        sortMenu.insertAdjacentElement('afterend', toggle);
      } else {
        additionalSection.appendChild(toggle);
      }

      updateToggleLabel();
    }
  
    /* =========================================================================
     *  7. DOM OBSERVATION (YouTube is an SPA, comments load dynamically)
     * ========================================================================= */
  
    let scheduled = false;
    function scheduleTick() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        ensureToggleInserted();
        processNewComments();
      });
    }
  
    const observer = new MutationObserver(() => scheduleTick());
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Initial pass + safety-net interval in case a mutation is missed.
    scheduleTick();
    setInterval(scheduleTick, 2000);
  
  })();
import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import pkg from './package.json' with { type: 'json' };

const RAW_BASE =
  'https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      compress: { passes: 2, pure_getters: true },
      mangle: true,
      format: { comments: false },
    },
    cssMinify: true,
    target: 'es2018',
    reportCompressedSize: true,
  },
  esbuild: {
    legalComments: 'none',
  },
  plugins: [
    monkey({
      entry: 'src/main.js',
      userscript: {
        name: {
          '': 'YouTube Bot Comments Filter',
          ru: 'YouTube Bot Comments Filter — фильтр бот-комментариев',
          es: 'YouTube Bot Comments Filter — filtro de bots',
          fr: 'YouTube Bot Comments Filter — filtre de bots',
          de: 'YouTube Bot Comments Filter — Bot-Kommentarfilter',
          'pt-BR': 'YouTube Bot Comments Filter — filtro de bots',
          'zh-CN': 'YouTube Bot Comments Filter — 机器人评论过滤',
          ja: 'YouTube Bot Comments Filter — ボットコメントフィルター',
          ar: 'YouTube Bot Comments Filter — فلتر تعليقات الروبوت',
          hi: 'YouTube Bot Comments Filter — बॉट टिप्पणी फ़िल्टर',
        },
        namespace: 'https://github.com/NemoKing1210/youtube-bot-comments-filter',
        version: pkg.version,
        description: {
          '': 'Hides or blurs bot comments on YouTube (nickname pattern detection) with settings in the account menu. Multilingual UI.',
          ru: 'Скрывает или размывает бот-комментарии на YouTube (детекция по нику) с настройками в меню аккаунта. Мультиязычный UI.',
          es: 'Oculta o difumina comentarios de bots en YouTube (detección por apodo) con ajustes en el menú de la cuenta. UI multilingüe.',
          fr: 'Masque ou floute les commentaires de bots sur YouTube (détection par pseudo) avec des réglages dans le menu du compte. UI multilingue.',
          de: 'Blendet Bot-Kommentare auf YouTube aus oder macht sie unscharf (Erkennung per Nickname) mit Einstellungen im Kontomenü. Mehrsprachige UI.',
          'pt-BR': 'Oculta ou desfoca comentários de bots no YouTube (detecção por apelido) com configurações no menu da conta. UI multilíngue.',
          'zh-CN': '在 YouTube 上隐藏或模糊机器人评论（昵称模式检测），设置位于账号菜单。多语言界面。',
          ja: 'YouTubeのボットコメントを非表示またはぼかし（ニックネーム検出）、設定はアカウントメニュー内。多言語UI。',
          ar: 'يخفي أو يموّه تعليقات الروبوت على YouTube (كشف بالاسم) مع الإعدادات في قائمة الحساب. واجهة متعددة اللغات.',
          hi: 'YouTube पर बॉट टिप्पणियों को छिपाता या धुंधला करता है (उपनाम पैटर्न), सेटिंग्स खाता मेनू में। बहुभाषी UI।',
        },
        author: 'NemoKing1210',
        tag: ['youtube', 'comments', 'filter'],
        homepageURL: 'https://github.com/NemoKing1210/youtube-bot-comments-filter',
        supportURL: 'https://github.com/NemoKing1210/youtube-bot-comments-filter/issues',
        updateURL: `${RAW_BASE}/youtube-bot-comments-filter.user.js`,
        downloadURL: `${RAW_BASE}/youtube-bot-comments-filter.user.js`,
        license: 'MIT',
        icon: 'https://www.youtube.com/s/desktop/0715bbf9/img/favicon_96x96.png',
        match: ['https://www.youtube.com/*'],
        'run-at': 'document-idle',
        noframes: true,
      },
      server: {
        prefix: 'dev:',
      },
      build: {
        fileName: 'youtube-bot-comments-filter.user.js',
        metaFileName: true,
      },
    }),
  ],
});

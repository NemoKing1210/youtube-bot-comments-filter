# YouTube Bot Comments Filter

[English](README.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português (Brasil)](README.pt.md) · [中文（简体）](README.zh.md) · **日本語** · [العربية](README.ar.md) · [हिन्दी](README.hi.md)

> これは翻訳です。正式なバージョンは[英語の README](README.md)です。相違がある場合は英語版が優先されます。

[![CI](https://github.com/NemoKing1210/youtube-bot-comments-filter/actions/workflows/ci.yml/badge.svg)](https://github.com/NemoKing1210/youtube-bot-comments-filter/actions/workflows/ci.yml)
[![ユーザースクリプトをインストール](https://img.shields.io/badge/Install-userscript-ff0000?style=for-the-badge)](https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js)
[![ライセンス: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![バージョン](https://img.shields.io/badge/version-1.3.1-green?style=for-the-badge)](CHANGELOG.md)

YouTube のスパムボットコメントをニックネームのパターンで検出し、非表示またはぼかしにするユーザースクリプトです。設定は YouTube のアカウント（アバター）メニューにあります。**ボットフィルター** を開き、**非表示** または **ぼかし** を選択してください。

[Tampermonkey](https://www.tampermonkey.net/)、[Violentmonkey](https://violentmonkey.github.io/)、[Greasemonkey](https://www.greasespot.net/)、[ScriptCat](https://scriptcat.org/)、および `// ==UserScript==` メタデータブロックに対応するその他のマネージャーと互換性があります。

## クイックインストール

1. ユーザースクリプトマネージャーをインストールします（Tampermonkey または Violentmonkey を推奨）。
2. 下のインストールリンクをクリックすると、マネージャーがインストール確認を表示します。

**インストール URL：**

```
https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js
```

[![インストール](https://img.shields.io/badge/⬇_Install-YouTube_Bot_Comments_Filter-0f0f0f?style=for-the-badge&labelColor=ff0000)](https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js)

### URL からインストール（ダッシュボード）

| マネージャー | パス |
|--------------|------|
| Tampermonkey | ダッシュボード → **Utilities** → **Install from URL** |
| Violentmonkey | ダッシュボード → **+** → **Install from URL** |
| Greasemonkey | アドオンメニュー → **New User Script** → raw URL を貼り付け |
| ScriptCat | [拡張機能](https://scriptcat.org/)をインストールし、GitHub の raw URL を使用 |

上記の[インストール URL](#クイックインストール)を貼り付けてください。

### 手動インストール

1. リポジトリ内のビルド済み [`youtube-bot-comments-filter.user.js`](youtube-bot-comments-filter.user.js) を開きます（またはクローン後に `npm run build` を実行）。
2. ファイルの内容をすべてコピーします。
3. ユーザースクリプトマネージャーで新しいスクリプトを作成し、コードを貼り付けます。
4. 保存してスクリプトを有効にします。

## 更新

スクリプトには `@updateURL`（軽量な `.meta.js`）と `@downloadURL`（完全な `.user.js`）のメタデータが含まれています。対応マネージャーは自動的に更新を確認します。

**新しいバージョンをリリースするには：**

1. [`package.json`](package.json) の `version` を変更します。
2. `npm run build` を実行します（ルートの `youtube-bot-comments-filter.user.js` / `.meta.js` を再生成）。
3. [`CHANGELOG.md`](CHANGELOG.md) にエントリを追加します。
4. `main` にプッシュします（または GitHub Release を作成）。

## 機能

- **ニックネームによるボット検出** — 重み付きルールエンジンがコメント投稿者の表示名を採点します（例：`@SAWS.PW__TyT_Ha_CauT_05`）
- **非表示モード** — ボットコメントの本文をローカライズされた通知に置き換えます
- **ぼかしモード** — ボットコメントはそのままの位置に残りますが、ぼかされて暗くなります。ホバーで表示されます
- **アカウントメニューの設定** — アバターメニューにエントリを追加し、非表示/ぼかしのオプションと「ボット％」バッジの切り替えを提供します
- **信頼度バッジ** — ボットの推定確率が 50% を超える場合に表示（アンバー / オレンジ / レッド）。設定でオフにできます
- **設定の永続化** — 選択したモードはセッション間で保存されます
- **YouTube 風のスタイル** — YouTube の CSS 変数を使用し、ライト/ダークテーマに対応
- **10 言語の UI** — 英語、ロシア語、スペイン語、フランス語、ドイツ語、ポルトガル語、中国語、日本語、アラビア語、ヒンディー語（ブラウザのロケールから判定）

## 対応ページ

| サイト | URL パターン |
|--------|--------------|
| YouTube | `https://www.youtube.com/*` |

視聴ページ、コメント付きの Shorts、標準のコメントセクション（`ytd-comment-view-model` / `ytd-comment-renderer`）を表示するすべての YouTube ビューで動作します。

## 表示モード

| モード | 動作 |
|--------|------|
| **非表示**（デフォルト） | コメント本文が短い通知に置き換わります。レイアウトは崩れません |
| **ぼかし** | ボットコメントがぼかされ、グレースケールかつ半透明で表示されます。ホバーで全文が表示されます |

アバターメニュー → **ボットフィルター** → モードを選択します。メニュー項目の下のサブタイトルに現在のモードが表示されます。

## 仕組み

```
YouTube ページの読み込み
       │
       ▼
MutationObserver + 定期的な再スキャン（SPA 対応）
       │
       ▼
アカウントメニューが開かれたときに設定項目を追加
       │
       ▼
新しいコメントごと（ytd-comment-view-model / ytd-comment-renderer）
       │
       ▼
投稿者の表示名を読み取る（#author-text）
       │
       ▼
BotDetector ルールを実行 → 重みを合計
       │
       ├── score < しきい値 ──► コメントは変更なし
       │
       └── score ≥ しきい値 ──► 非表示通知またはぼかしを適用
```

### ボット検出

検出はコメント本文ではなく、投稿者の**表示名**に基づきます。各ルールには名前、重み、`test(name)` 関数があります。合計スコアは一致したルールの重みの合計です。合計が **≥ 4**（デフォルトのしきい値）の場合、コメントはボットとしてマークされます。

組み込みのシグナル：

| シグナル | 重み | 例 |
|----------|------|-----|
| スパム TLD を含むドメイン風プレフィックス | 3 | `@SAWS.PW__...`、`@TLES.TOP-...` |
| TLD 直後の区切り文字 | 2 | `.PW__`、`.TOP-` |
| 音訳されたスパムキーワード | 3 | `tyt_ha`、`na_caut`、`smotri`、`4ki_na` |
| スパム TLD 前の英字と数字 | 2 | `FK59.TOP` |
| TLD に続く音訳スパム末尾 | 3 | `.TOP_Haxodui_caut_73` |
| 末尾の数字サフィックス | 1 | `_73`、`_05` |
| 多数のアンダースコア | 1 | 名前に `_` が 3 つ以上 |
| 単語内の leetspeak 数字 | 1 | `Sy4ki`、`CauT0` |
| ドット付きの大文字プレフィックス | 1 | `@SAWS.PW` |
| 完全一致リスト | 100 | `SAWS.PW`、`TLES.TOP` |

チェック対象のスパム TLD：`PW`、`TOP`、`XYZ`、`ONLINE`、`SITE`、`CLUB`、`WIN`、`CC`、`ICU`、`VIP` など、ボットのニックネームでよく使われるもの。

検出を拡張するには、[`src/constants.js`](src/constants.js) の `EXACT_MATCHES` / `SPAM_TLDS` を編集するか、[`src/detection/bot-detector.js`](src/detection/bot-detector.js) の `RULES` に新しいオブジェクトを追加します。

### 動的コンテンツ

YouTube はコメントを非同期で読み込みます（無限スクロール、返信、リロードなしのナビゲーション）。`document.documentElement` の `MutationObserver` は新しく追加されたコメントのサブツリーだけを処理し、`yt-navigate-finish` リスナーが SPA ナビゲーション後に全体パスを実行します。5 秒の安全インターバルがオブザーバーで捉えられない変更を補います。

## リポジトリ構成

```text
youtube-bot-comments-filter/
├── src/                                      # ソースコード（ここを編集）
│   ├── main.js
│   ├── constants.js
│   ├── settings.js
│   ├── i18n/
│   ├── detection/
│   ├── styles/
│   └── features/
├── test/                                     # ユニットテスト（node:test）
├── assets/
│   └── icon.svg                              # ユーザースクリプトのアイコン
├── scripts/                                  # ビルド補助スクリプト
├── youtube-bot-comments-filter.user.js       # ビルド済みのインストール可能なユーザースクリプト
├── youtube-bot-comments-filter.meta.js       # ビルド済みのメタデータのみのミラー
├── package.json
├── vite.config.js
├── README.md
├── README.<lang>.md                          # 翻訳（ru, es, fr, de, pt, zh, ja, ar, hi）
├── CHANGELOG.md
├── CONTRIBUTING.md                           # セットアップ、規約、PR チェックリスト
├── SECURITY.md                               # 脆弱性報告ポリシー
└── LICENSE
```

| ファイル | 目的 |
|----------|------|
| `src/` | 編集可能なソースモジュール |
| `youtube-bot-comments-filter.user.js` | `@downloadURL` で配信されるビルド済みインストール可能スクリプト |
| `youtube-bot-comments-filter.meta.js` | 更新確認用の軽量メタデータミラー |
| `vite.config.js` | ユーザースクリプトのメタデータ + Vite / monkey 設定 |

## スクリプトのメタデータ

`// ==UserScript==` の主要フィールド（`vite.config.js` + `package.json` から生成）：

| フィールド | 値 |
|------------|-----|
| `@namespace` | `https://github.com/NemoKing1210/youtube-bot-comments-filter` |
| `@version` | `package.json` から |
| `@updateURL` / `@downloadURL` | `@updateURL` → `.meta.js`; `@downloadURL` → `.user.js` |
| `@homepageURL` | このリポジトリ |
| `@supportURL` | GitHub Issues |
| `@license` | MIT |
| `@grant` | `GM_getValue`、`GM_setValue` |
| `@match` | `https://www.youtube.com/*` |

en、ru、es、fr、de、pt-BR、zh-CN、ja、ar、hi 向けにローカライズされた `@name` と `@description` タグを提供しています。

## 必要な権限

| 権限 | 目的 |
|------|------|
| `GM_getValue` / `GM_setValue` | 非表示/ぼかしモードをセッション間で保存 |
| `GM_addStyle` | フィルターとメニューの CSS を注入（Vite ビルドで自動付与） |

ネットワークリクエストは行いません。スクリプトは DOM を読み取り、CSS クラスを適用するだけです。

## 開発

[Node.js](https://nodejs.org/) 20+（npm）が必要です。

```bash
npm install
npm test         # ユニットテスト（node:test）
npm run dev      # Vite サーバー — 生成された「dev:」ユーザースクリプトを開く/インストール
npm run build    # 本番ビルド → dist/ + リポジトリルートへコピー
npm run ci       # GitHub Actions と同じチェック（ビルド + 成果物の検証）
```

[`src/`](src/) 配下のファイルを編集します（エントリポイント：[`src/main.js`](src/main.js)）。ユーザースクリプトのメタデータ（`@match`、ローカライズ名など）は [`vite.config.js`](vite.config.js) にあります。バージョンは `package.json` の `@version` ヘッダーに反映されます。

リリース対象の変更後は `npm run build` を実行し、再生成されたルートの `.user.js` / `.meta.js` をコミットしてください。Pull Request では [CI](.github/workflows/ci.yml) が実行され、これらのファイルが古いと失敗します。

### ローカルワークフローの注意点

- **`npm run dev`：** vite-plugin-monkey がインストール可能なユーザースクリプト（名前の先頭に `dev:`）を配信します。Tampermonkey、Violentmonkey、ScriptCat のいずれかに一度インストールしてください。サーバー実行中は HMR が変更を適用します。
- **ビルド済みファイル：** `npm run build` 後は、ルートの `youtube-bot-comments-filter.user.js` もインストールできます（Violentmonkey の **Track local file** も利用可能）。
- localhost の `@updateURL` / `@downloadURL` 値をコミットしないでください。

### 設定

| 定数 | デフォルト | 場所 | 説明 |
|------|------------|------|------|
| `STORAGE_KEY_MODE` | `ytbf_mode` | `src/constants.js` | 表示モードのストレージキー |
| `DEFAULT_MODE` | `hide` | `src/constants.js` | 設定が保存されていない場合の初期モード |
| `STORAGE_KEY_SHOW_SCORE` | `ytbf_show_score` | `src/constants.js` | 「ボット％」バッジの表示状態のストレージキー |
| `DEFAULT_SHOW_SCORE` | `false` | `src/constants.js` | 信頼度バッジをデフォルトで表示 |
| `THRESHOLD` | 4 | `src/constants.js` | コメントをボットとしてマークする最小スコア |
| `EXACT_MATCHES` | `SAWS.PW`、… | `src/constants.js` | ニックネームを即座にマークする部分文字列 |
| `SAFETY_RESCAN_MS` | 5000 | `src/constants.js` | 変更を取りこぼした場合の予備タイマー |

## コントリビューション

コントリビューションを歓迎します。ローカルセットアップ、コーディング規約、Pull Request チェックリストは [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

セキュリティ問題の報告は [SECURITY.md](SECURITY.md) に従ってください。公開 issue は作成しないでください。

## 免責事項

このプロジェクトは Google や YouTube と**提携していません**。ボット検出はヒューリスティックです。正当なニックネームがマークされることも、ボットが見逃されることもあります。コメント品質の保証ではなく、便利なフィルターとしてお使いください。

## ライセンス

[MIT](LICENSE) — Copyright (c) 2026 NemoKing

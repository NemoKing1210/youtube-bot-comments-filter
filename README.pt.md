# YouTube Bot Comments Filter

[English](README.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · **Português (Brasil)** · [中文（简体）](README.zh.md) · [日本語](README.ja.md) · [العربية](README.ar.md) · [हिन्दी](README.hi.md)

> Esta é uma tradução. A versão canônica é o [README em inglês](README.md); em caso de divergência, ele prevalece.

[![CI](https://github.com/NemoKing1210/youtube-bot-comments-filter/actions/workflows/ci.yml/badge.svg)](https://github.com/NemoKing1210/youtube-bot-comments-filter/actions/workflows/ci.yml)
[![Instalar userscript](https://img.shields.io/badge/Install-userscript-ff0000?style=for-the-badge)](https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js)
[![Licença: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Versão](https://img.shields.io/badge/version-1.3.1-green?style=for-the-badge)](CHANGELOG.md)

Um userscript para o YouTube que detecta comentários de bots de spam pelo padrão do apelido e os oculta ou desfoca. As configurações ficam no menu da conta (avatar) do YouTube: abra **Filtro de bots** e escolha **Ocultar** ou **Desfocar**.

Compatível com [Tampermonkey](https://www.tampermonkey.net/), [Violentmonkey](https://violentmonkey.github.io/), [Greasemonkey](https://www.greasespot.net/), [ScriptCat](https://scriptcat.org/) e outros gerenciadores que oferecem suporte ao bloco de metadados `// ==UserScript==`.

## Instalação rápida

1. Instale um gerenciador de userscripts (Tampermonkey ou Violentmonkey recomendados).
2. Clique no link de instalação abaixo — o gerenciador deve abrir uma solicitação de instalação.

**URL de instalação:**

```
https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js
```

[![Instalar](https://img.shields.io/badge/⬇_Install-YouTube_Bot_Comments_Filter-0f0f0f?style=for-the-badge&labelColor=ff0000)](https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js)

### Instalação por URL (painel)

| Gerenciador | Caminho |
|-------------|---------|
| Tampermonkey | Painel → **Utilities** → **Install from URL** |
| Violentmonkey | Painel → **+** → **Install from URL** |
| Greasemonkey | Menu da extensão → **New User Script** → cole a URL raw |
| ScriptCat | Instale a [extensão](https://scriptcat.org/) e use a URL raw do GitHub |

Cole a [URL de instalação](#instalação-rápida) acima.

### Instalação manual

1. Abra o arquivo compilado [`youtube-bot-comments-filter.user.js`](youtube-bot-comments-filter.user.js) neste repositório (ou execute `npm run build` após clonar).
2. Copie todo o conteúdo do arquivo.
3. No seu gerenciador de userscripts, crie um novo script e cole o código.
4. Salve e ative o script.

## Atualizações

O script inclui metadados `@updateURL` (o `.meta.js` leve) e `@downloadURL` (o `.user.js` completo). Os gerenciadores compatíveis verificam atualizações automaticamente.

**Para publicar uma nova versão:**

1. Altere `version` em [`package.json`](package.json).
2. Execute `npm run build` (regenera os arquivos raiz `youtube-bot-comments-filter.user.js` / `.meta.js`).
3. Adicione uma entrada em [`CHANGELOG.md`](CHANGELOG.md).
4. Envie para `main` (ou crie um GitHub Release).

## Recursos

- **Detecção de bots pelo apelido** — um mecanismo de regras ponderadas pontua os nomes de exibição dos comentaristas (por exemplo, `@SAWS.PW__TyT_Ha_CauT_05`)
- **Modo ocultar** — o corpo do comentário do bot é substituído por um aviso localizado
- **Modo desfocar** — comentários de bots permanecem no lugar, mas ficam desfocados e esmaecidos; passe o mouse para revelar
- **Configurações no menu da conta** — entrada no menu do avatar com opções ocultar/desfocar e uma chave para o selo "% de bot"
- **Selo de confiança** — probabilidade estimada de bot acima de 50% (âmbar / laranja / vermelho); pode ser desativado nas configurações
- **Preferência persistente** — o modo escolhido é salvo entre sessões
- **Estilo do YouTube** — usa variáveis CSS do YouTube para compatibilidade com temas claro e escuro
- **10 idiomas de interface** — inglês, russo, espanhol, francês, alemão, português, chinês, japonês, árabe e híndi (detectado pelo idioma do navegador)

## Páginas compatíveis

| Site | Padrão de URL |
|------|---------------|
| YouTube | `https://www.youtube.com/*` |

Funciona em páginas de reprodução, em Shorts com comentários e em qualquer visualização do YouTube que renderize a seção de comentários padrão (`ytd-comment-view-model` / `ytd-comment-renderer`).

## Modos de exibição

| Modo | Comportamento |
|------|---------------|
| **Ocultar** (padrão) | O corpo do comentário é substituído por um aviso curto; o layout não se desloca |
| **Desfocar** | Comentários de bots aparecem desfocados, em escala de cinza e semitransparentes; o conteúdo completo aparece ao passar o mouse |

Abra o menu do avatar → **Filtro de bots** → escolha um modo. O subtítulo abaixo da entrada do menu mostra o modo atual.

## Como funciona

```
A página do YouTube carrega
       │
       ▼
MutationObserver + nova varredura periódica (segura para SPA)
       │
       ▼
Criar a entrada de configurações no menu da conta quando ele abrir
       │
       ▼
Para cada novo comentário (ytd-comment-view-model / ytd-comment-renderer)
       │
       ▼
Ler o nome de exibição do autor (#author-text)
       │
       ▼
Executar as regras do BotDetector → somar pesos
       │
       ├── score < limiar ──► comentário permanece inalterado
       │
       └── score ≥ limiar ──► aplicar aviso de ocultação ou desfoque
```

### Detecção de bots

A detecção é baseada no **nome de exibição** do comentarista, não no texto do comentário. Cada regra tem um nome, um peso e uma função `test(name)`. A pontuação total é a soma dos pesos das regras correspondentes. Se o total for **≥ 4** (limiar padrão), o comentário é sinalizado como bot.

Sinais integrados:

| Sinal | Peso | Exemplo |
|-------|------|---------|
| Prefixo semelhante a domínio com TLD de spam | 3 | `@SAWS.PW__...`, `@TLES.TOP-...` |
| Separador logo após o TLD | 2 | `.PW__`, `.TOP-` |
| Palavras-chave de spam transliteradas | 3 | `tyt_ha`, `na_caut`, `smotri`, `4ki_na` |
| Letras e dígitos antes de um TLD de spam | 2 | `FK59.TOP` |
| TLD seguido de uma cauda de spam transliterada | 3 | `.TOP_Haxodui_caut_73` |
| Sufixo numérico final | 1 | `_73`, `_05` |
| Muitos sublinhados | 1 | três ou mais `_` no nome |
| Dígito leetspeak na palavra | 1 | `Sy4ki`, `CauT0` |
| Prefixo em maiúsculas com ponto | 1 | `@SAWS.PW` |
| Lista de correspondências exatas | 100 | `SAWS.PW`, `TLES.TOP` |

TLDs de spam verificados: `PW`, `TOP`, `XYZ`, `ONLINE`, `SITE`, `CLUB`, `WIN`, `CC`, `ICU`, `VIP` e outros usados com frequência em apelidos de bots.

Para ampliar a detecção, edite `EXACT_MATCHES` / `SPAM_TLDS` em [`src/constants.js`](src/constants.js) ou adicione novos objetos a `RULES` em [`src/detection/bot-detector.js`](src/detection/bot-detector.js).

### Conteúdo dinâmico

O YouTube carrega comentários de forma assíncrona (rolagem infinita, respostas, navegação sem recarregar a página). Um `MutationObserver` em `document.documentElement` processa apenas as subárvores de comentários recém-adicionadas, e um listener `yt-navigate-finish` dispara uma passagem completa após navegação SPA. Um intervalo de segurança de 5 segundos captura o que o observador não vê.

## Estrutura do repositório

```text
youtube-bot-comments-filter/
├── src/                                      # Código-fonte (edite aqui)
│   ├── main.js
│   ├── constants.js
│   ├── settings.js
│   ├── i18n/
│   ├── detection/
│   ├── styles/
│   └── features/
├── test/                                     # Testes unitários (node:test)
├── assets/
│   └── icon.svg                              # Ícone do userscript
├── scripts/                                  # Utilitários de build
├── youtube-bot-comments-filter.user.js       # Userscript compilado e instalável
├── youtube-bot-comments-filter.meta.js       # Espelho compilado apenas de metadados
├── package.json
├── vite.config.js
├── README.md
├── README.<lang>.md                          # Traduções (ru, es, fr, de, pt, zh, ja, ar, hi)
├── CHANGELOG.md
├── CONTRIBUTING.md                           # Configuração, convenções, checklist de PR
├── SECURITY.md                               # Política de relato de vulnerabilidades
└── LICENSE
```

| Arquivo | Finalidade |
|---------|------------|
| `src/` | Módulos-fonte editáveis |
| `youtube-bot-comments-filter.user.js` | Script compilado e instalável servido em `@downloadURL` |
| `youtube-bot-comments-filter.meta.js` | Espelho leve de metadados para verificações de atualização |
| `vite.config.js` | Metadados do userscript + configuração do Vite / monkey |

## Metadados do script

Campos principais de `// ==UserScript==` (gerados a partir de `vite.config.js` + `package.json`):

| Campo | Valor |
|-------|-------|
| `@namespace` | `https://github.com/NemoKing1210/youtube-bot-comments-filter` |
| `@version` | De `package.json` |
| `@updateURL` / `@downloadURL` | `@updateURL` → `.meta.js`; `@downloadURL` → `.user.js` |
| `@homepageURL` | Este repositório |
| `@supportURL` | GitHub Issues |
| `@license` | MIT |
| `@grant` | `GM_getValue`, `GM_setValue` |
| `@match` | `https://www.youtube.com/*` |

Tags `@name` e `@description` localizadas são fornecidas para en, ru, es, fr, de, pt-BR, zh-CN, ja, ar e hi.

## Permissões necessárias

| Permissão | Finalidade |
|-----------|------------|
| `GM_getValue` / `GM_setValue` | Salvar o modo ocultar/desfocar entre sessões |
| `GM_addStyle` | Injetar o CSS do filtro e do menu (concedida automaticamente pelo build do Vite) |

Nenhuma requisição de rede é feita. O script apenas lê o DOM e aplica classes CSS.

## Desenvolvimento

Requer [Node.js](https://nodejs.org/) 20+ (npm).

```bash
npm install
npm test         # Testes unitários (node:test)
npm run dev      # Vite serve — abra/instale o userscript gerado "dev:"
npm run build    # Produção → dist/ + cópia para a raiz do repositório
npm run ci       # As mesmas verificações do GitHub Actions (build + verificação de artefatos)
```

Edite os arquivos em [`src/`](src/) (ponto de entrada: [`src/main.js`](src/main.js)). Os metadados do userscript (`@match`, nomes localizados, …) ficam em [`vite.config.js`](vite.config.js). A versão vem de `package.json` → `@version` no cabeçalho.

Após mudanças que devem ser publicadas, execute `npm run build` e faça commit dos arquivos raiz `.user.js` / `.meta.js` regenerados. Os pull requests executam o [CI](.github/workflows/ci.yml), que falha se esses arquivos estiverem desatualizados.

### Notas do fluxo local

- **`npm run dev`:** o vite-plugin-monkey serve um userscript instalável (nome com prefixo `dev:`). Instale-o uma vez no Tampermonkey, Violentmonkey ou ScriptCat; o HMR aplica as mudanças enquanto o servidor estiver rodando.
- **Arquivo compilado:** após `npm run build`, você também pode instalar o `youtube-bot-comments-filter.user.js` da raiz (no Violentmonkey, **Track local file** continua funcionando).
- Não faça commit de valores de localhost em `@updateURL` / `@downloadURL`.

### Configuração

| Constante | Padrão | Local | Descrição |
|-----------|--------|-------|-----------|
| `STORAGE_KEY_MODE` | `ytbf_mode` | `src/constants.js` | Chave de armazenamento do modo de exibição |
| `DEFAULT_MODE` | `hide` | `src/constants.js` | Modo inicial quando não há preferência salva |
| `STORAGE_KEY_SHOW_SCORE` | `ytbf_show_score` | `src/constants.js` | Chave de armazenamento da visibilidade do selo "% de bot" |
| `DEFAULT_SHOW_SCORE` | `false` | `src/constants.js` | Mostrar selos de confiança por padrão |
| `THRESHOLD` | 4 | `src/constants.js` | Pontuação mínima de bot para sinalizar um comentário |
| `EXACT_MATCHES` | `SAWS.PW`, … | `src/constants.js` | Substrings que sinalizam um apelido imediatamente |
| `SAFETY_RESCAN_MS` | 5000 | `src/constants.js` | Temporizador de reserva para mutações perdidas |

## Contribuindo

Contribuições são bem-vindas. Consulte [CONTRIBUTING.md](CONTRIBUTING.md) para configuração local, convenções de código e a checklist de pull request.

Para relatar um problema de segurança, siga o [SECURITY.md](SECURITY.md) — não abra uma issue pública.

## Aviso legal

Este projeto **não é afiliado** ao Google ou ao YouTube. A detecção de bots é heurística — alguns apelidos legítimos podem ser sinalizados e alguns bots podem passar. Use como um filtro de conveniência, não como garantia da qualidade dos comentários.

## Licença

[MIT](LICENSE) — Copyright (c) 2026 NemoKing

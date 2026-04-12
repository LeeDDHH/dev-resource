# dev-resource アーキテクチャー

## 概要

開発や学習に役立つリソースを集めた Next.js アプリケーション。  
収集したURLのメタ情報（タイトル・説明・タグ）を JSON で管理し、GraphQL API を通じて検索・一覧表示する。

---

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フレームワーク | Next.js 13 (Pages Router) |
| UI | React 18 + TailwindCSS |
| API | GraphQL (Apollo Server/Client) |
| データフェッチ | TanStack Query (React Query) |
| テスト/ドキュメント | Storybook 7 |
| スクレイピング | Playwright |
| 形態素解析 | kuromoji |
| 型検査 | TypeScript |

---

## ディレクトリ構成

```
dev-resource/
├── pages/               # Next.js ページ (ルーティング)
│   ├── index.tsx        # 検索ページ
│   ├── list.tsx         # 一覧ページ
│   ├── tags.tsx         # タグページ
│   ├── bookmarks.tsx    # ブックマークページ
│   └── api/
│       └── graphql.ts   # Apollo Server (API Route)
├── components/
│   ├── screen/          # ページ単位のコンポーネント
│   ├── parts/           # 複合コンポーネント
│   ├── common/          # 汎用コンポーネント
│   ├── layout/          # レイアウトコンポーネント
│   └── base/            # 基底コンポーネント
├── apollo/              # GraphQL スキーマ & リゾルバ (バックエンド)
│   ├── schema.ts        # GraphQL スキーマ定義
│   └── resolvers.ts     # リゾルバ
├── graphql/             # GraphQL クエリ型定義 (フロントエンド)
├── hooks/               # カスタムフック
├── lib/                 # ユーティリティ・データ収集スクリプト
│   └── apollo/
│       └── resolverUtils.ts  # 検索ロジック
├── data/                # JSON データストア
│   ├── data.txt         # 収集URLリスト
│   ├── db_origin.json   # 生データ
│   └── db.json          # 本番データ (ID付き)
├── types/               # TypeScript 型定義
├── stories/             # Storybook ストーリー
└── fixtures/            # テスト用フィクスチャ
```

---

## データフロー

### コンテンツ収集パイプライン

```
data/data.txt
    ↓ yarn add-new-data
    │  (lib/getArticleData.ts)
    │  Playwright でスクレイピング + 翻訳API でメタ情報取得
    ↓
data/db_origin.json   # タイトル・説明・URL の生データ
    ↓ yarn add-tag-data
    │  (lib/addTagsForDB.ts)
    │  kuromoji で形態素解析 → タグ付与
    ↓ yarn add-id-data
    │  (lib/addSequenceId.ts)
    │  連番ID を付与
    ↓
data/db.json          # 本番データ
    ↓ yarn screenshot
    │  (lib/screenshot.ts)
    │  Playwright でスクリーンショット取得
    ↓ yarn compress
       (lib/compressPng.mjs)
       WebP 変換・圧縮
```

### フロントエンドのデータフロー

```
data/db.json
    ↓
Apollo Server (pages/api/graphql.ts)
    ↓ GraphQL API
Apollo Client + TanStack Query (hooks/)
    ↓
React Components (components/)
    ↓
Next.js Pages (pages/)
```

---

## GraphQL レイヤー

### スキーマ概要 (`apollo/schema.ts`)

- リソースの検索・一覧取得
- キーワード・タグによるフィルタリング
- オフセットベースのページネーション

### リゾルバ (`apollo/resolvers.ts`)

- `lib/apollo/resolverUtils.ts` に検索ロジックを集約
- 名前・説明・タグによるキーワード検索

---

## フロントエンド構成

### カスタムフック

| フック | 用途 |
|-------|------|
| `useSearchList` | 一覧の無限スクロール取得 |
| `useSearchBookmark` | ブックマーク一覧取得 |
| `useLocalBookmarks` | LocalStorage のブックマーク管理 |
| `useItemsAmountContext` | リソース総数の Context 管理 |
| `useMediaQuery` | レスポンシブ対応 |

### コンポーネント設計

```
Layout (layout/)
  ├── HeadComponent       # <head> タグ管理
  ├── MobileHamburgerMenu # SP ハンバーガーメニュー
  └── LinkList            # PC ナビゲーション

Screen Components (screen/)  ← ページ単位
  └── Parts Components (parts/)  ← 複合部品
        └── Common Components (common/)  ← 汎用部品
              └── Base Components (base/)  ← 基底部品
```

### レイアウト

- 全ページ共通: `components/layout/Layout.tsx`
- `itemsAmount`（リソース総数）を各ページの `getStaticProps` から Props として渡す

---

## ページ一覧

| パス | ページ | 説明 |
|-----|-------|------|
| `/` | index.tsx | キーワード検索ページ |
| `/list` | list.tsx | リソース一覧ページ |
| `/tags` | tags.tsx | タグ一覧ページ |
| `/bookmarks` | bookmarks.tsx | ブックマーク一覧ページ |

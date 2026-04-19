# Next.js App Router Migration Guide

## 概要

このリポジトリは現在 `pages/` ベースで構成されており、`_app.tsx`、`_document.tsx`、各ページの `getStaticProps`、`getLayout` を使っています。  
安全に移行するには、`pages/` と `app/` を共存させながら **1 ルートずつ段階移行** する進め方が適しています。

## 推奨方針

1. `app/` を追加して段階移行する
2. 共通データ取得を先に `lib/` 配下へ抽出する
3. 共通レイアウトと provider を App Router 用に作る
4. ルートを `index` から順に移す
5. 最後に `pages/` 側を削除する

## 移行手順

### 1. 現状依存の棚卸し

まず次の依存を確認する。

- `pages/_app.tsx`
  - `QueryClientProvider`
  - `next/router` を使った pageview
  - global CSS import
- `pages/_document.tsx`
  - Google Analytics script
- 各ページ
  - `getStaticProps`
  - `getLayout`
- `components/layout/HeadComponent.tsx`
  - `next-seo`

### 2. 共通データ取得を抽出する

現在は各 page で `db.json` や `db_tagCount.json` を直接読んでいます。  
App Router では `getStaticProps` を使わないため、先に共通関数へ寄せます。

例:

- `lib/server/getItemsAmount.ts`
- `lib/server/getTagCountList.ts`

役割:

- `itemsAmount` の取得
- `tagCountList` の取得
- `pages/` と `app/` の両方から再利用可能にする

### 3. `app/layout.tsx` を追加する

`pages/_app.tsx` の役割を App Router の root layout に移します。

対応内容:

- `@/styles/global.css`
- `@/styles/single-Item-view.css`
- `<html>` / `<body>` の定義
- 共通 provider の差し込み

### 4. `app/providers.tsx` を作る

`QueryClientProvider` などの client-side provider は `app/layout.tsx` に直接書かず、`app/providers.tsx` に分離します。

役割:

- `QueryClientProvider`
- 今後必要なら Apollo Provider などもここへ統合

注意:

- このファイルは `'use client'` が必要

### 5. `_document.tsx` の処理を移す

`pages/_document.tsx` にある Google Analytics script は App Router では使い方が変わります。

移行方針:

- `next/script` を使う
- `app/layout.tsx` 内に移す
- 必要に応じて pageview 用 client component を別途作る

### 6. SEO を `metadata` ベースへ移す

`next-seo` ベースの `HeadComponent` は、App Router では `metadata` / `generateMetadata` へ移行するのが基本です。

移行対象:

- title
- description
- canonical
- openGraph
- twitter
- icons
- manifest

移行先:

- サイト共通: `app/layout.tsx`
- ページ固有: `app/**/page.tsx` の `metadata` または `generateMetadata`

### 7. 共通レイアウトを Server / Client で分ける

現在の `components/layout/Layout.tsx` は `useState` と `useEffect` を使っているため、そのままでは Client Component です。

おすすめ構成:

- Server Component
  - `itemsAmount` を取得
  - 全体レイアウトを構成
- Client Component
  - ハンバーガーメニュー
  - media query
  - 開閉状態の制御

### 8. 各ルートを段階移行する

優先順は次の通り。

1. `pages/index.tsx` → `app/page.tsx`
2. `pages/list.tsx` → `app/list/page.tsx`
3. `pages/bookmarks.tsx` → `app/bookmarks/page.tsx`
4. `pages/tags.tsx` → `app/tags/page.tsx`

各ページでやること:

- `getStaticProps` を削除する
- page 内で server-side に直接データ取得する
- `getLayout` を使わず layout に寄せる

### 9. pageview 実装を置き換える

`pages/_app.tsx` の `next/router` イベント監視は App Router ではそのまま使えません。

移行方針:

- `usePathname`
- `useSearchParams`
- `useEffect`

を使う client component を作り、URL 変化時に pageview を送るようにします。

### 10. API route があれば後続で移す

`pages/api/*` がある場合は、必要に応じて `app/api/**/route.ts` へ移します。  
ただし、このリポジトリではまず UI 側の移行を優先するのが安全です。

### 11. 旧 `pages/` を順次削除する

1 ルートずつ App Router 化が終わったら、対応する `pages/*.tsx` を削除します。

最後に削除する候補:

- `pages/_app.tsx`
- `pages/_document.tsx`

### 12. 検証する

移行の節目ごとに次を実行する。

- `yarn lint`
- `yarn build`

注意:

- `yarn build` には `NEXT_PUBLIC_GRAPHQL_SERVER_URL` が必要
- GitHub Actions でも同じ環境変数を渡す必要がある

## このリポジトリ向けのおすすめ順

### Phase 1: 土台作成

- `app/layout.tsx`
- `app/providers.tsx`
- 共通データ取得関数の抽出

### Phase 2: 最小ページ移行

- `app/page.tsx`

### Phase 3: 一般ページ移行

- `app/list/page.tsx`
- `app/bookmarks/page.tsx`
- `app/tags/page.tsx`

### Phase 4: 共通機能移行

- GA pageview
- metadata
- `HeadComponent` 廃止
- 旧 `pages/` 削除

## 詰まりやすいポイント

- App Router では `getStaticProps` は使えない
- `next/router` の route event は置き換えが必要
- `next-seo` は `metadata` へ寄せる必要がある
- Client Component を増やしすぎると App Router の利点が減る
- build 時に `NEXT_PUBLIC_GRAPHQL_SERVER_URL` が必須

## 完了条件

- 主要ルートが `app/` 配下へ移行済み
- `getStaticProps` / `getLayout` / `_app.tsx` / `_document.tsx` 依存が解消されている
- SEO と GA が App Router 方式へ移行されている
- `yarn lint` と `yarn build` が通る

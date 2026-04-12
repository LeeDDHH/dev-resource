# dev-resource 改善提案

作成日: 2026年4月12日

---

## 優先度マトリクス

| 優先度 | 項目 |
|-------|------|
| 🔴 高 | Next.js App Router 移行 |
| 🔴 高 | Layout の Props 依存解消 |
| 🟡 中 | GraphQL → Route Handler 移行 |
| 🟡 中 | テスト整備 (Vitest) |
| 🟢 低 | tRPC 導入 |
| 🟢 低 | ブックマークの SSR 対応 |

---

## 1. Next.js App Router への移行 🔴

### 現状の課題

- Pages Router は機能追加が停止傾向
- `getStaticProps` / `getServerSideProps` が古いパターン
- Server Components が使えずクライアント側の JS バンドルが大きい
- `itemsAmount` を全ページの `getStaticProps` から Props として渡す必要がある

### 移行後のディレクトリ構成

```
app/
├── layout.tsx            # RootLayout (Server Component)
├── page.tsx              # 検索ページ (/)
├── list/
│   └── page.tsx          # 一覧ページ
├── tags/
│   └── page.tsx          # タグページ
├── bookmarks/
│   └── page.tsx          # ブックマークページ
├── _components/
│   └── MobileNav.tsx     # Client Component (インタラクション部分)
└── api/
    └── resources/
        └── route.ts      # Route Handler
```

### RootLayout の実装例

```tsx
// app/layout.tsx
import { getItemsAmount } from '@/lib/getItemsAmount';
import { MobileNav } from './_components/MobileNav';
import { LinkList } from '@/components/common/stateless/LinkList';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Props不要！サーバー側で直接取得
  const itemsAmount = await getItemsAmount();

  return (
    <html lang="ja">
      <body>
        <header>
          <div className="flex h-10 w-full justify-center">
            <div className="flex items-center">
              開発や学習に役立つ
              <strong> {itemsAmount}</strong>個のリソース
            </div>
            <nav>
              <MobileNav /> {/* Client Component */}
              <ul className="hidden h-full md:ml-4 md:flex md:items-center md:gap-1">
                <LinkList />
              </ul>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
```

### MobileNav の Client Component 分離

```tsx
// app/_components/MobileNav.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import useMediaQuery from '@/hooks/useMediaQuery';
import { MobileHamburgerMenu } from '@/components/parts/stateless/MobileHamburgerMenu';

export function MobileNav() {
  const [openMenu, setOpenMenu] = useState(false);
  const isMaxWidthMd = useMediaQuery('(max-width: 767px)');
  const menuToggle = useCallback(() => setOpenMenu((prev) => !prev), []);

  useEffect(() => {
    if (!isMaxWidthMd) setOpenMenu(false);
  }, [isMaxWidthMd]);

  return <MobileHamburgerMenu menuToggle={menuToggle} openMenu={openMenu} />;
}
```

### 移行ステップ

```
Step 1: Next.js 14 or 15 にアップグレード
Step 2: app/ ディレクトリを並行作成 (Pages Router と共存可能)
Step 3: RootLayout + MobileNav に分離
Step 4: 各ページを Server Component として順次移行
Step 5: getStaticProps を廃止
Step 6: Pages Router を削除
```

---

## 2. GraphQL → Route Handler への移行 🟡

### 現状の課題

- `data/db.json` を読むだけのシンプルなユースケースに Apollo Server はオーバースペック
- Apollo Server のバンドルサイズが大きい
- Apollo Client + TanStack Query の二重管理

### 改善案: Route Handler (REST)

```ts
// app/api/resources/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { searchResources } from '@/lib/apollo/resolverUtils';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const keyword = searchParams.get('keyword') ?? '';
  const offset = Number(searchParams.get('offset') ?? 0);

  const result = await searchResources({ keyword, offset });
  return NextResponse.json(result);
}
```

### 改善案: tRPC (型安全重視の場合) 🟢

```ts
// server/routers/resources.ts
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { searchResources } from '@/lib/apollo/resolverUtils';

export const resourcesRouter = router({
  search: publicProcedure
    .input(z.object({ keyword: z.string(), offset: z.number().default(0) }))
    .query(({ input }) => searchResources(input)),
});
```

---

## 3. データ取得層の整理 🟡

### 現状の課題

- TanStack Query + Apollo Client の二重管理
- Server Components でもクライアントフェッチが発生

### 改善方針

| ケース | 推奨手段 |
|-------|---------|
| 初期表示データ | Server Component で直接取得 |
| 無限スクロール | TanStack Query (useInfiniteQuery) のみ残す |
| ブックマーク | `useLocalBookmarks` フックを継続利用 |

```tsx
// app/list/page.tsx (Server Component)
import { searchResources } from '@/lib/apollo/resolverUtils';
import { ResourceList } from './_components/ResourceList';

export default async function ListPage({
  searchParams,
}: {
  searchParams: { keyword?: string };
}) {
  // サーバー側で直接取得 → 初期表示が高速
  const initialData = await searchResources({
    keyword: searchParams.keyword ?? '',
    offset: 0,
  });

  return <ResourceList initialData={initialData} />;
}
```

---

## 4. テスト整備 🟡

### 現状の課題

- Storybook のみでロジックのテストがない
- `resolverUtils.ts` などの重要ロジックが未テスト

### 追加すべきテスト

```
vitest + @testing-library/react の導入

tests/
├── unit/
│   ├── lib/resolverUtils.test.ts   # 検索ロジック
│   ├── hooks/useLocalBookmarks.test.ts
│   └── hooks/useMediaQuery.test.ts
└── integration/
    └── api/resources.test.ts       # Route Handler
```

---

## 5. その他の改善点

| カテゴリ | 現状の問題 | 改善策 |
|---------|-----------|--------|
| **画像最適化** | `<img>` タグ使用箇所 | `next/image` に統一 |
| **SEO** | `HeadComponent` で個別管理 | `generateMetadata` に統一 |
| **ブックマーク** | LocalStorage のみ (SSR 非対応) | `cookies()` でSSR対応 |
| **型安全性** | GraphQL Codegen 依存 | Zod スキーマ + tRPC で強化 |
| **Context管理** | `useItemsAmountContext` で全体配布 | Server Component で不要に |
| **パフォーマンス** | 全ページ CSR 傾向 | Server Components で初期表示高速化 |

---

## 6. 全体ロードマップ

```
Phase 1 (1〜2週間)
  └── Next.js 15 アップグレード
  └── app/ ディレクトリ作成・共存開始
  └── RootLayout 移行 (itemsAmount Props 廃止)

Phase 2 (2〜3週間)
  └── 各ページを Server Component に移行
  └── GraphQL → Route Handler に置き換え
  └── Apollo Server / Apollo Client 削除

Phase 3 (1〜2週間)
  └── Vitest + Testing Library 導入
  └── 重要ロジックの単体テスト追加
  └── next/image への統一
  └── generateMetadata への移行

Phase 4 (任意)
  └── tRPC 導入 (型安全強化)
  └── ブックマークの SSR 対応
```

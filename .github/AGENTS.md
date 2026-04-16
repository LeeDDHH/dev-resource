---
name: dev-resource-orchestrator
description: |
  dev-resource リポジトリ全体の依頼を、Next.js アプリ本体、GraphQL / データ更新、Agent Skills 運用の各領域に応じて整理する共通オーケストレーター。
  Use when このリポジトリ全体に対する実装、調査、保守、または Copilot 設定の更新を行う必要がある場合。
---

# dev-resource Orchestrator

このファイルは **リポジトリ全体向け** です。`dev-motivator` 専用ルーターではなく、アプリ本体・データ更新・Agent Skills を含む全領域の作業方針を定義します。

## Repository Scope

- Next.js 13 + TypeScript による開発リソース一覧アプリ
- Apollo / GraphQL を使った API・クエリ・生成物
- `data/` と `lib/` の収集・タグ付け・画像処理スクリプト
- `private-skill/dev-motivator/` をソースとする Agent Skills 群と、`.github/skills/` の配布先コピー

## Core Rules

- 依頼対象がアプリ本体なのか、データ更新なのか、Agent Skills なのかを最初に切り分ける。
- `.github/AGENTS.md` と `.github/copilot-instructions.md` は **このリポジトリ全体の共通指示** として扱う。
- `dev-motivator` 関連の実装変更は `private-skill/dev-motivator/` をソースとして扱い、必要な配布物だけ `.github/skills/` や `.github/agents/` に反映する。
- 既存の npm / yarn スクリプトがある処理は、手作業よりもスクリプトを優先する。

## Routing Rules

### WHEN/DO Dispatch

**WHEN**: ユーザーが画面、ページ、コンポーネント、レイアウト、スタイル、表示崩れ、UX の修正を求めている  
**DO**: `pages/`, `components/`, `hooks/`, `styles/`, `public/` を起点に変更する

**WHEN**: ユーザーが GraphQL スキーマ、クエリ、Apollo クライアント / サーバー、API 挙動の変更を求めている  
**DO**: `graphql/`, `apollo/`, `lib/apollo/`, `pages/api/graphql.ts` を確認し、必要なら生成物も更新する

**WHEN**: ユーザーがデータ収集、タグ更新、JSON 整形、スクリーンショット生成、画像配置の変更を求めている  
**DO**: `data/`, `lib/*.ts`, `scripts/`, `public/images/`, `screenshots/` を対象にし、既存パイプラインを崩さない

**WHEN**: ユーザーが Copilot 設定、Agent Skills、`.github` 配下の運用ルール、`dev-motivator` スイートの保守を求めている  
**DO**: `.github/`, `private-skill/dev-motivator/`, `scripts/deploy-dev-motivator.mjs` を対象にし、共通指示とスイート固有指示を分けて扱う

**WHEN**: ユーザーが最近のコミット要約、進捗レポート、モチベーションフィードバックを求めている  
**DO**: `dev-motivator`、`commit-summarizer`、`progress-reporter`、`motivational-feedback` を必要に応じて使う

## Task Classification

1. 依頼はアプリの挙動や UI の変更か？
   - YES → `pages/`, `components/`, `styles/` を優先
   - NO → next
2. 依頼は GraphQL / API / データ取得フローの変更か？
   - YES → `graphql/`, `apollo/`, `lib/apollo/`, `pages/api/graphql.ts`
   - NO → next
3. 依頼は収集データや画像アセットの更新か？
   - YES → `data/`, `lib/`, `public/images/`, `screenshots/`
   - NO → next
4. 依頼は Agent Skills / Copilot 設定の変更か？
   - YES → `.github/` と `private-skill/dev-motivator/`
   - NO → まず関連ディレクトリを調査してから着手

## Phase Routing

**Phase 1** → 依頼の対象領域とソースオブトゥルースを特定する (auto)

**Phase 2** → 対象領域に限定して実装・文書更新を行う (auto)

**Phase 3** → 大量のデータ再生成や画像再出力を伴う場合は、影響範囲を確認してから進める (⏸️ when scope expands)

**Phase 4** → 変更対象に応じて lint / build / codegen / validate-agent-skills を実行する (auto)

## Urgency Triage

| Urgency | Keywords | Route |
| ------- | -------- | ----- |
| UI | "画面", "表示", "レイアウト", "スタイル" | App UI / page flow |
| API | "GraphQL", "query", "schema", "API" | GraphQL / Apollo flow |
| Data | "data", "タグ", "JSON", "スクショ" | Data pipeline |
| Skills | "Copilot", "skill", "AGENTS", "instructions" | `.github/` + `private-skill/` |

## Verification Loop

**CLASSIFY** → **EDIT** → **REGENERATE IF NEEDED** → **VALIDATE** → **HANDOFF**

1. **CLASSIFY**: どの領域の変更かを判定する
2. **EDIT**: ソースオブトゥルース側を更新する
3. **REGENERATE IF NEEDED**: GraphQL 生成物や配布用 skill コピーが必要なら更新する
4. **VALIDATE**: 変更に対応する既存コマンドで確認する
5. **HANDOFF**: 何を変えたか、どの領域に効くかを簡潔に返す

## Quality Gates

- [ ] 変更対象の領域と無関係なファイルを広く触っていない
- [ ] `.github/AGENTS.md` / `.github/copilot-instructions.md` をスイート固有の内容で上書きしていない
- [ ] `private-skill/dev-motivator/` を変更した場合、必要な配布先だけ同期している
- [ ] GraphQL / データ / スキル生成物が必要なときだけ再生成されている

## Prohibited Operations

- リポジトリ全体の共通指示を `dev-motivator` 専用ルールとして扱うこと
- `private-skill/dev-motivator/` のソース変更なしに、永続化したい変更を `.github/skills/` 側だけへ加えること
- データ更新パイプラインがある処理を、JSON の手修正だけで済ませること
- GraphQL の入力定義を変えたのに生成物更新の必要性を無視すること

## Gotchas

- **`.github` は全体向け**: `.github/AGENTS.md` と `.github/copilot-instructions.md` は repo-wide の指示であり、特定スイートの専用ルーターではない
- **`private-skill/` がソース**: `dev-motivator` の実装そのものは `private-skill/dev-motivator/` が元で、`.github/skills/` は配布用コピー
- **GraphQL 生成物の追従**: `graphql/` や schema に関わる変更は `generated.ts` や関連生成物の更新が必要になることがある
- **データ更新は副作用が広い**: `data/` 変更は JSON、タグ集計、スクリーンショット、`public/images/` まで波及しやすい

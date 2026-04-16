# dev-resource Copilot Instructions

## Project Overview

このリポジトリは、開発リソースを収集・整理して表示する Next.js / TypeScript プロジェクトです。アプリ本体に加えて、GraphQL 関連ファイル、データ更新スクリプト、`private-skill/dev-motivator/` 配下の Agent Skills ソースを含みます。

## Communication

- ユーザーの入力言語に合わせて日本語または英語で説明する
- コード、識別子、コマンド、ファイル名は既存表記を尊重して英語のまま扱う
- 結果説明は変更の主効果から先に述べる

## Source of Truth

| Area | Primary paths | Notes |
| ---- | ------------- | ----- |
| App UI | `pages/`, `components/`, `hooks/`, `styles/` | 画面の実装と表示ロジック |
| GraphQL | `graphql/`, `apollo/`, `lib/apollo/`, `pages/api/graphql.ts` | クエリ、schema、Apollo 設定 |
| Content data | `data/`, `lib/`, `public/images/`, `screenshots/` | 収集データ、タグ、画像処理 |
| Agent Skills source | `private-skill/dev-motivator/` | `dev-motivator` スイートの編集元 |
| Agent Skills deployed copy | `.github/skills/`, `.github/agents/` | 配布先コピー。必要時のみ同期 |
| Repo-wide Copilot rules | `.github/AGENTS.md`, `.github/copilot-instructions.md` | スイート固有ではなくリポジトリ全体向け |

## Working Rules

- TypeScript の strict 前提を崩さず、`any` や不要な型アサーションを増やさない
- import は `@/` エイリアスと既存の並び順ルールを守る
- UI 変更はページ、レイアウト、使用コンポーネントの流れで追う
- GraphQL の入力や schema を変えたら、必要に応じて `codegen` を実行して生成物を合わせる
- データ更新は既存スクリプトを優先し、手作業の JSON 編集だけでパイプラインを飛ばさない
- `dev-motivator` スイートを保守するときは `private-skill/dev-motivator/` を編集元とし、配布が必要なものだけ `deploy:dev-motivator` で反映する
- `deploy:dev-motivator` で `.github/AGENTS.md` や `.github/copilot-instructions.md` を上書きしない

## Validation

- アプリ変更: `yarn lint`, `yarn build`
- GraphQL 変更: `yarn codegen`
- Agent Skills / `.github` 変更: `node scripts/validate-agent-skills.mjs`
- `dev-motivator` の配布確認: `node scripts/deploy-dev-motivator.mjs`

## Gotchas

- `yarn lint` は `next lint --fix` を使うため、自動整形で差分が増えることがある
- `data/` の更新は `db.json` だけでなくタグ集計や画像資産にも影響しやすい
- `private-skill/dev-motivator/` と `.github/skills/` の役割を混同すると、変更が次回デプロイで消える
- `.github/AGENTS.md` は repo-wide オーケストレーターなので、特定 skill のルーターにしない

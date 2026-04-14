---
name: dev-motivator-router
description: |
  Git ベースの振り返り依頼を、統合スキル `dev-motivator` または個別の葉スキルへルーティングする。
  Use when ユーザーがコミット要約、進捗レポート、モチベーションフィードバック、またはそれらをまとめた振り返りを求めており、最適なスキルに振り分ける必要がある場合。
---

# Dev Motivator Router

このファイルは **ルーター専用** です。最終成果物を自分で生成せず、依頼内容に応じて `dev-motivator` または個別スキルへ委譲します。

## Core Rules

- 最も狭い範囲のサブスキルを優先的に使用する。
- 複数成果物をまとめてほしい依頼だけを `dev-motivator` に渡す。
- ルーター自身は Git 分析やファイル保存を実行しない。

## Routing Rules

### WHEN/DO Dispatch

**WHEN**: ユーザーがコミット要約・進捗・励ましを **まとめて** 求めている、または「振り返りを全部やって」「一通りレポートして」のように統合出力を求めている
**DO**: → `dev-motivator`

**WHEN**: ユーザーが「直近のコミット」「最近の変更」「コミット履歴」の要約だけを求めている
**DO**: → `commit-summarizer`

**WHEN**: ユーザーが「進捗」「統計」「トレンド」「レポート」だけを求めている
**DO**: → `progress-reporter`

**WHEN**: ユーザーが「フィードバック」「褒めて」「モチベーション」だけを求めている
**DO**: → `motivational-feedback`

### Task Classification

1. ユーザーは「要約 + 進捗 + フィードバック」を一括で欲しがっているか？

   - YES → `dev-motivator`
   - NO → next

2. ユーザーは統計データやトレンド分析だけを求めているか？

   - YES → `progress-reporter`
   - NO → next

3. ユーザーはコミット内容の要約のみを求めているか？

   - YES → `commit-summarizer`
   - NO → next

4. ユーザーはモチベーション維持のためのフィードバックのみを求めているか？
   - YES → `motivational-feedback`
   - NO → `dev-motivator`

### Phase Routing

**Phase 1** → 依頼範囲を判定し、単一スキルまたは `dev-motivator` を選択 (auto)

**Phase 2** → 選択したスキルへ委譲し、必要ならそのスキル内部で追加のサブスキルを起動 (auto)

**Phase 3** → 委譲先の成果物をそのまま採用し、ルーター側で再生成しない (auto)

### Urgency Triage

| Urgency | Keywords                                | Route                   |
| ------- | --------------------------------------- | ----------------------- |
| Full    | (default), "まとめて", "全部", "一通り" | `dev-motivator`         |
| Quick   | "summary", "要約だけ", "簡潔に"         | `commit-summarizer`     |
| Stats   | "統計だけ", "数値のみ"                  | `progress-reporter`     |
| Cheer   | "褒めて", "励まして"                    | `motivational-feedback` |

## Verification Loop

**CLASSIFY** → **DISPATCH** → **VERIFY** → **HANDOFF**

1. **CLASSIFY**: 単一依頼か統合依頼かを判定
2. **DISPATCH**: 最適なスキルへ委譲
3. **VERIFY**: 委譲先が要求スコープを満たすか確認
4. **HANDOFF**: 結果は委譲先の出力をそのまま返す

## Quality Gates

- [ ] 統合依頼は `dev-motivator` に委譲されている
- [ ] 単一依頼は最も狭い葉スキルに委譲されている
- [ ] ルーター自身が成果物を再生成していない
- [ ] ルーティング先がユーザー要求のスコープを満たしている

## Prohibited Operations

- ルーター内で Git 履歴を直接分析すること
- `dev-motivator` へ渡すべき統合依頼を個別スキルへ分解しすぎること
- 単一依頼なのに複数スキルを不要に起動すること

## Gotchas

- **広い依頼の見落とし**: 「振り返って」「全体を見て」のような曖昧な依頼は、単一スキルではなく `dev-motivator` を優先する
- **過剰ルーティング**: 「要約だけ」と明示されている場合は `dev-motivator` を経由しない
- **再要約の二重化**: `dev-motivator` が統合出力を返すので、ルーター側で再編集しない

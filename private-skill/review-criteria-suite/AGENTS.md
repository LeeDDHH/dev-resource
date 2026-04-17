---
name: review-criteria-suite-router
description: |
  Webアプリ開発のレビュー依頼を、レビュー基準整理・差分レビュー・指摘整理の最適な phase にルーティングする。
  Use when ユーザーがレビュー基準の整備、差分レビュー、またはレビュー結果の整理を 1 つの入口から扱いたい場合。
---

# Review Criteria Suite Router

このファイルは suite のルーターです。レビュー本文を自分で作り込まず、最適な sub-skill に委譲します。

## Core Rules

- 明示的に phase が指定されていれば、その sub-skill を優先する
- 差分レビューの前にレビュー基準が未整備なら `rule-cataloger` を先に使う
- `review-synthesizer` は raw findings がある場合にのみ使う
- 最終出力では project-specific rule と general rule を混在させない
- ルーター自身は重複レビューや再分類をしすぎない

## Routing Rules

### WHEN/DO Dispatch

**WHEN**: ユーザーが「レビュー基準を作る」「規約を明文化する」「レビュー観点を整理する」と依頼している  
**DO**: → `rule-cataloger`

**WHEN**: ユーザーが PR / diff / changed files / 変更差分のレビューを求めている  
**DO**: → `diff-reviewer`

**WHEN**: ユーザーが既存の指摘を重要度順・カテゴリ別に整理したい  
**DO**: → `review-synthesizer`

**WHEN**: ユーザーが end-to-end のレビューを求めており、基準整理から必要  
**DO**: → `rule-cataloger` → `diff-reviewer` → `review-synthesizer`

### Task Classification

1. 依頼は「基準作成」か？
   - YES → `rule-cataloger`
   - NO → next
2. 依頼は「差分の問題抽出」か？
   - YES → `diff-reviewer`
   - NO → next
3. 依頼は「指摘の整理・要約」か？
   - YES → `review-synthesizer`
   - NO → full workflow

### Phase Routing

- **Phase 0** → `rule-cataloger`: レビュー基準を定義 (auto)
- **Phase 1** → `diff-reviewer`: 差分を基準に照らして確認 (auto)
- **Phase 2** → `review-synthesizer`: 重要度・根拠・修正方針を整理 (⏸️)

### Urgency Triage

| Urgency | Keywords | Route |
| ------- | -------- | ----- |
| Baseline | 規約, ルール, 観点, 基準 | `rule-cataloger` |
| Review | diff, PR, 差分, changed files | `diff-reviewer` |
| Triage | 整理, 重要度順, 要約, ノイズ削減 | `review-synthesizer` |
| Full | 全体レビュー, 一通り, end-to-end | full workflow |

## Verification Loop

**CLASSIFY → DISPATCH → VERIFY → HANDOFF**

1. **CLASSIFY**: 依頼がどの phase を求めているか判定する
2. **DISPATCH**: 最小スコープの skill に委譲する
3. **VERIFY**: 委譲先が必要な前提入力を満たしているか確認する
4. **HANDOFF**: 結果を再生成せず、そのまま返す

## Quality Gates

- [ ] 依頼スコープに対して最も狭い skill を選んでいる
- [ ] diff レビュー前に基準不足を見逃していない
- [ ] synth 前に raw findings が存在する
- [ ] final output で project-specific rule と general rule が分離されている
- [ ] ルーター自身が重複レビューをしていない

## Prohibited Operations

- ルーター自身が差分の事実認定を細かく実施すること
- 基準未整備のまま断定的な style 指摘を量産すること
- 根拠のない指摘を `review-synthesizer` に渡すこと
- project-specific rule と一般論を混ぜたまま返すこと

## Gotchas

- **基準なしレビュー**: ルール未整理のまま `diff-reviewer` を走らせると、好みベースの指摘が増える
- **phase 飛ばし**: `review-synthesizer` は raw findings の整形役であり、ゼロから問題を発見する役ではない
- **広すぎるフルルート**: すでにレビュー基準がある依頼では full workflow にせず、必要 phase のみ使う
- **再解釈の重複**: ルーターは委譲結果を再評価せず、必要なら upstream skill に戻す

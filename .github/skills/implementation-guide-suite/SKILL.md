---
name: implementation-guide-suite
description: |
  既存ルールを確認し、適用条件を整理したうえで実装ガイドを生成する。
  Use when review-criteria や設計ルールをもとに、開発者向けの実装手順と確認項目を作りたい場合。
---

# Implementation Guide Suite

ルール確認から実装ガイド生成までを phase ごとに分離し、最小スコープの sub-skill へルーティングする。

## Core Rules

- 既存ルール文書がある場合は、それを source of truth とする
- 必須ルールと推奨ルールを混在させない
- 要件不足は勝手に補完せず、open question として残す
- ルーター自身はガイド本文を書き込まず、適切な sub-skill に委譲する

## Routing Rules

### WHEN/DO Dispatch

**WHEN**: ユーザーが「関連ルールを拾いたい」「基準を確認したい」と依頼している  
**DO**: → `rule-reader`

**WHEN**: ユーザーが「どのルールが適用されるか」「不足条件は何か」を整理したい  
**DO**: → `rule-checker`

**WHEN**: ユーザーが「実装ガイドを書きたい」「手順化したい」と依頼している  
**DO**: → `implementation-guide-writer`

**WHEN**: ユーザーが end-to-end でルール確認からガイド生成まで求めている  
**DO**: → `rule-reader` → `rule-checker` → `implementation-guide-writer`

### Task Classification

1. 依頼は「ルール収集」か？
   - YES → `rule-reader`
   - NO → next
2. 依頼は「適用条件や不足情報の整理」か？
   - YES → `rule-checker`
   - NO → next
3. 依頼は「実装ガイド生成」か？
   - YES → `implementation-guide-writer`
   - NO → full workflow

### Phase Routing

- **Phase 0** → `rule-reader`: 対象タスクに関係するルールを収集する (auto)
- **Phase 1** → `rule-checker`: 適用条件、不足情報、open question を整理する (auto)
- **Phase 2** → `implementation-guide-writer`: 実装ガイドを生成する (⏸️)

### Urgency Triage

| Urgency | Keywords | Route |
| ------- | -------- | ----- |
| Baseline | ルール, 基準, 観点, review-criteria | `rule-reader` |
| Matching | 適用, 該当, 不足, 前提, open question | `rule-checker` |
| Guide | 実装ガイド, 手順, 進め方, チェックリスト | `implementation-guide-writer` |
| Full | 一通り, end-to-end, 最初から | full workflow |

## Validation Loop

**CLASSIFY → DISPATCH → VERIFY → HANDOFF**

1. **CLASSIFY**: 依頼がどの phase を求めるか判定する
2. **DISPATCH**: 最小スコープの skill に委譲する
3. **VERIFY**: ルール文書や要求内容が足りているか確認する
4. **HANDOFF**: 結果を再解釈しすぎず、そのまま返す

## Quality Gates

- [ ] 依頼スコープに対して最も狭い skill を選んでいる
- [ ] ルール未確認のままガイド生成へ飛ばしていない
- [ ] 必須ルールと推奨ルールを分離している
- [ ] open question を隠さず残している
- [ ] ルーター自身が重複生成をしていない

## Prohibited Operations

- ルーター自身がルール根拠の事実認定を細かくやりすぎること
- 不足情報を推測で埋めて断定的な実装方針を返すこと
- 必須ルール違反の可能性を推奨事項に薄めること
- ルール出典なしでガイド本文を増やすこと

## Gotchas

- **ルール未確認ガイド**: 先に `implementation-guide-writer` を走らせると一般論だけの手順になりやすい
- **必須/推奨の混線**: review-criteria に gate がある場合、それを単なる tips に落とさない
- **要件不足の隠蔽**: ユーザー入力が足りない時は open question を残し、仮定を本文に混ぜない
- **再解釈の重複**: ルーターは sub-skill 結果の書き換え役ではなく、委譲役に徹する

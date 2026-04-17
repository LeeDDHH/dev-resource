---
name: review-synthesizer
description: |
  差分レビューで得た指摘を重要度・カテゴリ・根拠・修正方針ごとに整理し、ノイズを抑えた最終レビューへまとめる。
  Use when raw findings を最終レビューコメント向けに整形し、重要度順で返したい場合。
---

# Review Synthesizer

raw findings を最終レビュー向けに整理する skill。

## Use This Skill When

- 指摘一覧を重要度順で並べたい
- 重複やノイズを減らしたい
- 各指摘に理由と修正方針を付けたい

## Required Inputs

- raw findings
- 各 finding の rule と evidence
- 必要なら severity 初期値

## Workflow

1. finding を正規化する
   - severity, category, rule type を揃える
2. 重複を統合する
   - 同じ根本原因は 1 件にまとめる
3. 優先順位を付ける
   - correctness / security / data loss を上位に置く
4. 修正方針を付ける
   - 実装を断定しすぎず、方向性で示す
5. 最終出力を整える
   - summary → must-fix → should-fix → follow-up の順に返す

## Deliverables

- `review-summary.md`: 最終レビューコメント向けの整理済み出力
- `triage-notes.md`: 除外・統合・優先度変更の判断メモ

Reuse `assets/review-summary-template.md` when producing a structured final review summary.

## Data Handling

- 根拠の弱い指摘は残さない
- コード全文の再掲は避ける
- secrets, tokens, PII を出力しない

## Quality Gates

- [ ] 指摘が重要度順で並んでいる
- [ ] 各指摘に根拠と理由がある
- [ ] 修正方針が簡潔で実行可能
- [ ] project-specific / general が混在していない
- [ ] unsupported finding を落としている

## Gotchas

- **重大度の吊り上げ**: style や好みの問題を critical/high にしない
- **整理時の改変**: synth で新しい事実を足さない
- **修正断定**: 実装案を 1 つに決め打ちしすぎない
- **分類混線**: project-specific rule 違反と一般的 best practice を同列説明しない
- **ノイズ温存**: confidence の低い指摘を惰性で残さない

## Validation Loop

1. **Normalize**: severity と category を統一する
2. **Deduplicate**: 同根の指摘をまとめる
3. **Verify**:
   - 各項目に evidence と why があるか
   - severity が妥当か
   - project/general が分離されているか
4. **Recover**:
   - 根拠不足 → 除外
   - severity 過大 → 1 段階下げる
   - 修正方針が断定的すぎる → 方向性表現へ戻す

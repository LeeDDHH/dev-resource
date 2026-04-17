---
name: diff-reviewer
description: |
  変更差分をレビュー基準に照らし、根拠つきの問題候補を抽出して false positive を減らす。
  Use when PR や diff をレビューし、どの変更がルール違反・不整合・リスクに当たるかを判定したい場合。
---

# Diff Reviewer

差分に対して evidence-first で問題候補を抽出する skill。

## Use This Skill When

- PR や patch のレビューをしたい
- 変更差分を project rule / general rule に照らしたい
- 根拠つきでノイズの少ない指摘一覧がほしい

## Required Inputs

- 変更差分
- 利用可能なレビュー基準
- 必要に応じて変更ファイルの近傍文脈

## Workflow

1. 基準を確認する
   - 既存 catalog を優先。なければ不足を明示する
2. 差分を読む
   - changed files と hunk 単位で確認する
3. 近傍文脈を確認する
   - 断定に必要な最小限だけ追加で確認する
4. 問題候補を抽出する
   - `rule`, `evidence`, `impact`, `confidence`, `scope` を付ける
5. ノイズを落とす
   - 重複、好み、既存負債、生成物ノイズを除外する

## Deliverables

- `review-findings.md`: root cause ごとに整理した finding 一覧
- `review-context-notes.md`: 近傍文脈や既存パターン比較の補足

Reuse `assets/review-finding-template.md` when producing standardized findings output.

## Collaboration

事実確認や既存パターン照合が必要な箇所は `code-review-auditor` を使う。

## Data Handling

- 長いコード全文を貼らず、要点だけ引用する
- secrets や PII をそのまま出さない
- diff に直接関係しない話題は原則含めない

## Quality Gates

- [ ] 各 finding に violated rule がある
- [ ] 各 finding に file path と anchor がある
- [ ] project-specific / general rule が区別されている
- [ ] 推測だけの指摘を除外している
- [ ] 重要度より前に事実確認を済ませている

## Gotchas

- **hunk 断定**: 周辺文脈なしで API 契約や責務違反を断定しない
- **既存不整合の誤検出**: もともとあった問題を今回差分の fault として強く責めない
- **style ノイズ**: 明示ルールのない formatting 好みを高重要度にしない
- **generated files**: lockfile や build artifact の差分を本質指摘に混ぜない
- **重複指摘**: 同じ根本原因を複数ファイルで別問題として量産しない

## Validation Loop

1. **Scan**: diff と基準を突き合わせる
2. **Audit**: 各 finding の事実と近傍文脈を確認する
3. **Verify**:
   - violated rule があるか
   - evidence があるか
   - 差分起因か
4. **Recover**:
   - 根拠不足 → confidence を下げるか除外
   - 既存問題 → informational に下げる
   - 重複 → 代表 finding に統合

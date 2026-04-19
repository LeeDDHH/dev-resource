---
name: rule-checker
description: |
  要求内容と抽出済みルールを照合し、適用対象・必須条件・不足情報を整理する。
  Use when どのルールが今回の実装に当てはまり、どこに open question が残るかを判定したい場合。
---

# Rule Checker

要求内容とルールの適合性を整理する skill。

## Use This Skill When

- 実装対象にどのルールが適用されるか確認したい
- 必須条件と推奨条件を整理したい
- 要件不足や確認事項を open question に落としたい

## Required Inputs

- 対象タスクの説明
- 抽出済みルール一覧
- 必要に応じて既存コードやディレクトリ範囲

## Workflow

1. 要求内容を分解する
   - 目的、変更箇所、期待出力を整理する
2. ルールを照合する
   - 各要求に対し applicable / not-applicable / unknown を付ける
3. 必須条件を確定する
   - gate を持つルールや review blocker を切り出す
4. 不足情報を整理する
   - 未指定前提や確認待ち事項を open question にする
5. 実装ガイド向けにまとめる
   - 後段で使える前提一覧を作る

## Deliverables

- `rule-application-check.md`: 適用ルール、必須条件、推奨条件の整理
- `open-questions.md`: 要件不足や確認待ち項目

## Quality Gates

- [ ] 各ルールに applicability 判定がある
- [ ] 必須条件が明確に分離されている
- [ ] open question が本文に埋もれていない
- [ ] 根拠のない applicability 判定をしていない

## Gotchas

- **全部 applicable 扱い**: 関係の薄いルールまで機械的に適用しない
- **必須条件の弱体化**: request changes 相当の gate を単なる注意に落とさない
- **unknown の隠蔽**: 判定材料不足を applicable / not-applicable に寄せない
- **後段非互換**: 実装ガイドで使えない粒度のまま終えない

## Validation Loop

1. **Map**: 要求とルールを対応づける
2. **Judge**: applicable / not-applicable / unknown を付ける
3. **Verify**:
   - 必須条件が分離されているか
   - unknown が open question 化されているか
   - 根拠があるか
4. **Recover**:
   - 根拠不足 → unknown に戻す
   - 重複 → 1 条件へ統合
   - 粒度不足 → 実装単位まで再分解する

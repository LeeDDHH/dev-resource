---
name: implementation-guide-writer
description: |
  適用ルールと不足情報をもとに、開発者が着手できる実装ガイドを構造化して生成する。
  Use when ルールに準拠した実装手順、注意点、確認項目を 1 つのガイドとしてまとめたい場合。
---

# Implementation Guide Writer

ルール準拠の実装ガイドを出力する skill。

## Use This Skill When

- 実装の進め方を手順化したい
- 必須条件と推奨条件を分けたガイドがほしい
- open question を残したまま、着手可能な範囲を明示したい

## Required Inputs

- 適用ルールの整理結果
- 必須条件と推奨条件
- open question 一覧
- 必要に応じて対象タスクの説明

## Workflow

1. 入力を整理する
   - applicable rule、must-have、open question を確認する
2. 実装順序を決める
   - 着手順、依存関係、確認タイミングを並べる
3. ガイド本文を書く
   - 実装手順、注意点、確認観点、保留事項を分ける
4. ルール根拠を紐づける
   - 各重要手順に source rule を添える
5. 最終整形する
   - 必須条件、推奨条件、open question を混ぜない

## Deliverables

- `implementation-guide.md`: 実装手順、注意点、確認項目、open question を含むガイド

Reuse `assets/implementation-guide-template.md` when producing standardized implementation guide output.

## Data Handling

- 長いコード全文を転載しない
- 推測は `Assumptions` または `Open Questions` に分ける
- ルール根拠がない推奨は本文へ混ぜない

## Quality Gates

- [ ] 実装順序がある
- [ ] 必須条件と推奨条件が分離されている
- [ ] open question が独立している
- [ ] 主要手順に対応ルールがある
- [ ] 抽象論だけで終わっていない

## Gotchas

- **順序なしガイド**: 注意点だけ並べて手順がない文章にしない
- **根拠なし推奨**: source のない best practice を project rule のように書かない
- **保留事項の埋没**: open question を本文に散らして見落としやすくしない
- **必須/推奨混線**: must-have の gate を checklist の 1 項目に薄めない

## Validation Loop

1. **Assemble**: applicable rules と open questions を集約する
2. **Draft**: テンプレートに沿ってガイドを書く
3. **Verify**:
   - 実装順序があるか
   - 必須 / 推奨 / open question が分離されているか
   - 主要手順に source rule があるか
4. **Recover**:
   - 根拠不足 → 手順を削るか open question に移す
   - 順序不足 → 手順を再構成する
   - 混線 → セクションを分離して書き直す

---
name: rule-cataloger
description: |
  リポジトリ内の規約・既存実装パターン・レビュー観点を収集し、差分レビューで判定できる基準へ正規化する。
  Use when プロジェクト固有ルールを明文化したい、または AI code reviewer の判定基準を先に揃えたい場合。
---

# Rule Cataloger

レビュー基準を「判定可能なルール」に落とし込む skill。

## Use This Skill When

- 新しくレビュー基準を整備したい
- 暗黙知のコーディングルールを明文化したい
- プロジェクト固有ルールと一般ルールを分離したい

## Required Inputs

- リポジトリ内の規約候補
- 既存コードの代表的パターン
- レビュー観点が書かれた設定・文書・命名規則（あれば）

## Workflow

1. 明示ルールを収集する
   - README, docs, lint 設定, テスト方針, ディレクトリ構造を確認
2. 暗黙パターンを収集する
   - 繰り返し現れる命名、責務分離、UI/データ取得の置き方を確認
3. ルールを正規化する
   - `Rule`, `Why`, `How to Judge`, `Scope`, `Source`, `Default Severity`, `Exceptions` を定義
4. 種別を分ける
   - `Project-Specific` と `General Web App` に分離する
5. 判定不能な精神論を落とす
   - レビュー時に yes/no 判断しにくいものは open question に回す

## Deliverables

- `review-criteria-catalog.md`: 構造化したレビュー基準一覧
- `open-questions.md`: 判定不能または根拠不足で保留した項目

Reuse `assets/rule-catalog-template.md` when producing a reusable review criteria catalog.

## Data Handling

- 機密値や個人情報をルール例として転載しない
- 長いコード全文ではなく、ルールの根拠だけ要約する
- 単一事例しかないものは `inferred` と明記する

## Quality Gates

- [ ] 各ルールに判定基準がある
- [ ] 各ルールに source または pattern 根拠がある
- [ ] project-specific と general が分離されている
- [ ] 精神論だけのルールを採用していない
- [ ] review 時に severity 初期値を使える

## Gotchas

- **単発実装の過学習**: 1 箇所だけの書き方を project rule と断定しない
- **精神論の混入**: 「わかりやすく書く」だけでは diff review の基準にならない
- **一般論の混線**: React/Next.js の一般 best practice を project 固有規約と混ぜない
- **根拠抜け**: 設定ファイルや既存パターンへの紐づけがないルールは弱い
- **例外未定義**: 例外条件がないと diff-reviewer がノイズを出しやすい

## Validation Loop

1. **Collect**: 明示ルールと暗黙パターンを集める
2. **Normalize**: 各ルールを判定可能な形式に変換する
3. **Verify**:
   - 曖昧語だけで終わっていないか
   - rule source があるか
   - project/general が分離されているか
4. **Recover**:
   - 根拠不足 → `inferred` 扱いに下げる
   - 判定不能 → open question に移す
   - 重複 → 1 ルールへ統合する

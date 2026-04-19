---
name: rule-reader
description: |
  既存のルール文書や関連ドキュメントから、対象タスクに関係する実装ルールを抽出する。
  Use when review-criteria や設計文書の中から、今回の作業に適用すべきルールを先に拾いたい場合。
---

# Rule Reader

対象タスクに関係するルールを source つきで抽出する skill。

## Use This Skill When

- `review-criteria/` から関係ルールを探したい
- 実装前に relevant rule を一覧化したい
- ルール文書が複数あり、どれを読むべきか絞りたい

## Required Inputs

- 対象タスクの説明
- ルール文書の候補パス
- 必要に応じて関連コードや設計文書

## Workflow

1. 対象を特定する
   - タスクの目的、変更範囲、対象ディレクトリを確認する
2. ルール文書を集める
   - `review-criteria/` を優先し、関連 docs や設定も確認する
3. 関係ルールを抽出する
   - 必須条件、推奨条件、前提条件に分ける
4. 出典を紐づける
   - file path や section を残す
5. 不足を明示する
   - ルールが見当たらない領域は gap として記録する

## Deliverables

- `relevant-rules.md`: 対象タスクに適用候補となるルール一覧
- `rule-gaps.md`: ルール不在や曖昧な項目のメモ

## Quality Gates

- [ ] 各ルールに source がある
- [ ] 必須 / 推奨 / 前提が分離されている
- [ ] 対象タスクと無関係なルールを混ぜていない
- [ ] ルール不足を gap として明示している

## Gotchas

- **全件転載**: ルール文書を丸写しして relevant rule の抽出をしない
- **一般論混入**: project rule があるのに一般論を同格で混ぜない
- **出典不足**: rule title だけで source path がない状態にしない
- **gap 隠し**: 根拠不足の領域を「たぶんこう」と補完しない

## Validation Loop

1. **Collect**: 関係しそうな文書を集める
2. **Filter**: タスクに関係するルールだけを残す
3. **Verify**:
   - source があるか
   - 必須 / 推奨が分離されているか
   - gap が明示されているか
4. **Recover**:
   - 根拠不足 → gap に移す
   - 重複 → 1 ルールへ統合
   - 範囲外 → 除外する

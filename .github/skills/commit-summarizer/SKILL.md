---
name: commit-summarizer
description: |
  直近の main ブランチコミットを分析し、変更内容を構造化して要約する。
  Use when ユーザーが「直近のコミット」「最近の変更」「コミット履歴の要約」を求めている場合。
---

# Commit Summarizer

直近の Git コミット履歴を取得し、変更内容を構造化して要約する。

## Use This Skill When

- ユーザーが直近のコミット内容を知りたい場合
- 「最近何をやったか」の振り返りが必要な場合
- コミットメッセージから作業内容をまとめたい場合

## Required Inputs

- Git リポジトリが存在すること
- （オプション）分析対象の期間またはコミット数（デフォルト: 過去7日間または最新10コミット）

## Workflow

1. **Git リポジトリ検証**
   - カレントディレクトリが Git リポジトリか確認（`git rev-parse --is-inside-work-tree`）
   - 失敗した場合: エラーメッセージを表示し処理を中断

2. **ブランチ検出**
   - デフォルトブランチを特定（優先順: `main` > `master` > `develop` > current）
   - ブランチが存在しない場合: 代替ブランチを提案

3. **コミット履歴取得**
   - `git log --since="7 days ago" --no-merges -n 10` でコミット一覧を取得
   - コミットハッシュ、作成者、日付、メッセージを抽出

4. **変更内容分析**
   - 各コミットの変更ファイルとdiffを `git show --stat` で取得
   - ファイル種別（.ts, .md, .json等）ごとに分類

5. **構造化要約の生成**
   - コミットを日付順にグループ化
   - 各コミットを「機能追加」「バグ修正」「リファクタリング」等に分類
   - Markdown 形式で要約レポートを作成

6. **ファイル保存**
   - `results/YYYY-MM-DD-commit-summary.md` に保存
   - チャットには要約（ファイルパス + 概要）を表示

## Deliverables

- `results/YYYY-MM-DD-commit-summary.md`: コミット要約レポート（以下の構造）
  ```markdown
  # Commit Summary (YYYY-MM-DD)
  
  ## Period
  YYYY-MM-DD to YYYY-MM-DD
  
  ## Commits by Date
  
  ### YYYY-MM-DD
  - **[hash]** メッセージ (変更ファイル数)
  - **[hash]** メッセージ (変更ファイル数)
  
  ## Changes by Type
  - 機能追加: N commits
  - バグ修正: N commits
  - リファクタリング: N commits
  
  ## Files Modified
  - .ts: N files
  - .md: N files
  ```

## Quality Gates

- [ ] Git リポジトリが存在する
- [ ] 対象ブランチが見つかった
- [ ] コミット履歴が正常に取得できた（0件でも可）
- [ ] 各コミットのメッセージと変更ファイル数が含まれている
- [ ] レポートが `results/` ディレクトリに保存されている
- [ ] 出力がユーザー入力言語（日本語/英語）で記述されている

## Gotchas

- **空のコミット履歴**: 過去7日間にコミットが0件の場合、`-n 10` で全履歴から最新10件を取得する。それでも0件なら「コミットがまだありません」とポジティブに表示
- **ブランチ名の検出失敗**: `main` が存在しない場合、`git branch -a` で全ブランチをリストし、`master` または `develop` の存在を確認。どれも存在しない場合は現在のブランチを使用
- **コミットメッセージのエンコーディング**: UTF-8以外のエンコーディングで文字化けする場合は `git log --encoding=UTF-8` を指定
- **大量コミット時のパフォーマンス**: 100コミット超の場合は最新50件に制限し、「最新50件を表示しています」と明示する
- **マージコミットの扱い**: `--no-merges` でマージコミットを除外し、純粋な開発コミットのみを対象にする。ただしマージコミット数も別途カウントして「N merges excluded」と記載

## Validation Loop

1. **実行**: Git コマンドでコミット履歴を取得し、Markdown レポートを生成
2. **チェック**:
   - Git コマンドが成功したか（exit code 0）
   - コミット数が期待範囲内か（0〜50件）
   - レポートファイルが存在するか
   - レポートに期間、コミットリスト、ファイル種別が含まれているか
3. **失敗時の対応**:
   - Git エラー → ブランチ名を変更して再試行（main → master → develop）
   - 0件 → 全履歴から最新10件を取得するよう範囲を変更
   - ファイル保存失敗 → `results/` ディレクトリを作成してリトライ
4. **合格後**: 次のスキル（progress-reporter）に引き継ぐか、ユーザーに完了を報告

## Reuse Assets

Reuse `assets/commit-summary-template.md` when generating the final report structure.

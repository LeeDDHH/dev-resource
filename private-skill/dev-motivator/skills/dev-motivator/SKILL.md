---
name: dev-motivator
description: |
  コミット要約・進捗レポート・モチベーションフィードバックを順番に実行し、ひとつの開発振り返りとして統合出力する。
  Use when ユーザーが最近の変更の要約、進捗の数値化、励ましのフィードバックをまとめて欲しい場合、または「全部まとめて振り返りたい」と依頼した場合。
---

# Dev Motivator

`dev-motivator` は **統合スキル** です。単独で分析ロジックを持たず、`commit-summarizer`、`progress-reporter`、`motivational-feedback` をこの順で呼び出し、最終的に 1 つの振り返り結果としてまとめます。

## Use This Skill When

- ユーザーがコミット要約と進捗レポートと励ましをまとめて欲しい場合
- 「今週の振り返りを全部出して」「最近の開発を総合的に見て」のような依頼の場合
- 個別レポートではなく、1 回の依頼でエンドツーエンドの振り返りが必要な場合

## Required Inputs

- Git リポジトリが存在すること
- （オプション）分析対象の期間、コミット数、重点領域
- 出力言語に関するユーザー入力（未指定ならユーザー発話に合わせる）

## Workflow

1. **スコープ確認**

   - ユーザーが統合出力を求めていることを確認
   - 単一成果物だけが必要なら葉スキルへ戻す

2. **コミット要約の生成**

   - `commit-summarizer` を起動
   - 最新の要約ファイルと要約結果を取得

3. **進捗レポートの生成**

   - `progress-reporter` を起動
   - 統計とトレンドを取得し、要約結果と並べられる状態にする

4. **モチベーションフィードバックの生成**

   - `motivational-feedback` を起動
   - 直前までの成果物を元に、具体的で前向きなフィードバックを作る

5. **統合レポートの組み立て**

   - 3 つの成果物から重複しない要点だけを抽出
   - `assets/dev-motivator-template.md` を使って統合レポートを作成
   - `results/YYYY-MM-DD-dev-motivator.md` に保存

6. **最終出力**
   - チャットでは統合レポートの要約を返す
   - 生成した関連ファイルのパスを列挙する

## Deliverables

- `results/YYYY-MM-DD-dev-motivator.md`: 統合振り返りレポート
- `results/YYYY-MM-DD-commit-summary.md`: `commit-summarizer` の成果物
- `results/YYYY-MM-DD-progress-report.md`: `progress-reporter` の成果物
- `results/YYYY-MM-DD-feedback.md`: `motivational-feedback` の成果物

Reuse `assets/dev-motivator-template.md` when generating the final integrated report.

## Output Contract

最終チャット出力は次をこの順で含めること。

1. 期間または対象範囲
2. コミット要約のハイライト
3. 進捗レポートの主要数値
4. モチベーショナルフィードバック
5. 保存したファイルのパス一覧

## Quality Gates

- [ ] `commit-summarizer`、`progress-reporter`、`motivational-feedback` を順番に起動した
- [ ] 3 つの成果物の内容が矛盾していない
- [ ] 統合レポートが `results/` に保存されている
- [ ] 最終出力がユーザー入力言語で記述されている
- [ ] 最終チャット出力に保存ファイルパスが含まれている
- [ ] 個別スキルの内容を冗長に丸写しせず、統合要約になっている

## Prohibited Operations

- `git push`、`git rebase`、`git reset --hard`、`git commit --amend` など、リモート反映や履歴改変を伴う操作を実行しない
- コミット本文、生成レポート、最終チャット出力に secrets・token・認証情報・個人情報を含めない
- 生成物は `results/` 配下にのみ保存し、他ディレクトリへレポートや中間成果物を書き出さない
- 下位スキル実行のためであっても、ユーザー依頼と無関係なファイル変更や永続化を行わない

## Gotchas

- **単一依頼の誤爆**: 「要約だけ」「統計だけ」の依頼にこのスキルを使うと冗長になる。統合依頼だけで使う
- **成果物の重複**: 3 スキルの全文を連結すると長すぎる。統合レポートでは各成果物の要点だけを抽出する
- **順序依存**: `motivational-feedback` は前段の成果物がある前提なので、先に実行しない
- **ファイル競合**: 同日に複数回実行する場合は必要に応じて時刻や範囲を含めてファイル名衝突を避ける
- **言語不一致**: 途中スキルの出力言語がずれたら、統合前にユーザー入力言語へ揃える

## Validation Loop

1. **実行**: 3 つの下位スキルを順番に起動し、成果物を取得
2. **チェック**:
   - 必須 3 成果物がそろっているか
   - 期間や対象ブランチが一致しているか
   - 統合レポートに要約、数値、フィードバックの 3 要素がすべてあるか
   - ファイルパスが最終出力に含まれているか
3. **失敗時の対応**:
   - 下位スキルが欠けた場合 → 欠けたスキルだけ再実行
   - スコープがずれた場合 → 期間や対象範囲を明示して再実行
   - 統合レポート保存失敗 → `results/` を作成して再保存
4. **合格後**: 統合結果を返し、関連ファイルを案内する

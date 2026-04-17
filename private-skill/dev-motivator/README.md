# Dev Motivator

Git コミット履歴を分析し、プロジェクト進捗をポジティブにフィードバックすることで、個人開発者のモチベーション維持と継続的な改善を支援します。統合スキル `dev-motivator` から、要約・進捗・フィードバックの個別サブスキルを束ねて扱えます。

## 概要

個人開発プロジェクトでモチベーションを維持し続けるのは難しいものです。Dev Motivator は、あなたの Git コミット履歴を自動的に分析し、成果を可視化してポジティブなフィードバックを提供することで、継続的な改善をサポートします。

## 機能

- **統合振り返り (`dev-motivator`)**: コミット要約、進捗レポート、モチベーショナルフィードバックを順に実行してひとつの結果に統合
- **コミット要約**: 直近の main ブランチコミットを分析し、変更内容を構造化して要約
- **進捗レポート**: コミット数、変更行数、ファイル種別などの統計・トレンドを抽出
- **モチベーショナルフィードバック**: 成果をポジティブな言葉でフィードバックし、次のアクションを提案

## 使い方

```
直近のコミットについて分析してください
```

または

```
今週の進捗をレポートしてください
```

## スイート構成

- **AGENTS.md**: Router（`dev-motivator` または個別サブスキルへ振り分け）
- **agents/progress-analyzer.md**: コミット履歴分析専門の Custom Agent
- **skills/dev-motivator**: 統合振り返りスキル
- **skills/commit-summarizer**: コミット要約サブスキル
- **skills/progress-reporter**: 進捗レポート生成サブスキル
- **skills/motivational-feedback**: モチベーショナルフィードバック生成サブスキル

## Copilot CLI で使うとき

- `private-skill/dev-motivator/` は `dev-motivator` スイートのソースです
- 配布対象は `.github/skills/**` と `.github/agents/progress-analyzer.md` です
- リポジトリ全体向けの `.github/AGENTS.md` / `.github/copilot-instructions.md` はこのスイートから上書きしません
- 反映には `npm run deploy:dev-motivator` を実行します

## 要件

- Git リポジトリ
- main ブランチの存在

## バージョン

1.0.0

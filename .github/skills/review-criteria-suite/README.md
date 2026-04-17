# review-criteria-suite

Webアプリ開発のレビュー依頼を、レビュー基準整理・差分レビュー・指摘整理の 3 phase に分けて扱う suite の配布先エントリです。

## What It Does

この suite は、レビュー基準が未整備な状態で diff レビューを始めてノイズが増える問題を避けるため、次の順で役割を分離します。

1. `rule-cataloger` — リポジトリ固有の規約・既存実装パターン・レビュー観点を収集して基準化
2. `diff-reviewer` — 変更差分をレビュー基準に照らして問題候補を抽出
3. `review-synthesizer` — 指摘を重要度・カテゴリ・根拠・修正方針ごとに整理

## When to Use

- レビュー基準の整備から差分レビューまでを一つの入口で扱いたいとき
- プロジェクト固有ルールを明文化してから PR / diff をレビューしたいとき
- raw findings を最終レビューコメント向けにノイズを抑えて整理したいとき
- end-to-end で `rule-cataloger` → `diff-reviewer` → `review-synthesizer` を使い分けたいとき

## Components

| Type | Name | Role |
| --- | --- | --- |
| Suite router | `review-criteria-suite` | 依頼内容を phase ごとに最適な skill へルーティング |
| Sub-skill | `rule-cataloger` | レビュー基準を収集・正規化 |
| Sub-skill | `diff-reviewer` | 差分を基準に照らして問題候補を抽出 |
| Sub-skill | `review-synthesizer` | 指摘を重要度順・カテゴリ別に整理 |
| Custom agent | `review-orchestrator` | 複数 phase にまたがるレビュー依頼を統括 |
| Custom agent | `code-review-auditor` | 指摘候補の根拠確認と false positive 削減 |

## Key Rules

- diff レビュー前に基準不足があれば `rule-cataloger` を優先する
- `review-synthesizer` は raw findings がある場合にだけ使う
- project-specific rule と general rule を混在させない
- ルーター自身はレビュー本文を再生成しすぎず、最小スコープの skill に委譲する

## Deployment Note

- このディレクトリは suite ルーターの配布先で、実体は `SKILL.md`
- suite のソースは repo root の `review-criteria-suite/` にあり、sub-skills は `.github/skills/<skill-name>/`、custom agents は `.github/agents/` に配布される
- `.github/AGENTS.md` と `.github/copilot-instructions.md` は repo-wide のため、この suite では上書きしない

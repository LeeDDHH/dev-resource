# Agent Skills Development Specification

## Objective
Webアプリ開発におけるコーディングルールを明文化し、AI code reviewer が差分レビュー時に一貫した基準で指摘・整理できる suite を作る。

## Domain & Audience
- Domain: Webアプリ開発
- Primary users: 自分 + AI code reviewer

## Architecture
- Type: Suite
- Sub-skills:
  - `rule-cataloger` — プロジェクトのコーディングルール・レビュー観点を収集して基準化する
  - `diff-reviewer` — 差分をルールに照らしてレビューする
  - `review-synthesizer` — 指摘を重要度・カテゴリごとに整理して返す
- Custom Agents:
  - `code-review-auditor` — 差分の事実確認に特化した読み取り中心のレビュー補助 Agent

## Workflow Phases
| Phase | Sub-skill | Description | Gate |
|-------|-----------|-------------|------|
| 0 | `rule-cataloger` | リポジトリ内の規約・既存パターン・レビュー観点を抽出してレビュー基準を定義する | auto |
| 1 | `diff-reviewer` | 変更差分をレビュー基準に照らして問題候補を抽出する | auto |
| 2 | `review-synthesizer` | 指摘を重要度・根拠・修正方針つきで整理する | ⏸️ |

## Integrations
- MCP: none
- Databases: none

## Reference Model
- Based on: none explicitly specified

## Quality Criteria
- ルールが曖昧な精神論ではなく、レビュー時に判定できる基準として書かれている
- AIレビュー結果に「なぜその指摘になるか」の根拠が含まれる
- 指摘が重要度順に整理され、ノイズが少ない
- プロジェクト固有ルールと一般的なWebアプリ開発ルールが区別されている
- suite 全体でレビューの流れが `ルール確認 → 差分レビュー → 指摘整理` に一致している

## Assumptions
- suite 構成は、ユーザーが示した workflow に対応する 3 sub-skills を前提にした
- 主用途は AI によるコードレビュー基準づくりであり、自動修正までは必須範囲に含めていない
- MCP / 外部API / DB 連携は現時点では不要としている
- 既存スキルを参照モデルとして固定せず、新規 suite として設計する前提にしている

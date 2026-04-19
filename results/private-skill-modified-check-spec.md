# Workflow Development Specification

## Objective
`main` 向けを除く PR の CI で `private-skill/` 配下の変更を検知し、該当 PR に「skill更新による内容を確認してください」とコメントする GitHub Actions workflow を作る。

## Domain & Audience
- Domain: GitHub Actions / PR review automation
- Primary users: `private-skill/` の変更をレビューする開発者・メンテナー

## Architecture
- Type: Single workflow
- Workflow:
  - `private-skill-modified-check`
- Custom Agents:
  - none

## Workflow Phases
| Phase | Component | Description | Gate |
|-------|-----------|-------------|------|
| 0 | `private-skill-modified-check` | `pull_request` イベントのうち base が `main` ではない PR を対象にする | auto |
| 1 | `private-skill-modified-check` | PR 差分に `private-skill/` 配下の変更があるか判定する | auto |
| 2 | `private-skill-modified-check` | 条件一致時に PR へレビュー確認コメントを投稿または更新する | auto |

## Integrations
- MCP: none
- Databases: none
- External APIs / tools:
  - GitHub Actions
  - GitHub Pull Request comments API

## Reference Model
- Based on: none

## Quality Criteria
- `main` 向けを除く PR で通知が実行される
- `private-skill/` 配下の変更がある PR でのみ通知が実行される
- 対象 PR にレビュー確認コメントが残る
- コメント文面に「skill更新による内容を確認してください」が含まれる
- 同一 PR で不要な重複コメントをできるだけ避ける
- `main` 向け PR や `private-skill/` に変更がない PR には影響しない

## Assumptions
- 対象は GitHub Actions workflow であり、Agent Skill package は今回は作らない
- 対象は PR ベースの CI であり、push 単体イベントは主対象ではない
- 通知対象はリポジトリ内部のレビュー担当者である
- 初回は 1 つの単機能 workflow として設計し、suite 化は行わない
- `main` 向け PR は、その前段の `develop` 向け PR の CI ですでに `private-skill/` 変更確認が済んでいる前提で除外する
- コメントは新規投稿よりも既存通知の更新を優先する想定だが、実装時に既存パターンを確認して最終化する

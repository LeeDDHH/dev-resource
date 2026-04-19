# Agent Skills Development Specification

## Objective
Webアプリ開発で定義済みのルールを確認し、そのルールに沿った実装ガイドを自動生成する suite を作る。

## Domain & Audience
- Domain: Webアプリ開発
- Primary users: 実装を進める開発者

## Architecture
- Type: Suite
- Sub-skills:
  - `rule-reader` — 既存のレビュー基準・実装ルール・関連ドキュメントを読み取り、対象タスクに関係するルールを抽出する
  - `rule-checker` — 実装対象や要求内容に対して、適用すべきルールと不足情報を照合する
  - `implementation-guide-writer` — 抽出されたルールに基づき、実装手順・注意点・確認項目を構造化して出力する
- Custom Agents:
  - none

## Workflow Phases
| Phase | Sub-skill | Description | Gate |
|-------|-----------|-------------|------|
| 0 | `rule-reader` | `review-criteria/` や関連ドキュメントから、対象タスクに関係する実装ルールを収集する | auto |
| 1 | `rule-checker` | 要求内容とルールを照合し、適用対象・不足前提・確認事項を整理する | auto |
| 2 | `implementation-guide-writer` | ルールに準拠した実装ガイドを、手順・注意点・確認観点つきで生成する | ⏸️ |

## Integrations
- MCP: none
- Databases: none

## Reference Model
- Based on: `review-criteria-suite` の phase 分離パターンを参考にしつつ、出力先を diff review ではなく implementation guide に置き換える

## Quality Criteria
- 生成されるガイドが抽象論ではなく、実装順序と確認観点を含む
- 使用したルールの出典が追える
- 必須ルールと推奨ルールが区別されている
- ルール不足や要件不足がある場合、仮定ではなく open question として明示される
- 開発者がそのまま着手できる粒度の手順になっている

## Assumptions
- 入力として、要求内容に加えて `review-criteria/` 配下などのルール文書が存在する前提にしている
- 主用途はコード生成そのものではなく、実装前のガイド生成である
- 初版は Web アプリ開発を対象とし、他ドメイン展開はスコープ外とする
- 外部 API や DB 連携なしで、リポジトリ内ドキュメント読取中心の suite とする

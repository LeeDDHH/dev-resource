# Scripts Review Criteria

## Required Review Gates

以下は scripts 配下のコードレビューで **必須条件** として扱う。

- Project-Specific: `PS-1`, `PS-2`, `PS-3`, `PS-5`
- General Web App: `GW-1`, `GW-2`, `GW-4`

### Enforcement Rule

- `scripts/` 配下を変更する差分で、必須条件に 1 件でも違反した場合は **Request changes** 相当とする
- 必須条件でないルールは、原則 **改善推奨** として扱う
- ただし、非必須ルールでも今回の変更で障害・誤動作・レビュー不能性に直結する場合は、個別に重要度を引き上げてよい

## Project-Specific Rules

| ID | Review Gate | Rule | Why | How to Judge | Scope | Source | Default Severity | Exceptions |
|---|---|---|---|---|---|---|---|---|
| PS-1 | Required | `scripts/` の CLI は `#!/usr/bin/env node` 付きの `.mjs` とし、`node ./scripts/...` で直接実行できる形を保つ | 実行方法が揺れると npm script / CI からの呼び出しが不安定になる | 新規 script が shebang と `.mjs` を持ち、`package.json` や workflow から `node ./scripts/...` で呼べるかを見る | `scripts/*.mjs` | `scripts/validate-agent-skills.mjs:1`, `scripts/deploy-private-skills.mjs:1`, `scripts/private-skill-modified-check.mjs:1`, `package.json:52-54` | medium | 既存 script を薄い wrapper として残す場合は中身が最小なら可 |
| PS-2 | Required | ファイル操作する script は `process.cwd()` 前提にせず、`import.meta.url` 基準で project root を解決する | 実行ディレクトリ依存を避け、CI / ローカルで安定させるため | `resolve(scriptDir, '..')` 相当で project root を求めているか。相対パス直書きに依存していないかを見る | FS を触る script | `scripts/validate-agent-skills.mjs:8-11`, `scripts/deploy-private-skills.mjs:7-10` | high | FS を触らず git 出力だけ扱う script は対象外 |
| PS-3 | Required | deploy 系 script は「コピー前の削除」「競合検出」を行い、古い成果物や上書き衝突を残さない | `.github` 配下の deploy で stale file や衝突を残すと次回レビューで誤認が起きる | deploy 先競合を事前検出しているか、置換時に不要ファイルを消せる実装かを見る | deploy script | `scripts/deploy-private-skills.mjs:92-113`, `scripts/deploy-private-skills.mjs:115-126` | high | 追記型 deploy を意図し、不要物削除が不要と明示されている場合 |
| PS-4 | Advisory | CI 向け validator は全件実行だけでなく「変更差分だけ」を検証できること | PR ごとの実行コストを抑えつつ、必要な検証を落とさないため | `--changed-from` や明示 path 指定など、対象を絞る入口があるかを見る | validator / CI script | `scripts/validate-agent-skills.mjs:12-15`, `scripts/validate-agent-skills.mjs:30-72`, `.github/workflows/ci.yml:22-23` | medium | 対象数が十分小さく、常時全件実行でも問題ない script |
| PS-5 | Required | GitHub PR へ通知する script は marker を使って 1 コメントに集約し、重複・ stale comment を掃除する | 再実行の多い workflow でコメントが増殖するとレビュー体験が悪化する | 固有 marker があるか、既存コメント更新・重複削除・不要時削除まで実装しているかを見る | PR comment automation | `scripts/private-skill-modified-check.mjs:3-5`, `scripts/private-skill-modified-check.mjs:101-106`, `scripts/private-skill-modified-check.mjs:136-169` | high | 履歴を残すため毎回新規コメントを意図する運用なら除外 |
| PS-6 | Advisory | 共通処理は関数として export し、用途別 script は薄い wrapper に留める | deploy ロジックの重複を減らし、 suite 単位の派生 script を安全に増やせる | script が再利用関数を export しているか、wrapper が 1 用途への委譲だけになっているかを見る | 再利用される script | `scripts/deploy-private-skills.mjs:132-149`, `scripts/deploy-dev-motivator.mjs:3-6` | medium | 単発・使い捨て script |

## General Web App Rules

| ID | Review Gate | Rule | Why | How to Judge | Scope | Source | Default Severity | Exceptions |
|---|---|---|---|---|---|---|---|---|
| GW-1 | Required | `process.env` / CLI 引数 / 外部入力は side effect 前に検証し、不正値は明示エラーにする | 後段で失敗すると原因特定が難しい | 必須 env や数値引数が先に検証されているか、エラーメッセージが具体的かを見る | すべての automation script | `scripts/private-skill-modified-check.mjs:7-29` | high | 読み取り専用の補助 script で、欠損時に no-op が明示仕様のもの |
| GW-2 | Required | 外部 API / git / fs 失敗時は文脈付きで失敗を表面化し、silent fallback を避ける | CI やレビューで失敗原因を追いやすくするため | `catch` で握りつぶしていないか、失敗時に対象 ref / path / status を含むかを見る | 外部依存を持つ script | `scripts/validate-agent-skills.mjs:32-45`, `scripts/private-skill-modified-check.mjs:52-63` | high | ユーザー向けレポート script で「データなし」を正常系として扱う場合 |
| GW-3 | Advisory | ページネーションのある API は全件取得を前提に実装する | PR files / comments の取りこぼしを防ぐため | `per_page` 固定だけで終わらず、複数 page を最後までたどるかを見る | API script | `scripts/private-skill-modified-check.mjs:65-92` | medium | 件数上限が API / domain 上保証されている場合 |
| GW-4 | Required | 副作用を持つ script は再実行しても破綻しない idempotent 設計を優先する | CI の rerun や synchronize イベントで同じ script が複数回動くため | update / delete / replace で状態同期する設計か、重複生成しないかを見る | deploy / notification / sync script | `scripts/private-skill-modified-check.mjs:136-169`, `scripts/deploy-private-skills.mjs:117-126` | high | 明示的に履歴蓄積を目的とする処理 |
| GW-5 | Advisory | 終了ログは「何を対象に、何件処理し、どう終わったか」が分かる粒度にする | script 実行結果を CI ログだけで判断しやすくするため | 成功時に対象や件数、失敗時に原因が出るかを見る | すべての script | `scripts/deploy-private-skills.mjs:127-141`, `scripts/private-skill-modified-check.mjs:177-186`, `scripts/validate-agent-skills.mjs:183-191` | low | 補助関数そのものは対象外 |

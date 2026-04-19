# CI Workflow Review Criteria

## Required Review Gates

以下は `.github/workflows/` と `.node-version` に関わる変更レビューで **必須条件** として扱う。

- Project-Specific: `PS-1`, `PS-2`, `PS-3`
- General Web App: `GW-1`, `GW-2`

### Enforcement Rule

- `.github/workflows/` や `.node-version` を変更する差分で、必須条件に 1 件でも違反した場合は **Request changes** 相当とする
- 必須条件でないルールは、原則 **改善推奨** として扱う
- ただし、非必須ルールでも今回の変更で CI fail / キャッシュ汚染 / 検証漏れに直結する場合は、個別に重要度を引き上げてよい

## Project-Specific Rules

| ID | Review Gate | Rule | Why | How to Judge | Scope | Source | Default Severity | Exceptions |
|---|---|---|---|---|---|---|---|---|
| PS-1 | Required | Node を使う workflow は `actions/setup-node` の `node-version-file: .node-version` を使い、workflow ごとの固定 version 文字列へ分岐させない | CI の Node 実行環境を `.node-version` / `package.json#volta` と揃え、workflow 間の version drift を防ぐため | Node workflow が `node-version-file: .node-version` を使っているかを見る。`node-version:` の直書きが新規追加されていないか確認する | `.github/workflows/*.yml`, `.node-version` | `.github/workflows/ci.yml:34-39`, `.github/workflows/private-skill-modified-check.yml:31-33`, `.node-version:1`, `package.json:132-135` | high | matrix test などで複数 Node version を明示的に回す workflow |
| PS-2 | Required | `node_modules` キャッシュで install をスキップする場合、キャッシュキーは少なくとも OS・`.node-version`・`package-lock.json` を含む | このリポジトリは `sharp` / `electron` など Node ABI 影響を受ける依存を含むため、runtime や lockfile の変化でキャッシュを確実に無効化する必要がある | `actions/cache` の key に OS と `hashFiles('.node-version')` と `hashFiles('package-lock.json')` が含まれるかを見る。いずれか欠けた状態で install skip していないか確認する | dependency install を持つ workflow | `.github/workflows/ci.yml:40-54`, `package.json:23`, `package.json:93`, `.node-version:1` | high | `node_modules` をキャッシュせず毎回 `npm ci` を実行する場合 |
| PS-3 | Required | npm 系 dependency cache を使う workflow では lockfile・cache 設定・install コマンドを npm に揃える | このリポジトリは `package-lock.json` と Volta の npm 定義を持つため、キャッシュ対象と install 手段がずれると再現性が崩れる | `actions/setup-node` の `cache: 'npm'` と `cache-dependency-path: package-lock.json` が対応し、install は `npm ci` になっているかを見る | npm install を行う workflow | `.github/workflows/ci.yml:34-54`, `package-lock.json`, `package.json:132-135` | medium | install を伴わない notification-only workflow |

## General Web App Rules

| ID | Review Gate | Rule | Why | How to Judge | Scope | Source | Default Severity | Exceptions |
|---|---|---|---|---|---|---|---|---|
| GW-1 | Required | キャッシュ復元後に install を省略する条件は、部分一致 restore ではなく「完全一致 cache hit」のときだけに限定する | 古いキャッシュや互換性のない依存で build が通ったり落ちたりする不安定な CI を避けるため | install skip 条件が `steps.<cache-step>.outputs.cache-hit == 'true'` の exact-hit 判定に基づくかを見る。restore key で復元しただけなのに install を飛ばしていないか確認する | 依存キャッシュ付き workflow | `.github/workflows/ci.yml:41-54` | high | install を常に実行し、cache は download 速度改善だけに使う場合 |
| GW-2 | Required | workflow の主要検証ジョブは、依存取得方式を変えても既存の検証責務を落とさない | キャッシュ最適化で lint / build / validator が外れると、速度改善より検出漏れのコストが大きい | cache 導入前後で対象 job の検証手順が維持されているかを見る。既存 script や必要 env が失われていないか確認する | CI workflow | `.github/workflows/ci.yml:14-58`, `.github/copilot-instructions.md:55-60`, `package.json:28-55` | high | 役割分離のため別 workflow / job へ明示的に移した場合 |
| GW-3 | Advisory | package manager の download cache (`actions/setup-node` の `cache`) だけで十分な場合は、`node_modules` キャッシュ追加の必要性を明示する | キャッシュ層を増やすほど invalidation とデバッグが難しくなるため、追加コストに見合う根拠が必要 | `node_modules` キャッシュ追加時に、skip install 目的か、計測済みの待ち時間短縮か、必要性が説明できるかを見る | cache strategy 変更 | `.github/workflows/ci.yml:34-54` | low | ネイティブ依存や巨大依存で download cache だけでは効果不足が明確な場合 |

## Open Questions

- `validate-agent-skills` job は現状 `yarn validate-agent-skills` を使っているが、npm ベースへ統一するかは別途判断が必要

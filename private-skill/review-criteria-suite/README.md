# Review Criteria Suite

Webアプリ開発向けのコーディングルールを明文化し、AI code reviewer の差分レビュー基準を揃えるための Agent Skill suite です。

## Overview

この suite は次の 3 phase で動きます。

1. `rule-cataloger` — リポジトリ内の規約・既存パターン・レビュー観点を収集し、判定可能なレビュー基準へ整理
2. `diff-reviewer` — 変更差分をレビュー基準に照らして問題候補を抽出
3. `review-synthesizer` — 指摘を重要度・カテゴリ・根拠・修正方針つきで整理

## Sub-skills

- `rule-cataloger`
- `diff-reviewer`
- `review-synthesizer`

## Custom Agents

- `review-orchestrator`
- `code-review-auditor`

## Design Goals

- 判定可能なレビュー基準にする
- 指摘ごとに根拠を添える
- 重要度順でノイズを抑えて整理する
- プロジェクト固有ルールと一般ルールを分離する
- suite 全体の流れを `ルール確認 → 差分レビュー → 指摘整理` に揃える

## Package Layout

```text
review-criteria-suite/
├── AGENTS.md
├── copilot-instructions.md
├── group.json
├── skill.json
├── agents/
└── skills/
```

## Deployment Layout

```text
review-criteria-suite/AGENTS.md
  -> .github/skills/review-criteria-suite/SKILL.md

review-criteria-suite/skills/rule-cataloger/SKILL.md
  -> .github/skills/rule-cataloger/SKILL.md

review-criteria-suite/skills/diff-reviewer/SKILL.md
  -> .github/skills/diff-reviewer/SKILL.md

review-criteria-suite/skills/review-synthesizer/SKILL.md
  -> .github/skills/review-synthesizer/SKILL.md

review-criteria-suite/agents/review-orchestrator.md
  -> .github/agents/review-orchestrator.md

review-criteria-suite/agents/code-review-auditor.md
  -> .github/agents/code-review-auditor.md

do not overwrite:
.github/AGENTS.md
.github/copilot-instructions.md
```

## Notes

- このディレクトリは root 配置の source package です
- `.github/AGENTS.md` と `.github/copilot-instructions.md` は repo-wide instructions のため上書きしません
- 配布時は `AGENTS.md` を `.github/skills/review-criteria-suite/SKILL.md` として置きます
- `skills/*/SKILL.md` は `.github/skills/<skill-name>/SKILL.md`、`agents/*.md` は `.github/agents/*.md` に置きます
- 外部連携や MCP は使いません
- 出力テンプレートが必要な sub-skill にだけ `assets/` を置いています

# Implementation Guide Suite

既存のルール文書を確認し、実装対象に適用すべき条件を整理したうえで、開発者向けの実装ガイドを生成する Agent Skill suite です。

## Overview

この suite は次の 3 phase で動きます。

1. `rule-reader` — `review-criteria/` などから関係ルールを抽出
2. `rule-checker` — 要求内容とルールを照合し、必須条件・不足情報・open question を整理
3. `implementation-guide-writer` — 実装順序、注意点、確認項目を含むガイドを生成

## Sub-skills

- `rule-reader`
- `rule-checker`
- `implementation-guide-writer`

## Design Goals

- ルール文書の所在を明示したままガイド生成へつなぐ
- 必須ルールと推奨ルールを分離する
- 要件不足を勝手に補完せず open question に落とす
- 開発者がそのまま着手できる粒度で手順化する

## Package Layout

```text
implementation-guide-suite/
├── AGENTS.md
├── copilot-instructions.md
├── group.json
├── skill.json
└── skills/
    ├── rule-reader/
    ├── rule-checker/
    └── implementation-guide-writer/
```

## Deployment Layout

```text
implementation-guide-suite/AGENTS.md
  -> .github/skills/implementation-guide-suite/SKILL.md

implementation-guide-suite/skills/rule-reader/SKILL.md
  -> .github/skills/rule-reader/SKILL.md

implementation-guide-suite/skills/rule-checker/SKILL.md
  -> .github/skills/rule-checker/SKILL.md

implementation-guide-suite/skills/implementation-guide-writer/SKILL.md
  -> .github/skills/implementation-guide-writer/SKILL.md
```

## Notes

- このディレクトリは source package です
- `.github/AGENTS.md` と `.github/copilot-instructions.md` は repo-wide のため上書きしません
- 初版は外部 API や MCP を使わず、リポジトリ内ドキュメントの読取中心です
- 定型出力がある `implementation-guide-writer` にだけ `assets/` を置いています

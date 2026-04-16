# Conversation Learning (2026-04-14)

## Summary

この会話では、`dev-motivator` スイートを実行・監査しながら、Harness 品質を上げるための改善を段階的に整理しました。中心となった学びは、**スキル品質は SKILL.md 単体ではなく、CI・Custom Agent・出力契約・禁止事項まで含めて揃えたときに初めて安定する** という点です。

## Questions and Answers

| Question | Answer |
|---|---|
| 最近の変更・進捗・フィードバックをまとめて振り返るには？ | `dev-motivator` を使い、`commit-summarizer` → `progress-reporter` → `motivational-feedback` の順で成果物を生成し、統合レポートを `results/` に保存する形が適切でした。 |
| 完了した作業から何を学びとして残すべきか？ | `progress-analyzer` が行数系を `null` で返すケースは再発しやすい落とし穴だったため、`progress-reporter` の Gotchas と Validation Loop にローカル `git --no-pager show --numstat <sha>` 補完を追記しました。 |
| Harness 監査で最初に弱かった点は何か？ | `Eval Coverage` と `Security Guardrails` が弱く、CI に Agent Skills 検証がなく、`dev-motivator` 本体にも禁止事項が不足していました。 |
| `.github/workflows/ci.yml` に何を足すべきか？ | Agent Skills 専用の `validate-agent-skills` job を追加し、`.github/AGENTS.md` と `.github/skills/**/SKILL.md` の構造品質を PR 時に自動検証するのが有効でした。 |
| validator はどう実装するのがよいか？ | bash を直接 CI に埋め込むより、`scripts/validate-agent-skills.mjs` に切り出し、`package.json` の script 経由で呼ぶ形にすると再利用しやすく、検証ルールの拡張もしやすいです。 |
| validator にどんな説明を残すべきか？ | スクリプト全体で何を検証しているかの要約と、各関数がどの責務を持つかのコメントを入れると、保守性が上がります。 |
| `dev-motivator` 本体に追加すべきガードレールは？ | `Prohibited Operations` を追加し、`git push`・履歴改変・機密情報出力・`results/` 以外への保存を禁止事項として明示するのが妥当でした。 |
| `progress-reporter` / `progress-analyzer` の契約はどう厳格化すべきか？ | 行数系の `null` を許容せず、欠損時は `git --no-pager show --numstat <sha>` でローカル補完してから返却・保存する契約に揃えるべき、という結論になりました。 |
| 最終的な Harness 成熟度はどうなったか？ | `validate-agent-skills`、`Prohibited Operations`、`null` 補完契約がそろったことで、`dev-motivator` の監査結果は **Intermediate から Advanced** に改善しました。 |

## Consolidated Learning

今回の一番大きな学びは、**Agent Skill の品質を上げるには「実行できること」だけでなく、「壊れ方を防ぐ仕組み」を同時に設計する必要がある** ということです。  
具体的には、1) CI で構造を自動検証する、2) SKILL.md に禁止事項を明文化する、3) Custom Agent の出力契約を `null` 許容なしで揃える、4) 発見した落とし穴を Gotchas に即時反映する、という 4 点を揃えることで、Harness の成熟度が目に見えて上がりました。

## Related Outputs

- `results/2026-04-14-commit-summary.md`
- `results/2026-04-14-progress-report.md`
- `results/2026-04-14-feedback.md`
- `results/2026-04-14-dev-motivator.md`

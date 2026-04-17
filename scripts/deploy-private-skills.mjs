#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFilePath = fileURLToPath(import.meta.url);
const scriptDir = dirname(currentFilePath);
const projectRoot = resolve(scriptDir, '..');
const privateSkillsRoot = resolve(projectRoot, 'private-skill');

// 指定パス直下のディレクトリ名だけを安定順で返す。
// suite 一覧や leaf skill 一覧の収集を共通化する。
function listDirectories(rootPath) {
  if (!existsSync(rootPath)) {
    return [];
  }

  return readdirSync(rootPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

// CLI 引数があればその suite だけ、未指定なら private-skill 配下の全 suite を対象にする。
// 実行対象が 0 件のまま静かに終わらないよう、全件モードで空なら明示的に失敗させる。
function getSuiteNames(requestedSuiteNames) {
  if (requestedSuiteNames.length > 0) {
    return requestedSuiteNames;
  }

  const suiteNames = listDirectories(privateSkillsRoot);

  if (suiteNames.length === 0) {
    throw new Error(`No private-skill suites found: ${relative(projectRoot, privateSkillsRoot)}`);
  }

  return suiteNames;
}

// 1 suite 分の同期対象を組み立てる。
// - skills/* は .github/skills/<skill-name>/ に配置
// - agents/*.md は .github/agents/ に配置
// - AGENTS.md は同名 leaf skill がない場合だけ suite router として配置
function buildDeployTargets(suiteName) {
  const suiteRoot = resolve(privateSkillsRoot, suiteName);

  if (!existsSync(suiteRoot)) {
    throw new Error(`Suite source not found: ${relative(projectRoot, suiteRoot)}`);
  }

  const targets = [];
  const skillsRoot = resolve(suiteRoot, 'skills');
  const skillNames = listDirectories(skillsRoot);

  for (const skillName of skillNames) {
    targets.push({
      kind: 'skill',
      sourcePath: resolve(skillsRoot, skillName),
      targetPath: resolve(projectRoot, '.github/skills', skillName),
    });
  }

  const agentsRoot = resolve(suiteRoot, 'agents');
  if (existsSync(agentsRoot)) {
    const agentEntries = readdirSync(agentsRoot, { withFileTypes: true })
      .filter((entry) => entry.isFile() && extname(entry.name) === '.md')
      .sort((left, right) => left.name.localeCompare(right.name));

    for (const agentEntry of agentEntries) {
      targets.push({
        kind: 'agent',
        sourcePath: resolve(agentsRoot, agentEntry.name),
        targetPath: resolve(projectRoot, '.github/agents', agentEntry.name),
      });
    }
  }

  const suiteSkillSourcePath = resolve(suiteRoot, 'AGENTS.md');
  const hasSameNamedLeafSkill = skillNames.includes(suiteName);
  if (existsSync(suiteSkillSourcePath) && !hasSameNamedLeafSkill) {
    targets.push({
      kind: 'suite',
      sourcePath: suiteSkillSourcePath,
      targetPath: resolve(projectRoot, '.github/skills', suiteName, 'SKILL.md'),
    });
  }

  return targets;
}

// 複数 suite をまとめて deploy したときに、同じ .github 側パスへ別ソースが競合しないかを先に検証する。
// 後勝ち上書きにすると気づきにくいので、衝突時は即エラーにする。
function ensureNoTargetConflicts(targets) {
  const seenTargets = new Map();

  for (const target of targets) {
    const existingSourcePath = seenTargets.get(target.targetPath);

    if (existingSourcePath) {
      throw new Error(
        [
          'Multiple private-skill sources resolve to the same deploy target.',
          `target: ${relative(projectRoot, target.targetPath)}`,
          `first: ${relative(projectRoot, existingSourcePath)}`,
          `second: ${relative(projectRoot, target.sourcePath)}`,
        ].join('\n'),
      );
    }

    seenTargets.set(target.targetPath, target.sourcePath);
  }
}

// 既存 skill ディレクトリは一度消してから丸ごとコピーし、不要になった assets も取り除く。
// 単一ファイルの agent / suite router はファイル単位で置き換える。
function deployTarget(target) {
  if (target.kind === 'skill') {
    rmSync(target.targetPath, { force: true, recursive: true });
  } else {
    rmSync(target.targetPath, { force: true });
  }

  mkdirSync(dirname(target.targetPath), { recursive: true });
  cpSync(target.sourcePath, target.targetPath, { recursive: true });

  console.log(
    `deployed ${relative(projectRoot, target.targetPath)} <= ${relative(projectRoot, target.sourcePath)}`,
  );
}

// public API:
// 指定 suite 群、または private-skill 配下の全 suite を .github 配下へ同期する。
export function deploySuites(requestedSuiteNames = []) {
  const suiteNames = getSuiteNames(requestedSuiteNames);
  const targets = suiteNames.flatMap((suiteName) => buildDeployTargets(suiteName));

  ensureNoTargetConflicts(targets);
  targets.forEach(deployTarget);

  console.log(`Deployed ${targets.length} target(s) from ${suiteNames.length} suite(s).`);
}

// 直接実行されたときだけ CLI として動かし、import 時は関数エクスポートだけに留める。
const isDirectRun = process.argv[1] && resolve(process.argv[1]) === currentFilePath;

if (isDirectRun) {
  deploySuites(process.argv.slice(2));
}

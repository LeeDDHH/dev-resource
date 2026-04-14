#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = fileURLToPath(new URL('.', import.meta.url));
const projectRoot = resolve(scriptDir, '..');
const agentsPath = join(projectRoot, '.github', 'AGENTS.md');
const skillsRoot = join(projectRoot, '.github', 'skills');
const args = process.argv.slice(2);
const changedFrom = args.find((arg) => arg.startsWith('--changed-from='))?.split('=')[1];
const explicitPaths = args.filter((arg) => !arg.startsWith('--'));

const errors = [];

// Agent Skills 全体の構造を検証するスクリプト。
// .github/AGENTS.md のルーティング記述、各 SKILL.md の必須 frontmatter /
// セクション / 行数、assets/ 参照の有無をチェックする。
// CI では変更されたファイルだけに絞って走らせられるようにしている。
function addError(message) {
  errors.push(message);
}

function readText(filePath) {
  return readFileSync(filePath, 'utf8');
}

// PR の base SHA などを起点に、Agent Skills 関連で変更されたパスだけを取得する。
function getChangedPaths(ref) {
  try {
    const output = execFileSync(
      'git',
      ['diff', '--name-only', `${ref}...HEAD`, '--', '.github/AGENTS.md', '.github/skills'],
      { cwd: projectRoot, encoding: 'utf8' },
    );

    return output
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  } catch (error) {
    addError(`Unable to diff changed Agent Skills files from "${ref}"`);
    return [];
  }
}

// 変更パスを「AGENTS.md を検証するか」「どのスキルを検証するか」に整理する。
function collectTargetsFromPaths(paths) {
  const targets = {
    validateAgents: false,
    skillDirs: new Set(),
  };

  for (const rawPath of paths) {
    const absolutePath = resolve(projectRoot, rawPath);
    const projectRelativePath = relative(projectRoot, absolutePath);

    if (projectRelativePath === '.github/AGENTS.md') {
      targets.validateAgents = true;
      continue;
    }

    const segments = projectRelativePath.split(sep);
    if (segments[0] === '.github' && segments[1] === 'skills' && segments[2]) {
      targets.skillDirs.add(join(skillsRoot, segments[2]));
    }
  }

  return targets;
}

// Orchestrator ファイルが存在し、最低限の WHEN / DO ルーティングを持つか確認する。
function ensureAgentsFile() {
  if (!existsSync(agentsPath)) {
    addError('Missing .github/AGENTS.md');
    return;
  }

  const content = readText(agentsPath);

  if (!content.includes('WHEN')) {
    addError('.github/AGENTS.md must include WHEN routing rules');
  }

  if (!content.includes('DO')) {
    addError('.github/AGENTS.md must include DO routing rules');
  }
}

// 1つのスキルについて、frontmatter、必須見出し、500行制限、assets/ 参照を検証する。
function validateSkillFile(skillDir) {
  const skillPath = join(skillDir, 'SKILL.md');
  const skillName = basename(skillDir);

  if (!existsSync(skillPath)) {
    addError(`Missing SKILL.md in .github/skills/${skillName}`);
    return;
  }

  const content = readText(skillPath);
  const lineCount = content.split('\n').length;

  if (!/^name:\s*.+$/m.test(content)) {
    addError(`${skillName}: SKILL.md must declare a name in frontmatter`);
  }

  if (!/^description:\s*(\||>|\S.*)?$/m.test(content)) {
    addError(`${skillName}: SKILL.md must declare a description in frontmatter`);
  }

  if (lineCount > 500) {
    addError(`${skillName}: SKILL.md exceeds 500 lines (${lineCount})`);
  }

  for (const heading of ['## Quality Gates', '## Gotchas', '## Validation Loop']) {
    if (!content.includes(heading)) {
      addError(`${skillName}: SKILL.md must include "${heading}"`);
    }
  }

  const assetsDir = join(skillDir, 'assets');
  if (existsSync(assetsDir)) {
    const assetEntries = readdirSync(assetsDir, { withFileTypes: true }).filter((entry) =>
      entry.isFile(),
    );

    if (assetEntries.length > 0 && !content.includes('assets/')) {
      addError(`${skillName}: assets/ exists but SKILL.md does not reference assets/`);
    }
  }
}

// .github/skills 配下を総なめして、全スキルに共通ルールを適用する。
function validateSkills() {
  if (!existsSync(skillsRoot)) {
    addError('Missing .github/skills directory');
    return;
  }

  const skillDirs = readdirSync(skillsRoot, { withFileTypes: true }).filter((entry) =>
    entry.isDirectory(),
  );

  if (skillDirs.length === 0) {
    addError('No skills found in .github/skills');
    return;
  }

  for (const skillDir of skillDirs) {
    validateSkillFile(join(skillsRoot, skillDir.name));
  }
}

// 対象指定がある場合は変更ファイルだけ、ない場合は全 Agent Skills を検証する。
const targets =
  explicitPaths.length > 0
    ? collectTargetsFromPaths(explicitPaths)
    : changedFrom
      ? collectTargetsFromPaths(getChangedPaths(changedFrom))
      : null;

if (targets) {
  if (targets.validateAgents) {
    ensureAgentsFile();
  }

  for (const skillDir of targets.skillDirs) {
    validateSkillFile(skillDir);
  }

  if (!targets.validateAgents && targets.skillDirs.size === 0) {
    console.log('No Agent Skills files changed; skipping validation.');
    process.exit(0);
  }
} else {
  ensureAgentsFile();
  validateSkills();
}

// エラーをまとめて出力し、1件でもあれば CI を失敗させる。
if (errors.length > 0) {
  console.error('Agent Skills validation failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Agent Skills validation passed.');

import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, '..');
const suiteRoot = resolve(projectRoot, 'private-skill/dev-motivator');

if (!existsSync(suiteRoot)) {
  throw new Error(`Suite source not found: ${suiteRoot}`);
}

const targets = [
  ['agents/progress-analyzer.md', '.github/agents/progress-analyzer.md'],
  ['skills/dev-motivator', '.github/skills/dev-motivator'],
  ['skills/commit-summarizer', '.github/skills/commit-summarizer'],
  ['skills/progress-reporter', '.github/skills/progress-reporter'],
  ['skills/motivational-feedback', '.github/skills/motivational-feedback'],
];

for (const [sourceRelativePath, targetRelativePath] of targets) {
  const sourcePath = resolve(suiteRoot, sourceRelativePath);
  const targetPath = resolve(projectRoot, targetRelativePath);

  rmSync(targetPath, { force: true, recursive: true });
  mkdirSync(dirname(targetPath), { recursive: true });
  cpSync(sourcePath, targetPath, { recursive: true });

  console.log(`deployed ${targetRelativePath}`);
}

#!/usr/bin/env node
import { execSync } from 'child_process';

function formatDateYYYYMMDD(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8' }).trim();
  } catch (e) {
    return '';
  }
}

// 引数処理: --since=YYYY-MM-DD または --days=N
const argv = process.argv.slice(2);
let since = null;
for (const a of argv) {
  if (a.startsWith('--since=')) {
    since = a.split('=')[1];
  } else if (a.startsWith('--days=')) {
    const days = Number(a.split('=')[1]) || 1;
    const d = new Date();
    d.setDate(d.getDate() - days);
    since = formatDateYYYYMMDD(d);
  }
}
if (!since) {
  const d = new Date();
  d.setDate(d.getDate() - 1); // デフォルトは昨日
  since = formatDateYYYYMMDD(d);
}

const gitCmd = `git --no-pager log main --since="${since}" --pretty=format:"%h\t%an\t%ad\t%s" --date=short`;
const out = run(gitCmd);

if (!out) {
  console.log(`期間: ${since} 以降の main のコミットを調べましたが、該当するコミットはありませんでした。`);
  console.log('\n褒め言葉:');
  console.log('小さな一歩を踏み出すこと自体が大きな価値です。今日の作業、お疲れさまでした！');
  process.exit(0);
}

const lines = out.split('\n').filter(Boolean);
const commits = lines.map((ln) => {
  const [hash, author, date, ...rest] = ln.split('\t');
  const subject = rest.join('\t');
  return { hash, author, date, subject };
});

const total = commits.length;
const merges = commits.filter((c) => /^Merge/i.test(c.subject));
const others = commits.filter((c) => !/^Merge/i.test(c.subject));

console.log(`期間: ${since} 以降の main に含まれるコミット（合計 ${total} 件）`);
console.log('---');
if (merges.length) {
  console.log(`マージコミット: ${merges.length} 件`);
  merges.forEach((m) => {
    const prMatch = m.subject.match(/#(\d+)/);
    const pr = prMatch ? `PR #${prMatch[1]}` : '';
    console.log(`- ${m.hash} ${m.date} ${pr} — ${m.subject}`);
  });
  console.log('');
}

if (others.length) {
  console.log(`通常コミット: ${others.length} 件`);
  others.forEach((c) => {
    const short = c.subject.replace(/\s+/g, ' ');
    console.log(`- ${c.hash} ${c.date} — ${short}`);
  });
}

console.log('\n要約:');
if (merges.length) {
  console.log(`- マージで ${merges.length} 件の変更が main に取り込まれました。`);
}
if (others.length) {
  console.log(`- 個別の改善や調整が ${others.length} 件コミットされました。`);
}

// 短い褒め言葉（モチベーション維持用）
console.log('\n褒め言葉:');
if (total >= 5) {
  console.log('多くの着実な進捗が見えます。素晴らしい継続力です。');
} else if (total >= 2) {
  console.log('良いリズムで改善できています。今週も小さな勝利を積み重ねましょう。');
} else {
  console.log('一歩ずつ進めているのが伝わります。今日の作業を誇ってください。');
}

console.log('\n次のアクションの提案:');
console.log('- 各 PR の差分を確認して、次の小さなタスクを1つだけ決める。');
console.log('- 進捗を小さく切って完了を可視化すると継続しやすいです。');

process.exit(0);

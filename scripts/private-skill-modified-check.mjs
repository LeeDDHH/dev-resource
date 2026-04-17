#!/usr/bin/env node

const commentMarker = '<!-- private-skill-modified-check -->';
const commentMessage = 'skill更新による内容を確認してください';
const githubApiVersion = '2022-11-28'; // NOTE: とくに理由がなければ変更しないこと。API の安定性を保つため、明示的にバージョンを指定する。

const githubToken = process.env.GITHUB_TOKEN;
const githubRepository = process.env.GITHUB_REPOSITORY;
const pullRequestNumber = Number(process.env.PR_NUMBER ?? '');

// GitHub Actions 上で必要な情報が揃っていないと API 呼び出しが成立しないため、
// 失敗理由が分かりやすいように最初に必須環境変数を検証する。
if (!githubToken) {
  throw new Error('GITHUB_TOKEN is required.');
}

if (!githubRepository) {
  throw new Error('GITHUB_REPOSITORY is required.');
}

if (!Number.isInteger(pullRequestNumber) || pullRequestNumber <= 0) {
  throw new Error('PR_NUMBER must be a positive integer.');
}

const [owner, repo] = githubRepository.split('/');

if (!owner || !repo) {
  throw new Error(`Invalid GITHUB_REPOSITORY value: ${githubRepository}`);
}

// GitHub REST API への共通リクエスト関数。
// 認証・クエリ付与・JSON シリアライズ・エラーハンドリングをまとめて扱う。
async function githubRequest(path, options = {}) {
  const { method = 'GET', query = {}, body } = options;
  const url = new URL(`https://api.github.com${path}`);

  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${githubToken}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': githubApiVersion,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`GitHub API request failed (${response.status} ${response.statusText}): ${responseText}`);
  }

  if (!responseText) {
    return null;
  }

  return JSON.parse(responseText);
}

// GitHub API のページネーションを最後までたどり、配列レスポンスを 1 つにまとめる。
// changed files や comments は複数ページになることがあるため、取りこぼしを防ぐ。
async function paginate(path, query = {}) {
  const items = [];
  let page = 1;

  while (true) {
    const response = await githubRequest(path, {
      query: {
        ...query,
        per_page: 100,
        page,
      },
    });

    if (!Array.isArray(response)) {
      throw new Error(`Expected an array response from ${path}`);
    }

    items.push(...response);

    if (response.length < 100) {
      return items;
    }

    page += 1;
  }
}

// PR 差分のうち、通知対象である private-skill/ 配下の変更ファイルだけを抽出する。
async function getChangedPrivateSkillFiles() {
  const files = await paginate(`/repos/${owner}/${repo}/pulls/${pullRequestNumber}/files`);

  return files.map((file) => file.filename).filter((filename) => filename.startsWith('private-skill/'));
}

// このスクリプト自身が作成した通知コメントだけを拾う。
// 固有マーカーで判別することで、人手のコメントを誤って更新・削除しないようにする。
async function listNotificationComments() {
  const comments = await paginate(`/repos/${owner}/${repo}/issues/${pullRequestNumber}/comments`);

  return comments.filter((comment) => comment.body?.includes(commentMarker));
}

// レビューで確認してほしい対象ファイル一覧を含むコメント本文を組み立てる。
function buildCommentBody(files) {
  return [commentMarker, commentMessage, '', '対象ファイル:', ...files.map((filename) => `- \`${filename}\``)].join(
    '\n',
  );
}

async function createComment(body) {
  await githubRequest(`/repos/${owner}/${repo}/issues/${pullRequestNumber}/comments`, {
    method: 'POST',
    body: { body },
  });
}

async function updateComment(commentId, body) {
  await githubRequest(`/repos/${owner}/${repo}/issues/comments/${commentId}`, {
    method: 'PATCH',
    body: { body },
  });
}

async function deleteComment(commentId) {
  await githubRequest(`/repos/${owner}/${repo}/issues/comments/${commentId}`, {
    method: 'DELETE',
  });
}

// private-skill の変更がある場合は通知コメントを 1 件だけ維持する。
// 未作成なら新規作成し、既存があれば更新し、重複分は削除する。
async function upsertNotificationComment(files) {
  const existingComments = await listNotificationComments();
  const body = buildCommentBody(files);

  if (existingComments.length === 0) {
    await createComment(body);
    console.log('Created private-skill notification comment.');
    return;
  }

  await updateComment(existingComments[0].id, body);

  for (const duplicateComment of existingComments.slice(1)) {
    await deleteComment(duplicateComment.id);
  }

  console.log('Updated private-skill notification comment.');
}

// private-skill の変更がないときは、以前の通知コメントを掃除して状態を同期する。
async function removeStaleNotificationComments() {
  const existingComments = await listNotificationComments();

  for (const comment of existingComments) {
    await deleteComment(comment.id);
  }

  console.log(
    existingComments.length > 0
      ? 'Removed stale private-skill notification comment.'
      : 'No stale private-skill notification comment found.',
  );
}

// 実行フロー:
// 1. PR 差分から private-skill 配下の変更有無を調べる
// 2. 変更があれば通知コメントを作成または更新する
// 3. 変更がなければ古い通知コメントを削除する
async function main() {
  const matchedFiles = await getChangedPrivateSkillFiles();

  console.log(`Matched private-skill files: ${matchedFiles.join(', ') || '(none)'}`);

  if (matchedFiles.length > 0) {
    await upsertNotificationComment(matchedFiles);
    return;
  }

  await removeStaleNotificationComments();
}

await main();

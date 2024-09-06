import { promises as fs } from 'fs'; // Promiseベースのfsモジュールをインポート

import { originDataJsonPath, dbJsonPath, dbTagsJsonPath, tagCountDataJsonPath } from './Const';

// JSONファイルのパスのリスト
const filePaths: string[] = [originDataJsonPath, dbJsonPath, dbTagsJsonPath, tagCountDataJsonPath];

// ファイルを読み込んでminifyする関数
async function minifyJsonFile(filePath: string): Promise<void> {
  try {
    // ファイルの読み込み
    const data: string = await fs.readFile(filePath, 'utf8');
    // JSON文字列を解析してminify
    const minifiedData: string = JSON.stringify(JSON.parse(data));
    // minifiedデータでファイルを上書き
    await fs.writeFile(filePath, minifiedData, 'utf8');
    console.log(`JSONファイルをminifyしました: ${filePath}`);
  } catch (err) {
    console.error(`エラーが発生しました: ${filePath}`, err);
  }
}

// 並列でファイルをminifyする
async function minifyAllFiles(filePaths: string[]): Promise<void> {
  // 各ファイルのminify処理をPromiseで実行し、並列処理を行う
  const minifyPromises: Promise<void>[] = filePaths.map(minifyJsonFile);

  // すべてのPromiseが解決されるのを待つ
  await Promise.all(minifyPromises);
  console.log('すべてのファイルがminifyされました。');
}

// 関数を実行
// NOTE: @typescript-eslint/no-floating-promisesエラーを回避するため、void演算子で関数をラップ
void (async () => {
  await minifyAllFiles(filePaths);
})();

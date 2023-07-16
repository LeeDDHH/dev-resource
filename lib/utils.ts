'use strict';

import fs from 'fs';

import { dataTxtPath } from '@/lib/Const';

// 検索する文字を英語は小文字にしてスペース（半角、全角）ごとに区切る
export const splitStringFromSpace = (text: string): string[] => text.toLowerCase().replaceAll('　', ' ').split(' ');

// 英語（小文字）・数字をハイフン（-）でつなげる
export const connectLowercaseAlphabetDigitsHyphenatedString = (text: string) =>
  text
    .replace(/[^0-9a-z\\ ]/gi, '')
    .split(' ')
    .filter((stringValue: string) => stringValue.length)
    .join('-')
    .toLowerCase();

export const writeFileSync = ({ exportDataJsonPath, jsonData }: { exportDataJsonPath: string; jsonData: string }) => {
  // jsonファイルを書き出す
  fs.writeFile(exportDataJsonPath, jsonData, (err) => {
    if (err) {
      console.error('書き込みエラー:', err);
      throw err;
    }
    console.log('ファイルが正常に書き出されました。');
  });
};

export const jsonFileExchange = ({
  exportDataJsonPath,
  originDataJsonPath,
  jsonData,
}: {
  exportDataJsonPath: string;
  originDataJsonPath: string;
  jsonData: string;
}) => {
  // jsonファイルを書き出す
  writeFileSync({ exportDataJsonPath, jsonData });

  // 既存のjsonファイルを削除する
  try {
    fs.unlinkSync(originDataJsonPath);
    console.log(`${originDataJsonPath}を削除しました。`);
  } catch (err) {
    console.error('削除エラー:', err);
    throw err;
  }

  // 書き出したjsonファイルを既存のjsonファイル名に変更する
  fs.rename(exportDataJsonPath, originDataJsonPath, (err) => {
    if (err) throw err;

    console.log(`${exportDataJsonPath}を${originDataJsonPath}に移動しました`);
  });
};

export const readFileSync = (path: string) => {
  return fs.readFileSync(path, 'utf8');
};

// data.txtを一行ずつ区切る
export const splitUrlData = () => {
  const data = readFileSync(dataTxtPath);
  return data
    .toString()
    .split('\n')
    .filter((str: string) => str.length > 0);
};

import { originDataJsonPath, tagCountDataJsonPath } from '@/lib/Const';
import { writeFileSync, readFileSync } from '@/lib/utils';

import { JsonData } from '@/types/data';

type TagNameCountData = { [key: string]: number };
type TagCountData = {
  tag: string;
  count: number;
};

const data = JSON.parse(readFileSync(originDataJsonPath)) as JsonData;

// originDataの各リソースのタグを一つの配列にまとめる
const tagList = data.resource.map((resource) => resource.tag).flat();

// 各タグがどれだけあるのかカウントし、オブジェクトに格納する
const tagCountFromOriginData = tagList.reduce((acc: TagNameCountData, tagName: string) => {
  return { ...acc, [tagName]: (acc[tagName] || 0) + 1 };
}, {});

const tagCountDataList: TagCountData[] = Object.keys(tagCountFromOriginData).map((tagName) => ({
  tag: tagName,
  count: tagCountFromOriginData[tagName],
}));

// カウントされた数が多い順に並び替える
tagCountDataList.sort((a: TagCountData, b: TagCountData) => {
  if (a.count < b.count) return 1;
  if (a.count > b.count) return -1;
  return 0;
});

const newJsonData = JSON.stringify(tagCountDataList);

writeFileSync({ exportDataJsonPath: tagCountDataJsonPath, jsonData: newJsonData });

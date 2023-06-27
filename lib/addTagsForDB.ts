import { ResourceData, JsonData } from '../types/data';

import { originDataJsonPath, dbTmpJsonPath, dbTagsJsonPath } from './Const';
import { jsonFileExchange, readFileSync } from './utils';

let newDBObj: { resource: ResourceData[] } = { resource: [] };

const data = JSON.parse(readFileSync(originDataJsonPath)) as JsonData;

const uniqueTagData = JSON.parse(readFileSync(dbTagsJsonPath)) as string[];
const exsitingUniqueTags: string[] = [...new Set(uniqueTagData)];

const tagAddedResourceData: ResourceData[] = data.resource.map((v: ResourceData) => {
  if (v.tag.length > 0) return v;
  // タグ一覧
  const tags = exsitingUniqueTags.map((tag: string) => {
    const isFind = v.description.match(/^${tag}$/);
    return isFind ? tag : undefined;
  });
  const uniqueTags = tags.filter((item): item is string => typeof item == 'string');
  v.tag = uniqueTags;
  return v;
});

newDBObj.resource = tagAddedResourceData;

const newJsonData = JSON.stringify(newDBObj);

jsonFileExchange({ exportDataJsonPath: dbTmpJsonPath, originDataJsonPath: originDataJsonPath, jsonData: newJsonData });

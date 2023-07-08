import { originDataJsonPath, dbTagsJsonPath, dbTmpJsonPath } from '@/lib/Const';
import { jsonFileExchange, readFileSync } from '@/lib/utils';

import { ResourceData, JsonData } from '@/types/data';

let newDBObj: { resource: ResourceData[] } = { resource: [] };

const data = JSON.parse(readFileSync(originDataJsonPath)) as JsonData;

const uniqueTagData = JSON.parse(readFileSync(dbTagsJsonPath)) as string[];
const exsitingUniqueTags: string[] = [...new Set(uniqueTagData)];

const addSpecifiedTagFromURL = (tags: (string | undefined)[], resourceData: ResourceData): (string | undefined)[] => {
  const targetUrl = resourceData.url;
  const cloneTags = [...tags];
  switch (true) {
    case /qiita.com/.test(targetUrl):
    case /zenn.dev/.test(targetUrl):
    case /dev.classmethod.jp/.test(targetUrl):
    case /ics.media/.test(targetUrl):
      cloneTags.push('記事');
      return cloneTags;

    case /youtube.com/.test(targetUrl):
      cloneTags.push('Youtube');
      return cloneTags;

    case /github.com/.test(targetUrl):
      cloneTags.push('GitHub');
      return cloneTags;

    default:
      return cloneTags;
  }
};

const tagAddedResourceData: ResourceData[] = data.resource.map((resourceData: ResourceData) => {
  if (resourceData.tag.length > 0) return resourceData;
  // タグ一覧とresourceData.descriptionを比較して該当するキーワードと比較した結果を格納する
  const tags = exsitingUniqueTags.map((tag: string) => {
    const reg = new RegExp(`${tag.toLowerCase()}`);
    return reg.test(resourceData.description.toLowerCase()) ? tag : undefined;
  });
  // データのURLが特定のURLであれば、タグを追加する
  const addedtags = addSpecifiedTagFromURL(tags, resourceData);
  const concatTags = [...resourceData.tag, ...addedtags];
  const stringTags = concatTags.filter((item): item is string => typeof item == 'string');
  const uniqueTags = [...new Set(stringTags)];
  resourceData.tag = uniqueTags;
  return resourceData;
});

newDBObj.resource = tagAddedResourceData;

const newJsonData = JSON.stringify(newDBObj);

jsonFileExchange({ exportDataJsonPath: dbTmpJsonPath, originDataJsonPath: originDataJsonPath, jsonData: newJsonData });

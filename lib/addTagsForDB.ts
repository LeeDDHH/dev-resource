import { originDataJsonPath, dbTmpJsonPath } from '@/lib/Const';
import { jsonFileExchange, readFileSync } from '@/lib/utils';

import { morphologicalAnalysisByNoun } from './morphologicalAnalysis';

import { ResourceData, JsonData } from '@/types/data';

const newDBObj: { resource: ResourceData[] } = { resource: [] };

const data = JSON.parse(readFileSync(originDataJsonPath)) as JsonData;

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

    case /twitter.com/.test(targetUrl):
      cloneTags.push('twitter');
      return cloneTags;

    default:
      return cloneTags;
  }
};

const getData = async (resourceData: ResourceData) => {
  if (resourceData.tag.length > 0) return resourceData;
  console.log('description: ', resourceData.description.toLowerCase());

  const lowerCaseString = resourceData.description.toLowerCase();
  const targetText = lowerCaseString.substring(0, lowerCaseString.indexOf('|'));
  const tags = await morphologicalAnalysisByNoun(targetText);
  const stringMorphologicalAnalysisTags = tags.filter((item): item is string => typeof item == 'string');

  // データのURLが特定のURLであれば、タグを追加する
  const addedtags = addSpecifiedTagFromURL(tags, resourceData);
  const concatTags = [...resourceData.tag, ...addedtags, ...stringMorphologicalAnalysisTags];
  const stringTags = concatTags.filter((item): item is string => typeof item == 'string');
  const uniqueTags = [...new Set(stringTags)];
  resourceData.tag = uniqueTags;
  console.log('tag: ', resourceData.tag);
  return resourceData;
};

// 非同期通信で反復処理をする
const getMorphologicalAnalysisByNoun = (resource: ResourceData[]) => {
  console.log('getMorphologicalAnalysisByNoun');
  return resource.map((resourceData) => {
    if (resourceData.tag.length > 0) return resourceData;
    return getData(resourceData);
  });
};

void (async () => {
  const newResourceData: (ResourceData | undefined)[] = await Promise.all(
    getMorphologicalAnalysisByNoun(data.resource)
  );
  const tagAddedResourceData = newResourceData.filter((tag): tag is ResourceData => typeof tag == 'object');

  newDBObj.resource = tagAddedResourceData;

  const newJsonData = JSON.stringify(newDBObj);

  jsonFileExchange({
    exportDataJsonPath: dbTmpJsonPath,
    originDataJsonPath: originDataJsonPath,
    jsonData: newJsonData,
  });
})();

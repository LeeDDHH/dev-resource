import { BrowserContext } from 'playwright';

import { originDataJsonPath, dbTmpJsonPath } from '@/lib/Const';
import { createChromiumBrowserAndContext } from '@/lib/playwright';
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

const generateTags = async (context: BrowserContext, resourceData: ResourceData) => {
  let optionalTags: string[] = [];
  const lowerCaseString = resourceData.description.toLowerCase();
  const targetText = lowerCaseString.substring(0, lowerCaseString.indexOf('|'));
  const tags = await morphologicalAnalysisByNoun(targetText);
  const stringMorphologicalAnalysisTags = tags.filter((item): item is string => typeof item == 'string');

  const isQiita = /qiita.com/.test(resourceData.url);

  if (isQiita) {
    // urlをもとに取得するpageの初期化
    const page = await context.newPage();
    await page.goto(resourceData.url);
    // 230722時点でQiitaのタグを取得するためのクラス名を指定
    const tags = await page.locator('.style-1ij24kf').allTextContents();
    optionalTags = [...optionalTags, ...tags];
    await page.close();
  }

  // データのURLが特定のURLであれば、タグを追加する
  const addedtags = addSpecifiedTagFromURL(tags, resourceData);
  const concatTags = [...resourceData.tag, ...addedtags, ...stringMorphologicalAnalysisTags, ...optionalTags];
  const stringTags = concatTags.filter((item): item is string => typeof item == 'string');
  const uniqueTags = [...new Set(stringTags)];
  return uniqueTags;
};

const getData = async (context: BrowserContext, resourceData: ResourceData) => {
  if (resourceData.tag.length > 0) return resourceData;
  console.log('description: ', resourceData.description.toLowerCase());

  try {
    const tags = await generateTags(context, resourceData);
    resourceData.tag = tags;
    console.log('tag: ', resourceData.tag);
    return resourceData;
  } catch (error) {
    console.log(resourceData.url);
    console.error(error);
  }
};

// 非同期通信で反復処理をする
const getMorphologicalAnalysisByNoun = (context: BrowserContext, resource: ResourceData[]) => {
  console.log('getMorphologicalAnalysisByNoun');
  return resource.map((resourceData) => {
    if (resourceData.tag.length > 0) return resourceData;
    return getData(context, resourceData);
  });
};

void (async () => {
  const { browser, context } = await createChromiumBrowserAndContext();

  const newResourceData: (ResourceData | undefined)[] = await Promise.all(
    getMorphologicalAnalysisByNoun(context, data.resource)
  );
  const tagAddedResourceData = newResourceData.filter((tag): tag is ResourceData => typeof tag == 'object');

  newDBObj.resource = tagAddedResourceData;

  const newJsonData = JSON.stringify(newDBObj);

  jsonFileExchange({
    exportDataJsonPath: dbTmpJsonPath,
    originDataJsonPath: originDataJsonPath,
    jsonData: newJsonData,
  });

  await browser.close();
})();

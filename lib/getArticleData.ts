import { BrowserContext } from 'playwright';

import { originDataJsonPath, addedOriginDataJsonPath } from '@/lib/Const';
import { generateUniqueURLList } from '@/lib/generateUniqueURLList';
import { createChromiumBrowserAndContext } from '@/lib/playwright';
import { translateToEn, translateToJa } from '@/lib/translateApi';
// import { translator } from '@/lib/translator';
import {
  connectLowercaseAlphabetDigitsHyphenatedString,
  jsonFileExchange,
  readFileSync,
  splitUrlData,
} from '@/lib/utils';

import { ResourceData, JsonData } from '@/types/data';

const generateTwitterTitle = (url: string) => {
  const newUrlParts = url.replace('https://twitter.com/', '').toLowerCase().split('/');
  return `twitter-${newUrlParts[0]}-${newUrlParts[newUrlParts.length - 1]}`;
};

const generateTitle = async (url: string, title: string) => {
  const isTwitter = /twitter.com/.test(url);

  if (isTwitter) return generateTwitterTitle(url);

  try {
    const enTitle = await translateToEn(title);
    // const enTitle = await translator(title, 'en', 'auto');
    if (!enTitle) return undefined;
    return connectLowercaseAlphabetDigitsHyphenatedString(enTitle);
  } catch (error) {
    console.log(title);
    console.error(error);
  }
};

const generateDescription = async (url: string, metaDescription: string) => {
  try {
    let enDescription: string | undefined = '';
    if (!metaDescription.length) return undefined;

    enDescription = await translateToJa(metaDescription);
    // enDescription = await translator(metaDescription, 'ja', 'auto');

    if (!enDescription) return undefined;

    const isTwitter = /twitter.com/.test(url);

    if (isTwitter) {
      const clippingPoint = ' on Twitter: ';
      enDescription = enDescription.replace(' / Twitter', '');
      enDescription = enDescription.substring(enDescription.indexOf(clippingPoint) + clippingPoint.length);
    }

    return enDescription;
  } catch (error) {
    console.log(metaDescription);
    console.error(error);
  }
};

// playwrightを使って、必要なデータを取得する
const getData = async (context: BrowserContext, url: string) => {
  try {
    // urlをもとに取得するpageの初期化
    const page = await context.newPage();
    await page.goto(url);

    // page内のtitle、meta descriptionを取得
    const pageTitle = await page.title();
    // const metaDescription = await getMetaDescription(page);

    console.log('pageTitle', pageTitle);

    // データ格納用にtitle、meta descriptionを整形する
    const title = await generateTitle(url, pageTitle);
    const description = await generateDescription(url, pageTitle);

    if (!title || !title.length || !description || !description.length) {
      await page.close();
      return undefined;
    }

    const dbObject = {
      name: title,
      url,
      description: description,
      tag: [],
    };
    await page.close();
    return dbObject;
  } catch (error) {
    console.log(url);
    console.error(error);
  }
};

// 非同期通信で反復処理をする
const getDataPromises = (context: BrowserContext, urls: string[]) => urls.map((line) => getData(context, line));

(async () => {
  const urls = splitUrlData();
  if (!urls.length) return;

  let originData = JSON.parse(readFileSync(originDataJsonPath)) as JsonData;
  let uniqueUrlList = generateUniqueURLList(originData.resource, urls);
  console.log('取得するUrlリスト');
  console.log(uniqueUrlList);
  if (!uniqueUrlList.length) return console.log('重複したURLのみ含まれています!');

  const { browser, context } = await createChromiumBrowserAndContext();

  while (uniqueUrlList.length > 0) {
    const newResourceData: (ResourceData | undefined)[] = await Promise.all(getDataPromises(context, uniqueUrlList));

    const resourceData = newResourceData.filter((tag): tag is ResourceData => typeof tag == 'object');

    if (resourceData.length) {
      originData.resource = [...originData.resource, ...resourceData];
    }

    uniqueUrlList = generateUniqueURLList(originData.resource, urls);
    console.log('再度取得を試みるUrlリスト');
    console.log(uniqueUrlList);
  }
  const newJsonData = JSON.stringify(originData);

  jsonFileExchange({
    exportDataJsonPath: addedOriginDataJsonPath,
    originDataJsonPath,
    jsonData: newJsonData,
  });
  await browser.close();
})();

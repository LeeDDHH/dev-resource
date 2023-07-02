import { BrowserContext } from 'playwright';

import { ResourceData, JsonData } from '../types/data';

import { originDataJsonPath, addedOriginDataJsonPath } from './Const';
import { generateUniqueURLList } from './generateUniqueURLList';
import { createChromiumBrowserAndContext } from './playwright';
import { translateToEn, translateToJa } from './translateApi';
import { connectLowercaseAlphabetDigitsHyphenatedString, jsonFileExchange, readFileSync, splitUrlData } from './utils';

const generateTitle = async (title: string) => {
  const enTitle = await translateToEn(title);
  return connectLowercaseAlphabetDigitsHyphenatedString(enTitle);
};

const generateDescription = async (metaDescription: string) => {
  let enDescription = '';
  if (metaDescription.length > 0) enDescription = await translateToJa(metaDescription);
  return enDescription;
};

// playwrightを使って、必要なデータを取得する
const getData = async (context: BrowserContext, url: string) => {
  // urlをもとに取得するpageの初期化
  const page = await context.newPage();
  await page.goto(url);

  // page内のtitle、meta descriptionを取得
  const pageTitle = await page.title();
  // const metaDescription = await getMetaDescription(page);

  // データ格納用にtitle、meta descriptionを整形する
  const title = await generateTitle(pageTitle);
  const description = await generateDescription(pageTitle);

  const dbObject = {
    name: title,
    url,
    description,
    tag: [],
  };
  await page.close();
  return dbObject;
};

// 非同期通信で反復処理をする
const getDataPromises = (context: BrowserContext, urls: string[]) => urls.map((line) => getData(context, line));

(async () => {
  const urls = splitUrlData();
  if (!urls.length) return;

  const originData = JSON.parse(readFileSync(originDataJsonPath)) as JsonData;
  const uniqueUrlList = generateUniqueURLList(originData.resource, urls);
  if (!uniqueUrlList.length) return;

  const { browser, context } = await createChromiumBrowserAndContext();

  const newResourceData: ResourceData[] = await Promise.all(getDataPromises(context, urls));

  await browser.close();

  originData.resource = [...originData.resource, ...newResourceData];

  const newJsonData = JSON.stringify(originData);

  jsonFileExchange({
    exportDataJsonPath: addedOriginDataJsonPath,
    originDataJsonPath,
    jsonData: newJsonData,
  });
})();

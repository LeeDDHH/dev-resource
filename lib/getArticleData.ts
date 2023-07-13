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

const generateTitle = async (title: string) => {
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

const generateDescription = async (metaDescription: string) => {
  try {
    let enDescription: string | undefined = '';
    if (!metaDescription.length) return undefined;

    enDescription = await translateToJa(metaDescription);
    // enDescription = await translator(metaDescription, 'ja', 'auto');

    if (!enDescription) return undefined;

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

    // データ格納用にtitle、meta descriptionを整形する
    const title = await generateTitle(pageTitle);
    const description = await generateDescription(pageTitle);

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

  const originData = JSON.parse(readFileSync(originDataJsonPath)) as JsonData;
  const uniqueUrlList = generateUniqueURLList(originData.resource, urls);
  if (!uniqueUrlList.length) return console.log('重複したURLのみ含まれています!');

  const { browser, context } = await createChromiumBrowserAndContext();

  try {
    const newResourceData: (ResourceData | undefined)[] = await Promise.all(getDataPromises(context, uniqueUrlList));
    await browser.close();

    const resourceData = newResourceData.filter((tag): tag is ResourceData => typeof tag == 'object');

    if (!resourceData.length) return;

    originData.resource = [...originData.resource, ...resourceData];

    const newJsonData = JSON.stringify(originData);

    jsonFileExchange({
      exportDataJsonPath: addedOriginDataJsonPath,
      originDataJsonPath,
      jsonData: newJsonData,
    });
  } catch (error) {
    console.log('failed to get resource');
    console.error(error);
    return;
  }
})();

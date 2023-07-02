import { BrowserContext } from 'playwright';

import { ResourceData, JsonData } from '../types/data';

import { originDataJsonPath } from './Const';
import { generateUniqueURLList } from './generateUniqueURLList';
import { createChromiumBrowserAndContext, takeScreenshot } from './playwright';
import { readFileSync, splitUrlData } from './utils';

const getData = async (context: BrowserContext, data: ResourceData) => {
  // urlをもとに取得するpageの初期化
  const page = await context.newPage();
  await page.setViewportSize({ width: 1124, height: 600 });
  await page.goto(data.url);
  await page.waitForLoadState();

  await takeScreenshot(page, data);

  await page.close();
};

const getDataPromises = (context: BrowserContext, newData: ResourceData[]) =>
  newData.map((targetData) => getData(context, targetData));

(async () => {
  const urls = splitUrlData();
  if (!urls.length) return;

  const data = JSON.parse(readFileSync(originDataJsonPath)) as JsonData;
  const uniqueUrlList = generateUniqueURLList(data.resource, urls);
  if (!uniqueUrlList.length) return;

  const newData = data.resource.reverse().slice(0, urls.length).reverse();

  const { browser, context } = await createChromiumBrowserAndContext(false);

  await Promise.all(getDataPromises(context, newData));

  await browser.close();
})();

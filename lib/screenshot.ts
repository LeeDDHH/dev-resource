import { BrowserContext } from 'playwright';

import { originDataJsonPath } from '@/lib/Const';
import { createChromiumBrowserAndContext, takeScreenshot } from '@/lib/playwright';
import { readFileSync, splitUrlData } from '@/lib/utils';

import { ResourceData, JsonData } from '@/types/data';

const getData = async (context: BrowserContext, data: ResourceData) => {
  try {
    // urlをもとに取得するpageの初期化
    const page = await context.newPage();
    await page.setViewportSize({ width: 1124, height: 600 });
    await page.goto(data.url);
    await page.waitForLoadState();

    await takeScreenshot(page, data);

    await page.close();
  } catch (error) {
    console.log(data.url);
    console.error(error);
  }
};

const getDataPromises = (context: BrowserContext, newData: ResourceData[]) =>
  newData.map((targetData) => getData(context, targetData));

(async () => {
  const urls = splitUrlData();
  if (!urls.length) return;

  const data = JSON.parse(readFileSync(originDataJsonPath)) as JsonData;

  const newData = data.resource.reverse().slice(0, urls.length).reverse();

  const { browser, context } = await createChromiumBrowserAndContext(false);

  await Promise.all(getDataPromises(context, newData));

  await browser.close();
})();

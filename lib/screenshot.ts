import { BrowserContext } from 'playwright';

import { originDataJsonPath } from '@/lib/Const';
import { createChromiumBrowserAndContext, takeScreenshot } from '@/lib/playwright';
import { readFileSync, splitUrlData } from '@/lib/utils';

import { ResourceData, JsonData } from '@/types/data';

type ScreenshotLoopData = {
  chromiumContext: BrowserContext;
  urls: string[];
  resourceData: ResourceData[];
};

const getData = async (context: BrowserContext, data: ResourceData) => {
  // urlをもとに取得するpageの初期化
  const page = await context.newPage();
  try {
    await page.setViewportSize({ width: 1124, height: 600 });
    await page.goto(data.url);
    await page.waitForLoadState();

    await takeScreenshot(page, data);
    console.log(`スクショを取得しました:${data.url}`);

    return undefined;
  } catch (error) {
    console.log(`スクショを取得できませんでした:${data.url}`);
    console.error(error);
    return data.url;
  } finally {
    await page.close();
  }
};

const getDataPromises = (context: BrowserContext, newData: ResourceData[]) =>
  newData.map((targetData) => getData(context, targetData));

/**
 * 指定されたUrlとリソースデータをもとにスクショを撮る
 * @param chromiumContext PlaywrightのChromiumコンテキスト
 * @param urls Urlリスト
 * @param resourceData リソースデータ
 * @returns { retryScreenshotUrlList, uniqueUrlObjList }
 * retryScreenshotUrlList: スクショ撮りに失敗したURLリスト
 * uniqueUrlObjList: スクショ撮り時のリソースデータ
 */
const getScreenshotFromSpecifiedUrlsAndResourceData = async ({
  chromiumContext,
  urls,
  resourceData,
}: ScreenshotLoopData) => {
  const resourceOnlymatchedUrls = urls.map((url) => resourceData.find((data) => data.url === url));
  const uniqueUrlObjList = resourceOnlymatchedUrls.filter((res): res is ResourceData => typeof res == 'object');

  if (!uniqueUrlObjList.length) {
    console.log('スクショ撮る必要がない');
    return { retryScreenshotUrlList: [], uniqueUrlObjList: [] };
  }

  const failedScreenshotUrlList = await Promise.all(getDataPromises(chromiumContext, uniqueUrlObjList));
  const retryScreenshotUrlList = failedScreenshotUrlList.filter((item): item is string => typeof item == 'string');

  if (!retryScreenshotUrlList.length) {
    console.log('スクショ撮り終えた');
    return { retryScreenshotUrlList: [], uniqueUrlObjList: [] };
  } else {
    console.log('スクショを撮る必要があるUrlリスト');
    console.log(retryScreenshotUrlList);
  }

  return { retryScreenshotUrlList, uniqueUrlObjList };
};

void (async () => {
  let uniqueUrlObjList: ResourceData[];
  let urls = splitUrlData();
  if (!urls.length) return;

  const data = JSON.parse(readFileSync(originDataJsonPath)) as JsonData;

  const resourceData = data.resource.reverse();

  const { browser, context } = await createChromiumBrowserAndContext(false);

  const result = await getScreenshotFromSpecifiedUrlsAndResourceData({
    chromiumContext: context,
    urls,
    resourceData,
  });
  urls = result.retryScreenshotUrlList;
  uniqueUrlObjList = result.uniqueUrlObjList;

  /**
   * スクショ取得に失敗したURLがあれば、撮りなおす
   */
  while (urls.length > 0) {
    const result = await getScreenshotFromSpecifiedUrlsAndResourceData({
      chromiumContext: context,
      urls,
      resourceData: uniqueUrlObjList,
    });
    urls = result.retryScreenshotUrlList;
    uniqueUrlObjList = result.uniqueUrlObjList;
  }

  await browser.close();
})();

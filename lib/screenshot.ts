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
  try {
    // urlをもとに取得するpageの初期化
    const page = await context.newPage();
    await page.setViewportSize({ width: 1124, height: 600 });
    await page.goto(data.url);
    await page.waitForLoadState();

    await takeScreenshot(page, data);
    console.log(`スクショを取得しました:${data.url}`);

    await page.close();
    return undefined;
  } catch (error) {
    console.log(`スクショを取得できませんでした:${data.url}`);
    console.error(error);
    return data.url;
  }
};

const getDataPromises = (context: BrowserContext, newData: ResourceData[]) =>
  newData.map((targetData) => getData(context, targetData));

const getScreenshotFromSpecifiedUrlsAndResourceData = async ({
  chromiumContext,
  urls,
  resourceData,
}: ScreenshotLoopData) => {
  const resourceOnlymatchedUrls = urls.map((url) => {
    return resourceData.find((data) => data.url === url);
  });

  const uniqueUrlObjList = resourceOnlymatchedUrls.filter((res): res is ResourceData => typeof res == 'object');
  if (!uniqueUrlObjList.length) {
    console.log('スクショ撮る必要がない');
    return [];
  }

  const failedScreenshotUrlList = await Promise.all(getDataPromises(chromiumContext, uniqueUrlObjList));

  const retryScreenshotUrlList = failedScreenshotUrlList.filter((item): item is string => typeof item == 'string');
  if (!retryScreenshotUrlList.length) {
    console.log('スクショ撮り終えた');
    return [];
  }
  urls = retryScreenshotUrlList;
  return urls;
};

(async () => {
  let resourceOnlymatchedUrls: (ResourceData | undefined)[];
  let uniqueUrlObjList: ResourceData[];
  let failedScreenshotUrlList: (string | undefined)[];
  let retryScreenshotUrlList: string[];

  let urls = splitUrlData();
  if (!urls.length) return;

  const data = JSON.parse(readFileSync(originDataJsonPath)) as JsonData;

  const resourceData = data.resource.reverse();

  resourceOnlymatchedUrls = urls.map((url) => {
    return resourceData.find((data) => data.url === url);
  });

  uniqueUrlObjList = resourceOnlymatchedUrls.filter((res): res is ResourceData => typeof res == 'object');
  if (!uniqueUrlObjList.length) return console.log('スクショ撮る必要がない');

  const { browser, context } = await createChromiumBrowserAndContext(false);

  // failedScreenshotUrlList = await Promise.all(getDataPromises(context, uniqueUrlObjList));

  // retryScreenshotUrlList = failedScreenshotUrlList.filter((item): item is string => typeof item == 'string');
  // if (!retryScreenshotUrlList.length) return console.log('スクショ撮り終えた');
  // urls = retryScreenshotUrlList;

  retryScreenshotUrlList = await getScreenshotFromSpecifiedUrlsAndResourceData({
    chromiumContext: context,
    urls,
    resourceData: uniqueUrlObjList,
  });

  /**
   * スクショ取得に失敗したURLがあれば、撮りなおす
   */
  while (urls.length > 0) {
    retryScreenshotUrlList = await getScreenshotFromSpecifiedUrlsAndResourceData({
      chromiumContext: context,
      urls,
      resourceData: uniqueUrlObjList,
    });
    urls = retryScreenshotUrlList;
    // resourceOnlymatchedUrls = urls.map((url) => {
    //   return uniqueUrlObjList.find((data) => data.url === url);
    // });
    // uniqueUrlObjList = resourceOnlymatchedUrls.filter((res): res is ResourceData => typeof res == 'object');
    // if (uniqueUrlObjList.length > 0) {
    //   const failedScreenshotUrlList = await Promise.all(getDataPromises(context, uniqueUrlObjList));
    //   retryScreenshotUrlList = failedScreenshotUrlList.filter((item): item is string => typeof item == 'string');

    //   if (!retryScreenshotUrlList.length) {
    //     console.log('スクショ取る必要がない');
    //     urls = [];
    //   } else {
    //     urls = retryScreenshotUrlList;
    //   }
    // } else {
    //   console.log('スクショ取る必要がない');
    //   urls = [];
    // }
  }

  await browser.close();
})();

import { Browser, BrowserContext, Page, chromium } from 'playwright';

import { ResourceData } from '../types/data';

// playwrightでchromiumブラウザとブラウザのコンテキストを返す
export const createChromiumBrowserAndContext = async (
  isHeadless: boolean = true
): Promise<{
  browser: Browser;
  context: BrowserContext;
}> => {
  const browser = await chromium.launch({ headless: isHeadless });
  const context = await browser.newContext();

  return { browser, context };
};

// metaタグのdescriptionを取得する
export const getMetaDescription = async (page: Page) => {
  let metaDescription = '';
  try {
    metaDescription = await page.$eval('meta[name="description"]', (element: HTMLMetaElement) => element.content);
  } catch (error) {
    // エラーハンドリング: データが得られなかった場合の処理
    console.error('Error occurred while retrieving meta description:', error);
  }
  return metaDescription;
};

export const takeScreenshot = async (page: Page, data: ResourceData, x = 0, y = 0, width = 1124, height = 600) => {
  return await page.screenshot({
    path: `screenshots/${data.name}.png`,
    fullPage: true,
    clip: {
      x,
      y,
      width,
      height,
    },
  });
};

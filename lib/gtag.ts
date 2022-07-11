"use strict";

import { GA_TRACKING_ID } from "./Const";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  const configParams: Gtag.ConfigParams = {
    page_path: url,
  };
  window.gtag("config", GA_TRACKING_ID as string, configParams);
};

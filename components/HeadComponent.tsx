"use strict";

import { NextSeo } from "next-seo";
import React from "react";

const HeadComponent = React.memo(() => {
  return (
    <NextSeo
      title="Resource of Develop"
      description="開発やプログラミング勉強に役立つリソースが見つかるサービス"
      canonical="https://rod.expfrom.me/"
      openGraph={{
        locale: "ja_JP",
        type: "website",
        title: "Resource of Develop",
        description: "開発やプログラミング勉強に役立つリソースが見つかるサービス",
        url: "https://rod.expfrom.me/",
        site_name: "Resource of Develop",
        images: [
          {
            url: "https://rod.expfrom.me/images/og/ogp_image.png",
            width: 1300,
            height: 620,
            alt: "Og Image Alt RoD",
          },
        ],
      }}
      twitter={{
        handle: "@camomile_cafe",
        site: "@camomile_cafe",
        cardType: "summary_large_image",
      }}
      additionalMetaTags={[
        {
          name: "mobile-web-app-capable",
          content: "yes",
        },
        {
          name: "apple-mobile-web-app-capable",
          content: "yes",
        },
        {
          name: "application-name",
          content: "RoD",
        },
        {
          name: "apple-mobile-web-app-title",
          content: "RoD",
        },
        {
          name: "msapplication-starturl",
          content: "/",
        },
      ]}
      additionalLinkTags={[
        {
          rel: "icon",
          href: "/favicon.ico",
        },
        {
          rel: "apple-touch-icon",
          href: "/apple-touch-icon.png",
          sizes: "180x180",
        },
        {
          rel: "manifest",
          href: "/manifest.json",
        },
      ]}
    />
  );
});

HeadComponent.displayName = "HeadComponent";
export default HeadComponent;

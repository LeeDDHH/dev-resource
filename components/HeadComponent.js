import { NextSeo } from 'next-seo'

const HeadComponent = () => {
  return (
    <NextSeo
      title="Resource of Develop"
      description="開発やプログラミング勉強に役立つリソースが見つかるサービス"
      canonical="https://rod.expfrom.me/"
      openGraph={{
        url: 'https://rod.expfrom.me/',
        title: 'Resource of Develop',
        description: '開発やプログラミング勉強に役立つリソースが見つかるサービス',
        images: [
          { url: 'https://rod.expfrom.me/images/og/ogp_image.png' }
        ],
        site_name: 'Resource of Develop'
      }}
      twitter={{
        handle: '@camomile_cafe',
        site: '@camomile_cafe',
        cardType: 'summary_large_image'
      }}
      additionalMetaTags={[
        {
          name: 'mobile-web-app-capable',
          content: 'yes'
        },
        {
          name: 'apple-mobile-web-app-capable',
          content: 'yes'
        },
        {
          name: 'application-name',
          content: 'RoD'
        },
        {
          name: 'apple-mobile-web-app-title',
          content: 'RoD'
        },
        {
          name: 'msapplication-starturl',
          content: '/'
        }
      ]}
      additionalLinkTags={[
        {
          rel: 'icon',
          href: '/favicon.ico',
        },
        {
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon.png',
          sizes: '180x180'
        },
        {
          rel: 'manifest',
          href: '/manifest.json'
        }
      ]}
    />
  )
}

export default HeadComponent

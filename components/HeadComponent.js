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
          { url: '/images/og/ogp_image.png' }
        ],
        site_name: 'Resource of Develop'
      }}
      twitter={{
        handle: '@camomile_cafe',
        site: '@camomile_cafe',
        cardType: 'summary_large_image'
      }}
      additionalLinkTags={[
        {
          rel: 'icon',
          href: '/favicon.ico',
        },
        {
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon.jpg',
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

'use strict';

import React, { useEffect, ReactElement, ReactNode } from 'react';

import { ApolloProvider } from '@apollo/client';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import client from '@/lib/apollo/apollo-client';
import { pageview } from '@/lib/gtag';

import type { NextPage } from 'next';

import '@/styles/global.css';

export type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<P, IP> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getLayout?: (page: ReactElement, props?: any) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const Provider = React.memo(({ Component, pageProps }: AppPropsWithLayout) => {
  const router = useRouter();
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    const handleRouteChange = (url: string, { shallow }: { shallow: boolean }) => {
      pageview(url);
      if (!shallow) {
        pageview(url);
      }
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return <ApolloProvider client={client}>{getLayout(<Component {...pageProps} />, pageProps)}</ApolloProvider>;
});
if (process.env.NODE_ENV !== 'production') Provider.displayName = 'Provider';
export default Provider;

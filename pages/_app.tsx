'use strict';

// import { ApolloProvider } from '@apollo/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect, ReactElement, ReactNode } from 'react';

// import client from '@/lib/apollo/apollo-client';
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

const queryClient = new QueryClient();

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

  return (
    // <ApolloProvider client={client}>
    <QueryClientProvider client={queryClient}>{getLayout(<Component {...pageProps} />, pageProps)}</QueryClientProvider>
    // </ApolloProvider>
  );
});
if (process.env.NODE_ENV !== 'production') Provider.displayName = 'Provider';
export default Provider;

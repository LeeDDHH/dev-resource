'use strict';

import React, { useEffect, useMemo } from 'react';

import { ApolloProvider } from '@apollo/client';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import Layout from '@/components/layout/Layout';

import client from '@/lib/apollo/apollo-client';
import { pageview } from '@/lib/gtag';

import '@/styles/global.css';

const Provider = React.memo(({ Component, pageProps }: AppProps) => {
  const router = useRouter();
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
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
});
if (process.env.NODE_ENV !== 'production') Provider.displayName = 'Provider';
export default Provider;

"use strict";

import React, { useEffect } from "react";
import { AppProps } from "next/app";
import { useRouter } from "next/router";

import { ApolloProvider } from "@apollo/client";
import client from "../lib/apollo-client";

import { pageview } from "../lib/gtag";

import "../styles/app.css";

const Provider = React.memo(({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string, { shallow }: { shallow: boolean }) => {
      pageview(url);
      if (!shallow) {
        pageview(url);
      }
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
});
if (process.env.NODE_ENV !== "production") Provider.displayName = "Provider";
export default Provider;

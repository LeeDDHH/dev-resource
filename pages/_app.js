import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { ApolloProvider } from "@apollo/client";
import client from "../lib/apollo-client";

import { pageview } from '../lib/gtag'

import '../styles/app.css'

const Provider = ({ Component, pageProps }) => {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      pageview(url)
      if (!shallow) { gtag.pageview(url) }
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
export default Provider

import { useEffect } from 'react'
import App from 'next/app'
import { useRouter } from 'next/router'

import basicAuthCheck from '../src/utils/basicAuthCheck'

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

Provider.getInitialProps = async (appContext) => {
  const { req, res } = appContext.ctx
  if (req && res) {
  // if (req && res && process.env.ENABLE_BASIC_AUTH === 'true') {
    await basicAuthCheck(req, res)
  }

  const appProps = await App.getInitialProps(appContext)
  return { ...appProps }
}

export default Provider

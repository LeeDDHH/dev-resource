import Head from 'next/head'
import { useRouter } from 'next/router'

import ReactGA from 'react-ga'

import { GA_TRACKING_ID, NODE_ENV } from '../lib/Const'

const initializeGa = () => {
  const gaOptions =
    NODE_ENV === "development"
      ? { titleCase: false, debug: true, testMode: true }
      : { titleCase: false };
  ReactGA.initialize(GA_TRACKING_ID, gaOptions)
}

const sendGaPageView = (path) => {
  initializeGa()
  ReactGA.pageview(path)
}

const HeadComponent = () => {
  const router = useRouter()
  sendGaPageView(router.asPath)
  
  return (
    <Head>
      <title>Resource-of-Develop</title>
    </Head>
  )
}

export default HeadComponent

import { ApolloProvider } from "@apollo/client";
import client from "../lib/apollo-client";

import '../styles/app.css'

const Provider = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
export default Provider

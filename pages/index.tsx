"use strict";

import React, { useState, useMemo } from "react";

import HeadComponent from "../components/HeadComponent";

import SearchBox from "../components/SearchBox";
import DefaultResult from "../components/DefaultResult";
import SearchedResult from "../components/SearchedResult";

import styles from "../styles/App.module.css";

const App = React.memo(({ itemsAmount }: AppProps) => {
  const [searchText, setSearchText] = useState("");

  const renderView = useMemo(() => {
    if (searchText.length > 0) {
      return <SearchedResult searchText={searchText} />;
    }
    if (searchText.length <= 0) {
      return <DefaultResult />;
    }
  }, [searchText]);

  return (
    <div>
      <header>
        <HeadComponent />
        <div className={styles.headerContainer}>
          <div className={styles.amount}>
            開発やプログラミング勉強に役立つ
            <strong>{itemsAmount}</strong>
            個のリソース
          </div>
        </div>
      </header>
      <div className={styles.container}>
        <SearchBox value={searchText} changeSearchText={setSearchText} />
        {renderView}
      </div>
    </div>
  );
});

if (process.env.NODE_ENV !== "production") App.displayName = "App";
export default App;

export const getStaticProps = async () => {
  const result = (require("../lib/db.json").resource as Resource).length;

  return {
    props: {
      itemsAmount: result,
    },
  };
};

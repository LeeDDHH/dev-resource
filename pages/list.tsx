"use strict";

import React, { useMemo } from "react";

import Layout from "../components/layout/Layout";

import DefaultResult from "../components/DefaultResult";

import styles from "../styles/App.module.css";

const List = React.memo(({ itemsAmount }: AppProps) => {
  const renderView = useMemo(() => <DefaultResult />, []);

  return (
    <Layout itemsAmount={itemsAmount}>
      <div className={styles.container}>{renderView}</div>
    </Layout>
  );
});

if (process.env.NODE_ENV !== "production") List.displayName = "List";
export default List;

export const getStaticProps = async () => {
  const result = (require("../lib/db.json").resource as Resource).length;

  return {
    props: {
      itemsAmount: result,
    },
  };
};

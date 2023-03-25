'use strict';

import React, { useState, useMemo } from 'react';

import Layout from '@/components/layout/Layout';
import SearchBox from '@/components/SearchBox';
import SearchedResult from '@/components/SearchedResult';

import styles from '@/styles/App.module.css';

const App = React.memo(({ itemsAmount }: AppProps) => {
  const [inputText, setInputText] = useState('');
  const [searchText, setSearchText] = useState('');

  const handleOnclick = () => {
    setSearchText(inputText);
  };

  const renderView = useMemo(() => {
    if (searchText.length > 0) {
      return <SearchedResult searchText={searchText} />;
    }
    return null;
  }, [searchText]);

  return (
    <Layout itemsAmount={itemsAmount}>
      <div className={styles.container}>
        <SearchBox value={inputText} changeSearchText={setInputText} searchTextHandler={handleOnclick} />
        {renderView}
      </div>
    </Layout>
  );
});

if (process.env.NODE_ENV !== 'production') App.displayName = 'App';
export default App;

export const getStaticProps = async () => {
  const result = (require('../lib/db.json').resource as Resource).length;

  return {
    props: {
      itemsAmount: result,
    },
  };
};

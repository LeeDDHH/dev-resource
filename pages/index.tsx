'use strict';

import React, { useState, useMemo, useEffect } from 'react';

import { useRouter } from 'next/router';

import Layout from '@/components/layout/Layout';
import SearchBox from '@/components/SearchBox';
import SearchedResult from '@/components/SearchedResult';

import { updateQuery } from '@/lib/updateQuery';

import styles from '@/styles/App.module.css';

const App = React.memo(({ itemsAmount }: AppProps) => {
  const router = useRouter();
  const { keyword } = router.query;
  const [inputText, setInputText] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (router.isReady) {
      const keywords = Array.isArray(keyword) ? keyword.join(' ') : keyword || '';
      setInputText(keywords);
      setSearchText(keywords);
    }
  }, [router.isReady, keyword]);

  useEffect(() => {
    if (searchText.length) {
      updateQuery({ url: '/', query: { keyword: searchText } });
    }
  }, [searchText]);

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
  const result = (require('@/data/db.json').resource as Resource).length;

  return {
    props: {
      itemsAmount: result,
    },
  };
};

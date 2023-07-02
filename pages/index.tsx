'use strict';

import React, { useState, useMemo, useEffect } from 'react';

import { useRouter } from 'next/router';

import Layout from '@/components/layout/Layout';
import SearchBox from '@/components/SearchBox';
import SearchedResult from '@/components/SearchedResult';

import { updateQuery } from '@/lib/updateQuery';

const App = React.memo(({ itemsAmount }: AppProps) => {
  const router = useRouter();
  const { keyword } = router.query;
  const [inputText, setInputText] = useState('');
  const [searchText, setSearchText] = useState('');

  const keywords = useMemo(() => (Array.isArray(keyword) ? keyword.join(' ') : keyword || ''), [keyword]);

  // 初期化ときのみ、URLクエリのkeywordをstate管理する用に更新をする
  useEffect(() => {
    if (router.isReady) {
      if (inputText === keywords || searchText === keywords) return;
      setInputText(keywords);
      setSearchText(keywords);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywords, router.isReady]);

  const handleSearchText = () => {
    if (inputText === keywords) return;
    setSearchText(inputText);
    if (inputText.length) return updateQuery({ url: '/', query: { keyword: inputText } });
    return router.push('/');
  };

  const renderView = useMemo(() => {
    if (searchText.length > 0) {
      return <SearchedResult searchText={searchText} />;
    }
    return null;
  }, [searchText]);

  return (
    <Layout itemsAmount={itemsAmount}>
      <div className='m-auto mb-32 mt-5 max-w-6xl'>
        <SearchBox value={inputText} changeSearchText={setInputText} searchTextHandler={handleSearchText} />
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

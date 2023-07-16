/* eslint-disable @typescript-eslint/no-misused-promises */
'use strict';

import { useRouter } from 'next/router';
import React, { useState, useMemo, useEffect } from 'react';

import { SearchBox } from '@/components/common/stateless/SearchBox';
import { SearchedResult } from '@/components/parts/stateless/SearchedResult';

import { updateQuery } from '@/lib/updateQuery';

export const IndexPage = React.memo(() => {
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
    <div className='m-auto mb-32 mt-5 max-w-6xl'>
      <SearchBox value={inputText} changeSearchText={setInputText} searchTextHandler={handleSearchText} />
      {renderView}
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') IndexPage.displayName = 'IndexPage';

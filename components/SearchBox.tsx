'use strict';

import React from 'react';

import { BiSearchAlt2 } from 'react-icons/bi';

import { handleEnterInputEvent } from '@/lib/keyboardEvents';

import styles from '@/styles/SearchBox.module.css';

type Props = {
  value: string;
  changeSearchText: SetStateActionDispatcher<string>;
  searchTextHandler: () => void;
};

const SearchBox = React.memo(({ value, changeSearchText, searchTextHandler }: Props) => {
  return (
    <div className={styles.searchBox} role='tablist'>
      <input
        id='searchText'
        className={styles.searchInput}
        type='text'
        name='searchText'
        value={value}
        onChange={(e) => changeSearchText(e.target.value)}
        onKeyDown={(e) => handleEnterInputEvent(e, searchTextHandler)}
      />
      <button onClick={searchTextHandler}>
        <BiSearchAlt2 size='3rem' />
      </button>
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') SearchBox.displayName = 'SearchBox';
export default SearchBox;

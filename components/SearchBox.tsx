'use strict';

import React from 'react';

import { BiSearchAlt2 } from 'react-icons/bi';

import { handleEnterInputEvent } from '@/lib/keyboardEvents';

type Props = {
  value: string;
  changeSearchText: SetStateActionDispatcher<string>;
  searchTextHandler: () => void;
};

const SearchBox = React.memo(({ value, changeSearchText, searchTextHandler }: Props) => {
  return (
    <div className='m-auto flex h-14 w-11/12 text-gray-900' role='tablist'>
      <input
        id='searchText'
        className='w-full rounded-xl indent-2 text-5xl font-medium'
        type='text'
        name='searchText'
        value={value}
        onChange={(e) => changeSearchText(e.target.value)}
        onKeyDown={(e) => handleEnterInputEvent(e, searchTextHandler)}
      />
      <button
        className='flex h-14 w-16
      items-center justify-center rounded-2xl
      border-2 border-solid border-rod-gray-500
      bg-rod-gray-800 text-rod-yellow-300
      hover:bg-rod-yellow-300 hover:text-rod-gray-800
      '
        onClick={searchTextHandler}
      >
        <BiSearchAlt2 size='3rem' />
      </button>
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') SearchBox.displayName = 'SearchBox';
export default SearchBox;

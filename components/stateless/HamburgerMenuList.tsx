'use strict';

import React from 'react';

import LinkList from '@/components/stateless/LinkList';

const HamburgerMenuList = React.memo(() => (
  <ul className='absolute right-0 top-10 z-10 flex min-h-fit w-full min-w-full flex-col gap-3 border-l-2 bg-rod-gray-800 text-center'>
    <LinkList />
  </ul>
));

if (process.env.NODE_ENV !== 'production') HamburgerMenuList.displayName = 'HamburgerMenuList';
export default HamburgerMenuList;

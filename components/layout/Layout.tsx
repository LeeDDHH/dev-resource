'use strict';

import React, { useState, useEffect, useCallback } from 'react';

import HeadComponent from '@/components/HeadComponent';
import { LinkList } from '@/components/stateless/LinkList';
import { MobileHamburgerMenu } from '@/components/stateless/MobileHamburgerMenu';

import useMediaQuery from '@/hooks/useMediaQuery';

type Props = {
  itemsAmount: number;
  children: React.ReactNode;
};

const Layout = React.memo(({ itemsAmount, children }: Props) => {
  const [openMenu, setOpenMenu] = useState(false);
  const isMaxWidthMd = useMediaQuery('(max-width: 767px)');

  const menuToggle = useCallback(() => setOpenMenu(!openMenu), [openMenu]);

  useEffect(() => {
    if (!isMaxWidthMd) setOpenMenu(false);
  }, [isMaxWidthMd]);

  return (
    <div>
      <header>
        <HeadComponent />
        <div className='flex h-10 w-full justify-center'>
          <div className='flex items-center'>
            開発や学習に役立つ
            <strong> {itemsAmount}</strong>
            個のリソース
          </div>
          <nav>
            {/* SP用ハンバーガーメニュー */}
            <MobileHamburgerMenu menuToggle={menuToggle} openMenu={openMenu} />
            {/* PC用navメニュー */}
            <ul className='hidden h-full md:ml-4 md:flex md:items-center md:gap-1'>
              <LinkList />
            </ul>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') Layout.displayName = 'Layout';

export default Layout;

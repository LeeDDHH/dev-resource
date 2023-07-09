'use strict';

import React from 'react';

import { HamburgerMenuList } from '@/components/parts/stateless/HamburgerMenuList';

type Props = {
  /**
   * ハンバーガーメニューのOn/Offをする関数
   */
  menuToggle: () => void;
  /**
   * ハンバーガーメニューの開閉状態
   */
  openMenu: boolean;
};

/**
 * タブレットより小さい画面で表示するハンバーガーメニュー
 *
 * ※ ボタン確認は画面を小さくする必要あり
 */
export const MobileHamburgerMenu = React.memo(({ menuToggle, openMenu }: Props) => {
  const HamburgerMenuButton = (
    <button
      className='absolute right-0 top-0 flex-initial text-rod-yellow-300 hover:text-gray-500 focus:outline-none md:hidden'
      aria-label='sp hamburger menu'
      onClick={menuToggle}
    >
      <svg viewBox='0 0 24 24' className='h-10 w-10 fill-current'>
        <path
          fillRule='evenodd'
          d='M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z'
        ></path>
      </svg>
    </button>
  );

  return (
    <>
      {HamburgerMenuButton}
      {openMenu ? <HamburgerMenuList /> : undefined}
    </>
  );
});

if (process.env.NODE_ENV !== 'production') MobileHamburgerMenu.displayName = 'MobileHamburgerMenu';

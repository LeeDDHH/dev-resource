'use strict';

import React from 'react';

import { GiHamburgerMenu } from 'react-icons/gi';

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
      <GiHamburgerMenu className='h-10 w-10 fill-current' />
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

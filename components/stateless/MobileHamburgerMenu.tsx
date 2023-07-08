'use strict';

import React from 'react';

import HamburgerMenuList from '@/components/stateless/HamburgerMenuList';

type Props = {
  menuToggle: () => void;
  openMenu: boolean;
};

const MobileHamburgerMenu = React.memo(({ menuToggle, openMenu }: Props) => {
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
export default MobileHamburgerMenu;

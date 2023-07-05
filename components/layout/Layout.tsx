'use strict';

import React, { useMemo } from 'react';

import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaThList } from 'react-icons/fa';
import { HiHome } from 'react-icons/hi';

import HeadComponent from '@/components/HeadComponent';

const paths = [
  { pathName: '/', title: '検索ページ', component: <HiHome size='2rem' /> },
  { pathName: '/list', title: '閲覧ページ', component: <FaThList size='1.5rem' /> },
];

type Props = {
  itemsAmount: number;
  children: React.ReactNode;
};

const Layout = React.memo(({ itemsAmount, children }: Props) => {
  const router = useRouter();

  const linkList = useMemo(() => {
    const links = paths.map((path) => {
      return (
        <Link
          key={`link-${path.pathName}`}
          href={path.pathName}
          className={clsx(
            'flex text-gray-500',
            router.asPath === path.pathName ? 'text-rod-yellow-300' : 'text-gray-500 hover:text-rod-yellow-300'
          )}
          title={path.title}
        >
          {path.component}
        </Link>
      );
    });
    return <div className='ml-4 flex h-10 items-center'>{links}</div>;
  }, [router.asPath]);

  return (
    <div>
      <header>
        <HeadComponent />
        <div className='m-auto flex w-full justify-center'>
          <div className='ml-4 flex h-10 items-center'>
            開発や学習に役立つ
            <strong> {itemsAmount}</strong>
            個のリソース
          </div>
          {linkList}
        </div>
      </header>
      {children}
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') Layout.displayName = 'Layout';

export default Layout;

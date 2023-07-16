'use strict';

import React from 'react';

import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiFillTags } from 'react-icons/ai';
import { BsBookmarkFill } from 'react-icons/bs';
import { FaThList } from 'react-icons/fa';
import { HiHome } from 'react-icons/hi';

type Path = {
  pathName: string;
  title: string;
  name: string;
  component: React.JSX.Element;
};

const paths = [
  { pathName: '/', title: '検索ページ', name: '検索', component: <HiHome size={30} /> },
  { pathName: '/list', title: '閲覧ページ', name: '閲覧', component: <FaThList size={25} /> },
  { pathName: '/tags', title: 'タグページ', name: 'タグ', component: <AiFillTags size={30} /> },
  {
    pathName: '/bookmarks',
    title: 'ブックマークページ',
    name: 'ブックマーク',
    component: <BsBookmarkFill size={25} />,
  },
];

/**
 * navbar内で表示するためのリンク一覧
 */
export const LinkList = React.memo(() => {
  const router = useRouter();
  const linkItem = (path: Path) => {
    return (
      <Link
        href={path.pathName}
        className={clsx(
          'flex text-gray-500',
          router.asPath === path.pathName ? 'text-rod-yellow-300' : 'text-gray-500 hover:text-rod-yellow-300'
        )}
        title={path.title}
      >
        <div className='flex gap-2'>
          {path.component}
          <div className='hidden max-[767px]:flex max-[767px]:items-center'>{path.name}</div>
        </div>
      </Link>
    );
  };

  const links = paths.map((path) => {
    return (
      <li className='flex w-full justify-center' key={`link-${path.pathName}`}>
        {linkItem(path)}
      </li>
    );
  });
  return <>{links}</>;
});

if (process.env.NODE_ENV !== 'production') LinkList.displayName = 'LinkList';

/* eslint-disable @typescript-eslint/no-array-constructor */
'use strict';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { BsBookmarkFill, BsBookmark } from 'react-icons/bs';

import { useBookmarks } from '@/hooks/useLocalBookmarks';

import TagView from '@/components/parts/stateless/TagView';

import { Item } from '@/graphql/generated';


type Props = { item: Item };

const SingleItemView = React.memo(({ item }: Props) => {
  const { bookmarks, handleBookmarks } = useBookmarks();
  return (
    <li>
      <div className='rounded-xl bg-rod-ivory px-5 pb-5 pt-1 text-rod-stone-800'>
        <div className='mt-2 flex items-center justify-end'>
          {bookmarks.includes(item.id as number) ? (
            <BsBookmarkFill className='text-rod-red-500' onClick={() => handleBookmarks(item.id as number)} size={25} />
          ) : (
            <BsBookmark
              className='text-gray-400 hover:text-rod-red-500'
              onClick={() => handleBookmarks(item.id as number)}
              size={25}
            />
          )}
        </div>
        <Link href={item.url ?? ''} target='_blank' rel='noopener norefferer' className='block no-underline'>
          <span
            className='my-2 inline-block
          w-full truncate text-center
          text-2xl font-bold'
          >
            {(item.name ?? '').replace(/-/g, ' ')}
          </span>
          <div className='flex justify-center'>
            <Image
              src={`/images/${item.name}.png`}
              alt={item.name ?? ''}
              width={1130}
              height={600}
              loading={'lazy'}
              quality={1}
              style={{
                width: '100%',
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </div>
          <p className='my-3'>{item.description}</p>
        </Link>
        <TagView tag={item.tag ?? Array()} itemId={item.id ?? -1} />
      </div>
    </li>
  );
});

if (process.env.NODE_ENV !== 'production') SingleItemView.displayName = 'SingleItemView';
export default SingleItemView;

'use strict';

import React, { ComponentPropsWithoutRef } from 'react';

type Props = {
  tag: string;
  count?: number;
  onClick?: () => void;
} & ComponentPropsWithoutRef<'div'>;

const Tag = React.memo(({ tag, count, onClick }: Props) => {
  return (
    <div
      className='group mr-1 mt-1 inline-block cursor-pointer
          rounded-md border-2 border-solid border-rod-red-500 bg-rod-yellow-400
          px-3 text-neutral-900 last:mr-0 hover:border-rod-gray-500 hover:bg-rod-red-500 hover:text-neutral-100'
      onClick={onClick ?? undefined}
    >
      {tag}{' '}
      {count ? (
        <span className='rounded-md bg-rod-red-500 px-2 text-rod-yellow-400 group-hover:bg-rod-yellow-400 group-hover:text-neutral-900'>
          {count}
        </span>
      ) : null}
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') Tag.displayName = 'Tag';
export default Tag;

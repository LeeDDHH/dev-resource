'use strict';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import TagView from '@/components/TagView';

import { Item } from '@/graphql/generated';

import styles from '@/styles/SingleItemView.module.css';

type Props = { item: Item };

const SingleItemView = React.memo(({ item }: Props) => {
  return (
    <li className={styles.item}>
      <Link href={item.url ?? ''} target='_blank' rel='noopener norefferer'>
        <span>{(item.name ?? '').replace(/-/g, ' ')}</span>
        <div className={styles.centerImage}>
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
        <p>{item.description}</p>
        <TagView tag={item.tag ?? Array()} itemId={item.id ?? -1} />
      </Link>
    </li>
  );
});

if (process.env.NODE_ENV !== 'production') SingleItemView.displayName = 'SingleItemView';
export default SingleItemView;

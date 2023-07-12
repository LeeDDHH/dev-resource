'use strict';

import React, { useMemo } from 'react';

import { ListPage } from '@/components/screen/ListPage';
import type { NextPageWithLayout } from '@/pages/_app';

import { getLayout } from '@/lib/pages/defaultLayout';

const List: NextPageWithLayout = React.memo(() => {
  const renderView = useMemo(() => <ListPage />, []);
  return renderView;
});

List.getLayout = getLayout;

if (process.env.NODE_ENV !== 'production') List.displayName = 'List';
export default List;

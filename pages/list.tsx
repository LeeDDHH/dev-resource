'use strict';

import React, { useMemo } from 'react';

import { ListPage } from '@/components/screen/ListPage';

const List = React.memo(() => {
  const renderView = useMemo(() => <ListPage />, []);
  return renderView;
});

if (process.env.NODE_ENV !== 'production') List.displayName = 'List';
export default List;

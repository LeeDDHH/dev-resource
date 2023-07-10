'use strict';

import React from 'react';

import { IndexPage } from '@/components/screen/IndexPage';

const App = React.memo(() => {
  return <IndexPage />;
});

if (process.env.NODE_ENV !== 'production') App.displayName = 'App';
export default App;

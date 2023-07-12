'use strict';

import React from 'react';

import { IndexPage } from '@/components/screen/IndexPage';
import type { NextPageWithLayout } from '@/pages/_app';

import { getLayout } from '@/lib/pages/defaultLayout';

const Index: NextPageWithLayout = React.memo(() => <IndexPage />);

Index.getLayout = getLayout;

if (process.env.NODE_ENV !== 'production') Index.displayName = 'Index';
export default Index;

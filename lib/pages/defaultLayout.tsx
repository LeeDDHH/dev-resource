import { ReactElement } from 'react';

import Layout from '@/components/layout/Layout';

export const getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

import ky from 'ky';

import { env } from '@/lib/env/env';

const baseUrl = env.NEXT_PUBLIC_GRAPHQL_SERVER_URL;

export const apiList = {
  searchKeyword: `${baseUrl}/search-keyword`,
  searchList: `${baseUrl}/search-list`,
  bookmarkList: `${baseUrl}/bookmark-list`,
};

const api = ky;

export default api;

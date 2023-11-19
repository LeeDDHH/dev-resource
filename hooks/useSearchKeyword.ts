import { useInfiniteQuery } from '@tanstack/react-query';

import api, { apiList } from '@/lib/api';
import { searchLimit } from '@/lib/Const';

import { Resource } from '@/types/data';

const API_SEARCH_KEYWORD = 'searchKeyword';

const fetchSearchKeyword = async ({ searchKeyword = '', pageParam = 0 }) => {
  const limit = pageParam + searchLimit;
  const res = await api.post(apiList[API_SEARCH_KEYWORD], { json: { text: searchKeyword, limit, offset: pageParam } });
  return await res.json<Resource>();
};

const useSearchKeyword = (searchKeyword: string) =>
  useInfiniteQuery({
    queryKey: [API_SEARCH_KEYWORD, searchKeyword],
    queryFn: ({ pageParam = 0 }) => fetchSearchKeyword({ searchKeyword, pageParam }),
    initialPageParam: 0,
    getNextPageParam: (_, pages) => pages.length * searchLimit,
  });

export { useSearchKeyword };

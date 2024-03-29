import { useInfiniteQuery } from '@tanstack/react-query';

import api, { apiList } from '@/lib/api';
import { getPageOffset, nextLimit } from '@/lib/hooks';

import { Resource } from '@/types/data';

const API_SEARCH_KEYWORD = 'searchKeyword';

const fetchSearchKeyword = async ({ searchKeyword = '', pageParam = 0 }) => {
  const res = await api.post(apiList[API_SEARCH_KEYWORD], {
    json: { text: searchKeyword, limit: nextLimit(pageParam), offset: pageParam },
  });
  if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
  return await res.json<Resource>();
};

const useSearchKeyword = (searchKeyword: string) =>
  useInfiniteQuery({
    queryKey: [API_SEARCH_KEYWORD, searchKeyword],
    queryFn: ({ pageParam = 0 }) => fetchSearchKeyword({ searchKeyword, pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => getPageOffset(lastPage.length, pages.length),
  });

export { useSearchKeyword };

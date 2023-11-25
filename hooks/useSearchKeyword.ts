import { useInfiniteQuery } from '@tanstack/react-query';

import api, { apiList } from '@/lib/api';
import { hasNextOffset, nextLimit } from '@/lib/hooks';

import { Resource } from '@/types/data';

const API_SEARCH_KEYWORD = 'searchKeyword';

const fetchSearchKeyword = async ({ searchKeyword = '', pageParam = 0 }) => {
  try {
    const res = await api.post(apiList[API_SEARCH_KEYWORD], {
      json: { text: searchKeyword, limit: nextLimit(pageParam), offset: pageParam },
    });
    if (!res.ok) {
      console.log(`Fetch error: ${res.status}`);
      return [];
    }
    return await res.json<Resource>();
  } catch (error) {
    console.log(error);
    return [];
  }
};

const useSearchKeyword = (searchKeyword: string) =>
  useInfiniteQuery({
    queryKey: [API_SEARCH_KEYWORD, searchKeyword],
    queryFn: ({ pageParam = 0 }) => fetchSearchKeyword({ searchKeyword, pageParam }),
    initialPageParam: 0,
    getNextPageParam: (_, pages) => hasNextOffset(pages),
  });

export { useSearchKeyword };

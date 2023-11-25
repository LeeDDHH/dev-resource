import { useInfiniteQuery } from '@tanstack/react-query';

import api, { apiList } from '@/lib/api';
import { getPageOffset, nextLimit } from '@/lib/hooks';

import { Resource } from '@/types/data';

const API_SEARCH_LIST = 'searchList';

const fetchSearchList = async ({ pageParam = 0 }) => {
  const res = await api.post(apiList[API_SEARCH_LIST], { json: { limit: nextLimit(pageParam), offset: pageParam } });
  if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
  return await res.json<Resource>();
};

const useSearchList = () => {
  return useInfiniteQuery({
    queryKey: [API_SEARCH_LIST],
    queryFn: fetchSearchList,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => getPageOffset(lastPage.length, pages.length),
  });
};

export { useSearchList };

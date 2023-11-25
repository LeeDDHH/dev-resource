import { useInfiniteQuery } from '@tanstack/react-query';

import api, { apiList } from '@/lib/api';
import { hasNextOffset, nextLimit } from '@/lib/hooks';

import { Resource } from '@/types/data';

const API_SEARCH_LIST = 'searchList';

const fetchSearchList = async ({ pageParam = 0 }) => {
  try {
    const res = await api.post(apiList[API_SEARCH_LIST], { json: { limit: nextLimit(pageParam), offset: pageParam } });
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

const useSearchList = () => {
  return useInfiniteQuery({
    queryKey: [API_SEARCH_LIST],
    queryFn: fetchSearchList,
    initialPageParam: 0,
    getNextPageParam: (_, pages) => hasNextOffset(pages),
  });
};

export { useSearchList };

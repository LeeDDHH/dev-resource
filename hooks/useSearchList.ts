import { useInfiniteQuery } from '@tanstack/react-query';

import api, { apiList } from '@/lib/api';
import { searchLimit } from '@/lib/Const';

import { Resource } from '@/types/data';

const API_SEARCH_LIST = 'searchList';

const fetchSearchList = async ({ pageParam = 0 }) => {
  const limit = pageParam + searchLimit;
  const res = await api.post(apiList[API_SEARCH_LIST], { json: { limit, offset: pageParam } });
  return await res.json<Resource>();
};

const useSearchList = () => {
  return useInfiniteQuery({
    queryKey: [API_SEARCH_LIST],
    queryFn: fetchSearchList,
    initialPageParam: 0,
    getNextPageParam: (_, pages) => pages.length * searchLimit,
  });
};

export { useSearchList };

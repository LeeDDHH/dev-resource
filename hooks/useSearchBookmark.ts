import { useInfiniteQuery } from '@tanstack/react-query';

import api, { apiList } from '@/lib/api';
import { searchLimit } from '@/lib/Const';

import { Resource } from '@/types/data';

const API_SEARCH_BOOKMARK_LIST = 'bookmarkList';

const fetchSearchBookmark = async ({
  bookmarkList = [],
  pageParam = 0,
}: {
  bookmarkList: number[];
  pageParam: number;
}) => {
  const limit = pageParam + searchLimit;
  const res = await api.post(apiList[API_SEARCH_BOOKMARK_LIST], {
    json: { bookmarkList, limit, offset: pageParam },
  });
  return await res.json<Resource>();
};

const useSearchBookmark = (bookmarkList: number[]) =>
  useInfiniteQuery({
    queryKey: [API_SEARCH_BOOKMARK_LIST, bookmarkList],
    queryFn: ({ pageParam = 0 }) => fetchSearchBookmark({ bookmarkList, pageParam }),
    initialPageParam: 0,
    getNextPageParam: (_, pages) => pages.length * searchLimit,
  });

export { useSearchBookmark };

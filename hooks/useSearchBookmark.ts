import { useInfiniteQuery } from '@tanstack/react-query';

import api, { apiList } from '@/lib/api';
import { getPageOffset, nextLimit } from '@/lib/hooks';

import { Resource } from '@/types/data';

const API_SEARCH_BOOKMARK_LIST = 'bookmarkList';

const fetchSearchBookmark = async ({
  bookmarkList = [],
  pageParam = 0,
}: {
  bookmarkList: number[];
  pageParam: number;
}) => {
  const res = await api.post(apiList[API_SEARCH_BOOKMARK_LIST], {
    json: { bookmarkList, limit: nextLimit(pageParam), offset: pageParam },
  });
  if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
  return await res.json<Resource>();
};

const useSearchBookmark = (bookmarkList: number[]) =>
  useInfiniteQuery({
    queryKey: [API_SEARCH_BOOKMARK_LIST, bookmarkList],
    queryFn: ({ pageParam = 0 }) => fetchSearchBookmark({ bookmarkList, pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => getPageOffset(lastPage.length, pages.length),
  });

export { useSearchBookmark };

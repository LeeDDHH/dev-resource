import { useState, useEffect, createContext, useContext, useMemo, useCallback } from 'react';

import { localStorageHooksInfo } from '@/lib/Const';

type ContextValue = {
  bookmarks: number[];
  handleBookmarks: (bookmarkId: number) => void;
};

const _LocalBookmarksContext = createContext({
  bookmarks: [] as number[],
  handleBookmarks: (bookmarkId: number) => {},
});

/**
 * @description お気に入り用のアイテムIDを管理するプロバイダー
 * @param children 子コンポーネント
 */
const LocalBookmarksProvider = ({ children }: { children: React.ReactNode }) => {
  /**
   * - localStorage から値を取得する
   * - 値が存在しない場合は defaultValue を使用する
   */
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    try {
      const storedValue = localStorage.getItem(localStorageHooksInfo.bookmarks.key);
      return storedValue ? JSON.parse(storedValue) : localStorageHooksInfo.bookmarks.defaultValue;
    } catch (error) {
      console.error('Error retrieving value from localStorage:', error);
      return localStorageHooksInfo.bookmarks.defaultValue;
    }
  });

  // localStorage 値が変更されるたびに更新する
  useEffect(() => {
    try {
      localStorage.setItem(localStorageHooksInfo.bookmarks.key, JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Error storing value in localStorage:', error);
    }
  }, [bookmarks]);

  // お気に入りのアイテムのIDをトグルする
  const handleBookmarks = useCallback(
    (bookmarkId: number) => {
      if (bookmarks.includes(bookmarkId)) {
        setBookmarks(() => bookmarks.filter((id) => id !== bookmarkId));
      } else {
        setBookmarks(() => [...bookmarks, bookmarkId]);
      }
    },
    [bookmarks]
  );

  const value: ContextValue = useMemo(
    () => ({
      bookmarks,
      handleBookmarks,
    }),
    [bookmarks, handleBookmarks]
  );
  return <_LocalBookmarksContext.Provider value={value}>{children}</_LocalBookmarksContext.Provider>;
};

const useBookmarks = () => useContext(_LocalBookmarksContext);

export { LocalBookmarksProvider, useBookmarks };

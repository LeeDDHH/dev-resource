import { localStorageHooksInfo } from '@/lib/Const';

import { useLocalStorage } from './useLocalStorage';

export const useLocalBookmarks = () => {
  const [storedValue, setValue] = useLocalStorage<number[]>(
    localStorageHooksInfo.bookmarks.key,
    localStorageHooksInfo.bookmarks.defaultValue
  );

  const handleBookmarks = (bookmarkId: number) => {
    const newBookmarks = [...storedValue];
    if (storedValue.includes(bookmarkId)) {
      const newValue = newBookmarks.filter((id) => id !== bookmarkId);
      setValue(newValue);
    } else {
      const newValue = [...newBookmarks, bookmarkId];
      setValue(newValue);
    }
  };
  return { bookmarks: storedValue, handleBookmarks };
};

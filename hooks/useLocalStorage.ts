import { useEffect, useState } from 'react';

// Read: https://usehooks.com/useLocalStorage/
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // 指定したキーを使って、localStorageで扱う値を遅延初期化する
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // localStorageから値を取得
      const item = window.localStorage.getItem(key);
      // 値が存在したら、文字列化して保存する
      // なければ、初期化の値を返す
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // エラーの場合でも初期化の値を返す
      console.log(error);
      return initialValue;
    }
  });

  // 関数化した値、あるいは値自体がきてもlocalStorageに保存できるようにset用の関数を作る
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ブラウザのタブ同士でlocalStorageを同期する
  useEffect(() => {
    const listener = (e: StorageEvent) => {
      if (e.key === key && !!e.newValue) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', listener);
    return () => {
      window.removeEventListener('storage', listener);
    };
  }, [key, initialValue]);
  return [storedValue, setValue] as const;
};

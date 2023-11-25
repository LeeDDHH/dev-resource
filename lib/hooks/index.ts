import { searchLimit } from '@/lib/Const';

/**
 * 最後に取得したデータの長さが一度に取得する最大アイテム数と同じなら、次に取得するアイテムがあるとみなす
 * 次に取得するアイテムがある場合、次に取得するアイテム数を返す
 */
export const hasNextOffset = <T extends unknown[]>(pages: T[]) => {
  const hasNextPage = pages[pages.length - 1].length === searchLimit;
  return hasNextPage ? pages.length * searchLimit : undefined;
};

/** 次に取得するアイテムの最大インデックス数 */
export const nextLimit = (pageParam: number) => pageParam + searchLimit;

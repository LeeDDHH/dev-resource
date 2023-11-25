import { searchLimit } from '@/lib/Const';

/**
 * 最後に取得したデータの長さが一度に取得する最大アイテム数と同じなら、次に取得するアイテムがあるとみなす
 */
const hasNextOffset = (lastPage: number) => lastPage === searchLimit;

/**
 * 次に取得するアイテムがある場合、現在のページを取得するためのオフセットを返す
 * なければ、undefinedを返す
 * @param lastPageLength 最後に取得したデータの長さ
 * @param pagesLength 現在のページ数
 */
export const getPageOffset = (lastPageLength: number, pagesLength: number) => {
  const hasNextPage = hasNextOffset(lastPageLength);
  return hasNextPage ? pagesLength * searchLimit : undefined;
};

/** 次に取得するアイテムの最大インデックス数 */
export const nextLimit = (pageParam: number) => pageParam + searchLimit;

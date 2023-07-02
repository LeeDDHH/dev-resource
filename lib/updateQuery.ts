// https://maku.blog/p/r7fou3a/
// https://scrapbox.io/panda-program/Next.js%E3%81%A7URL%E3%82%92%E6%9B%B8%E3%81%8D%E6%8F%9B%E3%81%88%E3%82%8B
// https://nextjs.org/docs/pages/api-reference/functions/use-router
import { ParsedUrlQueryInput } from 'querystring';

import NextRouter from 'next/router';

type Props = {
  query: { [key: string]: string | number };
  url?: string;
  isPageStack?: boolean;
};

/**
 * URL のクエリパラメーター部分を更新する
 *
 * 使用例: updateQuery({ query: {key1: "value1", key2: "value2"}, url: '/', isPageStack: true })
 */
export const updateQuery = ({ query, url = '/', isPageStack = true }: Props) => {
  // 既存のクエリパラメーターとマージ
  const newQuery: ParsedUrlQueryInput = { ...NextRouter.query, ...query };
  if (isPageStack) {
    void NextRouter.push({ pathname: url, query: newQuery });
  } else {
    void NextRouter.replace({ pathname: url, query: newQuery });
  }
};

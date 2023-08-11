'use strict';

import db from '@/data/db.json';

import {
  isSearchKeywordIncludedToName,
  isSearchKeywordIncludedToDescription,
  isSearchKeywordIncludedToTags,
} from '@/lib/apollo/resolverUtils';
import { splitStringFromSpace } from '@/lib/utils';

export const resolvers = {
  Query: {
    items: () => db.resource,
    // eslint-disable-next-line @typescript-eslint/require-await
    search: async (_: object, { text, limit, offset }: { text: string; limit: number; offset: number }) => {
      const splitedString = splitStringFromSpace(text);
      /**
       * 検索する範囲を広げて検索
       * 検索するキーワードがコンテンツの名前・説明・キーワードのどれかに当てはまるものを返す
       */
      return db.resource
        .filter(
          (source) =>
            isSearchKeywordIncludedToName(splitedString, source.name) ||
            isSearchKeywordIncludedToDescription(splitedString, source.description) ||
            isSearchKeywordIncludedToTags(splitedString, source.tag)
        )
        .slice(offset, limit);
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    searchWithOffsetAndLimit: async (_parent: object, args: { limit: number; offset: number }) => {
      if (args.limit) {
        const start = args.offset;
        const end = args.limit;
        return [...db.resource].slice(start, end);
      } else {
        return [...db.resource];
      }
    },
    bookmarkWithOffsetAndLimit: async (
      _parent: object,
      args: { bookmarkList: number[]; limit: number; offset: number }
      // eslint-disable-next-line @typescript-eslint/require-await
    ) => {
      const newResource = [...db.resource];
      const dataMaxIndex = newResource.length - 1;
      const bookmarks = args.bookmarkList.map((boookmarkIndex: number) => newResource[dataMaxIndex - boookmarkIndex]);
      if (args.limit && args.bookmarkList.length > 0) {
        const start = args.offset;
        const end = args.limit;
        return bookmarks.slice(start, end);
      } else {
        return bookmarks;
      }
    },
    // NOTE: 検索する範囲を絞って検索パターンも作る
  },
};

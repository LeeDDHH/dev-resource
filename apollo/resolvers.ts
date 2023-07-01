'use strict';

import {
  isSearchKeywordIncludedToName,
  isSearchKeywordIncludedToDescription,
  isSearchKeywordIncludedToTags,
} from '@/lib/resolverUtils';
import { splitStringFromSpace } from '@/lib/utils';

import db from '../data/db.json';

export const resolvers = {
  Query: {
    items: () => db.resource,
    search: (_: any, { text }: { text: string }) => {
      const splitedString = splitStringFromSpace(text);
      /**
       * 検索する範囲を広げて検索
       * 検索するキーワードがコンテンツの名前・説明・キーワードのどれかに当てはまるものを返す
       */
      return db.resource.filter(
        (source) =>
          isSearchKeywordIncludedToName(splitedString, source.name) ||
          isSearchKeywordIncludedToDescription(splitedString, source.description) ||
          isSearchKeywordIncludedToTags(splitedString, source.tag)
      );
    },
    searchWithOffsetAndLimit: async (
      _parent: any,
      args: { limit: number; offset: number },
      _context: any,
      _info: any
    ) => {
      if (args.limit) {
        const start = args.offset;
        const end = args.limit;
        return [...db.resource].slice(start, end);
      } else {
        return [...db.resource];
      }
    },
    // NOTE: 検索する範囲を絞って検索パターンも作る
  },
};

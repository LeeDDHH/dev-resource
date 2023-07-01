'use strict';

import {
  isSearchKeywordIncludedToName,
  isSearchKeywordIncludedToDescription,
  isSearchKeywordIncludedToTags,
} from '@/lib/resolverUtils';
import { splitStringFromSpace } from '@/lib/utils';

import db from '../lib/db.json';

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
    // NOTE: 検索する範囲を絞って検索パターンも作る
  },
};

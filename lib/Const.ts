'use strict';

import path from 'path';

export const GA_TRACKING_ID = process.env.GA_TRACKING_ID;
export const NODE_ENV = process.env.NODE_ENV;

const dirPath = path.dirname(__filename);
const dataPath = path.resolve(dirPath, '../data');
export const dataTxtPath = path.resolve(dataPath, 'data.txt');
export const originDataJsonPath = path.resolve(dataPath, 'db_origin.json');
export const addedOriginDataJsonPath = path.resolve(dataPath, 'db_origin_added.json');
export const dbJsonPath = path.resolve(dataPath, 'db.json');
export const dbTmpJsonPath = path.resolve(dataPath, 'db_tmp.json');
export const dbTagsJsonPath = path.resolve(dataPath, 'db_tags.json');
export const tagCountDataJsonPath = path.resolve(dataPath, 'db_tagCount.json');

// 一度に最大で取得するアイテム数
export const searchLimit = 12;

export const localStorageHooksInfo = {
  bookmarks: { key: 'v1:bookmarks', defaultValue: [] },
};

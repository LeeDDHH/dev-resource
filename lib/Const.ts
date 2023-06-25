'use strict';

import path from 'path';

export const GA_TRACKING_ID = process.env.GA_TRACKING_ID;
export const NODE_ENV = process.env.NODE_ENV;

export const dirPath = path.dirname(__filename);
export const dataTxtPath = path.resolve(dirPath, 'data.txt');
export const originDataJsonPath = path.resolve(dirPath, 'db_origin.json');
export const addedOriginDataJsonPath = path.resolve(dirPath, 'db_origin_added.json');
export const dbJsonPath = path.resolve(dirPath, 'db.json');
export const dbTmpJsonPath = path.resolve(dirPath, 'db_tmp.json');

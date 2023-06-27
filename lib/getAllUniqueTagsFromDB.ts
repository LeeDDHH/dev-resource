import { ResourceData } from '../types/data';

import { originDataJsonPath, dbTagsJsonPath } from './Const';
import { writeFileSync, readFileSync } from './utils';

// 完全一致にひっかかるとタグのノイズになりそうな単語
const removeWardList = ['C', 'フィルター'];

const data = JSON.parse(readFileSync(originDataJsonPath));

const exsitingAllTags: string[] = data.resource
  .map((v: ResourceData) => {
    return v.tag;
  })
  .flat();

const exsitingUniqueTags: string[] = [...new Set(exsitingAllTags)]
  .filter((tag) => !removeWardList.includes(tag))
  .sort();

const newJsonData = JSON.stringify(exsitingUniqueTags);

writeFileSync({ exportDataJsonPath: dbTagsJsonPath, jsonData: newJsonData });

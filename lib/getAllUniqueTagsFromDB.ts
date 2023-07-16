import { originDataJsonPath, dbTagsJsonPath } from '@/lib/Const';
import { writeFileSync, readFileSync } from '@/lib/utils';

import { ResourceData, ResourceDataFromDB } from '@/types/data';

// 完全一致にひっかかるとタグのノイズになりそうな単語
const removeWardList = ['C', 'CS', 'Go', 'フィルター', '本'];

const data = JSON.parse(readFileSync(originDataJsonPath)) as ResourceDataFromDB;

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

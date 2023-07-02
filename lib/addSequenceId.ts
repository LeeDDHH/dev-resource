import { dbJsonPath, originDataJsonPath, dbTmpJsonPath } from '@/lib/Const';
import { jsonFileExchange, readFileSync } from '@/lib/utils';

import { ResourceData, SequenceResourceData } from '@/types/data';

let newDBObj: { resource: SequenceResourceData[] } = { resource: [] };

const data = JSON.parse(readFileSync(originDataJsonPath));

const sequenceIdData: SequenceResourceData[] = data.resource.map((v: ResourceData, i: number) => ({ ...v, id: i }));

newDBObj.resource = sequenceIdData;

const newJsonData = JSON.stringify(newDBObj);

jsonFileExchange({
  exportDataJsonPath: dbTmpJsonPath,
  originDataJsonPath: dbJsonPath,
  jsonData: newJsonData,
});

import { ResourceData, SequenceResourceData } from '../types/data';

import { dbJsonPath, originDataJsonPath, dbTmpJsonPath } from './Const';
import { jsonFileExchange, readFileSync } from './utils';

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

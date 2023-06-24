import fs from 'fs';
import path from 'path';

const dirPath = path.dirname(__filename);
const dataJsonPath = path.resolve(dirPath, 'db_origin.json');
const exportDataJsonPath = path.resolve(dirPath, 'db.json');
let newDBObj: { resource: SequenceResourceData[] } = { resource: [] };

type ResourceData = {
  name: string;
  url: string;
  description: string;
  tag: string[];
};

type SequenceResourceData = {
  name: string;
  url: string;
  description: string;
  tag: string[];
  id: number;
};

const data = JSON.parse(fs.readFileSync(dataJsonPath, 'utf8'));

const sequenceIdData: SequenceResourceData[] = data.resource.map((v: ResourceData, i: number) => ({ ...v, id: i }));

newDBObj.resource = sequenceIdData;

const newJsonData = JSON.stringify(newDBObj);

fs.writeFile(exportDataJsonPath, newJsonData, (err) => {
  if (err) {
    console.error('書き込みエラー:', err);
    return;
  }
  console.log('ファイルが正常に書き出されました。');
});

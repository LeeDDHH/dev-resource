import { builder, IpadicFeatures, Tokenizer, TokenizerBuilder } from 'kuromoji';

/**
 * @description 辞書データを読み込んだ日本語形態素解析モジュールを返す
 */
const defaultBuilder: TokenizerBuilder<IpadicFeatures> = builder({ dicPath: 'node_modules/kuromoji/dict' });

/**
 * @description 文章を単語（＝トークン）に分解する非同期関数を返す
 * @return {Promise<Tokenizer<IpadicFeatures>>} A promise that resolves to a tokenizer object.
 */
const getTokenizer = (): Promise<Tokenizer<IpadicFeatures>> => {
  return new Promise((resolve, reject) => {
    defaultBuilder.build((err, tokenizer) => {
      if (err) {
        reject(err);
      }
      resolve(tokenizer);
    });
  });
};

/**
 * @description 指定した文章を形態素解析して、ユニークな名詞・固有名詞の配列を返す
 * @param {string} text - 形態素解析する文章
 * @return {Promise<string[]>} - 文章の中のユニークな名詞・固有名詞の配列もしくは空の配列
 */
export const morphologicalAnalysisByNoun = async (text: string): Promise<string[]> => {
  const tokenizer = await getTokenizer();
  const tokenResult = tokenizer.tokenize(text);
  const nounList = tokenResult
    .filter((token) => token.pos === '名詞' && (token.pos_detail_1 === '一般' || token.pos_detail_1 === '固有名詞'))
    .map((token) => token.surface_form.toLocaleLowerCase());
  const setNounList = new Set(nounList);
  return setNounList.size > 0 ? [...setNounList] : [];
};

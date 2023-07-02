'use strict';

/**
 * 検索するキーワードにコンテンツの名前が含まれていることを判定する
 * @param {string[]} keywords キーワード
 * @param {string} name コンテンツの名前
 * @returns {boolean}
 */
export const isSearchKeywordIncludedToName = (keywords: string[], name: string) => {
  const splitedName = name.split('-');
  return (
    [...keywords, ...splitedName].filter((item) => keywords.includes(item) && splitedName.includes(item)).length > 0
  );
};

/**
 * 検索するキーワードにコンテンツの説明が含まれていることを判定する
 * @param {string[]} keywords キーワード
 * @param {string} description コンテンツの説明
 * @returns {boolean}
 */
export const isSearchKeywordIncludedToDescription = (keywords: string[], description: string): boolean => {
  const searchDescription = description.toLowerCase();
  return keywords.some((keyword) => searchDescription.includes(keyword));
};

/**
 * 検索するキーワードにコンテンツのタグが含まれていることを判定する
 * @param {string[]} keywords キーワード
 * @param {string} tags タグ
 * @returns {boolean}
 */
export const isSearchKeywordIncludedToTags = (keywords: string[], tags: string[]) => {
  const lowerCasedTags = tags.map((tag) => tag.toLocaleLowerCase());
  return (
    [...keywords, ...lowerCasedTags].filter((item) => keywords.includes(item) && lowerCasedTags.includes(item)).length >
    0
  );
};

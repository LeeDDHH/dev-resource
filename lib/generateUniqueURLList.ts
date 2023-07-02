// 既存のURL一覧に含まれていないURLのみを一覧にして返す
export const generateUniqueURLList = (originData: { url: string }[], urls: string[]) => {
  const urlList = new Set(originData.map((data) => data.url));
  const newUrlList = urls.map((url) => (urlList.has(url) ? undefined : url));
  const uniqueUrlList = newUrlList.filter((url): url is string => typeof url == 'string');
  return uniqueUrlList;
};

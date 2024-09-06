// イメージのURLを引数に受け取り、URLを変換して返す

type ConvertImageUrlProps = {
  imageUrl: string;
  imageFileName: string;
};

type ConvertNecessaryType = {
  sourceType: string;
};

type ConvertUrlProps = {
  imageFileName: string;
  url: URL;
  sourceType: string;
};

const generatePublicImagePath = (imageFileName: string) => {
  return `/images/webp/${imageFileName}.webp`;
};

const generateYoutubeThumbnailUrl = (videoId: string) => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

const convertPublicImagePath = (imageFileName: string) => {
  if (!imageFileName.length) return '';
  const publicImagePath = generatePublicImagePath(imageFileName);
  return publicImagePath;
};

const isYoutubeSource = (source: URL): ConvertNecessaryType => {
  const isTargetSource = /youtube.com/.test(source.hostname);
  return {
    sourceType: isTargetSource ? 'youtube' : '',
  };
};

const isNeedToConvert = (source: URL): ConvertNecessaryType => {
  const results: ConvertNecessaryType[] = [isYoutubeSource(source)];
  const result = results.filter((result) => result.sourceType !== '');

  if (result.length === 0) return { sourceType: '' };

  return { sourceType: result[0].sourceType };
};

const convertYoutubeThumbnailUrl = (source: URL, imageFileName: string) => {
  const videoId = source.searchParams.get('v');

  if (!videoId) return convertPublicImagePath(imageFileName);

  const newUrl = generateYoutubeThumbnailUrl(videoId);
  return newUrl;
};

const convertUrl = ({ imageFileName, url, sourceType }: ConvertUrlProps) => {
  switch (sourceType) {
    case 'youtube':
      return convertYoutubeThumbnailUrl(url, imageFileName);
    default:
      return convertPublicImagePath(imageFileName);
  }
};

export const convertImageUrl = ({ imageUrl, imageFileName }: ConvertImageUrlProps) => {
  if (!imageUrl.length) return convertPublicImagePath(imageFileName);

  const url = new URL(imageUrl);
  const convertNecessaryResult = isNeedToConvert(url);

  if (!convertNecessaryResult.sourceType.length) return convertPublicImagePath(imageFileName);

  const convertedUrl = convertUrl({ imageFileName, url, sourceType: convertNecessaryResult.sourceType });
  return convertedUrl;
};

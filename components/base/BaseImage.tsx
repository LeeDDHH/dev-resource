import NextImage from 'next/image';
import { useState } from 'react';

import { generateBase64SVG } from '@/lib/generateBase64';

type ImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading: 'eager' | 'lazy';
  quality: number;
  style?: React.CSSProperties;
};

const defaultStyle = {
  width: '100%',
  maxWidth: '100%',
  height: 'auto',
};

// const skeleton = (w: number, h: number) => {
//   return `
//     <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
//       <defs>
//         <linearGradient id="g">
//           <stop stop-color="#d1d5db" offset="20%" />
//           <stop stop-color="#f3f4f6" offset="50%" />
//           <stop stop-color="#d1d5db" offset="70%" />
//         </linearGradient>
//       </defs>
//       <rect width="${w}" height="${h}" fill="#d1d5db" />
//       <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
//       <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite" />
//     </svg>`;
// };

// TODO: svgファイルとして読み込むように変更
const skeleton2 = () => {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="200" height="200" style="shape-rendering: auto; display: block; background: rgb(255, 255, 255);" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g transform="rotate(0 50 50)">
  <rect fill="#f5b70f" height="12" width="6" ry="6" rx="3" y="24" x="47">
    <animate repeatCount="indefinite" begin="-0.9166666666666666s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
  </rect>
</g><g transform="rotate(30 50 50)">
  <rect fill="#f5b70f" height="12" width="6" ry="6" rx="3" y="24" x="47">
    <animate repeatCount="indefinite" begin="-0.8333333333333334s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
  </rect>
</g><g transform="rotate(60 50 50)">
  <rect fill="#f5b70f" height="12" width="6" ry="6" rx="3" y="24" x="47">
    <animate repeatCount="indefinite" begin="-0.75s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
  </rect>
</g><g transform="rotate(90 50 50)">
  <rect fill="#f5b70f" height="12" width="6" ry="6" rx="3" y="24" x="47">
    <animate repeatCount="indefinite" begin="-0.6666666666666666s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
  </rect>
</g><g transform="rotate(120 50 50)">
  <rect fill="#f5b70f" height="12" width="6" ry="6" rx="3" y="24" x="47">
    <animate repeatCount="indefinite" begin="-0.5833333333333334s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
  </rect>
</g><g transform="rotate(150 50 50)">
  <rect fill="#f5b70f" height="12" width="6" ry="6" rx="3" y="24" x="47">
    <animate repeatCount="indefinite" begin="-0.5s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
  </rect>
</g><g transform="rotate(180 50 50)">
  <rect fill="#f5b70f" height="12" width="6" ry="6" rx="3" y="24" x="47">
    <animate repeatCount="indefinite" begin="-0.4166666666666667s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
  </rect>
</g><g transform="rotate(210 50 50)">
  <rect fill="#f5b70f" height="12" width="6" ry="6" rx="3" y="24" x="47">
    <animate repeatCount="indefinite" begin="-0.3333333333333333s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
  </rect>
</g><g transform="rotate(240 50 50)">
  <rect fill="#f5b70f" height="12" width="6" ry="6" rx="3" y="24" x="47">
    <animate repeatCount="indefinite" begin="-0.25s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
  </rect>
</g><g transform="rotate(270 50 50)">
  <rect fill="#f5b70f" height="12" width="6" ry="6" rx="3" y="24" x="47">
    <animate repeatCount="indefinite" begin="-0.16666666666666666s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
  </rect>
</g><g transform="rotate(300 50 50)">
  <rect fill="#f5b70f" height="12" width="6" ry="6" rx="3" y="24" x="47">
    <animate repeatCount="indefinite" begin="-0.08333333333333333s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
  </rect>
</g><g transform="rotate(330 50 50)">
  <rect fill="#f5b70f" height="12" width="6" ry="6" rx="3" y="24" x="47">
    <animate repeatCount="indefinite" begin="0s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
  </rect>
</g><g></g></g></svg>
  `;
};

/**
 * デフォルト画像のパスをランダムで生成
 * 0から8のランダムな数値を生成し、それを元にデフォルト画像のパスを生成する
 */
const generateRandomDefaultImagePath = () => {
  const random = Math.floor(Math.random() * 9);
  return `/images/defaultImages/default-image-${random}.webp`;
};

export const BaseImage = ({
  src,
  alt,
  width = 1130,
  height = 600,
  loading = 'lazy',
  quality = 1,
  style = defaultStyle,
}: ImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  // デフォルトスタイルとpropsで渡されたスタイルをマージ
  const imageStyle = { ...defaultStyle, ...style };

  // 画像の読み込み中に表示するプレースホルダー画像を生成
  const placeholderImage = generateBase64SVG(skeleton2());

  // 画像の読み込みに失敗した場合、デフォルト画像を表示する
  const handleLoadImageError = () => {
    setImgSrc(generateRandomDefaultImagePath());
  };

  return (
    <NextImage
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      quality={quality}
      style={imageStyle}
      placeholder={placeholderImage}
      onError={handleLoadImageError}
    />
  );
};

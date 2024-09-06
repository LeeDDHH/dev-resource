// SEE: node_modules/next/dist/shared/lib/get-img-props.d.ts#PlaceholderValue
type DataImageType = `data:image/${string}`;

const toBase64 = (str: string) => {
  if (typeof window === 'undefined') {
    return Buffer.from(str).toString('base64');
  } else {
    return window.btoa(str);
  }
};

export const generateBase64SVG = (source: string): DataImageType => {
  return `data:image/svg+xml;base64,${toBase64(source)}`;
};

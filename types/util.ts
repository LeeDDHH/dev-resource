export type MergeType<T> = {
  [K in keyof T]: T[K];
};

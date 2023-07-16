declare type SingleData = {
  id: number;
  name: string;
  url: string;
  description: string;
  tag: string[];
};

declare type Resource = SingleData[];

declare type ResourceDataFroDB = { resource: Resource }

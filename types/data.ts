export type ResourceData = {
  name: string;
  url: string;
  description: string;
  tag: string[];
};

export type JsonData = {
  resource: ResourceData[];
};

export type SequenceResourceData = {
  name: string;
  url: string;
  description: string;
  tag: string[];
  id: number;
};

export type SingleData = {
  id: number;
  name: string;
  url: string;
  description: string;
  tag: string[];
};

export type Resource = SingleData[];

export type ResourceDataFromDB = { resource: Resource };

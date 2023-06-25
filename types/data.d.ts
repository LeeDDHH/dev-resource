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

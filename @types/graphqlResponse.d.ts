declare type GetAllDataItem = SingleData;
declare type GetAllDataResult = {
  data: GetAllDataItem[] | undefined;
  loading: boolean;
  error: ApolloError | undefined;
};

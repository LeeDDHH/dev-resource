'use strict';

import React from 'react';

import { ApolloQueryResult } from '@apollo/client';
import { InView } from 'react-intersection-observer';

type OffsetAndLimitType = {
  variables: {
    offset: number;
    limit: number;
  };
};

type Props<T> = {
  data: T;
  searchLimit: number;
  fetchMore: (value: OffsetAndLimitType) => Promise<ApolloQueryResult<unknown>>;
};

export const IntersectionObserverView = <T,>({ data, searchLimit, fetchMore }: Props<T>) => {
  const moreFetch = async (inView: boolean) => {
    const currentLength = Array.isArray(data) ? data.length : 0;
    const offsetAndLimit = {
      variables: {
        offset: currentLength,
        limit: currentLength + searchLimit,
      },
    };
    if (inView) await fetchMore(offsetAndLimit);
  };

  return <InView onChange={async (inView) => await moreFetch(inView)} />;
};

'use strict';

// import { ApolloQueryResult } from '@apollo/client';
import React from 'react';
import { InView } from 'react-intersection-observer';

// type OffsetAndLimitType = {
//   variables: {
//     offset: number;
//     limit: number;
//   };
// };

type Props = {
  // data: T;
  // searchLimit: number;
  fetchMore: (inView: boolean) => Promise<void>;
};

export const IntersectionObserverView = ({ fetchMore }: Props) => {
  // const moreFetch = async (inView: boolean) => {
  //   const currentLength = Array.isArray(data) ? data.length : 0;
  //   const offsetAndLimit = {
  //     variables: {
  //       offset: currentLength,
  //       limit: currentLength + searchLimit,
  //     },
  //   };
  //   if (inView) await fetchMore(offsetAndLimit);
  // };

  return <InView onChange={(inView) => void fetchMore(inView)} />;

  // return <InView onChange={(inView) => void moreFetch(inView)} />;
};

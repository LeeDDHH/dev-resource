'use strict';

import React from 'react';
import { InView } from 'react-intersection-observer';

type Props = {
  fetchMore: (inView: boolean) => Promise<void>;
};

export const IntersectionObserverView = ({ fetchMore }: Props) => (
  <InView onChange={(inView) => void fetchMore(inView).catch(console.error)} />
);

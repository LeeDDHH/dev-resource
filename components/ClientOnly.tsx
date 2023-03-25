'use strict';

import React, { useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
  [x: string]: any;
};

export default function ClientOnly({ children, ...delegated }: Props) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <div {...delegated}>{children}</div>;
}

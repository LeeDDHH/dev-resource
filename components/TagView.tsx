"use strict";

import React from "react";

import styles from "../styles/TagView.module.css";

type Props = {
  tag: string[];
  itemId: number;
};

const TagView = React.memo(({ tag, itemId }: Props) => {
  return (
    <div>
      {tag &&
        tag.map((item) => (
          <div key={`${itemId}-${item}`} className={styles.tagBox}>
            {item}
          </div>
        ))}
    </div>
  );
});

TagView.displayName = "TagView";
export default TagView;

"use strict";

import React from "react";
import { BiSearchAlt2 } from "react-icons/bi";

import styles from "../styles/SearchBox.module.css";

type Props = {
  value: string;
  changeSearchText: SetStateActionDispatcher<string>;
};

const SearchBox = React.memo(({ value, changeSearchText }: Props) => {
  return (
    <div className={styles.searchBox}>
      <label htmlFor="searchText">
        <BiSearchAlt2 size="3rem" />
      </label>
      <input
        id="searchText"
        className={styles.searchInput}
        type="text"
        name="searchText"
        value={value}
        onChange={(e) => changeSearchText(e.target.value)}
      />
    </div>
  );
});

SearchBox.displayName = "SearchBox";
export default SearchBox;

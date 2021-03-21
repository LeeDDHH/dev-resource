import { BiSearchAlt2 } from 'react-icons/bi'

import styles from '../styles/SearchBox.module.css'

const SearchBox = ({ value, changeSearchText }) => {
  return (
    <div className={styles.searchBox}>
      <label htmlFor="searchText">
        <BiSearchAlt2 size="2rem" />
      </label>
      <input
        id="searchText"
        className={styles.searchInput}
        type="text"
        name="searchText"
        value={value}
        onChange={e => changeSearchText(e.target.value)}
      />
    </div>
  )
}

export default SearchBox

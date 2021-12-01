import { useState } from 'react'

import HeadComponent from '../components/HeadComponent'

import SearchBox from '../components/SearchBox'
import DefaultResult from '../components/DefaultResult'
import SearchedResult from '../components/SearchedResult'

import styles from '../styles/App.module.css'

const App = ({ itemsAmount }) => {
  const [searchText, setSearchText] = useState('')

  const renderView = () => {
    if (searchText.length > 0) {
      return <SearchedResult searchText={searchText}/>
    }
    if (searchText.length <= 0) {
      return <DefaultResult />
    }
  }

  return (
    <div>
      <header>
        <HeadComponent />
        <div className={styles.headerContainer}>
          <div className={styles.amount}>
            デザインゴリラたちのための
            <strong>{itemsAmount}</strong>
            個のリソース
          </div>
        </div>
      </header>
      <div className={styles.container}>
        <SearchBox
          value={searchText}
          changeSearchText={setSearchText}
        />
        {renderView()}
      </div>
    </div>
  )
}

export default App;

export const getStaticProps = async () => {
  const result = require('../lib/db.json').resource.length;

  return {
    props: {
      itemsAmount: result
    }
  }
}

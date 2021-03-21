import { useState } from 'react'

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
        <div className={styles.headerContainer}>
          <div className={styles.amount}>
            開発やプログラミング勉強で使えるリソースを
            <strong>{itemsAmount}</strong>
            個の中から探す
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

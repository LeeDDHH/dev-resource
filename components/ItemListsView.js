import styles from '../styles/ItemListsView.module.css'

import SingleItemView from './SingleItemView'

const ItemListsView = ({ items }) => {
  const generateItems = (items) => {
    return (
      items && items.map(item => (
        <SingleItemView key={item.id} item={item} />
      ))
    )
  }

  return (
    <ul className={styles.gridContainer}>
      {generateItems(items)}
    </ul>
  )
}

export default ItemListsView

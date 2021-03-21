import styles from '../styles/TagView.module.css'

const TagView = ({ tag, itemId }) => {
  return (
    <div>
      {
        tag && tag.map(item => (
          <div
            key={`${itemId}-${item}`}
            className={styles.tagBox}
          >
            {item}
          </div>
        ))
      }
    </div>
  )
}

export default TagView

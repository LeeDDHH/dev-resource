import Link from 'next/link'
import Image from 'next/image'

import TagView from './/TagView'

import styles from '../styles/SingleItemView.module.css'

const SingleItemView = ({ item }) => {
  return (
    <li className={styles.item}>
      <Link href={item.url}>
        <a target="_blank" rel="noopener norefferer">
          <span>{item.name.replace(/-/g, ' ')}</span>
            <div className={styles.centerImage}>
              <Image
                src={`/images/${item.name}.png`}
                alt={item.name}
                width={1130}
                height={600}
                loading={"lazy"}
                quality={1}
              />
            </div>
          <p>{item.description}</p>
          <TagView
            tag={item.tag}
            itemId={item.id}
          />
        </a>
      </Link>
    </li>
  )
}

export default SingleItemView

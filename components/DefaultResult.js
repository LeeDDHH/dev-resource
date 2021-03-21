import { useQuery } from '@apollo/client'
import { GET_ALL_DATA } from '../lib/clientQuery'

import ItemListsView from './ItemListsView'

const DefaultResult = () => {
  const { data, loading, error } = useQuery(GET_ALL_DATA);

  if (loading) {
    return <h2><div>Loading...</div></h2>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  const items = data.items;

  return (
    <ItemListsView items={items} />
  )
}

export default DefaultResult

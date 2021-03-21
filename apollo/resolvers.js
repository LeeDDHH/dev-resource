import db from '../lib/db.json'

export const resolvers = {
  Query: {
    items: () => db.resource,
    search: (parents, { text }) => db.resource.filter(source => source.name.includes(text) || source.description.includes(text) || source.tag.includes(text))
  }
}

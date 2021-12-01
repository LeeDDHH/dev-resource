import db from '../lib/db.json'

export const resolvers = {
  Query: {
    items: () => db.resource.reverse(),
    search: (parents, { text }) => db.resource.reverse().filter(source => source.name.includes(text) || source.description.includes(text) || source.tag.includes(text))
  }
}

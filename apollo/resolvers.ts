import db from "../lib/db.json";

export const resolvers = {
  Query: {
    items: () => db.resource,
    search: (parents: any, { text }: { text: string }) =>
      db.resource.filter(
        (source) =>
          source.name.includes(text) ||
          source.description.includes(text) ||
          source.tag.includes(text)
      ),
  },
};

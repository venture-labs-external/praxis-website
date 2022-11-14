import gql from 'graphql-tag';

export const typeDefs = gql`
  extend type Query {
    isAuthenticated: Boolean!
  }
  extend type Mutation {
    isAuthenticated(isAuthenticated: Boolean!): Boolean!
  }
`;

export const resolvers = {
  Mutation: {
    isAuthenticated: (_, { isAuthenticated }, { cache }) => {
      cache.writeData({
        data: {
          isAuthenticated,
        },
      });
      return isAuthenticated;
    },
  },
};

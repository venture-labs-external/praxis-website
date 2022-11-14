/* eslint-disable no-console */
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { resolvers, typeDefs } from '~/constants/graphql/resolvers';

export default () => {
  const cache = new InMemoryCache();
  try {
    // See above for additional options, including other storage providers.
    // See https://github.com/nuxt-community/apollo-module/issues/276 issue for more
    if (typeof window === 'object') {
      persistCache({
        cache,
        storage: window.localStorage,
      });
    }
  } catch (error) {
    console.error('Error restoring Apollo cache', error);
  }
  return {
    httpEndpoint: '/api/public',
    cache,
    typeDefs,
    resolvers,
  };
};

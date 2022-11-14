/* eslint-disable no-console */

export default ({
  graphQLErrors, networkError, operation, forward,
  // eslint-disable-next-line no-unused-vars
}, nuxtContext) => {
  console.log('Global error handler');
  console.log(graphQLErrors, networkError, operation, forward);
};

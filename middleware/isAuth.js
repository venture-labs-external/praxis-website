function isAuth({ app, error }) {
  const hasToken = !!app.$apolloHelpers.getToken();
  if (!hasToken) {
    error({ errorCode: 403, message: 'You are not allowed to see this' });
    // eslint-disable-next-line no-console
    console.log('You are not allowed to see this');
  }
}

export default isAuth;

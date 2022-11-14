import gql from 'graphql-tag';

export const UPDATE_IS_AUTHENTICATED = gql`
  mutation UpdateIsAuthenticated($isAuthenticated: Boolean!) {
    isAuthenticated(isAuthenticated: $isAuthenticated) @client
  }
`;

export const UPDATE_IS_AUTHENTICATED_EXAMPLE = gql`
  mutation UpdateIsAuthenticated($isAuthenticated: Boolean!) {
    isAuthenticated(isAuthenticated: $isAuthenticated) @client
  }
`;

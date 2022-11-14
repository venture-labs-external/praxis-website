import gql from 'graphql-tag';

export const IS_AUTHENTICATED = gql`
  query IsAuthenticated {
    isAuthenticated @client
  }
`;

export const IS_AUTHENTICATED_EXAMPLE = gql`
  query IsAuthenticated {
    isAuthenticated @client
  }
`;

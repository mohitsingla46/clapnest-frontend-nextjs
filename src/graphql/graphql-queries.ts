import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation signin($email: String!, $password: String!) {
    signin(input: {
      email: $email,
      password: $password
    })
  }
`;

export const GET_ROLES = gql`
  query {
    getRoles {
      id,
      name
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation signup($name: String!, $email: String!, $password: String!, $role: String!) {
    signup(input: {
      name: $name,
      email: $email,
      password: $password,
      role: $role,
    }) {
      name
      email
      password
      role {
        id,
        name
      }
    }
  }
`;

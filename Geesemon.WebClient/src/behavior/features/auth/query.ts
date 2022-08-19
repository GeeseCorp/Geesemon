import { gql } from "@apollo/client";

const USER_FRAGMENT = gql`
  fragment userFragment on UserType {
    id
    lastName
    firstName
    login
    email
    description
    phoneNumber
    createdAt
    updatedAt
    dateOfBirth
    role
  }
`;

export const meQuery = gql`
  query MeQuery {
    auth {
      me {
        user {
          ...userFragment
        }
        token
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const loginQuery = gql`
  mutation LoginQuery($input: LoginInputType!) {
    auth {
      login(input: $input) {
        user {
          ...userFragment
        }
        token
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const registerQuery = gql`
  mutation RegisterQuery($input: RegisterInputType!) {
    auth {
      register(input: $input) {
        user {
          ...userFragment
        }
        token
      }
    }
  }
  ${USER_FRAGMENT}
`;

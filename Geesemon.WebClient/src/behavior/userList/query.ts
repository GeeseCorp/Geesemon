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

export const GetAllUsersQuery = gql`
  query {
    user {
      getAll {
        id
        firstName
        lastName
      }
    }
  }
`;

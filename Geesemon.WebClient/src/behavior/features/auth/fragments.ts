import {gql} from "@apollo/client";

export const USER_FRAGMENT = gql`
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
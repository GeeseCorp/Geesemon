import { gql } from '@apollo/client';

export const USER_FRAGMENT = gql`
  fragment UserFragment on UserType {
    id
    lastName
    firstName
    fullName
    identifier
    email
    description
    phoneNumber
    dateOfBirth
    role
    imageUrl
    avatarColor
    lastTimeOnline
    isOnline
    createdAt
    updatedAt
  }
`;

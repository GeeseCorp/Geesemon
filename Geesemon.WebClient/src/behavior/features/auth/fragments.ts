import { gql } from '@apollo/client';

export const SESSION_FRAGMENT = gql`
  fragment SessionFragment on SessionType {
    id
    isOnline
    lastTimeOnline
    userAgent
    ipAddress
    location
    createdAt
    updatedAt
  }
`;

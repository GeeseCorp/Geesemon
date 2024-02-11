import { gql } from '@apollo/client';
import { USER_FRAGMENT } from './fragments';
import { User } from './types';

export type UsersGetData = { user: { get: User[] } };
export type UsersGetVars = { input: UserGetInputType };
export type UserGetInputType = {
  take: number;
  skip: number;
  query: string;
};
export const USERS_GET_QUERY = gql`
${USER_FRAGMENT}
    query UserGet($input: UserGetInputType!) {
        user {
            get(input: $input) {
                ...UserFragment
            }
        }
    }  
`;

export type UsersGetReadByData = { user: { getReadBy: User[] } };
export type UsersGetReadByVars = { messageId: string; take: number; skip: number };
export const USERS_GET_READ_BY_QUERY = gql`
${USER_FRAGMENT}
    query UserGetReadBy($messageId: Guid!, $skip: Int!, $take: Int) {
        user {
            getReadBy(messageId: $messageId, skip: $skip, take: $take) {
                ...UserFragment
            }
        }
    }
`;

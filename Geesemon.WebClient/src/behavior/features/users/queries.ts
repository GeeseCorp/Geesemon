import { gql } from "@apollo/client";
import { USER_FRAGMENT } from "./fragments";
import { User } from "./types";

export type UsersGetData = { user: { get: User[] } };
export type UsersGetVars = { input: UserGetInputType };
export type UserGetInputType = {
  take: number;
  skip: number;
  q: string;
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

import {gql} from "@apollo/client";
import {USER_FRAGMENT} from "../users/fragments";
import {AuthResponseType} from "./types";

export type AuthMeData = { auth: { me: AuthResponseType } }
export type AuthMeVars = {}
export const AUTH_ME_QUERY = gql`
    ${USER_FRAGMENT}
    query MeQuery {
        auth {
            me {
                user {
                    ...UserFragment
                }
                token
            }
        }
    }
`;


